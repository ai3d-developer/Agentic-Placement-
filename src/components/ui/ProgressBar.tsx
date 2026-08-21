import React from 'react';

interface ProgressBarProps {
  progress: number;
  label?: string;
  subText?: string;
  colorGradient?: string;
  heightClass?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  label,
  subText,
  colorGradient = 'from-indigo-500 to-cyan-400',
  heightClass = 'h-2.5'
}) => {
  const clamped = Math.min(100, Math.max(0, progress));

  return (
    <div className="w-full space-y-1.5">
      {(label || subText) && (
        <div className="flex justify-between items-center text-xs font-medium">
          {label && <span className="text-slate-700 dark:text-slate-300">{label}</span>}
          {subText && <span className="text-indigo-600 dark:text-indigo-400 font-bold">{subText}</span>}
        </div>
      )}
      <div className={`w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden ${heightClass}`}>
        <div
          className={`bg-gradient-to-r ${colorGradient} h-full transition-all duration-700 ease-out rounded-full`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
