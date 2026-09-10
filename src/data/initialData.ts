import { Competency, Question, UserProfile, LearningMaterial, LearnerSummary } from '../types';

export const DEFAULT_USER_PROFILE: UserProfile = {
  id: 'learner-001',
  name: 'Ananya Rao',
  designation: 'Statistical Officer',
  department: 'Department of Statistics (Field Operations Division)',
  jobRole: 'Statistical Officer — Survey Design & Socio-Economic Analysis',
  yearsOfExperience: 4,
  qualification: 'M.Sc. Statistics (Gold Medalist), University of Delhi',
  previousTraining: [
    'NSSTA Induction Training in Official Statistics (2022)',
    'National Sample Survey (NSS) Field Verification & Listing',
    'Introductory R for Statistical Tabulation',
    'Data Governance & Statistical Confidentiality Workshop',
  ],
  currentSkills: [
    'Household Survey Design',
    'Stratified Multi-Stage Sampling',
    'Field Non-Response Imputation',
    'Excel & CSPro Data Auditing',
    'Descriptive Statistical Summaries',
    'Basic R Scripting',
  ],
  email: 'ananya.rao@mospi.gov.in (demo)',
};

export const DEFAULT_COMPETENCIES: Competency[] = [
  // STATISTICAL DOMAIN
  {
    id: 'stat-survey-design',
    name: 'Survey Design',
    domain: 'STATISTICAL',
    currentScore: 84,
    targetScore: 75,
    proficiencyLevel: 'Advanced',
    description: 'Design of nationwide socio-economic survey instruments, questionnaire framing, and pilot testing.',
    history: [{ date: '2026-08-15', score: 84, reason: 'Annual NSO Competency Review' }],
  },
  {
    id: 'stat-sampling-methods',
    name: 'Sampling Methods',
    domain: 'STATISTICAL',
    currentScore: 78,
    targetScore: 75,
    proficiencyLevel: 'Advanced',
    description: 'Probability sampling, multi-stage stratified sampling, cluster weighting, and sampling error estimation.',
    history: [{ date: '2026-08-15', score: 78, reason: 'Annual NSO Competency Review' }],
  },
  {
    id: 'stat-data-quality',
    name: 'Data Quality',
    domain: 'STATISTICAL',
    currentScore: 49,
    targetScore: 80,
    proficiencyLevel: 'Intermediate',
    description: 'Automated data validation rules, outlier detection, cross-validation, and non-sampling error reduction.',
    history: [{ date: '2026-08-15', score: 49, reason: 'Diagnostic Evaluation' }],
  },
  {
    id: 'stat-national-accounts',
    name: 'National Accounts',
    domain: 'STATISTICAL',
    currentScore: 55,
    targetScore: 75,
    proficiencyLevel: 'Foundational',
    description: 'Gross Value Added (GVA), Gross Domestic Product (GDP), Input-Output tables, and System of National Accounts (SNA).',
    history: [{ date: '2026-08-15', score: 55, reason: 'Baseline Assessment' }],
  },
  {
    id: 'stat-labour-stats',
    name: 'Labour Statistics',
    domain: 'STATISTICAL',
    currentScore: 52,
    targetScore: 75,
    proficiencyLevel: 'Intermediate',
    description: 'Periodic Labour Force Survey (PLFS) metrics, Worker Population Ratio (WPR), and informal sector employment.',
    history: [{ date: '2026-08-15', score: 52, reason: 'PLFS Rotation Evaluation' }],
  },
  {
    id: 'stat-agri-stats',
    name: 'Agricultural Statistics',
    domain: 'STATISTICAL',
    currentScore: 60,
    targetScore: 75,
    proficiencyLevel: 'Intermediate',
    description: 'Crop cutting experiments, land use statistics, agricultural census, and horticultural estimates.',
    history: [{ date: '2026-08-15', score: 60, reason: 'Baseline Assessment' }],
  },
  {
    id: 'stat-sdg-indicators',
    name: 'SDG Indicators',
    domain: 'STATISTICAL',
    currentScore: 72,
    targetScore: 80,
    proficiencyLevel: 'Advanced',
    description: 'National Indicator Framework (NIF) for UN Sustainable Development Goals, baseline tracking, and metadata.',
    history: [{ date: '2026-08-15', score: 72, reason: 'NIF Annual Report Compilation' }],
  },

  // TECHNICAL DOMAIN
  {
    id: 'tech-python',
    name: 'Python',
    domain: 'TECHNICAL',
    currentScore: 42,
    targetScore: 75,
    proficiencyLevel: 'Foundational',
    description: 'Data manipulation with Pandas, NumPy, statistical modeling, data cleaning pipelines, and automation.',
    history: [{ date: '2026-08-15', score: 42, reason: 'Technical Baseline Quiz' }],
  },
  {
    id: 'tech-r',
    name: 'R',
    domain: 'TECHNICAL',
    currentScore: 66,
    targetScore: 75,
    proficiencyLevel: 'Intermediate',
    description: 'Tidyverse data wrangling, survey package analysis, statistical inference, and reproducible reporting.',
    history: [{ date: '2026-08-15', score: 66, reason: 'NSSTA R Certification' }],
  },
  {
    id: 'tech-sql',
    name: 'SQL',
    domain: 'TECHNICAL',
    currentScore: 68,
    targetScore: 75,
    proficiencyLevel: 'Intermediate',
    description: 'Relational querying, aggregation across national microdata tables, window functions, and indexing.',
    history: [{ date: '2026-08-15', score: 68, reason: 'Database Practical' }],
  },
  {
    id: 'tech-data-viz',
    name: 'Data Visualization',
    domain: 'TECHNICAL',
    currentScore: 61,
    targetScore: 75,
    proficiencyLevel: 'Intermediate',
    description: 'Executive dashboards, thematic mapping, visual storytelling of socio-economic indicators, and ggplot2/seaborn.',
    history: [{ date: '2026-08-15', score: 61, reason: 'Annual Report Visual Evaluation' }],
  },
  {
    id: 'tech-aiml',
    name: 'AI/ML',
    domain: 'TECHNICAL',
    currentScore: 30,
    targetScore: 65,
    proficiencyLevel: 'Foundational',
    description: 'Machine learning for automated text classification of survey occupations, anomaly detection, and satellite imagery analysis.',
    history: [{ date: '2026-08-15', score: 30, reason: 'Emerging Tech Screening' }],
  },
  {
    id: 'tech-gis',
    name: 'GIS',
    domain: 'TECHNICAL',
    currentScore: 36,
    targetScore: 70,
    proficiencyLevel: 'Foundational',
    description: 'Geographic Information Systems for Primary Sampling Unit (PSU) delineation, spatial sampling, and raster overlays.',
    history: [{ date: '2026-08-15', score: 36, reason: 'Spatial Survey Audit' }],
  },
  {
    id: 'tech-apis',
    name: 'APIs',
    domain: 'TECHNICAL',
    currentScore: 40,
    targetScore: 70,
    proficiencyLevel: 'Foundational',
    description: 'Consuming REST APIs for Open Government Data (data.gov.in), webhook integrations, and JSON payload handling.',
    history: [{ date: '2026-08-15', score: 40, reason: 'System Connectivity Audit' }],
  },

  // DIGITAL GOVERNANCE DOMAIN
  {
    id: 'gov-cybersecurity',
    name: 'Cybersecurity',
    domain: 'DIGITAL_GOVERNANCE',
    currentScore: 38,
    targetScore: 70,
    proficiencyLevel: 'Foundational',
    description: 'Securing statistical servers, endpoint security in field tablets, CERT-In compliance, and encryption of microdata.',
    history: [{ date: '2026-08-15', score: 38, reason: 'IT Security Baseline' }],
  },
  {
    id: 'gov-data-privacy',
    name: 'Data Privacy',
    domain: 'DIGITAL_GOVERNANCE',
    currentScore: 45,
    targetScore: 75,
    proficiencyLevel: 'Foundational',
    description: 'Digital Personal Data Protection (DPDP) Act compliance, statistical disclosure control, k-anonymity, and consent management.',
    history: [{ date: '2026-08-15', score: 45, reason: 'DPDP Readiness Audit' }],
  },
  {
    id: 'gov-cloud',
    name: 'Government Cloud',
    domain: 'DIGITAL_GOVERNANCE',
    currentScore: 35,
    targetScore: 65,
    proficiencyLevel: 'Foundational',
    description: 'MeghRaj (GI Cloud) architectures, sovereign data residency, S3/object storage for national archives, and containerization.',
    history: [{ date: '2026-08-15', score: 35, reason: 'Cloud Migration Baseline' }],
  },
  {
    id: 'gov-dpi',
    name: 'Digital Public Infrastructure',
    domain: 'DIGITAL_GOVERNANCE',
    currentScore: 55,
    targetScore: 70,
    proficiencyLevel: 'Intermediate',
    description: 'India Stack integrations, Aadhaar data vaults, DigiLocker data verification, and Unified Data Integration frameworks.',
    history: [{ date: '2026-08-15', score: 55, reason: 'DPI Integration Review' }],
  },

  // BEHAVIOURAL / MANAGERIAL DOMAIN
  {
    id: 'mgr-communication',
    name: 'Communication',
    domain: 'BEHAVIOURAL_MANAGERIAL',
    currentScore: 70,
    targetScore: 75,
    proficiencyLevel: 'Intermediate',
    description: 'Translating complex econometric outputs into policy briefs, ministerial notes, and inter-departmental memos.',
    history: [{ date: '2026-08-15', score: 70, reason: 'Annual Appraisal' }],
  },
  {
    id: 'mgr-leadership',
    name: 'Leadership',
    domain: 'BEHAVIOURAL_MANAGERIAL',
    currentScore: 58,
    targetScore: 70,
    proficiencyLevel: 'Intermediate',
    description: 'Leading field investigator teams, regional survey dispatch coordination, and fostering team morale in tough environments.',
    history: [{ date: '2026-08-15', score: 58, reason: 'Field Team Evaluation' }],
  },
  {
    id: 'mgr-project-mgmt',
    name: 'Project Management',
    domain: 'BEHAVIOURAL_MANAGERIAL',
    currentScore: 65,
    targetScore: 75,
    proficiencyLevel: 'Intermediate',
    description: 'Survey round scheduling, milestone tracking, resource allocation for CAPI (Computer-Assisted Personal Interviewing).',
    history: [{ date: '2026-08-15', score: 65, reason: 'Survey Round Review' }],
  },
  {
    id: 'mgr-decision-making',
    name: 'Decision Making',
    domain: 'BEHAVIOURAL_MANAGERIAL',
    currentScore: 64,
    targetScore: 75,
    proficiencyLevel: 'Intermediate',
    description: 'Evidence-based decisions on outlier trimming, survey replacement rules, and sampling strata adjustments.',
    history: [{ date: '2026-08-15', score: 64, reason: 'Supervisory Assessment' }],
  },
  {
    id: 'mgr-change-mgmt',
    name: 'Change Management',
    domain: 'BEHAVIOURAL_MANAGERIAL',
    currentScore: 50,
    targetScore: 70,
    proficiencyLevel: 'Intermediate',
    description: 'Transitioning from paper schedules (PAPI) to tablet-based CAPI systems and continuous digital workflow updates.',
    history: [{ date: '2026-08-15', score: 50, reason: 'Digital Transformation Audit' }],
  },
  {
    id: 'mgr-ethics',
    name: 'Ethics',
    domain: 'BEHAVIOURAL_MANAGERIAL',
    currentScore: 88,
    targetScore: 80,
    proficiencyLevel: 'Expert',
    description: 'UN Fundamental Principles of Official Statistics, neutrality, impartiality, confidentiality, and prevention of data manipulation.',
    history: [{ date: '2026-08-15', score: 88, reason: 'Civil Service Ethics Compliance' }],
  },
];

export const INITIAL_ASSESSMENT_QUESTIONS: Question[] = [
  // Statistical - Data Quality
  {
    id: 'q-dq-01',
    competencyId: 'stat-data-quality',
    topic: 'Automated Range & Consistency Checks',
    difficulty: 'Medium',
    question: 'In large-scale socio-economic surveys, which automated validation rule is most appropriate for detecting impossible respondent entries (such as a 6-year-old married individual)?',
    options: [
      'Univariate Z-score outlier filter',
      'Inter-variable relational consistency validation rule',
      'Stratified cluster random sampling verify rule',
      'Simple median imputation without cross-referencing',
    ],
    correctAnswer: 1,
    explanation: 'Inter-variable consistency checks cross-examine multiple responses (e.g., Age vs. Marital Status or Schooling vs. Employment) to flag logical impossibilities before data aggregation.',
  },
  {
    id: 'q-dq-02',
    competencyId: 'stat-data-quality',
    topic: 'Non-Sampling Error Mitigation',
    difficulty: 'Hard',
    question: 'When high item-nonresponse occurs in monthly consumption expenditure surveys, which method preserves the underlying multivariate distribution most effectively?',
    options: [
      'Unconditional mean substitution',
      'Hot-deck nearest-neighbor imputation within post-stratification cells',
      'Exclusion of the entire household record from sampling weights',
      'Zero value replacement for unreported commodities',
    ],
    correctAnswer: 1,
    explanation: 'Hot-deck imputation replaces missing values with observed responses from a matched donor respondent within the same demographic/geographic stratum, preserving variance and covariance structures.',
  },

  // Technical - Python
  {
    id: 'q-py-01',
    competencyId: 'tech-python',
    topic: 'Pandas',
    difficulty: 'Easy',
    question: 'In Pandas, what is the most efficient and idiomatic way to calculate the district-level weighted average consumer expenditure per household?',
    options: [
      'A nested for-loop iterating over rows with `iterrows()`',
      'Using `df.groupby("district").apply(lambda g: np.average(g["expenditure"], weights=g["weight"]))`',
      'Sorting values with `.sort_values()` and slicing list indexes manually',
      'Converting the dataframe to a Python dictionary and running recursion',
    ],
    correctAnswer: 1,
    explanation: '`groupby().apply()` with NumPy’s vectorized weighted average computes the metric cleanly without slow row-by-row iteration in Python bytecode.',
  },
  {
    id: 'q-py-02',
    competencyId: 'tech-python',
    topic: 'Data Cleaning',
    difficulty: 'Easy',
    question: 'Which Pandas method correctly identifies missing values in numerical columns of a survey microdata table?',
    options: [
      'df.iszero()',
      'df.isna().sum()',
      'df.filter_empty()',
      'df.drop_duplicates()',
    ],
    correctAnswer: 1,
    explanation: '`df.isna().sum()` checks for NaN/null values across each column and returns the count of missing items.',
  },
  {
    id: 'q-py-03',
    competencyId: 'tech-python',
    topic: 'Data Analysis',
    difficulty: 'Medium',
    question: 'When analyzing survey microdata with sampling weights in Python, how should the population mean of a socio-economic indicator be estimated?',
    options: [
      'Simple arithmetic mean: df["indicator"].mean() without weights',
      'Probability-weighted sum divided by the sum of sample weights: (df["indicator"] * df["weight"]).sum() / df["weight"].sum()',
      'Harmonic mean of indicator multiplied by sample size',
      'Median of first 100 observations regardless of stratum',
    ],
    correctAnswer: 1,
    explanation: 'Valid population inference requires weighting each observation by its inverse inclusion probability multiplier.',
  },
  {
    id: 'q-py-04',
    competencyId: 'tech-python',
    topic: 'Pandas',
    difficulty: 'Medium',
    question: 'To dramatically lower RAM utilization when processing national survey microdata containing repetitive categorical strings (like State and District codes), which operation is recommended?',
    options: [
      'Storing everything as 64-bit Python objects',
      'Converting repetitive text columns to the categorical datatype: df[col] = df[col].astype("category")',
      'Writing every row to separate text files on disk',
      'Converting all numbers into strings',
    ],
    correctAnswer: 1,
    explanation: 'Downcasting repetitive strings to categorical types can reduce memory usage by up to 80% on large survey datasets.',
  },
  {
    id: 'q-py-05',
    competencyId: 'tech-python',
    topic: 'Data Cleaning',
    difficulty: 'Medium',
    question: 'In survey data cleaning pipelines, which method detects and removes duplicated respondent schedule records based on unique household ID and sample round?',
    options: [
      'df.drop_duplicates(subset=["household_id", "round"])',
      'df.remove_twins()',
      'df.filter(lambda row: row.unique)',
      'df.sort_values(ascending=False)',
    ],
    correctAnswer: 0,
    explanation: '`df.drop_duplicates(subset=[...])` removes duplicate records based on the specified unique key columns.',
  },
  {
    id: 'q-py-06',
    competencyId: 'tech-python',
    topic: 'Pandas',
    difficulty: 'Easy',
    question: 'Why does NumPy-backed column vectorization execute faster than iterative `df.iterrows()` when processing 100,000+ survey records?',
    options: [
      'It translates loops into pure Python bytecode',
      'It executes contiguous pre-compiled C-level loops and SIMD registers without per-row Python interpreter overhead',
      'It skips missing values without verification',
      'It uses multithreaded web sockets',
    ],
    correctAnswer: 1,
    explanation: 'NumPy vectorized operations execute pre-compiled C routines across contiguous memory buffers, avoiding per-row Python type-checking and interpreter overhead.',
  },
  {
    id: 'q-py-07',
    competencyId: 'tech-python',
    topic: 'Data Analysis',
    difficulty: 'Medium',
    question: 'When merging household schedule data with individual member roster files, which Pandas join ensures no sampled household records are inadvertently omitted?',
    options: [
      'pd.concat([df_hh, df_mem], axis=1)',
      'pd.merge(df_hh, df_mem, on=["fsu_id", "household_id"], how="left")',
      'df_hh.append(df_mem)',
      'df_hh.join(df_mem, lsuffix="_left")',
    ],
    correctAnswer: 1,
    explanation: 'A left join (`how="left"`) preserves all master household records while matching corresponding member rows.',
  },
  {
    id: 'q-py-08',
    competencyId: 'tech-python',
    topic: 'Data Cleaning',
    difficulty: 'Medium',
    question: 'Why is Median Absolute Deviation (MAD) favored over standard deviation for flagging expenditure outliers in national socio-economic surveys?',
    options: [
      'Standard deviation is impossible to calculate on integers',
      'Extreme outliers heavily distort the mean and standard deviation, whereas MAD is a robust non-parametric estimator',
      'MAD always rounds values to zero',
      'MAD does not require sampling weights',
    ],
    correctAnswer: 1,
    explanation: 'Standard deviation is non-robust and inflated by severe outliers, while MAD relies on the median and provides a resilient threshold: Median ± 3 * 1.4826 * MAD.',
  },
  {
    id: 'q-py-09',
    competencyId: 'tech-python',
    topic: 'Data Analysis',
    difficulty: 'Hard',
    question: 'In stratified multi-stage surveys, how is the variance of a ratio estimator (such as per capita expenditure) calculated using sub-sample replication in Python?',
    options: [
      'Taking the variance of column values directly using df["exp"].var()',
      'Computing the squared difference between sub-sample 1 and sub-sample 2 estimates divided by 4: (R1 - R2)^2 / 4',
      'Multiplying sample size by cluster count',
      'Summing standard errors of raw household responses',
    ],
    correctAnswer: 1,
    explanation: 'In half-sample replication (sub-sample 1 and sub-sample 2), the variance estimator of the combined sample ratio is (R1 - R2)^2 / 4.',
  },
  {
    id: 'q-py-10',
    competencyId: 'tech-python',
    topic: 'Data Cleaning',
    difficulty: 'Hard',
    question: 'Under official statistical disclosure guidelines, how can k-anonymity (k>=5) be programmatically verified on microdata quasi-identifiers using Pandas?',
    options: [
      'df.nunique() > 5',
      '(df.groupby(["age_group", "gender", "district_code"]).size() >= 5).all()',
      'df.isna().sum() <= 5',
      'df.sample(5).describe()',
    ],
    correctAnswer: 1,
    explanation: 'k-Anonymity guarantees that every equivalence class defined by quasi-identifiers contains at least k records: `(df.groupby([...]).size() >= k).all()`.',
  },

  // Statistical - National Accounts
  {
    id: 'q-na-01',
    competencyId: 'stat-national-accounts',
    topic: 'GVA at Basic Prices vs GDP at Market Prices',
    difficulty: 'Medium',
    question: 'In the System of National Accounts (SNA), how is GDP at Market Prices derived from Gross Value Added (GVA) at Basic Prices?',
    options: [
      'GDP = GVA at Basic Prices minus Subsidies plus Depreciation',
      'GDP = GVA at Basic Prices + (Product Taxes - Product Subsidies)',
      'GDP = GVA at Basic Prices + Production Taxes only',
      'GDP = GVA at Basic Prices minus Net Export balance',
    ],
    correctAnswer: 1,
    explanation: 'GDP at Market Prices = GVA at Basic Prices + Net Taxes on Products (Product Taxes minus Product Subsidies).',
  },

  // Technical - SQL
  {
    id: 'q-sql-01',
    competencyId: 'tech-sql',
    topic: 'Window Functions for Survey Stratification',
    difficulty: 'Hard',
    question: 'Which SQL construct ranks households by income within each state without collapsing individual household rows?',
    options: [
      'GROUP BY state ORDER BY income DESC',
      'DENSE_RANK() OVER (PARTITION BY state ORDER BY income DESC)',
      'HAVING income > AVG(income)',
      'SELECT DISTINCT state, MAX(income)',
    ],
    correctAnswer: 1,
    explanation: 'The `DENSE_RANK() OVER (PARTITION BY state ...)` window function assigns relative ranks within each state partition while retaining all individual respondent rows.',
  },

  // Digital Governance - Cybersecurity
  {
    id: 'q-sec-01',
    competencyId: 'gov-cybersecurity',
    topic: 'Survey CAPI Tablet Encryption',
    difficulty: 'Medium',
    question: 'To secure sensitive field enumeration microdata stored offline on Android CAPI tablets prior to server synchronization, which protocol should be enforced?',
    options: [
      'Plaintext SQLite storage with root access enabled',
      'Full Disk Encryption (FDE) or SQLCipher database-level AES-256 encryption',
      'Storing CSV files in the shared public Download folder',
      'Disabling Android lock screen to prevent enumerator lockouts',
    ],
    correctAnswer: 1,
    explanation: 'SQLCipher with AES-256 or hardware-backed FDE prevents extraction of sensitive survey records even if a tablet is physically lost or stolen in the field.',
  },

  // Digital Governance - Data Privacy
  {
    id: 'q-priv-01',
    competencyId: 'gov-data-privacy',
    topic: 'Statistical Disclosure Control & k-Anonymity',
    difficulty: 'Hard',
    question: 'Under modern statistical confidentiality guidelines, what does achieving k-anonymity for public-use survey microdata guarantee?',
    options: [
      'The survey dataset contains exactly k households',
      'Every combination of quasi-identifiers (e.g., age, gender, pin code) is shared by at least k distinct individuals',
      'Data is encrypted with a private key of length k bytes',
      'The margin of error for national estimates is restricted to k percent',
    ],
    correctAnswer: 1,
    explanation: 'k-Anonymity ensures that an individual respondent cannot be re-identified from a release because their quasi-identifiers match at least k individuals in the dataset.',
  },

  // Behavioural / Managerial - Decision Making
  {
    id: 'q-dm-01',
    competencyId: 'mgr-decision-making',
    topic: 'Field Non-Response Resolution Protocol',
    difficulty: 'Medium',
    question: 'If a sampled First Stage Unit (FSU) village is completely inaccessible due to sudden monsoon flooding during survey operations, what is the standard statistical protocol for the supervisory officer?',
    options: [
      'Immediately interview households in a neighboring non-sampled convenient village',
      'Document the casualty, consult the survey operational design manual, and utilize the formal pre-designated substitution list approved by the sampling design committee',
      'Fabricate responses based on historical census figures',
      'Delete the entire stratum and re-scale all national weights arbitrarily',
    ],
    correctAnswer: 1,
    explanation: 'Random sample integrity demands adhering strictly to predetermined formal substitution protocols approved by the survey methodology committee to prevent convenience bias.',
  },

  // Statistical - Survey Design
  {
    id: 'q-sd-01',
    competencyId: 'stat-survey-design',
    topic: 'Questionnaire Framing & Recall Bias',
    difficulty: 'Easy',
    question: 'In measuring household food consumption, which recall period strategy is commonly utilized to balance recall decay with consumption irregularities in official statistics?',
    options: [
      'A single 365-day recall for perishable food items',
      'Modified Mixed Reference Period (MMRP) using 7-day recall for perishables and 30-day recall for other foods',
      'Asking respondents to estimate their lifetime grocery budget',
      'Exclusively using yesterday 24-hour dietary recall for durable goods',
    ],
    correctAnswer: 1,
    explanation: 'MMRP (Modified Mixed Reference Period) uses a 7-day recall for high-frequency perishable items (edible oil, vegetables, eggs) and 30-day/365-day recall for clothing, durables, and institutional expenditure.',
  },
];

export const SAMPLE_LEARNING_MATERIALS: LearningMaterial[] = [
  {
    id: 'mat-001',
    title: 'MoSPI Guidelines on Data Quality Assurance in Household Surveys (2025)',
    fileType: 'pdf',
    uploadedAt: '2026-09-02',
    wordCount: 1840,
    summary: 'Official procedural framework outlining multi-tier automated data validation, logical check rules, outlier detection limits, and hot-deck imputation standards for national field operations.',
    suggestedCompetencies: ['stat-data-quality', 'stat-survey-design', 'tech-python'],
    extractedText: `MINISTRY OF STATISTICS AND PROGRAMME IMPLEMENTATION (MoSPI)
GOVERNMENT OF INDIA
STANDARD OPERATING PROCEDURES FOR DATA QUALITY ASSURANCE IN SOCIO-ECONOMIC SURVEYS

1. INTRODUCTION & SCOPE
The National Statistical System requires rigorous data hygiene from the moment of primary enumeration to final tabulation. High-quality statistical outputs depend on minimizing both sampling errors and non-sampling errors. Non-sampling errors arise primarily during field listing, respondent recall, manual entry, and data transmission.

2. MULTI-TIER AUTOMATED VALIDATION CHECKS
All Computer-Assisted Personal Interviewing (CAPI) instruments deployed by the Field Operations Division must enforce three mandatory levels of real-time validation:
Level A - Range Constraints: Every numerical field must have hard limits defined in metadata. For example, monthly household electricity expenditure cannot be negative or exceed INR 1,50,000 without supervisory sign-off.
Level B - Relational Consistency: Inter-variable validations verify logical dependencies. Rule DQ-04 states that an individual marked as 'Never Attended School' cannot have education level recorded as 'Secondary or Higher'. Rule DQ-09 states that any child under 14 years of age cannot be recorded in formal hazardous industrial employment.
Level C - Temporal Plausibility: Questions with reference periods (e.g. 7-day MMRP vs 30-day recall) must display comparative alerts if reported daily quantities imply physically impossible consumption.

3. OUTLIER DETECTION METHODOLOGY
Outliers must not be deleted arbitrarily. The standard protocol mandates:
a) Transforming skewed distributions using log10 or Box-Cox transformations before applying statistical boundaries.
b) Calculating the Median Absolute Deviation (MAD) rather than classical standard deviation, because the standard deviation itself is distorted by extreme outliers. The threshold is set at Median ± 3 * 1.4826 * MAD.
c) Records exceeding the threshold require mandatory telephonic or physical re-verification by the Senior Statistical Officer (SSO).

4. IMPUTATION OF MISSING DATA
Where item non-response cannot be resolved by re-interview:
- Unconditional mean substitution is strictly prohibited because it artificially deflates sample variance.
- Hot-Deck Imputation: The system must identify a donor respondent within the identical socio-economic stratum (same district, rural/urban sector, and occupational category) who matches the recipient across at least three auxiliary continuous variables.
- The imputed values must be clearly flagged with flag code 'IMP-HD-01' to preserve microdata auditability.

5. STATISTICAL DISCLOSURE CONTROL
Prior to releasing unit-level microdata into public repositories, the Statistical Quality Division must ensure k-anonymity with k >= 5. All direct personal identifiers (Aadhaar, mobile numbers, respondent names, house numbers) must be permanently pseudonymized using irreversible SHA-256 salted hashes.`,
  },
  {
    id: 'mat-002',
    title: 'Handbook on National Accounts Statistics & GVA Compilation Methods',
    fileType: 'pdf',
    uploadedAt: '2026-08-28',
    wordCount: 1420,
    summary: 'Technical guidance on Gross Value Added (GVA) calculation across agricultural, industrial, and services sectors, and transitioning to System of National Accounts (SNA) 2008 standards.',
    suggestedCompetencies: ['stat-national-accounts', 'stat-agri-stats', 'gov-data-privacy'],
    extractedText: `CENTRAL STATISTICS OFFICE (CSO) / NATIONAL ACCOUNTS DIVISION
TECHNICAL NOTES ON COMPILATION OF GROSS VALUE ADDED AND GROSS DOMESTIC PRODUCT

1. CONCEPTUAL FOUNDATION (SNA 2008)
Gross Value Added (GVA) is defined as the value of output less the value of intermediate consumption. It represents the contribution of an enterprise, industry or sector to the overall economy.

2. TRANSITION FROM FACTOR COST TO BASIC PRICES
In the revised national accounts series:
- GVA at Basic Prices = GVA at Factor Cost + Production Taxes - Production Subsidies.
Note: Production taxes/subsidies are independent of the volume of actual production (e.g., land revenues, stamp duties, municipal taxes, subsidies to farmers for electricity tariffs).
- GDP at Market Prices = GVA at Basic Prices + Product Taxes - Product Subsidies.
Product taxes and subsidies depend directly on the volume of output sold (e.g., GST, customs duties, petroleum excise, food and fertilizer subsidies).

3. SECTORAL ESTIMATION METHODOLOGIES
Agriculture, Forestry & Fishing: Output is estimated using the Production Approach (Value of Output = Area under crop * Yield per hectare * Harvesting peak price). Intermediate consumption includes certified seeds, chemical fertilizers, organic manure, diesel, and canal water irrigation charges, estimated at benchmark ratios.
Manufacturing: Registered manufacturing uses the Annual Survey of Industries (ASI) and corporate filings from the Ministry of Corporate Affairs (MCA21 database). Unregistered/informal manufacturing relies on NSS unincorporated enterprise surveys benchmarked with effective labor inputs.
Services: Financial sector GVA is estimated using Financial Intermediation Services Indirectly Measured (FISIM). Government administrative services are valued at cost of production (Compensation of Employees + Consumption of Fixed Capital).

4. DOUBLE DEFLATION METHOD
To measure real GVA accurately in constant prices, the Double Deflation technique is the global gold standard:
Real GVA = (Nominal Output deflated by Producer Price Index) minus (Nominal Intermediate Inputs deflated by Input Price Index). Single deflation using Wholesale Price Index (WPI) should be phased out as Producer Price Indexes mature.`,
  },
  {
    id: 'mat-003',
    title: 'Python for Official Statistics: Vectorized Data Wrangling with Pandas',
    fileType: 'txt',
    uploadedAt: '2026-08-20',
    wordCount: 1100,
    summary: 'Coding manual for automating national survey aggregation, handling large microdata extracts, and optimizing memory usage.',
    suggestedCompetencies: ['tech-python', 'tech-data-viz', 'tech-sql'],
    generatedQuestions: INITIAL_ASSESSMENT_QUESTIONS.filter((q) => q.competencyId === 'tech-python'),
    extractedText: `NATIONAL STATISTICAL SYSTEMS TRAINING ACADEMY (NSSTA)
PYTHON MODULE: DATA PROCESSING FOR OFFICIAL STATISTICAL AUDITORS

1. AVOIDING SLOW ITERATIVE LOOPS
In processing NSS 100,000+ household tables, Python's native 'for index, row in df.iterrows()' executes approximately 1,000 times slower than vectorized operations.
Best Practice:
Always use NumPy-backed vectorized methods:
# CORRECT:
df['per_capita_exp'] = df['total_expenditure'] / df['household_size']
# INCORRECT:
for i in range(len(df)):
    df.loc[i, 'per_capita_exp'] = df.loc[i, 'total_expenditure'] / df.loc[i, 'household_size']

2. WEIGHTED STATISTICAL AGGREGATION
Survey microdata carries probability weights (multiplier). Unweighted means produce biased population inferences.
Formula in Pandas:
def weighted_mean(group):
    weights = group['multiplier']
    values = group['consumption']
    return (values * weights).sum() / weights.sum()

district_estimates = df.groupby(['state_code', 'district_code']).apply(weighted_mean)

3. MEMORY OPTIMIZATION FOR NATIONAL CENSUS EXTRACTS
Downcasting integer and float datatypes reduces RAM consumption by up to 75%:
- Convert 64-bit integers to int16 or int8 for codes (e.g., gender 1/2, sector 1/2).
- Convert repetitive string columns (such as state_name or district_name) to the 'category' dtype.
- Use 'pd.read_csv(chunksize=50000)' when the full microdata exceeds system memory limits.`,
  },
  {
    id: 'mat-004',
    title: 'NSS Survey Sampling Design & Multi-Stage PPS Selection Manual',
    fileType: 'pdf',
    uploadedAt: '2026-09-01',
    wordCount: 1350,
    summary: 'Operational handbook for stratified multi-stage cluster sampling, First Stage Units selection with Probability Proportional to Size (PPS), and sampling error calculations.',
    suggestedCompetencies: ['stat-sampling-methods', 'stat-survey-design', 'stat-data-quality'],
    extractedText: `NATIONAL STATISTICAL OFFICE (NSO) - SURVEY DESIGN & RESEARCH DIVISION
OPERATIONAL METHODOLOGY FOR STRATIFIED MULTI-STAGE CLUSTER SAMPLING

1. SAMPLING FRAME AND FIRST STAGE UNITS (FSUs)
The sampling design for socio-economic survey rounds follows a stratified two-stage design.
- Rural Sector: The First Stage Units (FSUs) are Census Villages as per the latest available Population Census.
- Urban Sector: The First Stage Units are Urban Frame Survey (UFS) blocks demarcated by clear geographic boundaries.

2. PROBABILITY PROPORTIONAL TO SIZE (PPS) SELECTION
In each rural stratum, FSUs are sampled using Probability Proportional to Size with Replacement (PPSWR) or Circular Systematic PPS selection.
Size measure: The size measure for villages is Census Population.
Why PPS: PPS gives larger clusters a higher probability of selection in the first stage. When coupled with an equal number of Ultimate Second Stage Units (households) chosen at the second stage, it creates an approximately self-weighting sample within strata, minimizing design variance.

3. STRATIFICATION CRITERIA
Each district is divided into two basic strata:
- Rural stratum: Comprising all rural census villages within the administrative boundaries.
- Urban stratum: Comprising all urban towns within the district. For million-plus metropolitan cities, each city constitutes a separate special stratum.

4. SECOND STAGE SAMPLING OF HOUSEHOLDS (SSUs)
Within each sampled FSU, all households are completely listed in Schedule 0.0.
Households are stratified into three sub-strata based on affluence and consumption criteria.
Selection within sub-strata is done using Simple Random Sampling Without Replacement (SRSWOR) or circular systematic sampling to prevent enumerator selection bias.

5. DESIGN EFFECT (DEFF) AND VARIANCE ESTIMATION
Design Effect (DEFF) quantifies variance inflation due to clustering compared to Simple Random Sampling of equal size:
DEFF = 1 + (m - 1) * rho
where m is average cluster size and rho is the intra-cluster correlation coefficient. Official survey tabulations must report standard errors calibrated by the sub-sample replication method.`,
  }
];

export const DEMO_ADMIN_LEARNERS: LearnerSummary[] = [
  {
    id: 'learner-001',
    name: 'Ananya Rao',
    designation: 'Statistical Officer',
    department: 'Department of Statistics (FOD Delhi)',
    overallScore: 56,
    criticalGapsCount: 4,
    coursesEnrolled: 3,
    lastActive: 'Today, 10:15 AM',
  },
  {
    id: 'learner-002',
    name: 'Rajesh Mukherjee',
    designation: 'Senior Statistical Officer',
    department: 'National Accounts Division (NAD)',
    overallScore: 71,
    criticalGapsCount: 1,
    coursesEnrolled: 5,
    lastActive: 'Yesterday',
  },
  {
    id: 'learner-003',
    name: 'Pooja Sundaram',
    designation: 'Assistant Director',
    department: 'Survey Design & Research Division (SDRD Kolkata)',
    overallScore: 79,
    criticalGapsCount: 0,
    coursesEnrolled: 6,
    lastActive: '3 hours ago',
  },
  {
    id: 'learner-004',
    name: 'Vikas Sharma',
    designation: 'Junior Statistical Officer',
    department: 'Data Processing Division (DPD Nagpur)',
    overallScore: 48,
    criticalGapsCount: 6,
    coursesEnrolled: 2,
    lastActive: '2 days ago',
  },
  {
    id: 'learner-005',
    name: 'Deepika Nair',
    designation: 'Statistical Officer',
    department: 'Price Statistics Division (PSD Bangalore)',
    overallScore: 63,
    criticalGapsCount: 3,
    coursesEnrolled: 4,
    lastActive: 'Today, 08:30 AM',
  },
  {
    id: 'learner-006',
    name: 'Amitabh Sen',
    designation: 'Senior Statistical Officer',
    department: 'Coordination & Administration Division',
    overallScore: 68,
    criticalGapsCount: 2,
    coursesEnrolled: 3,
    lastActive: '4 days ago',
  },
];

export const PYTHON_DIAGNOSTIC_QUIZ_QUESTIONS: Question[] = INITIAL_ASSESSMENT_QUESTIONS.filter(
  (q) => q.competencyId === 'tech-python'
);

