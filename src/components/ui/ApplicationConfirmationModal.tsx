import React, { useState } from 'react';
import { JobOpportunity } from '../../types';
import { CheckCircle2, ExternalLink, Sparkles, Building2, MapPin, DollarSign, X, ArrowRight, ShieldCheck } from 'lucide-react';

interface ApplicationConfirmationModalProps {
  isOpen: boolean;
  job: JobOpportunity | null;
  onClose: () => void;
  onConfirmApplied: (jobId: string, refNo?: string) => void;
}

export const ApplicationConfirmationModal: React.FC<ApplicationConfirmationModalProps> = ({
  isOpen,
  job,
  onClose,
  onConfirmApplied
}) => {
  const [refNo, setRefNo] = useState('');

  if (!isOpen || !job) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmApplied(job.id, refNo.trim() || undefined);
    setRefNo('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-slate-900 border border-indigo-500/30 text-white shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-cyan-500 to-emerald-400 p-0.5 shadow-lg shadow-indigo-500/30">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-emerald-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold border border-emerald-500/40">
                Official Career Portal Redirected
              </span>
            </div>
            <h3 className="text-lg font-black text-white mt-0.5">Confirm Your Job Application</h3>
          </div>
        </div>

        {/* Job Details Card */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-base font-black text-white">{job.role}</h4>
              <div className="text-xs font-bold text-cyan-300 flex items-center gap-1.5 mt-0.5">
                <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>{job.company}</span>
              </div>
            </div>
            <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              {job.matchPercentage || 95}% Skill Match
            </span>
          </div>

          <div className="text-xs text-slate-300 flex flex-wrap gap-4 pt-1 font-medium">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.location}
            </span>
          </div>
        </div>

        {/* Application Ref Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-indigo-200 mb-1.5">
              Application Registration / Reference Number (Optional)
            </label>
            <input
              type="text"
              value={refNo}
              onChange={(e) => setRefNo(e.target.value)}
              placeholder="e.g. APP-2026-8912 or REG98214"
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-indigo-500/40 text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-indigo-400 transition-all"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Did you submit your application on {job.company}'s official portal? Mark it here to update your Placement Officer portal & track interview calls!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-2 transition-all transform hover:scale-[1.02]"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Yes, I Submitted Application!</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 text-xs font-bold transition-all text-center"
            >
              Still Browsing / Saved Later
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
