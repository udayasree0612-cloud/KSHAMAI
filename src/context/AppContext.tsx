import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  UserProfile,
  Competency,
  Question,
  AssessmentResult,
  QuizResult,
  LearningMaterial,
  Recommendation,
  LearningResource,
  GapCategory,
  QuestionAttempt,
  CompetencyEvaluation,
  CompetencyEngineConfig,
  DifficultyWeights,
  RecommendationEngineConfig,
  RecommendationEngineWeights,
  ExcludedStrongCompetency,
} from '../types';
import {
  DEFAULT_USER_PROFILE,
  DEFAULT_COMPETENCIES,
  INITIAL_ASSESSMENT_QUESTIONS,
  SAMPLE_LEARNING_MATERIALS,
} from '../data/initialData';
import { igotAdapterInstance, DEMO_IGOT_COURSES } from '../services/igotAdapter';
import { learningProviderRegistry } from '../services/learningProviders';
import {
  createQuestionAttempt,
  calculateGap as engineCalculateGap,
  classifyGap as engineClassifyGap,
  calculateCompetencyPerformance,
  evaluateAllCompetencies,
  getInitialBaselineAttempts,
  DEFAULT_ENGINE_CONFIG,
} from '../services/competencyEngine';
import {
  generatePersonalizedRecommendations,
  DEFAULT_RECOMMENDATION_CONFIG,
} from '../services/recommendationEngine';

interface AppContextType {
  userProfile: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  competencies: Competency[];
  updateCompetency: (id: string, updates: Partial<Competency>) => void;
  addCompetency: (comp: Omit<Competency, 'id'>) => void;
  resetCompetencies: () => void;
  calculateGap: (target: number, current: number) => number;
  getGapCategory: (gap: number) => GapCategory;
  
  // Competency Assessment Engine
  engineConfig: CompetencyEngineConfig;
  updateDifficultyWeights: (weights: Partial<DifficultyWeights>) => void;
  resetEngineConfig: () => void;
  questionAttempts: QuestionAttempt[];
  getCompetencyEvaluation: (competencyId: string) => CompetencyEvaluation;
  evaluationsRecord: Record<string, CompetencyEvaluation>;

  // Assessment & Quiz
  initialQuestions: Question[];
  assessmentResults: AssessmentResult[];
  quizResults: QuizResult[];
  activeQuiz: {
    title: string;
    sourceTitle: string;
    questions: Question[];
    materialId?: string;
  } | null;
  startQuiz: (title: string, sourceTitle: string, questions: Question[], materialId?: string) => void;
  submitQuiz: (
    quizTitle: string,
    sourceTitle: string,
    userAnswers: Record<string, number>,
    questions: Question[]
  ) => QuizResult;
  recordAssessmentResult: (
    title: string,
    assessmentId: string,
    userAnswers: Record<string, number>,
    questions: Question[]
  ) => AssessmentResult;
  
  // Materials
  materials: LearningMaterial[];
  addMaterial: (material: LearningMaterial) => void;
  deleteMaterial: (id: string) => void;

  // Recommendations & Learning Providers (Step 8)
  recommendations: Recommendation[];
  igotRecommendations: Recommendation[];
  nsstaRecommendations: Recommendation[];
  getRecommendationsByCompetency: (competencyId: string) => Recommendation[];
  getRecommendationsByProvider: (provider: 'igot' | 'nssta' | string) => Recommendation[];
  enrolledCourses: string[];
  enrollInCourse: (courseId: string) => Promise<boolean>;
  completeCourse: (courseId: string) => Promise<boolean>;
  coursesCatalog: LearningResource[];
  refreshRecommendations: () => void;
  recommendationConfig: RecommendationEngineConfig;
  updateRecommendationWeights: (weights: Partial<RecommendationEngineWeights>) => void;
  resetRecommendationWeights: () => void;
  excludedStrongCompetencies: ExcludedStrongCompetency[];
  recommendationFormulaText: string;

  // Active view
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_PROFILE = 'kshamai_user_profile_v1';
const STORAGE_KEY_COMPETENCIES = 'kshamai_competencies_v1';
const STORAGE_KEY_MATERIALS = 'kshamai_materials_v1';
const STORAGE_KEY_ASSESSMENTS = 'kshamai_assessments_v1';
const STORAGE_KEY_QUIZZES = 'kshamai_quizzes_v1';
const STORAGE_KEY_ATTEMPTS = 'kshamai_question_attempts_v1';
const STORAGE_KEY_CONFIG = 'kshamai_engine_config_v1';
const STORAGE_KEY_REC_CONFIG = 'kshamai_rec_config_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. User Profile State
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROFILE);
      return saved ? JSON.parse(saved) : DEFAULT_USER_PROFILE;
    } catch {
      return DEFAULT_USER_PROFILE;
    }
  });

  // 2. Competencies Framework State
  const [competencies, setCompetencies] = useState<Competency[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_COMPETENCIES);
      return saved ? JSON.parse(saved) : DEFAULT_COMPETENCIES;
    } catch {
      return DEFAULT_COMPETENCIES;
    }
  });

  // 3. Materials State
  const [materials, setMaterials] = useState<LearningMaterial[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MATERIALS);
      return saved ? JSON.parse(saved) : SAMPLE_LEARNING_MATERIALS;
    } catch {
      return SAMPLE_LEARNING_MATERIALS;
    }
  });

  // 4. Configurable Engine Configuration (Easy=1, Medium=1.5, Hard=2)
  const [engineConfig, setEngineConfig] = useState<CompetencyEngineConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
      return saved ? JSON.parse(saved) : DEFAULT_ENGINE_CONFIG;
    } catch {
      return DEFAULT_ENGINE_CONFIG;
    }
  });

  // 5. Question Attempts History (initialized with explainable baseline evidence)
  const [questionAttempts, setQuestionAttempts] = useState<QuestionAttempt[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ATTEMPTS);
      return saved ? JSON.parse(saved) : getInitialBaselineAttempts();
    } catch {
      return getInitialBaselineAttempts();
    }
  });

  // 6. Assessment and Quiz History
  const [assessmentResults, setAssessmentResults] = useState<AssessmentResult[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ASSESSMENTS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [quizResults, setQuizResults] = useState<QuizResult[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_QUIZZES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeQuiz, setActiveQuiz] = useState<{
    title: string;
    sourceTitle: string;
    questions: Question[];
    materialId?: string;
  } | null>(null);

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [coursesCatalog, setCoursesCatalog] = useState<LearningResource[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>(['igot-dq-101', 'igot-py-201']);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [excludedStrongCompetencies, setExcludedStrongCompetencies] = useState<ExcludedStrongCompetency[]>([]);
  const [recommendationFormulaText, setRecommendationFormulaText] = useState<string>('');

  const [recommendationConfig, setRecommendationConfig] = useState<RecommendationEngineConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_REC_CONFIG);
      return saved ? JSON.parse(saved) : DEFAULT_RECOMMENDATION_CONFIG;
    } catch {
      return DEFAULT_RECOMMENDATION_CONFIG;
    }
  });

  // Persist states
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_COMPETENCIES, JSON.stringify(competencies));
  }, [competencies]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(engineConfig));
  }, [engineConfig]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_REC_CONFIG, JSON.stringify(recommendationConfig));
  }, [recommendationConfig]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ATTEMPTS, JSON.stringify(questionAttempts));
  }, [questionAttempts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_MATERIALS, JSON.stringify(materials));
  }, [materials]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ASSESSMENTS, JSON.stringify(assessmentResults));
  }, [assessmentResults]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_QUIZZES, JSON.stringify(quizResults));
  }, [quizResults]);

  // Load combined catalog from LearningProviderRegistry (iGOT + NSSTA)
  useEffect(() => {
    learningProviderRegistry.getAllResources().then((catalog) => {
      setCoursesCatalog(catalog);
    });
  }, []);

  // Compute evaluations dynamically based on current attempts and configuration
  const evaluationsRecord = evaluateAllCompetencies(questionAttempts, competencies, engineConfig);

  const getCompetencyEvaluation = (competencyId: string): CompetencyEvaluation => {
    if (evaluationsRecord[competencyId]) {
      return evaluationsRecord[competencyId];
    }
    const comp = competencies.find((c) => c.id === competencyId) || {
      id: competencyId,
      name: competencyId,
      targetScore: 75,
      currentScore: 50,
      domain: 'TECHNICAL' as const,
      proficiencyLevel: 'Foundational' as const,
      description: '',
    };
    const attempts = questionAttempts.filter((a) => a.competencyId === competencyId);
    return calculateCompetencyPerformance(
      attempts,
      comp.id,
      comp.targetScore,
      comp.name,
      engineConfig,
      attempts.length > 0 ? undefined : comp.currentScore
    );
  };

  const updateDifficultyWeights = (weights: Partial<DifficultyWeights>) => {
    setEngineConfig((prev) => ({
      ...prev,
      difficultyWeights: {
        ...prev.difficultyWeights,
        ...weights,
      },
    }));
  };

  const resetEngineConfig = () => {
    setEngineConfig(DEFAULT_ENGINE_CONFIG);
  };

  const updateRecommendationWeights = (weights: Partial<RecommendationEngineWeights>) => {
    setRecommendationConfig((prev) => ({
      ...prev,
      weights: {
        ...prev.weights,
        ...weights,
      },
    }));
  };

  const resetRecommendationWeights = () => {
    setRecommendationConfig(DEFAULT_RECOMMENDATION_CONFIG);
  };

  // Compute recommendations using deterministic recommendation engine
  const refreshRecommendations = () => {
    const catalog = coursesCatalog.length > 0 ? coursesCatalog : DEMO_IGOT_COURSES;
    const output = generatePersonalizedRecommendations(
      userProfile,
      competencies,
      catalog,
      questionAttempts,
      recommendationConfig
    );

    setRecommendations(output.recommendations);
    setExcludedStrongCompetencies(output.excludedStrongCompetencies);
    setRecommendationFormulaText(output.rankingFormulaText);
  };

  useEffect(() => {
    refreshRecommendations();
  }, [competencies, userProfile, questionAttempts, coursesCatalog, recommendationConfig]);

  const igotRecommendations = useMemo(() => {
    return recommendations.filter(
      (r) => r.providerType === 'iGOT' || r.source.toLowerCase().includes('igot')
    );
  }, [recommendations]);

  const nsstaRecommendations = useMemo(() => {
    return recommendations.filter(
      (r) => r.providerType === 'NSSTA' || r.source.toLowerCase().includes('nssta')
    );
  }, [recommendations]);

  const getRecommendationsByCompetency = useCallback(
    (competencyId: string) => {
      return recommendations.filter((r) => r.competencyId === competencyId);
    },
    [recommendations]
  );

  const getRecommendationsByProvider = useCallback(
    (provider: 'igot' | 'nssta' | string) => {
      const p = provider.toLowerCase();
      return recommendations.filter((r) => {
        if (p === 'igot') return r.providerType === 'iGOT' || r.source.toLowerCase().includes('igot');
        if (p === 'nssta') return r.providerType === 'NSSTA' || r.source.toLowerCase().includes('nssta');
        return true;
      });
    },
    [recommendations]
  );

  // Helpers
  const calculateGap = (target: number, current: number) => {
    return engineCalculateGap(target, current);
  };

  const getGapCategory = (gap: number): GapCategory => {
    return engineClassifyGap(gap, engineConfig.gapThresholds);
  };

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...profile }));
  };

  const updateCompetency = (id: string, updates: Partial<Competency>) => {
    setCompetencies((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const addCompetency = (comp: Omit<Competency, 'id'>) => {
    const newId = `custom-comp-${Date.now()}`;
    setCompetencies((prev) => [...prev, { ...comp, id: newId }]);
  };

  const resetCompetencies = () => {
    setCompetencies(DEFAULT_COMPETENCIES);
    setUserProfile(DEFAULT_USER_PROFILE);
    setMaterials(SAMPLE_LEARNING_MATERIALS);
    setAssessmentResults([]);
    setQuizResults([]);
    setQuestionAttempts(getInitialBaselineAttempts());
    setEngineConfig(DEFAULT_ENGINE_CONFIG);
    localStorage.clear();
  };

  const addMaterial = (mat: LearningMaterial) => {
    setMaterials((prev) => [mat, ...prev]);
  };

  const deleteMaterial = (id: string) => {
    setMaterials((prev) => prev.filter((m) => m.id !== id));
  };

  const enrollInCourse = async (courseId: string): Promise<boolean> => {
    const res = await igotAdapterInstance.recordEnrollment(courseId, userProfile.id);
    if (res.success) {
      setEnrolledCourses((prev) => (prev.includes(courseId) ? prev : [...prev, courseId]));
      return true;
    }
    return false;
  };

  const completeCourse = async (courseId: string): Promise<boolean> => {
    const res = await igotAdapterInstance.recordCompletion(courseId, userProfile.id);
    return res.success;
  };

  const startQuiz = (
    title: string,
    sourceTitle: string,
    questions: Question[],
    materialId?: string
  ) => {
    setActiveQuiz({ title, sourceTitle, questions, materialId });
    setActiveTab('quiz');
  };

  // Deterministic competency update upon quiz completion
  const submitQuiz = (
    quizTitle: string,
    sourceTitle: string,
    userAnswers: Record<string, number>,
    questions: Question[]
  ): QuizResult => {
    // 1. Store each question attempt with all 6 required fields:
    // competencyId, topic, difficulty, correctAnswer, user'sAnswer/userAnswer, correctness, quizId, timestamp
    const quizResultId = activeQuiz?.materialId || `quiz-${Date.now()}`;
    const timestampIso = new Date().toISOString();

    const newAttempts: QuestionAttempt[] = questions.map((q) =>
      createQuestionAttempt(q, userAnswers[q.id] ?? -1, quizResultId, timestampIso)
    );

    // Save attempts to history
    const allUpdatedAttempts = [...questionAttempts, ...newAttempts];
    setQuestionAttempts(allUpdatedAttempts);

    let totalCorrect = 0;
    newAttempts.forEach((a) => {
      if (a.correctness) totalCorrect++;
    });

    const scorePercentage =
      questions.length > 0 ? Math.round((totalCorrect / questions.length) * 100) : 0;

    // 2. Calculate competency performance separately for each competency
    const attemptsByComp: Record<string, QuestionAttempt[]> = {};
    newAttempts.forEach((a) => {
      if (!attemptsByComp[a.competencyId]) {
        attemptsByComp[a.competencyId] = [];
      }
      attemptsByComp[a.competencyId].push(a);
    });

    const competencyUpdates = Object.entries(attemptsByComp).map(([compId, attempts]) => {
      const comp = competencies.find((c) => c.id === compId) || {
        id: compId,
        name: 'Competency',
        targetScore: 75,
        currentScore: 50,
      };

      // Deterministic performance evaluation using difficulty weighting: Easy=1, Medium=1.5, Hard=2
      const compEvaluation = calculateCompetencyPerformance(
        attempts,
        compId,
        comp.targetScore,
        comp.name,
        engineConfig
      );

      const scoreBefore = comp.currentScore;
      // Update score deterministically: normalized score from attempted questions
      const scoreAfter = compEvaluation.currentScore;
      const delta = scoreAfter - scoreBefore;
      const previousGap = Math.max(comp.targetScore - scoreBefore, 0);
      const currentGap = Math.max(comp.targetScore - scoreAfter, 0);
      const gapReduction = previousGap - currentGap;

      return {
        competencyId: compId,
        competencyName: comp.name,
        scoreBefore,
        scoreAfter,
        delta,
        correctAnswers: compEvaluation.evidence.correctCount,
        totalQuestions: attempts.length,
        previousGap,
        currentGap,
        gapReduction,
        weakTopics: compEvaluation.evidence.weakTopics,
      };
    });

    // 3. Update competencies in state
    const updatedCompetencies = competencies.map((c) => {
      const update = competencyUpdates.find((u) => u.competencyId === c.id);
      if (update) {
        const history = c.history || [];
        return {
          ...c,
          currentScore: update.scoreAfter,
          history: [
            ...history,
            {
              date: new Date().toISOString().split('T')[0],
              score: update.scoreAfter,
              reason: `Completed "${quizTitle}" (${update.delta >= 0 ? '+' : ''}${update.delta}%)`,
            },
          ],
        };
      }
      return c;
    });

    setCompetencies(updatedCompetencies);

    // Refresh recommendations immediately with updated competencies and attempts
    const catalog = coursesCatalog.length > 0 ? coursesCatalog : DEMO_IGOT_COURSES;
    const output = generatePersonalizedRecommendations(
      userProfile,
      updatedCompetencies,
      catalog,
      allUpdatedAttempts,
      recommendationConfig
    );
    setRecommendations(output.recommendations);
    setExcludedStrongCompetencies(output.excludedStrongCompetencies);
    setRecommendationFormulaText(output.rankingFormulaText);

    // 4. Generate evidence-backed improvement areas
    const improvementAreas = competencyUpdates
      .filter((u) => u.correctAnswers < u.totalQuestions)
      .map((u) => {
        const evaluation = calculateCompetencyPerformance(
          attemptsByComp[u.competencyId] || [],
          u.competencyId,
          75,
          u.competencyName,
          engineConfig
        );
        const weakList = evaluation.evidence.weakTopics.join(', ');
        return `${u.competencyName}: ${u.totalQuestions - u.correctAnswers} incorrect. Weak topics: ${weakList || 'General'}.`;
      });

    const newResult: QuizResult = {
      id: `quiz-res-${Date.now()}`,
      quizId: quizResultId,
      quizTitle,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      scorePercentage,
      correctAnswersCount: totalCorrect,
      totalQuestions: questions.length,
      competencyUpdates,
      userAnswers,
      improvementAreas:
        improvementAreas.length > 0
          ? improvementAreas
          : ['All questions in this assessment were answered correctly! Ready for advanced modules.'],
      questionAttempts: newAttempts,
    };

    setQuizResults((prev) => [newResult, ...prev]);
    return newResult;
  };

  // Record complete diagnostic assessment result deterministically
  const recordAssessmentResult = (
    title: string,
    assessmentId: string,
    userAnswers: Record<string, number>,
    questions: Question[]
  ): AssessmentResult => {
    // 1. Store each question attempt with all 6 required fields
    const newAttempts: QuestionAttempt[] = questions.map((q) =>
      createQuestionAttempt(q, userAnswers[q.id] ?? -1)
    );

    // Save attempts to history
    setQuestionAttempts((prev) => [...prev, ...newAttempts]);

    let totalCorrect = 0;
    newAttempts.forEach((a) => {
      if (a.correctness) totalCorrect++;
    });

    const scorePercentage =
      questions.length > 0 ? Math.round((totalCorrect / questions.length) * 100) : 0;

    // Group attempts by competencyId and evaluate separately
    const attemptsByComp: Record<string, QuestionAttempt[]> = {};
    newAttempts.forEach((a) => {
      if (!attemptsByComp[a.competencyId]) {
        attemptsByComp[a.competencyId] = [];
      }
      attemptsByComp[a.competencyId].push(a);
    });

    const competencyEvaluations: Record<string, CompetencyEvaluation> = {};
    const competencyDeltas = Object.entries(attemptsByComp).map(([compId, attempts]) => {
      const comp = competencies.find((c) => c.id === compId) || {
        id: compId,
        name: compId,
        targetScore: 75,
        currentScore: 50,
      };

      const evalResult = calculateCompetencyPerformance(
        attempts,
        compId,
        comp.targetScore,
        comp.name,
        engineConfig
      );

      competencyEvaluations[compId] = evalResult;

      const scoreBefore = comp.currentScore;
      const scoreAfter = evalResult.currentScore;
      const delta = scoreAfter - scoreBefore;

      return {
        competencyId: compId,
        competencyName: comp.name,
        scoreBefore,
        scoreAfter,
        delta,
        correctAnswers: evalResult.evidence.correctCount,
        totalQuestions: attempts.length,
      };
    });

    // Update state
    setCompetencies((prev) =>
      prev.map((c) => {
        const deltaItem = competencyDeltas.find((d) => d.competencyId === c.id);
        if (deltaItem) {
          const history = c.history || [];
          return {
            ...c,
            currentScore: deltaItem.scoreAfter,
            history: [
              ...history,
              {
                date: new Date().toISOString().split('T')[0],
                score: deltaItem.scoreAfter,
                reason: `Diagnostic Assessment: "${title}" (${deltaItem.delta >= 0 ? '+' : ''}${deltaItem.delta}%)`,
              },
            ],
          };
        }
        return c;
      })
    );

    const newAssessmentResult: AssessmentResult = {
      id: `asmt-res-${Date.now()}`,
      assessmentId,
      title,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      scorePercentage,
      correctCount: totalCorrect,
      totalQuestions: questions.length,
      competencyDeltas,
      userAnswers,
      questionAttempts: newAttempts,
      competencyEvaluations,
    };

    setAssessmentResults((prev) => [newAssessmentResult, ...prev]);
    return newAssessmentResult;
  };

  return (
    <AppContext.Provider
      value={{
        userProfile,
        updateUserProfile,
        competencies,
        updateCompetency,
        addCompetency,
        resetCompetencies,
        calculateGap,
        getGapCategory,
        engineConfig,
        updateDifficultyWeights,
        resetEngineConfig,
        questionAttempts,
        getCompetencyEvaluation,
        evaluationsRecord,
        initialQuestions: INITIAL_ASSESSMENT_QUESTIONS,
        assessmentResults,
        quizResults,
        activeQuiz,
        startQuiz,
        submitQuiz,
        recordAssessmentResult,
        materials,
        addMaterial,
        deleteMaterial,
        recommendations,
        igotRecommendations,
        nsstaRecommendations,
        getRecommendationsByCompetency,
        getRecommendationsByProvider,
        enrolledCourses,
        enrollInCourse,
        completeCourse,
        coursesCatalog,
        refreshRecommendations,
        recommendationConfig,
        updateRecommendationWeights,
        resetRecommendationWeights,
        excludedStrongCompetencies,
        recommendationFormulaText,
        activeTab,
        setActiveTab,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
