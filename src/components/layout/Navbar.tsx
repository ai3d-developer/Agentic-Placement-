import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Sparkles, Bell, Sun, Moon, User, Shield, GraduationCap, ChevronDown, PhoneCall, Building2, UserCheck, Briefcase, LogOut, Monitor } from 'lucide-react';
import { UserRole } from '../../types';

interface NavbarProps {
  onOpenTodayJobs?: () => void;
  onOpenOnboarding?: () => void;
  onLogout?: () => void;
  onBackToIntro?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenTodayJobs, onOpenOnboarding, onLogout, onBackToIntro }) => {
  const { role, setRole, profile, notifications } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const roleLabels: Record<UserRole, { label: string; icon: React.ReactNode; color: string }> = {
    student: { label: 'Student Portal', icon: <GraduationCap className="w-4 h-4" />, color: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-300 dark:border-indigo-500/30' },
    placement_officer: { label: 'Placement Officer', icon: <Building2 className="w-4 h-4" />, color: 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-500/20 dark:text-cyan-300 dark:border-cyan-500/30' },
    hod: { label: 'HOD Portal', icon: <UserCheck className="w-4 h-4" />, color: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30' },
    faculty: { label: 'Faculty Mentor', icon: <User className="w-4 h-4" />, color: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/20 dark:text-purple-300 dark:border-purple-500/30' },
    recruiter: { label: 'Recruiter / HR', icon: <Briefcase className="w-4 h-4" />, color: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/30' },
    super_admin: { label: 'Super Admin', icon: <Shield className="w-4 h-4" />, color: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30' }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/80 backdrop-blur-xl px-4 lg:px-8 py-3 flex items-center justify-between">
      {/* Brand Logo */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-md shadow-indigo-500/20">
          <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[10px] flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-cyan-400 animate-pulse" />
          </div>
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">PlacementOS</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white uppercase tracking-wider shadow-sm">
              AI System
            </span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">AI Placement Operating System for Higher Education</p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-3">
        {/* Setup Student Profile & Links Trigger */}
        {onOpenOnboarding && role === 'student' && (
          <button
            onClick={onOpenOnboarding}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-300 dark:border-indigo-500/30 text-xs font-bold hover:scale-105 transition-all shadow-sm"
            title="Setup Profile, Resume & Links"
          >
            <User className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Profile & Links</span>
          </button>
        )}

        {/* Today's Jobs Button Trigger */}
        {onOpenTodayJobs && (
          <button
            onClick={onOpenTodayJobs}
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/10 to-rose-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-bold hover:scale-105 transition-all shadow-sm"
            title="Open Today's Job Openings Pop-Up"
          >
            <span className="animate-bounce">🔥</span>
            <span>Today's Jobs</span>
          </button>
        )}

        {/* Static Role Label Badge */}
        <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border text-xs font-bold shadow-sm ${roleLabels[role].color}`}>
          {roleLabels[role].icon}
          <span>{roleLabels[role].label}</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-indigo-600 transition-all"
          >
            <Bell className="w-4.5 h-4.5" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center animate-bounce">
                {notifications.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-4 z-50">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800 mb-3">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" /> Notifications & AI Alerts
                </span>
                <span className="text-[10px] text-slate-400">{notifications.length} new</span>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1 text-xs">
                {notifications.map((n, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                    {n}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-indigo-600 transition-all"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5 text-indigo-600" />}
        </button>

        {/* Profile Avatar & Actions */}
        <div className="flex items-center space-x-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center font-bold text-white text-xs ring-2 ring-indigo-500/30">
            {profile.name.charAt(0)}
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-bold text-slate-900 dark:text-slate-200">{profile.name}</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">{profile.college}</div>
          </div>

          {onBackToIntro && (
            <button
              onClick={onBackToIntro}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-indigo-600 transition-all ml-1"
              title="Return to AI Intro Agent Page"
            >
              <Monitor className="w-4 h-4 text-cyan-500" />
            </button>
          )}

          {onLogout && (
            <button
              onClick={onLogout}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-rose-500 transition-all"
              title="Logout to Login Page"
            >
              <LogOut className="w-4 h-4 text-rose-500" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
