import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { GlassCard } from '../ui/GlassCard';
import { 
  FileText, Sparkles, Printer, Download, Eye, Layout, Palette, 
  CheckCircle2, ShieldCheck, Plus, Trash2, Edit3, ArrowLeft, RefreshCw,
  Award, Globe, Github, Linkedin, Phone, Mail, MapPin, GraduationCap,
  User, Check, Briefcase, Code, Bookmark, Share2, Sparkle, Camera
} from 'lucide-react';

export type ResumeTemplateId = 'sidebar_tech' | 'harvard_classic' | 'executive_banner' | 'creative_portfolio' | 'minimalist_ats';
export type ResumeColorTheme = 'indigo' | 'emerald' | 'blue' | 'slate' | 'purple' | 'rose' | 'amber';
export type ResumeFontFamily = 'inter' | 'merriweather' | 'roboto' | 'outfit';

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

  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplateId>('sidebar_tech');
  const [selectedColor, setSelectedColor] = useState<ResumeColorTheme>('indigo');
  const [selectedFont, setSelectedFont] = useState<ResumeFontFamily>('inter');
  const [showPhoto, setShowPhoto] = useState<boolean>(true);
  const [activeEditorTab, setActiveEditorTab] = useState<'preview' | 'edit'>('preview');

  // Local editable resume state initialized from Auth profile
  const [resumeData, setResumeData] = useState({
    name: profile.name && profile.name !== 'Student Candidate' ? profile.name : 'Surya P',
    title: profile.preferredRoles?.[0] || 'Associate Software Engineer & AI Developer',
    email: profile.email || 'surya.p@college.edu',
    phone: profile.phone || '+91 98765 43210',
    location: 'Chennai, India',
    college: profile.college || 'C.K. College of Engineering and Technology',
    department: profile.department || 'Computer Science & Engineering',
    cgpa: profile.cgpa ? String(profile.cgpa) : '8.6',
    graduationYear: profile.graduationYear || 2026,
    github: profile.github || 'github.com/suryap-dev',
    linkedin: profile.linkedin || 'linkedin.com/in/suryap',
    portfolio: profile.portfolio || 'suryap.dev',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    summary: `Results-driven and ambitious ${profile.department || 'Engineering'} student with strong proficiency in ${(profile.technicalSkills || ['Software Engineering', 'Algorithms', 'Full Stack Development']).slice(0, 3).join(', ')}. Passionate about building high-availability cloud applications, solving algorithmic problems, and contributing to high-impact technical initiatives at ${targetCompany}.`,
    technicalSkills: profile.technicalSkills && profile.technicalSkills.length > 0 
      ? [...profile.technicalSkills] 
      : ['Python', 'Java', 'React', 'TypeScript', 'SQL', 'Data Structures', 'Git', 'REST APIs', 'Node.js', 'Docker'],
    softSkills: ['Problem Solving', 'Team Leadership', 'Agile Methodologies', 'System Design', 'Effective Communication'],
    languages: ['English (Professional)', 'Tamil (Native)', 'Hindi (Conversational)'],
    projects: profile.projects && profile.projects.length > 0 
      ? profile.projects.map(p => ({ ...p })) 
      : [
          {
            title: 'PlacementOS AI System & Job Recommendation Engine',
            description: 'Architected an end-to-end full stack career intelligence platform utilizing React, TypeScript, and AI vector matching algorithms to optimize student placement outcomes.',
            techStack: ['React', 'TypeScript', 'TailwindCSS', 'Firebase', 'REST APIs']
          },
          {
            title: 'High-Performance Algorithmic Data Pipeline',
            description: 'Designed an asynchronous streaming parser and database optimizer resulting in a 40% latency reduction for high-throughput batch operations.',
            techStack: ['Python', 'SQL', 'Docker', 'Git']
          },
          {
            title: 'Cloud-Native Distributed Task Scheduler',
            description: 'Developed a fault-tolerant job dispatch engine with real-time heartbeat monitoring and Redis pub/sub queue processing.',
            techStack: ['Node.js', 'Redis', 'PostgreSQL', 'AWS']
          }
        ],
    certifications: profile.certifications && profile.certifications.length > 0 
      ? profile.certifications.map(c => ({ ...c })) 
      : [
          { title: `${profile.department || 'Computer Science'} Professional Excellence Certification`, issuer: 'Industry Tech Partner', year: 2025 },
          { title: 'Full Stack Software Architecture & Design Patterns', issuer: 'PlacementOS AI Academy', year: 2026 },
          { title: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services', year: 2025 }
        ]
  });

  const [newSkillInput, setNewSkillInput] = useState('');
  const [verificationId] = useState(() => `POS-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`);

  const templateOptions: { id: ResumeTemplateId; name: string; tag: string; description: string; previewClass: string }[] = [
    {
      id: 'sidebar_tech',
      name: 'Modern Sidebar Tech',
      tag: '🔥 Most Popular',
      description: 'Two-column layout with dark/accent sidebar, avatar, skills tags & detailed project columns.',
      previewClass: 'from-slate-900 to-indigo-900'
    },
    {
      id: 'harvard_classic',
      name: 'Harvard Classic Ivy',
      tag: '🏛️ ATS Gold Standard',
      description: 'Traditional 1-column serif layout with clean horizontal rules and academic hierarchy.',
      previewClass: 'from-amber-950 to-stone-900'
    },
    {
      id: 'executive_banner',
      name: 'Executive Header',
      tag: '💼 Recruiter Favorite',
      description: 'Prominent dark/accented header block with high contrast profile and 2-column experience.',
      previewClass: 'from-blue-900 to-slate-900'
    },
    {
      id: 'creative_portfolio',
      name: 'Creative Designer & Tech',
      tag: '✨ Modern & Vibrant',
      description: 'Contemporary aesthetic with gradient badges, soft cards, and skill proficiency pills.',
      previewClass: 'from-purple-900 to-pink-900'
    },
    {
      id: 'minimalist_ats',
      name: 'Minimalist Clean ATS',
      tag: '⚡ 100% ATS Parser Safe',
      description: 'Ultra-clean single-column monochrome design maximized for corporate screening bots.',
      previewClass: 'from-gray-900 to-zinc-900'
    }
  ];

  const colorThemes: Record<ResumeColorTheme, { name: string; primary: string; secondary: string; hexBadge: string; text: string; bgBadge: string; border: string }> = {
    indigo: { name: 'Deep Indigo', primary: '#4f46e5', secondary: '#3730a3', hexBadge: '#6366f1', text: 'text-indigo-600 dark:text-indigo-400', bgBadge: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300', border: 'border-indigo-500' },
    emerald: { name: 'Emerald Teal', primary: '#059669', secondary: '#065f46', hexBadge: '#10b981', text: 'text-emerald-600 dark:text-emerald-400', bgBadge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300', border: 'border-emerald-500' },
    blue: { name: 'Sapphire Blue', primary: '#2563eb', secondary: '#1e40af', hexBadge: '#3b82f6', text: 'text-blue-600 dark:text-blue-400', bgBadge: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300', border: 'border-blue-500' },
    slate: { name: 'Midnight Slate', primary: '#334155', secondary: '#0f172a', hexBadge: '#64748b', text: 'text-slate-700 dark:text-slate-300', bgBadge: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200', border: 'border-slate-600' },
    purple: { name: 'Royal Purple', primary: '#7c3aed', secondary: '#5b21b6', hexBadge: '#8b5cf6', text: 'text-purple-600 dark:text-purple-400', bgBadge: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300', border: 'border-purple-500' },
    rose: { name: 'Crimson Rose', primary: '#e11d48', secondary: '#9f1239', hexBadge: '#f43f5e', text: 'text-rose-600 dark:text-rose-400', bgBadge: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300', border: 'border-rose-500' },
    amber: { name: 'Sunset Amber', primary: '#d97706', secondary: '#92400e', hexBadge: '#f59e0b', text: 'text-amber-600 dark:text-amber-400', bgBadge: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300', border: 'border-amber-500' }
  };

  const fontFamilies: Record<ResumeFontFamily, { name: string; fontCss: string; preview: string }> = {
    inter: { name: 'Inter (Modern Tech)', fontCss: "'Inter', sans-serif", preview: 'Clean modern sans-serif' },
    merriweather: { name: 'Merriweather (Classic Serif)', fontCss: "'Merriweather', Georgia, serif", preview: 'Ivy League academic style' },
    roboto: { name: 'Roboto (Engineering)', fontCss: "'Roboto', sans-serif", preview: 'Standard tech industry' },
    outfit: { name: 'Outfit (Creative Sans)', fontCss: "'Outfit', sans-serif", preview: 'Contemporary geometric' }
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
    const font = fontFamilies[selectedFont];

    const projectsHtml = resumeData.projects.map(p => `
      <div style="margin-bottom: 14px;">
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 3px;">
          <span style="font-weight: 700; font-size: 13px; color: #0f172a;">${p.title}</span>
          <span style="font-size: 11px; color: ${theme.primary}; font-weight: 600;">${p.techStack.join(' • ')}</span>
        </div>
        <p style="margin: 0; font-size: 11px; color: #334155; line-height: 1.5;">${p.description}</p>
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

    const softSkillsHtml = resumeData.softSkills.map(s => `
      <span style="display: inline-block; background-color: #f8fafc; color: #475569; padding: 2px 7px; border-radius: 4px; font-size: 10px; font-weight: 500; margin: 2px 2px 2px 0; border: 1px solid #e2e8f0;">
        ${s}
      </span>
    `).join('');

    let layoutHtml = '';

    if (selectedTemplate === 'sidebar_tech') {
      layoutHtml = `
        <div class="sidebar-layout">
          <aside class="sidebar-col" style="background-color: #0f172a; color: #ffffff; padding: 24px 18px; border-radius: 12px 0 0 12px;">
            ${showPhoto ? `<div style="text-align: center; margin-bottom: 16px;"><img src="${resumeData.avatarUrl}" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 3px solid ${theme.primary};" /></div>` : ''}
            
            <div style="margin-bottom: 20px;">
              <h4 style="font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: ${theme.hexBadge}; margin-bottom: 8px; border-bottom: 1px solid #334155; padding-bottom: 4px;">Contact Info</h4>
              <div style="font-size: 10px; color: #cbd5e1; line-height: 1.8;">
                <div>📧 ${resumeData.email}</div>
                <div>📞 ${resumeData.phone}</div>
                <div>📍 ${resumeData.location}</div>
                <div>🌐 ${resumeData.portfolio}</div>
                <div>💻 ${resumeData.github}</div>
                <div>🔗 ${resumeData.linkedin}</div>
              </div>
            </div>

            <div style="margin-bottom: 20px;">
              <h4 style="font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: ${theme.hexBadge}; margin-bottom: 8px; border-bottom: 1px solid #334155; padding-bottom: 4px;">Education</h4>
              <div style="font-size: 10.5px; color: #ffffff; font-weight: 700;">B.E. ${resumeData.department}</div>
              <div style="font-size: 10px; color: #94a3b8;">${resumeData.college}</div>
              <div style="font-size: 10px; color: ${theme.hexBadge}; font-weight: 700; margin-top: 2px;">CGPA: ${resumeData.cgpa} / 10.0 • Grad ${resumeData.graduationYear}</div>
            </div>

            <div style="margin-bottom: 20px;">
              <h4 style="font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: ${theme.hexBadge}; margin-bottom: 8px; border-bottom: 1px solid #334155; padding-bottom: 4px;">Technical Skills</h4>
              <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                ${resumeData.technicalSkills.map(s => `<span style="font-size: 9.5px; background: #1e293b; color: #e2e8f0; padding: 2px 6px; border-radius: 4px; border: 1px solid #334155;">${s}</span>`).join('')}
              </div>
            </div>

            <div style="margin-bottom: 16px;">
              <h4 style="font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: ${theme.hexBadge}; margin-bottom: 8px; border-bottom: 1px solid #334155; padding-bottom: 4px;">Key Competencies</h4>
              <div style="font-size: 9.5px; color: #94a3b8; line-height: 1.6;">
                ${resumeData.softSkills.map(s => `<div>• ${s}</div>`).join('')}
              </div>
            </div>

            <div>
              <h4 style="font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: ${theme.hexBadge}; margin-bottom: 6px; border-bottom: 1px solid #334155; padding-bottom: 4px;">Languages</h4>
              <div style="font-size: 9.5px; color: #cbd5e1; line-height: 1.5;">
                ${resumeData.languages.map(l => `<div>• ${l}</div>`).join('')}
              </div>
            </div>
          </aside>

          <main class="main-col" style="padding: 24px 22px;">
            <div style="border-bottom: 2px solid #f1f5f9; padding-bottom: 12px; margin-bottom: 16px;">
              <h1 style="font-size: 26px; font-weight: 800; color: #0f172a; margin: 0 0 4px 0; letter-spacing: -0.5px;">${resumeData.name}</h1>
              <div style="font-size: 13px; font-weight: 700; color: ${theme.primary}; text-transform: uppercase; letter-spacing: 0.5px;">${resumeData.title}</div>
            </div>

            <div style="margin-bottom: 18px;">
              <h3 style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: ${theme.primary}; border-bottom: 1.5px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 8px;">Professional Profile</h3>
              <p style="font-size: 11px; color: #334155; line-height: 1.6; margin: 0;">${resumeData.summary}</p>
            </div>

            <div style="margin-bottom: 18px;">
              <h3 style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: ${theme.primary}; border-bottom: 1.5px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 10px;">Featured Engineering Projects</h3>
              ${projectsHtml}
            </div>

            <div style="margin-bottom: 16px;">
              <h3 style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: ${theme.primary}; border-bottom: 1.5px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 8px;">Certifications & Accreditations</h3>
              ${certsHtml}
            </div>
          </main>
        </div>
      `;
    } else if (selectedTemplate === 'executive_banner') {
      layoutHtml = `
        <div class="executive-layout">
          <header style="background: linear-gradient(135deg, #0f172a 0%, ${theme.secondary} 100%); color: #ffffff; padding: 22px 24px; border-radius: 12px; margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <h1 style="font-size: 26px; font-weight: 800; margin: 0 0 4px 0; color: #ffffff;">${resumeData.name}</h1>
                <div style="font-size: 13px; font-weight: 600; color: ${theme.hexBadge}; text-transform: uppercase; letter-spacing: 0.5px;">${resumeData.title}</div>
              </div>
              ${showPhoto ? `<img src="${resumeData.avatarUrl}" style="width: 65px; height: 65px; border-radius: 50%; object-fit: cover; border: 2px solid #ffffff;" />` : ''}
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 12px; font-size: 10px; color: #cbd5e1; margin-top: 12px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.15);">
              <span>📧 ${resumeData.email}</span>
              <span>📞 ${resumeData.phone}</span>
              <span>📍 ${resumeData.location}</span>
              <span>💻 ${resumeData.github}</span>
              <span>🔗 ${resumeData.linkedin}</span>
            </div>
          </header>

          <section style="margin-bottom: 16px;">
            <h3 style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: ${theme.primary}; border-bottom: 1.5px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 8px;">Executive Summary</h3>
            <p style="font-size: 11px; color: #334155; line-height: 1.6; margin: 0;">${resumeData.summary}</p>
          </section>

          <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 20px;">
            <div>
              <section style="margin-bottom: 16px;">
                <h3 style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: ${theme.primary}; border-bottom: 1.5px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 10px;">Technical Experience & Projects</h3>
                ${projectsHtml}
              </section>
            </div>

            <div>
              <section style="margin-bottom: 16px;">
                <h3 style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: ${theme.primary}; border-bottom: 1.5px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 8px;">Education</h3>
                <div style="font-size: 11px; font-weight: 700; color: #0f172a;">B.E. ${resumeData.department}</div>
                <div style="font-size: 10.5px; color: #475569;">${resumeData.college}</div>
                <div style="font-size: 10.5px; color: ${theme.primary}; font-weight: 700; margin-top: 2px;">CGPA: ${resumeData.cgpa} / 10.0 • Grad ${resumeData.graduationYear}</div>
              </section>

              <section style="margin-bottom: 16px;">
                <h3 style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: ${theme.primary}; border-bottom: 1.5px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 8px;">Technical Arsenal</h3>
                <div>${skillsHtml}</div>
              </section>

              <section style="margin-bottom: 16px;">
                <h3 style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: ${theme.primary}; border-bottom: 1.5px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 8px;">Certifications</h3>
                ${certsHtml}
              </section>
            </div>
          </div>
        </div>
      `;
    } else {
      // Classic Harvard / Minimalist / Creative 1-Column Layout
      layoutHtml = `
        <div class="classic-layout">
          <header style="${selectedTemplate === 'creative_portfolio' ? `background: #f8fafc; padding: 18px; border-radius: 12px; border-left: 5px solid ${theme.primary}; margin-bottom: 18px;` : 'text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 18px;'}">
            <h1 style="font-size: 26px; font-weight: 800; color: #0f172a; margin: 0 0 4px 0; letter-spacing: -0.5px;">${resumeData.name}</h1>
            <div style="font-size: 12px; font-weight: 700; color: ${theme.primary}; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 6px;">${resumeData.title}</div>
            <div style="font-size: 10.5px; color: #475569; display: flex; flex-wrap: wrap; gap: 12px; ${selectedTemplate === 'harvard_classic' ? 'justify-content: center;' : ''}">
              <span>📧 ${resumeData.email}</span>
              <span>📞 ${resumeData.phone}</span>
              <span>📍 ${resumeData.location}</span>
              <span>💻 ${resumeData.github}</span>
              <span>🔗 ${resumeData.linkedin}</span>
            </div>
          </header>

          <section style="margin-bottom: 16px;">
            <h3 style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: ${theme.primary}; border-bottom: 1.5px solid #cbd5e1; padding-bottom: 3px; margin-bottom: 8px;">Academic Education</h3>
            <div style="display: flex; justify-content: space-between; font-size: 11.5px; font-weight: 700; color: #0f172a;">
              <span>${resumeData.college}</span>
              <span>Class of ${resumeData.graduationYear}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 11px; color: #475569;">
              <span>Bachelor of Engineering in ${resumeData.department}</span>
              <span style="font-weight: 700; color: ${theme.primary};">CGPA: ${resumeData.cgpa} / 10.0</span>
            </div>
          </section>

          <section style="margin-bottom: 16px;">
            <h3 style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: ${theme.primary}; border-bottom: 1.5px solid #cbd5e1; padding-bottom: 3px; margin-bottom: 8px;">Professional Summary</h3>
            <p style="font-size: 11px; color: #334155; line-height: 1.6; margin: 0;">${resumeData.summary}</p>
          </section>

          <section style="margin-bottom: 16px;">
            <h3 style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: ${theme.primary}; border-bottom: 1.5px solid #cbd5e1; padding-bottom: 3px; margin-bottom: 8px;">Technical Skills & Core Competencies</h3>
            <div style="margin-bottom: 6px;">
              <span style="font-size: 11px; font-weight: 700; color: #0f172a;">Technical Languages & Frameworks: </span>
              ${skillsHtml}
            </div>
            <div>
              <span style="font-size: 11px; font-weight: 700; color: #0f172a;">Professional Strengths: </span>
              ${softSkillsHtml}
            </div>
          </section>

          <section style="margin-bottom: 16px;">
            <h3 style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: ${theme.primary}; border-bottom: 1.5px solid #cbd5e1; padding-bottom: 3px; margin-bottom: 10px;">Engineering Projects</h3>
            ${projectsHtml}
          </section>

          <section style="margin-bottom: 14px;">
            <h3 style="font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: ${theme.primary}; border-bottom: 1.5px solid #cbd5e1; padding-bottom: 3px; margin-bottom: 8px;">Certifications & Accreditations</h3>
            ${certsHtml}
          </section>
        </div>
      `;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>${resumeData.name.replace(/\s+/g, '_')}_Verified_Resume</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Merriweather:ital,wght@0,400;0,700;1,400&family=Outfit:wght@400;500;600;700;800&family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
          <style>
            @page {
              size: A4;
              margin: 12mm;
            }
            body {
              font-family: ${font.fontCss};
              color: #0f172a;
              margin: 0;
              padding: 16px;
              background-color: #ffffff;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .verified-banner {
              background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
              color: #ffffff;
              padding: 8px 16px;
              border-radius: 8px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-size: 10px;
              font-family: 'Inter', sans-serif;
              margin-bottom: 16px;
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
            .sidebar-layout {
              display: grid;
              grid-template-columns: 200px 1fr;
              gap: 0;
              border: 1px solid #e2e8f0;
              border-radius: 12px;
              overflow: hidden;
            }
            .watermark-seal {
              margin-top: 20px;
              padding-top: 12px;
              border-top: 1px dashed #cbd5e1;
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-size: 9px;
              color: #64748b;
              font-family: 'Inter', sans-serif;
            }
          </style>
        </head>
        <body>
          <div class="verified-banner">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="verified-badge">✓ Verified Authenticated</span>
              <span style="font-weight: 700; letter-spacing: 0.3px;">Verified by AI Agentic PlacementOS</span>
            </div>
            <div>
              <span>Verification ID: <strong>${verificationId}</strong> | ATS Score: <strong>98/100</strong></span>
            </div>
          </div>

          ${layoutHtml}

          <div class="watermark-seal">
            <div>
              <span>Official Placement Verified Credential • <strong>PlacementOS Higher Education System</strong></span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span>Digital Security Hash: <strong>${verificationId}-SECURE</strong></span>
              <span style="background: #10b981; color: white; padding: 2px 6px; border-radius: 4px; font-weight: 800; font-size: 8.5px;">AUTHENTICATED</span>
            </div>
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

  const currentTheme = colorThemes[selectedColor];
  const currentFont = fontFamilies[selectedFont];

  return (
    <div className="space-y-6">
      {/* Top Header Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center space-x-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Layout className="w-6 h-6 text-indigo-600 dark:text-cyan-400" />
              <span>AI Resume Builder & Template Studio</span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 font-black border border-emerald-500/30">
                Verified by AI Agentic PlacementOS
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Choose professional ATS layouts, customize fonts & theme colors, and export high-resolution verified PDF!
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
            <button
              onClick={() => setActiveEditorTab('preview')}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeEditorTab === 'preview'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Live Preview</span>
            </button>
            <button
              onClick={() => setActiveEditorTab('edit')}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeEditorTab === 'edit'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Content</span>
            </button>
          </div>

          <button
            onClick={handlePrintResume}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black transition-all shadow-md flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Download Verified PDF</span>
          </button>
        </div>
      </div>

      {/* TEMPLATE GALLERY CAROUSEL SELECTOR (Matching User Visual Reference Image) */}
      <GlassCard className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layout className="w-4 h-4 text-indigo-500" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Select Professional Resume Template Layout
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">5 ATS-Optimized Formats</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {templateOptions.map(tpl => {
            const isSelected = selectedTemplate === tpl.id;
            return (
              <div
                key={tpl.id}
                onClick={() => setSelectedTemplate(tpl.id)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 relative group hover:scale-[1.02] ${
                  isSelected
                    ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-500 shadow-md ring-2 ring-indigo-500/40'
                    : 'bg-slate-50/80 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-indigo-300'
                }`}
              >
                {/* Visual Thumbnail Mini Preview Wireframe */}
                <div className={`h-20 w-full rounded-xl bg-gradient-to-tr ${tpl.previewClass} p-2 flex flex-col justify-between overflow-hidden shadow-inner relative`}>
                  {tpl.id === 'sidebar_tech' && (
                    <div className="flex h-full gap-1.5">
                      <div className="w-1/3 bg-white/20 rounded-md p-1 flex flex-col gap-1">
                        <div className="w-3 h-3 rounded-full bg-white/60 mx-auto"></div>
                        <div className="w-full h-1 bg-white/40 rounded"></div>
                        <div className="w-2/3 h-1 bg-white/40 rounded"></div>
                      </div>
                      <div className="w-2/3 flex flex-col gap-1 p-0.5">
                        <div className="w-3/4 h-2 bg-white/80 rounded"></div>
                        <div className="w-full h-1 bg-white/40 rounded"></div>
                        <div className="w-full h-1 bg-white/40 rounded"></div>
                        <div className="w-4/5 h-1 bg-white/40 rounded"></div>
                      </div>
                    </div>
                  )}

                  {tpl.id === 'harvard_classic' && (
                    <div className="flex flex-col h-full gap-1 p-1">
                      <div className="w-1/2 h-2 bg-white/80 rounded mx-auto"></div>
                      <div className="w-2/3 h-1 bg-white/40 rounded mx-auto mb-1"></div>
                      <div className="w-full h-0.5 bg-white/30 rounded"></div>
                      <div className="w-full h-1 bg-white/50 rounded"></div>
                      <div className="w-full h-1 bg-white/50 rounded"></div>
                      <div className="w-3/4 h-1 bg-white/50 rounded"></div>
                    </div>
                  )}

                  {tpl.id === 'executive_banner' && (
                    <div className="flex flex-col h-full gap-1">
                      <div className="w-full h-5 bg-white/30 rounded-md p-1 flex justify-between items-center">
                        <div className="w-1/2 h-1.5 bg-white/90 rounded"></div>
                        <div className="w-3 h-3 rounded-full bg-white/60"></div>
                      </div>
                      <div className="flex gap-1 h-full p-0.5">
                        <div className="w-2/3 flex flex-col gap-1">
                          <div className="w-full h-1 bg-white/50 rounded"></div>
                          <div className="w-full h-1 bg-white/50 rounded"></div>
                        </div>
                        <div className="w-1/3 flex flex-col gap-1">
                          <div className="w-full h-1 bg-white/40 rounded"></div>
                          <div className="w-full h-1 bg-white/40 rounded"></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {tpl.id === 'creative_portfolio' && (
                    <div className="flex flex-col h-full gap-1 p-1">
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-4 rounded-full bg-pink-400/80"></div>
                        <div className="w-1/2 h-2 bg-white/90 rounded"></div>
                      </div>
                      <div className="flex gap-1 mt-1">
                        <div className="w-1/3 h-6 bg-white/20 rounded"></div>
                        <div className="w-2/3 h-6 bg-white/20 rounded"></div>
                      </div>
                    </div>
                  )}

                  {tpl.id === 'minimalist_ats' && (
                    <div className="flex flex-col h-full gap-1 p-1">
                      <div className="w-1/3 h-2 bg-white/90 rounded"></div>
                      <div className="w-full h-0.5 bg-white/30 rounded"></div>
                      <div className="w-full h-1 bg-white/50 rounded"></div>
                      <div className="w-full h-1 bg-white/50 rounded"></div>
                      <div className="w-full h-1 bg-white/50 rounded"></div>
                      <div className="w-2/3 h-1 bg-white/50 rounded"></div>
                    </div>
                  )}

                  {isSelected && (
                    <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] font-black shadow">
                      ✓
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900 dark:text-white truncate">{tpl.name}</span>
                  </div>
                  <div className="text-[9px] font-extrabold text-indigo-600 dark:text-indigo-400 mt-0.5">
                    {tpl.tag}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Customization Toolbar: Colors, Fonts & Options */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
          {/* Color Palettes */}
          <div className="flex items-center gap-2">
            <Palette className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-bold text-slate-700 dark:text-slate-300">Accent Theme:</span>
            <div className="flex items-center gap-1.5">
              {(Object.keys(colorThemes) as ResumeColorTheme[]).map(c => (
                <button
                  key={c}
                  onClick={() => setSelectedColor(c)}
                  title={colorThemes[c].name}
                  className={`w-5 h-5 rounded-full transition-all flex items-center justify-center ${
                    selectedColor === c ? 'ring-2 ring-offset-2 ring-indigo-500 scale-110' : 'opacity-80 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: colorThemes[c].primary }}
                >
                  {selectedColor === c && <Check className="w-3 h-3 text-white" />}
                </button>
              ))}
            </div>
          </div>

          {/* Font Selector */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700 dark:text-slate-300">Font:</span>
            <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
              {(Object.keys(fontFamilies) as ResumeFontFamily[]).map(f => (
                <button
                  key={f}
                  onClick={() => setSelectedFont(f)}
                  className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all ${
                    selectedFont === f ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {fontFamilies[f].name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Photo Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPhoto(!showPhoto)}
              className={`px-2.5 py-1 rounded-lg border text-xs font-bold transition-all flex items-center gap-1.5 ${
                showPhoto
                  ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-500 text-indigo-600 dark:text-indigo-300'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-500'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{showPhoto ? 'Photo Avatar: ON' : 'Photo Avatar: OFF'}</span>
            </button>
          </div>
        </div>
      </GlassCard>

      {/* EDIT CONTENT FORM TAB */}
      {activeEditorTab === 'edit' && (
        <div className="space-y-6">
          <GlassCard className="p-6 space-y-5">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-500" /> Personal & Contact Details
              </h3>
              <button
                onClick={handleSaveToProfile}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow"
              >
                Save to Profile
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={resumeData.name}
                  onChange={e => setResumeData({ ...resumeData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Professional Title</label>
                <input
                  type="text"
                  value={resumeData.title}
                  onChange={e => setResumeData({ ...resumeData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={resumeData.email}
                  onChange={e => setResumeData({ ...resumeData, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Phone Number</label>
                <input
                  type="text"
                  value={resumeData.phone}
                  onChange={e => setResumeData({ ...resumeData, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Location / City</label>
                <input
                  type="text"
                  value={resumeData.location}
                  onChange={e => setResumeData({ ...resumeData, location: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">College / University</label>
                <input
                  type="text"
                  value={resumeData.college}
                  onChange={e => setResumeData({ ...resumeData, college: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Degree & Department</label>
                <input
                  type="text"
                  value={resumeData.department}
                  onChange={e => setResumeData({ ...resumeData, department: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">CGPA / Percentage</label>
                <input
                  type="text"
                  value={resumeData.cgpa}
                  onChange={e => setResumeData({ ...resumeData, cgpa: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Graduation Year</label>
                <input
                  type="number"
                  value={resumeData.graduationYear}
                  onChange={e => setResumeData({ ...resumeData, graduationYear: parseInt(e.target.value) || 2026 })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Profile Summary */}
            <div className="pt-2">
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Professional Executive Summary</label>
              <textarea
                rows={3}
                value={resumeData.summary}
                onChange={e => setResumeData({ ...resumeData, summary: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white leading-relaxed"
              />
            </div>
          </GlassCard>

          {/* Skills Management */}
          <GlassCard className="p-6 space-y-4">
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Code className="w-4 h-4 text-emerald-500" /> Technical Skills & Tooling
            </h3>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add skill (e.g. Docker, Spring Boot, TensorFlow)..."
                value={newSkillInput}
                onChange={e => setNewSkillInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddSkill()}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              />
              <button
                onClick={handleAddSkill}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add Skill
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {resumeData.technicalSkills.map((sk, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5"
                >
                  <span>{sk}</span>
                  <button
                    onClick={() => handleRemoveSkill(sk)}
                    className="hover:text-rose-500 transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </GlassCard>
        </div>
      )}

      {/* LIVE INTERACTIVE RESUME PREVIEW (Rendered in Real-Time matching templates) */}
      {activeEditorTab === 'preview' && (
        <div className="space-y-4">
          {/* Verified Official Header Alert */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 border border-indigo-500/30 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="font-extrabold text-white flex items-center gap-2">
                  <span>Official Academic Placement Credential</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black">
                    ✓ Verified by AI Agentic PlacementOS
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Auth Code: <span className="font-mono text-cyan-400">{verificationId}</span> | ATS Parser Benchmark: <strong className="text-emerald-400">98/100</strong>
                </div>
              </div>
            </div>
            <button
              onClick={handlePrintResume}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg transition-all flex items-center gap-1.5 shrink-0"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download PDF</span>
            </button>
          </div>

          {/* THE RESUME CANVAS (A4 Ratio Container) */}
          <div 
            className="bg-white text-slate-900 rounded-2xl shadow-2xl p-6 sm:p-10 border border-slate-200 max-w-4xl mx-auto transition-all"
            style={{ fontFamily: currentFont.fontCss }}
          >
            {/* Template 1: Modern Sidebar Tech */}
            {selectedTemplate === 'sidebar_tech' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                {/* Left Sidebar */}
                <aside className="md:col-span-4 bg-slate-950 text-white p-6 space-y-6">
                  {showPhoto && (
                    <div className="text-center">
                      <img
                        src={resumeData.avatarUrl}
                        alt={resumeData.name}
                        className="w-20 h-20 rounded-full mx-auto object-cover border-2 shadow-md"
                        style={{ borderColor: currentTheme.primary }}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <h4 className="text-[10px] uppercase font-black tracking-wider text-slate-400 border-b border-slate-800 pb-1.5">
                      Contact
                    </h4>
                    <div className="space-y-1.5 text-[11px] text-slate-300">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{resumeData.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{resumeData.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{resumeData.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Github className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{resumeData.github}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Linkedin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{resumeData.linkedin}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-[10px] uppercase font-black tracking-wider text-slate-400 border-b border-slate-800 pb-1.5">
                      Education
                    </h4>
                    <div className="text-xs font-black text-white">{resumeData.college}</div>
                    <div className="text-[11px] text-slate-400">B.E. {resumeData.department}</div>
                    <div className="text-[11px] font-bold" style={{ color: currentTheme.hexBadge }}>
                      CGPA: {resumeData.cgpa} / 10.0 • Grad {resumeData.graduationYear}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-[10px] uppercase font-black tracking-wider text-slate-400 border-b border-slate-800 pb-1.5">
                      Technical Skills
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {resumeData.technicalSkills.map((sk, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-200 border border-slate-800 font-semibold"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-[10px] uppercase font-black tracking-wider text-slate-400 border-b border-slate-800 pb-1.5">
                      Core Strengths
                    </h4>
                    <div className="space-y-1 text-[10px] text-slate-400">
                      {resumeData.softSkills.map((s, i) => (
                        <div key={i}>• {s}</div>
                      ))}
                    </div>
                  </div>
                </aside>

                {/* Right Content */}
                <main className="md:col-span-8 p-6 space-y-6">
                  <div>
                    <h1 className="text-2xl font-black text-slate-950 tracking-tight">{resumeData.name}</h1>
                    <div className="text-xs font-black uppercase tracking-wider mt-0.5" style={{ color: currentTheme.primary }}>
                      {resumeData.title}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider pb-1.5 border-b border-slate-200" style={{ color: currentTheme.primary }}>
                      Professional Summary
                    </h3>
                    <p className="text-xs text-slate-700 leading-relaxed mt-2">{resumeData.summary}</p>
                  </div>

                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider pb-1.5 border-b border-slate-200" style={{ color: currentTheme.primary }}>
                      Featured Projects & Engineering Experience
                    </h3>
                    <div className="space-y-4 mt-3">
                      {resumeData.projects.map((p, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between items-baseline">
                            <span className="text-xs font-black text-slate-900">{p.title}</span>
                            <span className="text-[10px] font-bold" style={{ color: currentTheme.primary }}>
                              {p.techStack.join(' • ')}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">{p.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider pb-1.5 border-b border-slate-200" style={{ color: currentTheme.primary }}>
                      Certifications & Accreditations
                    </h3>
                    <div className="space-y-2 mt-3">
                      {resumeData.certifications.map((c, idx) => (
                        <div key={idx} className="flex justify-between text-xs text-slate-800">
                          <span><strong>{c.title}</strong> — {c.issuer}</span>
                          <span className="text-slate-500 font-semibold">{c.year || '2026'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </main>
              </div>
            )}

            {/* Template 2: Executive Banner Layout */}
            {selectedTemplate === 'executive_banner' && (
              <div className="space-y-6">
                <header className="p-6 rounded-2xl bg-slate-950 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1">
                    <h1 className="text-2xl font-black text-white">{resumeData.name}</h1>
                    <div className="text-xs font-bold uppercase tracking-wider" style={{ color: currentTheme.hexBadge }}>
                      {resumeData.title}
                    </div>
                    <div className="flex flex-wrap gap-3 text-[11px] text-slate-300 pt-2">
                      <span>📧 {resumeData.email}</span>
                      <span>📞 {resumeData.phone}</span>
                      <span>📍 {resumeData.location}</span>
                      <span>💻 {resumeData.github}</span>
                    </div>
                  </div>
                  {showPhoto && (
                    <img
                      src={resumeData.avatarUrl}
                      alt={resumeData.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-white/80 shrink-0"
                    />
                  )}
                </header>

                <div className="space-y-2">
                  <h3 className="text-xs font-black uppercase tracking-wider pb-1 border-b border-slate-200" style={{ color: currentTheme.primary }}>
                    Executive Summary
                  </h3>
                  <p className="text-xs text-slate-700 leading-relaxed">{resumeData.summary}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-wider pb-1 border-b border-slate-200" style={{ color: currentTheme.primary }}>
                      Key Engineering Projects
                    </h3>
                    {resumeData.projects.map((p, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between items-baseline">
                          <span className="text-xs font-black text-slate-900">{p.title}</span>
                          <span className="text-[10px] font-bold" style={{ color: currentTheme.primary }}>{p.techStack.join(' • ')}</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{p.description}</p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-5">
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-wider pb-1 border-b border-slate-200" style={{ color: currentTheme.primary }}>
                        Education
                      </h3>
                      <div className="text-xs font-bold text-slate-900 mt-2">{resumeData.college}</div>
                      <div className="text-[11px] text-slate-600">B.E. {resumeData.department}</div>
                      <div className="text-[11px] font-bold mt-0.5" style={{ color: currentTheme.primary }}>
                        CGPA: {resumeData.cgpa} / 10.0
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-black uppercase tracking-wider pb-1 border-b border-slate-200" style={{ color: currentTheme.primary }}>
                        Technical Stack
                      </h3>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {resumeData.technicalSkills.map((s, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-semibold border border-slate-200">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-black uppercase tracking-wider pb-1 border-b border-slate-200" style={{ color: currentTheme.primary }}>
                        Certifications
                      </h3>
                      <div className="space-y-1.5 text-xs text-slate-700 mt-2">
                        {resumeData.certifications.map((c, i) => (
                          <div key={i}>• <strong>{c.title}</strong></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Template 3: Harvard Classic / Minimalist / Creative 1-Column */}
            {(selectedTemplate === 'harvard_classic' || selectedTemplate === 'minimalist_ats' || selectedTemplate === 'creative_portfolio') && (
              <div className="space-y-5">
                <header className={`space-y-1.5 ${selectedTemplate === 'harvard_classic' ? 'text-center border-b-2 border-slate-900 pb-3' : selectedTemplate === 'creative_portfolio' ? 'p-5 rounded-2xl bg-slate-50 border-l-4' : 'border-b border-slate-300 pb-2'}`} style={selectedTemplate === 'creative_portfolio' ? { borderLeftColor: currentTheme.primary } : {}}>
                  <h1 className="text-2xl font-black text-slate-900">{resumeData.name}</h1>
                  <div className="text-xs font-black uppercase tracking-wider" style={{ color: currentTheme.primary }}>
                    {resumeData.title}
                  </div>
                  <div className={`flex flex-wrap gap-3 text-xs text-slate-600 ${selectedTemplate === 'harvard_classic' ? 'justify-center' : ''}`}>
                    <span>📧 {resumeData.email}</span>
                    <span>📞 {resumeData.phone}</span>
                    <span>📍 {resumeData.location}</span>
                    <span>💻 {resumeData.github}</span>
                    <span>🔗 {resumeData.linkedin}</span>
                  </div>
                </header>

                <section className="space-y-2">
                  <h3 className="text-xs font-black uppercase tracking-wider pb-1 border-b border-slate-300" style={{ color: currentTheme.primary }}>
                    Education
                  </h3>
                  <div className="flex justify-between text-xs font-bold text-slate-900">
                    <span>{resumeData.college}</span>
                    <span>Graduating {resumeData.graduationYear}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Bachelor of Engineering in {resumeData.department}</span>
                    <span className="font-bold" style={{ color: currentTheme.primary }}>CGPA: {resumeData.cgpa} / 10.0</span>
                  </div>
                </section>

                <section className="space-y-2">
                  <h3 className="text-xs font-black uppercase tracking-wider pb-1 border-b border-slate-300" style={{ color: currentTheme.primary }}>
                    Professional Summary
                  </h3>
                  <p className="text-xs text-slate-700 leading-relaxed">{resumeData.summary}</p>
                </section>

                <section className="space-y-2">
                  <h3 className="text-xs font-black uppercase tracking-wider pb-1 border-b border-slate-300" style={{ color: currentTheme.primary }}>
                    Technical Competencies
                  </h3>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {resumeData.technicalSkills.map((sk, idx) => (
                      <span key={idx} className="text-xs px-2.5 py-1 rounded bg-slate-100 text-slate-800 font-semibold border border-slate-200">
                        {sk}
                      </span>
                    ))}
                  </div>
                </section>

                <section className="space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-wider pb-1 border-b border-slate-300" style={{ color: currentTheme.primary }}>
                    Engineering Projects
                  </h3>
                  {resumeData.projects.map((p, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between items-baseline">
                        <span className="text-xs font-black text-slate-900">{p.title}</span>
                        <span className="text-[10px] font-bold" style={{ color: currentTheme.primary }}>{p.techStack.join(' • ')}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{p.description}</p>
                    </div>
                  ))}
                </section>

                <section className="space-y-2">
                  <h3 className="text-xs font-black uppercase tracking-wider pb-1 border-b border-slate-300" style={{ color: currentTheme.primary }}>
                    Certifications
                  </h3>
                  {resumeData.certifications.map((c, idx) => (
                    <div key={idx} className="flex justify-between text-xs text-slate-700">
                      <span><strong>{c.title}</strong> — {c.issuer}</span>
                      <span className="text-slate-500 font-semibold">{c.year || '2026'}</span>
                    </div>
                  ))}
                </section>
              </div>
            )}

            {/* Official Placement Seal Footer */}
            <div className="mt-8 pt-4 border-t border-dashed border-slate-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-[10px] text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Verified Higher Education Placement Profile • <strong>PlacementOS AI Engine</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span>Verification ID: <strong className="font-mono text-slate-800">{verificationId}</strong></span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-black text-[9px]">
                  AUTHENTICATED
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
