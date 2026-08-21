import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { GlassCard } from '../ui/GlassCard';
import { parseResumeTextToProfile } from '../../services/aiEngine';
import { extractTextFromPdfFile } from '../../utils/pdfExtractor';
import { saveUploadedResumeDataToFirestore } from '../../services/firebase';
import {
  User,
  GraduationCap,
  Award,
  Link as LinkIcon,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
  Github,
  Linkedin,
  Globe,
  Upload,
  FileText,
  ExternalLink
} from 'lucide-react';

interface StudentProfileProps {
  onNavigateToJobs?: () => void;
}

export const StudentProfile: React.FC<StudentProfileProps> = ({ onNavigateToJobs }) => {
  const { profile, updateProfile, resetProfile, addNotification } = useAuth();
  const [formData, setFormData] = useState(profile);
  const [newSkill, setNewSkill] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isParsing, setIsParsing] = useState(false);

  // Sync local form state with updated profile context
  useEffect(() => {
    setFormData(profile);
  }, [profile]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ ...formData, isOnboarded: true });
    setSavedSuccess(true);
    addNotification('✅ Student Profile saved! Showing your matched jobs...');
    setTimeout(() => {
      setSavedSuccess(false);
      if (onNavigateToJobs) {
        onNavigateToJobs();
      }
    }, 600);
  };

  const handleResetCache = () => {
    if (window.confirm('Are you sure you want to clear all cached student profile data and reset to 0?')) {
      resetProfile();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsing(true);
    try {
      const text = await extractTextFromPdfFile(file);
      const parsed = await parseResumeTextToProfile(text || file.name, formData);

      const updated = {
        ...formData,
        name: parsed.name && parsed.name !== 'Student Candidate' ? parsed.name : formData.name,
        email: (profile.email && profile.email !== 'student@college.edu') ? profile.email : (parsed.email || formData.email),
        phone: parsed.phone || formData.phone,
        college: parsed.college || formData.college,
        department: parsed.department || formData.department,
        cgpa: parsed.cgpa || formData.cgpa,
        technicalSkills: Array.from(new Set([...formData.technicalSkills, ...parsed.technicalSkills])),
        projects: parsed.projects && parsed.projects.length > 0 ? parsed.projects : formData.projects,
        certifications: parsed.certifications && parsed.certifications.length > 0 ? parsed.certifications : formData.certifications,
        atsScore: parsed.atsScore || formData.atsScore,
        placementReadinessScore: parsed.placementReadinessScore || formData.placementReadinessScore,
        resumeFileName: file.name,
        resumeUploadedAt: new Date().toLocaleDateString()
      };

      setFormData(updated);
      updateProfile(updated);

      // Store in Firebase Firestore resumes collection
      saveUploadedResumeDataToFirestore(
        (profile.email && profile.email !== 'student@college.edu') ? profile.email : (parsed.email || formData.email),
        file.name,
        text || file.name,
        parsed
      );

      addNotification(`⚡ Resume extracted & saved to Firebase Firestore! Name: ${parsed.name || 'Candidate'} | Dept: ${parsed.department} | Skills: ${parsed.technicalSkills.length}`);
    } catch (err) {
      console.warn('Resume read:', err);
    } finally {
      setIsParsing(false);
    }
  };

  const addTechnicalSkill = () => {
    if (newSkill.trim() && !formData.technicalSkills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        technicalSkills: [...prev.technicalSkills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeTechnicalSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      technicalSkills: prev.technicalSkills.filter(s => s !== skill)
    }));
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <User className="w-6 h-6 text-indigo-600 dark:text-indigo-400" /> Student Profile & Professional Links
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manage your academic background, PDF resume, and GitHub, Portfolio & LinkedIn profile URLs for recruiter visibility.
          </p>
        </div>
        <div className="flex items-center space-x-2 shrink-0">
          <button
            type="button"
            onClick={handleResetCache}
            className="px-4 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-bold transition-all flex items-center gap-1.5"
            title="Wipe local browser cache and reset profile to clean 0 state"
          >
            <Trash2 className="w-4 h-4 text-rose-500" />
            <span>Reset Profile Cache</span>
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
          >
            {savedSuccess ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : null}
            <span>{savedSuccess ? 'Saved Successfully!' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </div>

      {/* Profile Sync Status Banner */}
      {formData.isOnboarded && (
        <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 text-xs font-bold text-indigo-800 dark:text-indigo-300 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Active Placement Profile: {formData.name} • {formData.department || 'General Branch'}</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-extrabold border border-emerald-500/30">
            ✅ Onboarded
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal & Academic Details */}
        <GlassCard className="p-6 lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
            <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Academic & Personal Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:border-indigo-600 outline-none font-semibold"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
              <input
                type="email"
                disabled={!!profile.email && profile.email !== 'student@college.edu'}
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:border-indigo-600 outline-none font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">College / Institution</label>
              <input
                type="text"
                value={formData.college}
                onChange={e => setFormData({ ...formData, college: e.target.value })}
                className="mt-1 w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:border-indigo-600 outline-none font-semibold"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Department / Branch</label>
              <input
                type="text"
                list="profile-departments"
                value={formData.department}
                onChange={e => setFormData({ ...formData, department: e.target.value })}
                className="mt-1 w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:border-indigo-600 outline-none font-semibold"
              />
              <datalist id="profile-departments">
                {['Computer Science & Engineering', 'Information Technology', 'Electronics & Communication Engineering', 'Electrical & Electronics Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Data Science & Artificial Intelligence', 'Mechatronics & Automation'].map((dept, idx) => (
                  <option key={idx} value={dept} />
                ))}
              </datalist>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Graduation Year</label>
              <input
                type="number"
                value={formData.graduationYear}
                onChange={e => setFormData({ ...formData, graduationYear: parseInt(e.target.value) || 2026 })}
                className="mt-1 w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:border-indigo-600 outline-none font-semibold"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">CGPA (out of 10.0)</label>
              <input
                type="number"
                step="0.01"
                value={formData.cgpa}
                onChange={e => setFormData({ ...formData, cgpa: parseFloat(e.target.value) || 0 })}
                className="mt-1 w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:border-indigo-600 outline-none font-semibold"
              />
            </div>
          </div>
        </GlassCard>

        {/* Technical Skills */}
        <GlassCard className="p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
            <Award className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Technical Skills ({formData.technicalSkills.length})
          </h3>

          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Add skill..."
              value={newSkill}
              onChange={e => setNewSkill(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTechnicalSkill())}
              className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white outline-none"
            />
            <button
              type="button"
              onClick={addTechnicalSkill}
              className="p-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 transition-all"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
            {formData.technicalSkills.length === 0 ? (
              <p className="text-xs text-slate-400 font-medium italic p-1">No technical skills added yet. Add a skill manually above or upload a PDF resume!</p>
            ) : (
              formData.technicalSkills.map((sk, idx) => (
                <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-800 border border-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-300 dark:border-indigo-500/30 font-semibold flex items-center gap-1.5">
                  <span>{sk}</span>
                  <button type="button" onClick={() => removeTechnicalSkill(sk)} className="hover:text-rose-500">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))
            )}
          </div>
        </GlassCard>

        {/* Social & Professional Links Section */}
        <GlassCard className="p-6 lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
            <LinkIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Professional Profiles & Portfolio Links
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* GitHub */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Github className="w-4 h-4 text-slate-900 dark:text-white" /> GitHub URL
                </span>
                {formData.github && (
                  <a
                    href={formData.github}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-600 dark:text-cyan-400 text-[10px] hover:underline flex items-center gap-0.5"
                  >
                    <span>Visit</span> <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </label>
              <input
                type="url"
                placeholder="https://github.com/username"
                value={formData.github || ''}
                onChange={e => setFormData({ ...formData, github: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:border-indigo-600 outline-none font-semibold"
              />
            </div>

            {/* Portfolio */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-emerald-500" /> Portfolio Website URL
                </span>
                {formData.portfolio && (
                  <a
                    href={formData.portfolio}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-600 dark:text-cyan-400 text-[10px] hover:underline flex items-center gap-0.5"
                  >
                    <span>Visit</span> <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </label>
              <input
                type="url"
                placeholder="https://myportfolio.dev"
                value={formData.portfolio || ''}
                onChange={e => setFormData({ ...formData, portfolio: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:border-indigo-600 outline-none font-semibold"
              />
            </div>

            {/* LinkedIn */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Linkedin className="w-4 h-4 text-blue-600" /> LinkedIn Profile URL
                </span>
                {formData.linkedin && (
                  <a
                    href={formData.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-600 dark:text-cyan-400 text-[10px] hover:underline flex items-center gap-0.5"
                  >
                    <span>Visit</span> <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </label>
              <input
                type="url"
                placeholder="https://linkedin.com/in/username"
                value={formData.linkedin || ''}
                onChange={e => setFormData({ ...formData, linkedin: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:border-indigo-600 outline-none font-semibold"
              />
            </div>
          </div>
        </GlassCard>

        {/* Resume File Upload Box */}
        <GlassCard className="p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
            <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Attached Resume File
          </h3>

          <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-800 hover:border-indigo-500 rounded-2xl p-4 text-center transition-all bg-slate-50/50 dark:bg-slate-950/40">
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="flex flex-col items-center justify-center space-y-2">
              <Upload className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              {formData.resumeFileName ? (
                <div>
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {formData.resumeFileName}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Click to replace PDF resume</p>
                </div>
              ) : (
                <div>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Upload PDF Resume</p>
                  <p className="text-[10px] text-slate-400">Click to select PDF or DOC file</p>
                </div>
              )}
              {isParsing && (
                <p className="text-[11px] text-indigo-600 dark:text-cyan-400 font-bold animate-pulse">
                  ⚡ AI Parsing skills...
                </p>
              )}
            </div>
          </div>
        </GlassCard>

      </div>
    </form>
  );
};
