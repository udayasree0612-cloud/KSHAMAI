import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createQuestionAttempt,
  calculateNormalizedCompetencyScore,
  calculateGap,
  classifyGap,
  calculateCompetencyPerformance,
  evaluateAllCompetencies,
  getInitialBaselineAttempts,
  DEFAULT_DIFFICULTY_WEIGHTS,
  DEFAULT_GAP_THRESHOLDS,
} from './competencyEngine';
import { Question } from '../types';

test('Competency Engine: Difficulty weighting respects Easy=1, Medium=1.5, Hard=2', () => {
  assert.strictEqual(DEFAULT_DIFFICULTY_WEIGHTS.Easy, 1.0);
  assert.strictEqual(DEFAULT_DIFFICULTY_WEIGHTS.Medium, 1.5);
  assert.strictEqual(DEFAULT_DIFFICULTY_WEIGHTS.Hard, 2.0);
});

test('Competency Engine: Stores competencyId, topic, difficulty, correctAnswer, user\'sAnswer, and correctness', () => {
  const sampleQuestion: Question = {
    id: 'q-test-01',
    question: 'What is pandas read_csv?',
    options: ['Function A', 'Function B', 'Function C', 'Function D'],
    correctAnswer: 1,
    competencyId: 'tech-python',
    topic: 'Pandas',
    difficulty: 'Medium',
    explanation: 'Reads CSV files into a DataFrame.',
  };

  // Correct answer attempt
  const attemptCorrect = createQuestionAttempt(sampleQuestion, 1);
  assert.strictEqual(attemptCorrect.competencyId, 'tech-python');
  assert.strictEqual(attemptCorrect.topic, 'Pandas');
  assert.strictEqual(attemptCorrect.difficulty, 'Medium');
  assert.strictEqual(attemptCorrect.correctAnswer, 1);
  assert.strictEqual(attemptCorrect.userAnswer, 1);
  assert.strictEqual(attemptCorrect["user'sAnswer"], 1);
  assert.strictEqual(attemptCorrect.correctness, true);

  // Incorrect answer attempt
  const attemptIncorrect = createQuestionAttempt(sampleQuestion, 3);
  assert.strictEqual(attemptIncorrect.competencyId, 'tech-python');
  assert.strictEqual(attemptIncorrect.topic, 'Pandas');
  assert.strictEqual(attemptIncorrect.difficulty, 'Medium');
  assert.strictEqual(attemptIncorrect.correctAnswer, 1);
  assert.strictEqual(attemptIncorrect.userAnswer, 3);
  assert.strictEqual(attemptIncorrect["user'sAnswer"], 3);
  assert.strictEqual(attemptIncorrect.correctness, false);
});

test('Competency Engine: Normalized score calculation from attempted questions using difficulty weights', () => {
  // 1 Easy correct (weight 1), 1 Medium correct (weight 1.5), 1 Hard incorrect (weight 2)
  // Earned = 1 + 1.5 = 2.5. Possible = 1 + 1.5 + 2 = 4.5.
  // 2.5 / 4.5 = 55.555% -> Math.round is 56%
  const attempts = [
    {
      questionId: 'q1',
      competencyId: 'tech-python',
      topic: 'Syntax',
      difficulty: 'Easy' as const,
      correctAnswer: 0,
      userAnswer: 0,
      "user'sAnswer": 0,
      correctness: true,
    },
    {
      questionId: 'q2',
      competencyId: 'tech-python',
      topic: 'NumPy',
      difficulty: 'Medium' as const,
      correctAnswer: 1,
      userAnswer: 1,
      "user'sAnswer": 1,
      correctness: true,
    },
    {
      questionId: 'q3',
      competencyId: 'tech-python',
      topic: 'Algorithms',
      difficulty: 'Hard' as const,
      correctAnswer: 2,
      userAnswer: 0,
      "user'sAnswer": 0,
      correctness: false,
    },
  ];

  const result = calculateNormalizedCompetencyScore(attempts);
  assert.strictEqual(result.earnedPoints, 2.5);
  assert.strictEqual(result.possiblePoints, 4.5);
  assert.strictEqual(result.normalizedScore, 56);
});

test('Competency Engine: Gap calculation gap = max(targetScore - currentScore, 0)', () => {
  // Target 75, Current 42 -> Gap 33
  assert.strictEqual(calculateGap(75, 42), 33);

  // Target 80, Current 80 -> Gap 0
  assert.strictEqual(calculateGap(80, 80), 0);

  // Target 70, Current 85 -> Gap 0 (never negative)
  assert.strictEqual(calculateGap(70, 85), 0);

  // Target 100, Current 0 -> Gap 100
  assert.strictEqual(calculateGap(100, 0), 100);
});

test('Competency Engine: Classification rules (Strong: 0–10, Moderate: 11–25, High: 26–40, Critical: 41+)', () => {
  // Strong: 0–10
  assert.strictEqual(classifyGap(0), 'Strong');
  assert.strictEqual(classifyGap(5), 'Strong');
  assert.strictEqual(classifyGap(10), 'Strong');

  // Moderate Gap: 11–25
  assert.strictEqual(classifyGap(11), 'Moderate Gap');
  assert.strictEqual(classifyGap(20), 'Moderate Gap');
  assert.strictEqual(classifyGap(25), 'Moderate Gap');

  // High Gap: 26–40
  assert.strictEqual(classifyGap(26), 'High Gap');
  assert.strictEqual(classifyGap(33), 'High Gap');
  assert.strictEqual(classifyGap(40), 'High Gap');

  // Critical Gap: 41+
  assert.strictEqual(classifyGap(41), 'Critical Gap');
  assert.strictEqual(classifyGap(55), 'Critical Gap');
  assert.strictEqual(classifyGap(100), 'Critical Gap');
});

test('Competency Engine: Evidence formulation matches user prompt exactly', () => {
  // Test case matching prompt:
  // Python — 42%
  // Target — 75%
  // Gap — 33%
  //
  // Evidence:
  // 5 questions attempted
  // 3 incorrect
  // Weak topics:
  // Pandas
  // Data Cleaning
  // Data Analysis

  const pythonAttempts = [
    {
      questionId: 'p1',
      competencyId: 'tech-python',
      topic: 'Python Basics',
      difficulty: 'Easy' as const, // weight 1.0
      correctAnswer: 0,
      userAnswer: 0,
      "user'sAnswer": 0,
      correctness: true, // +1.0
    },
    {
      questionId: 'p2',
      competencyId: 'tech-python',
      topic: 'NumPy Arrays',
      difficulty: 'Medium' as const, // weight 1.5
      correctAnswer: 1,
      userAnswer: 1,
      "user'sAnswer": 1,
      correctness: true, // +1.5
    },
    {
      questionId: 'p3',
      competencyId: 'tech-python',
      topic: 'Pandas',
      difficulty: 'Easy' as const, // weight 1.0
      correctAnswer: 2,
      userAnswer: 1,
      "user'sAnswer": 1,
      correctness: false, // 0
    },
    {
      questionId: 'p4',
      competencyId: 'tech-python',
      topic: 'Data Cleaning',
      difficulty: 'Easy' as const, // weight 1.0
      correctAnswer: 1,
      userAnswer: 3,
      "user'sAnswer": 3,
      correctness: false, // 0
    },
    {
      questionId: 'p5',
      competencyId: 'tech-python',
      topic: 'Data Analysis',
      difficulty: 'Medium' as const, // weight 1.5
      correctAnswer: 3,
      userAnswer: 0,
      "user'sAnswer": 0,
      correctness: false, // 0
    },
  ];

  // Total possible = 1.0 + 1.5 + 1.0 + 1.0 + 1.5 = 6.0
  // Total earned = 1.0 + 1.5 = 2.5
  // Normalized score = round((2.5 / 6.0) * 100) = 41.67% -> 42%
  const evaluation = calculateCompetencyPerformance(
    pythonAttempts,
    'tech-python',
    75,
    'Python'
  );

  assert.strictEqual(evaluation.currentScore, 42);
  assert.strictEqual(evaluation.targetScore, 75);
  assert.strictEqual(evaluation.gap, 33);
  assert.strictEqual(evaluation.classification, 'High Gap');

  // Evidence assertions
  assert.strictEqual(evaluation.evidence.questionsAttempted, 5);
  assert.strictEqual(evaluation.evidence.incorrectCount, 3);
  assert.strictEqual(evaluation.evidence.correctCount, 2);

  // Weak topics assertion
  assert.deepStrictEqual(evaluation.evidence.weakTopics, [
    'Pandas',
    'Data Cleaning',
    'Data Analysis',
  ]);

  // Formatted text structure verification
  const expectedFormattedText = `Python — 42%
Target — 75%
Gap — 33%

Evidence:
5 questions attempted
3 incorrect
Weak topics:
Pandas
Data Cleaning
Data Analysis`;

  assert.strictEqual(evaluation.formattedText, expectedFormattedText);
});

test('Competency Engine: Evaluates competencies separately without cross-contamination', () => {
  const mixedAttempts = [
    // Python questions
    {
      questionId: 'm-py-1',
      competencyId: 'tech-python',
      topic: 'Pandas',
      difficulty: 'Easy' as const,
      correctAnswer: 0,
      userAnswer: 0,
      "user'sAnswer": 0,
      correctness: true,
    },
    {
      questionId: 'm-py-2',
      competencyId: 'tech-python',
      topic: 'Data Cleaning',
      difficulty: 'Easy' as const,
      correctAnswer: 1,
      userAnswer: 2,
      "user'sAnswer": 2,
      correctness: false,
    },
    // Data Quality questions
    {
      questionId: 'm-dq-1',
      competencyId: 'stat-data-quality',
      topic: 'Outlier Detection',
      difficulty: 'Hard' as const,
      correctAnswer: 2,
      userAnswer: 2,
      "user'sAnswer": 2,
      correctness: true,
    },
    {
      questionId: 'm-dq-2',
      competencyId: 'stat-data-quality',
      topic: 'Range Constraints',
      difficulty: 'Medium' as const,
      correctAnswer: 1,
      userAnswer: 1,
      "user'sAnswer": 1,
      correctness: true,
    },
  ];

  const competencies = [
    {
      id: 'tech-python',
      name: 'Python',
      domain: 'TECHNICAL' as const,
      currentScore: 42,
      targetScore: 75,
      proficiencyLevel: 'Foundational' as const,
      description: '',
    },
    {
      id: 'stat-data-quality',
      name: 'Data Quality',
      domain: 'STATISTICAL' as const,
      currentScore: 48,
      targetScore: 80,
      proficiencyLevel: 'Intermediate' as const,
      description: '',
    },
  ];

  const results = evaluateAllCompetencies(mixedAttempts, competencies);

  // Python: 1 correct (1 pt), 1 incorrect (1 pt) -> 1/2 = 50%
  assert.strictEqual(results['tech-python'].currentScore, 50);
  assert.strictEqual(results['tech-python'].gap, 25);
  assert.strictEqual(results['tech-python'].classification, 'Moderate Gap');
  assert.strictEqual(results['tech-python'].evidence.questionsAttempted, 2);
  assert.strictEqual(results['tech-python'].evidence.incorrectCount, 1);
  assert.deepStrictEqual(results['tech-python'].evidence.weakTopics, ['Data Cleaning']);

  // Data Quality: 1 Hard correct (2 pts), 1 Medium correct (1.5 pts) -> 3.5 / 3.5 = 100%
  assert.strictEqual(results['stat-data-quality'].currentScore, 100);
  assert.strictEqual(results['stat-data-quality'].gap, 0);
  assert.strictEqual(results['stat-data-quality'].classification, 'Strong');
  assert.strictEqual(results['stat-data-quality'].evidence.questionsAttempted, 2);
  assert.strictEqual(results['stat-data-quality'].evidence.incorrectCount, 0);
  assert.strictEqual(results['stat-data-quality'].evidence.weakTopics.length, 0);
});

test('Competency Engine: Configurable difficulty weights and custom formula', () => {
  const attempts = [
    {
      questionId: 'cfg-1',
      competencyId: 'test-comp',
      topic: 'Topic 1',
      difficulty: 'Easy' as const,
      correctAnswer: 0,
      userAnswer: 0,
      "user'sAnswer": 0,
      correctness: true,
    },
    {
      questionId: 'cfg-2',
      competencyId: 'test-comp',
      topic: 'Topic 2',
      difficulty: 'Hard' as const,
      correctAnswer: 1,
      userAnswer: 2,
      "user'sAnswer": 2,
      correctness: false,
    },
  ];

  // With custom weights: Easy = 10, Hard = 100
  // Possible = 10 + 100 = 110. Earned = 10.
  // 10 / 110 = 9.09% -> 9%
  const customConfig = {
    difficultyWeights: {
      Easy: 10,
      Medium: 20,
      Hard: 100,
    },
    gapThresholds: DEFAULT_GAP_THRESHOLDS,
  };

  const evalCustom = calculateCompetencyPerformance(
    attempts,
    'test-comp',
    75,
    'Test Competency',
    customConfig
  );

  assert.strictEqual(evalCustom.currentScore, 9);
  assert.strictEqual(evalCustom.gap, 66);
  assert.strictEqual(evalCustom.classification, 'Critical Gap');
});

test('Competency Engine: Initial baseline attempts provide valid starter evidence', () => {
  const baselineAttempts = getInitialBaselineAttempts();
  assert.ok(baselineAttempts.length >= 5);

  const pythonAttempts = baselineAttempts.filter((a) => a.competencyId === 'tech-python');
  assert.strictEqual(pythonAttempts.length, 5);

  const evalPython = calculateCompetencyPerformance(
    pythonAttempts,
    'tech-python',
    75,
    'Python'
  );

  assert.strictEqual(evalPython.currentScore, 42);
  assert.strictEqual(evalPython.gap, 33);
  assert.strictEqual(evalPython.classification, 'High Gap');
  assert.strictEqual(evalPython.evidence.questionsAttempted, 5);
  assert.strictEqual(evalPython.evidence.incorrectCount, 3);
  assert.deepStrictEqual(evalPython.evidence.weakTopics, [
    'Pandas',
    'Data Cleaning',
    'Data Analysis',
  ]);
});

test('Step 9 End-to-End: Quiz Submission updates Competency Score, reduces Gap, and updates Recommendations', () => {
  // Initial state for Ananya Rao: Python score = 42%, target = 75%, gap = 33 (High Gap)
  const initialCompetencies = [
    {
      id: 'tech-python',
      name: 'Python for Statistical Computing',
      targetScore: 75,
      currentScore: 42,
      domain: 'TECHNICAL' as const,
      proficiencyLevel: 'Intermediate' as const,
      description: 'Vectorized microdata wrangling',
    },
    {
      id: 'stat-sampling-methods',
      name: 'Sample Survey Design & Multi-Stage Sampling',
      targetScore: 80,
      currentScore: 48,
      domain: 'STATISTICAL' as const,
      proficiencyLevel: 'Intermediate' as const,
      description: 'Stratified sampling',
    },
  ];

  // 10 question quiz submitted with quizId: 'quiz-python-reassessment-01'
  const quizSessionId = 'quiz-python-reassessment-01';
  const quizTimestamp = new Date().toISOString();

  // 8 correct, 2 incorrect
  // 3 Easy (1.0 each): 2 correct (2.0), 1 incorrect (0)
  // 5 Medium (1.5 each): 4 correct (6.0), 1 incorrect (0)
  // 2 Hard (2.0 each): 2 correct (4.0)
  // Total possible = 3.0 + 7.5 + 4.0 = 14.5
  // Total earned = 2.0 + 6.0 + 4.0 = 12.0
  // Score = round(12.0 / 14.5 * 100) = 83% (Target 75% achieved! Gap = 0)
  const newAttempts = [
    {
      questionId: 'q-py-01',
      competencyId: 'tech-python',
      topic: 'Pandas',
      difficulty: 'Easy' as const,
      correctAnswer: 1,
      userAnswer: 1,
      "user'sAnswer": 1,
      correctness: true,
      quizId: quizSessionId,
      timestamp: quizTimestamp,
    },
    {
      questionId: 'q-py-02',
      competencyId: 'tech-python',
      topic: 'Vectorization',
      difficulty: 'Easy' as const,
      correctAnswer: 1,
      userAnswer: 1,
      "user'sAnswer": 1,
      correctness: true,
      quizId: quizSessionId,
      timestamp: quizTimestamp,
    },
    {
      questionId: 'q-py-03',
      competencyId: 'tech-python',
      topic: 'Data Cleaning',
      difficulty: 'Easy' as const,
      correctAnswer: 0,
      userAnswer: 2,
      "user'sAnswer": 2,
      correctness: false,
      quizId: quizSessionId,
      timestamp: quizTimestamp,
    },
    {
      questionId: 'q-py-04',
      competencyId: 'tech-python',
      topic: 'Weighted Aggregation',
      difficulty: 'Medium' as const,
      correctAnswer: 1,
      userAnswer: 1,
      "user'sAnswer": 1,
      correctness: true,
      quizId: quizSessionId,
      timestamp: quizTimestamp,
    },
    {
      questionId: 'q-py-05',
      competencyId: 'tech-python',
      topic: 'Categorical Downcasting',
      difficulty: 'Medium' as const,
      correctAnswer: 1,
      userAnswer: 1,
      "user'sAnswer": 1,
      correctness: true,
      quizId: quizSessionId,
      timestamp: quizTimestamp,
    },
    {
      questionId: 'q-py-06',
      competencyId: 'tech-python',
      topic: 'Schedule Merging',
      difficulty: 'Medium' as const,
      correctAnswer: 1,
      userAnswer: 1,
      "user'sAnswer": 1,
      correctness: true,
      quizId: quizSessionId,
      timestamp: quizTimestamp,
    },
    {
      questionId: 'q-py-07',
      competencyId: 'tech-python',
      topic: 'Outlier Detection (MAD)',
      difficulty: 'Medium' as const,
      correctAnswer: 1,
      userAnswer: 1,
      "user'sAnswer": 1,
      correctness: true,
      quizId: quizSessionId,
      timestamp: quizTimestamp,
    },
    {
      questionId: 'q-py-08',
      competencyId: 'tech-python',
      topic: 'CAPI JSON Parsing',
      difficulty: 'Medium' as const,
      correctAnswer: 2,
      userAnswer: 0,
      "user'sAnswer": 0,
      correctness: false,
      quizId: quizSessionId,
      timestamp: quizTimestamp,
    },
    {
      questionId: 'q-py-09',
      competencyId: 'tech-python',
      topic: 'Sub-Sample Replication',
      difficulty: 'Hard' as const,
      correctAnswer: 1,
      userAnswer: 1,
      "user'sAnswer": 1,
      correctness: true,
      quizId: quizSessionId,
      timestamp: quizTimestamp,
    },
    {
      questionId: 'q-py-10',
      competencyId: 'tech-python',
      topic: 'Microdata Anonymization',
      difficulty: 'Hard' as const,
      correctAnswer: 1,
      userAnswer: 1,
      "user'sAnswer": 1,
      correctness: true,
      quizId: quizSessionId,
      timestamp: quizTimestamp,
    },
  ];

  // Evaluate performance on this session
  const evalResult = calculateCompetencyPerformance(
    newAttempts,
    'tech-python',
    75,
    'Python for Statistical Computing'
  );

  assert.strictEqual(evalResult.evidence.questionsAttempted, 10);
  assert.strictEqual(evalResult.evidence.correctCount, 8);
  assert.strictEqual(evalResult.evidence.incorrectCount, 2);
  assert.deepStrictEqual(evalResult.evidence.weakTopics, ['Data Cleaning', 'CAPI JSON Parsing']);
  assert.strictEqual(evalResult.currentScore, 83);
  assert.strictEqual(evalResult.gap, 0); // 75 - 83 <= 0 -> 0
  assert.strictEqual(evalResult.classification, 'Strong');

  // Check evaluateAllCompetencies with session filtering
  const allAttempts = [...newAttempts];
  const evaluatedMap = evaluateAllCompetencies(
    allAttempts,
    initialCompetencies
  );

  const updatedPython = evaluatedMap['tech-python'];
  assert.ok(updatedPython);
  assert.strictEqual(updatedPython.currentScore, 83);
  assert.strictEqual(updatedPython.gap, 0);
  assert.strictEqual(updatedPython.classification, 'Strong');
});

