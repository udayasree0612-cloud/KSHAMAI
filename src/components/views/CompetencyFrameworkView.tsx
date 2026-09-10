import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Competency, CompetencyDomain, ProficiencyLevel } from '../../types';
import {
  Award,
  Search,
  Filter,
  Plus,
  RotateCcw,
  Sliders,
  Check,
  X,
  Edit2,
  ChevronDown,
} from 'lucide-react';

export const CompetencyFrameworkView: React.FC = () => {
  const {
    competencies,
    updateCompetency,
    addCompetency,
    resetCompetencies,
    calculateGap,
    getGapCategory,
  } = useApp();

  const [selectedDomain, setSelectedDomain] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingComp, setEditingComp] = useState<Competency | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New competency form state
  const [newName, setNewName] = useState('');
  const [newDomain, setNewDomain] = useState<CompetencyDomain>('STATISTICAL');
  const [newCurrent, setNewCurrent] = useState(50);
  const [newTarget, setNewTarget] = useState(75);
  const [newProficiency, setNewProficiency] = useState<ProficiencyLevel>('Intermediate');
  const [newDesc, setNewDesc] = useState('');

  // Filter competencies
  const filteredCompetencies = competencies.filter((c) => {
    const matchesDomain = selectedDomain === 'ALL' || c.domain === selectedDomain;
    const matchesSearch =
      !searchQuery ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDomain && matchesSearch;
  });

  const handleSaveEdit = () => {
    if (!editingComp) return;
    updateCompetency(editingComp.id, {
      currentScore: Number(editingComp.currentScore),
      targetScore: Number(editingComp.targetScore),
      proficiencyLevel: editingComp.proficiencyLevel,
      description: editingComp.description,
    });
    setEditingComp(null);
  };

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    addCompetency({
      name: newName.trim(),
      domain: newDomain,
      currentScore: Number(newCurrent),
      targetScore: Number(newTarget),
      proficiencyLevel: newProficiency,
      description: newDesc.trim() || 'Custom official statistics competency requirement.',
    });
    setNewName('');
    setNewDesc('');
    setShowAddModal(false);
  };

  const domains: { id: string; label: string }[] = [
    { id: 'ALL', label: 'All Domains' },
    { id: 'STATISTICAL', label: 'Statistical' },
    { id: 'TECHNICAL', label: 'Technical' },
    { id: 'DIGITAL_GOVERNANCE', label: 'Digital Governance' },
    { id: 'BEHAVIOURAL_MANAGERIAL', label: 'Behavioural / Managerial' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-blue-600 mb-1">
            <Award className="w-4 h-4" />
            <span>CONFIGURABLE WORKFORCE FRAMEWORK</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Official Statistics Competency Matrix
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Fully configurable multi-domain framework designed for India’s Official Statistics cadres.
            Adjust target benchmarks, assess competencies, and calibrate role expectations.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Competency</span>
          </button>
          <button
            onClick={() => {
              if (confirm('Reset competency framework back to standard official defaults?')) {
                resetCompetencies();
              }
            }}
            className="flex items-center space-x-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
            title="Reset to default benchmark values"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Domain Tabs */}
        <div className="flex flex-wrap items-center gap-1 w-full sm:w-auto">
          {domains.map((d) => (
            <button
              key={d.id}
              onClick={() => setSelectedDomain(d.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedDomain === d.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search competencies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
          />
        </div>
      </div>

      {/* Competencies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCompetencies.map((comp) => {
          const gap = calculateGap(comp.targetScore, comp.currentScore);
          const category = getGapCategory(gap);

          return (
            <div
              key={comp.id}
              id={`competency-card-${comp.id}`}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {comp.domain.replace('_', ' ')}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-0.5">{comp.name}</h3>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => setEditingComp({ ...comp })}
                      className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                      title="Edit competency parameters"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        gap <= 10
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : gap <= 25
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {category}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                  {comp.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-600 font-medium">Proficiency:</span>
                  <span className="font-semibold text-slate-800">{comp.proficiencyLevel}</span>
                </div>

                {/* Score Progress Comparison */}
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-500">Current: {comp.currentScore}%</span>
                  <span className="text-amber-700 font-semibold">Target: {comp.targetScore}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 relative overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      gap <= 10 ? 'bg-emerald-500' : gap <= 25 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${comp.currentScore}%` }}
                  ></div>
                </div>

                <div className="mt-2 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-mono">ID: {comp.id}</span>
                  <span
                    className={`font-semibold ${
                      gap === 0 ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {gap === 0 ? 'Target met' : `Gap: -${gap}%`}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Competency Modal */}
      {editingComp && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                Configure Competency: {editingComp.name}
              </h3>
              <button
                onClick={() => setEditingComp(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Current Score (0-100%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={editingComp.currentScore}
                  onChange={(e) =>
                    setEditingComp({ ...editingComp, currentScore: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Target Score (0-100%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={editingComp.targetScore}
                  onChange={(e) =>
                    setEditingComp({ ...editingComp, targetScore: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Proficiency Level
                </label>
                <select
                  value={editingComp.proficiencyLevel}
                  onChange={(e) =>
                    setEditingComp({
                      ...editingComp,
                      proficiencyLevel: e.target.value as ProficiencyLevel,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Foundational">Foundational</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingComp.description}
                  onChange={(e) =>
                    setEditingComp({ ...editingComp, description: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setEditingComp(null)}
                className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Competency Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <form
            onSubmit={handleCreateNew}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Add New Competency</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Competency Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Econometric Forecasting, PowerBI"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Domain</label>
                <select
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value as CompetencyDomain)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                >
                  <option value="STATISTICAL">Statistical</option>
                  <option value="TECHNICAL">Technical</option>
                  <option value="DIGITAL_GOVERNANCE">Digital Governance</option>
                  <option value="BEHAVIOURAL_MANAGERIAL">Behavioural / Managerial</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Current Score</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newCurrent}
                    onChange={(e) => setNewCurrent(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Score</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newTarget}
                    onChange={(e) => setNewTarget(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Proficiency Level</label>
                <select
                  value={newProficiency}
                  onChange={(e) => setNewProficiency(e.target.value as ProficiencyLevel)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                >
                  <option value="Foundational">Foundational</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Enter competency scope and expected skills..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold"
              >
                Add Competency
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
