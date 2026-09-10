import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Users,
  BarChart3,
  TrendingDown,
  Building2,
  CheckCircle2,
  Search,
  Filter,
  Download,
  ExternalLink,
} from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  const { userProfile, competencies, calculateGap, enrolledCourses } = useApp();
  const [selectedZone, setSelectedZone] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const totalComp = competencies.length || 1;
  const liveOverallScore = Math.round(
    competencies.reduce((acc, c) => acc + c.currentScore, 0) / totalComp
  );
  const liveTargetScore = Math.round(
    competencies.reduce((acc, c) => acc + c.targetScore, 0) / totalComp
  );
  const sortedGaps = [...competencies]
    .map((c) => ({ ...c, gap: calculateGap(c.targetScore, c.currentScore) }))
    .sort((a, b) => b.gap - a.gap);
  const topGap = sortedGaps[0];
  const criticalGapLabel = topGap && topGap.gap > 0 ? `${topGap.name} (-${topGap.gap}%)` : 'Target Met';
  const officerStatus = topGap && topGap.gap > 0 ? 'Active Learning' : 'Target Met';

  // Sample officers roster (unified with live state for logged-in officer)
  const officers = [
    {
      id: 'OFF-101',
      name: userProfile.name,
      designation: userProfile.designation,
      cadre: userProfile.cadre || 'Subordinate Statistical Service (SSS)',
      posting: userProfile.department || 'Field Operations Division (FOD), New Delhi',
      zone: 'North',
      overallScore: liveOverallScore,
      targetScore: liveTargetScore,
      criticalGap: criticalGapLabel,
      status: officerStatus,
      coursesDone: Math.max(enrolledCourses.length, 1),
    },
    {
      id: 'OFF-102',
      name: 'Rajesh Mukherjee',
      designation: 'Senior Statistical Officer',
      cadre: 'Indian Statistical Service (ISS)',
      posting: 'National Accounts Division (NAD), New Delhi',
      zone: 'North',
      overallScore: 78,
      targetScore: 88,
      criticalGap: 'SNA 2008 Double Deflation (-18%)',
      status: 'Target Met',
      coursesDone: 4,
    },
    {
      id: 'OFF-103',
      name: 'Pooja Sundaram',
      designation: 'Junior Statistical Officer',
      cadre: 'Subordinate Statistical Service (SSS)',
      posting: 'Regional Office, Chennai',
      zone: 'South',
      overallScore: 61,
      targetScore: 75,
      criticalGap: 'Data Quality Audits & MAD (-34%)',
      status: 'Active Learning',
      coursesDone: 1,
    },
    {
      id: 'OFF-104',
      name: 'Amitabh Joshi',
      designation: 'Assistant Director',
      cadre: 'Indian Statistical Service (ISS)',
      posting: 'Survey Design and Research Division (SDRD), Kolkata',
      zone: 'East',
      overallScore: 83,
      targetScore: 85,
      criticalGap: 'Automated Microdata APIs (-12%)',
      status: 'Target Met',
      coursesDone: 5,
    },
    {
      id: 'OFF-105',
      name: 'Sunita Gaikwad',
      designation: 'Statistical Officer',
      cadre: 'Subordinate Statistical Service (SSS)',
      posting: 'Data Processing Division (DPD), Nagpur',
      zone: 'Central',
      overallScore: 64,
      targetScore: 80,
      criticalGap: 'GIS & Primary Sampling Units (-29%)',
      status: 'Needs Assessment',
      coursesDone: 2,
    },
    {
      id: 'OFF-106',
      name: 'Vikramaditya Solanki',
      designation: 'Junior Statistical Officer',
      cadre: 'Subordinate Statistical Service (SSS)',
      posting: 'Regional Office, Ahmedabad',
      zone: 'West',
      overallScore: 59,
      targetScore: 75,
      criticalGap: 'Cybersecurity & CAPI Field Encryption (-36%)',
      status: 'Active Learning',
      coursesDone: 1,
    },
  ];

  const filteredOfficers = officers.filter((o) => {
    const matchesZone = selectedZone === 'ALL' || o.zone === selectedZone;
    const matchesSearch =
      !searchQuery ||
      o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.posting.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesZone && matchesSearch;
  });

  // Aggregated skill gaps across NSO officers
  const aggregatedGaps = [
    { skill: 'Python for Statistical Analysis', avgGap: 33, affectedPct: 78, domain: 'TECHNICAL' },
    { skill: 'Data Quality & Anomaly Audits', avgGap: 32, affectedPct: 71, domain: 'STATISTICAL' },
    { skill: 'CAPI Field Tablet Encryption (Cybersecurity)', avgGap: 28, affectedPct: 65, domain: 'DIGITAL_GOVERNANCE' },
    { skill: 'GIS Shapefile Boundary Delineation', avgGap: 26, affectedPct: 59, domain: 'TECHNICAL' },
    { skill: 'SNA 2008 GVA Basic Price Compilation', avgGap: 24, affectedPct: 54, domain: 'STATISTICAL' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-blue-600 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>DIRECTORATE SUPERVISORY INTELLIGENCE</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            National Workforce Competency Intelligence
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Supervisory monitoring for MoSPI & NSO leadership. Aggregate analytics, regional cadre readiness,
            and systemic training interventions across Indian statistical services.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
            PROTOTYPE MODE — DEMO DATA
          </span>
        </div>
      </div>

      {/* National Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Officers Monitored
          </span>
          <div className="mt-2 text-3xl font-black text-slate-900">1,842</div>
          <p className="mt-1 text-xs text-emerald-600 font-medium">92% Active on iGOT Platform</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Average Competency Index
          </span>
          <div className="mt-2 text-3xl font-black text-blue-600">69.4%</div>
          <p className="mt-1 text-xs text-slate-500 font-medium">Target Benchmark: 80.0%</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Priority Deficit Areas
          </span>
          <div className="mt-2 text-3xl font-black text-amber-600">4 Core</div>
          <p className="mt-1 text-xs text-slate-500 font-medium">Python, DQ, CAPI Sec, GIS</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Course Completion Rate
          </span>
          <div className="mt-2 text-3xl font-black text-emerald-600">84.2%</div>
          <p className="mt-1 text-xs text-emerald-600 font-medium">+14.6% after KshamAI rollout</p>
        </div>
      </div>

      {/* Systemic Skill Gaps Across Cadres */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Top Systemic Skill Gaps Across NSO Officers
              </h2>
              <p className="text-xs text-slate-500">
                Prioritized areas requiring national training circulars & NSSTA bootcamps
              </p>
            </div>
            <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
              High Priority
            </span>
          </div>

          <div className="mt-4 space-y-4">
            {aggregatedGaps.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">{item.skill}</span>
                  <span className="font-black text-rose-600">Average Deficit: -{item.avgGap}%</span>
                </div>

                <div className="mt-2 flex items-center space-x-3">
                  <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-amber-500 h-2 rounded-full"
                      style={{ width: `${100 - item.avgGap}%` }}
                    ></div>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {item.affectedPct}% of officers affected
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Zonal Readiness Distribution */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900">Regional Readiness Index</h2>
              <span className="text-xs text-slate-400">Zonal FOD Offices</span>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              {[
                { zone: 'North Zone (HQ / New Delhi)', score: 76, target: 82 },
                { zone: 'East Zone (Kolkata Hub)', score: 73, target: 80 },
                { zone: 'South Zone (Chennai / Bengaluru)', score: 71, target: 80 },
                { zone: 'West Zone (Mumbai / Ahmedabad)', score: 67, target: 78 },
                { zone: 'Central Zone (Nagpur / Raipur)', score: 65, target: 78 },
                { zone: 'North-East Zone (Guwahati)', score: 63, target: 78 },
              ].map((z, idx) => (
                <div key={idx} className="p-2.5 rounded-lg border border-slate-200 bg-white">
                  <div className="flex justify-between font-semibold text-slate-800">
                    <span>{z.zone}</span>
                    <span>
                      {z.score}% / {z.target}%
                    </span>
                  </div>
                  <div className="mt-1.5 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full ${
                        z.score >= 75 ? 'bg-emerald-500' : z.score >= 70 ? 'bg-blue-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${z.score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
            <span>Automated Cadre Gap Alerts</span>
            <span className="text-blue-600 font-semibold cursor-pointer">Dispatch Circular →</span>
          </div>
        </div>
      </div>

      {/* Officers Roster Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Officer Competency Cadre Roster</h2>
            <p className="text-xs text-slate-500">
              Granular view of statistical officers, current benchmarks, and priority deficits
            </p>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            {/* Zone Filter */}
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-slate-50"
            >
              <option value="ALL">All Zones</option>
              <option value="North">North Zone</option>
              <option value="South">South Zone</option>
              <option value="East">East Zone</option>
              <option value="West">West Zone</option>
              <option value="Central">Central Zone</option>
            </select>

            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search officer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-slate-50 focus:bg-white"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Officer & Cadre</th>
                <th className="py-3 px-4">Posting / Division</th>
                <th className="py-3 px-4">Overall Score</th>
                <th className="py-3 px-4">Primary Gap</th>
                <th className="py-3 px-4">iGOT Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOfficers.map((off) => (
                <tr key={off.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900">{off.name}</p>
                    <p className="text-[10px] text-slate-500">
                      {off.designation} • {off.cadre}
                    </p>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    <p>{off.posting}</p>
                    <span className="text-[10px] text-slate-400 font-medium">
                      Zone: {off.zone}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900">{off.overallScore}%</span>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      Target: {off.targetScore}%
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
                      {off.criticalGap}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        off.status === 'Target Met'
                          ? 'bg-emerald-100 text-emerald-800'
                          : off.status === 'Active Learning'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {off.status} ({off.coursesDone} modules)
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
