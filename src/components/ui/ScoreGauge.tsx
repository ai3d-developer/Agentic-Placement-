import React from 'react';

interface ScoreGaugeProps {
  score: number;
  label: string;
  sublabel?: string;
  size?: number;
  strokeWidth?: number;
  colorClass?: string;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  label,
  sublabel,
  size = 140,
  strokeWidth = 10,
  colorClass = 'text-indigo-500'
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="stroke-slate-200 dark:stroke-slate-800"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className={`${colorClass} transition-all duration-1000 ease-out`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">{score}%</span>
          {sublabel && <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-medium">{sublabel}</span>}
        </div>
      </div>
      <span className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</span>
    </div>
  );
};
