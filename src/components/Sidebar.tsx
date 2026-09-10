import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  Award,
  TrendingDown,
  BookOpen,
  ClipboardCheck,
  UploadCloud,
  HelpCircle,
  ShieldCheck,
  Bot,
  User,
  ExternalLink,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, userProfile, activeQuiz } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Learner Dashboard', icon: LayoutDashboard },
    { id: 'competencies', label: 'Competency Framework', icon: Award },
    { id: 'gaps', label: 'Gap Analysis', icon: TrendingDown, badge: 'Targeted' },
    { id: 'learning', label: 'Personalized Learning (iGOT)', icon: BookOpen },
    { id: 'assessment', label: 'Diagnostic Assessment', icon: ClipboardCheck },
    { id: 'upload', label: 'AI Assessment Generator', icon: UploadCloud, highlight: true },
    {
      id: 'quiz',
      label: 'Quiz Engine',
      icon: HelpCircle,
      badge: activeQuiz ? 'Active' : undefined,
    },
    { id: 'admin', label: 'Admin Intelligence', icon: ShieldCheck },
    { id: 'assistant', label: 'KshamAI Assistant', icon: Bot },
    { id: 'profile', label: 'Profile & Settings', icon: User },
  ];

  return (
    <aside
      id="app-sidebar"
      className="w-64 bg-[#0F172A] text-white flex flex-col h-screen shrink-0 select-none z-30 border-r border-slate-800"
    >
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-400/40 text-blue-400 flex items-center justify-center font-bold text-sm tracking-tight shadow-xs">
            क्ष
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-blue-400 leading-none">KshamAI</h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-400 mt-1 italic leading-none">
              AI-Powered Competency Intelligence
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        <div className="px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">
          Navigation
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs transition-colors text-left ${
                isActive
                  ? 'bg-blue-600/20 text-blue-400 border-l-4 border-blue-500 font-medium pl-3'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center space-x-3 truncate">
                <div
                  className={`w-4 h-4 flex items-center justify-center rounded-xs shrink-0 ${
                    isActive ? 'text-blue-400' : 'text-slate-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-tight ${
                    isActive
                      ? 'bg-blue-500/30 text-blue-200'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Profile & Adapter Footer */}
      <div className="p-5 border-t border-slate-800">
        <div
          onClick={() => setActiveTab('profile')}
          className="flex items-center space-x-3 mb-3.5 cursor-pointer hover:opacity-90 transition-opacity"
        >
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-xs">
            {userProfile.name.split(' ').map((n) => n[0]).join('')}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-200 truncate">{userProfile.name}</p>
            <p className="text-[10px] text-slate-400 italic truncate">{userProfile.designation}</p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-2 rounded text-[9px] text-slate-400 text-center border border-slate-700 uppercase tracking-tight">
          iGOT Karmayogi — Prototype Adapter
        </div>
      </div>
    </aside>
  );
};
