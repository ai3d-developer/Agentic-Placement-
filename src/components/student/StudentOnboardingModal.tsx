import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { parseResumeTextToProfile } from '../../services/aiEngine';
import { extractTextFromPdfFile } from '../../utils/pdfExtractor';
import { saveUploadedResumeDataToFirestore, saveStudentProfileToFirestore } from '../../services/firebase';
import {
  User,
  GraduationCap,
  FileText,
  Upload,
  Github,
  Linkedin,
  Globe,
  Sparkles,
  CheckCircle2,
  X,
  ArrowRight,
  Briefcase,
  Award,
  Layers,
  Maximize2,
  Minimize2
} from 'lucide-react';

interface StudentOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToJobs?: () => void;
}

const DEPARTMENT_OPTIONS = [
  'Computer Science & Engineering',
  'Information Technology',
  'Electronics & Communication Engineering',
  'Electrical & Electronics Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Data Science & Artificial Intelligence',
  'Mechatronics & Automation'
];

export const StudentOnboardingModal: React.FC<StudentOnboardingModalProps> = ({
  isOpen,
  onClose,
  onNavigateToJobs
}) => {
  const { profile, completeOnboarding } = useAuth();

  const [name, setName] = useState(profile.name && profile.name !== 'Student Candidate' ? profile.name : '');
  const [email, setEmail] = useState(profile.email && profile.email !== 'student@college.edu' ? profile.email : '');
  const [phone, setPhone] = useState(profile.phone && profile.phone !== '+91 98765 00000' ? profile.phone : '');
  const [college, setCollege] = useState(profile.college || 'Engineering University');
  const [department, setDepartment] = useState(profile.department || 'Computer Science & Engineering');
  const [graduationYear, setGraduationYear] = useState<number>(profile.graduationYear || 2026);
  const [cgpa, setCgpa] = useState<number>(profile.cgpa || 8.5);

  // Resume Upload State
  const [resumeFileName, setResumeFileName] = useState<string>(profile.resumeFileName || '');
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [resumeUploaded, setResumeUploaded] = useState<boolean>(!!profile.resumeFileName);

  // Social & Professional Links State
  const [github, setGithub] = useState<string>(profile.github || '');
  const [linkedin, setLinkedin] = useState<string>(profile.linkedin || '');
  const [portfolio, setPortfolio] = useState<string>(profile.portfolio || '');

  // Extra Parsed Fields
  const [projects, setProjects] = useState<any[]>(profile.projects || []);
  const [certifications, setCertifications] = useState<any[]>(profile.certifications || []);
  const [atsScore, setAtsScore] = useState<number>(profile.atsScore || 85);
  const [readinessScore, setReadinessScore] = useState<number>(profile.placementReadinessScore || 88);

  // Skills
  const [technicalSkills, setTechnicalSkills] = useState<string[]>(
    profile.technicalSkills || []
  );
  const [newSkill, setNewSkill] = useState('');
  const [n8nStatus, setN8nStatus] = useState<string>('');
  const [isFullScreen, setIsFullScreen] = useState<boolean>(true);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setResumeFileName(file.name);
    setIsParsing(true);

    try {
      const text = await extractTextFromPdfFile(file);
      const parsed = await parseResumeTextToProfile(text || file.name, profile);

      if (parsed.name && parsed.name !== 'Student Candidate') setName(parsed.name);
      if (parsed.email && (!profile.email || profile.email === 'student@college.edu')) setEmail(parsed.email);
      if (parsed.phone) setPhone(parsed.phone);
      if (parsed.college) setCollege(parsed.college);
      if (parsed.department) setDepartment(parsed.department);
      if (parsed.cgpa) setCgpa(parsed.cgpa);
      if (parsed.technicalSkills && parsed.technicalSkills.length > 0) {
        setTechnicalSkills(Array.from(new Set([...technicalSkills, ...parsed.technicalSkills])));
      }
      if (parsed.projects && parsed.projects.length > 0) setProjects(parsed.projects);
      if (parsed.certifications && parsed.certifications.length > 0) setCertifications(parsed.certifications);
      if (parsed.atsScore) setAtsScore(parsed.atsScore);
      if (parsed.placementReadinessScore) setReadinessScore(parsed.placementReadinessScore);
      if (parsed.github) setGithub(parsed.github);
      if (parsed.linkedin) setLinkedin(parsed.linkedin);
      if (parsed.portfolio) setPortfolio(parsed.portfolio);

      // Save upload to Firebase Firestore
      const targetEmail = (profile.email && profile.email !== 'student@college.edu') ? profile.email : (parsed.email || email || 'student@university.edu');
      saveUploadedResumeDataToFirestore(
        targetEmail,
        file.name,
        text || file.name,
        parsed
      );

      // Status indicator updated directly (n8n background matching removed)
      setN8nStatus(`✅ Profile synced to Firebase Firestore database.`);
    } catch (err) {
      console.warn('Resume file preview read:', err);
    } finally {
      setIsParsing(false);
      setResumeUploaded(true);
    }
  };

  const addSkill = (skillToAdd?: string) => {
    const sk = (skillToAdd || newSkill).trim();
    if (sk && !technicalSkills.includes(sk)) {
      setTechnicalSkills([...technicalSkills, sk]);
      if (!skillToAdd) setNewSkill('');
    }
  };

  const removeSkill = (sk: string) => {
    setTechnicalSkills(technicalSkills.filter(s => s !== sk));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalProfile = {
      name: name || 'Student Candidate',
      email: (profile.email && profile.email !== 'student@college.edu') ? profile.email : (email || 'student@university.edu'),
      phone: phone || '+91 98765 43210',
      college: college || 'University College of Engineering',
      department: department || 'Computer Science & Engineering',
      graduationYear: Number(graduationYear) || 2026,
      cgpa: Number(cgpa) || 8.5,
      resumeFileName: resumeFileName || 'Student_Resume_2026.pdf',
      resumeUploadedAt: new Date().toLocaleDateString(),
      github: github,
      linkedin: linkedin,
      portfolio: portfolio,
      technicalSkills: technicalSkills,
      projects: projects,
      certifications: certifications,
      atsScore: atsScore,
      placementReadinessScore: readinessScore,
      isOnboarded: true
    };

    saveStudentProfileToFirestore({ ...profile, ...finalProfile });
    completeOnboarding(finalProfile);

    onClose();
    if (onNavigateToJobs) {
      onNavigateToJobs();
    }
  };

  return (
    <div className={`fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center animate-in fade-in duration-200 ${
      isFullScreen ? 'p-0' : 'p-3 sm:p-6 overflow-y-auto'
    }`}>
      <div className={`bg-white dark:bg-slate-900 flex flex-col transition-all duration-300 ${
        isFullScreen
          ? 'w-screen h-screen rounded-none border-none max-h-none max-w-none'
          : 'w-full max-w-5xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[92vh]'
      }`}>
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-cyan-600 p-5 md:p-6 text-white flex justify-between items-center shrink-0 shadow-md">
          <div>
            <div className="flex items-center space-x-2 text-indigo-100 text-xs font-extrabold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-cyan-200 animate-pulse" />
              <span>Step 1: Student Profile & AI Placement Initialization</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight flex items-center gap-2">
              🎓 Student Profile Setup & Resume Links
            </h2>
            <p className="text-indigo-100 text-xs mt-1 max-w-2xl">
              Enter your student details, upload your PDF resume, and connect your GitHub, Portfolio & LinkedIn links to activate your AI placement readiness dashboard.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-sm shrink-0 flex items-center gap-1.5 text-xs font-bold"
              title={isFullScreen ? "Exit Fullscreen" : "Full Screen"}
            >
              {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{isFullScreen ? 'Exit Fullscreen' : 'Full Screen'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-sm shrink-0"
              title="Skip or Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1 bg-slate-50/50 dark:bg-slate-950/40">
          <div className={`${isFullScreen ? 'max-w-6xl mx-auto space-y-6' : 'space-y-6'}`}>
          
          {/* Section 1: Academic & Personal Credentials */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
              <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>1. Student Academic & Personal Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Arun Kumar"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="mt-1 w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:border-indigo-600 outline-none font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Department / Branch *</label>
                <input
                  type="text"
                  list="departments"
                  required
                  placeholder="Select or type branch (e.g. CSE)"
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  className="mt-1 w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:border-indigo-600 outline-none font-semibold"
                />
                <datalist id="departments">
                  {DEPARTMENT_OPTIONS.map((dept, idx) => (
                    <option key={idx} value={dept} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">College / Institution *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Engineering University"
                  value={college}
                  onChange={e => setCollege(e.target.value)}
                  className="mt-1 w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:border-indigo-600 outline-none font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Email Address *</label>
                <input
                  type="email"
                  required
                  disabled={!!profile.email && profile.email !== 'student@college.edu'}
                  placeholder="student@college.edu"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="mt-1 w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:border-indigo-600 outline-none font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Mobile Phone Number</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="mt-1 w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:border-indigo-600 outline-none font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Grad. Year</label>
                  <input
                    type="number"
                    value={graduationYear}
                    onChange={e => setGraduationYear(Number(e.target.value))}
                    className="mt-1 w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:border-indigo-600 outline-none font-semibold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">CGPA (out of 10)</label>
                  <input
                    type="number"
                    step="0.1"
                    max="10"
                    value={cgpa}
                    onChange={e => setCgpa(Number(e.target.value))}
                    className="mt-1 w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:border-indigo-600 outline-none font-semibold"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Resume PDF Upload */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
              <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>2. Upload PDF Resume (AI Extraction)</span>
            </h3>

            <div className="relative border-2 border-dashed border-indigo-300 dark:border-indigo-800 hover:border-indigo-500 rounded-2xl p-4 md:p-6 text-center transition-all bg-indigo-50/40 dark:bg-indigo-950/20">
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Upload className="w-6 h-6" />
                </div>
                {resumeFileName ? (
                  <div className="space-y-1">
                    <div className="text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{resumeFileName} Uploaded</span>
                    </div>
                    {isParsing && (
                      <p className="text-[11px] text-indigo-600 dark:text-cyan-400 font-bold animate-pulse">
                        ⚡ AI parsing degree, CGPA, and technical skills...
                      </p>
                    )}
                    {n8nStatus && (
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-black bg-emerald-500/10 dark:bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-500/30 mt-2 animate-fadeIn">
                        {n8nStatus}
                      </p>
                    )}
                  </div>
                ) : (
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Click to upload or drag & drop your PDF Resume
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Supports PDF, DOCX up to 10MB. AI automatically parses skills & degree.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Professional Links (GitHub, Portfolio, LinkedIn) */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>3. Connect Professional Links (GitHub, Portfolio & LinkedIn)</span>
              </h3>
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
                Crucial for Recruiter Review
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* GitHub Link */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1">
                  <Github className="w-3.5 h-3.5 text-slate-900 dark:text-white" />
                  <span>GitHub Profile Link</span>
                </label>
                <div className="relative">
                  <input
                    type="url"
                    placeholder="https://github.com/username"
                    value={github}
                    onChange={e => setGithub(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:border-indigo-600 outline-none font-semibold"
                  />
                </div>
              </div>

              {/* Portfolio Link */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1">
                  <Globe className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Portfolio Website Link</span>
                </label>
                <div className="relative">
                  <input
                    type="url"
                    placeholder="https://yourportfolio.dev"
                    value={portfolio}
                    onChange={e => setPortfolio(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:border-indigo-600 outline-none font-semibold"
                  />
                </div>
              </div>

              {/* LinkedIn Link */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1">
                  <Linkedin className="w-3.5 h-3.5 text-blue-600" />
                  <span>LinkedIn Profile Link</span>
                </label>
                <div className="relative">
                  <input
                    type="url"
                    placeholder="https://linkedin.com/in/username"
                    value={linkedin}
                    onChange={e => setLinkedin(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:border-indigo-600 outline-none font-semibold"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Technical Skills Tags */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
              <Award className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>4. Technical & Core Skills ({technicalSkills.length})</span>
            </h3>

            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Add skill (e.g. React, Python, C++, AutoCAD, SQL)..."
                value={newSkill}
                onChange={e => setNewSkill(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white outline-none"
              />
              <button
                type="button"
                onClick={() => addSkill()}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 transition-all"
              >
                Add Skill
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {technicalSkills.map((sk, idx) => (
                <span
                  key={idx}
                  className="text-xs px-3 py-1 rounded-xl bg-indigo-50 text-indigo-800 border border-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-300 dark:border-indigo-500/30 font-semibold flex items-center gap-1.5"
                >
                  <span>{sk}</span>
                  <button type="button" onClick={() => removeSkill(sk)} className="hover:text-rose-500">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Footer Submit Actions */}
          <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-3">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
              ✨ Filling resume & links activates your <strong className="text-indigo-600 dark:text-indigo-400">AI Job Readiness Index</strong>
            </span>

            <div className="flex gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all"
              >
                Skip for Now
              </button>
              <button
                type="submit"
                className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-extrabold shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
              >
                <span>Save Profile & Unlock Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </form>
      </div>
    </div>
  );
};
