import React from 'react';
import { useApp } from '../context/AppContext';
import { Bell, Sparkles, UserCheck, Shield, ChevronRight } from 'lucide-react';

interface HeaderProps {
  onOpenMobileNav?: () => void;
}

export const Header: React.FC<HeaderProps> = () => {
  const { userProfile, activeTab, setActiveTab, competencies, calculateGap } = useApp();

  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Learner Competency Dashboard';
      case 'competencies':
        return 'Official Statistics Competency Framework';
      case 'gaps':
        return 'Competency Gap Analysis & Diagnostics';
      case 'learning':
        return 'Personalized Learning & iGOT Resources';
      case 'assessment':
        return 'Diagnostic Assessment Engine';
      case 'upload':
        return 'Upload Learning Material & AI MCQ Generator';
      case 'quiz':
        return 'Active Assessment & Reassessment Quiz';
      case 'admin':
        return 'National Workforce Competency Intelligence';
      case 'assistant':
        return 'KshamAI Intelligence Assistant';
      case 'profile':
        return 'Officer Profile & Role Configuration';
      default:
        return 'Competency Intelligence';
    }
  };

  // Geometric balance header metrics
  const totalComp = competencies.length || 1;
  const avgScore = (competencies.reduce((acc, c) => acc + c.currentScore, 0) / totalComp).toFixed(1);
  const highGapsCount = competencies.filter((c) => calculateGap(c.targetScore, c.currentScore) >= 26).length;

  return (
    <header
      id="app-header"
      className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col md:flex-row md:items-end justify-between gap-4 sticky top-0 z-20 shadow-xs"
    >
      {/* Left: Section label & Department Title */}
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-100 px-2 py-0.5 rounded">
            Current Profile
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-xs text-slate-500 font-medium">{getTabTitle()}</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          {userProfile.department || 'Department of Statistics'}
        </h2>
        <p className="text-slate-500 text-xs hidden sm:block">
          Competency Identification &amp; Personalized Learning Intelligence • {userProfile.designation}
        </p>
      </div>

      {/* Right: Metrics & Actions */}
      <div className="flex items-center space-x-4">
        {/* Geometric Balance Metric: Overall Score */}
        <div className="text-right">
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">Overall Score</p>
          <p className="text-xl sm:text-2xl font-black text-slate-800 leading-none">
            {avgScore}
            <span className="text-xs font-normal text-slate-400 ml-0.5">/ 100</span>
          </p>
        </div>

        {/* Vertical Divider */}
        <div className="w-px h-9 bg-slate-200"></div>

        {/* Geometric Balance Metric: High Priority Gaps */}
        <div className="text-right">
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">High Priority Gaps</p>
          <p className="text-xl sm:text-2xl font-black text-orange-600 leading-none">
            {highGapsCount < 10 ? `0${highGapsCount}` : highGapsCount}
          </p>
        </div>

        {/* Vertical Divider */}
        <div className="w-px h-9 bg-slate-200 hidden sm:block"></div>

        {/* Quick KshamAI Trigger */}
        <button
          id="header-assistant-btn"
          onClick={() => setActiveTab('assistant')}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span className="hidden sm:inline">Ask</span> KshamAI
        </button>

        {/* Profile Pill */}
        <div
          onClick={() => setActiveTab('profile')}
          className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center cursor-pointer shadow-xs hover:ring-2 hover:ring-blue-400 transition-all shrink-0"
          title={`${userProfile.name} (${userProfile.designation})`}
        >
          {userProfile.name.split(' ').map((n) => n[0]).join('')}
        </div>
      </div>
    </header>
  );
};
