import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  BookOpen,
  ArrowRight,
  Filter,
  Sliders,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Copy,
  ChevronDown,
  ChevronUp,
  FileText,
  Calculator,
} from 'lucide-react';
import { formatEvidenceBlock } from '../../services/competencyEngine';

export const GapAnalysisView: React.FC = () => {
  const {
    competencies,
    userProfile,
    calculateGap,
    getGapCategory,
    setActiveTab,
    startQuiz,
    initialQuestions,
    recommendations,
    engineConfig,
    updateDifficultyWeights,
    resetEngineConfig,
    getCompetencyEvaluation,
    questionAttempts,
  } = useApp();

  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [showConfigPanel, setShowConfigPanel] = useState<boolean>(false);
  const [expandedCompId, setExpandedCompId] = useState<string | null>('tech-python');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Compute gaps and evaluations
  const evaluatedGaps = competencies
    .map((c) => {
      const evaluation = getCompetencyEvaluation(c.id);
      const gap = evaluation.gap;
      const category = evaluation.category;
      const matchingRec = recommendations.find((r) => r.competencyId === c.id);

      // Attempts specifically for this competency
      const compAttempts = questionAttempts.filter((a) => a.competencyId === c.id);

      return {
        ...c,
        evaluation,
        gap,
        category,
        matchingRec,
        compAttempts,
      };
    })
    .sort((a, b) => b.gap - a.gap);

  const filteredGaps = evaluatedGaps.filter((item) => {
    if (filterSeverity === 'ALL') return true;
    return item.category === filterSeverity;
  });

  const criticalCount = evaluatedGaps.filter((g) => g.category === 'Critical Gap').length;
  const highCount = evaluatedGaps.filter((g) => g.category === 'High Gap').length;
  const moderateCount = evaluatedGaps.filter((g) => g.category === 'Moderate Gap').length;
  const strongCount = evaluatedGaps.filter((g) => g.category === 'Strong').length;

  const handleCopyEvidence = (compName: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(compName);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-amber-600 mb-1">
            <TrendingDown className="w-4 h-4" />
            <span>EXPLAINABLE COMPETENCY ENGINE</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Workforce Competency Gap Analysis
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Transparent, deterministic scoring: <span className="font-mono font-bold text-slate-700">gap = max(targetScore - currentScore, 0)</span>.
            Every score is calculated per competency using difficulty weighting (Easy=1.0, Medium=1.5, Hard=2.0) with full item-level evidence.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => setShowConfigPanel(!showConfigPanel)}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-600" />
            <span>{showConfigPanel ? 'Hide Formula Settings' : 'Engine Formula & Weights'}</span>
          </button>

          <button
            onClick={() => setActiveTab('assessment')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            Re-run Diagnostic
          </button>
        </div>
      </div>

      {/* Configurable Formula & Engine Settings Panel */}
      {showConfigPanel && (
        <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-md space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <Calculator className="w-5 h-5 text-blue-400" />
              <h2 className="text-sm font-bold tracking-wide uppercase text-blue-300">
                Deterministic Scoring Engine Configuration
              </h2>
            </div>
            <button
              onClick={resetEngineConfig}
              className="flex items-center space-x-1 text-xs text-slate-400 hover:text-white transition-colors"
              title="Reset weights to default: Easy=1, Medium=1.5, Hard=2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Mathematical Formula Display */}
            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60 font-mono space-y-2">
              <div className="text-slate-400 text-[11px] font-sans font-semibold uppercase">Visible Formulas:</div>
              <div className="text-emerald-400 font-bold">gap = max(targetScore - currentScore, 0)</div>
              <div className="text-cyan-300">
                Normalized Score = round((earnedWeightedPoints / totalWeightedPoints) * 100)
              </div>
              <div className="text-slate-300 text-[11px]">
                Classification:{' '}
                <span className="text-emerald-400">Strong (0–10)</span> |{' '}
                <span className="text-yellow-400">Moderate Gap (11–25)</span> |{' '}
                <span className="text-amber-400">High Gap (26–40)</span> |{' '}
                <span className="text-rose-400">Critical Gap (41+)</span>
              </div>
            </div>

            {/* Configurable Difficulty Weights */}
            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60 space-y-3">
              <div className="text-slate-400 text-[11px] font-semibold uppercase">
                Difficulty Weights (Configurable):
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">Easy Weight</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.5"
                    max="5"
                    value={engineConfig.difficultyWeights.EASY}
                    onChange={(e) =>
                      updateDifficultyWeights({ EASY: parseFloat(e.target.value) || 1 })
                    }
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">Medium Weight</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.5"
                    max="5"
                    value={engineConfig.difficultyWeights.MEDIUM}
                    onChange={(e) =>
                      updateDifficultyWeights({ MEDIUM: parseFloat(e.target.value) || 1.5 })
                    }
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">Hard Weight</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.5"
                    max="5"
                    value={engineConfig.difficultyWeights.HARD}
                    onChange={(e) =>
                      updateDifficultyWeights({ HARD: parseFloat(e.target.value) || 2 })
                    }
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                  />
                </div>
              </div>
              <p className="text-[10px] text-slate-400">
                Adjusting difficulty weights immediately recalculates all normalized competency scores and gap values deterministically.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Severity Filter Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setFilterSeverity('Critical Gap')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            filterSeverity === 'Critical Gap'
              ? 'bg-rose-50 border-rose-400 ring-2 ring-rose-400/30'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
            Critical Gap (41+)
          </div>
          <div className="text-2xl font-black text-rose-700 mt-1">{criticalCount}</div>
          <p className="text-[11px] text-slate-500 mt-0.5">Immediate intervention</p>
        </button>

        <button
          onClick={() => setFilterSeverity('High Gap')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            filterSeverity === 'High Gap'
              ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-400/30'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
            High Gap (26–40)
          </div>
          <div className="text-2xl font-black text-amber-700 mt-1">{highCount}</div>
          <p className="text-[11px] text-slate-500 mt-0.5">Primary study priority</p>
        </button>

        <button
          onClick={() => setFilterSeverity('Moderate Gap')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            filterSeverity === 'Moderate Gap'
              ? 'bg-yellow-50 border-yellow-400 ring-2 ring-yellow-400/30'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-[10px] font-bold uppercase tracking-wider text-yellow-700">
            Moderate Gap (11–25)
          </div>
          <div className="text-2xl font-black text-yellow-800 mt-1">{moderateCount}</div>
          <p className="text-[11px] text-slate-500 mt-0.5">Incremental training</p>
        </button>

        <button
          onClick={() => setFilterSeverity('Strong')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            filterSeverity === 'Strong'
              ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-400/30'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
            Strong (0–10)
          </div>
          <div className="text-2xl font-black text-emerald-700 mt-1">{strongCount}</div>
          <p className="text-[11px] text-slate-500 mt-0.5">Benchmark achieved</p>
        </button>
      </div>

      {filterSeverity !== 'ALL' && (
        <div className="flex items-center justify-between text-xs text-slate-600 px-1">
          <span>
            Showing filtered view: <strong>{filterSeverity}</strong> ({filteredGaps.length} items)
          </span>
          <button
            onClick={() => setFilterSeverity('ALL')}
            className="text-blue-600 font-semibold hover:underline"
          >
            Show All Gaps
          </button>
        </div>
      )}

      {/* Ranked Gap Cards with Evidence Display */}
      <div className="space-y-4">
        {filteredGaps.map((item, idx) => {
          const isExpanded = expandedCompId === item.id;
          const evidenceText = formatEvidenceBlock(item.evaluation);

          return (
            <div
              key={item.id}
              id={`gap-card-${item.id}`}
              className={`bg-white rounded-2xl border transition-all ${
                item.category === 'Critical Gap'
                  ? 'border-rose-200 shadow-xs'
                  : item.category === 'High Gap'
                  ? 'border-amber-200 shadow-xs'
                  : item.category === 'Moderate Gap'
                  ? 'border-yellow-200 shadow-xs'
                  : 'border-slate-200 shadow-xs'
              }`}
            >
              <div className="p-5">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  {/* Left: Rank, Name, Domain */}
                  <div className="flex items-start space-x-3 min-w-0 flex-1">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 font-black text-xs text-slate-500 flex items-center justify-center shrink-0 mt-0.5">
                      #{idx + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                          {item.domain.replace('_', ' ')}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            item.category === 'Critical Gap'
                              ? 'bg-rose-100 text-rose-800'
                              : item.category === 'High Gap'
                              ? 'bg-amber-100 text-amber-800'
                              : item.category === 'Moderate Gap'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {item.category}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 mt-1">
                        {item.name} — {item.currentScore}%{' '}
                        <span className="text-xs font-normal text-slate-500">
                          (Target: {item.targetScore}%, Gap: {item.gap}%)
                        </span>
                      </h3>

                      {/* Visual Progress Bar */}
                      <div className="mt-2 flex items-center space-x-3 max-w-md">
                        <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                          <div
                            className={`h-2.5 rounded-full transition-all duration-500 ${
                              item.gap === 0
                                ? 'bg-emerald-500'
                                : item.category === 'Critical Gap'
                                ? 'bg-rose-500'
                                : item.category === 'High Gap'
                                ? 'bg-amber-500'
                                : 'bg-yellow-500'
                            }`}
                            style={{ width: `${item.currentScore}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-mono font-bold text-slate-700 shrink-0">
                          {item.currentScore}% / {item.targetScore}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="shrink-0 flex flex-wrap lg:flex-nowrap items-center gap-2 w-full lg:w-auto">
                    <button
                      onClick={() => setExpandedCompId(isExpanded ? null : item.id)}
                      className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>{isExpanded ? 'Hide Evidence' : 'Show Evidence'}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {item.matchingRec && (
                      <button
                        onClick={() => setActiveTab('learning')}
                        className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold transition-colors"
                        title={item.matchingRec.courseTitle}
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span className="truncate">iGOT Course</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        const questionsForComp = initialQuestions.filter(
                          (q) => q.competencyId === item.id
                        );
                        const quizQuestions =
                          questionsForComp.length > 0
                            ? questionsForComp
                            : initialQuestions.slice(0, 3);
                        startQuiz(
                          `Calibration Drill: ${item.name}`,
                          `Targeted Diagnostic on ${item.name}`,
                          quizQuestions
                        );
                      }}
                      className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
                    >
                      <span>Practice Drill</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Inline Structured Evidence Summary (Requested Exact Format) */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Formatted Evidence Card */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 font-mono text-xs">
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 text-slate-500 font-sans font-bold text-[10px] uppercase">
                      <span>Score vs Target</span>
                      <button
                        onClick={() => handleCopyEvidence(item.name, evidenceText)}
                        className="text-blue-600 hover:text-blue-800 flex items-center space-x-1 font-mono text-[10px]"
                        title="Copy exact evidence text"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{copiedId === item.name ? 'Copied!' : 'Copy'}</span>
                      </button>
                    </div>
                    <div className="mt-2 space-y-1 font-mono text-[11px] text-slate-800">
                      <div><strong className="text-slate-900">{item.name}</strong> — {item.currentScore}%</div>
                      <div>Target — {item.targetScore}%</div>
                      <div className="font-bold text-amber-700">Gap — {item.gap}%</div>
                    </div>
                  </div>

                  {/* Question Metrics */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                    <div className="text-slate-500 font-bold text-[10px] uppercase tracking-wider pb-1.5 border-b border-slate-200">
                      Assessment Evidence
                    </div>
                    <div className="mt-2 space-y-1 text-slate-800">
                      <div className="font-semibold text-slate-900">
                        {item.evaluation.evidence.questionsAttempted} questions attempted
                      </div>
                      <div className={item.evaluation.evidence.incorrectCount > 0 ? 'text-rose-600 font-semibold' : 'text-emerald-600 font-semibold'}>
                        {item.evaluation.evidence.incorrectCount} incorrect ({item.evaluation.evidence.correctCount} correct)
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        Points: {item.evaluation.evidence.totalWeightedEarned} / {item.evaluation.evidence.totalWeightedPossible} pts
                      </div>
                    </div>
                  </div>

                  {/* Weak Topics */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                    <div className="text-slate-500 font-bold text-[10px] uppercase tracking-wider pb-1.5 border-b border-slate-200">
                      Weak Topics
                    </div>
                    <div className="mt-2">
                      {item.evaluation.evidence.weakTopics.length > 0 ? (
                        <ul className="space-y-1">
                          {item.evaluation.evidence.weakTopics.map((topic, tIdx) => (
                            <li
                              key={`${item.id}-weak-${tIdx}-${topic}`}
                              className="flex items-center space-x-1.5 text-[11px] text-rose-700 font-medium"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></span>
                              <span>{topic}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-[11px] text-emerald-700 font-medium flex items-center space-x-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>No critical weak topics identified</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Item-by-Item Attempt Audit (Expanded Drawer) */}
              {isExpanded && (
                <div className="border-t border-slate-200 bg-slate-50/50 p-5 rounded-b-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                      Item-Level Question Audit ({item.compAttempts.length} Recorded Attempts)
                    </h4>
                    <span className="text-[11px] text-slate-500">
                      Weighted formula: Easy x{engineConfig.difficultyWeights.EASY}, Medium x{engineConfig.difficultyWeights.MEDIUM}, Hard x{engineConfig.difficultyWeights.HARD}
                    </span>
                  </div>

                  {item.compAttempts.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs bg-white rounded-xl border border-slate-200 overflow-hidden">
                        <thead className="bg-slate-100 text-slate-600 font-bold text-[10px] uppercase">
                          <tr>
                            <th className="py-2.5 px-3">Competency ID</th>
                            <th className="py-2.5 px-3">Topic</th>
                            <th className="py-2.5 px-3">Difficulty</th>
                            <th className="py-2.5 px-3">Correct Answer</th>
                            <th className="py-2.5 px-3">User's Answer</th>
                            <th className="py-2.5 px-3">Correctness</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {item.compAttempts.map((attempt, aIdx) => {
                            const attemptKey =
                              attempt.attemptId ||
                              attempt.id ||
                              (attempt.questionId
                                ? `${item.id}-${attempt.questionId}-${attempt.quizId || ''}-${aIdx}`
                                : `${item.id}-attempt-${aIdx}`);
                            const diffKey = attempt.difficulty as keyof typeof engineConfig.difficultyWeights;
                            const weightMultiplier =
                              engineConfig.difficultyWeights[diffKey] ??
                              (attempt.difficulty === 'Hard' ? 2 : attempt.difficulty === 'Medium' ? 1.5 : 1);

                            return (
                              <tr key={attemptKey} className="hover:bg-slate-50/80 transition-colors">
                                <td className="py-2 px-3 font-mono text-[11px] text-slate-500">
                                  {attempt.competencyId}
                                </td>
                                <td className="py-2 px-3 font-medium text-slate-800">
                                  {attempt.topic}
                                </td>
                                <td className="py-2 px-3">
                                  <span
                                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                      attempt.difficulty === 'Hard'
                                        ? 'bg-rose-100 text-rose-800'
                                        : attempt.difficulty === 'Medium'
                                        ? 'bg-amber-100 text-amber-800'
                                        : 'bg-emerald-100 text-emerald-800'
                                    }`}
                                  >
                                    {attempt.difficulty} (x{weightMultiplier})
                                  </span>
                                </td>
                                <td className="py-2 px-3 font-mono text-slate-700">
                                  Option #{attempt.correctAnswer + 1}
                                </td>
                                <td className="py-2 px-3 font-mono text-slate-700">
                                  {attempt.userAnswer >= 0 ? `Option #${attempt.userAnswer + 1}` : 'Unanswered'}
                                </td>
                                <td className="py-2 px-3">
                                  {attempt.correctness ? (
                                    <span className="inline-flex items-center space-x-1 text-emerald-700 font-bold text-[11px]">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                      <span>Correct</span>
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center space-x-1 text-rose-700 font-bold text-[11px]">
                                      <XCircle className="w-3.5 h-3.5 text-rose-600" />
                                      <span>Incorrect</span>
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic bg-white p-3 rounded-lg border border-slate-200">
                      No direct questions attempted yet in this session. Take the diagnostic assessment to generate live question-level logs.
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
