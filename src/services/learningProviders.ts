import { LearningResource, LearningProvider, LearningProviderStatus } from '../types';

/**
 * ============================================================================
 * LEARNING PROVIDERS & ADAPTER ARCHITECTURE
 * ============================================================================
 * 
 * Provider Hierarchy:
 * LearningProvider (Interface)
 * ├── IGOTAdapter   ("iGOT Karmayogi — Prototype Adapter")
 * └── NSSTAAdapter  ("NSSTA / TPAC — Prototype Data")
 * 
 * Architecture Note:
 * This provider/adapter design isolates the learning catalog from the 
 * Recommendation Engine. When an authorized live API token becomes available,
 * a LiveIGOTAdapter or LiveNSSTAAdapter can replace the prototype adapters
 * without altering any recommendation or scoring algorithms.
 * ============================================================================
 */

export const IGOT_PROVIDER_NAME = 'iGOT Karmayogi — Prototype Adapter';
export const NSSTA_PROVIDER_NAME = 'NSSTA / TPAC — Prototype Data';

/**
 * Catalogue 1: iGOT Karmayogi Prototype Adapter Demo Resources
 * Fulfills Requirement 6: Contains learning resources for all 11 required areas:
 * Python, Data Quality, Survey Design, Sampling, National Accounts,
 * Labour Statistics, Agricultural Statistics, SDG Indicators,
 * Data Visualization, SQL, GIS.
 */
export const DEMO_IGOT_COURSES: LearningResource[] = [
  {
    id: 'igot-py-201',
    title: 'Python for Statistical Data Analysis & Vectorized Processing',
    competencyId: 'tech-python',
    competencyName: 'Python',
    domain: 'TECHNICAL',
    description: 'Vectorized survey aggregation with Pandas, memory-efficient data types, probability weight application, and automated batch report generation.',
    durationHours: 18,
    durationText: '18 hours',
    provider: IGOT_PROVIDER_NAME,
    providerType: 'iGOT',
    providerLabel: 'iGOT Karmayogi — Prototype Adapter',
    source: IGOT_PROVIDER_NAME,
    level: 'Foundational',
    difficulty: 'Foundational',
    rating: 4.9,
    enrolled: false,
    completed: false,
    isDemoData: true,
    modulesCount: 7,
    deliveryType: 'Self-Paced e-Learning',
    urlPlaceholder: 'https://igotkarmayogi.gov.in/course/demo-python-stat',
  },
  {
    id: 'igot-dq-101',
    title: 'Advanced Survey Data Quality Assurance & Anomaly Auditing',
    competencyId: 'stat-data-quality',
    competencyName: 'Data Quality',
    domain: 'STATISTICAL',
    description: 'Master automated range checks, inter-variable logical consistency rules, outlier boundaries with Median Absolute Deviation (MAD), and hot-deck donor imputation.',
    durationHours: 12,
    durationText: '12 hours',
    provider: IGOT_PROVIDER_NAME,
    providerType: 'iGOT',
    providerLabel: 'iGOT Karmayogi — Prototype Adapter',
    source: IGOT_PROVIDER_NAME,
    level: 'Intermediate',
    difficulty: 'Intermediate',
    rating: 4.8,
    enrolled: false,
    completed: false,
    isDemoData: true,
    modulesCount: 5,
    deliveryType: 'Self-Paced e-Learning',
    urlPlaceholder: 'https://igotkarmayogi.gov.in/course/demo-data-quality',
  },
  {
    id: 'igot-sd-101',
    title: 'National Socio-Economic Survey Instrument Design & CAPI Protocols',
    competencyId: 'stat-survey-design',
    competencyName: 'Survey Design',
    domain: 'STATISTICAL',
    description: 'Comprehensive design of household survey instruments, skip pattern logic in CSPro/ODK, cognitive pre-testing, and respondent burden minimization.',
    durationHours: 14,
    durationText: '14 hours',
    provider: IGOT_PROVIDER_NAME,
    providerType: 'iGOT',
    providerLabel: 'iGOT Karmayogi — Prototype Adapter',
    source: IGOT_PROVIDER_NAME,
    level: 'Advanced',
    difficulty: 'Advanced',
    rating: 4.8,
    enrolled: false,
    completed: false,
    isDemoData: true,
    modulesCount: 6,
    deliveryType: 'Self-Paced e-Learning',
    urlPlaceholder: 'https://igotkarmayogi.gov.in/course/demo-survey-design',
  },
  {
    id: 'igot-smp-201',
    title: 'Stratified Multi-Stage Cluster Sampling & Variance Estimation',
    competencyId: 'stat-sampling-methods',
    competencyName: 'Sampling Methods',
    domain: 'STATISTICAL',
    description: 'Probability proportional to size (PPS) sampling, first-stage unit (FSU) selection, multiplier calculation, and Taylor series linearization for design effects.',
    durationHours: 16,
    durationText: '16 hours',
    provider: IGOT_PROVIDER_NAME,
    providerType: 'iGOT',
    providerLabel: 'iGOT Karmayogi — Prototype Adapter',
    source: IGOT_PROVIDER_NAME,
    level: 'Advanced',
    difficulty: 'Advanced',
    rating: 4.9,
    enrolled: false,
    completed: false,
    isDemoData: true,
    modulesCount: 6,
    deliveryType: 'Self-Paced e-Learning',
    urlPlaceholder: 'https://igotkarmayogi.gov.in/course/demo-sampling-methods',
  },
  {
    id: 'igot-na-301',
    title: 'System of National Accounts (SNA 2008): GVA & GDP Compilation Standards',
    competencyId: 'stat-national-accounts',
    competencyName: 'National Accounts',
    domain: 'STATISTICAL',
    description: 'Gross Value Added at Basic Prices, production vs. product taxes/subsidies, double deflation in real terms, and MCA21 corporate financial statement integration.',
    durationHours: 24,
    durationText: '24 hours',
    provider: IGOT_PROVIDER_NAME,
    providerType: 'iGOT',
    providerLabel: 'iGOT Karmayogi — Prototype Adapter',
    source: IGOT_PROVIDER_NAME,
    level: 'Advanced',
    difficulty: 'Advanced',
    rating: 4.7,
    enrolled: false,
    completed: false,
    isDemoData: true,
    modulesCount: 8,
    deliveryType: 'Self-Paced e-Learning',
    urlPlaceholder: 'https://igotkarmayogi.gov.in/course/demo-national-accounts',
  },
  {
    id: 'igot-lab-101',
    title: 'Periodic Labour Force Survey (PLFS): Activity Status & Employment Indicators',
    competencyId: 'stat-labour-stats',
    competencyName: 'Labour Statistics',
    domain: 'STATISTICAL',
    description: 'Classification of Usual Principal and Subsidiary Status (UPSS), Current Weekly Status (CWS), informal enterprise identification, and worker population ratio formulas.',
    durationHours: 10,
    durationText: '10 hours',
    provider: IGOT_PROVIDER_NAME,
    providerType: 'iGOT',
    providerLabel: 'iGOT Karmayogi — Prototype Adapter',
    source: IGOT_PROVIDER_NAME,
    level: 'Intermediate',
    difficulty: 'Intermediate',
    rating: 4.6,
    enrolled: false,
    completed: false,
    isDemoData: true,
    modulesCount: 4,
    deliveryType: 'Self-Paced e-Learning',
    urlPlaceholder: 'https://igotkarmayogi.gov.in/course/demo-labour-stats',
  },
  {
    id: 'igot-agr-101',
    title: 'Agricultural Statistics, Crop Cutting Surveys & Land Records Integration',
    competencyId: 'stat-agri-stats',
    competencyName: 'Agricultural Statistics',
    domain: 'STATISTICAL',
    description: 'Methodology for General Crop Estimation Surveys (GCES), randomized plot marking, digital land record triangulation, and horticultural production modeling.',
    durationHours: 12,
    durationText: '12 hours',
    provider: IGOT_PROVIDER_NAME,
    providerType: 'iGOT',
    providerLabel: 'iGOT Karmayogi — Prototype Adapter',
    source: IGOT_PROVIDER_NAME,
    level: 'Intermediate',
    difficulty: 'Intermediate',
    rating: 4.6,
    enrolled: false,
    completed: false,
    isDemoData: true,
    modulesCount: 5,
    deliveryType: 'Self-Paced e-Learning',
    urlPlaceholder: 'https://igotkarmayogi.gov.in/course/demo-agri-stats',
  },
  {
    id: 'igot-sdg-101',
    title: 'National Indicator Framework (NIF) for Sustainable Development Goals (SDGs)',
    competencyId: 'stat-sdg-indicators',
    competencyName: 'SDG Indicators',
    domain: 'STATISTICAL',
    description: 'Tracking India-specific SDG indicators, data disaggregation guidelines, ministry data validation workflows, and international metadata submission.',
    durationHours: 8,
    durationText: '8 hours',
    provider: IGOT_PROVIDER_NAME,
    providerType: 'iGOT',
    providerLabel: 'iGOT Karmayogi — Prototype Adapter',
    source: IGOT_PROVIDER_NAME,
    level: 'Foundational',
    difficulty: 'Foundational',
    rating: 4.7,
    enrolled: false,
    completed: false,
    isDemoData: true,
    modulesCount: 4,
    deliveryType: 'Self-Paced e-Learning',
    urlPlaceholder: 'https://igotkarmayogi.gov.in/course/demo-sdg-indicators',
  },
  {
    id: 'igot-viz-101',
    title: 'Visual Storytelling of Official Indicators & Executive Dashboards',
    competencyId: 'tech-data-viz',
    competencyName: 'Data Visualization',
    domain: 'TECHNICAL',
    description: 'Crafting high-impact statistical infographics, thematic choropleth maps, and ministerial monitoring dashboards with verifiable metadata.',
    durationHours: 10,
    durationText: '10 hours',
    provider: IGOT_PROVIDER_NAME,
    providerType: 'iGOT',
    providerLabel: 'iGOT Karmayogi — Prototype Adapter',
    source: IGOT_PROVIDER_NAME,
    level: 'Intermediate',
    difficulty: 'Intermediate',
    rating: 4.8,
    enrolled: false,
    completed: true, // marked completed in profile to test duplicate prevention
    isDemoData: true,
    modulesCount: 4,
    deliveryType: 'Self-Paced e-Learning',
    urlPlaceholder: 'https://igotkarmayogi.gov.in/course/demo-data-viz',
  },
  {
    id: 'igot-sql-101',
    title: 'Relational Database Querying & SQL for Large-Scale Survey Microdata',
    competencyId: 'tech-sql',
    competencyName: 'SQL',
    domain: 'TECHNICAL',
    description: 'Window functions, nested subqueries, indexing high-volume household survey records, and joining multi-round respondent panels in PostgreSQL.',
    durationHours: 14,
    durationText: '14 hours',
    provider: IGOT_PROVIDER_NAME,
    providerType: 'iGOT',
    providerLabel: 'iGOT Karmayogi — Prototype Adapter',
    source: IGOT_PROVIDER_NAME,
    level: 'Intermediate',
    difficulty: 'Intermediate',
    rating: 4.7,
    enrolled: false,
    completed: false,
    isDemoData: true,
    modulesCount: 5,
    deliveryType: 'Self-Paced e-Learning',
    urlPlaceholder: 'https://igotkarmayogi.gov.in/course/demo-sql-survey',
  },
  {
    id: 'igot-gis-201',
    title: 'GIS Mapping & Spatial Demarcation of Primary Sampling Units (PSUs)',
    competencyId: 'tech-gis',
    competencyName: 'GIS',
    domain: 'TECHNICAL',
    description: 'Using QGIS and spatial shapefiles to demarcate Primary Sampling Units, avoid boundary overlap in rural clusters, and layer satellite imagery for field maps.',
    durationHours: 14,
    durationText: '14 hours',
    provider: IGOT_PROVIDER_NAME,
    providerType: 'iGOT',
    providerLabel: 'iGOT Karmayogi — Prototype Adapter',
    source: IGOT_PROVIDER_NAME,
    level: 'Intermediate',
    difficulty: 'Intermediate',
    rating: 4.7,
    enrolled: false,
    completed: false,
    isDemoData: true,
    modulesCount: 6,
    deliveryType: 'Self-Paced e-Learning',
    urlPlaceholder: 'https://igotkarmayogi.gov.in/course/demo-gis-psu',
  },
];

/**
 * Catalogue 2: NSSTA / TPAC Prototype Data Training Programmes
 * Fulfills Requirement 7: Separate small catalogue for NSSTA/TPAC-style
 * training programmes focused on Official Statistics with delivery types:
 * Residential Training, In-Person Workshop, Blended Hybrid, Executive Masterclass.
 */
export const DEMO_NSSTA_PROGRAMMES: LearningResource[] = [
  {
    id: 'nssta-prog-dq-01',
    title: 'NSSTA Advanced Workshop on Survey Data Validation & Imputation Protocols',
    programmeName: 'National Workshop on Microdata Quality & Imputation',
    competencyId: 'stat-data-quality',
    competencyName: 'Data Quality',
    domain: 'STATISTICAL',
    description: 'In-depth residential hands-on practicum for Statistical Officers covering computer-assisted personal interview (CAPI) validation filters, donor imputation methods, and field audit strategies.',
    durationHours: 35,
    durationText: '5-Day Residential (35 Hours)',
    provider: NSSTA_PROVIDER_NAME,
    providerType: 'NSSTA',
    providerLabel: 'NSSTA / TPAC — Prototype Data',
    source: NSSTA_PROVIDER_NAME,
    level: 'Intermediate',
    difficulty: 'Intermediate',
    rating: 4.9,
    enrolled: false,
    completed: false,
    isDemoData: true,
    modulesCount: 5,
    deliveryType: 'Residential Training',
    urlPlaceholder: 'https://nssta.gov.in/programmes/dq-residential-2026',
  },
  {
    id: 'nssta-prog-py-02',
    title: 'Executive Lab: Python Automation for Large-Scale Microdata Tabulation',
    programmeName: 'Python for Official Statistics Practitioners Lab',
    competencyId: 'tech-python',
    competencyName: 'Python',
    domain: 'TECHNICAL',
    description: 'Hands-on coding lab at NSSTA computer facilities focusing on memory-efficient Pandas processing of Census and NSS unit-level microdata tables.',
    durationHours: 21,
    durationText: '3-Day Practical Lab (21 Hours)',
    provider: NSSTA_PROVIDER_NAME,
    providerType: 'NSSTA',
    providerLabel: 'NSSTA / TPAC — Prototype Data',
    source: NSSTA_PROVIDER_NAME,
    level: 'Foundational',
    difficulty: 'Foundational',
    rating: 4.9,
    enrolled: false,
    completed: false,
    isDemoData: true,
    modulesCount: 4,
    deliveryType: 'In-Person Workshop',
    urlPlaceholder: 'https://nssta.gov.in/programmes/python-lab-2026',
  },
  {
    id: 'nssta-prog-na-03',
    title: 'National Accounts Division (NAD) Intensive: SNA 2008 & Regional SVOA Compilation',
    programmeName: 'NAD Residential Masterclass in GSDP Compilation',
    competencyId: 'stat-national-accounts',
    competencyName: 'National Accounts',
    domain: 'STATISTICAL',
    description: 'Comprehensive technical training for officers on Gross State Domestic Product (GSDP), supply-use tables (SUT), double deflation index series, and corporate financial data integration.',
    durationHours: 70,
    durationText: '2-Week Residential Intensive (70 Hours)',
    provider: NSSTA_PROVIDER_NAME,
    providerType: 'NSSTA',
    providerLabel: 'NSSTA / TPAC — Prototype Data',
    source: NSSTA_PROVIDER_NAME,
    level: 'Advanced',
    difficulty: 'Advanced',
    rating: 4.8,
    enrolled: false,
    completed: false,
    isDemoData: true,
    modulesCount: 10,
    deliveryType: 'Residential Training',
    urlPlaceholder: 'https://nssta.gov.in/programmes/nad-intensive-2026',
  },
  {
    id: 'nssta-prog-smp-04',
    title: 'TPAC Masterclass on Complex Sampling Designs & Multi-Stage PPS Selection',
    programmeName: 'TPAC Masterclass in Survey Sampling Design',
    competencyId: 'stat-sampling-methods',
    competencyName: 'Sampling Methods',
    domain: 'STATISTICAL',
    description: 'Theoretical and operational training on circular systematic PPS sampling, Urban Frame Survey (UFS) updating, and sub-sample replication for calculating Design Effects.',
    durationHours: 28,
    durationText: '4-Week Blended (28 Hours)',
    provider: NSSTA_PROVIDER_NAME,
    providerType: 'NSSTA',
    providerLabel: 'NSSTA / TPAC — Prototype Data',
    source: NSSTA_PROVIDER_NAME,
    level: 'Advanced',
    difficulty: 'Advanced',
    rating: 4.9,
    enrolled: false,
    completed: false,
    isDemoData: true,
    modulesCount: 6,
    deliveryType: 'Blended Hybrid',
    urlPlaceholder: 'https://nssta.gov.in/programmes/tpac-sampling-2026',
  },
  {
    id: 'nssta-prog-lab-05',
    title: 'PLFS Operational Seminar: Activity Status Coding & Seasonal Volatility',
    programmeName: 'PLFS Official Indicators Certification Seminar',
    competencyId: 'stat-labour-stats',
    competencyName: 'Labour Statistics',
    domain: 'STATISTICAL',
    description: 'Specialized training on Usual Principal and Subsidiary Status (UPSS) and Current Weekly Status (CWS) classification for official quarterly labour bulletins.',
    durationHours: 18,
    durationText: '3-Day Seminar (18 Hours)',
    provider: NSSTA_PROVIDER_NAME,
    providerType: 'NSSTA',
    providerLabel: 'NSSTA / TPAC — Prototype Data',
    source: NSSTA_PROVIDER_NAME,
    level: 'Intermediate',
    difficulty: 'Intermediate',
    rating: 4.7,
    enrolled: false,
    completed: false,
    isDemoData: true,
    modulesCount: 4,
    deliveryType: 'In-Person Workshop',
    urlPlaceholder: 'https://nssta.gov.in/programmes/plfs-seminar-2026',
  },
  {
    id: 'nssta-prog-gis-06',
    title: 'Spatial GIS & Urban Frame Survey Block Demarcation Intensive',
    programmeName: 'NSSTA Applied GIS for Official Demarcation',
    competencyId: 'tech-gis',
    competencyName: 'GIS',
    domain: 'TECHNICAL',
    description: 'GIS lab on digitizing cadastral village maps, creating shapefiles for field enumeration blocks, and geo-tagging CAPI sample households.',
    durationHours: 24,
    durationText: '4-Day Executive Lab (24 Hours)',
    provider: NSSTA_PROVIDER_NAME,
    providerType: 'NSSTA',
    providerLabel: 'NSSTA / TPAC — Prototype Data',
    source: NSSTA_PROVIDER_NAME,
    level: 'Intermediate',
    difficulty: 'Intermediate',
    rating: 4.8,
    enrolled: false,
    completed: false,
    isDemoData: true,
    modulesCount: 5,
    deliveryType: 'Executive Masterclass',
    urlPlaceholder: 'https://nssta.gov.in/programmes/gis-intensive-2026',
  },
  {
    id: 'nssta-prog-sdg-07',
    title: 'SDG National Indicator Framework (NIF) Multi-Departmental Workshop',
    programmeName: 'Inter-Agency SDG NIF Harmonization Workshop',
    competencyId: 'stat-sdg-indicators',
    competencyName: 'SDG Indicators',
    domain: 'STATISTICAL',
    description: 'Workshop on harmonizing state-level SDG monitoring reports with national NIF metadata guidelines and MoSPI quality benchmarks.',
    durationHours: 16,
    durationText: '2-Day Workshop (16 Hours)',
    provider: NSSTA_PROVIDER_NAME,
    providerType: 'NSSTA',
    providerLabel: 'NSSTA / TPAC — Prototype Data',
    source: NSSTA_PROVIDER_NAME,
    level: 'Intermediate',
    difficulty: 'Intermediate',
    rating: 4.7,
    enrolled: false,
    completed: false,
    isDemoData: true,
    modulesCount: 3,
    deliveryType: 'In-Person Workshop',
    urlPlaceholder: 'https://nssta.gov.in/programmes/sdg-nif-2026',
  },
];

/**
 * IGOTAdapter: Concrete implementation of LearningProvider for iGOT Karmayogi
 */
export class IGOTAdapter implements LearningProvider {
  public readonly providerId = 'igot';
  public readonly providerName = 'iGOT Karmayogi';
  public readonly providerLabel = IGOT_PROVIDER_NAME;
  public readonly isLiveApi = false;

  private courses: LearningResource[] = [...DEMO_IGOT_COURSES];

  async getResources(): Promise<LearningResource[]> {
    return Promise.resolve([...this.courses]);
  }

  async searchResources(query: string, domain?: string): Promise<LearningResource[]> {
    const q = query.toLowerCase().trim();
    return this.courses.filter((course) => {
      const matchesText =
        !q ||
        course.title.toLowerCase().includes(q) ||
        course.description.toLowerCase().includes(q) ||
        course.competencyName.toLowerCase().includes(q);
      const matchesDomain = !domain || domain === 'ALL' || course.domain === domain;
      return matchesText && matchesDomain;
    });
  }

  async getResourceById(id: string): Promise<LearningResource | null> {
    return this.courses.find((c) => c.id === id) || null;
  }

  async recordEnrollment(resourceId: string, _userId: string): Promise<{ success: boolean; message: string }> {
    const course = this.courses.find((c) => c.id === resourceId);
    if (!course) {
      return { success: false, message: 'Resource not found in iGOT repository' };
    }
    course.enrolled = true;
    return {
      success: true,
      message: `Enrolled in "${course.title}". Course sync token generated for iGOT Karmayogi prototype.`,
    };
  }

  async recordCompletion(resourceId: string, _userId: string): Promise<{ success: boolean; message: string }> {
    const course = this.courses.find((c) => c.id === resourceId);
    if (!course) {
      return { success: false, message: 'Resource not found in iGOT repository' };
    }
    course.completed = true;
    return {
      success: true,
      message: `Resource marked as completed in iGOT Karmayogi prototype ledger.`,
    };
  }

  getStatus(): LearningProviderStatus {
    return {
      mode: 'PROTOTYPE_ADAPTER',
      label: 'iGOT Karmayogi — Prototype Adapter',
      description: 'iGOT Karmayogi integration: PROTOTYPE ADAPTER — NOT A LIVE API INTEGRATION.',
      apiEndpointConfigured: false,
      isDemoData: true,
    };
  }
}

/**
 * NSSTAAdapter: Concrete implementation of LearningProvider for NSSTA / TPAC
 */
export class NSSTAAdapter implements LearningProvider {
  public readonly providerId = 'nssta';
  public readonly providerName = 'NSSTA / TPAC';
  public readonly providerLabel = NSSTA_PROVIDER_NAME;
  public readonly isLiveApi = false;

  private programmes: LearningResource[] = [...DEMO_NSSTA_PROGRAMMES];

  async getResources(): Promise<LearningResource[]> {
    return Promise.resolve([...this.programmes]);
  }

  async searchResources(query: string, domain?: string): Promise<LearningResource[]> {
    const q = query.toLowerCase().trim();
    return this.programmes.filter((prog) => {
      const matchesText =
        !q ||
        prog.title.toLowerCase().includes(q) ||
        (prog.programmeName && prog.programmeName.toLowerCase().includes(q)) ||
        prog.description.toLowerCase().includes(q) ||
        prog.competencyName.toLowerCase().includes(q);
      const matchesDomain = !domain || domain === 'ALL' || prog.domain === domain;
      return matchesText && matchesDomain;
    });
  }

  async getResourceById(id: string): Promise<LearningResource | null> {
    return this.programmes.find((p) => p.id === id) || null;
  }

  async recordEnrollment(resourceId: string, _userId: string): Promise<{ success: boolean; message: string }> {
    const prog = this.programmes.find((p) => p.id === resourceId);
    if (!prog) {
      return { success: false, message: 'Programme not found in NSSTA catalogue' };
    }
    prog.enrolled = true;
    return {
      success: true,
      message: `Nomination recorded for NSSTA programme "${prog.title}". Training seat reserved.`,
    };
  }

  async recordCompletion(resourceId: string, _userId: string): Promise<{ success: boolean; message: string }> {
    const prog = this.programmes.find((p) => p.id === resourceId);
    if (!prog) {
      return { success: false, message: 'Programme not found' };
    }
    prog.completed = true;
    return {
      success: true,
      message: `NSSTA training attendance verified. Official statistics participation certificate dispatched.`,
    };
  }

  getStatus(): LearningProviderStatus {
    return {
      mode: 'PROTOTYPE_ADAPTER',
      label: 'NSSTA / TPAC — Prototype Data',
      description: 'NSSTA / TPAC integration: PROTOTYPE DATA — NOT A LIVE PRODUCTION INTEGRATION.',
      apiEndpointConfigured: false,
      isDemoData: true,
    };
  }
}

/**
 * LearningProviderRegistry: Manages provider adapters and aggregates resources
 */
export class LearningProviderRegistry {
  private providers: Map<string, LearningProvider> = new Map();

  constructor() {
    this.register(new IGOTAdapter());
    this.register(new NSSTAAdapter());
  }

  register(provider: LearningProvider): void {
    this.providers.set(provider.providerId, provider);
  }

  getProvider(providerId: string): LearningProvider | undefined {
    return this.providers.get(providerId);
  }

  getAllProviders(): LearningProvider[] {
    return Array.from(this.providers.values());
  }

  async getAllResources(): Promise<LearningResource[]> {
    const results = await Promise.all(
      this.getAllProviders().map((provider) => provider.getResources())
    );
    return results.flat();
  }

  async getResourcesByProvider(providerId: string): Promise<LearningResource[]> {
    const provider = this.getProvider(providerId);
    if (!provider) return [];
    return provider.getResources();
  }

  async searchAll(query: string, domain?: string): Promise<LearningResource[]> {
    const results = await Promise.all(
      this.getAllProviders().map((provider) => provider.searchResources(query, domain))
    );
    return results.flat();
  }
}

// Singleton instances for use across the application
export const igotAdapter = new IGOTAdapter();
export const nsstaAdapter = new NSSTAAdapter();
export const learningProviderRegistry = new LearningProviderRegistry();
