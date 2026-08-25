import React, { useState, useEffect } from 'react';
import { Sparkles, Cpu, ShieldCheck, Zap, Bot, ArrowRight } from 'lucide-react';

interface IntroSplashScreenProps {
  onEnterWebsite: () => void;
}

export const IntroSplashScreen: React.FC<IntroSplashScreenProps> = ({ onEnterWebsite }) => {
  const [countdown, setCountdown] = useState(2);
  const [typedText, setTypedText] = useState('');
  const [typingDone, setTypingDone] = useState(false);

  const INTRO_MSG = "Hi! I'm your AI Agentic Placement Officer. 🎓";

  // Typewriter effect
  useEffect(() => {
    let i = 0;
    const tw = setInterval(() => {
      if (i < INTRO_MSG.length) {
        setTypedText(INTRO_MSG.slice(0, i + 1));
        i++;
      } else {
        clearInterval(tw);
        setTypingDone(true);
      }
    }, 45);
    return () => clearInterval(tw);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimeout(() => {
            onEnterWebsite();
          }, 300);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onEnterWebsite]);

  return (
    <div className="relative min-h-screen w-full bg-slate-50 text-slate-800 flex flex-col items-center justify-center overflow-hidden font-sans select-none">
      {/* Injecting CSS Keyframes for Left to Right text animation */}
      <style>{`
        @keyframes slideFromLeft {
          0% {
            transform: translateX(-50px);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes widthProgress {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }
        .animate-slide-left-right {
          animation: slideFromLeft 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .delay-1 {
          animation-delay: 0.1s;
        }
        .delay-2 {
          animation-delay: 0.2s;
        }
        .delay-3 {
          animation-delay: 0.3s;
        }
        .delay-4 {
          animation-delay: 0.4s;
        }
      `}</style>

      {/* Background Soft Glowing Lights (Light Theme Colors) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-500/10 via-purple-400/5 to-cyan-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Light Cyber Grid Pattern Background */}
      <div 
        className="absolute inset-0 opacity-[0.4] pointer-events-none" 
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(99, 102, 241, 0.15) 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Top Header Badge - Slides Left to Right */}
      <div className="z-10 mb-8 flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 text-xs font-semibold tracking-wide shadow-sm opacity-0 animate-slide-left-right">
        <Bot className="w-4 h-4 text-indigo-500 animate-bounce" />
        <span>PlacementOS AI v4.2 • Autonomous Placement Operating System</span>
        <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
      </div>

      {/* Centered Main Hero Container */}
      <div className="z-10 max-w-3xl w-full mx-auto px-6 text-center flex flex-col items-center">
        {/* Animated AI Agent Icon */}
        <div className="relative mb-6 opacity-0 animate-slide-left-right delay-1">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-600 to-cyan-400 p-0.5 shadow-xl shadow-indigo-500/10">
            <div className="w-full h-full bg-white rounded-[23px] flex items-center justify-center relative overflow-hidden">
              <Sparkles className="w-12 h-12 text-indigo-600 animate-pulse" />
              <div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent -translate-x-full" 
                style={{ animation: 'shimmer 2.5s infinite' }}
              />
            </div>
          </div>
          <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-indigo-600 text-white font-extrabold text-[10px] uppercase tracking-wider shadow-md">
            AI AGENT
          </span>
        </div>

        {/* Title - Slides Left to Right */}
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-3 opacity-0 animate-slide-left-right delay-2">
          AI Placement <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500">Agent Interface</span>
        </h1>

        {/* Description - Slides Left to Right */}
        <p className="text-sm sm:text-base text-slate-500 max-w-xl mb-8 leading-relaxed font-medium opacity-0 animate-slide-left-right delay-3">
          Enterprise AI Placement Operating System for Higher Education. Automated Resume Screening, Skill Gap Analysis, Mock Interviews &amp; Placement Analytics.
        </p>

        {/* ── Typewriter Greeting Banner ── */}
        <div className="flex items-center gap-4 px-6 py-4 mb-8 rounded-2xl bg-white border-2 border-indigo-200 shadow-lg w-full max-w-2xl opacity-0 animate-slide-left-right delay-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/40">
            <Bot className="w-7 h-7 text-white" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-indigo-700 tracking-tight text-left leading-snug">
            {typedText}
            {!typingDone && (
              <span className="inline-block w-0.5 h-6 ml-1 bg-indigo-500 align-middle animate-pulse" />
            )}
          </p>
        </div>

        {/* Highlight Badges - Slides Left to Right */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10 w-full max-w-xl opacity-0 animate-slide-left-right delay-4">
          <div className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center gap-2.5 text-left">
            <Cpu className="w-5 h-5 text-indigo-600 shrink-0" />
            <div>
              <div className="text-xs font-bold text-slate-800">AI Intelligence</div>
              <div className="text-[10px] text-slate-500">Gemini AI Driven</div>
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center gap-2.5 text-left">
            <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />
            <div>
              <div className="text-xs font-bold text-slate-800">Cloud Sync</div>
              <div className="text-[10px] text-slate-500">Firebase Firestore</div>
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center gap-2.5 text-left col-span-2 sm:col-span-1">
            <Zap className="w-5 h-5 text-indigo-600 shrink-0" />
            <div>
              <div className="text-xs font-bold text-slate-800">Instant Access</div>
              <div className="text-[10px] text-slate-500">Multi-Role Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Sleek Left-to-Right Progress Bar at the very bottom edge of screen */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-200">
        <div 
          className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400"
          style={{
            animation: 'widthProgress 2s linear forwards'
          }}
        />
      </div>

      {/* Bottom text redirecting notice */}
      <div className="absolute bottom-6 text-center text-[11px] text-slate-400 font-bold tracking-wide flex items-center gap-1.5 opacity-0 animate-slide-left-right delay-4">
        <span>Connecting to Portal</span>
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-ping" />
      </div>
    </div>
  );
};
