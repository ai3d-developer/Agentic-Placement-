import React, { useState } from 'react';
import { sampleRecruiterCandidates } from '../../services/mockData';
import { Briefcase, Search, Filter, Mail, Calendar, User, FileText, CheckCircle2, Star, Sparkles, MapPin, Award, Plus, Trash2 } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';

interface RecruiterDashboardProps {
  activeTab?: string;
}

export const RecruiterDashboard: React.FC<RecruiterDashboardProps> = ({ activeTab = 'recruiter_dashboard' }) => {
  const [candidates, setCandidates] = useState(sampleRecruiterCandidates);
  const [selectedSkill, setSelectedSkill] = useState<string>('All');
  const [minCgpa, setMinCgpa] = useState<number>(6.0);
  const [deptFilter, setDeptFilter] = useState<string>('All');
  const [selectedCandidate, setSelectedCandidate] = useState<typeof sampleRecruiterCandidates[0] | null>(null);
  const [showInterviewModal, setShowInterviewModal] = useState<boolean>(false);
  const [interviewDate, setInterviewDate] = useState<string>('2026-08-25');

  // Job postings mock state
  const [jobs, setJobs] = useState([
    { id: 'job-1', role: 'Full Stack Engineer', location: 'Bengaluru', salary: '₹14-16 LPA', vacancies: 5, posted: '2 days ago' },
    { id: 'job-2', role: 'AI Engineering Specialist', location: 'Remote / India', salary: '₹22-26 LPA', vacancies: 2, posted: '1 week ago' }
  ]);
  const [newJob, setNewJob] = useState({ role: '', location: '', salary: '', vacancies: 1 });

  // Interview rounds list
  const [interviews, setInterviews] = useState([
    { id: 'int-1', name: 'Arun Kumar', role: 'Full Stack Engineer', date: '2026-08-22', mode: 'Virtual video call' },
    { id: 'int-2', name: 'Priya Sharma', role: 'AI Engineering Specialist', date: '2026-08-24', mode: 'On-Campus physical round' }
  ]);

  const allSkills = ['All', 'React', 'TypeScript', 'Python', 'Java', 'Data Structures', 'C++', 'SQL', 'MongoDB', 'AWS', 'Spring Boot'];

  const filteredCandidates = candidates.filter(cand => {
    const matchesSkill = selectedSkill === 'All' || cand.skills.includes(selectedSkill);
    const matchesCgpa = cand.cgpa >= minCgpa;
    const matchesDept = deptFilter === 'All' || cand.department.includes(deptFilter);
    return matchesSkill && matchesCgpa && matchesDept;
  });

  const handleScheduleInterview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidate) return;
    setInterviews(prev => [...prev, {
      id: `int-${Date.now()}`,
      name: selectedCandidate.name,
      role: newJob.role || 'Technical Intern',
      date: interviewDate,
      mode: 'Virtual Video Call'
    }]);
    alert(`Interview invitation sent successfully to ${selectedCandidate.name} for ${interviewDate}!`);
    setShowInterviewModal(false);
  };

  const handleAddJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJob.role) return;
    setJobs(prev => [...prev, {
      id: `job-${Date.now()}`,
      role: newJob.role,
      location: newJob.location || 'Hybrid',
      salary: newJob.salary || 'Competitive',
      vacancies: newJob.vacancies,
      posted: 'Just now'
    }]);
    setNewJob({ role: '', location: '', salary: '', vacancies: 1 });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-rose-900 via-slate-900 to-rose-950 text-white border border-rose-500/30 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-rose-400 font-extrabold text-xs uppercase tracking-wider">
            <Briefcase className="w-4 h-4" /> Recruiter & Corporate HR Talent Portal
          </div>
          <h1 className="text-2xl font-black mt-1 text-white tracking-tight">Verified Campus Talent Search</h1>
          <p className="text-xs text-rose-200 mt-1">
            Search placement-ready candidates across departments, filter by verified skills, and schedule interviews.
          </p>
        </div>
        <div className="bg-white/10 p-3.5 rounded-xl border border-white/10 text-right backdrop-blur-md">
          <div className="text-[10px] text-rose-300 font-bold uppercase font-mono">Verified Match List</div>
          <div className="text-lg font-black text-white">{filteredCandidates.length} Candidates</div>
        </div>
      </div>

      {/* RENDER CANDIDATE TALENT SEARCH */}
      {activeTab === 'recruiter_dashboard' && (
        <>
          {/* Advanced Multi-Field Filter Bar */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-200 dark:border-slate-800">
              <Filter className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <span>Advanced Talent Filters</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                  Required Technical Skill
                </label>
                <select
                  value={selectedSkill}
                  onChange={e => setSelectedSkill(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-850 dark:text-slate-200"
                >
                  {allSkills.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                  Minimum CGPA Cutoff: <span className="text-rose-600 dark:text-rose-400 font-extrabold">{minCgpa}</span>
                </label>
                <input
                  type="range"
                  min="5.0"
                  max="9.5"
                  step="0.5"
                  value={minCgpa}
                  onChange={e => setMinCgpa(parseFloat(e.target.value))}
                  className="w-full accent-rose-600 cursor-pointer mt-2"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                  Department
                </label>
                <select
                  value={deptFilter}
                  onChange={e => setDeptFilter(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-850 dark:text-slate-200"
                >
                  <option value="All">All Departments</option>
                  <option value="Computer Science">Computer Science & Engineering</option>
                  <option value="Electronics">Electronics & Communication</option>
                  <option value="Data Science">Data Science & AI</option>
                </select>
              </div>
            </div>
          </div>

          {/* Candidate List Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCandidates.map(cand => (
              <div
                key={cand.id}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-md">
                      {cand.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">{cand.name}</h3>
                      <p className="text-[10px] text-slate-500">{cand.department}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                    {cand.readinessScore}% Match
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-center text-xs">
                  <div>
                    <div className="text-[9px] text-slate-400 font-bold">CGPA</div>
                    <div className="font-extrabold text-slate-900 dark:text-white">{cand.cgpa}</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-slate-400 font-bold">ATS Score</div>
                    <div className="font-extrabold text-indigo-400">{cand.atsScore}/100</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-slate-400 font-bold">Coding Level</div>
                    <div className="font-extrabold text-rose-450">{cand.codingLevel}</div>
                  </div>
                </div>

                <div>
                  <div className="flex flex-wrap gap-1">
                    {cand.skills.slice(0, 4).map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 text-[10px] font-bold border border-rose-250/20">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => {
                      setSelectedCandidate(cand);
                      setShowInterviewModal(true);
                    }}
                    className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-[11px] shadow-sm flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Schedule Interview</span>
                  </button>
                  <a
                    href={`mailto:${cand.email}`}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-250 text-slate-700 dark:text-slate-350 cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* RENDER JOB POSTINGS */}
      {activeTab === 'job_postings' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <GlassCard className="p-6 lg:col-span-1 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <Plus className="w-4 h-4 text-rose-500" /> Create Campus Job Posting
            </h3>
            <form onSubmit={handleAddJob} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-400 mb-1">Target Role Title</label>
                <input required type="text" value={newJob.role} onChange={e => setNewJob({ ...newJob, role: e.target.value })} placeholder="e.g. Software Development Engineer" className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-white outline-none focus:border-rose-550" />
              </div>
              <div>
                <label className="block font-bold text-slate-400 mb-1">Job Location</label>
                <input type="text" value={newJob.location} onChange={e => setNewJob({ ...newJob, location: e.target.value })} placeholder="e.g. Bengaluru / Hybrid" className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-white outline-none focus:border-rose-550" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-400 mb-1">CTC Compensation</label>
                  <input type="text" value={newJob.salary} onChange={e => setNewJob({ ...newJob, salary: e.target.value })} placeholder="e.g. ₹15-18 LPA" className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-white outline-none focus:border-rose-550" />
                </div>
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Total Vacancies</label>
                  <input type="number" min="1" value={newJob.vacancies} onChange={e => setNewJob({ ...newJob, vacancies: parseInt(e.target.value) })} className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-white outline-none focus:border-rose-550" />
                </div>
              </div>
              <button type="submit" className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold cursor-pointer transition-all shadow-md">
                Publish Drive Job 🚀
              </button>
            </form>
          </GlassCard>

          <GlassCard className="p-6 lg:col-span-2 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <Briefcase className="w-4 h-4 text-rose-500" /> Currently Open Job Drives
            </h3>
            <div className="space-y-3">
              {jobs.map(j => (
                <div key={j.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-950 dark:text-slate-100">{j.role}</h4>
                    <p className="text-[10px] text-slate-500 mt-1">📍 {j.location} • Compensation: {j.salary} • {j.vacancies} vacancies</p>
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold">{j.posted}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      )}

      {/* RENDER CANDIDATE MATCHMAKING MATRIX */}
      {activeTab === 'candidate_matching' && (
        <GlassCard className="p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <Sparkles className="w-5 h-5 text-rose-500" /> AI Candidate Matchmaking Matrix
          </h3>
          <div className="space-y-3">
            {candidates.slice(0, 4).map(c => (
              <div key={c.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs flex justify-between items-center">
                <div>
                  <div className="font-bold text-slate-950 dark:text-slate-100">{c.name} ({c.department})</div>
                  <div className="text-[10px] text-slate-500 mt-1">Extracted technical skills matching Full Stack requirements. CGPA: {c.cgpa}</div>
                </div>
                <span className="px-2.5 py-1 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-mono font-bold">{c.readinessScore}% Match</span>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* RENDER INTERVIEW SCHEDULER */}
      {activeTab === 'interview_scheduler' && (
        <GlassCard className="p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <Calendar className="w-5 h-5 text-rose-600" /> Scheduled Technical Recruiter Rounds
          </h3>
          <div className="space-y-3.5">
            {interviews.map(int => (
              <div key={int.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs animate-slideIn">
                <div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white">{int.name}</div>
                  <div className="text-[10px] text-slate-500 mt-1">Role: <span className="font-bold text-rose-500">{int.role}</span> • Mode: {int.mode}</div>
                </div>
                <div className="text-right text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300">
                  {int.date}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Schedule Interview Modal Popup */}
      {showInterviewModal && selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-rose-600" />
              Schedule Interview with {selectedCandidate.name}
            </h3>
            <form onSubmit={handleScheduleInterview} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-400 mb-1">Interview Date</label>
                <input type="date" value={interviewDate} onChange={e => setInterviewDate(e.target.value)} className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-white outline-none focus:border-rose-550" required />
              </div>
              <div className="flex justify-end space-x-2.5 pt-2">
                <button type="button" onClick={() => setShowInterviewModal(false)} className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 font-bold transition">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition">Send Invite</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
