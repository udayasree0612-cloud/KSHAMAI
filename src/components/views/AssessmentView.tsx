import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Question } from '../../types';
import {
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Award,
  AlertCircle,
} from 'lucide-react';

export const AssessmentView: React.FC = () => {
  const {
    initialQuestions,
    competencies,
    userProfile,
    submitQuiz,
    setActiveTab,
    calculateGap,
  } = useApp();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submittedResult, setSubmittedResult] = useState<any>(null);

  const currentQ = initialQuestions[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / initialQuestions.length) * 100);

  const handleSelectOption = (optIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optIndex,
    }));
  };

  const handleNext = () => {
    if (currentIndex < initialQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    const answeredCount = Object.keys(selectedAnswers).length;
    if (answeredCount < initialQuestions.length) {
      if (
        !confirm(
          `You have answered ${answeredCount} of ${initialQuestions.length} questions. Submit anyway?`
        )
      ) {
        return;
      }
    }

    const result = submitQuiz(
      'Baseline Diagnostic Assessment',
      'Official Statistics Workforce Competency Evaluation',
      selectedAnswers,
      initialQuestions
    );
    setSubmittedResult(result);
    setIsSubmitted(true);
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setIsSubmitted(false);
    setSubmittedResult(null);
  };

  // If submitted, show full deterministic diagnostic report
  if (isSubmitted && submittedResult) {
    return (
      <div className="space-y-6 pb-12">
        {/* Results Banner */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              DIAGNOSTIC ASSESSMENT COMPLETE
            </span>
            <h1 className="text-2xl font-black text-slate-900 mt-1">
              Assessment Results & Competency Baseline
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Officer: <strong>{userProfile.name}</strong> • Role: <strong>{userProfile.designation}</strong>
            </p>
          </div>

          <div className="flex items-center space-x-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <p className="text-xs font-semibold text-slate-500">Overall Accuracy</p>
              <p className="text-3xl font-black text-blue-600">
                {submittedResult.scorePercentage}%
              </p>
            </div>
            <div className="border-l border-slate-200 pl-4">
              <p className="text-xs font-semibold text-slate-500">Score</p>
              <p className="text-xl font-bold text-slate-800">
                {submittedResult.correctAnswersCount} / {submittedResult.totalQuestions}
              </p>
            </div>
          </div>
        </div>

        {/* Competency Deltas Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
            Competency-Wise Performance & Baseline Calibration
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Scores were updated deterministically using transparent mathematical combining:
          </p>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {submittedResult.competencyUpdates.map((u: any) => {
              const comp = competencies.find((c) => c.id === u.competencyId);
              const target = comp?.targetScore || 75;
              const gap = calculateGap(target, u.scoreAfter);

              return (
                <div key={u.competencyId} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{u.competencyName}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                      {u.correctAnswers}/{u.totalQuestions} Correct
                    </span>
                  </div>

                  <div className="mt-3 flex items-baseline justify-between text-xs">
                    <span className="text-slate-500">
                      Before: <strong>{u.scoreBefore}%</strong>
                    </span>
                    <span className="text-emerald-700 font-bold">
                      Now: <strong>{u.scoreAfter}%</strong> (+{u.delta}%)
                    </span>
                  </div>

                  {/* Target and Gap */}
                  <div className="mt-2 text-[11px] flex justify-between border-t border-slate-200/60 pt-2 text-slate-500">
                    <span>Target: {target}%</span>
                    <span className={gap > 0 ? 'text-rose-600 font-semibold' : 'text-emerald-600 font-semibold'}>
                      {gap > 0 ? `Gap: -${gap}%` : 'Target Met'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Question-by-Question Detailed Review */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
            Detailed Question Review & Explanations
          </h2>

          <div className="mt-4 space-y-4">
            {initialQuestions.map((q, idx) => {
              const userAnswer = selectedAnswers[q.id];
              const isCorrect = userAnswer === q.correctAnswer;

              return (
                <div
                  key={q.id}
                  className={`p-4.5 rounded-xl border ${
                    isCorrect ? 'border-emerald-200 bg-emerald-50/20' : 'border-rose-200 bg-rose-50/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-400">Q{idx + 1}.</span>
                      <span className="text-xs font-bold text-slate-900">{q.topic}</span>
                      <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {q.difficulty}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1.5 shrink-0">
                      {isCorrect ? (
                        <span className="flex items-center text-xs font-bold text-emerald-700 space-x-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Correct</span>
                        </span>
                      ) : (
                        <span className="flex items-center text-xs font-bold text-rose-700 space-x-1">
                          <XCircle className="w-4 h-4 text-rose-600" />
                          <span>Incorrect</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs font-semibold text-slate-800 mt-2">{q.question}</p>

                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = userAnswer === optIdx;
                      const isRealAnswer = q.correctAnswer === optIdx;

                      let style = 'border-slate-200 bg-white text-slate-700';
                      if (isRealAnswer) style = 'border-emerald-500 bg-emerald-100/60 font-bold text-emerald-900';
                      else if (isSelected && !isRealAnswer)
                        style = 'border-rose-500 bg-rose-100/60 text-rose-900 line-through';

                      return (
                        <div
                          key={optIdx}
                          className={`p-2.5 rounded-lg border text-[11px] flex items-center justify-between ${style}`}
                        >
                          <span>
                            {String.fromCharCode(65 + optIdx)}. {opt}
                          </span>
                          {isRealAnswer && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 ml-1 shrink-0" />}
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-3 p-3 rounded-lg bg-white border border-slate-200 text-xs text-slate-600 leading-relaxed">
                    <strong className="text-slate-800">Pedagogical Explanation: </strong>
                    {q.explanation}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={handleRetake}
              className="flex items-center space-x-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Diagnostic Assessment</span>
            </button>

            <button
              onClick={() => setActiveTab('gaps')}
              className="flex items-center space-x-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs"
            >
              <span>View Updated Gap Analysis</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active Assessment Question Flow
  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Assessment Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              NSO OFFICIAL STATISTICS EVALUATION
            </span>
            <h1 className="text-xl font-bold text-slate-900 mt-1">
              Diagnostic Competency Assessment
            </h1>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono font-bold text-slate-500">
              Question {currentIndex + 1} of {initialQuestions.length}
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

      {/* Current Question Card */}
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

          {/* Nav Controls */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {currentIndex < initialQuestions.length - 1 ? (
              <button
                onClick={handleNext}
                className="flex items-center space-x-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs"
              >
                <span>Next Question</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex items-center space-x-1.5 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                <span>Submit Assessment</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
