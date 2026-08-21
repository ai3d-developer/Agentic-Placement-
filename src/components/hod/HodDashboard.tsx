import React, { useState } from 'react';
import { sampleLeaveRequests } from '../../services/mockData';
import { LeaveRequest } from '../../types';
import { CheckCircle2, XCircle, Clock, Calendar, User, Building, ShieldCheck, Check, AlertCircle, TrendingUp, Award, BookOpen } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';

interface HodDashboardProps {
  activeTab?: string;
}

export const HodDashboard: React.FC<HodDashboardProps> = ({ activeTab = 'hod_dashboard' }) => {
  const [leaves, setLeaves] = useState<LeaveRequest[]>(sampleLeaveRequests);
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');

  const handleApprove = (id: string) => {
    setLeaves(prev =>
      prev.map(l =>
        l.id === id ? { ...l, status: 'Approved', comments: 'Approved by HOD' } : l
      )
    );
  };

  const handleReject = (id: string) => {
    setLeaves(prev =>
      prev.map(l =>
        l.id === id ? { ...l, status: 'Rejected', comments: 'Rejected by HOD due to exam conflict' } : l
      )
    );
  };

  const filteredLeaves = leaves.filter(l => filter === 'All' || l.status === filter);

  // Department skills data
  const deptSkills = [
    { name: 'Python Programming', certifiedCount: 94, averageScore: 84 },
    { name: 'Data Structures & Algos', certifiedCount: 82, averageScore: 78 },
    { name: 'Database Management (SQL)', certifiedCount: 76, averageScore: 81 },
    { name: 'React Frontend Web', certifiedCount: 52, averageScore: 75 }
  ];

  // Academic clearance candidates
  const clearanceList = [
    { name: 'Arun Kumar', cgpa: 8.85, backlogs: 0, status: 'Cleared' },
    { name: 'Priya Sharma', cgpa: 9.12, backlogs: 0, status: 'Cleared' },
    { name: 'Rahul Verma', cgpa: 8.40, backlogs: 0, status: 'Cleared' },
    { name: 'Sneha Patel', cgpa: 7.95, backlogs: 1, status: 'Requires Review' },
    { name: 'Vikram Singh', cgpa: 8.60, backlogs: 0, status: 'Cleared' }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-950 text-white border border-emerald-500/30 shadow-xl">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 font-extrabold text-xs uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" /> Head of Department (HOD) Portal
          </div>
          <h1 className="text-2xl font-black tracking-tight mt-1 text-white">CSE Placement Monitoring Center</h1>
          <p className="text-xs text-emerald-200 mt-1">
            Approve interview leave requests, audit academic eligibility, and track departmental skill development.
          </p>
        </div>
        <div className="flex items-center space-x-3 bg-white/10 p-3 rounded-xl backdrop-blur-md border border-white/10">
          <div>
            <div className="text-[10px] text-emerald-300 font-bold uppercase">Pending Approvals</div>
            <div className="text-sm font-black text-white">
              {leaves.filter(l => l.status === 'Pending').length} Request(s)
            </div>
          </div>
        </div>
      </div>

      {/* RENDER HOD OVERVIEW */}
      {activeTab === 'hod_dashboard' && (
        <>
          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400">Department Readiness</div>
              <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">86.4%</div>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1">+4.2% from last month</p>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400">Total Department Students</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">142</div>
              <p className="text-[10px] text-slate-500 mt-1">2026 Graduating Batch</p>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400">Placed Students</div>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">48 / 142</div>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1">33.8% Placement Rate</p>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400">Average CTC Offered</div>
              <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">₹14.2 LPA</div>
              <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1">Top Offer: ₹28 LPA</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassCard className="p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Pending Interview Leaves
              </h3>
              <div className="space-y-3">
                {leaves.filter(l => l.status === 'Pending').map(l => (
                  <div key={l.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
                    <div>
                      <div className="font-bold text-slate-950 dark:text-slate-100">{l.studentName}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{l.companyName} — {l.interviewRole} ({l.leaveDate})</div>
                    </div>
                    <button onClick={() => handleApprove(l.id)} className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] transition-all cursor-pointer">
                      Quick Approve
                    </button>
                  </div>
                ))}
                {leaves.filter(l => l.status === 'Pending').length === 0 && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic">No leaves pending review.</p>
                )}
              </div>
            </GlassCard>

            <GlassCard className="p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                <TrendingUp className="w-4 h-4 text-cyan-500" /> Department Skill Matrix
              </h3>
              <div className="space-y-3">
                {deptSkills.slice(0, 3).map((sk, idx) => (
                  <div key={idx} className="space-y-1 text-xs">
                    <div className="flex justify-between font-bold">
                      <span className="text-slate-800 dark:text-slate-200">{sk.name}</span>
                      <span className="text-indigo-600 dark:text-cyan-400">{sk.certifiedCount} Certified</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full animate-pulse" style={{ width: `${(sk.certifiedCount/142)*100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </>
      )}

      {/* RENDER LEAVE REQUEST ENGINE */}
      {activeTab === 'hod_leaves' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                Interview Leave Requests
              </h2>
              <p className="text-[11px] text-slate-500">Verify student attendance leave applications for recruiter drives.</p>
            </div>
            <div className="flex items-center space-x-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
              {(['All', 'Pending', 'Approved', 'Rejected'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    filter === tab
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Company & Role</th>
                  <th className="py-3 px-4">Leave Date</th>
                  <th className="py-3 px-4">Reason</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">HOD Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                {filteredLeaves.map(leave => (
                  <tr key={leave.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">{leave.studentName}</td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-800 dark:text-slate-200">{leave.companyName}</div>
                      <div className="text-[10px] text-cyan-600 dark:text-cyan-400 font-semibold">{leave.interviewRole}</div>
                    </td>
                    <td className="py-4 px-4 font-mono font-medium text-slate-600 dark:text-slate-300">{leave.leaveDate}</td>
                    <td className="py-4 px-4 text-slate-600 dark:text-slate-300">{leave.reason}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${
                        leave.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : leave.status === 'Rejected' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        {leave.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      {leave.status === 'Pending' ? (
                        <div className="flex items-center justify-end space-x-1.5">
                          <button onClick={() => handleApprove(leave.id)} className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px]">
                            Approve
                          </button>
                          <button onClick={() => handleReject(leave.id)} className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold text-[10px]">
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-500 font-semibold uppercase">Decision Saved</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* RENDER DEPARTMENT SKILL ANALYTICS */}
      {activeTab === 'dept_skills' && (
        <GlassCard className="p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <Award className="w-5 h-5 text-indigo-500" /> Department-wide Skill Proficiencies (2026 Batch)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {deptSkills.map((sk, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-900 dark:text-white">{sk.name}</span>
                  <span className="text-indigo-600 dark:text-cyan-400">Avg Skill: {sk.averageScore}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${sk.averageScore}%` }} />
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
                  <span>{sk.certifiedCount} Students Certified</span>
                  <span>{Math.round((sk.certifiedCount/142)*100)}% Department Coverage</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* RENDER ACADEMIC CLEARANCE */}
      {activeTab === 'academic_clearance' && (
        <GlassCard className="p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <ShieldCheck className="w-5 h-5 text-emerald-500" /> Student Placement Academic Clearance Checklist
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Department CGPA</th>
                  <th className="py-3 px-4">Active Backlogs</th>
                  <th className="py-3 px-4 text-right">Clearance Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80">
                {clearanceList.map((c, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                    <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">{c.name}</td>
                    <td className="py-4 px-4 font-mono">{c.cgpa}</td>
                    <td className="py-4 px-4">{c.backlogs} Backlogs</td>
                    <td className="py-4 px-4 text-right">
                      <span className={`px-2.5 py-0.5 rounded font-extrabold uppercase text-[9px] border ${
                        c.status === 'Cleared' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}
    </div>
  );
};
