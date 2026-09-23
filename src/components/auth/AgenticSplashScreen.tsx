import React, { useEffect } from 'react';
import { Sparkles, Bot, Cpu } from 'lucide-react';

interface AgenticSplashScreenProps {
  onComplete: () => void;
}

export const AgenticSplashScreen: React.FC<AgenticSplashScreenProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white flex flex-col items-center justify-center relative overflow-hidden font-sans select-none animate-in fade-in duration-300">
      {/* CSS Keyframes for the 2-second glowing progress and animation */}
      <style>{`
        @keyframes scaleUpFade {
          0% {
            opacity: 0;
            transform: scale(0.92);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes splashProgress {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }
        .animate-scale-fade {
          animation: scaleUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Dynamic Ambient Glowing Lights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-indigo-600/25 via-purple-600/20 to-cyan-400/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-10 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.15] pointer-events-none" 
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(99, 102, 241, 0.3) 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Center Container */}
      <div className="z-10 flex flex-col items-center text-center px-6 max-w-xl animate-scale-fade">
        
        {/* Animated AI Glowing Icon */}
        <div className="relative mb-6">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-cyan-400 p-1 shadow-2xl shadow-indigo-500/30">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center relative overflow-hidden">
              <Bot className="w-12 h-12 text-cyan-400 animate-pulse" />
              <div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full" 
                style={{ animation: 'shimmer 1.8s infinite' }}
              />
            </div>
          </div>
          <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-black text-[10px] uppercase tracking-wider shadow-lg">
            v4.2 AI
          </span>
        </div>

        {/* Top Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold mb-4 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>PlacementOS Autonomous Core</span>
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        </div>

        {/* Center Main Text */}
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight mb-3 drop-shadow-md">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">
            AI Placement Agentic AI Engine
          </span>
        </h1>

        <p className="text-xs sm:text-sm text-slate-400 font-medium max-w-md leading-relaxed mb-6">
          Enterprise AI Placement Operating System for Higher Education
        </p>

        {/* 2-Second Progress Bar */}
        <div className="w-56 h-1.5 bg-slate-800 rounded-full overflow-hidden mb-3">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 rounded-full"
            style={{
              animation: 'splashProgress 2s linear forwards'
            }}
          />
        </div>

        <div className="text-[11px] text-slate-500 font-bold tracking-wider uppercase flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
          <span>Initializing Portal...</span>
        </div>
      </div>
    </div>
  );
};
