import React, { useState } from 'react';
import { UserRole } from '../../types';
import { Sparkles, Lock, Mail, ArrowRight, GraduationCap, Building2, Briefcase, CheckCircle2, Bot } from 'lucide-react';
import { signInWithGoogle } from '../../services/firebase';

interface LoginPageProps {
  onLoginSuccess: (role: UserRole, email: string, displayName?: string) => void;
  onBackToIntro?: () => void;
}

type AvailableLoginRole = 'student' | 'placement_officer' | 'recruiter';

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [selectedRole, setSelectedRole] = useState<AvailableLoginRole>('student');
  const [email, setEmail] = useState('arun.kumar@placementos.edu');
  const [password, setPassword] = useState('••••••••••••');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const roleConfigs: Record<AvailableLoginRole, {
    title: string;
    subtitle: string;
    badge: string;
    icon: React.ReactNode;
    defaultEmail: string;
    borderColor: string;
    bgColor: string;
    textColor: string;
  }> = {
    student: {
      title: 'Student Portal',
      subtitle: 'Resume Analysis, AI Coach & Job Matching',
      badge: 'Student',
      icon: <GraduationCap className="w-5 h-5 text-indigo-400" />,
      defaultEmail: 'arun.kumar@placementos.edu',
      borderColor: 'border-indigo-500/30',
      bgColor: 'bg-indigo-500/10',
      textColor: 'text-indigo-400'
    },
    placement_officer: {
      title: 'Placement Officer Portal',
      subtitle: 'Manage Campus Drives & Placement Approvals',
      badge: 'Placement Officer',
      icon: <Building2 className="w-5 h-5 text-cyan-400" />,
      defaultEmail: 'officer@placementos.edu',
      borderColor: 'border-cyan-500/30',
      bgColor: 'bg-cyan-500/10',
      textColor: 'text-cyan-400'
    },
    recruiter: {
      title: 'Recruiter & HR Portal',
      subtitle: 'Post Jobs & AI Candidate Matchmaking',
      badge: 'Recruiter / HR',
      icon: <Briefcase className="w-5 h-5 text-rose-400" />,
      defaultEmail: 'recruiter@techcorp.com',
      borderColor: 'border-rose-500/30',
      bgColor: 'bg-rose-500/10',
      textColor: 'text-rose-400'
    }
  };

  const handleRoleChange = (role: AvailableLoginRole) => {
    setSelectedRole(role);
    setEmail(roleConfigs[role].defaultEmail);
    setAuthError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onLoginSuccess(selectedRole, email);
    }, 500);
  };

  const handleQuickDemoLogin = (role: AvailableLoginRole) => {
    setSelectedRole(role);
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onLoginSuccess(role, roleConfigs[role].defaultEmail);
    }, 400);
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    setAuthError(null);
    try {
      const user = await signInWithGoogle();
      if (user && user.email) {
        onLoginSuccess('student', user.email, user.displayName || undefined);
      } else {
        setAuthError('Authentication succeeded but Google did not return an email.');
      }
    } catch (error: any) {
      console.error('Google Sign-in failed:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        setAuthError('Sign-in popup closed before completion.');
      } else if (error.code === 'auth/cancelled-popup-request') {
        setAuthError('Sign-in request cancelled.');
      } else {
        setAuthError(error.message || 'Google Sign-in failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeConf = roleConfigs[selectedRole];

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Dynamic Ambient Lights */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navbar Header */}
      <header className="z-20 px-6 py-4 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-md">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4.5 h-4.5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-black text-white tracking-tight">PlacementOS</span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full font-extrabold bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 text-white uppercase shadow-sm">
                AI Placement Agentic AI
              </span>
            </div>
          </div>
        </div>

        <div className="text-xs text-indigo-300 font-bold hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30">
          <Bot className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />
          <span>AI Placement Agentic AI v4.2</span>
        </div>
      </header>

      {/* Main Login Card Section */}
      <main className="z-10 flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: AI Placement Highlights & Features */}
          <div className="lg:col-span-5 space-y-5 hidden lg:block pr-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/40 text-indigo-300 text-xs font-bold shadow-sm">
              <Bot className="w-4 h-4 text-cyan-400" />
              <span>AI Placement Agentic AI Engine</span>
            </div>

            <h2 className="text-3xl font-black text-white leading-tight tracking-tight">
              AI Placement <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">
                Agentic AI Portal
              </span>
            </h2>

            {/* Typewriter Greeting from Previous Version */}
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-indigo-500/30 text-xs text-slate-200 flex items-start space-x-3 shadow-inner">
              <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <div className="font-extrabold text-white text-xs flex items-center gap-1.5">
                  <span>AI Agentic Placement Officer 🎓</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Autonomous Higher Education Placement Operating System with real-time ATS scoring &amp; matched drives.
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Select your portal below (Student, Placement Officer, or Recruiter) to sign in:
            </p>

            <div className="space-y-2.5 pt-1">
              <div className="flex items-start space-x-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-bold text-slate-200">Student Portal</div>
                  <div className="text-slate-400 text-[11px]">AI Resume parsing, ATS scoring & job match alerts</div>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-bold text-slate-200">Placement Officer Portal</div>
                  <div className="text-slate-400 text-[11px]">Campus drive coordination & student approvals</div>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-bold text-slate-200">Recruiter & HR Portal</div>
                  <div className="text-slate-400 text-[11px]">Job postings & candidate AI skill matching</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 3 Role Selector & Login Box */}
          <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
            
            {/* 3 Main Role Selector Tabs */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                Select Your Login Portal (3 Options)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['student', 'placement_officer', 'recruiter'] as AvailableLoginRole[]).map((r) => {
                  const conf = roleConfigs[r];
                  const isSelected = selectedRole === r;
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => handleRoleChange(r)}
                      className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-500/10 ring-1 ring-indigo-500/50'
                          : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <div className="p-1.5 rounded-xl bg-slate-900/80 border border-slate-800">
                        {conf.icon}
                      </div>
                      <div className="text-[11px] font-bold truncate w-full">{conf.badge}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Role Header Card */}
            <div className={`p-3.5 rounded-2xl border ${activeConf.borderColor} ${activeConf.bgColor} ${activeConf.textColor} mb-5 flex items-center justify-between`}>
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-slate-950/60 border border-white/10 flex items-center justify-center">
                  {activeConf.icon}
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{activeConf.title}</div>
                  <div className="text-[11px] opacity-80">{activeConf.subtitle}</div>
                </div>
              </div>
              {selectedRole !== 'student' && (
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin(selectedRole)}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold transition-all shrink-0 cursor-pointer"
                >
                  ⚡ Quick Demo
                </button>
              )}
            </div>

            {/* Login Content Area */}
            {selectedRole === 'student' ? (
              <div className="space-y-4">
                {/* Google Sign-In Primary Section */}
                <div className="space-y-3 pb-4 flex flex-col items-center border-b border-slate-800">
                  <div className="text-center space-y-1">
                    <h3 className="text-sm font-bold text-slate-200">Sign in with Google</h3>
                    <p className="text-[11px] text-slate-400 max-w-sm leading-relaxed">
                      Instant student login via Google OAuth with Firestore cloud sync.
                    </p>
                  </div>

                  {authError && (
                    <div className="w-full p-3 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-xs text-center font-medium animate-pulse">
                      ⚠️ {authError}
                    </div>
                  )}

                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleGoogleSignIn}
                    className="w-full max-w-sm flex items-center justify-center space-x-3 py-2.5 px-6 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 hover:text-slate-900 font-bold text-sm shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer disabled:opacity-50 select-none transform hover:-translate-y-0.5"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                        <span className="text-slate-600 font-medium text-xs">Signing in...</span>
                      </div>
                    ) : (
                      <>
                        <div className="bg-slate-50 border border-slate-100 rounded-lg p-1 flex items-center justify-center">
                          <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <path
                              fill="#EA4335"
                              d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.6 15.02 1 12 1 7.35 1 3.37 3.67 1.39 7.56l3.79 2.93c.89-2.67 3.39-4.45 6.82-4.45z"
                            />
                            <path
                              fill="#4285F4"
                              d="M23.49 12.27c0-.81-.07-1.59-.2-2.34H12v4.43h6.48c-.28 1.48-1.12 2.74-2.38 3.59l3.7 2.87c2.16-2 3.69-4.94 3.69-8.55z"
                            />
                            <path
                              fill="#FBBC05"
                              d="M5.18 10.49c-.23-.69-.36-1.42-.36-2.18s.13-1.49.36-2.18L1.39 3.2A11.96 11.96 0 000 8.31c0 1.88.44 3.67 1.21 5.27l3.97-3.09z"
                            />
                            <path
                              fill="#34A853"
                              d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.7-2.87c-1.03.69-2.34 1.1-4.26 1.1-3.43 0-5.93-2.31-6.82-5.45l-3.79 2.93C3.37 20.33 7.35 23 12 23z"
                            />
                          </svg>
                        </div>
                        <span className="tracking-wide text-slate-700 font-bold text-xs">Continue with Google</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Email / Password Option for Student */}
                <form onSubmit={handleSubmit} className="space-y-3 pt-1">
                  <div className="text-center">
                    <span className="text-[11px] font-medium text-slate-400">or sign in with Student Credentials</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Student Email</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="student@placementos.edu"
                        className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 cursor-pointer transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Signing in as Student...</span>
                    ) : (
                      <>
                        <span>Sign In to Student Portal</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              /* Non-Student Roles Form (Placement Officer, Recruiter) */
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">{activeConf.badge} Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={activeConf.defaultEmail}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold text-slate-300">Password</label>
                    <span className="text-[10px] text-slate-400">Demo pre-filled</span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs py-0.5">
                  <label className="flex items-center space-x-2 text-slate-400 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-0" />
                    <span className="text-[11px]">Remember session</span>
                  </label>
                  <span className="text-[10px] text-slate-500">Secured with Firebase</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 cursor-pointer transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Logging into {activeConf.title}...</span>
                  ) : (
                    <>
                      <span>Sign In to {activeConf.badge}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="z-10 py-3 text-center text-xs text-slate-600 font-medium border-t border-slate-900 bg-slate-950/80">
        PlacementOS AI System • Student • Placement Officer • Recruiter Access
      </footer>
    </div>
  );
};
