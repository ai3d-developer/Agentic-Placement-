import React, { useEffect, useRef } from 'react';
import { JobOpportunity } from '../../types';
import { sampleJobs, generateDynamicJobsForStudent } from '../../services/mockData';
import { useAuth } from '../../context/AuthContext';
import { calculateDynamicMatch } from '../../utils/jobMatch';
import { getCompanyPortalDeepLink } from '../../utils/jobLinks';
import {
  Sparkles,
  Building2,
  MapPin,
  ExternalLink,
  X,
  Briefcase,
  Flame,
  CheckCircle2,
  Zap
} from 'lucide-react';

interface CongratulationsJobsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToJobs: () => void;
}

export const CongratulationsJobsModal: React.FC<CongratulationsJobsModalProps> = ({
  isOpen,
  onClose,
  onNavigateToJobs
}) => {
  const { profile } = useAuth();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Play browser audio celebratory sound using Web Audio API
  useEffect(() => {
    if (!isOpen) return;

    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        const ctx = new AudioContext();
        
        const playPop = (freq: number, delay: number, dur: number) => {
          setTimeout(() => {
            if (ctx.state === 'suspended') ctx.resume();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + dur);
            gain.gain.setValueAtTime(0.2, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + dur);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + dur);
          }, delay);
        };

        // Firecracker burst tones
        playPop(523.25, 100, 0.2); // C5
        playPop(659.25, 250, 0.2); // E5
        playPop(783.99, 400, 0.2); // G5
        playPop(1046.50, 550, 0.3); // C6
      }
    } catch (e) {
      // Audio context might be restricted before user gesture
    }
  }, [isOpen]);

  // Canvas Fireworks & Patasu particle simulation
  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (canvas) {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', handleResize);

    // Particle types for fireworks/crackers burst
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      radius: number;
      alpha: number;
      decay: number;
      gravity: number;
      isSpark?: boolean;
    }

    const particles: Particle[] = [];
    const colors = ['#6366f1', '#a855f7', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#f43f5e', '#ffffff'];

    const createFirework = (targetX: number, targetY: number, count = 60) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 8 + 2;
        particles.push({
          x: targetX,
          y: targetY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: colors[Math.floor(Math.random() * colors.length)],
          radius: Math.random() * 3 + 1.5,
          alpha: 1,
          decay: Math.random() * 0.02 + 0.01,
          gravity: 0.12,
          isSpark: Math.random() > 0.6
        });
      }
    };

    // Trigger initial multi-point firework bursts
    createFirework(width * 0.25, height * 0.35, 70);
    createFirework(width * 0.75, height * 0.35, 70);
    createFirework(width * 0.5, height * 0.25, 90);

    let timerCount = 0;
    const render = () => {
      timerCount++;
      ctx.clearRect(0, 0, width, height);

      // Periodically trigger new mini fireworks
      if (timerCount % 45 === 0 && timerCount < 300) {
        createFirework(
          Math.random() * (width * 0.8) + width * 0.1,
          Math.random() * (height * 0.5) + height * 0.1,
          50
        );
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.98;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = p.isSpark ? 12 : 6;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      if (particles.length > 0 || timerCount < 300) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Dynamic jobs for this student's department + real skills, merged with static jobs (EXACT SAME AS WEBAPP / JOB BOARD)
  const dynamicJobs = generateDynamicJobsForStudent(profile);
  const dynamicIds = new Set(dynamicJobs.map(j => j.id));
  const filteredStatic = sampleJobs.filter(j => !dynamicIds.has(j.id));
  const allAvailableJobs = dynamicJobs.length > 0 ? [...dynamicJobs, ...filteredStatic] : sampleJobs;

  // Filter matched jobs for current student profile
  const matchedJobs = allAvailableJobs.map(job => {
    const { matchPct, matched } = calculateDynamicMatch(job.skillsRequired, profile);
    return {
      ...job,
      matchPct,
      matchedSkills: matched
    };
  }).filter(j => j.matchPct > 0)
    .sort((a, b) => b.matchPct - a.matchPct);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-300">
      {/* Background Canvas for Crackers & Fireworks */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-0"
      />

      <div className="relative z-10 w-full max-w-2xl bg-white dark:bg-slate-900 border-2 border-indigo-500/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-300 ring-4 ring-indigo-500/20">
        
        {/* Celebration Header */}
        <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 p-6 text-white text-center shrink-0 overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-400/20 rounded-full blur-2xl pointer-events-none" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-all cursor-pointer"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-black uppercase tracking-wider mb-2 text-white border border-white/30 animate-bounce">
            <Flame className="w-3.5 h-3.5 text-amber-300" />
            <span>Profile Updated Successfully!</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-md">
            🎉 Congratulations!
          </h2>
          <p className="text-xs sm:text-sm text-indigo-100 mt-1 max-w-md mx-auto font-medium">
            Your Profile &amp; Skills have been synced! We found <strong>{matchedJobs.length} top job openings</strong> matched to your skills.
          </p>

          <div className="mt-3 flex flex-wrap justify-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 text-[11px] font-bold">
              ✓ {profile.technicalSkills?.length || 0} Skills Detected
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/30 text-cyan-200 border border-cyan-400/40 text-[11px] font-bold">
              ⚡ Up to {matchedJobs[0]?.matchPct || 95}% Skill Match
            </span>
          </div>
        </div>

        {/* Modal Body: Matched Jobs List */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3 flex-1 bg-slate-50 dark:bg-slate-950/60">
          <div className="flex items-center justify-between pb-1">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
              <span>Top Verified Placement Drives for You</span>
            </span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
              100% Active Drives
            </span>
          </div>

          {matchedJobs.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              No direct job matches found yet. Add more skills to unlock personalized opportunities!
            </div>
          ) : (
            matchedJobs.slice(0, 4).map(job => (
              <div
                key={job.id}
                className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 transition-all shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-black text-slate-900 dark:text-white">{job.role}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-300">
                      {job.company}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300">
                      {job.matchPct}% Match
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 flex flex-wrap gap-2.5">
                    <span>📍 {job.location}</span>
                    <span>👥 {job.vacancies || '25 Openings'}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {job.skillsRequired.slice(0, 4).map((sk, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    const targetUrl = getCompanyPortalDeepLink(job.company, job.role, job.source, job.applyLink);
                    window.open(targetUrl, '_blank', 'noopener,noreferrer');
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-1 shrink-0 w-full sm:w-auto justify-center cursor-pointer"
                >
                  <span>Apply Now</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-3 shrink-0">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Showing top curated matches tailored to your branch &amp; skills
          </span>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onNavigateToJobs();
              }}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-black shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Briefcase className="w-4 h-4" />
              <span>Explore All Verified Jobs →</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
