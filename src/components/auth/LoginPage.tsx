import React, { useState } from 'react';
import { UserRole } from '../../types';
import { Sparkles, Lock, Mail, ArrowRight, GraduationCap, Building2, UserCheck, User, Briefcase, Shield, CheckCircle2, Bot, ArrowLeft } from 'lucide-react';
import { signInWithGoogle } from '../../services/firebase';

interface LoginPageProps {
  onLoginSuccess: (role: UserRole, email: string, displayName?: string) => void;
  onBackToIntro: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onBackToIntro }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [email, setEmail] = useState('arun.kumar@placementos.edu');
  const [password, setPassword] = useState('••••••••••••');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const rolesConfig: Record<UserRole, { label: string; desc: string; icon: React.ReactNode; defaultEmail: string; badgeColor: string }> = {
    student: {
      label: 'Student Portal',
      desc: 'Resume Analysis, AI Coach & Mock Interviews',
      icon: <GraduationCap className="w-5 h-5 text-indigo-500" />,
      defaultEmail: 'arun.kumar@placementos.edu',
      badgeColor: 'border-indigo-500/30 bg-indigo-500/10 text-indigo-400'
    },
    placement_officer: {
      label: 'Placement Officer',
      desc: 'Manage Drives, Drives Analytics & Approvals',
      icon: <Building2 className="w-5 h-5 text-cyan-500" />,
      defaultEmail: 'officer@placementos.edu',
      badgeColor: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400'
    },
    hod: {
      label: 'HOD Portal',
      desc: 'Department Analytics & Student Approvals',
      icon: <UserCheck className="w-5 h-5 text-emerald-500" />,
      defaultEmail: 'hod.cse@placementos.edu',
      badgeColor: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
    },
    faculty: {
      label: 'Faculty Mentor',
      desc: 'Student Mentorship & Verification',
      icon: <User className="w-5 h-5 text-purple-500" />,
      defaultEmail: 'faculty.mentor@placementos.edu',
      badgeColor: 'border-purple-500/30 bg-purple-500/10 text-purple-400'
    },
    recruiter: {
      label: 'Recruiter / HR',
      desc: 'Post Jobs & AI Candidate Matchmaking',
      icon: <Briefcase className="w-5 h-5 text-rose-500" />,
      defaultEmail: 'recruiter@techcorp.com',
      badgeColor: 'border-rose-500/30 bg-rose-500/10 text-rose-400'
    },
    super_admin: {
      label: 'Super Admin',
      desc: 'System Configuration & Security Controls',
      icon: <Shield className="w-5 h-5 text-amber-500" />,
      defaultEmail: 'superadmin@placementos.edu',
      badgeColor: 'border-amber-500/30 bg-amber-500/10 text-amber-400'
    }
  };

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setEmail(rolesConfig[role].defaultEmail);
    setAuthError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onLoginSuccess(selectedRole, email);
    }, 600);
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    if (role === 'student') return; // Do not allow student demo login
    setSelectedRole(role);
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onLoginSuccess(role, rolesConfig[role].defaultEmail);
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
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-gradient-to-r from-indigo-500 to-cyan-500 text-white uppercase">
                AI Login
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onBackToIntro}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>AI Intro Agent Page</span>
        </button>
      </header>

      {/* Main Login Card Section */}
      <main className="z-10 flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: AI Placement Highlights & Features */}
          <div className="lg:col-span-5 space-y-6 hidden lg:block pr-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
              <Bot className="w-3.5 h-3.5 text-cyan-400" />
              <span>PlacementOS AI Gateway</span>
            </div>

            <h2 className="text-3xl font-extrabold text-white leading-tight">
              Sign In to Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">
                AI Placement Portal
              </span>
            </h2>

            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Select your role to access customized dashboards, automated resume matching, skill analytics, and AI mock interview evaluations.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-bold text-slate-200">AI Resume Analyser</div>
                  <div className="text-slate-400 text-[11px]">Smart ATS scoring & skill gap detection</div>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-bold text-slate-200">AI Mock Interview & Aptitude Tests</div>
                  <div className="text-slate-400 text-[11px]">Practice with instant AI-powered feedback</div>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-bold text-slate-200">Live Job Matching & Drive Alerts</div>
                  <div className="text-slate-400 text-[11px]">Auto-matched jobs & placement drive notifications</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Login Box */}
          <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
            
            {/* Step 1: Select User Role Tabs */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                1. Select Portal Role
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(Object.keys(rolesConfig) as UserRole[]).map((r) => {
                  const conf = rolesConfig[r];
                  const isSelected = selectedRole === r;
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => handleRoleSelect(r)}
                      className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-500/10'
                          : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        {conf.icon}
                        {isSelected && <span className="w-2 h-2 rounded-full bg-cyan-400" />}
                      </div>
                      <div className="text-xs font-bold truncate">{conf.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Role Badge Header */}
            <div className={`p-3 rounded-2xl border ${rolesConfig[selectedRole].badgeColor} mb-6 flex items-center justify-between`}>
              <div className="flex items-center space-x-2">
                {rolesConfig[selectedRole].icon}
                <div>
                  <div className="text-xs font-bold">{rolesConfig[selectedRole].label}</div>
                  <div className="text-[11px] opacity-80">{rolesConfig[selectedRole].desc}</div>
                </div>
              </div>
              {selectedRole !== 'student' && (
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin(selectedRole)}
                  className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold transition-all shrink-0 cursor-pointer"
                >
                  ⚡ Quick Demo Login
                </button>
              )}
            </div>

            {/* Step 2: Login Form or Google Sign-In */}
            {selectedRole === 'student' ? (
              <div className="space-y-6 py-4 flex flex-col items-center">
                <div className="text-center space-y-2">
                  <h3 className="text-sm font-bold text-slate-300">Secure Student Portal Access</h3>
                  <p className="text-[11px] text-slate-400 max-w-sm leading-relaxed">
                    Log in with your Google account. Your profile data, resume analysis, and placements activities will auto-sync to Cloud Firestore.
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
                  className="w-full max-w-sm flex items-center justify-center space-x-3.5 py-3 px-6 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 hover:text-slate-900 font-bold text-sm shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer disabled:opacity-50 select-none transform hover:-translate-y-0.5"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                      <span className="text-slate-600 font-medium">Signing in with Google...</span>
                    </div>
                  ) : (
                    <>
                      <div className="bg-slate-50 border border-slate-100 rounded-lg p-1.5 flex items-center justify-center">
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
                      <span className="tracking-wide text-slate-700 font-bold text-sm">Continue with Google</span>
                    </>
                  )}
                </button>
                
                <div className="text-[10px] text-slate-500 flex items-center space-x-1.5">
                  <Lock className="w-3 h-3 text-emerald-500" />
                  <span>Secured with Firebase Google OAuth</span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@placementos.edu"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-bold text-slate-300">Password</label>
                    <a href="#" onClick={(e) => { e.preventDefault(); alert('Demo password pre-filled. Click "Sign In" or "Quick Demo Login" to enter.'); }} className="text-[11px] text-indigo-400 hover:underline">
                      Forgot Password?
                    </a>
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

                <div className="flex items-center justify-between text-xs py-1">
                  <label className="flex items-center space-x-2 text-slate-400 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-0" />
                    <span>Remember session</span>
                  </label>
                  <span className="text-[10px] text-slate-500">Secured with SSL & Firebase</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 cursor-pointer transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Logging into {rolesConfig[selectedRole].label}...</span>
                  ) : (
                    <>
                      <span>Sign In to {rolesConfig[selectedRole].label}</span>
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
        PlacementOS AI System • Multi-Role Access Control
      </footer>
    </div>
  );
};
