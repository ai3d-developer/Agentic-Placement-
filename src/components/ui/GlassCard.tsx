import React from 'react';
import { clsx } from 'clsx';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className, glow = false }) => {
  return (
    <div
      className={clsx(
        'rounded-2xl border transition-all duration-300 backdrop-blur-xl',
        'bg-white/80 border-slate-200/80 text-slate-900 shadow-md',
        'dark:bg-slate-900/60 dark:border-slate-800/80 dark:text-slate-100 dark:shadow-xl',
        'hover:border-slate-300 dark:hover:border-slate-700/80',
        glow && 'shadow-indigo-500/15 border-indigo-500/40 ring-1 ring-indigo-500/20',
        className
      )}
    >
      {children}
    </div>
  );
};
