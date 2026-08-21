import React, { useState } from 'react';
import { sampleRecruiterCandidates } from '../../services/mockData';
import { User, CheckCircle2, ShieldAlert, Award, BookOpen, Search, Flame, TrendingUp, Mic, MessageSquare } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';

interface FacultyDashboardProps {
  activeTab?: string;
}

export const FacultyDashboard: React.FC<FacultyDashboardProps> = ({ activeTab = 'faculty_dashboard' }) => {
  const [candidates, setCandidates] = useState(sampleRecruiterCandidates);
  const [searchTerm, setSearchTerm] = useState('');
  const [menteesFeedback, setMenteesFeedback] = useState<Record<string, string>>({});

  const filtered = candidates.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleVerify = (id: string) => {
    alert(`Verified all projects, skills, and certifications for ${candidates.find(c => c.id === id)?.name}!`);
  };

  const handleSaveFeedback = (id: string) => {
    alert(`Saved feedback for mentee: "${menteesFeedback[id] || 'Keep up the good work!'}"`);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-900 via-slate-900 to-indigo-950 text-white border border-purple-500/30 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-purple-300 font-extrabold text-xs uppercase tracking-wider">
            <User className="w-4 h-4" /> Faculty Mentor Portal
          </div>
          <h1 className="text-2xl font-black tracking-tight mt-1 text-white">Student Cohort Mentorship Panel</h1>
          <p className="text-xs text-purple-200 mt-1">
            Audit projects, verify skills, check daily learning milestones, and record mentorship reviews.
          </p>
        </div>
      </div>

      {/* RENDER MENTORSHIP & VERIFICATION */}
      {activeTab === 'faculty_dashboard' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              Assigned Student Mentees (2026 Batch)
            </h2>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search student or skill..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">CGPA & Backlogs</th>
                  <th className="py-3 px-4">Claimed Skills</th>
                  <th className="py-3 px-4">Readiness Score</th>
                  <th className="py-3 px-4 text-right">Faculty Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                {filtered.map(cand => (
                  <tr key={cand.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">
                      <div>{cand.name}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{cand.department}</div>
                    </td>
                    <td className="py-4 px-4 font-semibold text-slate-700 dark:text-slate-300">CGPA: {cand.cgpa} • {cand.backlogs} Backlogs</td>
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {cand.skills.slice(0, 3).map((s, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-[10px] font-bold border border-purple-200 dark:border-purple-800">
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-4 font-bold text-purple-600 dark:text-purple-400">{cand.readinessScore}% Match</td>
                    <td className="py-4 px-4 text-right">
                      <button onClick={() => handleVerify(cand.id)} className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center space-x-1 ml-auto shadow-sm transition-all cursor-pointer">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verify Profile</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* RENDER MY MENTEES PROGRESS */}
      {activeTab === 'my_mentees' && (
        <GlassCard className="p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <TrendingUp className="w-5 h-5 text-purple-500" /> Active Mentee Progress & Milestones
          </h3>
          <div className="space-y-4">
            {filtered.map(cand => (
              <div key={cand.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <div className="space-y-0.5">
                  <div className="font-bold text-sm text-slate-950 dark:text-slate-100">{cand.name}</div>
                  <div className="text-[10px] text-slate-500">Placement Target: Software Roles</div>
                </div>
                <div className="flex items-center space-x-1.5 text-amber-500 font-bold">
                  <Flame className="w-4 h-4 fill-current" />
                  <span>14 Day Streak (450 XP)</span>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1 font-bold">Mentorship Notes</label>
                  <input
                    type="text"
                    value={menteesFeedback[cand.id] || ''}
                    onChange={e => setMenteesFeedback({ ...menteesFeedback, [cand.id]: e.target.value })}
                    placeholder="Enter review notes..."
                    className="w-full px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-white outline-none focus:border-purple-500"
                  />
                </div>
                <div className="text-right">
                  <button onClick={() => handleSaveFeedback(cand.id)} className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white text-[11px] font-bold transition-all cursor-pointer">
                    Save Notes
                  </button>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* RENDER MOCK EVALUATIONS REVIEW */}
      {activeTab === 'mock_evaluations' && (
        <GlassCard className="p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <Mic className="w-5 h-5 text-indigo-500" /> Mentee Mock Interview Reports
          </h3>
          <div className="space-y-3">
            {filtered.map(cand => (
              <div key={cand.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
                <div>
                  <div className="font-bold text-slate-950 dark:text-slate-100">{cand.name}</div>
                  <div className="text-[10px] text-slate-500 mt-1">Comm Score: 85% • Confidence: 90% • Grammar Match: 92%</div>
                </div>
                <button onClick={() => alert(`Reviewing audio transcript for ${cand.name}...`)} className="px-3 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 font-bold transition cursor-pointer">
                  Listen & Review
                </button>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
};
