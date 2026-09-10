import React from 'react';
import { useApp } from '../../context/AppContext';
import { CompetencyRadar } from '../charts/CompetencyRadar';
import {
  Award,
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Sparkles,
  ClipboardList,
  UploadCloud,
  Clock,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    userProfile,
    competencies,
    recommendations,
    quizResults,
    calculateGap,
    getGapCategory,
    setActiveTab,
    enrollInCourse,
    enrolledCourses,
  } = useApp();

  // Metrics
  const totalCompetencies = competencies.length;
  const overallScore = Math.round(
    competencies.reduce((acc, c) => acc + c.currentScore, 0) / (totalCompetencies || 1)
  );
  const targetAverage = Math.round(
    competencies.reduce((acc, c) => acc + c.targetScore, 0) / (totalCompetencies || 1)
  );

  const strongCount = competencies.filter((c) => calculateGap(c.targetScore, c.currentScore) <= 10).length;
  const highGaps = competencies
    .map((c) => ({
      ...c,
      gap: calculateGap(c.targetScore, c.currentScore),
      category: getGapCategory(calculateGap(c.targetScore, c.currentScore)),
    }))
    .filter((c) => c.gap >= 26)
    .sort((a, b) => b.gap - a.gap);

  // Group by domains for domain progress
  const domains = ['STATISTICAL', 'TECHNICAL', 'DIGITAL_GOVERNANCE', 'BEHAVIOURAL_MANAGERIAL'] as const;
  const domainAverages = domains.map((domain) => {
    const list = competencies.filter((c) => c.domain === domain);
    const avgCurrent = Math.round(list.reduce((acc, c) => acc + c.currentScore, 0) / (list.length || 1));
    const avgTarget = Math.round(list.reduce((acc, c) => acc + c.targetScore, 0) / (list.length || 1));
    return {
      domain,
      label:
        domain === 'STATISTICAL'
          ? 'Statistical Methods'
          : domain === 'TECHNICAL'
          ? 'Technical & Data Science'
          : domain === 'DIGITAL_GOVERNANCE'
          ? 'Digital Governance & DPI'
          : 'Behavioural & Management',
      avgCurrent,
      avgTarget,
      count: list.length,
    };
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Officer Welcome & Loop Banner - Geometric Balance Theme */}
      <div className="bg-[#0F172A] text-white rounded-xl p-6 border border-slate-800 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-sm">
        <div>
          <div className="flex items-center space-x-2 text-[10px] font-bold tracking-widest text-blue-400 uppercase mb-1">
            <span className="w-2 h-2 rounded-xs bg-blue-500"></span>
            <span>Official Statistics Workforce Intelligence</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Welcome back, {userProfile.name}
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            {userProfile.designation} • {userProfile.department}. Calibrated against MoSPI and NSO competency standards.
          </p>
          
          {/* Continuous Loop Visual */}
          <div className="mt-4 flex flex-wrap items-center gap-1.5 text-[10px] font-medium text-slate-400">
            <span className="font-bold uppercase tracking-wider text-slate-300 mr-1">Continuous Loop:</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">PROFILE</span>
            <span className="text-slate-600">→</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">ASSESS</span>
            <span className="text-slate-600">→</span>
            <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold">IDENTIFY GAP</span>
            <span className="text-slate-600">→</span>
            <span className="px-2 py-0.5 rounded bg-blue-600/20 border border-blue-500/40 text-blue-300">RECOMMEND</span>
            <span className="text-slate-600">→</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">LEARN</span>
            <span className="text-slate-600">→</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">QUIZ</span>
            <span className="text-slate-600">→</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold">
              IMPROVE
            </span>
          </div>
        </div>

        {/* Quick Launch Buttons */}
        <div className="flex flex-wrap lg:flex-col gap-2.5 shrink-0 w-full lg:w-auto">
          <button
            onClick={() => setActiveTab('assessment')}
            className="flex-1 lg:flex-none flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-xs"
          >
            <ClipboardList className="w-4 h-4" />
            <span>Diagnostic Assessment</span>
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className="flex-1 lg:flex-none flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs uppercase tracking-wider transition-colors"
          >
            <UploadCloud className="w-4 h-4 text-blue-400" />
            <span>Upload Material & Quiz</span>
          </button>
        </div>
      </div>

      {/* KPI Cards in Geometric Balance Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Overall Score
            </span>
            <div className="w-7 h-7 rounded bg-blue-50 text-blue-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-slate-900">{overallScore}%</span>
            <span className="text-xs font-normal text-slate-400">Target: {targetAverage}%</span>
          </div>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${overallScore}%` }}
            ></div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              High Priority Gaps
            </span>
            <div className="w-7 h-7 rounded bg-orange-50 text-orange-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-orange-600">
              {highGaps.length < 10 ? `0${highGaps.length}` : highGaps.length}
            </span>
            <span className="text-xs font-medium text-slate-500">Requires Intervention</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500 truncate">
            Top: {highGaps[0]?.name || 'Python'} ({highGaps[0]?.gap || 33}% gap)
          </p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Strong Competencies
            </span>
            <div className="w-7 h-7 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-slate-900">{strongCount}</span>
            <span className="text-xs font-semibold text-emerald-600">of {totalCompetencies} areas</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500 truncate">
            Survey Design, Sampling, Ethics...
          </p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Active Learning (iGOT)
            </span>
            <div className="w-7 h-7 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-black text-slate-900">{enrolledCourses.length}</span>
            <span className="text-xs font-medium text-blue-600">Enrolled Units</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            {recommendations.length} tailored recommendations
          </p>
        </div>
      </div>

      {/* Main Grid: Left 8 cols (Competency Map + Active Learning), Right 4 cols (Gap Intelligence + Upload) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6 flex flex-col">
          {/* Competency Distribution Map Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex-1">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Competency Distribution Map</h3>
                <p className="text-[11px] text-slate-400">Visual breakdown across official statistics skillsets</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-[10px] text-slate-500">Current</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                  <span className="text-[10px] text-slate-500">Target</span>
                </div>
                <button
                  onClick={() => setActiveTab('competencies')}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-0.5 ml-2"
                >
                  <span>All</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Distribution Rows */}
            <div className="space-y-3.5">
              {competencies.slice(0, 6).map((c) => {
                const gap = calculateGap(c.targetScore, c.currentScore);
                const hasHighGap = gap >= 26;
                return (
                  <div key={c.id} className="space-y-1">
                    <div className="flex justify-between text-[11px] font-medium">
                      <span className="text-slate-700 truncate">{c.name}</span>
                      <span className={hasHighGap ? 'text-orange-600 font-bold' : 'text-blue-600'}>
                        {c.currentScore}% / {c.targetScore}%
                      </span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          hasHighGap ? 'bg-orange-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${c.currentScore}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Radar Visual toggle/container */}
            <div className="mt-6 pt-4 border-t border-slate-100">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex justify-between items-center">
                <span>Multi-Axis Radar Analysis</span>
                <span className="text-[10px] font-normal text-slate-400">Target vs Baseline</span>
              </div>
              <CompetencyRadar competencies={competencies} />
            </div>
          </div>

          {/* Subcard Grid (2 columns: Active Learning + Recent Improvement) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Active Learning */}
            <div className="bg-[#F8FAFC] border border-blue-200 p-4 rounded-xl flex flex-col justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Active Learning</p>
                <h4 className="text-sm font-bold text-slate-800 leading-tight">
                  {recommendations[0]?.courseTitle || 'Advanced Sampling Methods for Survey Design'}
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                  {recommendations[0]?.reason || 'Targeted module for National Accounts & survey precision.'}
                </p>
              </div>
              <div className="flex justify-between items-center mt-3 pt-2 border-t border-blue-100">
                <span className="text-[10px] text-slate-500">Source: iGOT Karmayogi</span>
                <button
                  onClick={() => setActiveTab('learning')}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded uppercase tracking-wider transition-colors"
                >
                  RESUME
                </button>
              </div>
            </div>

            {/* Recent Improvement */}
            <div className="bg-white border border-slate-200 p-4 rounded-xl flex flex-col justify-between shadow-xs">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Recent Improvement</p>
                <h4 className="text-sm font-bold text-slate-800 leading-tight">
                  {quizResults[0]?.competencyUpdates[0]?.competencyName || 'Data Privacy & Ethics Compliance'}
                </h4>
                <p className="text-[10px] text-slate-400">
                  {quizResults.length > 0
                    ? `Score improved by +${quizResults[0].competencyUpdates[0]?.delta || 14}% after quiz`
                    : 'Score improved by +14% after diagnostic reassessment'}
                </p>
              </div>
              <div className="mt-3">
                <div className="h-1.5 bg-emerald-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '100%' }}></div>
                </div>
                <div className="mt-1 flex justify-between text-[9px] text-slate-400">
                  <span>Diagnostic Reassessment</span>
                  <span className="text-emerald-600 font-bold">Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Gap Intelligence (Dark Slate) + Upload Material */}
        <div className="lg:col-span-4 space-y-6 flex flex-col">
          {/* Gap Intelligence (Signature Geometric Dark Slate Panel) */}
          <div className="bg-slate-900 text-white p-5 rounded-xl border border-slate-800 flex-1 flex flex-col">
            <h3 className="font-bold text-sm mb-4 border-b border-slate-800 pb-2 flex justify-between items-center">
              <span>Gap Intelligence</span>
              <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded font-mono font-semibold">
                Priority
              </span>
            </h3>

            <div className="space-y-3 flex-1">
              {highGaps.slice(0, 3).map((comp) => {
                return (
                  <div key={comp.id} className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-xs font-bold text-slate-100 truncate">{comp.name}</h4>
                      <span className="text-[9px] text-orange-400 font-mono font-bold shrink-0 ml-2">
                        GAP: {comp.gap < 10 ? `0${comp.gap}` : comp.gap}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 italic mb-2 line-clamp-2">
                      {comp.name.includes('Python')
                        ? '"Performance below target proficiency in Pandas & Data Analysis modules."'
                        : comp.name.includes('Data Quality')
                        ? '"Insufficient validation scores in National Accounts auditing framework."'
                        : `"${comp.description}"`}
                    </p>
                    <div className="text-[9px] uppercase tracking-tighter text-slate-500 flex justify-between">
                      <span>Level: {comp.category}</span>
                      <span>Rec: 2 Units</span>
                    </div>
                  </div>
                );
              })}

              {/* Lower Priority subtle row */}
              <div className="bg-slate-800/40 p-3 rounded-lg border border-slate-800 opacity-60">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-xs font-bold text-slate-400">GIS for Statistics</h4>
                  <span className="text-[9px] text-slate-500 font-mono">GAP: 05</span>
                </div>
                <div className="text-[9px] uppercase tracking-tighter text-slate-600 flex justify-between">
                  <span>Level: Strong</span>
                  <span>Rec: 0 Units</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('gaps')}
              className="mt-4 w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold border border-slate-700 transition-colors flex items-center justify-center space-x-1"
            >
              <span>Explore All Deficits</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Upload Material Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 text-sm mb-3">Upload Material</h3>
            <div
              onClick={() => setActiveTab('upload')}
              className="border-2 border-dashed border-slate-200 rounded-lg p-4 text-center cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <div className="w-8 h-8 bg-slate-100 rounded-full mx-auto mb-2 flex items-center justify-center text-slate-400 font-bold text-lg">
                +
              </div>
              <p className="text-[10px] text-slate-500 font-medium">
                Drop PDF or DOCX here to<br />generate competency quizzes
              </p>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">Grounded Gemini Intelligence</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Learning (iGOT) Lower Section */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-slate-900">
                Recommended Learning Path
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                DEMO DATA
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Tailored for {userProfile.designation} based on measured competency deficits
            </p>
          </div>
          <button
            onClick={() => setActiveTab('learning')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
          >
            <span>Explore iGOT Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendations.slice(0, 3).map((rec) => {
            const isEnrolled = enrolledCourses.includes(rec.resourceId);
            return (
              <div
                key={rec.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                      {rec.source} (Prototype)
                    </span>
                    <span className="text-[9px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                      {rec.priority}
                    </span>
                  </div>

                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">Course:</span>
                  <h3 className="text-xs font-bold text-slate-900 leading-snug">
                    {rec.courseTitle}
                  </h3>

                  <div className="mt-2 text-[11px] grid grid-cols-2 gap-1 py-1.5 border-t border-b border-slate-200/60">
                    <div>
                      <span className="text-[9px] text-slate-400 block">Target:</span>
                      <span className="font-semibold text-slate-700">{rec.competencyName}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block">Gap:</span>
                      <span className="font-bold text-rose-600">{rec.gapPercentagePoints || `${rec.gap} percentage points`}</span>
                    </div>
                  </div>

                  <div className="mt-2">
                    <span className="text-[9px] font-bold uppercase text-slate-400 block">Reason:</span>
                    <p className="text-[11px] text-slate-600 line-clamp-3 italic mt-0.5">
                      "{rec.reason}"
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {rec.estimatedLearningDuration}
                  </span>
                  {isEnrolled ? (
                    <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 text-[11px] font-semibold flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Enrolled</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => enrollInCourse(rec.resourceId)}
                      className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded transition-colors"
                    >
                      Enroll (Demo)
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
