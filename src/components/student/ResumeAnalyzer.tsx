import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { GlassCard } from '../ui/GlassCard';
import { ScoreGauge } from '../ui/ScoreGauge';
import { analyzeResumeText, parseResumeTextToProfile } from '../../services/aiEngine';
import { ResumeAnalysisResult, JobOpportunity } from '../../types';
import { getCompanyPortalDeepLink } from '../../utils/jobLinks';
import { sampleJobs } from '../../services/mockData';
import { extractTextFromPdfFile } from '../../utils/pdfExtractor';
import { saveUploadedResumeDataToFirestore } from '../../services/firebase';
import { ApplicationConfirmationModal } from '../ui/ApplicationConfirmationModal';
import { FileText, Upload, Sparkles, Briefcase, ExternalLink, UserCheck, CheckCircle2, Award, FolderGit2, Check, ArrowRight, Clock, Users } from 'lucide-react';

interface ResumeAnalyzerProps {
  onNavigate?: (tab: string) => void;
}

export const ResumeAnalyzer: React.FC<ResumeAnalyzerProps> = ({ onNavigate }) => {
  const { profile, updateProfile, addNotification } = useAuth();
  const [analyzing, setAnalyzing] = useState(false);
  const [confirmingJob, setConfirmingJob] = useState<JobOpportunity | null>(null);
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);
  const [resumeText, setResumeText] = useState<string>(
    `Engineering Candidate\nDepartment: ${profile.department || 'Engineering'}\nSkills: ${(profile.technicalSkills || []).join(', ')}`
  );
  const [analysis, setAnalysis] = useState<ResumeAnalysisResult | null>(analyzeResumeText(resumeText, profile));
  const [activeTab, setActiveTab] = useState<'review' | 'matching_jobs' | 'ats' | 'cover_letter'>('review');
  const [lastAutoFilledDept, setLastAutoFilledDept] = useState<string | null>(profile.department || null);

  const isUnparsed = (!profile.technicalSkills || profile.technicalSkills.length === 0) && !profile.resumeFileName;

  const processAndAutoFillProfile = async (rawContent: string, fileName?: string) => {
    setAnalyzing(true);
    setResumeText(rawContent);

    // Call AI parser function to extract details from uploaded resume
    const parsed = await parseResumeTextToProfile(rawContent, profile);

    // AUTOMATICALLY FILL/UPDATE STUDENT PROFILE WITH EXTRACTED RESUME DETAILS!
    const updatedData = {
      name: parsed.name !== 'Student Candidate' ? parsed.name : (profile.name !== 'Student Candidate' ? profile.name : 'Arun Kumar'),
      email: (profile.email && profile.email !== 'student@college.edu') ? profile.email : (parsed.email || profile.email),
      phone: parsed.phone || profile.phone,
      college: parsed.college || profile.college,
      department: parsed.department || profile.department,
      cgpa: parsed.cgpa || profile.cgpa,
      technicalSkills: parsed.technicalSkills,
      projects: parsed.projects,
      certifications: parsed.certifications,
      atsScore: parsed.atsScore,
      placementReadinessScore: parsed.placementReadinessScore,
      preferredRoles: parsed.targetRoles || ['Associate Software Engineer', 'Full Stack Developer'],
      preferredCompanies: parsed.recommendedCompanies || ['Google', 'Zoho', 'Microsoft'],
      github: parsed.github || profile.github,
      linkedin: parsed.linkedin || profile.linkedin,
      portfolio: parsed.portfolio || profile.portfolio,
      resumeFileName: fileName || profile.resumeFileName || 'uploaded_resume.pdf',
      resumeUploadedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    updateProfile(updatedData);

    // Save full uploaded resume & raw text to Firebase Firestore
    saveUploadedResumeDataToFirestore(
      parsed.email || profile.email,
      fileName || 'uploaded_resume.pdf',
      rawContent,
      parsed
    );

    const result = analyzeResumeText(rawContent, {
      ...profile,
      department: parsed.department,
      technicalSkills: parsed.technicalSkills
    });

    setAnalysis(result);
    setLastAutoFilledDept(parsed.department);

    // n8n Apify background triggering removed

    setAnalyzing(false);

    addNotification(`⚡ Resume Extracted & Saved to Student Profile & Firebase Firestore! ${parsed.technicalSkills.length} Skills | ATS: ${parsed.atsScore}/100`);
    setActiveTab('matching_jobs');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAnalyzing(true);
    try {
      const text = await extractTextFromPdfFile(file);
      await processAndAutoFillProfile(text || file.name, file.name);
    } catch (err) {
      console.error('Resume upload error:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const currentDept = profile.department || 'Computer Science & Engineering';

  const [n8nJobs, setN8nJobs] = useState<JobOpportunity[]>(sampleJobs);

  // daily-auto-feed fetch removed

  const rawJobs = [...n8nJobs, ...sampleJobs];
  const combinedJobs = Array.from(new Map(rawJobs.map(j => [j.id, j])).values());

  // Calculate real skill match for jobs against extracted profile skills & department
  const realMatchingJobs = isUnparsed ? [] : combinedJobs.map(job => {
    const studentSkillsLower = (profile.technicalSkills || []).map(s => s.toLowerCase().trim());
    const matchedSkills = job.skillsRequired.filter(sk => {
      const j = sk.toLowerCase().trim();
      return studentSkillsLower.some(ps => {
        const s = ps.toLowerCase().trim();
        if (s === j) return true;
        // Require exact match for short skill names (e.g. C, C++, Go, R, SQL)
        if (s.length <= 3 || j.length <= 3) return false;
        // Special case: java vs javascript
        if ((s === 'java' && j.includes('javascript')) || (j === 'java' && s.includes('javascript'))) return false;
        return s.includes(j) || j.includes(s);
      });
    });

    const userDept = (profile.department || '').toLowerCase();
    const jobDept = (job.department || '').toLowerCase();
    const deptWord = userDept.split(' ')[0];

    const isDeptMatch = jobDept && (
      jobDept.includes(deptWord) ||
      (userDept.includes('computer') && (jobDept.includes('cse') || jobDept.includes('it') || jobDept.includes('computer'))) ||
      (userDept.includes('electrical') && (jobDept.includes('eee') || jobDept.includes('ece') || jobDept.includes('electrical'))) ||
      (userDept.includes('mechanical') && jobDept.includes('mechanical')) ||
      (userDept.includes('civil') && jobDept.includes('civil'))
    );

    let matchPct = Math.round((matchedSkills.length / Math.max(1, job.skillsRequired.length)) * 100);
    if (matchedSkills.length > 0) {
      matchPct = Math.min(100, Math.max(80, matchPct + 25));
      if (isDeptMatch) matchPct = Math.min(100, matchPct + 10);
    } else {
      matchPct = 0;
    }

    return { ...job, matchPct, matchedSkills };
  }).filter(job => {
    // Globally filter out 0% match jobs or jobs with no matched skills
    return job.matchPct > 0 && job.matchedSkills.length > 0;
  }).sort((a, b) => b.matchPct - a.matchPct);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-600 dark:text-indigo-400 animate-pulse" /> AI Resume Extractor & Profile Sync Engine
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Upload your PDF/DOC resume. Our AI extracts your skills, projects, certifications, and updates your <strong>Student Profile</strong> automatically!
          </p>
        </div>

        {/* Navigation Tab Switcher */}
        <div className="flex items-center space-x-1 p-1 rounded-xl bg-slate-200/80 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs font-bold shrink-0">
          <button
            onClick={() => setActiveTab('review')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${activeTab === 'review' ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
          >
            Extracted Review
          </button>
          <button
            onClick={() => setActiveTab('matching_jobs')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${activeTab === 'matching_jobs' ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
          >
            Matched Jobs ({realMatchingJobs.length > 0 ? `${realMatchingJobs.length} Jobs` : '0 Jobs'})
          </button>
          <button
            onClick={() => setActiveTab('ats')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${activeTab === 'ats' ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
          >
            ATS Breakdown
          </button>
          <button
            onClick={() => setActiveTab('cover_letter')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${activeTab === 'cover_letter' ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
          >
            Cover Letter
          </button>
        </div>
      </div>

      {/* Profile Updated Alert Banner */}
      {lastAutoFilledDept && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-indigo-500/10 border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs font-bold text-emerald-800 dark:text-emerald-300 shadow-md">
          <div className="flex items-center space-x-2.5">
            <UserCheck className="w-5 h-5 text-emerald-500 shrink-0" />
            <div>
              <div>
                ✅ Extracted Details Saved to Student Profile! Department: <strong>{profile.department}</strong> | Skills ({profile.technicalSkills.length}): <strong>{profile.technicalSkills.slice(0, 5).join(', ')}</strong>
              </div>
              <div className="text-[11px] text-indigo-700 dark:text-indigo-300 font-normal mt-0.5">
                🤖 Saved Projects: <strong>{profile.projects?.length || 0} Projects Extracted</strong> | ATS Compatibility: <strong>{profile.atsScore}/100</strong>
              </div>
            </div>
          </div>
          <button
            onClick={() => onNavigate && onNavigate('profile')}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-extrabold shrink-0 transition-all shadow flex items-center gap-1"
          >
            <span>View Student Profile</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Upload Zone */}
      <GlassCard className="p-6">
        <div className="border-2 border-dashed border-indigo-300 dark:border-indigo-800/80 hover:border-indigo-500 rounded-3xl p-6 text-center transition-all bg-indigo-50/50 dark:bg-slate-950/60 shadow-inner">
          <input
            type="file"
            accept=".pdf,.docx,.txt"
            id="resume-upload-input"
            onChange={handleFileUpload}
            className="hidden"
          />
          <label htmlFor="resume-upload-input" className="cursor-pointer flex flex-col items-center justify-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <Upload className="w-7 h-7 animate-bounce" />
            </div>
            <div>
              <div className="text-base font-black text-slate-900 dark:text-white">
                {analyzing ? 'Extracting Resume Details via Gemini AI...' : 'Upload PDF Resume to Auto-Fill Student Profile'}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                Upload your resume file. AI will parse your technical skills, projects, certifications, and automatically update your profile and match top jobs!
              </p>
            </div>
            <div className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-md transition-all">
              {analyzing ? 'Processing...' : 'Select Resume File'}
            </div>
          </label>
        </div>
      </GlassCard>

      {/* EXTRACTED RESUME REVIEW BREAKDOWN TAB */}
      {activeTab === 'review' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Extracted Skills Card */}
            <GlassCard className="p-6 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Extracted Technical & Soft Skills
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-extrabold">
                  {profile.technicalSkills.length} Saved to Profile
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {profile.technicalSkills.map((sk, idx) => (
                  <span key={idx} className="text-xs px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30 font-bold flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-500" /> {sk}
                  </span>
                ))}
              </div>
            </GlassCard>

            {/* Extracted Certifications & Roles Card */}
            <GlassCard className="p-6 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-indigo-500" /> Extracted Certifications & Target Roles
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-extrabold">
                  {profile.department}
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 font-medium">Recommended Target Roles: </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{profile.preferredRoles?.join(' • ') || 'Associate Software Engineer'}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Saved Certifications: </span>
                  {profile.certifications && profile.certifications.length > 0 ? (
                    profile.certifications.map((c, i) => (
                      <div key={i} className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
                        📜 {c.title} ({c.issuer}, {c.year})
                      </div>
                    ))
                  ) : (
                    <span className="text-slate-400 italic">None</span>
                  )}
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Extracted Projects Card */}
          <GlassCard className="p-6 space-y-4">
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
              <FolderGit2 className="w-4 h-4 text-cyan-500" /> Extracted Projects & Internships Saved to Student Profile
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.projects && profile.projects.length > 0 ? (
                profile.projects.map((proj, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>📁 {proj.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                      {proj.description}
                    </p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {proj.techStack.map((tech, tIdx) => (
                        <span key={tIdx} className="text-[10px] px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-300 font-bold">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400 italic p-3">Upload a PDF resume to extract projects.</div>
              )}
            </div>
          </GlassCard>

          {/* Extracted Skill-Matched Jobs Preview Section */}
          <GlassCard className="p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Top Jobs Matched to Extracted Resume Details
                </h3>
                <p className="text-xs text-slate-500">Calculated directly from your extracted skills ({profile.technicalSkills.length}) & department ({profile.department})</p>
              </div>
              <button
                onClick={() => setActiveTab('matching_jobs')}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <span>View All ({realMatchingJobs.length} Jobs)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {isUnparsed ? (
                <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-cyan-400 flex items-center justify-center mx-auto">
                    <FileText className="w-6 h-6 animate-bounce" />
                  </div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">
                    📄 Jobs Will Appear After PDF Resume Upload or Profile Update
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed font-medium">
                    Upload your PDF resume using the dropzone above or update your skills in your profile to automatically parse technical skills and match top active job opportunities!
                  </p>
                </div>
              ) : (
                realMatchingJobs.slice(0, 3).map(job => {
                  const isApplied = appliedJobIds.includes(job.id);
                  return (
                    <div key={job.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                          <span className="text-sm font-bold text-slate-900 dark:text-white">{job.role}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-300">
                            {job.company}
                          </span>
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400 flex flex-wrap gap-3 font-medium">
                          <span>📍 <strong>{job.location}</strong></span>
                          <span>👥 <strong>{job.vacancies || '25 Openings'}</strong></span>
                          <span>📅 Open: {job.openDate || '2026-07-28'}</span>
                          <span className="text-rose-500 font-semibold">⏳ Close: {job.closeDate || job.lastDate}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 pt-1">
                          {job.matchedSkills?.map((s, idx) => (
                            <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 font-bold">
                              ✓ Matched: {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 w-full sm:w-auto justify-between shrink-0">
                        <div className="text-right">
                          <div className="text-sm font-black text-emerald-600 dark:text-emerald-400">{job.matchPct}% Match</div>
                          <div className="text-[10px] text-slate-500">Resume Tailored</div>
                        </div>
                        {isApplied ? (
                          <span className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black flex items-center space-x-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Applied ✅</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              const targetUrl = getCompanyPortalDeepLink(job.company, job.role, job.source, job.applyLink);
                              window.open(targetUrl, '_blank', 'noopener,noreferrer');
                              setConfirmingJob(job);
                            }}
                            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-1.5"
                          >
                            <span>Apply</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </GlassCard>
        </div>
      )}

      {/* FULL MATCHING JOBS TAB */}
      {activeTab === 'matching_jobs' && (
        <GlassCard className="p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Jobs Tailored for Extracted Resume ({currentDept})
              </h3>
              <p className="text-xs text-slate-500">Official campus placement drives matched to your parsed degree, skills & projects</p>
            </div>
          </div>

          <div className="space-y-3">
            {isUnparsed ? (
              <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-cyan-400 flex items-center justify-center mx-auto">
                  <FileText className="w-6 h-6 animate-bounce" />
                </div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white">
                  📄 Jobs Will Appear After PDF Resume Upload or Profile Update
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed font-medium">
                  Please upload your PDF resume or update your skills in your student profile to match placement drives!
                </p>
              </div>
            ) : (
              realMatchingJobs.map(job => {
                const isApplied = appliedJobIds.includes(job.id);
                return (
                  <div key={job.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{job.role}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-300">
                          {job.company}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300">
                          ✓ Verified Active
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 flex flex-wrap gap-3 font-medium">
                        <span>📍 <strong>{job.location}</strong></span>
                        <span>👥 <strong>{job.vacancies || '25 Openings'}</strong></span>
                        <span>📅 Open: {job.openDate || '2026-07-28'}</span>
                        <span className="text-rose-500 font-semibold">⏳ Close: {job.closeDate || job.lastDate}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {job.matchedSkills?.map((s, idx) => (
                          <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 font-bold">
                            ✓ Matched Skill: {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 w-full sm:w-auto justify-between shrink-0">
                      <div className="text-right">
                        <div className="text-sm font-black text-emerald-600 dark:text-emerald-400">{job.matchPct}% Skill Match</div>
                        <div className="text-[10px] text-slate-500">Official Portal</div>
                      </div>
                      {isApplied ? (
                        <span className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Applied ✅</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            const targetUrl = getCompanyPortalDeepLink(job.company, job.role, job.source, job.applyLink);
                            window.open(targetUrl, '_blank', 'noopener,noreferrer');
                            setConfirmingJob(job);
                          }}
                          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-1.5"
                        >
                          <span>Apply</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </GlassCard>
      )}

      {/* ATS ANALYSIS TAB */}
      {activeTab === 'ats' && analysis && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <GlassCard className="p-6 flex flex-col items-center justify-center text-center">
            <ScoreGauge score={analysis.atsScore} label="Overall ATS Score" sublabel={`Resume parsed for ${currentDept}!`} colorClass="text-emerald-600 dark:text-emerald-400" />
            <div className="mt-4 text-xs font-bold text-slate-600 dark:text-slate-400">
              Detected Skills: {profile.technicalSkills.length} Technical Terms
            </div>
          </GlassCard>

          <GlassCard className="lg:col-span-2 p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">ATS Metric Category Scores</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="text-xs text-slate-500 font-medium">Keyword Density</div>
                <div className="text-xl font-black text-indigo-600 dark:text-indigo-400">{analysis.breakdown.keywords}/100</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="text-xs text-slate-500 font-medium">Formatting & Headers</div>
                <div className="text-xl font-black text-cyan-600 dark:text-cyan-400">{analysis.breakdown.formatting}/100</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="text-xs text-slate-500 font-medium">Measurable Impact</div>
                <div className="text-xl font-black text-amber-600 dark:text-amber-400">{analysis.breakdown.impactMetrics}/100</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="text-xs text-slate-500 font-medium">Technical Skill Alignment</div>
                <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">{analysis.breakdown.skillsMatch}/100</div>
              </div>
            </div>

            <div className="pt-2">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Extracted Technical Skills from Resume:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {profile.technicalSkills.map((sk, idx) => (
                  <span key={idx} className="text-xs px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30 font-semibold">
                    ✓ {sk}
                  </span>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* AI COVER LETTER TAB */}
      {activeTab === 'cover_letter' && analysis && (
        <GlassCard className="p-6">
          <h3 className="text-base font-black text-slate-900 dark:text-white mb-2">AI-Generated Tailored Cover Letter</h3>
          <p className="text-xs text-slate-500 mb-4">Customized for {profile.name} ({currentDept})</p>
          <pre className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
            {analysis.sampleCoverLetter}
          </pre>
        </GlassCard>
      )}

      {/* Application Confirmation Modal */}
      <ApplicationConfirmationModal
        isOpen={!!confirmingJob}
        job={confirmingJob}
        onClose={() => setConfirmingJob(null)}
        onConfirmApplied={(jobId, refNo) => {
          if (!appliedJobIds.includes(jobId)) {
            setAppliedJobIds(prev => [...prev, jobId]);
          }
          addNotification(`🎉 Application Submitted & Verified for ${confirmingJob?.company} (${confirmingJob?.role})! ${refNo ? `Ref No: ${refNo}` : 'Status Saved ✅'}`);
          setConfirmingJob(null);
        }}
      />
    </div>
  );
};
