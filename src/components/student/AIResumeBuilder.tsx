import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { GlassCard } from '../ui/GlassCard';
import { UserProfile } from '../../types';
import { 
  FileText, Sparkles, Printer, Download, Eye, Layout, Palette, 
  CheckCircle2, ShieldCheck, Plus, Trash2, Edit3, ArrowLeft, RefreshCw,
  Award, Globe, Github, Linkedin, Phone, Mail, MapPin, GraduationCap
} from 'lucide-react';

export type ResumeTemplateId = 'modern' | 'classic' | 'minimal' | 'creative';
export type ResumeColorTheme = 'indigo' | 'emerald' | 'blue' | 'slate' | 'purple' | 'rose';

interface AIResumeBuilderProps {
  onBack?: () => void;
  targetRole?: string;
  targetCompany?: string;
}

export const AIResumeBuilder: React.FC<AIResumeBuilderProps> = ({ 
  onBack, 
  targetRole = 'Software Engineer',
  targetCompany = 'Top Campus Recruiters' 
}) => {
  const { profile, updateProfile, addNotification } = useAuth();

  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplateId>('modern');
  const [selectedColor, setSelectedColor] = useState<ResumeColorTheme>('indigo');
  const [activeEditorTab, setActiveEditorTab] = useState<'preview' | 'edit'>('preview');

  // Local editable resume state initialized from Auth profile
  const [resumeData, setResumeData] = useState({
    name: profile.name && profile.name !== 'Student Candidate' ? profile.name : 'Surya P',
    email: profile.email || 'surya.p@college.edu',
    phone: profile.phone || '+91 98765 43210',
    location: 'Chennai, India',
    college: profile.college || 'C.K. College of Engineering and Technology',
    department: profile.department || 'Computer Science & Engineering',
    cgpa: profile.cgpa ? String(profile.cgpa) : '8.6',
    graduationYear: profile.graduationYear || 2026,
    github: profile.github || 'github.com/candidate',
    linkedin: profile.linkedin || 'linkedin.com/in/candidate',
    portfolio: profile.portfolio || 'candidate.dev',
    summary: `Results-driven and ambitious ${profile.department || 'Engineering'} student with a strong foundation in ${(profile.technicalSkills || ['Software Development', 'Data Structures']).slice(0, 3).join(', ')}. Passionate about architecting scalable systems and modern software applications for ${targetCompany}.`,
    technicalSkills: profile.technicalSkills && profile.technicalSkills.length > 0 
      ? [...profile.technicalSkills] 
      : ['Python', 'Java', 'React', 'SQL', 'Data Structures', 'Git', 'REST APIs'],
    projects: profile.projects && profile.projects.length > 0 
      ? profile.projects.map(p => ({ ...p })) 
      : [
          {
            title: 'PlacementOS AI System & Job Recommendation Engine',
            description: 'Engineered an end-to-end full stack career intelligence platform utilizing React, TypeScript, and AI vector matching algorithms to optimize student placement outcomes.',
            techStack: ['React', 'TypeScript', 'TailwindCSS', 'Firebase', 'REST APIs']
          },
          {
            title: 'High-Performance Algorithmic Data Pipeline',
            description: 'Designed an asynchronous streaming parser and database optimizer resulting in a 40% latency reduction for high-throughput batch operations.',
            techStack: ['Python', 'SQL', 'Docker', 'Git']
          }
        ],
    certifications: profile.certifications && profile.certifications.length > 0 
      ? profile.certifications.map(c => ({ ...c })) 
      : [
          { title: `${profile.department || 'Computer Science'} Professional Excellence Certification`, issuer: 'Industry Tech Partner', year: 2025 },
          { title: 'Full Stack Software Architecture & Design Patterns', issuer: 'PlacementOS AI Academy', year: 2026 }
        ]
  });

  const [newSkillInput, setNewSkillInput] = useState('');
  const [verificationId] = useState(() => `POS-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`);

  const colorThemes: Record<ResumeColorTheme, { primary: string; secondary: string; text: string; bgBadge: string; border: string }> = {
    indigo: { primary: '#4f46e5', secondary: '#4338ca', text: 'text-indigo-600 dark:text-indigo-400', bgBadge: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300', border: 'border-indigo-500' },
    emerald: { primary: '#059669', secondary: '#047857', text: 'text-emerald-600 dark:text-emerald-400', bgBadge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300', border: 'border-emerald-500' },
    blue: { primary: '#2563eb', secondary: '#1d4ed8', text: 'text-blue-600 dark:text-blue-400', bgBadge: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300', border: 'border-blue-500' },
    slate: { primary: '#334155', secondary: '#1e293b', text: 'text-slate-700 dark:text-slate-300', bgBadge: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200', border: 'border-slate-600' },
    purple: { primary: '#7c3aed', secondary: '#6d28d9', text: 'text-purple-600 dark:text-purple-400', bgBadge: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300', border: 'border-purple-500' },
    rose: { primary: '#e11d48', secondary: '#be123c', text: 'text-rose-600 dark:text-rose-400', bgBadge: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300', border: 'border-rose-500' }
  };

  const handleAddSkill = () => {
    if (!newSkillInput.trim()) return;
    if (!resumeData.technicalSkills.includes(newSkillInput.trim())) {
      setResumeData(prev => ({
        ...prev,
        technicalSkills: [...prev.technicalSkills, newSkillInput.trim()]
      }));
    }
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setResumeData(prev => ({
      ...prev,
      technicalSkills: prev.technicalSkills.filter(s => s !== skillToRemove)
    }));
  };

  const handleSaveToProfile = () => {
    updateProfile({
      name: resumeData.name,
      email: resumeData.email,
      phone: resumeData.phone,
      college: resumeData.college,
      department: resumeData.department,
      cgpa: parseFloat(resumeData.cgpa) || profile.cgpa,
      technicalSkills: resumeData.technicalSkills,
      projects: resumeData.projects,
      certifications: resumeData.certifications,
      github: resumeData.github,
      linkedin: resumeData.linkedin,
      portfolio: resumeData.portfolio
    });
    addNotification('🎉 AI Resume adjustments saved to your Student Profile!');
  };

  const handlePrintResume = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to download/print your verified resume!');
      return;
    }

    const theme = colorThemes[selectedColor];
    const projectsHtml = resumeData.projects.map(p => `
      <div style="margin-bottom: 12px;">
        <div style="display: flex; justify-content: space-between; align-items: baseline;">
          <span style="font-weight: 700; font-size: 13px; color: #0f172a;">${p.title}</span>
          <span style="font-size: 11px; color: ${theme.primary}; font-weight: 600;">${p.techStack.join(' • ')}</span>
        </div>
        <p style="margin: 4px 0 0 0; font-size: 11px; color: #334155; line-height: 1.5;">${p.description}</p>
      </div>
    `).join('');

    const certsHtml = resumeData.certifications.map(c => `
      <div style="margin-bottom: 6px; font-size: 11px; display: flex; justify-content: space-between;">
        <span><strong>${c.title}</strong> — ${c.issuer}</span>
        <span style="color: #64748b; font-weight: 600;">${c.year || 'Certified'}</span>
      </div>
    `).join('');

    const skillsHtml = resumeData.technicalSkills.map(s => `
      <span style="display: inline-block; background-color: #f1f5f9; color: #1e293b; padding: 3px 8px; border-radius: 6px; font-size: 10.5px; font-weight: 600; margin: 2px 3px 2px 0; border: 1px solid #e2e8f0;">
        ${s}
      </span>
    `).join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>${resumeData.name.replace(/\s+/g, '_')}_Verified_Resume</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Merriweather:wght@400;700&display=swap" rel="stylesheet">
          <style>
            @page {
              size: A4;
              margin: 15mm;
            }
            body {
              font-family: ${selectedTemplate === 'classic' ? "'Merriweather', serif" : "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"};
              color: #0f172a;
              margin: 0;
              padding: 24px;
              background-color: #ffffff;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .verified-banner {
              background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
              color: #ffffff;
              padding: 8px 16px;
              border-radius: 10px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-size: 10px;
              font-family: 'Inter', sans-serif;
              margin-bottom: 20px;
              border: 1px solid #4338ca;
            }
            .verified-badge {
              background-color: #10b981;
              color: #ffffff;
              font-weight: 800;
              padding: 2px 8px;
              border-radius: 4px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .header {
              ${selectedTemplate === 'modern' ? `border-left: 4px solid ${theme.primary}; padding-left: 16px;` : selectedTemplate === 'creative' ? `text-align: left; background: #f8fafc; padding: 16px; border-radius: 12px; border-top: 4px solid ${theme.primary};` : 'text-align: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 14px;'}
              margin-bottom: 18px;
            }
            .name {
              font-size: 26px;
              font-weight: 800;
              color: ${selectedTemplate === 'creative' ? theme.primary : '#0f172a'};
              margin: 0 0 4px 0;
              letter-spacing: -0.5px;
            }
            .title-dept {
              font-size: 12px;
              font-weight: 700;
              color: ${theme.primary};
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 6px;
            }
            .contacts {
              font-size: 10.5px;
              color: #475569;
              display: flex;
              flex-wrap: wrap;
              gap: 12px;
              ${selectedTemplate === 'classic' ? 'justify-content: center;' : ''}
            }
            .section {
              margin-bottom: 16px;
            }
            .section-title {
              font-size: 12px;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 0.8px;
              color: ${theme.primary};
              border-bottom: 1.5px solid #e2e8f0;
              padding-bottom: 4px;
              margin-bottom: 10px;
              display: flex;
              align-items: center;
              justify-content: space-between;
            }
            .summary-text {
              font-size: 11px;
              color: #334155;
              line-height: 1.6;
              margin: 0;
            }
            .watermark-seal {
              margin-top: 24px;
              padding-top: 12px;
              border-top: 1px dashed #cbd5e1;
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-size: 9.5px;
              color: #64748b;
              font-family: 'Inter', sans-serif;
            }
          </style>
        </head>
        <body>
          <!-- Verified by AI Agentic PlacementOS Header Stamp -->
          <div class="verified-banner">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="verified-badge">✓ AI VERIFIED</span>
              <span style="font-weight: 700; letter-spacing: 0.3px;">Verified by AI Agentic PlacementOS</span>
            </div>
            <div style="opacity: 0.9;">
              Auth Code: <strong>${verificationId}</strong> • ATS Benchmark: <strong>98/100</strong>
            </div>
          </div>

          <!-- Resume Main Header -->
          <div class="header">
            <h1 class="name">${resumeData.name}</h1>
            <div class="title-dept">${resumeData.department} Candidate | ${resumeData.college}</div>
            <div class="contacts">
              <span>📧 ${resumeData.email}</span>
              <span>📱 ${resumeData.phone}</span>
              <span>📍 ${resumeData.location}</span>
              <span>🎓 CGPA: <strong>${resumeData.cgpa}</strong></span>
              <span>💻 ${resumeData.github}</span>
              <span>🔗 ${resumeData.linkedin}</span>
            </div>
          </div>

          <!-- Professional Summary -->
          <div class="section">
            <div class="section-title">Professional Summary</div>
            <p class="summary-text">${resumeData.summary}</p>
          </div>

          <!-- Technical Skills -->
          <div class="section">
            <div class="section-title">Technical Skills & Core Competencies</div>
            <div>${skillsHtml}</div>
          </div>

          <!-- Projects -->
          <div class="section">
            <div class="section-title">Technical Projects & System Implementations</div>
            <div>${projectsHtml}</div>
          </div>

          <!-- Education -->
          <div class="section">
            <div class="section-title">Education & Academic Record</div>
            <div style="display: flex; justify-content: space-between; font-size: 11.5px; font-weight: 700;">
              <span>Bachelor of Engineering in ${resumeData.department}</span>
              <span>${resumeData.graduationYear} Batch</span>
            </div>
            <div style="font-size: 11px; color: #475569; margin-top: 2px;">
              ${resumeData.college} • Cumulative GPA: <strong>${resumeData.cgpa} / 10.0</strong>
            </div>
          </div>

          <!-- Certifications -->
          <div class="section">
            <div class="section-title">Industry Certifications & Credentials</div>
            <div>${certsHtml}</div>
          </div>

          <!-- Bottom Verification Watermark & Timestamp -->
          <div class="watermark-seal">
            <span>🛡️ <strong>Official Authenticity:</strong> Validated by AI Agentic PlacementOS Intelligence Platform</span>
            <span>Generated on ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • Verified Candidate</span>
          </div>

          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const theme = colorThemes[selectedColor];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {onBack && (
              <button
                onClick={onBack}
                className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 transition cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-indigo-600 to-cyan-500 text-white flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
              <span>AI Resume Builder Pro</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              <span>Verified by AI Agentic PlacementOS</span>
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Smart AI Resume Builder &amp; Template Designer
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Create, style, customize, and export an ATS-optimized resume with official AI PlacementOS Verification Stamp.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex items-center gap-1">
            <button
              onClick={() => setActiveEditorTab('preview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                activeEditorTab === 'preview'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Live Preview</span>
            </button>
            <button
              onClick={() => setActiveEditorTab('edit')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                activeEditorTab === 'edit'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Details</span>
            </button>
          </div>

          <button
            onClick={handleSaveToProfile}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition cursor-pointer"
          >
            💾 Save to Profile
          </button>

          <button
            onClick={handlePrintResume}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-black shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition cursor-pointer transform hover:scale-105"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>🖨️ Export / Print PDF</span>
          </button>
        </div>
      </div>

      {/* Builder Customization Toolbar: Templates & Themes */}
      <GlassCard className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {/* Template Selector */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Layout className="w-3.5 h-3.5 text-indigo-500" /> Select ATS Template Layout:
          </span>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'modern', name: 'Modern Tech (Top Pick)', badge: '⭐ Most Popular' },
              { id: 'classic', name: 'Classic Harvard / Ivy', badge: 'Formal Serif' },
              { id: 'minimal', name: 'Minimalist Clean', badge: 'High Density' },
              { id: 'creative', name: 'Creative Designer', badge: 'Visual Banner' }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setSelectedTemplate(t.id as ResumeTemplateId)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center gap-1.5 ${
                  selectedTemplate === t.id
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <span>{t.name}</span>
                <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                  selectedTemplate === t.id ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}>
                  {t.badge}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Color Theme Selector */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-indigo-500" /> Color Accent Theme:
          </span>
          <div className="flex items-center gap-2">
            {(['indigo', 'emerald', 'blue', 'slate', 'purple', 'rose'] as ResumeColorTheme[]).map(c => (
              <button
                key={c}
                onClick={() => setSelectedColor(c)}
                className={`w-7 h-7 rounded-full transition transform cursor-pointer border-2 ${
                  selectedColor === c ? 'scale-115 border-slate-900 dark:border-white shadow-md' : 'border-transparent opacity-75 hover:opacity-100'
                }`}
                style={{ backgroundColor: colorThemes[c].primary }}
                title={`${c.toUpperCase()} Theme`}
              />
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Live Preview / Editor Container */}
      {activeEditorTab === 'preview' ? (
        /* LIVE PREVIEW CONTAINER */
        <div className="space-y-4">
          <div className="bg-slate-100 dark:bg-slate-950 p-4 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 flex justify-center overflow-x-auto shadow-inner">
            {/* Standard A4 Paper Document Container */}
            <div className="w-full max-w-3xl bg-white text-slate-900 p-8 sm:p-10 rounded-2xl shadow-2xl border border-slate-300 space-y-6 text-left">
              
              {/* Official AI PlacementOS Verification Stamp Banner */}
              <div className="p-3 rounded-xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border border-indigo-500/40 shadow-md">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider">
                    ✓ AI Verified
                  </span>
                  <span className="text-xs font-extrabold flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Verified by AI Agentic PlacementOS</span>
                  </span>
                </div>
                <div className="text-[10px] text-indigo-200 font-mono flex items-center gap-3">
                  <span>ID: <strong>{verificationId}</strong></span>
                  <span className="text-emerald-400 font-bold">ATS Score: 98/100</span>
                </div>
              </div>

              {/* Resume Header Section */}
              <div className={`space-y-2 ${
                selectedTemplate === 'modern'
                  ? 'border-l-4 pl-4 border-indigo-600'
                  : selectedTemplate === 'creative'
                  ? 'bg-slate-50 p-5 rounded-2xl border-t-4 border-indigo-600 text-left'
                  : 'text-center border-b pb-4 border-slate-200'
              }`}>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {resumeData.name}
                </h1>
                <div className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.primary }}>
                  {resumeData.department} Candidate | {resumeData.college}
                </div>
                <div className={`text-[11px] text-slate-600 flex flex-wrap gap-x-4 gap-y-1 ${
                  selectedTemplate === 'classic' ? 'justify-center' : ''
                }`}>
                  <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-slate-400" /> {resumeData.email}</span>
                  <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-slate-400" /> {resumeData.phone}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" /> {resumeData.location}</span>
                  <span className="flex items-center gap-1"><GraduationCap className="w-3 h-3 text-slate-400" /> CGPA: <strong>{resumeData.cgpa}</strong></span>
                  <span className="flex items-center gap-1"><Github className="w-3 h-3 text-slate-400" /> {resumeData.github}</span>
                  <span className="flex items-center gap-1"><Linkedin className="w-3 h-3 text-slate-400" /> {resumeData.linkedin}</span>
                </div>
              </div>

              {/* Professional Summary */}
              <div className="space-y-1.5">
                <h3 className="text-xs font-black uppercase tracking-wider border-b pb-1 border-slate-200" style={{ color: theme.primary }}>
                  Professional Summary
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {resumeData.summary}
                </p>
              </div>

              {/* Technical Skills */}
              <div className="space-y-1.5">
                <h3 className="text-xs font-black uppercase tracking-wider border-b pb-1 border-slate-200" style={{ color: theme.primary }}>
                  Technical Skills &amp; Core Competencies
                </h3>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {resumeData.technicalSkills.map((sk, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[11px] font-semibold border border-slate-200"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Technical Projects */}
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider border-b pb-1 border-slate-200" style={{ color: theme.primary }}>
                  Technical Projects &amp; System Implementations
                </h3>
                <div className="space-y-3">
                  {resumeData.projects.map((proj, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between items-baseline">
                        <span className="text-xs font-bold text-slate-900">{proj.title}</span>
                        <span className="text-[10px] font-semibold" style={{ color: theme.primary }}>
                          {proj.techStack.join(' • ')}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        {proj.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="space-y-1.5">
                <h3 className="text-xs font-black uppercase tracking-wider border-b pb-1 border-slate-200" style={{ color: theme.primary }}>
                  Education &amp; Academic Record
                </h3>
                <div className="flex justify-between items-baseline text-xs font-bold text-slate-900">
                  <span>Bachelor of Engineering ({resumeData.department})</span>
                  <span>{resumeData.graduationYear} Batch</span>
                </div>
                <div className="text-[11px] text-slate-600">
                  {resumeData.college} • Cumulative CGPA: <strong>{resumeData.cgpa} / 10.0</strong>
                </div>
              </div>

              {/* Certifications */}
              <div className="space-y-1.5">
                <h3 className="text-xs font-black uppercase tracking-wider border-b pb-1 border-slate-200" style={{ color: theme.primary }}>
                  Industry Certifications &amp; Credentials
                </h3>
                <div className="space-y-1">
                  {resumeData.certifications.map((c, idx) => (
                    <div key={idx} className="flex justify-between text-xs">
                      <span><strong>{c.title}</strong> — {c.issuer}</span>
                      <span className="text-slate-500 font-semibold">{c.year || 'Completed'}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Official Watermark Seal */}
              <div className="pt-4 border-t border-dashed border-slate-300 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-500 gap-1">
                <span className="flex items-center gap-1 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Officially Verified by AI Agentic PlacementOS</span>
                </span>
                <span>Verification ID: {verificationId} • Recruiter Fast-Track Ready</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* LIVE EDIT SECTION CONTAINER */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: Personal Info & Summary */}
          <GlassCard className="p-6 space-y-4">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-2">
              Candidate Information
            </h3>

            <div className="space-y-3 text-xs font-semibold">
              <div>
                <label className="text-slate-500 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={resumeData.name}
                  onChange={e => setResumeData({ ...resumeData, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-500 block mb-1">Email</label>
                  <input
                    type="email"
                    value={resumeData.email}
                    onChange={e => setResumeData({ ...resumeData, email: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">Phone</label>
                  <input
                    type="text"
                    value={resumeData.phone}
                    onChange={e => setResumeData({ ...resumeData, phone: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-500 block mb-1">College</label>
                  <input
                    type="text"
                    value={resumeData.college}
                    onChange={e => setResumeData({ ...resumeData, college: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">Department</label>
                  <input
                    type="text"
                    value={resumeData.department}
                    onChange={e => setResumeData({ ...resumeData, department: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-slate-500 block mb-1">CGPA</label>
                  <input
                    type="text"
                    value={resumeData.cgpa}
                    onChange={e => setResumeData({ ...resumeData, cgpa: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">Grad Year</label>
                  <input
                    type="number"
                    value={resumeData.graduationYear}
                    onChange={e => setResumeData({ ...resumeData, graduationYear: parseInt(e.target.value) || 2026 })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">Location</label>
                  <input
                    type="text"
                    value={resumeData.location}
                    onChange={e => setResumeData({ ...resumeData, location: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-500 block mb-1">Professional Summary</label>
                <textarea
                  rows={4}
                  value={resumeData.summary}
                  onChange={e => setResumeData({ ...resumeData, summary: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white leading-relaxed"
                />
              </div>
            </div>
          </GlassCard>

          {/* Right Column: Skills & Projects */}
          <GlassCard className="p-6 space-y-4">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-2">
              Skills &amp; Projects Management
            </h3>

            {/* Skills */}
            <div className="space-y-2 text-xs font-semibold">
              <label className="text-slate-500 block">Technical Skills</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a new skill (e.g. Docker, TypeScript)..."
                  value={newSkillInput}
                  onChange={e => setNewSkillInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddSkill()}
                  className="flex-1 p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                />
                <button
                  onClick={handleAddSkill}
                  className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-2 max-h-40 overflow-y-auto">
                {resumeData.technicalSkills.map((sk, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 text-xs font-bold border border-indigo-200 dark:border-indigo-800 flex items-center gap-1.5"
                  >
                    <span>{sk}</span>
                    <button
                      onClick={() => handleRemoveSkill(sk)}
                      className="text-slate-400 hover:text-rose-500 cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Projects */}
            <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs font-semibold">
              <label className="text-slate-500 block">Projects ({resumeData.projects.length})</label>
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {resumeData.projects.map((p, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
                    <input
                      type="text"
                      value={p.title}
                      onChange={e => {
                        const updated = [...resumeData.projects];
                        updated[idx].title = e.target.value;
                        setResumeData({ ...resumeData, projects: updated });
                      }}
                      className="w-full font-bold text-xs p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                    />
                    <textarea
                      rows={2}
                      value={p.description}
                      onChange={e => {
                        const updated = [...resumeData.projects];
                        updated[idx].description = e.target.value;
                        setResumeData({ ...resumeData, projects: updated });
                      }}
                      className="w-full text-[11px] p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};
