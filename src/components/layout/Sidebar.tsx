import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { sampleJobs } from '../../services/mockData';
import {
  LayoutDashboard,
  User,
  FileText,
  Target,
  Briefcase,
  BotMessageSquare,
  BookOpen,
  Award,
  Mic,
  TrendingUp,
  Building2,
  ShieldCheck,
  UserCheck,
  Users,
  Search,
  CalendarCheck,
  Cpu,
  Bot
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { role, profile } = useAuth();

  const studentSkillsLower = (profile?.technicalSkills || []).map(s => s.toLowerCase().trim());
  const activeJobsCount = role === 'student' && studentSkillsLower.length > 0
    ? sampleJobs.filter(job => {
        return job.skillsRequired.some(sk => {
          const j = sk.toLowerCase().trim();
          return studentSkillsLower.some(ps => {
            const s = ps.toLowerCase().trim();
            if (s === j) return true;
            if (s.length <= 3 || j.length <= 3) return false;
            if ((s === 'java' && j.includes('javascript')) || (j === 'java' && s.includes('javascript'))) return false;
            return s.includes(j) || j.includes(s);
          });
        });
      }).length
    : sampleJobs.length;

  const studentNavItems = [
    { id: 'dashboard', label: 'Student Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'jobs', label: 'Verified Jobs & Drives', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'resume', label: 'Resume AI & ATS Checker', icon: <FileText className="w-4 h-4" /> },
    { id: 'skills', label: 'Career Roadmap & Skill Gap', icon: <Target className="w-4 h-4" /> },
    { id: 'coach', label: 'AI Placement Coach', icon: <BotMessageSquare className="w-4 h-4" /> },
    { id: 'tests', label: 'Skill Gap Tests', icon: <Award className="w-4 h-4" /> },
    { id: 'interview', label: 'AI Voice/Text Interview', icon: <Mic className="w-4 h-4" /> },
    { id: 'readiness', label: 'Placement Readiness', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'profile', label: 'Student Profile', icon: <User className="w-4 h-4" /> }
  ];

  const placementOfficerNavItems = [
    { id: 'placement_officer', label: 'Placement Analytics', icon: <Building2 className="w-4 h-4" /> },
    { id: 'students_list', label: 'Student Directory & Filters', icon: <Users className="w-4 h-4" /> },
    { id: 'manage_drives', label: 'Manage Campus Drives', icon: <CalendarCheck className="w-4 h-4" /> },
    { id: 'company_coordination', label: 'Corporate Tie-ups', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'placement_approvals', label: 'Verification Approvals', icon: <Award className="w-4 h-4" /> }
  ];

  const hodNavItems = [
    { id: 'hod_dashboard', label: 'HOD Overview', icon: <UserCheck className="w-4 h-4" /> },
    { id: 'hod_leaves', label: 'Interview Leave Approvals', icon: <CalendarCheck className="w-4 h-4" /> },
    { id: 'dept_skills', label: 'Department Skill Analytics', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'academic_clearance', label: 'Student Academic Clearance', icon: <Award className="w-4 h-4" /> }
  ];

  const facultyNavItems = [
    { id: 'faculty_dashboard', label: 'Mentorship & Skill Verification', icon: <Users className="w-4 h-4" /> },
    { id: 'my_mentees', label: 'Assigned Mentee Progress', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'mock_evaluations', label: 'Faculty Mock Interview Review', icon: <Mic className="w-4 h-4" /> }
  ];

  const recruiterNavItems = [
    { id: 'recruiter_dashboard', label: 'Candidate Search & Hiring', icon: <Search className="w-4 h-4" /> },
    { id: 'job_postings', label: 'Post & Manage Jobs', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'candidate_matching', label: 'AI Matchmaking Dashboard', icon: <Target className="w-4 h-4" /> },
    { id: 'interview_scheduler', label: 'Schedule Recruiter Rounds', icon: <CalendarCheck className="w-4 h-4" /> }
  ];

  const superAdminNavItems = [
    { id: 'super_admin', label: 'Platform Management', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'user_management', label: 'Roles & Permissions', icon: <Users className="w-4 h-4" /> },
    { id: 'system_settings', label: 'System Config & Logs', icon: <Cpu className="w-4 h-4" /> }
  ];

  const getNavItems = () => {
    switch (role) {
      case 'student':
        return studentNavItems;
      case 'placement_officer':
        return placementOfficerNavItems;
      case 'hod':
        return hodNavItems;
      case 'faculty':
        return facultyNavItems;
      case 'recruiter':
        return recruiterNavItems;
      case 'super_admin':
        return superAdminNavItems;
      default:
        return studentNavItems;
    }
  };

  const currentItems = getNavItems();

  return (
    <aside className="w-64 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800/80 h-full p-4 flex flex-col justify-between hidden md:flex shrink-0 overflow-y-auto select-none">
      <div className="space-y-6">
        <div>
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3 mb-2">
            PlacementOS Navigation ({role.replace('_', ' ').toUpperCase()})
          </div>
          <nav className="space-y-1">
            {currentItems.map(item => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    active
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                      : 'text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-slate-100 hover:bg-indigo-50 dark:hover:bg-slate-900/80'
                  }`}
                >
                  <span className={active ? 'text-white' : 'text-indigo-600 dark:text-indigo-400'}>{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Live AI Status Card */}
      <div className="p-3.5 rounded-xl bg-gradient-to-br from-indigo-50 to-slate-100 dark:from-indigo-950/60 dark:to-slate-900 border border-indigo-200 dark:border-indigo-500/20 text-center shadow-sm">
        <div className="flex items-center justify-center space-x-1.5 text-xs font-extrabold text-indigo-700 dark:text-indigo-300">
          <Bot className="w-4 h-4 text-indigo-500 animate-spin" />
          <span>Placement AI Monitoring</span>
        </div>
        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Legitimate Careers & Feeds Ingestion</p>
        <div className="mt-2 text-[10px] font-mono text-emerald-700 dark:text-cyan-400 bg-emerald-100 dark:bg-cyan-950/60 px-2 py-1 rounded border border-emerald-300 dark:border-cyan-500/30 font-bold">
          Verified Active Jobs: {activeJobsCount} ⚡
        </div>
      </div>
    </aside>
  );
};
