import React, { useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Shield, Server, Cpu, Building2, Plus, CheckCircle2, Activity, ListFilter, Settings, Zap } from 'lucide-react';
import { N8nWorkflowControlPanel } from '../ui/N8nWorkflowControlPanel';

interface SuperAdminDashboardProps {
  activeTab?: string;
}

export const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ activeTab = 'super_admin' }) => {
  const [colleges, setColleges] = useState([
    { id: 'c1', name: 'National Institute of Technology', code: 'NIT-01', students: 1200, status: 'Active' },
    { id: 'c2', name: 'BITS Pilani', code: 'BITS-02', students: 1500, status: 'Active' },
    { id: 'c3', name: 'Anna University', code: 'AU-03', students: 2200, status: 'Active' }
  ]);

  const logs = [
    { time: '16:34:12', action: 'ATS Resume Parsing', status: 'Success (142ms)', model: 'Local ATS Engine v2' },
    { time: '16:32:05', action: 'Job Ingestion Feed', status: 'Success (+14 Jobs)', source: 'Google Careers RSS' },
    { time: '16:30:00', action: 'AI Mock Interview Evaluation', status: 'Success (420ms)', model: 'Gemini-2.5-Flash Evaluator' }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex justify-between items-center p-6 rounded-2xl bg-gradient-to-r from-amber-900 via-slate-900 to-amber-950 text-white border border-amber-500/30 shadow-xl">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <Shield className="w-6 h-6 text-amber-500 animate-pulse" /> Super Admin Command Center
          </h2>
          <p className="text-xs text-amber-200 mt-1">Audit global platform health, monitor active Docker instances, manage college MoUs, and configure LLM API keys.</p>
        </div>
      </div>

      {/* RENDER PLATFORM MANAGEMENT */}
      {activeTab === 'super_admin' && (
        <>
          {/* Global System Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <GlassCard glow className="p-5 text-center">
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white">42</div>
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">Registered Colleges</div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">100% Verified</div>
            </GlassCard>
            <GlassCard className="p-5 text-center">
              <div className="text-3xl font-extrabold text-cyan-600 dark:text-cyan-400">1,280</div>
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">Active Job Listings</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">Auto-Refreshed Daily</div>
            </GlassCard>
            <GlassCard className="p-5 text-center">
              <div className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">98,450</div>
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">AI Invocations / Mo</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">ATS + Interviews</div>
            </GlassCard>
            <GlassCard className="p-5 text-center">
              <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">99.98%</div>
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">System Uptime</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Docker Swarm Cluster</div>
            </GlassCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassCard className="p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                <Building2 className="w-4 h-4 text-amber-500" /> Active Partners MoU
              </h3>
              <div className="space-y-2">
                {colleges.map(c => (
                  <div key={c.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{c.name}</div>
                      <div className="text-[10px] text-slate-500">{c.code} • {c.students} Students</div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold uppercase">{c.status}</span>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                <Activity className="w-4 h-4 text-amber-500" /> AI Pipeline Audit Logs
              </h3>
              <div className="space-y-2.5">
                {logs.map((l, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
                    <div className="flex justify-between items-center font-bold">
                      <span className="text-amber-500 font-mono">{l.action}</span>
                      <span className="text-[9px] text-slate-500">{l.time}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 flex justify-between mt-1">
                      <span>Model: {l.model}</span>
                      <span className="text-emerald-500 font-bold">{l.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </>
      )}

      {/* RENDER USER/COLLEGE MANAGEMENT */}
      {activeTab === 'user_management' && (
        <GlassCard className="p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <Building2 className="w-5 h-5 text-amber-500" /> Partner Institution Deployments & MoUs
          </h3>
          <div className="space-y-3">
            {colleges.map(c => (
              <div key={c.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
                <div>
                  <div className="font-bold text-slate-950 dark:text-slate-100">{c.name} ({c.code})</div>
                  <div className="text-[11px] text-slate-400 mt-1">Status: Active Service • Linked Moodle/SIS • {c.students} Active Candidates</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => alert(`Synchronizing roster data for ${c.name}...`)} className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 font-bold cursor-pointer">Sync Roster</button>
                  <button onClick={() => alert(`Suspending service contract for ${c.name}...`)} className="px-3 py-1.5 rounded-lg bg-rose-600/10 hover:bg-rose-600/20 text-rose-450 border border-rose-500/20 font-bold cursor-pointer">Suspend</button>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* RENDER SYSTEM CONFIG SETTINGS */}
      {activeTab === 'system_settings' && (
        <GlassCard className="p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <Settings className="w-5 h-5 text-amber-500" /> Platform Infrastructure Settings & LLM API Keys
          </h3>
          <div className="space-y-4 text-xs font-semibold">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
              <h4 className="font-bold text-slate-950 dark:text-slate-100">LLM Engines API Keys Configuration</h4>
              <div className="space-y-2 font-medium">
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1 font-bold">OpenRouter/Gemini API Key</label>
                  <input type="password" value="••••••••••••••••••••••••••••••••" readOnly className="w-full p-2 rounded bg-slate-900 border border-slate-800 text-amber-500 outline-none font-mono" />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
              <h4 className="font-bold text-slate-950 dark:text-slate-100">System Dependencies Health check</h4>
              <div className="space-y-2.5 font-medium">
                <div className="flex justify-between items-center">
                  <span>Firebase Connection Status</span>
                  <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[10px] font-bold">Connected ✅</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>n8n Cloud Webhook Orchestration</span>
                  <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[10px] font-bold">Live Synced ✅</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Docker Swarm Container Status</span>
                  <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[10px] font-bold">12/12 Running ✅</span>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      )}

      {/* RENDER N8N INTEGRATION PANEL */}
      {activeTab === 'n8n_integration' && (
        <N8nWorkflowControlPanel />
      )}
    </div>
  );
};
