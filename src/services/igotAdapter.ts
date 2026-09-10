import { LearningResource, Recommendation, UserProfile, Competency, QuestionAttempt } from '../types';
import { generatePersonalizedRecommendations, DEFAULT_RECOMMENDATION_CONFIG } from './recommendationEngine';
import { igotAdapter, DEMO_IGOT_COURSES } from './learningProviders';

export { DEMO_IGOT_COURSES } from './learningProviders';

export interface IGOTAdapter {
  getCourses(): Promise<LearningResource[]>;
  searchCourses(query: string, domain?: string): Promise<LearningResource[]>;
  getCourseDetails(courseId: string): Promise<LearningResource | null>;
  getRecommendations(
    profile: UserProfile,
    competenciesWithGaps: {
      competencyId: string;
      competencyName: string;
      currentScore: number;
      targetScore: number;
      gap: number;
    }[],
    questionAttempts?: QuestionAttempt[]
  ): Promise<Recommendation[]>;
  recordEnrollment(courseId: string, userId: string): Promise<{ success: boolean; message: string }>;
  recordCompletion(courseId: string, userId: string): Promise<{ success: boolean; message: string }>;
  getIntegrationStatus(): {
    mode: 'PROTOTYPE_MOCK' | 'LIVE_IGOT_API';
    label: string;
    description: string;
    apiEndpointConfigured: boolean;
    isDemoData: boolean;
  };
}

class MockIGOTAdapter implements IGOTAdapter {
  async getCourses(): Promise<LearningResource[]> {
    return igotAdapter.getResources();
  }

  async searchCourses(query: string, domain?: string): Promise<LearningResource[]> {
    return igotAdapter.searchResources(query, domain);
  }

  async getCourseDetails(courseId: string): Promise<LearningResource | null> {
    return igotAdapter.getResourceById(courseId);
  }

  async getRecommendations(
    profile: UserProfile,
    competenciesWithGaps: {
      competencyId: string;
      competencyName: string;
      currentScore: number;
      targetScore: number;
      gap: number;
    }[],
    questionAttempts: QuestionAttempt[] = []
  ): Promise<Recommendation[]> {
    const pseudoCompetencies: Competency[] = competenciesWithGaps.map((item) => ({
      id: item.competencyId,
      name: item.competencyName,
      currentScore: item.currentScore,
      targetScore: item.targetScore,
      domain: 'TECHNICAL',
      proficiencyLevel: 'Foundational',
      description: item.competencyName,
    }));

    const catalog = await igotAdapter.getResources();
    const result = generatePersonalizedRecommendations(
      profile,
      pseudoCompetencies,
      catalog,
      questionAttempts,
      DEFAULT_RECOMMENDATION_CONFIG
    );

    return result.recommendations;
  }

  async recordEnrollment(courseId: string, userId: string): Promise<{ success: boolean; message: string }> {
    return (await igotAdapter.recordEnrollment?.(courseId, userId)) || { success: true, message: 'Enrolled' };
  }

  async recordCompletion(courseId: string, userId: string): Promise<{ success: boolean; message: string }> {
    return (await igotAdapter.recordCompletion?.(courseId, userId)) || { success: true, message: 'Completed' };
  }

  getIntegrationStatus() {
    return {
      mode: 'PROTOTYPE_MOCK' as const,
      label: 'Prototype Mode — Demo iGOT / NSSTA Resources',
      description:
        'Demonstration catalog using prototype curriculum from NSSTA and iGOT Karmayogi frameworks. Live iGOT Karmayogi API integration is not active.',
      apiEndpointConfigured: false,
      isDemoData: true,
    };
  }
}

export const igotAdapterInstance: IGOTAdapter = new MockIGOTAdapter();
