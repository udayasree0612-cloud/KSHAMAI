import {
  Competency,
  LearningResource,
  Recommendation,
  UserProfile,
  QuestionAttempt,
  RecommendationEngineConfig,
  RecommendationEngineWeights,
  ExcludedStrongCompetency,
} from '../types';
import {
  learningProviderRegistry,
  igotAdapter,
  nsstaAdapter,
  DEMO_IGOT_COURSES,
  DEMO_NSSTA_PROGRAMMES,
} from './learningProviders';
import { DEFAULT_USER_PROFILE, DEFAULT_COMPETENCIES } from '../data/initialData';

/**
 * ============================================================================
 * DETERMINISTIC & EXPLAINABLE RECOMMENDATION ENGINE (STEP 8)
 * ============================================================================
 * 
 * CORE FLOW:
 * Officer Profile → Competency Scores → Gap Analysis → Recommendation Engine → Recommended Resources
 * 
 * 1. Read Existing Competency Data:
 *    - competency ID, name, domain, current score, target score, gap, priority, role, history.
 * 2. Gap Calculation:
 *    - gap = targetScore - currentScore
 *    - gap <= 0: excluded from beginner priority recommendations (learner is already competent).
 * 3. Priority Mapping:
 *    - Uses Competency Engine classification:
 *      gap >= 41 -> Critical
 *      gap >= 26 -> High
 *      gap >= 11 -> Medium
 *      gap <= 10 -> Low (or Strong)
 * 4. Ranking Formula:
 *    - Ranking Score = (Gap Severity * w_gap) + (Role Priority * w_role) + (Proficiency Fit * w_prof)
 * 5. Duplicate Prevention:
 *    - Duplicate resource IDs are strictly prevented.
 *    - Already-completed resources are skipped unless the user exhibits a Critical Gap (remedial need).
 * 6. Explainable Evidence-Grounded Reason:
 *    - Exactly matches:
 *      "Recommended because Python competency is 42/75, creating a high-priority gap of 33 points, and Python is relevant to the Statistical Officer role."
 * ============================================================================
 */

export const DEFAULT_RECOMMENDATION_CONFIG: RecommendationEngineConfig = {
  weights: {
    gapSeverityWeight: 0.50,
    rolePriorityWeight: 0.30,
    proficiencyFitWeight: 0.20,
  },
  strongThreshold: 10,
};

/**
 * Role Priority Matrix:
 * Maps competencies to their operational criticality based on official job designations in official statistics.
 */
export const ROLE_COMPETENCY_PRIORITIES: Record<string, Record<string, number>> = {
  'Statistical Officer': {
    'tech-python': 95,
    'stat-data-quality': 95,
    'stat-national-accounts': 90,
    'gov-data-privacy': 85,
    'stat-labour-stats': 80,
    'stat-agri-stats': 80,
    'stat-survey-design': 85,
    'stat-sampling-methods': 85,
    'stat-sdg-indicators': 80,
    'tech-sql': 80,
    'tech-r': 85,
    'tech-data-viz': 75,
    'tech-aiml': 70,
    'tech-gis': 75,
    'gov-cybersecurity': 75,
    'gov-cloud': 70,
    'mgr-leadership': 65,
    'gov-dpi': 75,
  },
  'Field Operations Supervisor': {
    'stat-data-quality': 95,
    'gov-cybersecurity': 95,
    'tech-gis': 90,
    'mgr-leadership': 90,
    'stat-survey-design': 90,
    'stat-sampling-methods': 85,
    'gov-data-privacy': 85,
    'tech-python': 65,
    'stat-labour-stats': 80,
    'stat-agri-stats': 85,
  },
  'Data Analyst': {
    'tech-python': 95,
    'tech-sql': 90,
    'tech-r': 90,
    'tech-data-viz': 90,
    'stat-data-quality': 85,
    'tech-aiml': 85,
    'stat-national-accounts': 75,
    'stat-sdg-indicators': 80,
  },
};

/**
 * Normalizes role priority score for any role and competency.
 */
export function getRolePriorityScore(role: string, competencyId: string): { score: number; label: string } {
  const matchingRoleKey = Object.keys(ROLE_COMPETENCY_PRIORITIES).find(
    (k) => role.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(role.toLowerCase())
  );

  const roleMap = matchingRoleKey ? ROLE_COMPETENCY_PRIORITIES[matchingRoleKey] : undefined;
  const score = roleMap?.[competencyId] ?? 70;

  let label = 'medium-priority';
  if (score >= 85) label = 'high-priority';
  else if (score >= 75) label = 'priority';

  return { score, label };
}

/**
 * Evaluates how well a course proficiency level fits the learner's current standing.
 */
export function getProficiencyFitScore(
  currentScore: number,
  courseLevel: 'Foundational' | 'Intermediate' | 'Advanced'
): number {
  if (currentScore < 50) {
    if (courseLevel === 'Foundational') return 100;
    if (courseLevel === 'Intermediate') return 85;
    return 60;
  } else if (currentScore <= 70) {
    if (courseLevel === 'Intermediate') return 100;
    if (courseLevel === 'Advanced') return 85;
    return 75;
  } else {
    if (courseLevel === 'Advanced') return 100;
    if (courseLevel === 'Intermediate') return 80;
    return 50;
  }
}

/**
 * Extracts weak topics identified for a competency from historical question attempts.
 */
export function extractWeakTopicsForCompetency(
  competencyId: string,
  attempts: QuestionAttempt[]
): string[] {
  const incorrectAttempts = attempts.filter(
    (a) => a.competencyId === competencyId && !a.correctness
  );

  const topicSet = new Set<string>();
  incorrectAttempts.forEach((a) => {
    if (a.topic && a.topic.trim()) {
      topicSet.add(a.topic.trim());
    }
  });

  return Array.from(topicSet);
}

/**
 * Maps gap to standard Competency Engine priority:
 * - Critical: gap >= 41
 * - High: gap in [26, 40]
 * - Medium: gap in [11, 25]
 * - Low: gap in [0, 10]
 */
export function mapGapToPriority(
  gap: number,
  rolePriorityScore: number = 70
): 'Critical' | 'High' | 'Medium' | 'Low' {
  if (gap >= 41 || (gap >= 30 && rolePriorityScore >= 90)) return 'Critical';
  if (gap >= 26 || (gap >= 20 && rolePriorityScore >= 85)) return 'High';
  if (gap >= 11) return 'Medium';
  return 'Low';
}

/**
 * Generates an explainable, evidence-grounded recommendation reason and short summary.
 * Exactly adheres to:
 * "Recommended because Python competency is 42/75, creating a high-priority gap of 33 points, and Python is relevant to the Statistical Officer role."
 */
export function getRecommendationReason(
  competencyName: string,
  competencyId: string,
  role: string,
  currentScore: number,
  targetScore: number,
  gap: number,
  priority: string,
  weakTopics: string[] = []
): { reason: string; whyRecommended: string } {
  const priorityLower = priority.toLowerCase();
  const weakTopicsSuffix =
    weakTopics.length > 0
      ? ` Assessment verified weakness in ${weakTopics.slice(0, 2).join(' and ')}.`
      : '';

  const reason = `Recommended because ${competencyName} competency is ${currentScore}/${targetScore}, creating a ${priorityLower}-priority gap of ${gap} points, and ${competencyName} is relevant to the ${role} role.${weakTopicsSuffix}`;
  const whyRecommended = `Addresses your ${priorityLower}-priority ${competencyName} competency gap (${gap} points).`;

  return { reason, whyRecommended };
}

export const generateRecommendationReason = getRecommendationReason;

export interface RecommendationEngineOutput {
  recommendations: Recommendation[];
  excludedStrongCompetencies: ExcludedStrongCompetency[];
  rankingFormulaText: string;
  configUsed: RecommendationEngineConfig;
  totalCatalogEvaluated: number;
}

/**
 * Core Deterministic Recommendation Generator
 * 
 * Rules:
 * 1. Reads existing competency output (id, name, currentScore, targetScore, gap, priority, role, history).
 * 2. If gap <= 0 or gap <= strongThreshold:
 *    Do not prioritize beginner learning for that competency.
 * 3. Identifies matching resources from iGOT and NSSTA prototype catalogues.
 * 4. Filters out duplicate resource recommendations.
 * 5. Filters out already completed resources (unless Critical Gap warrants remedial learning).
 * 6. Computes explainable ranking score:
 *    Ranking Score = (Gap Severity * w_gap) + (Role Priority * w_role) + (Proficiency Fit * w_prof).
 * 7. Ranks resources strictly by score descending.
 */
export function generatePersonalizedRecommendations(
  profile: UserProfile,
  competencies: Competency[],
  coursesCatalog: LearningResource[],
  questionAttempts: QuestionAttempt[] = [],
  config: RecommendationEngineConfig = DEFAULT_RECOMMENDATION_CONFIG
): RecommendationEngineOutput {
  const { weights, strongThreshold } = config;
  const role = profile.designation || 'Statistical Officer';

  const recommendations: Recommendation[] = [];
  const excludedStrongCompetencies: ExcludedStrongCompetency[] = [];
  const seenResourceIds = new Set<string>();

  // Determine user completed courses to avoid redundant recommendations
  const completedResourceIds = new Set<string>(
    coursesCatalog.filter((c) => c.completed).map((c) => c.id)
  );

  // 1. Process each competency
  for (const comp of competencies) {
    const gap = Math.max(comp.targetScore - comp.currentScore, 0);

    // Rule 2: If gap <= 0 or within strong threshold, do not recommend
    const isStrong = comp.currentScore >= comp.targetScore || gap <= strongThreshold;

    if (isStrong) {
      excludedStrongCompetencies.push({
        competencyId: comp.id,
        competencyName: comp.name,
        currentScore: comp.currentScore,
        targetScore: comp.targetScore,
        gap,
        reason: `${comp.name} has a current score of ${comp.currentScore}% meeting or exceeding required ${comp.targetScore}% threshold (${gap} percentage points gap) — excluded from recommendations because learner is already strong.`,
      });
      continue;
    }

    // Role priority score
    const { score: rolePriorityScore } = getRolePriorityScore(role, comp.id);
    const priority = mapGapToPriority(gap, rolePriorityScore);

    // Identify weak topics from assessment history
    const weakTopics = extractWeakTopicsForCompetency(comp.id, questionAttempts);

    // Match learning resources for this competency
    const matchingCourses = coursesCatalog.filter((c) => {
      const idMatch = c.competencyId === comp.id;
      const nameMatch = c.competencyName.toLowerCase() === comp.name.toLowerCase();
      const titleMatch = c.title.toLowerCase().includes(comp.name.toLowerCase());
      return idMatch || nameMatch || titleMatch;
    });

    if (matchingCourses.length === 0) {
      continue;
    }

    // Normalized gap severity (0 - 100): 40+ point gap = 100
    const gapSeverityScore = Math.min(100, Math.max(0, Math.round((gap / 40) * 100)));

    for (const course of matchingCourses) {
      // Duplicate prevention rule 1: Do not recommend same resource twice
      if (seenResourceIds.has(course.id)) {
        continue;
      }

      // Duplicate prevention rule 2: Avoid already completed resources unless gap is Critical
      const isCompleted = completedResourceIds.has(course.id) || course.completed;
      if (isCompleted && priority !== 'Critical') {
        continue;
      }

      const proficiencyFitScore = getProficiencyFitScore(comp.currentScore, course.level);

      // Deterministic ranking formula
      const weightedTotal =
        gapSeverityScore * weights.gapSeverityWeight +
        rolePriorityScore * weights.rolePriorityWeight +
        proficiencyFitScore * weights.proficiencyFitWeight;

      const rankingScore = Number(weightedTotal.toFixed(1));

      const { reason, whyRecommended } = getRecommendationReason(
        comp.name,
        comp.id,
        role,
        comp.currentScore,
        comp.targetScore,
        gap,
        priority,
        weakTopics
      );

      seenResourceIds.add(course.id);

      const providerType: 'iGOT' | 'NSSTA' | 'MoSPI Academy' =
        course.providerType ||
        (course.provider.toLowerCase().includes('nssta') ? 'NSSTA' : 'iGOT');

      recommendations.push({
        id: `rec-${comp.id}-${course.id}`,
        courseTitle: course.title,
        programmeName: course.programmeName,
        competencyId: comp.id,
        competencyName: comp.name,
        currentScore: comp.currentScore,
        targetScore: comp.targetScore,
        gap,
        gapPercentagePoints: `${gap} points`,
        reason,
        whyRecommended,
        estimatedLearningDuration: course.durationText || `${course.durationHours} hours`,
        source: course.providerLabel || course.provider,
        provider: course.providerLabel || course.provider,
        providerType,
        deliveryType: course.deliveryType || 'Self-Paced e-Learning',
        priority,
        resourceId: course.id,
        rankingScore,
        rankingScoreBreakdown: {
          gapSeverityScore,
          rolePriorityScore,
          proficiencyFitScore,
          weightedTotal: rankingScore,
        },
        roleName: role,
        targetProficiency: comp.proficiencyLevel,
        courseLevel: course.level,
        weakTopics: weakTopics.length > 0 ? weakTopics : undefined,
        isDemoData: true,
      });
    }
  }

  // Rank recommendations strictly by ranking score descending
  recommendations.sort((a, b) => (b.rankingScore ?? 0) - (a.rankingScore ?? 0));

  const rankingFormulaText = `Ranking Score = (Gap Severity × ${weights.gapSeverityWeight}) + (Role Priority × ${weights.rolePriorityWeight}) + (Proficiency Fit × ${weights.proficiencyFitWeight})`;

  return {
    recommendations,
    excludedStrongCompetencies,
    rankingFormulaText,
    configUsed: config,
    totalCatalogEvaluated: coursesCatalog.length,
  };
}

/**
 * ============================================================================
 * CLEAN API DESIGN FUNCTIONS (Requirement 12)
 * ============================================================================
 */

export interface RecommendationQueryOptions {
  profile?: UserProfile;
  competencies?: Competency[];
  provider?: 'igot' | 'nssta' | 'all' | string;
  config?: RecommendationEngineConfig;
  questionAttempts?: QuestionAttempt[];
}

/**
 * getRecommendations:
 * Main API function to retrieve personalized recommendations for a user.
 */
export async function getRecommendations(
  _userId?: string,
  options?: RecommendationQueryOptions
): Promise<RecommendationEngineOutput> {
  const profile = options?.profile || DEFAULT_USER_PROFILE;
  const competencies = options?.competencies || DEFAULT_COMPETENCIES;
  const config = options?.config || DEFAULT_RECOMMENDATION_CONFIG;
  const attempts = options?.questionAttempts || [];

  let catalog: LearningResource[] = [];
  if (options?.provider === 'igot') {
    catalog = await igotAdapter.getResources();
  } else if (options?.provider === 'nssta') {
    catalog = await nsstaAdapter.getResources();
  } else {
    catalog = await learningProviderRegistry.getAllResources();
  }

  if (catalog.length === 0) {
    catalog = [...DEMO_IGOT_COURSES, ...DEMO_NSSTA_PROGRAMMES];
  }

  return generatePersonalizedRecommendations(profile, competencies, catalog, attempts, config);
}

/**
 * getRecommendationsByCompetency:
 * Retrieves recommendations specifically for a single competency ID.
 */
export async function getRecommendationsByCompetency(
  competencyId: string,
  _userId?: string,
  options?: RecommendationQueryOptions
): Promise<Recommendation[]> {
  const fullOutput = await getRecommendations(_userId, options);
  return fullOutput.recommendations.filter((r) => r.competencyId === competencyId);
}

/**
 * getRecommendationsByProvider:
 * Retrieves recommendations filtered by provider ('igot' or 'nssta').
 */
export async function getRecommendationsByProvider(
  provider: 'igot' | 'nssta' | string,
  _userId?: string,
  options?: RecommendationQueryOptions
): Promise<Recommendation[]> {
  const fullOutput = await getRecommendations(_userId, { ...options, provider });
  const p = provider.toLowerCase();
  return fullOutput.recommendations.filter((r) => {
    if (p === 'igot') return r.providerType === 'iGOT' || r.source.toLowerCase().includes('igot');
    if (p === 'nssta') return r.providerType === 'NSSTA' || r.source.toLowerCase().includes('nssta');
    return true;
  });
}

/**
 * searchLearningResources:
 * Search through the combined provider catalog by text and domain.
 */
export async function searchLearningResources(
  query: string,
  domain?: string,
  providerId?: string
): Promise<LearningResource[]> {
  if (providerId && providerId !== 'ALL') {
    const provider = learningProviderRegistry.getProvider(providerId);
    if (provider) {
      return provider.searchResources(query, domain);
    }
  }
  return learningProviderRegistry.searchAll(query, domain);
}
