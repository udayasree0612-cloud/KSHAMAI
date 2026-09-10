import test from 'node:test';
import assert from 'node:assert/strict';
import {
  igotAdapter,
  nsstaAdapter,
  learningProviderRegistry,
  DEMO_IGOT_COURSES,
  DEMO_NSSTA_PROGRAMMES,
  IGOT_PROVIDER_NAME,
  NSSTA_PROVIDER_NAME,
} from './learningProviders';
import {
  generatePersonalizedRecommendations,
  getRecommendations,
  getRecommendationsByProvider,
  DEFAULT_RECOMMENDATION_CONFIG,
} from './recommendationEngine';
import { DEFAULT_COMPETENCIES, DEFAULT_USER_PROFILE } from '../data/initialData';
import { Competency, LearningResource } from '../types';

const VALID_COMPETENCY_IDS = new Set(DEFAULT_COMPETENCIES.map((c) => c.id));

// ============================================================================
// STEP 11: iGOT + NSSTA INTEGRATION POLISH TEST SUITE (Section 17 Requirements)
// ============================================================================

// 1. iGOT provider returns valid resources
test('Step 11 Test 1: iGOT provider returns valid resources', async () => {
  const resources = await igotAdapter.getResources();
  assert.ok(resources.length > 0, 'iGOT provider should return courses');

  for (const resource of resources) {
    assert.ok(resource.id, 'Resource must have an ID');
    assert.ok(resource.title, 'Resource must have a title');
    assert.ok(resource.competencyId, 'Resource must have a competencyId');
    assert.ok(resource.competencyName, 'Resource must have a competencyName');
    assert.ok(resource.durationHours > 0, 'Resource duration must be positive');
    assert.ok(resource.modulesCount > 0, 'Resource modulesCount must be positive');
    assert.ok(['Foundational', 'Intermediate', 'Advanced'].includes(resource.level), 'Valid level');
    assert.strictEqual(resource.isDemoData, true, 'Resource must be flagged isDemoData');
    assert.strictEqual(resource.providerType, 'iGOT', 'Provider type must be iGOT');
  }
});

// 2. NSSTA provider returns valid resources
test('Step 11 Test 2: NSSTA provider returns valid resources', async () => {
  const programmes = await nsstaAdapter.getResources();
  assert.ok(programmes.length > 0, 'NSSTA provider should return programmes');

  for (const prog of programmes) {
    assert.ok(prog.id, 'Programme must have an ID');
    assert.ok(prog.title, 'Programme must have a title');
    assert.ok(prog.competencyId, 'Programme must have a competencyId');
    assert.ok(prog.competencyName, 'Programme must have a competencyName');
    assert.ok(prog.durationHours > 0, 'Duration must be positive');
    assert.ok(prog.deliveryType, 'Must specify deliveryType (e.g. Residential, Workshop)');
    assert.strictEqual(prog.isDemoData, true, 'Programme must be flagged isDemoData');
    assert.strictEqual(prog.providerType, 'NSSTA', 'Provider type must be NSSTA');
  }
});

// 3. Provider labels are correct
test('Step 11 Test 3: Provider labels are correct and reflect prototype/demo status', () => {
  const igotStatus = igotAdapter.getStatus();
  assert.strictEqual(igotStatus.mode, 'PROTOTYPE_ADAPTER');
  assert.strictEqual(igotStatus.label, 'iGOT Karmayogi — Prototype Adapter');
  assert.strictEqual(igotStatus.apiEndpointConfigured, false);
  assert.strictEqual(igotStatus.isDemoData, true);
  assert.ok(
    !igotStatus.label.includes('Live'),
    'Label must never claim live API'
  );

  const nsstaStatus = nsstaAdapter.getStatus();
  assert.strictEqual(nsstaStatus.mode, 'PROTOTYPE_ADAPTER');
  assert.strictEqual(nsstaStatus.label, 'NSSTA / TPAC — Prototype Data');
  assert.strictEqual(nsstaStatus.apiEndpointConfigured, false);
  assert.strictEqual(nsstaStatus.isDemoData, true);
});

// 4. Invalid competency mappings are validated and rejected
test('Step 11 Test 4: All prototype resources map strictly to valid framework competencies', () => {
  // All demo iGOT courses must map to genuine framework competencies
  for (const course of DEMO_IGOT_COURSES) {
    assert.ok(
      VALID_COMPETENCY_IDS.has(course.competencyId),
      `iGOT course ${course.id} maps to invalid competency ID: ${course.competencyId}`
    );
  }

  // All demo NSSTA programmes must map to genuine framework competencies
  for (const prog of DEMO_NSSTA_PROGRAMMES) {
    assert.ok(
      VALID_COMPETENCY_IDS.has(prog.competencyId),
      `NSSTA programme ${prog.id} maps to invalid competency ID: ${prog.competencyId}`
    );
  }

  // Unknown competency in user competencies does not match courses and does not crash
  const unknownCompetency: Competency = {
    id: 'unknown-fake-skill',
    name: 'Unknown Quantum Telepathy',
    domain: 'TECHNICAL',
    currentScore: 10,
    targetScore: 90,
    proficiencyLevel: 'Foundational',
    description: 'Fake competency',
  };

  const result = generatePersonalizedRecommendations(
    DEFAULT_USER_PROFILE,
    [unknownCompetency],
    [...DEMO_IGOT_COURSES, ...DEMO_NSSTA_PROGRAMMES],
    [],
    DEFAULT_RECOMMENDATION_CONFIG
  );

  // No course should be recommended for an unknown competency
  assert.strictEqual(result.recommendations.length, 0);
});

// 5. Duplicate resources are removed
test('Step 11 Test 5: Duplicate resources are strictly deduplicated', () => {
  const pythonComp = DEFAULT_COMPETENCIES.find((c) => c.id === 'tech-python')!;
  const pythonCourse = DEMO_IGOT_COURSES.find((c) => c.competencyId === 'tech-python')!;

  // Pass catalog with duplicate entries of the same course
  const dirtyCatalog = [pythonCourse, { ...pythonCourse }, { ...pythonCourse, id: pythonCourse.id }];

  const output = generatePersonalizedRecommendations(
    DEFAULT_USER_PROFILE,
    [pythonComp],
    dirtyCatalog,
    [],
    DEFAULT_RECOMMENDATION_CONFIG
  );

  const matchingRecs = output.recommendations.filter((r) => r.resourceId === pythonCourse.id);
  assert.strictEqual(matchingRecs.length, 1, 'Same resource ID must appear at most once');
});

// 6. iGOT filter works
test('Step 11 Test 6: iGOT filter returns only iGOT recommendations', async () => {
  const igotRecs = await getRecommendationsByProvider('igot', 'learner-001');
  assert.ok(igotRecs.length > 0, 'Should have iGOT recommendations');
  for (const rec of igotRecs) {
    assert.strictEqual(rec.providerType, 'iGOT', `Expected iGOT providerType, got ${rec.providerType}`);
    assert.ok(
      rec.source.toLowerCase().includes('igot'),
      `Expected iGOT in source: ${rec.source}`
    );
  }
});

// 7. NSSTA filter works
test('Step 11 Test 7: NSSTA filter returns only NSSTA recommendations', async () => {
  const nsstaRecs = await getRecommendationsByProvider('nssta', 'learner-001');
  assert.ok(nsstaRecs.length > 0, 'Should have NSSTA recommendations');
  for (const rec of nsstaRecs) {
    assert.strictEqual(rec.providerType, 'NSSTA', `Expected NSSTA providerType, got ${rec.providerType}`);
    assert.ok(
      rec.source.toLowerCase().includes('nssta'),
      `Expected NSSTA in source: ${rec.source}`
    );
  }
});

// 8. All filter works
test('Step 11 Test 8: All filter returns combined iGOT and NSSTA recommendations', async () => {
  const allOutput = await getRecommendations('learner-001', { provider: 'all' });
  const hasIgot = allOutput.recommendations.some((r) => r.providerType === 'iGOT');
  const hasNssta = allOutput.recommendations.some((r) => r.providerType === 'NSSTA');

  assert.ok(hasIgot, 'Combined recommendations must include iGOT resources');
  assert.ok(hasNssta, 'Combined recommendations must include NSSTA resources');
  assert.ok(
    allOutput.recommendations.length >= 2,
    'Combined recommendations must contain multiple provider options'
  );
});

// 9. Recommendation explanation uses actual gap data
test('Step 11 Test 9: Recommendation explanation strictly uses actual gap data and role', () => {
  const pythonComp: Competency = {
    id: 'tech-python',
    name: 'Python',
    domain: 'TECHNICAL',
    currentScore: 42,
    targetScore: 75,
    proficiencyLevel: 'Foundational',
    description: 'Python programming',
  };

  const output = generatePersonalizedRecommendations(
    { ...DEFAULT_USER_PROFILE, designation: 'Statistical Officer' },
    [pythonComp],
    [DEMO_IGOT_COURSES[0]],
    [],
    DEFAULT_RECOMMENDATION_CONFIG
  );

  assert.strictEqual(output.recommendations.length, 1);
  const rec = output.recommendations[0];

  assert.strictEqual(rec.currentScore, 42);
  assert.strictEqual(rec.targetScore, 75);
  assert.strictEqual(rec.gap, 33);
  assert.ok(
    rec.reason.includes('Python competency is 42/75'),
    `Reason must state 42/75, got: ${rec.reason}`
  );
  assert.ok(
    rec.reason.includes('gap of 33 points'),
    `Reason must state gap of 33 points, got: ${rec.reason}`
  );
  assert.ok(
    rec.reason.includes('Statistical Officer role'),
    `Reason must mention Statistical Officer role, got: ${rec.reason}`
  );
});

// 10. Provider does not alter deterministic ranking
test('Step 11 Test 10: Provider identity does not distort deterministic mathematical ranking', () => {
  const comp: Competency = {
    id: 'stat-data-quality',
    name: 'Data Quality',
    domain: 'STATISTICAL',
    currentScore: 48,
    targetScore: 80,
    proficiencyLevel: 'Intermediate',
    description: 'Data quality',
  };

  // Create two identical courses with identical levels, but different providers
  const igotCourse: LearningResource = {
    id: 'test-igot-dq',
    title: 'Data Quality iGOT',
    competencyId: 'stat-data-quality',
    competencyName: 'Data Quality',
    domain: 'STATISTICAL',
    description: 'DQ course',
    durationHours: 10,
    provider: IGOT_PROVIDER_NAME,
    providerType: 'iGOT',
    source: IGOT_PROVIDER_NAME,
    level: 'Intermediate',
    rating: 4.8,
    isDemoData: true,
    modulesCount: 4,
    enrolled: false,
    completed: false,
  };

  const nsstaCourse: LearningResource = {
    id: 'test-nssta-dq',
    title: 'Data Quality NSSTA',
    competencyId: 'stat-data-quality',
    competencyName: 'Data Quality',
    domain: 'STATISTICAL',
    description: 'DQ workshop',
    durationHours: 10,
    provider: NSSTA_PROVIDER_NAME,
    providerType: 'NSSTA',
    source: NSSTA_PROVIDER_NAME,
    level: 'Intermediate',
    rating: 4.8,
    isDemoData: true,
    modulesCount: 4,
    enrolled: false,
    completed: false,
  };

  const output = generatePersonalizedRecommendations(
    DEFAULT_USER_PROFILE,
    [comp],
    [igotCourse, nsstaCourse],
    [],
    DEFAULT_RECOMMENDATION_CONFIG
  );

  assert.strictEqual(output.recommendations.length, 2);
  // Both must receive the exact same mathematical ranking score because gap, role priority, and fit are identical
  const score1 = output.recommendations[0].rankingScore;
  const score2 = output.recommendations[1].rankingScore;
  assert.strictEqual(score1, score2, 'Scores should be identical regardless of provider');
});

// 11. Prototype resources are clearly labelled
test('Step 11 Test 11: Prototype resources are clearly labelled with isDemoData and prototype source', async () => {
  const allResources = await learningProviderRegistry.getAllResources();
  assert.ok(allResources.length > 0);

  for (const resource of allResources) {
    assert.strictEqual(
      resource.isDemoData,
      true,
      `Resource ${resource.id} must be flagged isDemoData: true`
    );
    assert.ok(
      resource.source.includes('Prototype') ||
      resource.provider.includes('Prototype') ||
      resource.providerLabel?.includes('Prototype'),
      `Resource ${resource.id} provider must include "Prototype"`
    );
    assert.ok(
      !resource.provider.includes('Live API'),
      `Resource ${resource.id} must not claim live API`
    );
  }
});
