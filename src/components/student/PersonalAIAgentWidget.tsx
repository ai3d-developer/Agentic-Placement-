import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { sampleAIAgentStatus } from '../../services/mockData';
import { Sparkles, Target, Briefcase, Award, Building, Clock, CheckCircle2 } from 'lucide-react';

interface PersonalAIAgentWidgetProps {
  onNavigateToJobs?: () => void;
  onNavigateToResume?: () => void;
}

export const PersonalAIAgentWidget: React.FC<PersonalAIAgentWidgetProps> = ({
  onNavigateToJobs
}) => {
  const { profile } = useAuth();
  const agent = sampleAIAgentStatus;

  const [lastSyncTime, setLastSyncTime] = useState<string>('');

  useEffect(() => {
    const updateSyncTime = () => {
      const now = new Date();
      setLastSyncTime(`${now.toISOString().split('T')[0]} at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}`);
    };
    updateSyncTime();
    const interval = setInterval(updateSyncTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const isUnparsed = !profile.technicalSkills || profile.technicalSkills.length === 0;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-6 md:p-7 border border-indigo-100 dark:border-slate-800 shadow-xl mb-8">
      {/* Background Soft Accents */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-50/60 dark:bg-indigo-950/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-50/60 dark:bg-cyan-950/20 rounded-full blur-2xl -ml-16 -mb-16 pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Left Details */}
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-200 dark:bg-indigo-500/20 dark:border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-cyan-400 shrink-0">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <h2 className="text-lg md:text-xl font-black tracking-tight text-slate-900 dark:text-white">{profile.name}'s Placement Intelligence Dashboard</h2>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping mr-1.5" />
                  Active Auto Sync
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-0.5">
                Department: <strong className="text-slate-900 dark:text-slate-200">{profile.department || 'Awaiting Resume Parsing'}</strong> | CGPA: <strong>{profile.cgpa || 'N/A'}</strong> | Monitored Portals: <strong>Official Careers & Govt Feeds</strong>
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            Continuous background monitoring of verified company career portals, official REST APIs, and campus drive announcements.
            {isUnparsed && ' Upload your PDF resume to initialize skill vector matching and ATS compatibility calculation.'}
          </p>

          {/* Quick Monitored Stats Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80">
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-extrabold uppercase tracking-wider">Matching Jobs</div>
              <div className="text-lg font-black text-indigo-600 dark:text-cyan-400 flex items-center gap-1.5 mt-0.5">
                <Briefcase className="w-4 h-4 text-indigo-500" />
                {isUnparsed ? 0 : agent.todayMatchingJobsCount} Verified
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80">
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-extrabold uppercase tracking-wider">Placement Readiness</div>
              <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mt-0.5">
                <Target className="w-4 h-4 text-emerald-500" />
                {isUnparsed ? 0 : profile.placementReadinessScore}%
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80">
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-extrabold uppercase tracking-wider">ATS Score</div>
              <div className="text-lg font-black text-amber-600 dark:text-amber-400 flex items-center gap-1.5 mt-0.5">
                <Award className="w-4 h-4 text-amber-500" />
                {isUnparsed ? 0 : profile.atsScore}/100
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80">
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-extrabold uppercase tracking-wider">Skills Count</div>
              <div className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5 mt-1 truncate">
                <Building className="w-3.5 h-3.5 text-purple-500" />
                {profile.technicalSkills.length} Skills Listed
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
