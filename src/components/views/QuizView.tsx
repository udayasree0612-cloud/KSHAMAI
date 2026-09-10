import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Question, QuizResult } from '../../types';
import { PYTHON_DIAGNOSTIC_QUIZ_QUESTIONS } from '../../data/initialData';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  TrendingUp,
  RotateCcw,
  Sparkles,
  BookOpen,
  Play,
  Award,
  GraduationCap,
  ChevronRight,
} from 'lucide-react';

export const QuizView: React.FC = () => {
  const {
    activeQuiz,
    materials,
    initialQuestions,
    startQuiz,
    submitQuiz,
    setActiveTab,
    competencies,
    calculateGap,
    getGapCategory,
  } = useApp();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmittedResult, setQuizSubmittedResult] = useState<QuizResult | null>(null);

  // If there's no active quiz, let the user pick one from uploaded materials or baseline
  if (!activeQuiz) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 pb-12">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center space-x-2 text-xs font-semibold text-blue-600 mb-1">
            <HelpCircle className="w-4 h-4" />
            <span>KSHAMAI QUIZ ENGINE</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">Available Practice & Reassessment Quizzes</h1>
          <p className="text-xs text-slate-500 mt-1">
            Select a quiz to test your knowledge, calculate score updates, and close measurable competency gaps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Targeted Competency Practice Quiz: Python */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-blue-400 transition-all">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Target Competency: Python (High Gap)
                </span>
                <span className="text-[10px] font-mono font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                  Gap: 33 pts
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 mt-2">
                Python for Official Statistics Reassessment Quiz
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Grounded in NSSTA coding guidelines: Pandas vectorization, weighted aggregations, outlier filtering (MAD), and microdata anonymization.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                {PYTHON_DIAGNOSTIC_QUIZ_QUESTIONS.length} Questions (Easy · Med · Hard)
              </span>
              <button
                onClick={() =>
                  startQuiz(
                    'Python for Official Statistics Reassessment Quiz',
                    'NSSTA Python for Official Statistics Module',
                    PYTHON_DIAGNOSTIC_QUIZ_QUESTIONS,
                    'mat-003'
                  )
                }
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-1"
              >
                <span>Take Python Quiz</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Baseline Diagnostic Quiz */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-blue-400 transition-all">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                Official Baseline
              </span>
              <h3 className="text-sm font-bold text-slate-900 mt-2">
                Official Statistics Comprehensive Diagnostic
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Evaluation spanning Survey Design, Python for Statistics, Data Quality, National Accounts, and DPI.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                {initialQuestions.length} Questions
              </span>
              <button
                onClick={() =>
                  startQuiz(
                    'Official Statistics Diagnostic',
                    'Comprehensive Baseline Questions',
                    initialQuestions
                  )
                }
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-1"
              >
                <span>Start Quiz</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quizzes from Uploaded Materials */}
          {materials.map((mat) => {
            const comp = competencies.find((c) => c.id === mat.competencyId);
            const questionCount = mat.generatedQuestions?.length || 0;

            return (
              <div
                key={mat.id}
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-blue-400 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      Grounded in {comp?.name || 'Manual'}
                    </span>
                    <span className="text-[10px] text-slate-400">{mat.uploadedAt}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mt-2">{mat.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {mat.extractedText.slice(0, 140)}...
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">
                    {questionCount > 0 ? `${questionCount} Questions` : 'Ready to generate'}
                  </span>
                  {questionCount > 0 ? (
                    <button
                      onClick={() =>
                        startQuiz(
                          `Quiz: ${mat.title}`,
                          mat.title,
                          mat.generatedQuestions!,
                          mat.id
                        )
                      }
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-1"
                    >
                      <span>Take Quiz</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setActiveTab('upload')}
                      className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                    >
                      Generate First
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Active Questions
  const questions = activeQuiz.questions;
  const currentQ = questions[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  const handleSelectOption = (optIndex: number) => {
    if (quizSubmittedResult) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optIndex,
    }));
  };

  const handleSubmit = () => {
    const answeredCount = Object.keys(selectedAnswers).length;
    if (answeredCount < questions.length) {
      if (
        !confirm(
          `You answered ${answeredCount} of ${questions.length} questions. Submit anyway?`
        )
      ) {
        return;
      }
    }

    const res = submitQuiz(
      activeQuiz.title,
      activeQuiz.sourceTitle,
      selectedAnswers,
      questions
    );
    setQuizSubmittedResult(res);
  };

  // If result submitted, show the Before vs After score improvements
  if (quizSubmittedResult) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 pb-12">
        {/* Results Banner */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>MEASURED IMPROVEMENT RECORDED</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900">{activeQuiz.title}</h1>
            <p className="text-xs text-slate-500 mt-1">Source: {activeQuiz.sourceTitle}</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl text-center min-w-[140px]">
            <p className="text-xs font-semibold text-blue-700">Quiz Score</p>
            <p className="text-3xl font-black text-blue-900">
              {quizSubmittedResult.scorePercentage}%
            </p>
            <p className="text-[10px] text-blue-600 font-medium mt-0.5">
              {quizSubmittedResult.correctAnswersCount} / {quizSubmittedResult.totalQuestions} Correct
            </p>
          </div>
        </div>

        {/* Before vs After Competency Scores (Crucial Product Loop Requirement) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>COMPETENCY IMPROVEMENT</span>
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-0.5">
                Deterministic Score & Deficit Calibration
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-mono bg-slate-100 px-2.5 py-1 rounded-lg">
              Difficulty Weights: Easy (1.0) · Med (1.5) · Hard (2.0)
            </span>
          </div>

          <div className="space-y-4">
            {quizSubmittedResult.competencyUpdates.map((u) => {
              const comp = competencies.find((c) => c.id === u.competencyId);
              const target = comp?.targetScore || 75;
              const prevGap = u.previousGap !== undefined ? u.previousGap : Math.max(target - u.scoreBefore, 0);
              const newGap = u.currentGap !== undefined ? u.currentGap : Math.max(target - u.scoreAfter, 0);
              const reduction = u.gapReduction !== undefined ? u.gapReduction : (prevGap - newGap);
              const incorrectCount = u.totalQuestions - u.correctAnswers;
              const gapCategory = getGapCategory(newGap);

              return (
                <div
                  key={u.competencyId}
                  className="p-5 rounded-xl border border-slate-200/90 bg-slate-50/70 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold tracking-wider uppercase text-blue-600">
                        Evaluated Competency
                      </span>
                      <h3 className="text-lg font-black text-slate-900">{u.competencyName}</h3>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                          gapCategory === 'Strong'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : gapCategory === 'Moderate Gap'
                            ? 'bg-blue-100 text-blue-800 border-blue-300'
                            : gapCategory === 'High Gap'
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : 'bg-rose-100 text-rose-800 border-rose-300'
                        }`}
                      >
                        {gapCategory}
                      </span>
                      {reduction > 0 && (
                        <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-600 text-white shadow-2xs">
                          Gap Reduced: -{reduction} pts
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Section 6 Structured Metrics Card */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3 text-center">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Before</span>
                      <span className="text-sm font-bold text-slate-700">{u.scoreBefore}%</span>
                    </div>
                    <div className="border-l border-slate-100">
                      <span className="text-[10px] font-bold uppercase text-blue-600 block">After</span>
                      <span className="text-sm font-black text-blue-700">{u.scoreAfter}%</span>
                    </div>
                    <div className="border-l border-slate-100">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Target</span>
                      <span className="text-sm font-bold text-slate-700">{target}%</span>
                    </div>
                    <div className="border-l border-slate-100">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Previous Gap</span>
                      <span className="text-sm font-bold text-rose-600">{prevGap} pts</span>
                    </div>
                    <div className="border-l border-slate-100">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Current Gap</span>
                      <span className="text-sm font-black text-slate-900">{newGap} pts</span>
                    </div>
                    <div className="border-l border-slate-100">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Attempted</span>
                      <span className="text-sm font-bold text-slate-700">{u.totalQuestions}</span>
                    </div>
                    <div className="border-l border-slate-100">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Correct</span>
                      <span className="text-sm font-bold text-emerald-600">{u.correctAnswers}</span>
                    </div>
                    <div className="border-l border-slate-100">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Incorrect</span>
                      <span className="text-sm font-bold text-rose-600">{incorrectCount}</span>
                    </div>
                  </div>

                  {/* Highlights Bar: Score Change & Gap Reduction */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-emerald-50/70 border border-emerald-200 rounded-lg p-3 flex items-center justify-between">
                      <span className="text-xs font-semibold text-emerald-900">Score Change:</span>
                      <span className="text-xs font-bold text-emerald-700">
                        {u.delta >= 0 ? `+${u.delta}` : u.delta} percentage points
                      </span>
                    </div>
                    <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-3 flex items-center justify-between">
                      <span className="text-xs font-semibold text-blue-900">Gap Reduction:</span>
                      <span className="text-xs font-bold text-blue-700">
                        {reduction > 0 ? `Reduced by ${reduction} pts (${prevGap} → ${newGap})` : 'No gap reduction'}
                      </span>
                    </div>
                  </div>

                  {/* Weak Topics */}
                  <div className="bg-white p-3.5 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-700 shrink-0">
                      Weak Topics (Incorrect Answers):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {u.weakTopics && u.weakTopics.length > 0 ? (
                        u.weakTopics.map((topic, i) => (
                          <span
                            key={i}
                            className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200"
                          >
                            {topic}
                          </span>
                        ))
                      ) : (
                        <span className="text-[11px] font-semibold text-emerald-700 flex items-center">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                          Zero weak topics detected (100% accuracy in this assessment!)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Question Review */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
            Question Review & Grounded Explanations
          </h2>

          <div className="mt-4 space-y-4">
            {questions.map((q, idx) => {
              const userAnswer = selectedAnswers[q.id];
              const isCorrect = userAnswer === q.correctAnswer;

              return (
                <div
                  key={q.id}
                  className={`p-4 rounded-xl border text-xs ${
                    isCorrect ? 'border-emerald-200 bg-emerald-50/20' : 'border-rose-200 bg-rose-50/20'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="font-bold text-slate-900">
                      Q{idx + 1}. {q.question}
                    </span>
                    {isCorrect ? (
                      <span className="flex items-center text-emerald-700 font-bold ml-2 shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        Correct
                      </span>
                    ) : (
                      <span className="flex items-center text-rose-700 font-bold ml-2 shrink-0">
                        <XCircle className="w-3.5 h-3.5 mr-1" />
                        Incorrect
                      </span>
                    )}
                  </div>

                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = userAnswer === optIdx;
                      const isReal = q.correctAnswer === optIdx;

                      let style = 'bg-white border-slate-200 text-slate-700';
                      if (isReal) style = 'bg-emerald-100 border-emerald-400 font-semibold text-emerald-900';
                      else if (isSelected && !isReal)
                        style = 'bg-rose-100 border-rose-400 text-rose-900 line-through';

                      return (
                        <div key={optIdx} className={`p-2 rounded-lg border text-[11px] ${style}`}>
                          {String.fromCharCode(65 + optIdx)}. {opt}
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-3 p-2.5 rounded-lg bg-white border border-slate-200 text-[11px] text-slate-600">
                    <strong className="text-slate-800">Explanation: </strong>
                    {q.explanation}
                  </div>

                  {(q.sourceReference || q.sourceQuote || q.sourceText) && (
                    <div className="mt-2 p-2.5 rounded-lg bg-amber-50/90 border border-amber-200 text-[11px] text-amber-950">
                      <div className="flex items-center space-x-1 font-bold text-amber-900 mb-0.5 text-[10px] uppercase tracking-wider">
                        <BookOpen className="w-3 h-3 text-amber-700" />
                        <span>Source Reference Grounding (Document Excerpt):</span>
                      </div>
                      <p className="italic text-amber-900 leading-relaxed font-serif text-[11px]">
                        "{q.sourceReference || q.sourceQuote || q.sourceText}"
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Finish & Loop Action */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => {
                setSelectedAnswers({});
                setCurrentIndex(0);
                setQuizSubmittedResult(null);
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center space-x-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Quiz</span>
            </button>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActiveTab('gaps')}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center space-x-1.5"
              >
                <span>View Gap Analysis</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setActiveTab('learning')}
                className="px-4 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-xs font-semibold flex items-center space-x-1.5"
              >
                <GraduationCap className="w-4 h-4 text-amber-700" />
                <span>Recalculated Recommendations</span>
              </button>

              <button
                onClick={() => setActiveTab('dashboard')}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center space-x-1.5"
              >
                <span>View Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Active Quiz Question
  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              {activeQuiz.sourceTitle}
            </span>
            <h1 className="text-lg font-bold text-slate-900 mt-0.5">{activeQuiz.title}</h1>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono font-bold text-slate-500">
              Question {currentIndex + 1} of {questions.length}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Question Card */}
      {currentQ && (
        <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
              {currentQ.topic}
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
              {currentQ.difficulty}
            </span>
          </div>

          <h2 className="text-base font-bold text-slate-900 leading-snug">
            {currentQ.question}
          </h2>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((optionText, optIdx) => {
              const isSelected = selectedAnswers[currentQ.id] === optIdx;

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  className={`w-full p-4 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/80 text-blue-950 ring-2 ring-blue-600/20 font-semibold'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span
                      className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold shrink-0 ${
                        isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span>{optionText}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                className="flex items-center space-x-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex items-center space-x-1.5 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                <span>Submit & Update Competencies</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
