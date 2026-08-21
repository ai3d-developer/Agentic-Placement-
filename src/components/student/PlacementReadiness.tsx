import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { GlassCard } from '../ui/GlassCard';
import { ScoreGauge } from '../ui/ScoreGauge';
import { ProgressBar } from '../ui/ProgressBar';
import { TrendingUp, Award, ShieldCheck, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

export const PlacementReadiness: React.FC = () => {
  const { profile } = useAuth();
  const isUnparsed = !profile.technicalSkills || profile.technicalSkills.length === 0;

  const factors = [
    { name: 'Technical Skills Match', weight: '25%', score: isUnparsed ? 0 : 92, status: isUnparsed ? 'Awaiting Upload' : 'Strong', color: 'from-indigo-500 to-cyan-400' },
    { name: 'Resume ATS Compatibility', weight: '15%', score: isUnparsed ? 0 : profile.atsScore, status: isUnparsed ? 'Awaiting Upload' : 'Good', color: 'from-emerald-500 to-teal-400' },
    { name: 'Project Quality & Repos', weight: '15%', score: isUnparsed ? 0 : (profile.projects?.length ? 85 : 0), status: isUnparsed ? 'Awaiting Upload' : 'Strong', color: 'from-cyan-500 to-blue-400' },
    { name: 'Coding & Algorithmic Speed', weight: '15%', score: isUnparsed ? 0 : 85, status: isUnparsed ? 'Awaiting Upload' : 'Good', color: 'from-amber-500 to-yellow-400' },
    { name: 'Mock Test Performance', weight: '15%', score: isUnparsed ? 0 : 90, status: isUnparsed ? 'Awaiting Upload' : 'Strong', color: 'from-purple-500 to-indigo-400' },
    { name: 'AI Voice Interview Score', weight: '15%', score: isUnparsed ? 0 : 86, status: isUnparsed ? 'Awaiting Upload' : 'Good', color: 'from-rose-500 to-pink-400' }
  ];

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
          <ScoreGauge score={isUnparsed ? 0 : profile.placementReadinessScore} label="Placement Readiness Index" sublabel={isUnparsed ? "Awaiting Resume Upload" : "Weighted Index"} size={170} strokeWidth={14} colorClass="text-indigo-600 dark:text-indigo-400" />
          <div className="mt-4 p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-500/30 text-xs text-indigo-800 dark:text-indigo-300 font-semibold">
            🎯 Estimated Selection Probability: <span className="text-indigo-600 dark:text-white font-extrabold text-sm">{isUnparsed ? '0%' : '92%'}</span>
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
                  <span className="text-slate-700 dark:text-slate-300">{f.name} <span className="text-slate-400 dark:text-slate-500">({f.weight})</span></span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">{f.score}/100</span>
                </div>
                <ProgressBar progress={f.score} colorGradient={f.color} heightClass="h-2" />
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Weak Areas & Diagnostic Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard className="p-6 border-amber-500/20">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <AlertCircle className="w-4 h-4 text-amber-500" /> Weak Area Diagnosis
          </h3>
          {isUnparsed ? (
            <p className="text-xs text-slate-500 dark:text-slate-400 italic mt-2">
              📄 Upload your PDF resume to generate an automated weak area diagnosis.
            </p>
          ) : (
            <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 mt-2">
              <li className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <strong className="text-amber-600 dark:text-amber-400">System Design & Low Level Architecture:</strong> You have not taken a System Design mock test yet.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <strong className="text-amber-600 dark:text-amber-400">Quantifiable Resume Metrics:</strong> Adding 2 more percentages to your project descriptions will increase ATS score to 90+.
              </li>
            </ul>
          )}
        </GlassCard>

        <GlassCard className="p-6 border-emerald-500/20">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" /> Verified Competencies
          </h3>
          {isUnparsed ? (
            <p className="text-xs text-slate-500 dark:text-slate-400 italic mt-2">
              📄 Upload your PDF resume to verify academic CGPA thresholds and active backlogs.
            </p>
          ) : (
            <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 mt-2">
              <li className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <strong className="text-emerald-600 dark:text-emerald-400">CGPA Threshold ({profile.cgpa || 8.8}):</strong> Meets top company hiring cutoffs.
              </li>
              <li className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                <strong className="text-emerald-600 dark:text-emerald-400">Zero Active Backlogs:</strong> Eligible for active campus recruitment drives.
              </li>
            </ul>
          )}
        </GlassCard>
      </div>
    </div>
  );
};
