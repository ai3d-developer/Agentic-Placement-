import React, { useState, useEffect } from 'react';
import { JobOpportunity } from '../../types';
import {
  Sparkles,
  Building2,
  MapPin,
  DollarSign,
  ExternalLink,
  X,
  TrendingUp,
  Briefcase,
  Zap,
  CheckCircle2,
  Maximize2,
  Minimize2
} from 'lucide-react';

import { getCompanyPortalDeepLink, getAlternativePortalLinks } from '../../utils/jobLinks';
import { sampleJobs } from '../../services/mockData';
import { useAuth } from '../../context/AuthContext';
import { calculateDynamicMatch } from '../../utils/jobMatch';

interface TodayJobsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToJobs: () => void;
}

export const TodayJobsModal: React.FC<TodayJobsModalProps> = ({
  isOpen,
  onClose,
  onNavigateToJobs
}) => {
  const { profile } = useAuth();
  const [n8nJobs] = useState<JobOpportunity[]>(sampleJobs);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [selectedSourceFilter, setSelectedSourceFilter] = useState<string>('All');
  const [selectedTimeFilter, setSelectedTimeFilter] = useState<'24h' | '1d'>('24h');

  if (!isOpen) return null;

  // Filter jobs based on skills, past 24 hours post date, and verified portal sources
  const todayJobs = n8nJobs.filter(job => {
    // 1. Source check: LinkedIn, Naukri, Indeed, Social Media, and Official Sites
    const sourceLower = (job.source || '').toLowerCase();
    const matchesSource = 
      sourceLower.includes('linkedin') || 
      sourceLower.includes('naukri') || 
      sourceLower.includes('indeed') || 
      sourceLower.includes('official') ||
      sourceLower.includes('career') ||
      sourceLower.includes('social') ||
      sourceLower.includes('twitter') ||
      sourceLower.includes('x');

    if (!matchesSource) return false;

    // Check specific filter selection if it is not 'All'
    if (selectedSourceFilter !== 'All') {
      const filterLower = selectedSourceFilter.toLowerCase();
      if (filterLower === 'official careers') {
        if (!sourceLower.includes('official') && !sourceLower.includes('career')) return false;
      } else if (filterLower === 'social media') {
        if (!sourceLower.includes('social') && !sourceLower.includes('twitter') && !sourceLower.includes('x')) return false;
      } else {
        if (!sourceLower.includes(filterLower)) return false;
      }
    }

    // 2. Date check: Posted in past 24 hours or last 1 day
    const dateLower = (job.postedDate || '').toLowerCase();
    let matchesTime = false;
    if (selectedTimeFilter === '24h') {
      matchesTime = 
        dateLower.includes('today') || 
        dateLower.includes('now') || 
        dateLower.includes(' hour') || 
        dateLower.includes('h ago') ||
        (job.postedDate?.includes('n8n') || (job as any).isN8nSynced);
    } else {
      matchesTime = 
        dateLower.includes('1 day') || 
        dateLower.includes('yesterday') || 
        dateLower.includes('1d ago') ||
        dateLower.includes('24h ago') ||
        dateLower.includes('28h ago');
    }

    if (!matchesTime) return false;

    // 3. Skill match check: Student must have uploaded resume and have at least 1 matching skill
    const hasResume = profile && profile.resumeFileName && profile.technicalSkills && profile.technicalSkills.length > 0;
    if (hasResume) {
      const { matchPct } = calculateDynamicMatch(job.skillsRequired, profile);
      return matchPct > 0;
    }
    
    return false;
  }).sort((a, b) => {
    const matchA = calculateDynamicMatch(a.skillsRequired, profile).matchPct;
    const matchB = calculateDynamicMatch(b.skillsRequired, profile).matchPct;
    return matchB - matchA;
  });

  const handleApplyClick = (job: JobOpportunity) => {
    const targetUrl = getCompanyPortalDeepLink(job.company, job.role, job.source, job.applyLink, true);
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-200 ${
      isFullScreen ? 'p-0' : 'p-3 md:p-6 overflow-y-auto'
    }`}>
      <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${
        isFullScreen
          ? 'w-screen h-screen rounded-none border-none max-h-none max-w-none'
          : 'w-full max-w-3xl rounded-3xl max-h-[90vh]'
      }`}>
        
        {/* Modal Header */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-5 md:p-6 text-slate-900 dark:text-white flex justify-between items-center shrink-0">
          <div>
            <div className="flex items-center space-x-2 text-indigo-600 dark:text-cyan-400 text-xs font-extrabold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
              <span>Daily Placement Alert • Just Updated</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight flex items-center gap-2 text-slate-900 dark:text-white">
              🔥 Today's Top Verified Job Openings
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-xs mt-1 font-medium">
              5 new high-matching opportunities detected today across CSE, ECE, Mechanical, Civil, and Data Science!
            </p>
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all shrink-0 flex items-center gap-1 text-xs font-bold"
              title={isFullScreen ? "Exit Fullscreen" : "Full Screen"}
            >
              {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 transition-all shrink-0"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body - Jobs List */}
        <div className="p-4 md:p-6 overflow-y-auto space-y-3 flex-1 bg-slate-50/50 dark:bg-slate-950/40">
          <div className="flex justify-between items-center px-1 mb-1">
            <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Recommended Active Jobs for Today</span>
            </span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              100% Verified Portals
            </span>
          </div>

          {/* Source & Time Selector Filters Container */}
          <div className="flex flex-col gap-2.5 pb-3 border-b border-slate-200 dark:border-slate-800">
            {/* Source Selector Tab Bar */}
            <div className="flex flex-wrap gap-1.5">
              {['All', 'LinkedIn', 'Naukri', 'Indeed', 'Official Careers', 'Social Media'].map(src => {
                const isActive = selectedSourceFilter === src;
                return (
                  <button
                    key={src}
                    onClick={() => setSelectedSourceFilter(src)}
                    className={`px-3 py-1.5 rounded-xl font-extrabold text-[11px] border transition-all ${
                      isActive
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-400 hover:bg-slate-55 dark:hover:bg-slate-850'
                    }`}
                  >
                    {src === 'All' ? '🌐 All Portals' : src}
                  </button>
                );
              })}
            </div>

            {/* Time Filter Selector */}
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Freshness / Date posted:</span>
              {[
                { id: '24h', label: '⏱️ Past 24 hours' },
                { id: '1d', label: '📅 Last 1 day' }
              ].map(time => {
                const isActive = selectedTimeFilter === time.id;
                return (
                  <button
                    key={time.id}
                    onClick={() => setSelectedTimeFilter(time.id as any)}
                    className={`px-3 py-1.5 rounded-xl font-extrabold text-[10px] border transition-all uppercase tracking-wider ${
                      isActive
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'
                    }`}
                  >
                    {time.label}
                  </button>
                );
              })}
            </div>
          </div>

            {todayJobs.length === 0 ? (
              <div className="py-12 text-center space-y-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-cyan-400 flex items-center justify-center mx-auto">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <div className="space-y-1.5 max-w-sm mx-auto">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    No Matching Jobs Posted Today
                  </h3>
                  <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed font-medium">
                    {!profile.resumeFileName ? (
                      "Please upload your resume first to view daily matches tailored to your specific skill set!"
                    ) : (
                      "No new opportunities matching your precise skills were scraped in the last 24 hours on LinkedIn, Naukri, Indeed, or Official sites. Check back tomorrow!"
                    )}
                  </p>
                </div>
              </div>
            ) : (
              todayJobs.map(job => {
                const alt = getAlternativePortalLinks(job.company, job.role, true);
                const { matchPct } = calculateDynamicMatch(job.skillsRequired, profile);
                return (
                  <div
                    key={job.id}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 transition-all shadow-sm space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-base font-black text-slate-900 dark:text-white">{job.role}</span>
                          <span className="text-xs px-2.5 py-0.5 rounded-full font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-300 dark:border-indigo-500/30 flex items-center gap-1">
                            <Building2 className="w-3 h-3" /> {job.company}
                          </span>
                          {job.department && (
                            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-500/20 dark:text-amber-300">
                              {job.department}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-400 font-semibold">
                          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-indigo-500" /> {job.location}</span>
                          <span>🎓 {job.education}</span>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 dark:border-slate-800">
                        <div className="text-xs font-black text-indigo-600 dark:text-cyan-400">{matchPct}% Match</div>
                        <button
                          onClick={() => handleApplyClick(job)}
                          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
                        >
                          <span>Apply on Official Portal</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Multi-Portal Direct Verification Links Bar */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                      <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">Direct Portal Links:</span>
                      <a
                        href={alt.official}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 text-[11px] font-extrabold hover:bg-purple-100 flex items-center gap-1 transition-all"
                      >
                        🏢 Official Site <ExternalLink className="w-3 h-3" />
                      </a>
                      <a
                        href={alt.linkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 border border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 text-[11px] font-extrabold hover:bg-sky-100 flex items-center gap-1 transition-all"
                      >
                        🔵 LinkedIn <ExternalLink className="w-3 h-3" />
                      </a>
                      <a
                        href={alt.naukri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 text-[11px] font-extrabold hover:bg-blue-100 flex items-center gap-1 transition-all"
                      >
                        🟢 Naukri <ExternalLink className="w-3 h-3" />
                      </a>
                      <a
                        href={alt.indeed}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 text-[11px] font-extrabold hover:bg-indigo-100 flex items-center gap-1 transition-all"
                      >
                        🟣 Indeed <ExternalLink className="w-3 h-3" />
                      </a>
                      <a
                        href={alt.socialMedia || alt.glassdoor}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 text-[11px] font-extrabold hover:bg-emerald-100 flex items-center gap-1 transition-all"
                      >
                        🌐 Social Media / X <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    {/* Skill chips preview */}
                    <div className="flex flex-wrap gap-1.5">
                      {job.skillsRequired.map((sk, idx) => (
                        <span key={idx} className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 font-semibold">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-3 shrink-0">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Over <strong className="text-indigo-600 dark:text-indigo-400">1,280+ active openings</strong> available in portal today
          </span>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => {
                onClose();
                onNavigateToJobs();
              }}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-1.5"
            >
              <Briefcase className="w-4 h-4" />
              <span>Explore All Jobs →</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
