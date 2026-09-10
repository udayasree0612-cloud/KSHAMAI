export type CompetencyDomain =
  | 'STATISTICAL'
  | 'TECHNICAL'
  | 'DIGITAL_GOVERNANCE'
  | 'BEHAVIOURAL_MANAGERIAL';

export type ProficiencyLevel =
  | 'Foundational'
  | 'Intermediate'
  | 'Advanced'
  | 'Expert';

export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

export type GapCategory = 'Strong' | 'Moderate Gap' | 'High Gap' | 'Critical Gap';

export interface Competency {
  id: string;
  name: string;
  domain: CompetencyDomain;
  currentScore: number; // 0 to 100
  targetScore: number;  // 0 to 100
  proficiencyLevel: ProficiencyLevel;
  description: string;
  history?: { date: string; score: number; reason: string }[];
}

export interface UserProfile {
  id: string;
  name: string;
  designation: string;
  department: string;
  jobRole: string;
  yearsOfExperience: number;
  qualification: string;
  previousTraining: string[];
  currentSkills: string[];
  email?: string;
  avatarUrl?: string;
}

export interface Question {
  id: string;
  question: string;
  options: [string, string, string, string];
  correctAnswer: number; // 0, 1, 2, 3
  competencyId: string;
  topic: string;
  difficulty: DifficultyLevel;
  explanation: string;
  sourceText?: string;
  sourceReference?: string;
  sourceQuote?: string;
}

export interface IdentifiedTopic {
  id: string;
  name: string;
  description: string;
  confidence: number;
  mappedCompetencyId: string;
  mappedCompetencyName: string;
  keyConcepts: string[];
  sourceExcerpt: string;
}

export interface MCQValidationResult {
  passed: boolean;
  totalChecked: number;
  validCount: number;
  rejectedCount: number;
  regeneratedCount: number;
  rulesPassed: {
    rule: string;
    description: string;
    passed: boolean;
  }[];
  rejectedReasons: string[];
}

export interface Assessment {
  id: string;
  title: string;
  description: string;
  domain?: CompetencyDomain | 'ALL';
  questions: Question[];
  durationMinutes: number;
}

export interface CompetencyScoreDelta {
  competencyId: string;
  competencyName: string;
  scoreBefore: number;
  scoreAfter: number;
  delta: number;
  correctAnswers: number;
  totalQuestions: number;
  previousGap?: number;
  currentGap?: number;
  gapReduction?: number;
  weakTopics?: string[];
}

export interface AssessmentResult {
  id: string;
  assessmentId: string;
  title: string;
  timestamp: string;
  scorePercentage: number;
  correctCount: number;
  totalQuestions: number;
  competencyDeltas: CompetencyScoreDelta[];
  userAnswers: Record<string, number>;
  questionAttempts?: QuestionAttempt[];
  competencyEvaluations?: Record<string, CompetencyEvaluation>;
}

export interface LearningResource {
  id: string;
  title: string;
  programmeName?: string;
  competencyId: string;
  competencyName: string;
  domain: CompetencyDomain;
  description: string;
  durationHours: number;
  durationText?: string;
  provider: string; // e.g. 'iGOT Karmayogi — Prototype Adapter' | 'NSSTA / TPAC — Prototype Data'
  providerType?: 'iGOT' | 'NSSTA' | 'MoSPI Academy';
  providerLabel?: string;
  source?: string;
  level: 'Foundational' | 'Intermediate' | 'Advanced';
  difficulty?: 'Foundational' | 'Intermediate' | 'Advanced';
  rating: number;
  enrolled: boolean;
  completed: boolean;
  isDemoData: boolean;
  modulesCount?: number;
  deliveryType?: 'Self-Paced e-Learning' | 'Residential Training' | 'In-Person Workshop' | 'Blended Hybrid' | 'Executive Masterclass';
  urlPlaceholder?: string;
}

export interface Recommendation {
  id: string;
  courseTitle: string;
  programmeName?: string;
  competencyId: string;
  competencyName: string;
  currentScore: number;
  targetScore: number;
  gap: number;
  gapPercentagePoints?: string;
  reason: string;
  whyRecommended?: string;
  estimatedLearningDuration: string;
  source: string;
  provider: string;
  providerType?: 'iGOT' | 'NSSTA' | 'MoSPI Academy';
  deliveryType?: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  resourceId: string;
  rankingScore?: number;
  rankingScoreBreakdown?: {
    gapSeverityScore: number;
    rolePriorityScore: number;
    proficiencyFitScore: number;
    weightedTotal: number;
  };
  roleName?: string;
  targetProficiency?: string;
  courseLevel?: string;
  weakTopics?: string[];
  isDemoData?: boolean;
}

export interface LearningProviderStatus {
  mode: 'PROTOTYPE_ADAPTER' | 'LIVE_API';
  label: string;
  description: string;
  apiEndpointConfigured: boolean;
  isDemoData: boolean;
}

export interface LearningProvider {
  providerId: string;
  providerName: string;
  providerLabel: string;
  isLiveApi: boolean;
  getResources(): Promise<LearningResource[]>;
  searchResources(query: string, domain?: string): Promise<LearningResource[]>;
  getResourceById(id: string): Promise<LearningResource | null>;
  recordEnrollment?(resourceId: string, userId: string): Promise<{ success: boolean; message: string }>;
  recordCompletion?(resourceId: string, userId: string): Promise<{ success: boolean; message: string }>;
  getStatus(): LearningProviderStatus;
}

export interface RecommendationEngineWeights {
  gapSeverityWeight: number;
  rolePriorityWeight: number;
  proficiencyFitWeight: number;
}

export interface RecommendationEngineConfig {
  weights: RecommendationEngineWeights;
  strongThreshold: number;
}

export interface ExcludedStrongCompetency {
  competencyId: string;
  competencyName: string;
  currentScore: number;
  targetScore: number;
  gap: number;
  reason: string;
}

export interface LearningMaterial {
  id: string;
  title: string;
  fileName?: string;
  fileSize?: string;
  fileType?: 'pdf' | 'txt' | 'docx' | 'md';
  uploadedAt: string;
  extractedText: string;
  wordCount?: number;
  numPages?: number;
  summary?: string;
  competencyId?: string;
  suggestedCompetencies?: string[];
  identifiedTopics?: IdentifiedTopic[];
  generatedQuestions?: Question[];
  validationReport?: MCQValidationResult;
}

export interface Quiz {
  id: string;
  title: string;
  materialId?: string;
  sourceTitle: string;
  questions: Question[];
  createdAt: string;
}

export interface QuizResult {
  id: string;
  quizId: string;
  quizTitle: string;
  timestamp: string;
  scorePercentage: number;
  correctAnswersCount: number;
  totalQuestions: number;
  competencyUpdates: CompetencyScoreDelta[];
  userAnswers: Record<string, number>;
  improvementAreas: string[];
  questionAttempts?: QuestionAttempt[];
  competencyEvaluations?: Record<string, CompetencyEvaluation>;
}

export interface QuestionAttempt {
  id?: string;
  attemptId?: string;
  questionId: string;
  competencyId: string;
  topic: string;
  difficulty: DifficultyLevel;
  correctAnswer: number;
  userAnswer: number;
  "user'sAnswer": number;
  correctness: boolean;
  questionText?: string;
  explanation?: string;
  options?: string[];
  selectedOptionText?: string;
  correctOptionText?: string;
  quizId?: string;
  assessmentId?: string;
  timestamp?: string;
}

export interface DifficultyWeights {
  Easy: number;
  Medium: number;
  Hard: number;
}

export interface GapThresholds {
  strongMax: number;
  moderateMax: number;
  highMax: number;
}

export interface CompetencyEngineConfig {
  difficultyWeights: DifficultyWeights;
  gapThresholds: GapThresholds;
  customFormula?: (earnedPoints: number, possiblePoints: number) => number;
}

export interface CompetencyGapEvidence {
  questionsAttempted: number;
  correctCount: number;
  incorrectCount: number;
  accuracyPercentage: number;
  weakTopics: string[];
  strongTopics: string[];
  totalWeightedEarned: number;
  totalWeightedPossible: number;
  formulaDescription: string;
  attempts: QuestionAttempt[];
}

export interface CompetencyEvaluation {
  competencyId: string;
  competencyName: string;
  currentScore: number;
  targetScore: number;
  gap: number;
  classification: GapCategory;
  evidence: CompetencyGapEvidence;
  formattedText: string;
}

export interface LearnerSummary {
  id: string;
  name: string;
  designation: string;
  department: string;
  overallScore: number;
  criticalGapsCount: number;
  coursesEnrolled: number;
  lastActive: string;
}
