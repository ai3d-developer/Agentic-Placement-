import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { GlassCard } from '../ui/GlassCard';
import { ScoreGauge } from '../ui/ScoreGauge';
import { ProgressBar } from '../ui/ProgressBar';
import { TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';

// ─── Score helpers ────────────────────────────────────────────────────────────

/** codingLevel → 0-100 score */
const codingLevelToScore = (level: string): number => {
  switch (level) {
    case 'Expert':       return 96;
    case 'Advanced':     return 82;
    case 'Intermediate': return 65;
    default:             return 40; // Beginner / unknown
  }
};

/** Number of skills → 0-100 score */
const technicalSkillsScore = (skills: string[]): number => {
  const n = skills?.length || 0;
  if (n === 0)  return 0;
  if (n <= 3)   return 40 + n * 5;
  if (n <= 7)   return 55 + (n - 3) * 6;
  if (n <= 12)  return 79 + (n - 7) * 2;
  return Math.min(89 + (n - 12), 97);
};

/** Projects quality → 0-100 score */
const projectQualityScore = (
  projects: Array<{ title: string; description: string; techStack: string[]; githubUrl?: string }>
): number => {
  if (!projects || projects.length === 0) return 0;
  let score = Math.min(projects.length * 15, 60);
  projects.forEach(p => {
    if (p.githubUrl)          score += 8;
    score += Math.min((p.techStack?.length || 0) * 2, 10);
  });
  return Math.min(score, 100);
};

/** Certifications + codingLevel → mock test proxy score */
const mockTestScore = (
  certifications: Array<{ title: string; issuer: string; year: number }>,
  codingLevel: string
): number => {
  const certBonus   = Math.min((certifications?.length || 0) * 15, 60);
  const codingBonus = codingLevelToScore(codingLevel) * 0.4;
  return Math.min(Math.round(certBonus + codingBonus), 100);
};

// ─── Component ────────────────────────────────────────────────────────────────

export const PlacementReadiness: React.FC = () => {
  const { profile } = useAuth();

  const isParsed = !!(profile.technicalSkills && profile.technicalSkills.length > 0);

  // Individual factor scores
  const techScore   = isParsed ? technicalSkillsScore(profile.technicalSkills)            : 0;
  const atsScore    = isParsed ? Math.min(Math.round(profile.atsScore || 0), 100)         : 0;
  const projScore   = isParsed ? projectQualityScore(profile.projects || [])              : 0;
  const codingScore = isParsed ? codingLevelToScore(profile.codingLevel)                  : 0;
  const mockScore   = isParsed ? mockTestScore(profile.certifications || [], profile.codingLevel) : 0;
  const voiceScore  = isParsed ? Math.min(Math.max(profile.communicationScore || 0, 0), 100)      : 0;

  // Weighted index: Tech 25% | ATS 15% | Projects 15% | Coding 15% | Mock 15% | Voice 15%
  const weightedIndex = isParsed
    ? Math.round(
        techScore   * 0.25 +
        atsScore    * 0.15 +
        projScore   * 0.15 +
        codingScore * 0.15 +
        mockScore   * 0.15 +
        voiceScore  * 0.15
      )
    : 0;

  // Estimated selection probability
  const selectionProb = isParsed ? Math.min(Math.round(weightedIndex * 1.05), 99) : 0;

  const factors = [
    {
      name: 'Technical Skills Match', weight: '25%', score: techScore,
      detail: isParsed ? `${profile.technicalSkills.length} skills listed` : 'Awaiting Upload',
      color: 'from-indigo-500 to-cyan-400',
    },
    {
      name: 'Resume ATS Compatibility', weight: '15%', score: atsScore,
      detail: isParsed ? `ATS score: ${atsScore}` : 'Awaiting Upload',
      color: 'from-emerald-500 to-teal-400',
    },
    {
      name: 'Project Quality & Repos', weight: '15%', score: projScore,
      detail: isParsed ? `${profile.projects?.length || 0} project(s) added` : 'Awaiting Upload',
      color: 'from-cyan-500 to-blue-400',
    },
    {
      name: 'Coding & Algorithmic Speed', weight: '15%', score: codingScore,
      detail: isParsed ? `Level: ${profile.codingLevel}` : 'Awaiting Upload',
      color: 'from-amber-500 to-yellow-400',
    },
    {
      name: 'Mock Test Performance', weight: '15%', score: mockScore,
      detail: isParsed ? `${profile.certifications?.length || 0} certification(s)` : 'Awaiting Upload',
      color: 'from-purple-500 to-indigo-400',
    },
    {
      name: 'AI Voice Interview Score', weight: '15%', score: voiceScore,
      detail: isParsed
        ? voiceScore > 0 ? `Communication: ${voiceScore}/100` : 'Complete a voice session'
        : 'Awaiting Upload',
      color: 'from-rose-500 to-pink-400',
    },
  ];

  // Dynamic weak area diagnosis
  const weakAreas: { label: string; tip: string }[] = [];
  if (isParsed) {
    if (techScore < 70)
      weakAreas.push({ label: 'Technical Skills Depth', tip: `Only ${profile.technicalSkills.length} skill(s) found. Add more domain-specific skills to your resume.` });
    if (atsScore < 75)
      weakAreas.push({ label: 'ATS Keyword Coverage', tip: 'Add quantified metrics and role-specific keywords to push ATS score above 75.' });
    if (projScore < 60)
      weakAreas.push({ label: 'Project Portfolio', tip: 'Add at least 3 projects with public GitHub links and clear tech stacks.' });
    if (mockScore < 60)
      weakAreas.push({ label: 'Mock Test & Certifications', tip: 'Complete at least 2 certifications (AWS, HackerRank, etc.) to strengthen this parameter.' });
    if (voiceScore < 60)
      weakAreas.push({ label: 'AI Voice Interview', tip: 'Complete a Voice & Text Interview session in the AI Interview module to register a score.' });
    if (weakAreas.length === 0)
      weakAreas.push({ label: 'No Critical Weak Areas 🎉', tip: 'All parameters are strong. Keep maintaining your skills and project pipeline.' });
  }

  // Dynamic verified competencies
  const competencies: { label: string; value: string }[] = [];
  if (isParsed) {
    if (profile.cgpa && profile.cgpa >= 7.5)
      competencies.push({ label: `CGPA Threshold (${profile.cgpa})`, value: profile.cgpa >= 8.0 ? 'Meets top company hiring cutoffs.' : 'Eligible for mid-tier placements.' });
    if (!profile.backlogs || profile.backlogs === 0)
      competencies.push({ label: 'Zero Active Backlogs', value: 'Eligible for active campus recruitment drives.' });
    if (profile.github)
      competencies.push({ label: 'GitHub Profile Linked', value: profile.github.replace('https://github.com/', 'github.com/') });
    if (profile.linkedin)
      competencies.push({ label: 'LinkedIn Connected', value: 'Professional network profile verified.' });
    if ((profile.certifications?.length || 0) > 0)
      competencies.push({ label: `${profile.certifications.length} Certification(s) Verified`, value: profile.certifications.map(c => c.title).join(', ') });
    if (competencies.length === 0)
      competencies.push({ label: 'Profile Incomplete', value: 'Add CGPA, GitHub, LinkedIn and certifications for full verification.' });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-indigo-600 dark:text-indigo-400" /> Placement Readiness Index Matrix
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">Algorithmic readiness calculation based on 6 core hiring parameters</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Readiness Gauge */}
        <GlassCard glow className="p-6 flex flex-col items-center justify-center text-center">
          <ScoreGauge
            score={weightedIndex}
            label="Placement Readiness Index"
            sublabel={isParsed ? 'Weighted Index' : 'Awaiting Resume Upload'}
            size={170}
            strokeWidth={14}
            colorClass="text-indigo-600 dark:text-indigo-400"
          />
          <div className="mt-4 p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-500/30 text-xs text-indigo-800 dark:text-indigo-300 font-semibold">
            🎯 Estimated Selection Probability:{' '}
            <span className="text-indigo-600 dark:text-white font-extrabold text-sm">
              {isParsed ? `${selectionProb}%` : '0%'}
            </span>
          </div>
        </GlassCard>

        {/* Weighted Formula Breakdown */}
        <GlassCard className="p-6 lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
            Multi-Parameter Weighted Calculation Formula
          </h3>
          <div className="space-y-3">
            {factors.map((f, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-slate-700 dark:text-slate-300">
                    {f.name} <span className="text-slate-400 dark:text-slate-500">({f.weight})</span>
                    <span className="ml-2 text-[10px] font-medium text-slate-400 dark:text-slate-500 italic">— {f.detail}</span>
                  </span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold shrink-0 ml-2">{f.score}/100</span>
                </div>
                <ProgressBar progress={f.score} colorGradient={f.color} heightClass="h-2" />
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Weak Areas & Verified Competencies */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard className="p-6 border-amber-500/20">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <AlertCircle className="w-4 h-4 text-amber-500" /> Weak Area Diagnosis
          </h3>
          {!isParsed ? (
            <p className="text-xs text-slate-500 dark:text-slate-400 italic mt-2">
              📄 Upload your PDF resume to generate an automated weak area diagnosis.
            </p>
          ) : (
            <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 mt-2">
              {weakAreas.map((w, i) => (
                <li key={i} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                  <strong className="text-amber-600 dark:text-amber-400">{w.label}: </strong>{w.tip}
                </li>
              ))}
            </ul>
          )}
        </GlassCard>

        <GlassCard className="p-6 border-emerald-500/20">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" /> Verified Competencies
          </h3>
          {!isParsed ? (
            <p className="text-xs text-slate-500 dark:text-slate-400 italic mt-2">
              📄 Upload your PDF resume to verify academic CGPA thresholds and active backlogs.
            </p>
          ) : (
            <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 mt-2">
              {competencies.map((c, i) => (
                <li key={i} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                  <strong className="text-emerald-600 dark:text-emerald-400">{c.label}: </strong>{c.value}
                </li>
              ))}
            </ul>
          )}
        </GlassCard>
      </div>
    </div>
  );
};
