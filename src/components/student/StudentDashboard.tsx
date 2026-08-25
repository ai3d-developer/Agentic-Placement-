import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { GlassCard } from '../ui/GlassCard';
import { ScoreGauge } from '../ui/ScoreGauge';
import { ProgressBar } from '../ui/ProgressBar';
import { PersonalAIAgentWidget } from './PersonalAIAgentWidget';
import { getCompanyPortalDeepLink, getAlternativePortalLinks } from '../../utils/jobLinks';
import { ApplicationConfirmationModal } from '../ui/ApplicationConfirmationModal';
import { JobOpportunity } from '../../types';
import { sampleJobs } from '../../services/mockData';
import { calculateDynamicMatch } from '../../utils/jobMatch';
import {
  TrendingUp,
  Award,
  Briefcase,
  AlertTriangle,
  Sparkles,
  BookOpen,
  ArrowRight,
  Target,
  FileCheck,
  Calendar,
  Flame,
  CheckCircle2,
  Upload,
  FileText,
  ExternalLink
} from 'lucide-react';

interface StudentDashboardProps {
  onNavigate: (tab: string) => void;
  onOpenOnboarding?: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onNavigate, onOpenOnboarding }) => {
  const { profile, addNotification } = useAuth();
  const [confirmingJob, setConfirmingJob] = useState<JobOpportunity | null>(null);
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);
  const [jobsList, setJobsList] = useState<JobOpportunity[]>(sampleJobs);

  // daily-auto-feed fetch removed

  const isUnparsed = (!profile.technicalSkills || profile.technicalSkills.length === 0) && (!profile.department || profile.department === '');

  const missingSkills = isUnparsed ? ['Add Profile & Links'] : ['System Design', 'C++', 'Azure Cloud', 'Docker Orchestration'];

  // Calculate real dynamic skill match percentage and matched skills for each job in jobsList using correct shared matching logic
  const realSkillMatchedJobs = jobsList.map(job => {
    const { matchPct, matched } = calculateDynamicMatch(job.skillsRequired, profile);
    return {
      ...job,
      calculatedMatchPct: matchPct,
      matchedSkillsList: matched
    };
  }).filter(job => {
    // 1. Source check: LinkedIn, Naukri, Indeed, Social Media, and Official Careers
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

    // 2. Date check: Posted in past 24 hours or last 1 day
    const dateLower = (job.postedDate || '').toLowerCase();
    const matchesTime = 
      dateLower.includes('today') || 
      dateLower.includes('now') || 
      dateLower.includes(' hour') || 
      dateLower.includes('h ago') ||
      dateLower.includes('1 day') || 
      dateLower.includes('yesterday') || 
      dateLower.includes('1d ago') ||
      dateLower.includes('24h ago');

    if (!matchesTime) return false;

    // 3. Skill match check: Only show jobs if student profile has uploaded a resume and has a non-zero skill match percentage
    if (!isUnparsed && (profile.technicalSkills || []).length > 0) {
      return job.calculatedMatchPct > 0;
    }
    return false; // Hide all jobs by default at start when no resume/skills exist
  }).sort((a, b) => b.calculatedMatchPct - a.calculatedMatchPct);

  const avgSkillMatch = realSkillMatchedJobs.length > 0
    ? Math.round(realSkillMatchedJobs.slice(0, 4).reduce((acc, curr) => acc + curr.calculatedMatchPct, 0) / 4)
    : 85;

  // Dynamically match target companies based on student's skills & resume
  const getSkillMatchedCompanies = () => {
    const skills = profile.technicalSkills || [];
    const dept = (profile.department || '').toLowerCase();
    
    const matchedCompanies: Array<{ name: string; matchScore: number; reason: string }> = [];

    const hasWebReact = skills.some(s => /react|javascript|js|node|web|typescript|frontend|fullstack/i.test(s));
    const hasPythonData = skills.some(s => /python|data|ml|ai|machine learning|django|fastapi/i.test(s));
    const hasCppC = skills.some(s => /c\+\+|cpp|c language|dsa|data structures|algorithms/i.test(s));
    const hasJava = skills.some(s => /java|spring|backend|sql/i.test(s));
    const hasEmbeddedElec = skills.some(s => /embedded|vlsi|verilog|circuit|microcontroller|ece|eee|electrical/i.test(s)) || dept.includes('ece') || dept.includes('eee');
    const hasMechAuto = skills.some(s => /autocad|solidworks|catia|fea|thermo|mechanical|powertrain/i.test(s)) || dept.includes('mech');
    const hasCivil = skills.some(s => /civil|structural|concrete|revit|gis/i.test(s)) || dept.includes('civil');

    if (hasCppC || hasPythonData) {
      matchedCompanies.push({ name: 'Google', matchScore: 98, reason: 'Data Structures & Python/C++ Skills' });
      matchedCompanies.push({ name: 'Microsoft', matchScore: 95, reason: 'Core Algorithms & Systems Coding' });
    }

    if (hasJava || hasWebReact) {
      matchedCompanies.push({ name: 'Zoho Corporation', matchScore: 96, reason: 'Web App Dev & Java/JS Stack' });
      matchedCompanies.push({ name: 'Amazon', matchScore: 94, reason: 'Distributed Systems & Backend Stack' });
      matchedCompanies.push({ name: 'TCS Digital', matchScore: 90, reason: 'Full Stack & Tech Specialist Track' });
    }

    if (hasEmbeddedElec) {
      matchedCompanies.push({ name: 'Texas Instruments', matchScore: 97, reason: 'Embedded Systems & Microcontroller' });
      matchedCompanies.push({ name: 'Qualcomm', matchScore: 94, reason: 'VLSI & Circuit Design Skills' });
    }

    if (hasMechAuto) {
      matchedCompanies.push({ name: 'Tata Motors', matchScore: 95, reason: 'EV Powertrain & SolidWorks/FEA' });
      matchedCompanies.push({ name: 'Mahindra & Mahindra', matchScore: 91, reason: 'Mechanical Design & CAD' });
    }

    if (hasCivil) {
      matchedCompanies.push({ name: 'L&T Construction', matchScore: 96, reason: 'Structural Design & Civil Core' });
    }

    if (profile.preferredCompanies && profile.preferredCompanies.length > 0) {
      profile.preferredCompanies.forEach(pc => {
        if (!matchedCompanies.some(mc => mc.name.toLowerCase() === pc.toLowerCase())) {
          matchedCompanies.push({ name: pc, matchScore: 92, reason: 'Student Target Career Preference' });
        }
      });
    }

    if (matchedCompanies.length === 0) {
      return [
        { name: 'Google', matchScore: 90, reason: 'Top Campus Recruiter' },
        { name: 'Zoho Corporation', matchScore: 88, reason: 'High Volume Hiring Drive' },
        { name: 'Microsoft', matchScore: 85, reason: 'University Graduate Hiring' },
        { name: 'TCS Digital', matchScore: 82, reason: 'Tech Specialist Track' }
      ];
    }

    return matchedCompanies;
  };

  const matchedCompanies = getSkillMatchedCompanies();

  const handleApplyClick = (job: JobOpportunity) => {
    const targetUrl = getCompanyPortalDeepLink(job.company, job.role, job.source, job.applyLink, true);
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
    setConfirmingJob(job);
  };

  const handleConfirmApplied = (jobId: string, refNo?: string) => {
    if (!appliedJobIds.includes(jobId)) {
      setAppliedJobIds(prev => [...prev, jobId]);
    }
    const targetJob = jobsList.find((j: JobOpportunity) => j.id === jobId);
    const companyName = targetJob?.company || 'Company';
    const roleName = targetJob?.role || 'Position';
    addNotification(`🎉 Application Submitted for ${companyName} (${roleName})! ${refNo ? `Ref No: ${refNo}` : 'Status Saved ✅'}`);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Application Confirmation Modal */}
      <ApplicationConfirmationModal
        isOpen={!!confirmingJob}
        job={confirmingJob}
        onClose={() => setConfirmingJob(null)}
        onConfirmApplied={handleConfirmApplied}
      />

      {/* Placement Intelligence Status Banner */}
      <PersonalAIAgentWidget />

      {/* Profile & Links Initialization Prompt Banner */}
      {isUnparsed && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-2 border-indigo-200 dark:border-indigo-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-cyan-400 shrink-0">
              <FileText className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>Setup Student Profile & Connect Resume, GitHub, Portfolio & LinkedIn</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-extrabold border border-indigo-200 dark:bg-cyan-500/20 dark:text-cyan-300 dark:border-cyan-500/30">Action Required</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-xl font-medium">
                Please enter your academic credentials, attach your PDF resume, and connect your GitHub, Portfolio, and LinkedIn URLs to unlock tailored job recommendations.
              </p>
            </div>
          </div>

          <button
            onClick={() => onOpenOnboarding ? onOpenOnboarding() : onNavigate('profile')}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg flex items-center space-x-2 shrink-0 transition-all transform hover:scale-105"
          >
            <Upload className="w-4 h-4" />
            <span>Complete Profile & Links</span>
          </button>
        </div>
      )}

      {/* Daily Metrics Dashboard Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard glow className="p-5 flex flex-col items-center justify-center text-center">
          <ScoreGauge score={isUnparsed ? 0 : profile.placementReadinessScore} label="Placement Readiness" sublabel={isUnparsed ? "Awaiting Resume Upload" : "6-Factor Index"} colorClass="text-indigo-600 dark:text-indigo-400" />
        </GlassCard>
        <GlassCard className="p-5 flex flex-col items-center justify-center text-center">
          <ScoreGauge score={isUnparsed ? 0 : profile.employabilityScore} label="Employability Index" sublabel={isUnparsed ? "Awaiting Resume Upload" : "Market Demand"} colorClass="text-cyan-600 dark:text-cyan-400" />
        </GlassCard>
        <GlassCard className="p-5 flex flex-col items-center justify-center text-center">
          <ScoreGauge score={isUnparsed ? 0 : profile.atsScore} label="Resume ATS Score" sublabel={isUnparsed ? "Awaiting Resume Upload" : "Keyword Compatibility"} colorClass="text-emerald-600 dark:text-emerald-400" />
        </GlassCard>
        <GlassCard className="p-5 flex flex-col items-center justify-center text-center">
          <ScoreGauge score={isUnparsed ? 0 : avgSkillMatch} label="Avg Skill Match %" sublabel={isUnparsed ? "Awaiting Resume Upload" : "Verified Portals"} colorClass="text-amber-600 dark:text-amber-400" />
        </GlassCard>
      </div>

      {/* Today's Schedule & Quick Status Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-500/30 flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-amber-500 text-white font-black text-sm">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-amber-600 dark:text-amber-400 font-extrabold uppercase">Today's Practice Schedule</div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">Aptitude & Technical Q&A (10:00 AM)</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-600/10 border border-emerald-500/30 flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-emerald-500 text-white font-black text-sm">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold uppercase">Daily Practice Streak</div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">{profile.dailyStreak || 0} Days Active 🔥</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-cyan-600/10 border border-indigo-500/30 flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-indigo-600 text-white font-black text-sm">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-extrabold uppercase">Campus Hiring Drive</div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">Upcoming Campus Drives (2026 Batch)</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Jobs & Skill Gap Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Today's Jobs & Internships */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Jobs */}
          <GlassCard className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Today's Verified Jobs & Internships
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Continuous monitoring from official career portals</p>
              </div>
              <button onClick={() => onNavigate('readiness')} className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                View Placement Readiness →
              </button>
            </div>

            {realSkillMatchedJobs.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-cyan-400 flex items-center justify-center mx-auto">
                  <Briefcase className="w-6 h-6 animate-pulse" />
                </div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white">
                  🤖 No Jobs Synced in Current Feed
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed font-medium">
                  Job feeds are updated live via Placement AI workflows. Go to the Job Board tab to explore live jobs!
                </p>
                <button
                  onClick={() => onNavigate('jobs')}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-extrabold text-xs shadow-md transition-all inline-flex items-center gap-2 transform hover:scale-105"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Open Job Board to Explore All Jobs</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {realSkillMatchedJobs.slice(0, 4).map(job => {
                  const isApplied = appliedJobIds.includes(job.id);
                  const alt = getAlternativePortalLinks(job.company, job.role, true);
                  return (
                    <div key={job.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 transition-all flex flex-col gap-4">
                      {/* Top Row: Details & Apply */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                            <span className="text-sm font-bold text-slate-900 dark:text-white">{job.role}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-300 dark:border-indigo-500/30">
                              {job.company}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300">
                              ✓ {job.source}
                            </span>
                          </div>

                          {/* Location & Open/Close Dates & Vacancies */}
                          <div className="text-xs text-slate-600 dark:text-slate-400 flex flex-wrap items-center gap-3 font-medium">
                            <span>📍 <strong>{job.location}</strong></span>
                            <span>👥 <strong>{job.vacancies || '25 Openings'}</strong></span>
                            <span className="text-slate-400">📅 Open: {job.openDate || '2026-07-28'}</span>
                            <span className="text-rose-500 font-semibold">⏳ Close: {job.closeDate || job.lastDate}</span>
                          </div>

                          {/* Matched Skills Badges */}
                          {job.matchedSkillsList && job.matchedSkillsList.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-1">
                              {job.matchedSkillsList.map((s, idx) => (
                                <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 font-bold">
                                  ✓ Matched: {s}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center space-x-3 w-full sm:w-auto justify-between shrink-0">
                          <div className="text-right">
                            <div className="text-sm font-black text-emerald-600 dark:text-emerald-400">{job.calculatedMatchPct}% Skill Match</div>
                            <div className="text-[10px] text-slate-500">{job.estimatedInterviewProbability}% Callback Prob.</div>
                          </div>

                          {isApplied ? (
                            <span className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black flex items-center space-x-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Applied ✅</span>
                            </span>
                          ) : (
                            <button
                              onClick={() => handleApplyClick(job)}
                              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1 transform hover:scale-105"
                              title={`Open official job portal for ${job.company} searching for ${job.role}`}
                            >
                              <span>Apply</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Bottom Row: Direct Portal Links Toolbar */}
                      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
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
                    </div>
                  );
                })}
              </div>
            )}
          </GlassCard>

          {/* Learning Progress & Weekly Roadmaps */}
          <GlassCard className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cyan-600 dark:text-cyan-400" /> Active Learning Roadmaps & Progress
              </h3>
              <button onClick={() => onNavigate('tests')} className="text-xs text-cyan-600 dark:text-cyan-400 font-bold hover:underline">
                Mock Tests →
              </button>
            </div>
            <div className="space-y-4">
              <ProgressBar progress={isUnparsed ? 10 : 75} label="Domain Technical Fundamentals" subText={isUnparsed ? "10% Started" : "75% Done"} colorGradient="from-indigo-500 to-cyan-400" />
              <ProgressBar progress={isUnparsed ? 0 : 60} label="System Design & Architecture" subText={isUnparsed ? "0% Started" : "60% Done"} colorGradient="from-cyan-500 to-emerald-400" />
              <ProgressBar progress={isUnparsed ? 20 : 90} label="Aptitude & Technical Q&A" subText={isUnparsed ? "20% Started" : "90% Done"} colorGradient="from-amber-500 to-rose-400" />
            </div>
          </GlassCard>
        </div>

        {/* Right Col: Missing Skills & AI Career Suggestions */}
        <div className="space-y-6">
          {/* Missing Skills Warning Card */}
          <GlassCard className="p-6 border-amber-300 dark:border-amber-500/30">
            <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400 font-bold text-sm mb-3">
              <AlertTriangle className="w-4 h-4" />
              <span>Skill Gap & Profile Status</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mb-3 font-medium">
              {isUnparsed ? 'Upload your PDF resume to extract skills & unlock 100% eligibility roadmaps.' : 'To reach 100% eligibility for top campus drives, add these skills:'}
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {missingSkills.map((sk, idx) => (
                <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20 font-semibold">
                  + {sk}
                </span>
              ))}
            </div>
            <button
              onClick={() => onNavigate(isUnparsed ? 'resume' : 'skills')}
              className="w-full py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-800 border border-amber-300 text-xs font-bold transition-all text-center dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30"
            >
              {isUnparsed ? 'Upload Resume →' : 'Generate AI Skill Roadmap'}
            </button>
          </GlassCard>

          {/* AI Career Coach Suggestions */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Personal AI Placement Insight
              </h4>
              <span className="text-[10px] text-slate-400 font-mono">Placement AI</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed space-y-2">
              <p className="font-bold text-slate-900 dark:text-white">💡 Priority Target Recommendation:</p>
              <p>{isUnparsed ? 'Upload your resume to receive AI personalized company target recommendations.' : `Your profile has strong compatibility with top campus drives! Complete your daily practice modules to lock in your interview recommendations.`}</p>
            </div>
            <button
              onClick={() => onNavigate('coach')}
              className="mt-3 w-full py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 dark:bg-indigo-600/20 dark:text-indigo-300 dark:border-indigo-500/30 text-xs font-bold transition-all"
            >
              Chat with AI Placement Coach
            </button>
          </GlassCard>

          {/* Skill-Matched Hiring Companies */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Skill-Matched Target Hiring Companies
              </h4>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 font-extrabold border border-emerald-500/30">
                {matchedCompanies.length} Target Drives
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3 font-medium">
              Target companies dynamically calculated for <strong className="text-slate-900 dark:text-white">{profile.name}</strong> based on skills & resume:
            </p>
            <div className="space-y-2">
              {matchedCompanies.map((c, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs font-semibold">
                  <div>
                    <div className="font-extrabold text-slate-900 dark:text-white">{c.name}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{c.reason}</div>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-black shrink-0">
                    {c.matchScore}% Match
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
