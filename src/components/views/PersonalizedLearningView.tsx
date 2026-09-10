import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LearningResource, Recommendation } from '../../types';
import { PYTHON_DIAGNOSTIC_QUIZ_QUESTIONS, INITIAL_ASSESSMENT_QUESTIONS } from '../../data/initialData';
import {
  BookOpen,
  GraduationCap,
  Clock,
  Star,
  CheckCircle2,
  Sliders,
  RotateCcw,
  Search,
  Filter,
  Info,
  ShieldAlert,
  Sparkles,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Award,
  BookMarked,
  Layers,
  ArrowRight,
  Play,
  Network,
  ExternalLink,
} from 'lucide-react';

export const PersonalizedLearningView: React.FC = () => {
  const {
    recommendations,
    igotRecommendations,
    nsstaRecommendations,
    coursesCatalog,
    enrolledCourses,
    enrollInCourse,
    completeCourse,
    userProfile,
    recommendationConfig,
    updateRecommendationWeights,
    resetRecommendationWeights,
    excludedStrongCompetencies,
    recommendationFormulaText,
    startQuiz,
    setActiveTab,
  } = useApp();

  const [recProviderFilter, setRecProviderFilter] = useState<'ALL' | 'iGOT' | 'NSSTA'>('ALL');
  const [selectedProvider, setSelectedProvider] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCourseModal, setSelectedCourseModal] = useState<LearningResource | null>(null);
  const [showFormulaPanel, setShowFormulaPanel] = useState<boolean>(true);
  const [showArchPanel, setShowArchPanel] = useState<boolean>(false);
  const [showExcludedSection, setShowExcludedSection] = useState<boolean>(false);
  const [copiedRecId, setCopiedRecId] = useState<string | null>(null);

  const displayedRecommendations = recommendations.filter((rec) => {
    if (recProviderFilter === 'iGOT') {
      return (
        rec.providerType === 'iGOT' ||
        rec.source.toLowerCase().includes('igot') ||
        (rec.provider && rec.provider.toLowerCase().includes('igot'))
      );
    }
    if (recProviderFilter === 'NSSTA') {
      return (
        rec.providerType === 'NSSTA' ||
        rec.source.toLowerCase().includes('nssta') ||
        (rec.provider && rec.provider.toLowerCase().includes('nssta'))
      );
    }
    return true;
  });

  const handleStartQuizForRec = (rec: Recommendation) => {
    if (rec.competencyId === 'tech-python') {
      startQuiz(
        'Python for Official Statistics Reassessment Quiz',
        rec.courseTitle,
        PYTHON_DIAGNOSTIC_QUIZ_QUESTIONS,
        rec.resourceId
      );
      setActiveTab('quiz');
      return;
    }

    const matchingQuestions = INITIAL_ASSESSMENT_QUESTIONS.filter(
      (q) => q.competencyId === rec.competencyId
    );

    if (matchingQuestions.length > 0) {
      startQuiz(
        `${rec.competencyName} Competency Diagnostic Assessment`,
        rec.courseTitle,
        matchingQuestions,
        rec.resourceId
      );
      setActiveTab('quiz');
    } else {
      setActiveTab('upload');
    }
  };

  const filteredCourses = coursesCatalog.filter((course) => {
    const matchesProvider = selectedProvider === 'ALL' || course.provider === selectedProvider;
    const matchesSearch =
      !searchQuery ||
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.competencyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesProvider && matchesSearch;
  });

  const handleCopyRecommendation = (rec: Recommendation) => {
    const formatted = [
      `Course:\n${rec.courseTitle}`,
      `Target competency:\n${rec.competencyName}`,
      `Current competency:\n${rec.currentScore}%`,
      `Required competency:\n${rec.targetScore}%`,
      `Gap:\n${rec.gapPercentagePoints || `${rec.gap} percentage points`}`,
      `Reason:\n"${rec.reason}"`,
    ].join('\n\n');

    navigator.clipboard.writeText(formatted);
    setCopiedRecId(rec.id);
    setTimeout(() => setCopiedRecId(null), 2500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Prototype Status & Non-Live Demarcation Banner */}
      <div className="bg-amber-50/90 border border-amber-300/80 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0 mt-0.5 border border-amber-200">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                Personalized Recommendation Engine
              </span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-200/90 text-amber-900 font-bold border border-amber-300">
                PROTOTYPE MODE — DEMO DATA
              </span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold border border-rose-200">
                iGOT Karmayogi integration: PROTOTYPE ADAPTER — NOT A LIVE API INTEGRATION.
              </span>
            </div>
            <p className="text-xs text-amber-900/90 mt-1.5 max-w-3xl leading-relaxed">
              Recommendations are generated <strong>strictly from individual competency gaps and assessment evidence</strong> rather than generic platform popularity.
              All learning resources shown are <strong>sample demonstration modules</strong>: NSSTA / TPAC integration: PROTOTYPE DATA — NOT A LIVE PRODUCTION INTEGRATION.
            </p>
          </div>
        </div>

        <div className="shrink-0 flex items-center space-x-2 self-end md:self-auto">
          <button
            onClick={() => setShowArchPanel(!showArchPanel)}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-amber-300 hover:bg-amber-100/50 text-amber-900 text-xs font-semibold rounded-lg shadow-2xs transition-colors"
          >
            <Network className="w-3.5 h-3.5 text-amber-800" />
            <span>{showArchPanel ? 'Hide Architecture Note' : 'Provider Architecture'}</span>
          </button>

          <button
            onClick={() => setShowFormulaPanel(!showFormulaPanel)}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-amber-300 hover:bg-amber-100/50 text-amber-900 text-xs font-semibold rounded-lg shadow-2xs transition-colors"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{showFormulaPanel ? 'Hide Ranking Weights' : 'Configure Ranking Weights'}</span>
          </button>
        </div>
      </div>

      {/* Integration Status Indicators (iGOT & NSSTA) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* iGOT Karmayogi Status */}
        <div className="bg-white rounded-2xl border border-blue-200/80 p-4 shadow-xs flex items-start space-x-3.5">
          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0 mt-0.5 text-blue-700">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-1.5">
              <div className="flex items-center space-x-2">
                <h4 className="text-xs font-bold text-slate-900">iGOT Karmayogi Adapter</h4>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-800 font-bold rounded-full border border-blue-200">
                Prototype Adapter
              </span>
            </div>
            <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
              Serving <strong>11 curated online courses</strong> mapped to official statistics competencies. Flagged as <strong>Demo Data</strong>.
            </p>
            <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[10px] text-slate-500 font-mono">
              <span className="px-2 py-0.5 bg-slate-100 rounded border border-slate-200">Status: Active Mock</span>
              <span className="px-2 py-0.5 bg-slate-100 rounded border border-slate-200">Endpoint: Local Registry</span>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded border border-emerald-200 font-sans font-semibold">Sandbox Secure</span>
            </div>
          </div>
        </div>

        {/* NSSTA / TPAC Status */}
        <div className="bg-white rounded-2xl border border-indigo-200/80 p-4 shadow-xs flex items-start space-x-3.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center shrink-0 mt-0.5 text-indigo-700">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-1.5">
              <div className="flex items-center space-x-2">
                <h4 className="text-xs font-bold text-slate-900">NSSTA / TPAC Training Adapter</h4>
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              </div>
              <span className="text-[10px] px-2 py-0.5 bg-indigo-100 text-indigo-800 font-bold rounded-full border border-indigo-200">
                Prototype Data
              </span>
            </div>
            <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
              Serving <strong>7 residential &amp; executive programmes</strong> from the National Statistical Systems Training Academy curriculum.
            </p>
            <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[10px] text-slate-500 font-mono">
              <span className="px-2 py-0.5 bg-slate-100 rounded border border-slate-200">Format: In-Person / Hybrid</span>
              <span className="px-2 py-0.5 bg-slate-100 rounded border border-slate-200">Delivery: Official Academy</span>
              <span className="px-2 py-0.5 bg-indigo-50 text-indigo-800 rounded border border-indigo-200 font-sans font-semibold">MoSPI Aligned</span>
            </div>
          </div>
        </div>
      </div>

      {/* Future Live API Architecture Note (Section 8 Documentation) */}
      {showArchPanel && (
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-5 shadow-lg border border-slate-700">
          <div className="flex items-center justify-between pb-3 border-b border-slate-700">
            <div className="flex items-center space-x-2.5">
              <Network className="w-5 h-5 text-cyan-400" />
              <h3 className="text-sm font-bold text-white tracking-wide">
                Learning Ecosystem Integration &amp; Future Live API Architecture
              </h3>
            </div>
            <span className="text-[10px] px-2.5 py-0.5 bg-cyan-900/80 text-cyan-200 border border-cyan-700 rounded-full font-mono">
              Production Roadmap
            </span>
          </div>

          <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-5 text-xs">
            {/* Current Prototype */}
            <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4">
              <div className="flex items-center justify-between text-amber-300 font-bold mb-2">
                <span>1. Current Hackathon Prototype</span>
                <span className="text-[10px] bg-amber-900/60 px-2 py-0.5 rounded border border-amber-600 text-amber-200">ACTIVE</span>
              </div>
              <pre className="font-mono text-[11px] bg-slate-950/70 p-3 rounded-lg border border-slate-800 text-slate-300 overflow-x-auto">
{`KshamAI Core (Competency & Gap Engines)
      ↓
LearningProvider (Standard Interface)
      ├── IGOTAdapter  ──> In-Memory Catalog (isDemoData: true)
      └── NSSTAAdapter ──> Local Academy Courses (isDemoData: true)`}
              </pre>
              <p className="text-slate-300 mt-2.5 text-[11px] leading-relaxed">
                Uses the <strong>Provider / Adapter Pattern</strong>. Demonstrates the complete loop without requiring live government VPN or authenticated API tokens. No fake endpoints are simulated.
              </p>
            </div>

            {/* Future Production */}
            <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4">
              <div className="flex items-center justify-between text-cyan-300 font-bold mb-2">
                <span>2. Future Live Production Architecture</span>
                <span className="text-[10px] bg-cyan-900/60 px-2 py-0.5 rounded border border-cyan-600 text-cyan-200">ZERO REWRITES</span>
              </div>
              <pre className="font-mono text-[11px] bg-slate-950/70 p-3 rounded-lg border border-slate-800 text-cyan-200 overflow-x-auto">
{`KshamAI Core (Competency & Gap Engines)
      ↓
LearningProvider (Standard Interface)
      ├── LiveIGOTAdapter  ──> Official iGOT Karmayogi Sunbird API
      └── LiveNSSTAAdapter ──> MoSPI Training Portal Nominations API`}
              </pre>
              <p className="text-slate-300 mt-2.5 text-[11px] leading-relaxed">
                <strong>Zero Architectural Rewrites:</strong> When official government credentials and Sunbird endpoints become available, only the transport adapter is swapped. All competency algorithms, gap analytics, and ranking stay identical.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Configurable Internal Ranking Weights Panel */}
      {showFormulaPanel && (
        <div className="bg-white rounded-2xl border border-blue-200/80 p-5 shadow-xs transition-all">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-100">
            <div>
              <div className="flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Deterministic Ranking Engine (Configurable Weights)
                </h3>
                <span className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-700 font-mono font-semibold rounded border border-blue-200">
                  Mathematical Model
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Internal ranking score determines course placement based on gap severity, role priority, and proficiency fit:
              </p>
            </div>

            <button
              onClick={resetRecommendationWeights}
              className="flex items-center space-x-1 px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 self-start sm:self-auto"
              title="Reset weights to default: 0.50 / 0.30 / 0.20"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Weights</span>
            </button>
          </div>

          {/* Formula Display Box */}
          <div className="mt-3.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 font-mono text-xs text-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
            <div>
              <span className="text-slate-400 font-sans text-[11px] uppercase tracking-wider block sm:inline mr-2">Formula:</span>
              <span className="text-blue-700 font-semibold">{recommendationFormulaText}</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-600">
              <span className="px-2 py-0.5 rounded bg-white border border-slate-200">
                Gaps Evaluated: <strong>{recommendations.length}</strong>
              </span>
              <span className="px-2 py-0.5 rounded bg-white border border-slate-200">
                Strong (Excluded): <strong>{excludedStrongCompetencies.length}</strong>
              </span>
            </div>
          </div>

          {/* Sliders for Weights */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-700">Gap Severity Weight (w_gap)</span>
                <span className="font-mono font-bold text-blue-700">
                  {recommendationConfig.weights.gapSeverityWeight.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="0.10"
                max="1.00"
                step="0.05"
                value={recommendationConfig.weights.gapSeverityWeight}
                onChange={(e) =>
                  updateRecommendationWeights({ gapSeverityWeight: parseFloat(e.target.value) })
                }
                className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Calibrates urgency by deficit magnitude
              </span>
            </div>

            <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-700">Role Priority Weight (w_role)</span>
                <span className="font-mono font-bold text-blue-700">
                  {recommendationConfig.weights.rolePriorityWeight.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="0.10"
                max="1.00"
                step="0.05"
                value={recommendationConfig.weights.rolePriorityWeight}
                onChange={(e) =>
                  updateRecommendationWeights({ rolePriorityWeight: parseFloat(e.target.value) })
                }
                className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Prioritizes competencies for {userProfile.designation}
              </span>
            </div>

            <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-700">Proficiency Fit Weight (w_fit)</span>
                <span className="font-mono font-bold text-blue-700">
                  {recommendationConfig.weights.proficiencyFitWeight.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="0.10"
                max="1.00"
                step="0.05"
                value={recommendationConfig.weights.proficiencyFitWeight}
                onChange={(e) =>
                  updateRecommendationWeights({ proficiencyFitWeight: parseFloat(e.target.value) })
                }
                className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Aligns course difficulty to step bridge
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Top Recommendations Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-blue-600 mb-0.5">
              <GraduationCap className="w-4 h-4" />
              <span>DEFICIT-DRIVEN LEARNING PATHWAYS</span>
            </div>
            <h2 className="text-base font-bold text-slate-900">
              Personalized Recommendations for {userProfile.designation}
            </h2>
            <p className="text-xs text-slate-500">
              Generated exclusively from competency assessment gaps, verified weak topics, and job role requirements.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500">Total Recommended:</span>
            <span className="px-2.5 py-1 bg-blue-50 text-blue-800 font-bold rounded-lg text-xs border border-blue-200">
              {displayedRecommendations.length} Courses
            </span>
          </div>
        </div>

        {/* Separate Provider Views / Filter Tabs */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setRecProviderFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              recProviderFilter === 'ALL'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            All Recommendations ({recommendations.length})
          </button>
          <button
            onClick={() => setRecProviderFilter('iGOT')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              recProviderFilter === 'iGOT'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            iGOT Karmayogi — Prototype Adapter ({igotRecommendations.length})
          </button>
          <button
            onClick={() => setRecProviderFilter('NSSTA')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              recProviderFilter === 'NSSTA'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            NSSTA / TPAC — Prototype Data ({nsstaRecommendations.length})
          </button>
        </div>

        {/* List of Recommendations */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedRecommendations.map((rec) => {
            const isEnrolled = enrolledCourses.includes(rec.resourceId);
            const isCopied = copiedRecId === rec.id;

            return (
              <div
                key={rec.id}
                className="bg-slate-50/60 rounded-xl border border-slate-200 hover:border-slate-300 p-5 flex flex-col justify-between hover:bg-slate-50 transition-all shadow-2xs relative group"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-200/60">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                        {rec.source}
                      </span>
                      <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                        Prototype Data
                      </span>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          rec.priority === 'Critical'
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : rec.priority === 'High'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                        }`}
                      >
                        {rec.priority} Priority
                      </span>
                      {rec.rankingScore !== undefined && (
                        <span
                          className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-200/80 text-slate-800"
                          title={`Ranking Score: ${rec.rankingScore} / 100`}
                        >
                          Score: {rec.rankingScore}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Exact Required Fields Structure */}
                  <div className="mt-3.5 space-y-2.5">
                    {/* Course */}
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Course:
                      </span>
                      <h3 className="text-xs font-bold text-slate-900 leading-snug">
                        {rec.courseTitle}
                      </h3>
                    </div>

                    {/* Target competency */}
                    <div className="flex items-center justify-between text-xs py-1 border-t border-b border-slate-200/50">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Target competency:
                        </span>
                        <span className="font-semibold text-slate-800">
                          {rec.competencyName}
                        </span>
                      </div>

                      {/* Course level */}
                      {rec.courseLevel && (
                        <span className="text-[10px] px-2 py-0.5 bg-slate-100 rounded text-slate-600 font-medium">
                          Tier: {rec.courseLevel}
                        </span>
                      )}
                    </div>

                    {/* Scores & Gap Grid */}
                    <div className="grid grid-cols-3 gap-2 bg-white p-2.5 rounded-lg border border-slate-200/80 text-center">
                      <div>
                        <span className="text-[9px] font-bold uppercase text-slate-400 block">
                          Current:
                        </span>
                        <span className="text-xs font-bold text-slate-800">
                          {rec.currentScore}/{rec.targetScore}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold uppercase text-slate-400 block">
                          Required:
                        </span>
                        <span className="text-xs font-bold text-blue-700">
                          {rec.targetScore}%
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold uppercase text-slate-400 block">
                          Gap:
                        </span>
                        <span className="text-xs font-bold text-rose-600">
                          {rec.gap} points
                        </span>
                      </div>
                    </div>

                    {/* Why Recommended */}
                    {rec.whyRecommended && (
                      <div className="bg-amber-50/70 border border-amber-200/80 rounded-lg p-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block mb-0.5">
                          Why:
                        </span>
                        <p className="text-[11px] text-amber-900 font-medium">
                          {rec.whyRecommended}
                        </p>
                      </div>
                    )}

                    {/* Reason */}
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                        Reason:
                      </span>
                      <p className="text-[11px] text-slate-700 bg-blue-50/50 border border-blue-100 p-2.5 rounded-lg leading-relaxed italic">
                        "{rec.reason}"
                      </p>
                    </div>

                    {/* Identified Weak Topics */}
                    {rec.weakTopics && rec.weakTopics.length > 0 && (
                      <div className="pt-1">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                          Assessment Identified Weak Topics:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {rec.weakTopics.map((topic, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200/70"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions & Footer */}
                <div className="mt-4 pt-3 border-t border-slate-200/70 flex items-center justify-between gap-2">
                  <div className="flex items-center text-[11px] text-slate-500">
                    <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    <span>{rec.estimatedLearningDuration}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleCopyRecommendation(rec)}
                      className="px-2.5 py-1 text-[11px] text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded border border-slate-300 transition-colors"
                      title="Copy recommendation formatted text"
                    >
                      {isCopied ? 'Copied!' : 'Copy'}
                    </button>

                    <button
                      onClick={() => {
                        const existingCourse = coursesCatalog.find((c) => c.id === rec.resourceId);
                        const courseData: LearningResource = existingCourse || {
                          id: rec.resourceId,
                          title: rec.courseTitle,
                          competencyId: rec.competencyId,
                          competencyName: rec.competencyName,
                          domain: rec.domain,
                          description: rec.reason,
                          durationHours: parseInt(rec.estimatedLearningDuration) || 14,
                          durationText: rec.estimatedLearningDuration,
                          provider: rec.provider || rec.source,
                          providerType: rec.providerType,
                          source: rec.source,
                          level: 'Intermediate',
                          isDemoData: true,
                          modulesCount: 5,
                          deliveryType: rec.deliveryType || 'Self-Paced e-Learning',
                        };
                        setSelectedCourseModal(courseData);
                      }}
                      className="px-2.5 py-1 text-[11px] text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 rounded border border-slate-300 transition-colors font-medium"
                      title="View course syllabus, modules, and assessment connection"
                    >
                      Syllabus
                    </button>

                    <button
                      onClick={() => handleStartQuizForRec(rec)}
                      className="px-2.5 py-1 text-[11px] bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded-lg border border-indigo-200 flex items-center space-x-1 transition-colors"
                      title="Take diagnostic or reassessment quiz to measure competency growth"
                    >
                      <Play className="w-3 h-3 text-indigo-600" />
                      <span>Test Knowledge</span>
                    </button>

                    {isEnrolled ? (
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Enrolled</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => enrollInCourse(rec.resourceId)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-2xs"
                      >
                        Enroll Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rule 5 Audit Section: Excluded Strong Competencies */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-slate-900">
                  Rule 5 Compliance Audit: Excluded Strong Competencies
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                  {excludedStrongCompetencies.length} Competencies Excluded
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Rule 5 mandate: "Avoid recommending resources for competencies where the learner is already strong."
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowExcludedSection(!showExcludedSection)}
            className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-800 font-semibold"
          >
            <span>{showExcludedSection ? 'Hide Audit Log' : 'View Excluded Competencies'}</span>
            {showExcludedSection ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {showExcludedSection && (
          <div className="mt-4 pt-3.5 border-t border-slate-100 space-y-3">
            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 text-xs text-emerald-900">
              The recommendation engine actively audits each competency. If current score meets or exceeds benchmark
              (or gap ≤ {recommendationConfig.strongThreshold} percentage points), course suggestions are intentionally suppressed so learners can focus on actual deficits.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {excludedStrongCompetencies.map((item) => (
                <div
                  key={item.competencyId}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                    <span className="font-bold text-slate-800">{item.competencyName}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      Strong Benchmark Met
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-slate-600">
                    <span>Current: <strong>{item.currentScore}%</strong></span>
                    <span>Required: <strong>{item.targetScore}%</strong></span>
                    <span className="text-emerald-700 font-bold">Gap: 0 pp</span>
                  </div>

                  <p className="mt-2 text-[11px] text-slate-500 italic">
                    {item.reason}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Course Catalog Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto">
          {['ALL', 'iGOT Karmayogi', 'NSSTA', 'MoSPI Academy'].map((p) => (
            <button
              key={p}
              onClick={() => setSelectedProvider(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedProvider === p
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {p === 'ALL' ? 'All Providers' : p}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search full prototype course catalog..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
          />
        </div>
      </div>

      {/* Full Catalog Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCourses.map((course) => {
          const isEnrolled = enrolledCourses.includes(course.id);

          return (
            <div
              key={course.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      {course.provider}
                    </span>
                    <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                      Demo
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {course.level}
                  </span>
                </div>

                <h3 className="text-xs font-bold text-slate-900 mt-2 line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-[11px] text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                  {course.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                  <span className="flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    {course.durationHours} Hours ({course.modulesCount} modules)
                  </span>
                  <span className="flex items-center text-amber-600 font-semibold">
                    <Star className="w-3.5 h-3.5 mr-1 fill-amber-400 text-amber-400" />
                    {course.rating}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedCourseModal(course)}
                    className="flex-1 py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors text-center"
                  >
                    Details
                  </button>

                  {isEnrolled ? (
                    <button
                      onClick={() => completeCourse(course.id)}
                      className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors"
                    >
                      Complete
                    </button>
                  ) : (
                    <button
                      onClick={() => enrollInCourse(course.id)}
                      className="py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors"
                    >
                      Enroll
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Course Detail Modal */}
      {selectedCourseModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">
                  {selectedCourseModal.provider}
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-amber-100 text-amber-900 rounded-md font-bold border border-amber-200">
                  DEMO PROTOTYPE DATA
                </span>
              </div>
              <button
                onClick={() => setSelectedCourseModal(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                ✕
              </button>
            </div>

            <h3 className="text-base font-bold text-slate-900 mt-3">
              {selectedCourseModal.title}
            </h3>

            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              {selectedCourseModal.description}
            </p>

            {/* Target Competency & Gap Context */}
            <div className="mt-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Target Competency:</span>
                <span className="font-bold text-slate-900">
                  {selectedCourseModal.competencyName}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Delivery Format:</span>
                <span className="font-medium text-slate-800">
                  {selectedCourseModal.deliveryType || 'Self-Paced e-Learning'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Estimated Duration:</span>
                <span className="font-bold text-slate-800">
                  {selectedCourseModal.durationHours} Hours ({selectedCourseModal.modulesCount} Curriculum Modules)
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Proficiency Tier:</span>
                <span className="font-bold text-blue-700">{selectedCourseModal.level}</span>
              </div>

              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-amber-900 bg-amber-50/60 -mx-3.5 -mb-3.5 p-2.5 rounded-b-xl border-amber-200/60">
                <span className="font-semibold">Integration Notice:</span>
                <span>Prototype Demonstration • No Live Government API Claimed</span>
              </div>
            </div>

            {/* Curriculum Modules Outline */}
            <div className="mt-4">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Demonstration Syllabus &amp; Key Learning Modules:
              </h4>
              <div className="space-y-1.5 text-xs">
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <span className="text-slate-700 font-medium">1. Core Fundamentals &amp; Official Statistical Standards</span>
                  <span className="text-[10px] text-slate-400 font-mono">Module 1</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <span className="text-slate-700 font-medium">2. Data Pipeline Architecture &amp; Field Schedule Ingestion</span>
                  <span className="text-[10px] text-slate-400 font-mono">Module 2</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <span className="text-slate-700 font-medium">3. Applied Computational Imputation &amp; Quality Control</span>
                  <span className="text-[10px] text-slate-400 font-mono">Module 3</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <span className="text-slate-700 font-medium">4. Aggregate Estimators &amp; Dissemination Standards</span>
                  <span className="text-[10px] text-slate-400 font-mono">Module 4</span>
                </div>
                <div className="p-2 rounded-lg bg-indigo-50/60 border border-indigo-100 flex items-center justify-between text-indigo-900 font-semibold">
                  <span>5. Capstone Knowledge Check &amp; Competency Assessment</span>
                  <span className="text-[10px] bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded font-mono">Assessment</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-5 flex items-center justify-between pt-3.5 border-t border-slate-100">
              <button
                onClick={() => setSelectedCourseModal(null)}
                className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-semibold transition-colors"
              >
                Close
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    const rec = recommendations.find((r) => r.resourceId === selectedCourseModal.id);
                    if (rec) {
                      handleStartQuizForRec(rec);
                    } else if (selectedCourseModal.competencyId === 'tech-python') {
                      startQuiz(
                        'Python for Official Statistics Reassessment Quiz',
                        selectedCourseModal.title,
                        PYTHON_DIAGNOSTIC_QUIZ_QUESTIONS,
                        selectedCourseModal.id
                      );
                      setActiveTab('quiz');
                    } else {
                      const matching = INITIAL_ASSESSMENT_QUESTIONS.filter(
                        (q) => q.competencyId === selectedCourseModal.competencyId
                      );
                      if (matching.length > 0) {
                        startQuiz(
                          `${selectedCourseModal.competencyName} Assessment Quiz`,
                          selectedCourseModal.title,
                          matching,
                          selectedCourseModal.id
                        );
                        setActiveTab('quiz');
                      } else {
                        setActiveTab('upload');
                      }
                    }
                    setSelectedCourseModal(null);
                  }}
                  className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold flex items-center space-x-1.5 border border-indigo-200 transition-colors"
                  title="Directly test competency knowledge"
                >
                  <Play className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Test Knowledge</span>
                </button>

                {enrolledCourses.includes(selectedCourseModal.id) ? (
                  <span className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Enrolled</span>
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      enrollInCourse(selectedCourseModal.id);
                      setSelectedCourseModal(null);
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-2xs"
                  >
                    Confirm Prototype Enrollment
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
