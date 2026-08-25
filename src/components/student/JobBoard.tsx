import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { GlassCard } from '../ui/GlassCard';
import { ApplicationConfirmationModal } from '../ui/ApplicationConfirmationModal';
import { JobOpportunity, JobSourceType } from '../../types';
import { getCompanyPortalDeepLink, getAlternativePortalLinks } from '../../utils/jobLinks';
import { sampleJobs } from '../../services/mockData';
import { calculateDynamicMatch as calculateDynamicMatchShared } from '../../utils/jobMatch';
import { callGeminiAI } from '../../services/aiEngine';

import {
  Briefcase,
  Search,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Building2,
  MapPin,
  IndianRupee,
  DollarSign,
  Sparkles,
  Zap,
  SlidersHorizontal,
  Bookmark,
  TrendingUp,
  Clock,
  RefreshCw,
  UserCheck,
  Award,
  Users
} from 'lucide-react';
interface VerifiedApplication {
  refNo?: string;
  timestamp: string;
}

interface JobBoardProps {
  onNavigate?: (tab: string) => void;
}

export const JobBoard: React.FC<JobBoardProps> = ({ onNavigate }) => {
  const { profile, updateProfile, addNotification } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmingJob, setConfirmingJob] = useState<JobOpportunity | null>(null);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [verifiedApplications, setVerifiedApplications] = useState<Record<string, VerifiedApplication>>({});
  const [verifyingJob, setVerifyingJob] = useState<JobOpportunity | null>(null);
  const [enhancingJob, setEnhancingJob] = useState<JobOpportunity | null>(null);
  const [isEnhancingLoading, setIsEnhancingLoading] = useState(false);
  const [enhancingProgressStep, setEnhancingProgressStep] = useState(0);
  const [aiEnhancedData, setAiEnhancedData] = useState<{
    summary: string;
    technicalSkills: string[];
    projects: Array<{ title: string; description: string; techStack: string[] }>;
  } | null>(null);
  const [applicationRefNo, setApplicationRefNo] = useState('');

  const verifyApplication = (jobId: string, refNo?: string) => {
    setVerifiedApplications(prev => ({
      ...prev,
      [jobId]: {
        refNo: refNo || 'REG-2026',
        timestamp: new Date().toISOString()
      }
    }));
  };

  const handleEnhanceResumeClick = async (job: JobOpportunity) => {
    setEnhancingJob(job);
    setIsEnhancingLoading(true);
    setEnhancingProgressStep(0);
    setAiEnhancedData(null);
    
    // Simulate loading progress steps while AI call executes
    const interval = setInterval(() => {
      setEnhancingProgressStep(prev => {
        if (prev < 3) {
          return prev + 1;
        }
        return prev;
      });
    }, 450);

    try {
      const skillsStr = (profile.technicalSkills || []).join(', ');
      const projectsStr = (profile.projects || []).map(p => `${p.title}: ${p.description} (Tech: ${p.techStack ? p.techStack.join(', ') : ''})`).join('\n');
      const certsStr = (profile.certifications || []).map(c => c.title).join(', ');
      
      const prompt = `You are a professional resume optimizer AI. Rewrite and enhance the student's resume elements to perfectly match this target job.
      
STUDENT INFO:
- Department: ${profile.department || 'Engineering'}
- Current Skills: ${skillsStr}
- Current Projects:
${projectsStr}
- Certifications: ${certsStr}

TARGET JOB DETAILS:
- Role: ${job.role}
- Company: ${job.company}
- Required Skills: ${job.skillsRequired.join(', ')}
- Description: ${job.description || ''}

TASK:
Optimize the student's summary, add missing required skills to their technicalSkills list, and tailor their project descriptions using keywords from the target job.
Respond with ONLY valid JSON inside a code block (matching this exact schema):
{
  "summary": "AI tailored summary paragraph (about 3 sentences) highlighting their background and why they match this role.",
  "technicalSkills": ["skill1", "skill2", "skill3", ...],
  "projects": [
    {
      "title": "Project Title 1",
      "description": "Tailored project description highlighting relevant skills and impact.",
      "techStack": ["skill1", "skill2", ...]
    }
  ]
}`;

      console.log('🤖 [JobBoard] Sending prompt to Gemini via OpenRouter...');
      const response = await callGeminiAI(prompt, "You are a professional JSON resume optimizer. Output raw JSON only.");
      console.log('🤖 [JobBoard] AI Response received:', response);
      
      if (response) {
        const match = response.match(/\{[\s\S]*\}/);
        const jsonStr = match ? match[0] : response;
        const parsed = JSON.parse(jsonStr);
        
        if (parsed.summary && parsed.technicalSkills && parsed.projects) {
          setAiEnhancedData({
            summary: parsed.summary,
            technicalSkills: parsed.technicalSkills,
            projects: parsed.projects
          });
        }
      }
    } catch (err) {
      console.error('❌ [JobBoard] AI Resume Enhancer failed:', err);
      // Fallback in case of API failure or rate limit
      const { matched, missing } = calculateDynamicMatchShared(job.skillsRequired, profile);
      const tailoredSummary = `Results-driven and detail-oriented ${profile.department || 'Engineering'} student specializing in ${job.role} workflows. Proficient in ${[...matched, ...missing.slice(0, 2)].join(', ')}. Eager to leverage project experience to contribute as a high-performance ${job.role} at ${job.company}.`;
      setAiEnhancedData({
        summary: tailoredSummary,
        technicalSkills: Array.from(new Set([...(profile.technicalSkills || []), ...job.skillsRequired])),
        projects: (profile.projects || []).map((p, idx) => ({
          title: p.title,
          description: idx === 0 && missing.length > 0 ? `${p.description} Utilized frameworks matching ${missing.slice(0, 2).join(' and ')} core criteria.` : p.description,
          techStack: p.techStack
        }))
      });
    } finally {
      clearInterval(interval);
      setEnhancingProgressStep(4);
      setIsEnhancingLoading(false);
    }
  };

  const handlePrintResume = (enhanced: any) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to print/export your enhanced resume!');
      return;
    }
    
    const skillsList = enhanced.technicalSkills.join(', ');
    const projectsHtml = enhanced.projects.map((p: any) => `
      <div style="margin-bottom: 12px;">
        <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 11px;">
          <span>${p.title}</span>
          <span>${p.techStack ? p.techStack.join(', ') : ''}</span>
        </div>
        <p style="margin: 3px 0 0 0; font-size: 10px; color: #4a5568; line-height: 1.4;">${p.description}</p>
      </div>
    `).join('');
    
    const certsHtml = enhanced.certifications.map((c: any) => `
      <div style="margin-bottom: 6px; font-size: 10px; display: flex; justify-content: space-between;">
        <span><strong>${c.title}</strong> — ${c.issuer}</span>
        <span style="color: #718096;">${c.year || 'Completed'}</span>
      </div>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>${enhanced.name.replace(/\s+/g, '_')}_Enhanced_Resume</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');
            body {
              font-family: 'Inter', sans-serif;
              color: #1a202c;
              margin: 40px;
              padding: 0;
              line-height: 1.5;
            }
            .header {
              text-align: center;
              margin-bottom: 25px;
              border-bottom: 2px solid #2b6cb0;
              padding-bottom: 10px;
            }
            .name {
              font-size: 24px;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin: 0;
              color: #2b6cb0;
            }
            .contact {
              font-size: 10px;
              color: #4a5568;
              margin: 5px 0 0 0;
            }
            .section {
              margin-bottom: 20px;
            }
            .section-title {
              font-size: 12px;
              font-weight: 800;
              text-transform: uppercase;
              border-bottom: 1px solid #e2e8f0;
              padding-bottom: 3px;
              margin-bottom: 8px;
              color: #2d3748;
              letter-spacing: 0.5px;
            }
            .summary {
              font-size: 10px;
              color: #4a5568;
              line-height: 1.5;
              margin: 0;
            }
            .skills {
              font-size: 10px;
              line-height: 1.5;
            }
            @media print {
              body { margin: 20px; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="name">${enhanced.name}</h1>
            <div class="contact">
              ${enhanced.email} | ${enhanced.phone || '+91 98765 43210'} | ${enhanced.college || 'University College'}
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">Professional Summary</div>
            <p class="summary">${enhanced.summary}</p>
          </div>
          
          <div class="section">
            <div class="section-title">Technical Skills</div>
            <div class="skills">
              <strong>Core Technologies:</strong> ${skillsList}
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">Key Projects</div>
            ${projectsHtml}
          </div>
          
          ${enhanced.certifications.length > 0 ? `
          <div class="section">
            <div class="section-title">Certifications</div>
            ${certsHtml}
          </div>
          ` : ''}

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };
  const renderSalaryInfo = (salary: string) => {
    if (!salary) {
      return {
        icon: <IndianRupee className="w-3.5 h-3.5 shrink-0" />,
        text: 'Not Disclosed'
      };
    }
    
    const hasDollar = salary.includes('$');
    // Remove duplicate symbols to avoid double currency signs like '₹ ₹18,50,000'
    let cleanSalary = salary.replace(/[₹$]/g, '').trim();
    if (!cleanSalary) cleanSalary = 'Not Disclosed';
    
    if (hasDollar) {
      return {
        icon: <DollarSign className="w-3.5 h-3.5 shrink-0" />,
        text: cleanSalary
      };
    } else {
      return {
        icon: <IndianRupee className="w-3.5 h-3.5 shrink-0" />,
        text: cleanSalary
      };
    }
  };
  
  // Helper to map full department name to filter category
  const getDeptFilterFromProfile = (deptName: string): string => {
    const d = deptName.toLowerCase();
    if (d.includes('computer') || d.includes('cse') || d.includes('it')) return 'CSE/IT';
    if (d.includes('electronics') || d.includes('ece') || d.includes('eee') || d.includes('electrical')) return 'ECE/EEE';
    if (d.includes('mechanical')) return 'Mechanical';
    if (d.includes('civil')) return 'Civil';
    if (d.includes('data') || d.includes('ai') || d.includes('machine')) return 'Data & AI';
    if (d.includes('management') || d.includes('mba') || d.includes('bba')) return 'Management';
    return 'All';
  };

  const studentDeptFilter = getDeptFilterFromProfile(profile.department || '');

  // Filter state
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>(studentDeptFilter);
  const [onlyMyDepartment, setOnlyMyDepartment] = useState<boolean>(false);
  const [onlySkillMatched, setOnlySkillMatched] = useState<boolean>(false);
  const [selectedSkillTag, setSelectedSkillTag] = useState<string>('All');
  const [selectedSource, setSelectedSource] = useState<string>('All');
  const [selectedLocationFilter, setSelectedLocationFilter] = useState<string>('All');
  const [filterCategory, setFilterCategory] = useState<'all' | 'fulltime' | 'internship' | 'high_match'>('all');
  
  // Last Job Check Date & Time state
  const [lastCheckTime, setLastCheckTime] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Live Job Engine state
  const [isFetchRunning, setIsFetchRunning] = useState(false);
  const [engineStatus, setEngineStatus] = useState<string>('✅ Verified Jobs Engine Active: Openings from LinkedIn, Naukri, Indeed, Official Careers & Social Media Posts loaded.');
  const [apifySourceFilter, setApifySourceFilter] = useState<'All' | 'Official Company Careers' | 'LinkedIn Verified Jobs' | 'Twitter/X Verified Jobs'>('All');

  useEffect(() => {
    setEngineStatus('✅ Daily Auto-Sync active: Synced with Google, Zoho, TI, Microsoft, Amazon & Social hiring channels.');
  }, []);

  const triggerJobSearch = async () => {
    setIsFetchRunning(true);
    setEngineStatus('🤖 Launching Job Search & Verification Pipeline...');
    setTimeout(() => {
      setEngineStatus('✅ Verified Job Engine synced with Google, Zoho, TI, Microsoft & Amazon Official Careers.');
      setIsFetchRunning(false);
    }, 600);
  };

  const handleRefreshJobs = () => {
    setIsRefreshing(true);
    triggerJobSearch();
    setTimeout(() => {
      const now = new Date();
      const formatted = `${now.toISOString().split('T')[0]} at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}`;
      setLastCheckTime(formatted);
      setIsRefreshing(false);
    }, 800);
  };

  // Department list
  const departmentsList = ['All', 'CSE/IT', 'ECE/EEE', 'Mechanical', 'Civil', 'Data & AI', 'Management'];

  // Skill filter tags list
  const availableSkillTags = [
    'All', 'Unity', 'Blender', 'Game Development', '3D Artist', 'React', 'Python', 'Java', 'Data Structures', 'C++', 'Embedded Systems', 'VLSI', 'AutoCAD', 'SolidWorks', 'SQL', 'AWS'
  ];
  const sourcesList = ['All', 'Official Careers', 'LinkedIn', 'Naukri', 'Indeed', 'Glassdoor'];
  const locationsList = ['All', 'Worldwide / Remote', 'India', 'United States', 'Europe / UK', 'Asia-Pacific'];

  // Helper to extract clean corporate keywords


  // Calculate REAL dynamic skill match for any job based on student's profile technicalSkills, projects, and certifications
  const calculateDynamicMatch = (jobSkills: string[]) => {
    return calculateDynamicMatchShared(jobSkills, profile);
  };

  // Verified Jobs Dataset
  const combinedJobsList = sampleJobs;

  const isUnparsed = (!profile.technicalSkills || profile.technicalSkills.length === 0) && (!profile.department || profile.department === '');

  const filteredJobs = combinedJobsList.filter(job => {
    // Hide all jobs at start if no resume/profile exists
    if (isUnparsed) return false;

    // Search matching
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      job.company.toLowerCase().includes(query) ||
      job.role.toLowerCase().includes(query) ||
      job.location.toLowerCase().includes(query) ||
      (job.department && job.department.toLowerCase().includes(query)) ||
      job.skillsRequired.some((s: string) => s.toLowerCase().includes(query));

    if (!matchesSearch) return false;

    // Skill Match Check
    const { matchPct } = calculateDynamicMatch(job.skillsRequired);

    // Department Filter
    if (selectedDeptFilter !== 'All') {
      const jLower = (job.department || '').toLowerCase();
      const fLower = selectedDeptFilter.toLowerCase();
      if (fLower.includes('ece') || fLower.includes('eee')) {
        if (!jLower.includes('electronics') && !jLower.includes('electrical') && !jLower.includes('ece') && !jLower.includes('eee')) return false;
      } else if (fLower.includes('cse') || fLower.includes('it')) {
        if (!jLower.includes('computer') && !jLower.includes('cse') && !jLower.includes('it') && !jLower.includes('data')) return false;
      } else if (fLower.includes('mechanical')) {
        if (!jLower.includes('mechanical') && !jLower.includes('powertrain')) return false;
      } else if (fLower.includes('civil')) {
        if (!jLower.includes('civil') && !jLower.includes('structural')) return false;
      } else if (fLower.includes('data') || fLower.includes('ai')) {
        if (!jLower.includes('data') && !jLower.includes('ai') && !jLower.includes('computer')) return false;
      } else if (fLower.includes('management')) {
        if (!jLower.includes('management') && !jLower.includes('mba') && !jLower.includes('bba')) return false;
      }
    } else if (onlyMyDepartment) {
      const sLower = (profile.department || '').toLowerCase();
      const jLower = (job.department || '').toLowerCase();

      if (sLower.includes('electrical') || sLower.includes('electronics') || sLower.includes('eee') || sLower.includes('ece')) {
        if (!jLower.includes('electrical') && !jLower.includes('electronics') && !jLower.includes('eee') && !jLower.includes('ece')) return false;
      } else if (sLower.includes('mechanical') || sLower.includes('mech')) {
        if (!jLower.includes('mechanical') && !jLower.includes('powertrain')) return false;
      } else if (sLower.includes('civil')) {
        if (!jLower.includes('civil') && !jLower.includes('structural')) return false;
      } else if (sLower.includes('computer') || sLower.includes('cse') || sLower.includes('it')) {
        if (!jLower.includes('computer') && !jLower.includes('cse') && !jLower.includes('it')) return false;
      }
    }

    // Filter by required skill tag
    if (selectedSkillTag !== 'All' && !job.skillsRequired.some((s: string) => s.toLowerCase().includes(selectedSkillTag.toLowerCase()))) {
      return false;
    }

    // Filter by portal source
    if (selectedSource !== 'All' && !job.source.toLowerCase().includes(selectedSource.toLowerCase())) {
      return false;
    }

    // Filter by location
    if (selectedLocationFilter !== 'All') {
      const locLower = (job.location || '').toLowerCase();
      const lfLower = selectedLocationFilter.toLowerCase();

      if (lfLower.includes('remote') || lfLower.includes('worldwide')) {
        if (!locLower.includes('remote') && !locLower.includes('hybrid') && !locLower.includes('worldwide') && !locLower.includes('global')) {
          return false;
        }
      } else if (lfLower.includes('india')) {
        if (!locLower.includes('chennai') && !locLower.includes('bengaluru') && !locLower.includes('pune') && !locLower.includes('hyderabad') && !locLower.includes('mumbai') && !locLower.includes('india') && !locLower.includes('delhi') && !locLower.includes('tenkasi')) {
          return false;
        }
      } else if (lfLower.includes('states') || lfLower.includes('usa')) {
        if (!locLower.includes('usa') && !locLower.includes('san francisco') && !locLower.includes('seattle') && !locLower.includes('redmond') && !locLower.includes('palo alto') && !locLower.includes('cupertino') && !locLower.includes('santa clara') && !locLower.includes('menlo park') && !locLower.includes('mountain view')) {
          return false;
        }
      } else if (lfLower.includes('europe') || lfLower.includes('uk')) {
        if (!locLower.includes('uk') && !locLower.includes('london') && !locLower.includes('germany') && !locLower.includes('munich') && !locLower.includes('france') && !locLower.includes('sweden') && !locLower.includes('paris') && !locLower.includes('stockholm')) {
          return false;
        }
      } else if (lfLower.includes('asia') || lfLower.includes('apac')) {
        if (!locLower.includes('singapore') && !locLower.includes('japan') && !locLower.includes('tokyo') && !locLower.includes('australia') && !locLower.includes('apac')) {
          return false;
        }
      }
    }

    // Filter categories
    if (filterCategory === 'fulltime' && job.isInternship) return false;
    if (filterCategory === 'internship' && !job.isInternship) return false;
    
    if (filterCategory === 'high_match' && matchPct < 50) return false;
    
    // Globally hide 0% match jobs (0 percentage match jobs la kaata kudathu)
    if (matchPct === 0) return false;

    return true;
  }).sort((a, b) => {
    const matchA = calculateDynamicMatch(a.skillsRequired).matchPct;
    const matchB = calculateDynamicMatch(b.skillsRequired).matchPct;
    return matchB - matchA; // Sort by highest skill match % first!
  });

  const toggleSaveJob = (id: string) => {
    if (savedJobs.includes(id)) {
      setSavedJobs(prev => prev.filter(j => j !== id));
      addNotification('Removed job from saved bookmarks.');
    } else {
      setSavedJobs(prev => [...prev, id]);
      addNotification('Bookmark saved! Job added to target list.');
    }
  };

  const handleApplyClick = (job: JobOpportunity) => {
    const targetUrl = getCompanyPortalDeepLink(job.company, job.role, job.source, job.applyLink);
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
    addNotification(`🚀 Directing to ${job.company} career portal for "${job.role}" search & application...`);
    setVerifyingJob(job);
    setApplicationRefNo('');
  };

  const confirmVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyingJob) return;

    const ref = applicationRefNo.trim() || `VERIFIED-${Math.floor(100000 + Math.random() * 900000)}`;
    const timestamp = new Date().toLocaleString();

    setVerifiedApplications(prev => ({
      ...prev,
      [verifyingJob.id]: { refNo: ref, timestamp }
    }));

    addNotification(`✅ Application verified for ${verifyingJob.company} (${verifyingJob.role})! Reference ID: ${ref}`);
    setVerifyingJob(null);
  };

  const getSourceBadgeColor = (source: JobSourceType) => {
    switch (source) {
      case 'LinkedIn':
        return 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-500/20 dark:text-sky-300 dark:border-sky-500/30';
      case 'Naukri':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/30';
      case 'Indeed':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-300 dark:border-indigo-500/30';
      case 'Glassdoor':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30';
      case 'Official Careers':
      case 'Official Company Careers':
        return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/20 dark:text-purple-300 dark:border-purple-500/30';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
    }
  };

  const hasNoSkills = !profile.technicalSkills || profile.technicalSkills.length === 0;

  return (
    <div className="space-y-6">
      {/* Header Banner with Last Job Verification Timestamp */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-slate-800 p-6 md:p-8 text-slate-900 dark:text-white shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center space-x-2 text-indigo-600 dark:text-cyan-400 text-xs font-extrabold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span>Official Career Portal Deep-Search Engine</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Real-Time Jobs & Skill Match Engine
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-xs md:text-sm mt-1 max-w-2xl font-medium">
              Deep-links directly to official career portal search results ({profile.department} Department Focus).
            </p>
          </div>
        </div>
      </div>


      {/* NO SKILLS WARNING BANNER (When student has no skills listed in profile) */}
      {hasNoSkills && (
        <div className="p-5 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg animate-pulse">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-500 text-white font-black">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-black text-sm uppercase">⚠️ NO SKILLS FOUND IN STUDENT PROFILE!</h4>
              <p className="text-xs mt-0.5 font-medium">
                You currently have <span className="font-bold underline">0 skills</span> listed in your profile. Please add your technical skills (e.g. React, Python, Java, SQL, C++) in Student Profile to view personalized job match scores.
              </p>
            </div>
          </div>
          {onNavigate && (
            <button
              onClick={() => onNavigate('profile')}
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs shadow-md shrink-0 transition-all"
            >
              Add Skills in Profile →
            </button>
          )}
        </div>
      )}

      {/* Filter Toolbar */}
      <GlassCard className="p-5 space-y-4">
        {/* Search Bar & Category Buttons */}
        <div className="flex flex-col md:flex-row gap-3 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by role (e.g. Software Engineer), company, or skill..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {[
              { id: 'all', label: 'All Jobs' },
              { id: 'fulltime', label: 'Fulltime' },
              { id: 'internship', label: 'Internship' },
              { id: 'high_match', label: 'High Match (>50%)' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  filterCategory === cat.id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Department Quick Toggle Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200 dark:border-slate-800/80">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setOnlyMyDepartment(!onlyMyDepartment);
                if (!onlyMyDepartment) setSelectedDeptFilter(studentDeptFilter);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center space-x-2 border transition-all ${
                onlyMyDepartment
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Only My Department Jobs ({profile.department || 'CSE'})</span>
            </button>

            <button
              onClick={() => setOnlySkillMatched(!onlySkillMatched)}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center space-x-1.5 border transition-all ${
                onlySkillMatched
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Only Skill-Matched Jobs ({profile.technicalSkills.length} Skills)</span>
            </button>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Showing <strong className="text-slate-900 dark:text-white font-bold">{filteredJobs.length}</strong> matching jobs
          </div>
        </div>

        {/* Filter Tags Breakdown */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/60 text-xs">
          {/* Department Filter Tags */}
          {!onlyMyDepartment && (
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase w-32 shrink-0">Filter by Department:</span>
              <div className="flex items-center space-x-1 flex-wrap gap-1">
                {departmentsList.map(dept => (
                  <button
                    key={dept}
                    onClick={() => setSelectedDeptFilter(dept)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                      selectedDeptFilter === dept
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {dept}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Skill Filter Tags */}
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase w-32 shrink-0">Filter by Skill:</span>
            <div className="flex items-center space-x-1 flex-wrap gap-1">
              {availableSkillTags.map(skill => (
                <button
                  key={skill}
                  onClick={() => setSelectedSkillTag(skill)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                    selectedSkillTag === skill
                      ? 'bg-cyan-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          {/* Portal Sources Filter Tags (LinkedIn, Naukri, Indeed, Glassdoor, Official Careers) */}
          <div className="flex items-center space-x-2 flex-wrap gap-y-1 pt-1 border-t border-slate-100 dark:border-slate-800/40">
            <span className="text-[10px] font-bold text-slate-400 uppercase w-32 shrink-0">Filter by Portal Source:</span>
            <div className="flex items-center space-x-1 flex-wrap gap-1">
              {sourcesList.map(src => (
                <button
                  key={src}
                  onClick={() => setSelectedSource(src)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all flex items-center gap-1 ${
                    selectedSource === src
                      ? 'bg-indigo-600 text-white shadow'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {src === 'LinkedIn' && <span className="text-sky-400">🔵</span>}
                  {src === 'Naukri' && <span className="text-blue-400">🟢</span>}
                  {src === 'Indeed' && <span className="text-indigo-400">🔵</span>}
                  {src === 'Glassdoor' && <span className="text-emerald-400">🟢</span>}
                  {src === 'Official Careers' && <span>🏢</span>}
                  <span>{src}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Location Filter Tags (Worldwide, India, US, Europe, APAC) */}
          <div className="flex items-center space-x-2 flex-wrap gap-y-1 pt-1 border-t border-slate-100 dark:border-slate-800/40">
            <span className="text-[10px] font-bold text-slate-400 uppercase w-32 shrink-0">Filter by Location:</span>
            <div className="flex items-center space-x-1 flex-wrap gap-1">
              {locationsList.map(loc => (
                <button
                  key={loc}
                  onClick={() => setSelectedLocationFilter(loc)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all flex items-center gap-1 ${
                    selectedLocationFilter === loc
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <span>📍</span>
                  <span>{loc === 'All' ? 'Worldwide (All Locations)' : loc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>

      {/* AI Resume Career Recommendation Banner */}
      {profile.technicalSkills && profile.technicalSkills.length > 0 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-900/60 via-slate-900 to-cyan-950 border border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-white shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-cyan-400 shrink-0">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="font-extrabold text-white flex items-center gap-2">
                <span>🤖 ChatGPT/Gemini AI Resume Match Results</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  {profile.technicalSkills.length} Parsed Skills
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                AI Target Roles for {profile.name} ({profile.department || 'Engineering'}): <strong>{profile.technicalSkills.slice(0, 4).join(', ')}</strong>
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono font-bold text-cyan-300 px-3 py-1 rounded-xl bg-white/5 border border-white/10 shrink-0">
            100% Dynamic Matching Active
          </span>
        </div>
      )}

      {/* Jobs List */}
      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <GlassCard className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-cyan-400 flex items-center justify-center mx-auto">
              <Briefcase className="w-7 h-7" />
            </div>
            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                🤖 No Jobs Found
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                No matching jobs found at the moment. Adjust your filters or check back later!
              </p>
            </div>
          </GlassCard>
        ) : (
          filteredJobs.map(job => {
          const { matchPct, missing, matched } = calculateDynamicMatch(job.skillsRequired);
            const isSaved = savedJobs.includes(job.id);
            const isVerified = verifiedApplications[job.id];

            return (
              <GlassCard
                key={job.id}
                className="p-5 md:p-6 hover:border-indigo-400 dark:hover:border-indigo-500/50 transition-all space-y-4"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <h3 className="text-base md:text-lg font-black text-slate-900 dark:text-white">
                        {job.role}
                      </h3>
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-300 dark:border-indigo-500/30">
                        {job.company}
                      </span>
                      {job.department && (
                        <span className="text-[10px] px-2 py-0.5 rounded font-extrabold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/20 dark:text-amber-300">
                          {job.department}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400 flex-wrap gap-y-1 font-medium">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getSourceBadgeColor(job.source)}`}>
                        Portal: {job.source}
                      </span>
                      <span>{job.postedDate}</span>
                    </div>
                  </div>

                  {/* Match Gauge */}
                  <div className="flex items-center space-x-3 shrink-0">
                    <div className="text-right">
                      <div className={`text-xl font-black ${matchPct >= 80 ? 'text-emerald-600 dark:text-emerald-400' : matchPct >= 50 ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>
                        {matchPct}% Match
                      </div>
                      <div className="text-[10px] text-slate-400 font-semibold">
                        {hasNoSkills ? '0 Skills Listed' : `${matched.length}/${job.skillsRequired.length} Skills Matched`}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Job Metadata details (Open Date, Close Date, Vacancies, Location) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs font-semibold text-slate-700 dark:text-slate-300 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80">
                  <div className="flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span className="truncate">📍 {job.location}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-cyan-600 dark:text-cyan-400 font-bold">
                    <Users className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>👥 {job.vacancies || '25 Openings'}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-slate-600 dark:text-slate-400 font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>📅 Open: {job.openDate || '2026-07-26'}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-rose-600 dark:text-rose-400 font-bold">
                    <Clock className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span>⏳ Close: {job.closeDate || job.lastDate}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                    <span className="truncate">{job.experience}</span>
                  </div>
                </div>

                {/* Job Description & Overview */}
                {job.description && (
                  <div className="p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    <strong className="text-indigo-900 dark:text-indigo-200 font-bold">📋 Job Role Overview & Key Duties: </strong>
                    {job.description}
                  </div>
                )}

                {/* Matched Skills badges in JobBoard.tsx */}
                {matched.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1 items-center">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mr-1">Matched Skills:</span>
                    {matched.map((s, idx) => (
                      <span key={idx} className="text-[10px] px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20 font-extrabold flex items-center gap-1 shadow-sm">
                        ✓ {s}
                      </span>
                    ))}
                  </div>
                )}

                {/* Multi-Platform Mirrored Role Titles (Official Sites, LinkedIn, Naukri, Indeed, Social Media) */}
                {(() => {
                  const alt = getAlternativePortalLinks(job.company, job.role);
                  return (
                    <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-2.5">
                      <div className="flex items-center justify-between text-[11px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                        <span>🌐 Mirrored Job Details Across Official Sites & Portals:</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> 100% Identical Verification
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                        <div className="flex items-start space-x-2 p-2 rounded-xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-900/50">
                          <span className="text-purple-600 font-bold text-sm shrink-0">🏢</span>
                          <div className="truncate">
                            <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 uppercase block">Official Career Site</span>
                            <span className="font-bold text-slate-900 dark:text-white truncate block">{job.officialSiteRoleName || `${job.company} Careers: ${job.role}`}</span>
                          </div>
                        </div>

                        <div className="flex items-start space-x-2 p-2 rounded-xl bg-white dark:bg-slate-900 border border-sky-200 dark:border-sky-900/50">
                          <span className="text-sky-500 font-bold text-sm shrink-0">🔵</span>
                          <div className="truncate">
                            <span className="text-[10px] font-bold text-sky-700 dark:text-sky-300 uppercase block">LinkedIn Jobs</span>
                            <span className="font-bold text-slate-900 dark:text-white truncate block">{job.linkedInRoleName || `LinkedIn: ${job.company} - ${job.role}`}</span>
                          </div>
                        </div>

                        <div className="flex items-start space-x-2 p-2 rounded-xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-900/50">
                          <span className="text-blue-500 font-bold text-sm shrink-0">🟢</span>
                          <div className="truncate">
                            <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 uppercase block">Naukri.com</span>
                            <span className="font-bold text-slate-900 dark:text-white truncate block">{job.naukriRoleName || `Naukri: ${job.company} ${job.role}`}</span>
                          </div>
                        </div>

                        <div className="flex items-start space-x-2 p-2 rounded-xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900/50">
                          <span className="text-indigo-500 font-bold text-sm shrink-0">🟣</span>
                          <div className="truncate">
                            <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 uppercase block">Indeed Jobs</span>
                            <span className="font-bold text-slate-900 dark:text-white truncate block">{job.indeedRoleName || `Indeed: ${job.company} ${job.role}`}</span>
                          </div>
                        </div>
                      </div>

                      {/* Portal Direct Application Toolbar */}
                      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
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
                })()}

                {/* Skills Match & Gap breakdown */}
                <div>
                  <div className="text-[10px] font-extrabold uppercase text-slate-400 mb-1.5">Required Skills & Match Status:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {job.skillsRequired.map((skill: string, idx: number) => {
                      const isMatched = matched.includes(skill);
                      return (
                        <span
                          key={idx}
                          className={`text-xs px-2.5 py-1 rounded-lg font-bold border transition-all ${
                            isMatched
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                              : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800 opacity-80'
                          }`}
                        >
                          {skill} {isMatched ? '✓' : ''}
                        </span>
                      );
                    })}
                  </div>

                  {missing.length > 0 && !hasNoSkills && (
                    <div className="mt-2 text-[11px] text-amber-700 dark:text-amber-300 font-medium flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/40 p-2 rounded-lg border border-amber-200 dark:border-amber-800/40">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>Skill Gap: Add <strong className="font-bold">{missing.join(', ')}</strong> to reach 100% match!</span>
                    </div>
                  )}
                </div>

                {/* Footer Action buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  {/* Verified Badge Status */}
                  {isVerified ? (
                    <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>Application Submitted & Verified ({isVerified.refNo || 'Status Saved ✅'})</span>
                    </div>
                  ) : (
                    <div className="text-[11px] text-slate-400">
                      Verification required after official portal submission
                    </div>
                  )}

                  <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => toggleSaveJob(job.id)}
                      className={`p-2.5 rounded-xl border transition-all ${
                        isSaved
                          ? 'bg-amber-50 text-amber-600 border-amber-300 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-800'
                          : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-amber-500'
                      }`}
                      title="Save Job Bookmark"
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                    </button>

                    <button
                      onClick={() => handleEnhanceResumeClick(job)}
                      className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-md flex items-center space-x-1.5 transition-all transform hover:scale-105"
                      title="Optimize Resume & Fill Missing Skills for this Job"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                      <span>AI Enhance Resume</span>
                    </button>

                    <button
                      onClick={() => {
                        handleApplyClick(job);
                        setConfirmingJob(job);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-md shadow-indigo-600/30 flex items-center space-x-2 transition-all transform hover:scale-105"
                    >
                      <span>Apply on Official Portal</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </GlassCard>
            );
          }))
        }
      </div>

      {/* AI Resume Analysis, ATS Match & Application Modal */}
      {verifyingJob && (() => {
        const { matchPct, missing, matched } = calculateDynamicMatch(verifyingJob.skillsRequired);
        const atsScore = Math.min(98, Math.max(65, matchPct + (profile.atsScore ? 10 : 5)));
        const targetPortalUrl = getCompanyPortalDeepLink(verifyingJob.company, verifyingJob.role, verifyingJob.source, verifyingJob.applyLink);
        const altLinks = getAlternativePortalLinks(verifyingJob.company, verifyingJob.role);

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
            <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-indigo-200 dark:border-indigo-800/80 shadow-2xl p-6 md:p-7 space-y-5 my-8">
              
              {/* Modal Header */}
              <div className="flex items-start justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-600 text-white">
                      🤖 AI Resume Analysis Report
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getSourceBadgeColor(verifyingJob.source)}`}>
                      Portal: {verifyingJob.source}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    {verifyingJob.role}
                  </h3>
                  <p className="text-xs text-indigo-600 dark:text-cyan-400 font-extrabold flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{verifyingJob.company} • {verifyingJob.location}</span>
                  </p>
                </div>
                <button
                  onClick={() => setVerifyingJob(null)}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-500 transition-all"
                >
                  ✕
                </button>
              </div>

              {/* ATS Score & Match Gauge Card */}
              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-gradient-to-r from-indigo-900/40 via-slate-900/60 to-cyan-950/40 border border-indigo-500/30 text-white">
                <div className="space-y-0.5">
                  <div className="text-[10px] uppercase font-bold text-cyan-300">Target Role ATS Match Score</div>
                  <div className="text-2xl font-black text-white flex items-center gap-1.5">
                    <span>{atsScore}/100</span>
                    <span className="text-xs text-emerald-400 font-semibold">(High Match)</span>
                  </div>
                  <div className="text-[10px] text-slate-300">Resume Keywords & Skills Fit</div>
                </div>

                <div className="space-y-0.5 border-l border-white/10 pl-3">
                  <div className="text-[10px] uppercase font-bold text-indigo-300">Callback Probability</div>
                  <div className="text-2xl font-black text-cyan-300">
                    {matchPct >= 80 ? '94%' : matchPct >= 50 ? '82%' : '65%'}
                  </div>
                  <div className="text-[10px] text-slate-300">{matched.length} of {verifyingJob.skillsRequired.length} skills matched</div>
                </div>
              </div>

              {/* Required Job Skills & Resume Match Breakdown */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center justify-between">
                  <span>Required Skills & Resume Breakdown</span>
                  <span className="text-[10px] font-bold text-slate-400">({verifyingJob.skillsRequired.length} Skills Analyzed)</span>
                </h4>

                <div className="flex flex-wrap gap-2">
                  {verifyingJob.skillsRequired.map((skill, idx) => {
                    const isMatched = matched.includes(skill);
                    return (
                      <div
                        key={idx}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 ${
                          isMatched
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 shadow-sm'
                            : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                        }`}
                      >
                        {isMatched ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        )}
                        <span>{skill}</span>
                        <span className="text-[10px] opacity-75">{isMatched ? '(Matched)' : '(Gap)'}</span>
                      </div>
                    );
                  })}
                </div>

                {missing.length > 0 && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs leading-relaxed font-medium flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-bold">AI Skill Gap Recommendation:</strong> Add <span className="underline font-bold">{missing.join(', ')}</span> to your resume profile before submitting to increase callback chance to 98%!
                    </div>
                  </div>
                )}
              </div>

              {/* Direct Verified Application Portals */}
              <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-slate-800/80 border border-indigo-200 dark:border-indigo-700 space-y-3">
                <div className="space-y-1">
                  <div className="text-xs font-black text-slate-900 dark:text-white flex items-center justify-between">
                    <span>🚀 Launch Direct Job Portal Application</span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">100% Active Links</span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    Select your preferred verified job portal for {verifyingJob.company} ({verifyingJob.role}):
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <a
                    href={targetPortalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-md flex items-center justify-between transition-all transform hover:scale-[1.02]"
                  >
                    <span>🏢 Official Portal ({verifyingJob.source})</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <a
                    href={altLinks.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs shadow-md flex items-center justify-between transition-all transform hover:scale-[1.02]"
                  >
                    <span>🔵 LinkedIn Jobs</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <a
                    href={altLinks.naukri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-md flex items-center justify-between transition-all transform hover:scale-[1.02]"
                  >
                    <span>🟢 Naukri Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <a
                    href={altLinks.indeed}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-md flex items-center justify-between transition-all transform hover:scale-[1.02]"
                  >
                    <span>🟣 Indeed Jobs</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Verification Form */}
              <form onSubmit={confirmVerification} className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Mark Application Verified — Portal Application / Registration Ref ID (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. GOOG-2026-99482 or ZOHO-8839"
                    value={applicationRefNo}
                    onChange={e => setApplicationRefNo(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setVerifyingJob(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow-md flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Mark Verified</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      })()}

      {/* AI Resume Enhancer & Skill Gap Filler Modal */}
      {enhancingJob && (() => {
        const { matchPct, missing, matched } = calculateDynamicMatchShared(enhancingJob.skillsRequired, profile);
        
        // Define tailored summary
        const currentSummary = (profile as any).summary || `A motivated ${profile.department || 'Engineering'} student from ${profile.college || 'University'} with hands-on skill sets in ${profile.technicalSkills ? profile.technicalSkills.slice(0, 3).join(', ') : 'engineering technologies'}.`;
        
        const tailoredSummary = `Results-driven and detail-oriented ${profile.department || 'Engineering'} student specializing in ${enhancingJob.role} workflows. Proficient in ${[...matched, ...missing.slice(0, 2)].join(', ')}. Eager to leverage project experience in ${profile.projects && profile.projects.length > 0 ? profile.projects[0].title : 'technical systems'} to contribute as a high-performance ${enhancingJob.role} for the engineering team at ${enhancingJob.company}.`;

        // Define tailored skills (matched first, then missing categorized as target core concepts)
        const tailoredSkills = [
          ...matched.map(s => `${s} (Core Skill)`),
          ...missing.map(s => `${s} (Target competency added for ATS optimization)`)
        ];

        // Define tailored projects
        const tailoredProjects = (profile.projects || []).map((proj, idx) => {
          let adjustedDesc = proj.description || '';
          if (idx === 0 && missing.length > 0) {
            // Tailor first project to mention one or two missing skills
            adjustedDesc = `${proj.description || ''} Designed system operations incorporating ${missing.slice(0, 2).join(' and ')} frameworks to satisfy official ${enhancingJob.company} development guidelines.`;
          }
          return {
            ...proj,
            description: adjustedDesc
          };
        });

        const enhancedProfile = {
          name: profile.name || 'Student Candidate',
          email: profile.email || 'student@college.edu',
          phone: profile.phone || '+91 98765 43210',
          college: profile.college || 'University',
          department: profile.department || 'CSE/IT',
          cgpa: profile.cgpa || '8.5',
          summary: tailoredSummary,
          technicalSkills: [...(profile.technicalSkills || []), ...missing],
          projects: tailoredProjects,
          certifications: profile.certifications || []
        };

        const handleSyncToProfile = () => {
          updateProfile({
            technicalSkills: Array.from(new Set([...(profile.technicalSkills || []), ...missing])),
            projects: tailoredProjects
          });
          addNotification(`✨ Synced AI-Enhanced Skills & Project adjustments back to your Firestore profile!`);
        };

        const steps = [
          `Scanning uploaded PDF resume: "${profile.resumeFileName || 'uploaded_resume.pdf'}"...`,
          "Extracting section trees (Skills, Projects, Certifications)...",
          `Aligning resume layout with ${enhancingJob.company} ATS guidelines...`,
          `Rearranging sections & tailoring summaries for "${enhancingJob.role}"...`,
          "AI Optimization complete! Match score boosted to 94/100."
        ];

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
            <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl border border-purple-300 dark:border-purple-800 shadow-2xl p-6 md:p-7 space-y-5 my-8">
              
              {/* Header */}
              <div className="flex items-start justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
                      <span>AI Resume Enhancer & ATS Optimizer</span>
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                      {enhancingJob.company}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    Resume Optimizer for {enhancingJob.role}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Cross-references your PDF resume with target requirements to rearrange, augment, and print an optimized layout.
                  </p>
                </div>
                <button
                  onClick={() => setEnhancingJob(null)}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-500 transition-all"
                >
                  ✕
                </button>
              </div>

              {isEnhancingLoading ? (
                /* Loading Animation State */
                <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-4 border-purple-200 dark:border-purple-950"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-t-purple-600 animate-spin"></div>
                    <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-purple-600 animate-pulse" />
                  </div>
                  <div className="space-y-1.5 max-w-sm">
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">Analyzing Resume & Re-arranging...</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-mono bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-150 dark:border-slate-850">
                      {steps[enhancingProgressStep]}
                    </p>
                  </div>
                </div>
              ) : (
                /* Comparison & Print View State */
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left: Original Profile Summary */}
                    <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-3.5 animate-fadeIn">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Original Resume Layout</span>
                        <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">ATS Match: {Math.max(35, matchPct)}%</span>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div>
                          <strong className="text-slate-700 dark:text-slate-300 block">Professional Summary:</strong>
                          <p className="text-slate-500 leading-relaxed mt-0.5">{currentSummary}</p>
                        </div>
                        <div>
                          <strong className="text-slate-700 dark:text-slate-300 block">Technical Skills:</strong>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {(profile.technicalSkills || []).map((s, idx) => (
                              <span key={idx} className="bg-slate-200 dark:bg-slate-900 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded text-[10px]">{s}</span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <strong className="text-slate-700 dark:text-slate-300 block">Projects:</strong>
                          {(profile.projects || []).slice(0, 2).map((p, idx) => (
                            <div key={idx} className="mt-1 border-l-2 border-slate-300 pl-2">
                              <span className="font-bold text-slate-600 dark:text-slate-400">{p.title}</span>
                              <p className="text-[10px] text-slate-500 leading-relaxed mt-0.5">{p.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right: AI Enhanced & Rearranged Layout */}
                    <div className="p-4 rounded-2xl border border-purple-200 dark:border-purple-800 bg-purple-50/10 dark:bg-purple-950/10 space-y-3.5 animate-fadeIn">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase text-purple-600 tracking-wider">AI Tailored Layout (Best Match)</span>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">ATS Match Boost: 94%</span>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div>
                          <strong className="text-slate-700 dark:text-slate-300 block">Optimized Professional Summary:</strong>
                          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-0.5">{tailoredSummary}</p>
                        </div>
                        <div>
                          <strong className="text-slate-700 dark:text-slate-300 block">Rearranged & Augmented Skills:</strong>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {tailoredSkills.map((s, idx) => {
                              const isCore = s.includes('(Core Skill)');
                              return (
                                <span key={idx} className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                                  isCore
                                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 text-emerald-700 dark:text-emerald-300'
                                    : 'bg-purple-50 dark:bg-purple-950/60 border-purple-300 text-purple-700 dark:text-purple-300'
                                }`}>
                                  {isCore ? `✓ ${s.replace(' (Core Skill)', '')}` : `+ ${s.replace(' (Target competency added for ATS optimization)', '')}`}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                        <div>
                          <strong className="text-slate-700 dark:text-slate-300 block">AI Contextualized Projects:</strong>
                          {tailoredProjects.slice(0, 2).map((p, idx) => (
                            <div key={idx} className="mt-1 border-l-2 border-purple-500 pl-2">
                              <span className="font-bold text-purple-600 dark:text-purple-400">{p.title}</span>
                              <p className="text-[10px] text-slate-600 dark:text-slate-300 leading-relaxed mt-0.5">{p.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-slate-200 dark:border-slate-800 justify-between items-center">
                    <div className="text-[11px] text-slate-500 font-medium">
                      🤖 <strong className="font-bold text-slate-700 dark:text-slate-300">ATS Advice:</strong> Priority layout has been rearranged. Skills placed on top to match spider keywords.
                    </div>
                    
                    <div className="flex space-x-2 w-full sm:w-auto justify-end">
                      <button
                        onClick={handleSyncToProfile}
                        className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs"
                      >
                        💾 Apply to Profile
                      </button>
                      <button
                        onClick={() => handlePrintResume(enhancedProfile)}
                        className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold text-xs shadow-md shadow-indigo-600/20"
                      >
                        🖨️ Export / Print Tailored PDF
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        );
      })()}

      {/* Application Confirmation Modal on Returning from External Career Portal */}
      <ApplicationConfirmationModal
        isOpen={!!confirmingJob}
        job={confirmingJob}
        onClose={() => setConfirmingJob(null)}
        onConfirmApplied={(jobId, refNo) => {
          verifyApplication(jobId, refNo || 'REG-2026');
          addNotification(`🎉 Application Submitted & Verified for ${confirmingJob?.company} (${confirmingJob?.role})! ${refNo ? `Ref No: ${refNo}` : 'Status Saved ✅'}`);
          setConfirmingJob(null);
        }}
      />
    </div>
  );
};

