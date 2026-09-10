import test from 'node:test';
import assert from 'node:assert/strict';
import {
  generatePersonalizedRecommendations,
  getRolePriorityScore,
  getProficiencyFitScore,
  getRecommendationReason,
  generateRecommendationReason,
  DEFAULT_RECOMMENDATION_CONFIG,
  extractWeakTopicsForCompetency,
} from './recommendationEngine';
import { DEMO_IGOT_COURSES } from './igotAdapter';
import { DEMO_NSSTA_PROGRAMMES } from './learningProviders';
import { DEFAULT_USER_PROFILE, DEFAULT_COMPETENCIES } from '../data/initialData';
import { getInitialBaselineAttempts } from './competencyEngine';
import { Competency, QuestionAttempt } from '../types';

/**
 * 1. HIGH GAP TEST
 * Verifies that a high gap (e.g., Python: 42% vs 75% -> 33 pt gap) produces
 * a high-priority recommendation containing all required fields.
 */
test('Recommendation Engine: High Gap produces prioritized recommendation with all required fields', () => {
  const attempts = getInitialBaselineAttempts();
  const output = generatePersonalizedRecommendations(
    DEFAULT_USER_PROFILE,
    DEFAULT_COMPETENCIES,
    DEMO_IGOT_COURSES,
    attempts,
    DEFAULT_RECOMMENDATION_CONFIG
  );

  const pythonRec = output.recommendations.find((r) => r.competencyName === 'Python');
  assert.ok(pythonRec, 'Must generate recommendation for Python (high gap)');

  // Required fields verification
  assert.ok(pythonRec.courseTitle.includes('Python for Statistical Data Analysis'), 'Course title must match course');
  assert.strictEqual(pythonRec.competencyName, 'Python', 'Target competency must be Python');
  assert.strictEqual(pythonRec.currentScore, 42, 'Current competency score must be 42');
  assert.strictEqual(pythonRec.targetScore, 75, 'Required competency target score must be 75');
  assert.strictEqual(pythonRec.gap, 33, 'Gap must be 33 points');
  assert.strictEqual(pythonRec.gapPercentagePoints, '33 points');
  assert.ok(pythonRec.priority === 'High' || pythonRec.priority === 'Critical', 'Priority must be High or Critical');
  assert.ok(pythonRec.reason.length > 0, 'Must include explainable reason');
  assert.ok(pythonRec.whyRecommended.includes('Python'), 'Must include concise whyRecommended');
  assert.ok(pythonRec.rankingScore !== undefined && pythonRec.rankingScore > 50, 'Ranking score must reflect high gap');
});

/**
 * 2. MODERATE GAP TEST
 * Verifies that a moderate gap (e.g., 15-20 pt gap) receives Medium priority.
 */
test('Recommendation Engine: Moderate Gap produces Medium priority recommendation', () => {
  const customCompetencies: Competency[] = [
    {
      id: 'stat-data-quality',
      name: 'Data Quality',
      domain: 'STATISTICAL',
      currentScore: 60,
      targetScore: 75,
      proficiencyLevel: 'Intermediate',
      description: 'Validation rules',
    },
  ];

  const output = generatePersonalizedRecommendations(
    DEFAULT_USER_PROFILE,
    customCompetencies,
    DEMO_IGOT_COURSES,
    [],
    DEFAULT_RECOMMENDATION_CONFIG
  );

  assert.ok(output.recommendations.length > 0, 'Should generate recommendation for moderate gap');
  const dqRec = output.recommendations[0];
  assert.strictEqual(dqRec.gap, 15);
  assert.strictEqual(dqRec.priority, 'Medium');
  assert.ok(dqRec.reason.includes('medium-priority gap of 15 points'));
});

/**
 * 3. NO MEANINGFUL GAP TEST
 * Verifies that competencies where currentScore >= targetScore or gap <= threshold
 * are excluded from recommendations and recorded in excludedStrongCompetencies.
 */
test('Recommendation Engine: Competencies with no meaningful gap are excluded with transparent audit (Rule 5)', () => {
  const attempts = getInitialBaselineAttempts();
  const output = generatePersonalizedRecommendations(
    DEFAULT_USER_PROFILE,
    DEFAULT_COMPETENCIES,
    DEMO_IGOT_COURSES,
    attempts,
    DEFAULT_RECOMMENDATION_CONFIG
  );

  // Survey Design has currentScore 84, targetScore 75 (gap = 0, Strong)
  // Sampling Methods has currentScore 78, targetScore 75 (gap = 0, Strong)
  const recCompetencyIds = output.recommendations.map((r) => r.competencyId);
  assert.ok(!recCompetencyIds.includes('stat-survey-design'), 'Survey Design must be excluded because learner is strong');
  assert.ok(!recCompetencyIds.includes('stat-sampling-methods'), 'Sampling Methods must be excluded because learner is strong');

  // Must be logged in excludedStrongCompetencies
  const excludedIds = output.excludedStrongCompetencies.map((e) => e.competencyId);
  assert.ok(excludedIds.includes('stat-survey-design'), 'Survey Design must be logged in excludedStrongCompetencies');
  assert.ok(excludedIds.includes('stat-sampling-methods'), 'Sampling Methods must be logged in excludedStrongCompetencies');

  const surveyDesignExcluded = output.excludedStrongCompetencies.find((e) => e.competencyId === 'stat-survey-design');
  assert.ok(surveyDesignExcluded?.reason.includes('excluded from recommendations because learner is already strong'));
});

/**
 * 4. MULTIPLE GAPS TEST
 * Verifies that when multiple competencies have gaps, all eligible ones generate recommendations
 * and are ranked non-ascendingly by rankingScore.
 */
test('Recommendation Engine: Multiple Gaps generate prioritized recommendations sorted by ranking score', () => {
  const attempts = getInitialBaselineAttempts();
  const allCourses = [...DEMO_IGOT_COURSES, ...DEMO_NSSTA_PROGRAMMES];
  const output = generatePersonalizedRecommendations(
    DEFAULT_USER_PROFILE,
    DEFAULT_COMPETENCIES,
    allCourses,
    attempts,
    DEFAULT_RECOMMENDATION_CONFIG
  );

  assert.ok(output.recommendations.length >= 2, 'Should recommend multiple resources across multiple gaps');

  // Verify non-ascending order of ranking scores
  for (let i = 0; i < output.recommendations.length - 1; i++) {
    const curr = output.recommendations[i].rankingScore ?? 0;
    const next = output.recommendations[i + 1].rankingScore ?? 0;
    assert.ok(curr >= next, `Ranking ordering violation at index ${i}: ${curr} should be >= ${next}`);
  }
});

/**
 * 5. ROLE RELEVANCE TEST
 * Verifies that role relevance directly affects the ranking score.
 */
test('Recommendation Engine: Role Relevance scores higher for designated job profile competencies', () => {
  const statOfficerRole = 'Statistical Officer';
  const pythonScore = getRolePriorityScore(statOfficerRole, 'tech-python');
  const genMgmtScore = getRolePriorityScore(statOfficerRole, 'gen-management');

  assert.ok(pythonScore.score > genMgmtScore.score, 'Statistical role must prioritize technical/statistical competencies higher than general management');
  assert.strictEqual(pythonScore.label, 'high-priority');
});

/**
 * 6. RANKING DETERMINISM TEST
 * Verifies that running recommendations twice with identical inputs yields identical scores and order.
 */
test('Recommendation Engine: Ranking Determinism guarantees identical scores and sequence across multiple runs', () => {
  const attempts = getInitialBaselineAttempts();
  const run1 = generatePersonalizedRecommendations(
    DEFAULT_USER_PROFILE,
    DEFAULT_COMPETENCIES,
    DEMO_IGOT_COURSES,
    attempts,
    DEFAULT_RECOMMENDATION_CONFIG
  );

  const run2 = generatePersonalizedRecommendations(
    DEFAULT_USER_PROFILE,
    DEFAULT_COMPETENCIES,
    DEMO_IGOT_COURSES,
    attempts,
    DEFAULT_RECOMMENDATION_CONFIG
  );

  assert.strictEqual(run1.recommendations.length, run2.recommendations.length);
  for (let i = 0; i < run1.recommendations.length; i++) {
    assert.strictEqual(run1.recommendations[i].id, run2.recommendations[i].id);
    assert.strictEqual(run1.recommendations[i].rankingScore, run2.recommendations[i].rankingScore);
    assert.strictEqual(run1.recommendations[i].courseTitle, run2.recommendations[i].courseTitle);
  }
});

/**
 * 7. CHANGED COMPETENCY SCORE TEST
 * Verifies that improving an officer's competency score dynamically adjusts gap, priority, or excludes the competency.
 */
test('Recommendation Engine: Changed Competency Score dynamically updates gap and excludes competency when mastered', () => {
  const attempts = getInitialBaselineAttempts();

  // Baseline: Python at 42% (gap 33)
  const baselineOutput = generatePersonalizedRecommendations(
    DEFAULT_USER_PROFILE,
    DEFAULT_COMPETENCIES,
    DEMO_IGOT_COURSES,
    attempts,
    DEFAULT_RECOMMENDATION_CONFIG
  );
  const baselinePython = baselineOutput.recommendations.find((r) => r.competencyName === 'Python');
  assert.ok(baselinePython && baselinePython.gap === 33);

  // Updated: Officer completed modules and improved Python score to 80% (exceeding target 75%)
  const updatedCompetencies = DEFAULT_COMPETENCIES.map((c) =>
    c.id === 'tech-python' ? { ...c, currentScore: 80 } : c
  );

  const updatedOutput = generatePersonalizedRecommendations(
    DEFAULT_USER_PROFILE,
    updatedCompetencies,
    DEMO_IGOT_COURSES,
    attempts,
    DEFAULT_RECOMMENDATION_CONFIG
  );

  const updatedPythonRec = updatedOutput.recommendations.find((r) => r.competencyName === 'Python');
  assert.strictEqual(updatedPythonRec, undefined, 'Python should no longer be recommended once mastered');

  const pythonExcluded = updatedOutput.excludedStrongCompetencies.find((e) => e.competencyId === 'tech-python');
  assert.ok(pythonExcluded, 'Python must now be listed in excludedStrongCompetencies');
  assert.strictEqual(pythonExcluded.currentScore, 80);
});

/**
 * 8. DUPLICATE PREVENTION TEST
 * Verifies that the recommendation list never contains duplicate resources.
 */
test('Recommendation Engine: Duplicate Prevention ensures unique learning resources in recommendations', () => {
  // Pass a catalog with deliberate duplicate entries
  const catalogWithDuplicates = [
    ...DEMO_IGOT_COURSES,
    DEMO_IGOT_COURSES[0], // Duplicate of first course
    DEMO_IGOT_COURSES[1], // Duplicate of second course
  ];

  const output = generatePersonalizedRecommendations(
    DEFAULT_USER_PROFILE,
    DEFAULT_COMPETENCIES,
    catalogWithDuplicates,
    [],
    DEFAULT_RECOMMENDATION_CONFIG
  );

  const seenIds = new Set<string>();
  for (const rec of output.recommendations) {
    assert.ok(!seenIds.has(rec.resourceId), `Duplicate resourceId found in recommendations: ${rec.resourceId}`);
    seenIds.add(rec.resourceId);
  }
});

/**
 * 9. PROTOTYPE PROVIDER LABELLING TEST
 * Verifies that all recommended resources are explicitly labeled as prototype demo data.
 */
test('Recommendation Engine: Prototype Provider Labelling flags demo data transparently', () => {
  const allCourses = [...DEMO_IGOT_COURSES, ...DEMO_NSSTA_PROGRAMMES];
  const output = generatePersonalizedRecommendations(
    DEFAULT_USER_PROFILE,
    DEFAULT_COMPETENCIES,
    allCourses,
    [],
    DEFAULT_RECOMMENDATION_CONFIG
  );

  assert.ok(output.recommendations.length > 0);
  for (const rec of output.recommendations) {
    assert.strictEqual(rec.isDemoData, true, 'Every recommendation must have isDemoData: true');
    assert.ok(
      rec.source.includes('Prototype') || rec.providerType === 'iGOT' || rec.providerType === 'NSSTA',
      'Source or providerType must indicate prototype adapter status'
    );
  }
});

/**
 * 10. RE-WEIGHTING CONFIGURATION TEST
 * Verifies that custom weights adjust ranking scores deterministically.
 */
test('Recommendation Engine: Configurable weights recompute scores deterministically', () => {
  const baselineOutput = generatePersonalizedRecommendations(
    DEFAULT_USER_PROFILE,
    DEFAULT_COMPETENCIES,
    DEMO_IGOT_COURSES,
    [],
    DEFAULT_RECOMMENDATION_CONFIG
  );

  const customConfig = {
    weights: {
      gapSeverityWeight: 0.10,
      rolePriorityWeight: 0.80,
      proficiencyFitWeight: 0.10,
    },
    strongThreshold: 10,
  };

  const reweightedOutput = generatePersonalizedRecommendations(
    DEFAULT_USER_PROFILE,
    DEFAULT_COMPETENCIES,
    DEMO_IGOT_COURSES,
    [],
    customConfig
  );

  const baseRec = baselineOutput.recommendations[0];
  const reweightedRec = reweightedOutput.recommendations.find((r) => r.id === baseRec.id);
  assert.ok(baseRec && reweightedRec);
  assert.notStrictEqual(baseRec.rankingScore, reweightedRec.rankingScore);
});
