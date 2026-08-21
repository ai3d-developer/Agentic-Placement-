import React, { useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Building2, Users, Award, TrendingUp, Download, Plus, Search, CheckCircle2, Calendar, FileText, Briefcase, UserCheck, Trash2 } from 'lucide-react';

interface CollegeAdminDashboardProps {
  activeTab?: string;
}

export const CollegeAdminDashboard: React.FC<CollegeAdminDashboardProps> = ({ activeTab = 'placement_officer' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [minReadiness, setMinReadiness] = useState<number>(60);

  // Mocks for Campus Drives
  const [drives, setDrives] = useState([
    { id: 'drv-1', company: 'Google', role: 'Software Engineer Intern', package: '₹22 LPA', date: '2026-09-12', eligibility: 'CGPA > 8.5, No backlogs', status: 'Approved' },
    { id: 'drv-2', company: 'TATA Motors', role: 'Graduate Engineer Trainee', package: '₹8.5 LPA', date: '2026-09-18', eligibility: 'CGPA > 7.0', status: 'Scheduled' },
    { id: 'drv-3', company: 'Zoho Corporation', role: 'QA Automation Engineer', package: '₹9.0 LPA', date: '2026-09-24', eligibility: 'Open to all depts', status: 'Scheduled' }
  ]);
  const [newDrive, setNewDrive] = useState({ company: '', role: '', package: '', date: '', eligibility: '' });

  // Mocks for Corporate Coordination
  const [partners, setPartners] = useState([
    { id: 'prt-1', name: 'Infosys Tech', contact: 'hr@infosys.com', drivesConducted: 14, status: 'Active MoU' },
    { id: 'prt-2', name: 'NVIDIA India', contact: 'recruitment@nvidia.com', drivesConducted: 3, status: 'Premium Partner' },
    { id: 'prt-3', name: 'Bosch Engineering', contact: 'careers@bosch.com', drivesConducted: 8, status: 'Active MoU' }
  ]);

  // Mocks for Student Approvals
  const [approvals, setApprovals] = useState([
    { id: 'app-1', studentName: 'Rahul Verma', dept: 'ECE', type: 'Skill Badge (Embedded Systems)', details: 'Score: 92%', status: 'Pending' },
    { id: 'app-2', studentName: 'Sneha Patel', dept: 'CSE', type: 'Resume Verification', details: 'Extracted Skills: 12', status: 'Pending' },
    { id: 'app-3', studentName: 'Arun Kumar', dept: 'CSE', type: 'Interview Leave Approval', details: 'TI Interview on 2026-08-25', status: 'Pending' }
  ]);

  const studentsList = [
    { id: '1', name: 'Arun Kumar', dept: 'CSE', cgpa: 8.85, backlogs: 0, readiness: 88, status: 'Ready' },
    { id: '2', name: 'Priya Sharma', dept: 'IT', cgpa: 9.12, backlogs: 0, readiness: 94, status: 'Placed (Google)' },
    { id: '3', name: 'Rahul Verma', dept: 'ECE', cgpa: 8.40, backlogs: 0, readiness: 82, status: 'Ready' },
    { id: '4', name: 'Sneha Patel', dept: 'CSE', cgpa: 7.95, backlogs: 1, readiness: 71, status: 'In Training' },
    { id: '5', name: 'Vikram Singh', dept: 'MECH', cgpa: 8.60, backlogs: 0, readiness: 85, status: 'Ready' }
  ];

  const filtered = studentsList.filter(s => {
    const matchName = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDept = selectedDept === 'All' || s.dept === selectedDept;
    const matchScore = s.readiness >= minReadiness;
    return matchName && matchDept && matchScore;
  });

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Name,Department,CGPA,Backlogs,Readiness Score,Status\n" +
      filtered.map(e => `${e.name},${e.dept},${e.cgpa},${e.backlogs},${e.readiness},${e.status}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "placement_ready_candidates.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddDrive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDrive.company || !newDrive.role) return;
    setDrives(prev => [...prev, {
      id: `drv-${Date.now()}`,
      ...newDrive,
      status: 'Scheduled'
    }]);
    setNewDrive({ company: '', role: '', package: '', date: '', eligibility: '' });
  };

  const handleApproveStudent = (id: string, action: 'Approved' | 'Rejected') => {
    setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: action } : a));
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-900 via-slate-900 to-indigo-950 text-white border border-cyan-500/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 font-extrabold text-xs uppercase tracking-wider">
            <Building2 className="w-4 h-4 animate-pulse" /> Placement Officer Dashboard
          </div>
          <h1 className="text-2xl font-black mt-1 text-white tracking-tight">Institutional Placement Portal</h1>
          <p className="text-xs text-slate-300 mt-1">
            Monitor cohorts, schedule campus drives, establish recruiter links, and manage credentials.
          </p>
        </div>
        <button
          onClick={exportCSV}
          className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 flex items-center gap-2 transition-all cursor-pointer self-start md:self-auto"
        >
          <Download className="w-4 h-4" /> Export Candidate List
        </button>
      </div>

      {/* RENDER ANALYTICS (Placement Officer Home) */}
      {activeTab === 'placement_officer' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <GlassCard glow className="p-5 text-center">
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white">450</div>
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">Total Eligible Students</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">2026 Batch</div>
            </GlassCard>
            <GlassCard className="p-5 text-center">
              <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">320</div>
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">Placed Candidates</div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">71.1% Placement Rate</div>
            </GlassCard>
            <GlassCard className="p-5 text-center">
              <div className="text-3xl font-extrabold text-cyan-600 dark:text-cyan-400">₹12.4 LPA</div>
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">Average Salary Package</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">+18% YoY Growth</div>
            </GlassCard>
            <GlassCard className="p-5 text-center">
              <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">₹44 LPA</div>
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">Highest Package (Google)</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Off-Campus Drive</div>
            </GlassCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassCard className="p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                <Calendar className="w-4 h-4 text-cyan-500" /> Upcoming Campus Drives
              </h3>
              <div className="space-y-2.5">
                {drives.map(d => (
                  <div key={d.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
                    <div>
                      <div className="font-bold text-slate-950 dark:text-slate-100">{d.company} — <span className="text-cyan-600 dark:text-cyan-400">{d.role}</span></div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Package: {d.package} • Date: {d.date}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-cyan-100 dark:bg-cyan-500/20 text-cyan-800 dark:text-cyan-400 font-extrabold text-[9px] border border-cyan-200 dark:border-transparent uppercase">
                      {d.status}
                    </span>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                <UserCheck className="w-4 h-4 text-emerald-500" /> Pending Approvals Queue
              </h3>
              <div className="space-y-2.5">
                {approvals.filter(a => a.status === 'Pending').map(a => (
                  <div key={a.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
                    <div>
                      <div className="font-bold text-slate-950 dark:text-slate-100">{a.studentName} ({a.dept})</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{a.type} • {a.details}</div>
                    </div>
                    <div className="flex gap-1.5">
                      <button onClick={() => handleApproveStudent(a.id, 'Approved')} className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] transition-all cursor-pointer">
                        Approve
                      </button>
                    </div>
                  </div>
                ))}
                {approvals.filter(a => a.status === 'Pending').length === 0 && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic">No approvals pending in queue.</p>
                )}
              </div>
            </GlassCard>
          </div>
        </>
      )}

      {/* RENDER CANDIDATE DIRECTORY */}
      {activeTab === 'students_list' && (
        <GlassCard className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Candidate Directory & Filtering
            </h3>

            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search name..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:border-cyan-600"
              />
              <select
                value={selectedDept}
                onChange={e => setSelectedDept(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:border-cyan-600 font-bold"
              >
                <option value="All">All Depts</option>
                <option value="CSE">CSE</option>
                <option value="IT">IT</option>
                <option value="ECE">ECE</option>
                <option value="MECH">MECH</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 uppercase font-bold text-[10px]">
                <tr>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Dept</th>
                  <th className="p-3">CGPA</th>
                  <th className="p-3">Backlogs</th>
                  <th className="p-3">Readiness Index</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80">
                {filtered.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                    <td className="p-3 font-bold text-slate-900 dark:text-white">{s.name}</td>
                    <td className="p-3 text-slate-700 dark:text-slate-300">{s.dept}</td>
                    <td className="p-3 text-slate-700 dark:text-slate-300 font-mono">{s.cgpa}</td>
                    <td className="p-3 text-slate-700 dark:text-slate-300">{s.backlogs}</td>
                    <td className="p-3 font-bold text-cyan-600 dark:text-cyan-400">{s.readiness}%</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* RENDER CAMPUS DRIVES MANAGER */}
      {activeTab === 'manage_drives' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <GlassCard className="p-6 lg:col-span-1 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <Plus className="w-4 h-4 text-cyan-500" /> Schedule New Campus Drive
            </h3>
            <form onSubmit={handleAddDrive} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-400 mb-1">Company Name</label>
                <input required type="text" value={newDrive.company} onChange={e => setNewDrive({ ...newDrive, company: e.target.value })} placeholder="e.g. Amazon India" className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-white outline-none focus:border-cyan-500" />
              </div>
              <div>
                <label className="block font-bold text-slate-400 mb-1">Target Hiring Role</label>
                <input required type="text" value={newDrive.role} onChange={e => setNewDrive({ ...newDrive, role: e.target.value })} placeholder="e.g. Systems Engineer" className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-white outline-none focus:border-cyan-500" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Package CTC</label>
                  <input type="text" value={newDrive.package} onChange={e => setNewDrive({ ...newDrive, package: e.target.value })} placeholder="e.g. ₹12 LPA" className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-white outline-none focus:border-cyan-500" />
                </div>
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Scheduled Date</label>
                  <input type="date" value={newDrive.date} onChange={e => setNewDrive({ ...newDrive, date: e.target.value })} className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-white outline-none focus:border-cyan-500" />
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-400 mb-1">Eligibility Criteria</label>
                <input type="text" value={newDrive.eligibility} onChange={e => setNewDrive({ ...newDrive, eligibility: e.target.value })} placeholder="e.g. CGPA > 8.0, 0 Backlogs" className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-white outline-none focus:border-cyan-500" />
              </div>
              <button type="submit" className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold cursor-pointer transition-all shadow-md">
                Publish Campus Drive 🚀
              </button>
            </form>
          </GlassCard>

          <GlassCard className="p-6 lg:col-span-2 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <Briefcase className="w-4 h-4 text-cyan-500" /> Current Campus Drives Calendar
            </h3>
            <div className="space-y-3">
              {drives.map(d => (
                <div key={d.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex justify-between items-start text-xs">
                  <div className="space-y-1">
                    <div className="font-extrabold text-sm text-slate-900 dark:text-white">{d.company}</div>
                    <div className="font-bold text-cyan-600 dark:text-cyan-400">{d.role}</div>
                    <div className="text-[11px] text-slate-500">Eligibility: {d.eligibility || 'Open to all'}</div>
                  </div>
                  <div className="text-right space-y-2">
                    <div className="text-xs font-mono font-bold text-slate-900 dark:text-white">{d.package}</div>
                    <div className="text-[10px] text-slate-500">Drive Date: {d.date}</div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-bold uppercase text-[9px]">
                      {d.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      )}

      {/* RENDER CORPORATE COORDINATION */}
      {activeTab === 'company_coordination' && (
        <GlassCard className="p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <Building2 className="w-4 h-4 text-cyan-500" /> Corporate Recruiting Ties & MoUs
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {partners.map(p => (
              <div key={p.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{p.name}</h4>
                  <p className="text-[11px] text-slate-400 font-mono">Contact: {p.contact}</p>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px]">
                  <span className="font-semibold text-slate-500">{p.drivesConducted} Drives Conducted</span>
                  <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-bold">{p.status}</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* RENDER STUDENT VERIFICATION APPROVALS */}
      {activeTab === 'placement_approvals' && (
        <GlassCard className="p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Campus Approvals and Verification Logs
          </h3>
          <div className="space-y-3">
            {approvals.map(a => (
              <div key={a.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">{a.studentName} ({a.dept})</div>
                  <div className="text-[11px] text-slate-500 mt-1">Verification type: <span className="font-semibold text-cyan-400">{a.type}</span> • Details: {a.details}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {a.status === 'Pending' ? (
                    <>
                      <button onClick={() => handleApproveStudent(a.id, 'Approved')} className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer">
                        Approve
                      </button>
                      <button onClick={() => handleApproveStudent(a.id, 'Rejected')} className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs cursor-pointer">
                        Reject
                      </button>
                    </>
                  ) : (
                    <span className={`px-2.5 py-1 rounded font-bold uppercase text-[9px] ${
                      a.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                    }`}>
                      {a.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
};
