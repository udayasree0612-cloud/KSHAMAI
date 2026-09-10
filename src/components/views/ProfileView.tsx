import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  Briefcase,
  Building,
  GraduationCap,
  Calendar,
  Save,
  RotateCcw,
  CheckCircle2,
  FileDown,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { userProfile, updateUserProfile, resetCompetencies, competencies, calculateGap } = useApp();

  const [formData, setFormData] = useState({
    name: userProfile.name,
    email: userProfile.email,
    designation: userProfile.designation,
    cadre: userProfile.cadre || 'Subordinate Statistical Service (SSS)',
    department: userProfile.department,
    yearsOfExperience: userProfile.yearsOfExperience,
    highestQualification: userProfile.highestQualification,
    jobRole: userProfile.jobRole,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      ...formData,
      yearsOfExperience: Number(formData.yearsOfExperience),
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleExportReport = () => {
    const reportData = {
      officer: formData,
      exportDate: new Date().toISOString(),
      competencies: competencies.map((c) => ({
        name: c.name,
        domain: c.domain,
        currentScore: c.currentScore,
        targetScore: c.targetScore,
        gap: calculateGap(c.targetScore, c.currentScore),
        proficiencyLevel: c.proficiencyLevel,
      })),
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `KshamAI_Report_${formData.name.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-700 text-white font-black text-xl flex items-center justify-center shadow-md shadow-blue-500/20">
            {formData.name.split(' ').map((n) => n[0]).join('')}
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">{formData.name}</h1>
            <p className="text-xs text-slate-500">
              {formData.designation} • {formData.cadre}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">{formData.department}</p>
          </div>
        </div>

        <button
          onClick={handleExportReport}
          className="flex items-center space-x-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
        >
          <FileDown className="w-4 h-4" />
          <span>Export Dossier (JSON)</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Profile configuration saved successfully. Competency benchmarks updated!</span>
        </div>
      )}

      {/* Edit Form */}
      <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
        <h2 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center space-x-2">
          <Briefcase className="w-4 h-4 text-blue-600" />
          <span>Officer Profile Details & Cadre Calibration</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Government Email ID</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Designation</label>
            <select
              value={formData.designation}
              onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="Junior Statistical Officer">Junior Statistical Officer (JSO)</option>
              <option value="Statistical Officer">Statistical Officer (SO)</option>
              <option value="Senior Statistical Officer">Senior Statistical Officer (SSO)</option>
              <option value="Assistant Director">Assistant Director</option>
              <option value="Deputy Director">Deputy Director</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Cadre Service</label>
            <input
              type="text"
              value={formData.cadre}
              onChange={(e) => setFormData({ ...formData, cadre: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Ministry / Department</label>
            <input
              type="text"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Years in Service</label>
            <input
              type="number"
              min="0"
              max="40"
              value={formData.yearsOfExperience}
              onChange={(e) => setFormData({ ...formData, yearsOfExperience: Number(e.target.value) })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-semibold text-slate-700 mb-1">Highest Academic Qualification</label>
            <input
              type="text"
              value={formData.highestQualification}
              onChange={(e) => setFormData({ ...formData, highestQualification: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              if (confirm('Reset entire learner history and return to default profile?')) {
                resetCompetencies();
              }
            }}
            className="flex items-center space-x-1.5 px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Everything to Default</span>
          </button>

          <button
            type="submit"
            className="flex items-center space-x-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile</span>
          </button>
        </div>
      </form>
    </div>
  );
};
