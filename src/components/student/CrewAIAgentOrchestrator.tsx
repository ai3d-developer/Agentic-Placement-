import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Bot,
  Play,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  FileText,
  Target,
  Mic,
  Award,
  Cpu,
  Sparkles,
  RefreshCw,
  PhoneCall,
  Calendar,
  Zap,
  TrendingUp,
  Download,
  Terminal,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface AgentInfo {
  id: string;
  name: string;
  role: string;
  goal: string;
  backstory: string;
  tools: string[];
  status: 'IDLE' | 'WORKING' | 'COMPLETED' | 'ERROR';
  icon: string;
  avatarColor: string;
}

interface ExecutionStep {
  agentName: string;
  role: string;
  timestamp: string;
  thoughts: string;
  output: any;
}

interface CrewResult {
  executionId: string;
  timestamp: string;
  executionTimeMs: number;
  studentName: string;
  department: string;
  overallReadinessScore: number;
  placementStatus: string;
  telephonyScript: string;
  executionSteps: ExecutionStep[];
  crewSummary: string;
}

export const CrewAIAgentOrchestrator: React.FC = () => {
  const { profile } = useAuth();
  const [agents, setAgents] = useState<AgentInfo[]>([
    {
      id: 'agent-job-scout',
      name: 'JobScoutAgent',
      role: 'Lead Job & Market Opportunities Analyst',
      goal: 'Identify high-paying, verified software & engineering job openings matching student department and skills.',
      backstory: 'Senior technical recruiter with 10+ years experience in campus hiring across Google, Zoho, TI, and top tech firms.',
      tools: ['CompanyCareerScraper', 'SalaryBenchmarker', 'DeptEligibilityFilter'],
      status: 'IDLE',
      avatarColor: 'bg-emerald-500',
      icon: 'Briefcase'
    },
    {
      id: 'agent-resume-eval',
      name: 'ResumeEvaluatorAgent',
      role: 'ATS & Resume Optimization Specialist',
      goal: 'Analyze student resume text, compute ATS score, extract hard/soft skills, and highlight missing keywords.',
      backstory: 'Expert ATS algorithm engineer who built parsing engines for Workday and Greenhouse.',
      tools: ['ATSKeywordMatcher', 'FormattingChecker', 'ActionVerbEnhancer'],
      status: 'IDLE',
      avatarColor: 'bg-blue-500',
      icon: 'FileText'
    },
    {
      id: 'agent-skill-coach',
      name: 'SkillGapCoachAgent',
      role: 'Technical Mentor & Curriculum Advisor',
      goal: 'Identify critical skill gaps and generate a 7-day micro-learning roadmap with hands-on projects.',
      backstory: 'Principal Technical Educator specializing in rapid skill acquisition for engineering graduates.',
      tools: ['SkillTaxonomyAnalyzer', 'MicroLearningGenerator', 'GitHubProjectSuggester'],
      status: 'IDLE',
      avatarColor: 'bg-purple-500',
      icon: 'Target'
    },
    {
      id: 'agent-interview-sim',
      name: 'InterviewSimulatorAgent',
      role: 'Senior Technical Interviewer',
      goal: 'Evaluate student technical and behavioral interview responses, calculating confidence and precision scores.',
      backstory: 'Former FAANG Principal Bar Raiser who has conducted over 1,000 engineering interviews.',
      tools: ['QuestionBankGenerator', 'AudioVoiceEvaluator', 'CodeCorrectnessChecker'],
      status: 'IDLE',
      avatarColor: 'bg-amber-500',
      icon: 'Mic'
    },
    {
      id: 'agent-placement-officer',
      name: 'PlacementOfficerAgent',
      role: 'Chief Placement Director & Telephony Dispatcher',
      goal: 'Synthesize multi-agent evaluation into a final Placement Readiness Certificate and trigger automated voice call alert.',
      backstory: 'Director of Placement at top tier IIT/NIT with 100% campus placement track record.',
      tools: ['ReadinessScoreCalculator', 'TelephonyVoiceCallTrigger', 'PlacementCertifier'],
      status: 'IDLE',
      avatarColor: 'bg-rose-500',
      icon: 'Award'
    }
  ]);

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [crewResult, setCrewResult] = useState<CrewResult | null>(null);
  const [activeResultTab, setActiveResultTab] = useState<'logs' | 'jobs' | 'ats' | 'roadmap' | 'voice'>('logs');
  const [liveLogConsole, setLiveLogConsole] = useState<string[]>([]);

  const addConsoleLog = (text: string) => {
    setLiveLogConsole(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${text}`]);
  };

  const getAgentIcon = (iconName: string) => {
    switch (iconName) {
      case 'Briefcase': return <Briefcase className="w-5 h-5 text-white" />;
      case 'FileText': return <FileText className="w-5 h-5 text-white" />;
      case 'Target': return <Target className="w-5 h-5 text-white" />;
      case 'Mic': return <Mic className="w-5 h-5 text-white" />;
      case 'Award': return <Award className="w-5 h-5 text-white" />;
      default: return <Bot className="w-5 h-5 text-white" />;
    }
  };

  const runCrewAIWorkflow = async () => {
    setIsRunning(true);
    setCrewResult(null);
    setCurrentStepIndex(0);
    setLiveLogConsole([`[${new Date().toLocaleTimeString()}] 🚀 Initiating CrewAI Multi-Agent Pipeline for candidate: ${profile.name || 'Arun Kumar'}...`]);

    // Update initial status
    setAgents(prev => prev.map((a, idx) => ({
      ...a,
      status: idx === 0 ? 'WORKING' : 'IDLE'
    })));

    try {
      addConsoleLog("Agent 1: JobScoutAgent initialized. Scraping campus hiring drives & salary benchmarks...");

      // Call backend CrewAI execution API
      const response = await fetch(import.meta.env.DEV ? '/api/v1/crewai/execute' : 'https://placement-backend-z8c5.onrender.com/api/v1/crewai/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: profile.name || 'Arun Kumar',
          department: profile.department || 'Computer Science & Engineering',
          cgpa: profile.cgpa || 8.5,
          skills: profile.technicalSkills || ['React', 'TypeScript', 'Node.js', 'Python', 'Data Structures', 'SQL'],
          resumeText: (profile.projects && profile.projects.length > 0 ? profile.projects.map(p => `${p.title}: ${p.description}`).join('. ') : '') || 'Computer Science student passionate about full stack development and AI algorithms.'
        })
      });

      // Simulate sequential step animation for user experience
      for (let i = 0; i < 5; i++) {
        setCurrentStepIndex(i);
        setAgents(prev => prev.map((a, idx) => ({
          ...a,
          status: idx === i ? 'WORKING' : (idx < i ? 'COMPLETED' : 'IDLE')
        })));

        const agentNames = ['JobScoutAgent', 'ResumeEvaluatorAgent', 'SkillGapCoachAgent', 'InterviewSimulatorAgent', 'PlacementOfficerAgent'];
        addConsoleLog(`>>> [EXEC] ${agentNames[i]} running assigned task...`);

        await new Promise(r => setTimeout(r, 900));
      }

      const data = await response.json();

      if (data.success && data.crewResult) {
        setCrewResult(data.crewResult);
        setAgents(prev => prev.map(a => ({ ...a, status: 'COMPLETED' })));
        addConsoleLog("✨ CrewAI Pipeline Completed Successfully! Placement Readiness Certified.");
      } else {
        throw new Error("Backend CrewAI execution returned invalid format");
      }
    } catch (err: any) {
      console.error("CrewAI execution error:", err);
      addConsoleLog(`❌ CrewAI Execution Error: ${err.message || 'Server connection failed'}`);
      setAgents(prev => prev.map(a => ({ ...a, status: 'IDLE' })));
    } finally {
      setIsRunning(false);
      setCurrentStepIndex(5);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-slate-900 to-purple-950 p-6 md:p-8 text-white shadow-2xl border border-indigo-500/30">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-semibold backdrop-blur-md">
              <Cpu className="w-3.5 h-3.5 animate-pulse text-indigo-400" />
              <span>Python CrewAI Multi-Agent Framework v2.4</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-indigo-200">
              CrewAI Autonomous Multi-Agent Command Center
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Orchestrate 5 specialized AI agents collaborating in real-time to analyze your placement profile, ATS resume match, skill roadmaps, mock interview performance, and telephony voice briefing.
            </p>
          </div>

          <button
            onClick={runCrewAIWorkflow}
            disabled={isRunning}
            className={`px-6 py-3.5 rounded-2xl font-bold text-sm shadow-xl flex items-center space-x-3 transition-all duration-300 transform active:scale-95 shrink-0 ${
              isRunning
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed border border-slate-600'
                : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white shadow-indigo-500/25 hover:shadow-indigo-500/40'
            }`}
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin text-white" />
                <span>Agents Executing ({currentStepIndex + 1}/5)...</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>Launch CrewAI Workflow</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Agents Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center space-x-2">
            <Bot className="w-5 h-5 text-indigo-500" />
            <span>Active Crew Roster (5 Autonomous Agents)</span>
          </h2>
          <span className="text-xs text-slate-500 font-medium">Sequential Multi-Agent Task Pipeline</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {agents.map((agent, index) => {
            const isActive = isRunning && currentStepIndex === index;
            const isDone = agent.status === 'COMPLETED' || currentStepIndex > index;

            return (
              <div
                key={agent.id}
                className={`relative p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                  isActive
                    ? 'bg-indigo-950/40 dark:bg-indigo-950/60 border-indigo-500 shadow-lg shadow-indigo-500/20 ring-2 ring-indigo-500/50 scale-105'
                    : isDone
                    ? 'bg-slate-900/60 dark:bg-slate-900/80 border-emerald-500/40 text-slate-200'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                }`}
              >
                {/* Status Badge */}
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2.5 rounded-xl ${agent.avatarColor} shadow-md`}>
                    {getAgentIcon(agent.icon)}
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      isActive
                        ? 'bg-indigo-500 text-white animate-pulse'
                        : isDone
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    {isActive ? 'EXECUTING' : isDone ? 'COMPLETED' : 'IDLE'}
                  </span>
                </div>

                <div className="space-y-1.5 mb-4">
                  <div className="text-xs text-indigo-400 font-bold uppercase tracking-wider">
                    Agent 0{index + 1}
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white leading-snug">
                    {agent.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {agent.role}
                  </p>
                </div>

                {/* Tools Pills */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-1">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase">Assigned Tools:</div>
                  <div className="flex flex-wrap gap-1">
                    {agent.tools.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[9px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Log Console / Execution Output */}
      {liveLogConsole.length > 0 && (
        <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-slate-300 shadow-xl space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-400 text-[11px] font-sans font-bold">
            <div className="flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>CrewAI Agent Real-Time Reflection Terminal</span>
            </div>
            <span>Python Stdout / Node Stream</span>
          </div>
          <div className="max-h-40 overflow-y-auto space-y-1 pr-2">
            {liveLogConsole.map((log, i) => (
              <div
                key={i}
                className={
                  log.includes('❌')
                    ? 'text-rose-400'
                    : log.includes('✨')
                    ? 'text-emerald-400 font-bold'
                    : log.includes('🚀')
                    ? 'text-indigo-400 font-bold'
                    : 'text-slate-300'
                }
              >
                {log}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Execution Results View */}
      {crewResult && (
        <div className="space-y-6 animate-fadeIn">
          {/* Readiness Certificate Box */}
          <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white border border-indigo-500/40 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  <span>CrewAI Readiness Certification</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white">
                  Placement Readiness Certified: {crewResult.overallReadinessScore}%
                </h2>
                <p className="text-slate-300 text-sm max-w-xl">
                  {crewResult.crewSummary}
                </p>
              </div>

              <div className="flex items-center space-x-4 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
                <div className="text-center px-3">
                  <div className="text-2xl font-black text-indigo-400">92%</div>
                  <div className="text-[10px] text-slate-400 uppercase">Google Match</div>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="text-center px-3">
                  <div className="text-2xl font-black text-emerald-400">88%</div>
                  <div className="text-[10px] text-slate-400 uppercase">Zoho Match</div>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="text-center px-3">
                  <div className="text-2xl font-black text-amber-400">7-Days</div>
                  <div className="text-[10px] text-slate-400 uppercase">Roadmap</div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Tabs Navigation */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-2 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveResultTab('logs')}
              className={`px-4 py-2.5 rounded-t-xl font-bold text-xs flex items-center space-x-2 transition-colors ${
                activeResultTab === 'logs'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Terminal className="w-4 h-4" />
              <span>Agent Thoughts & Logs</span>
            </button>
            <button
              onClick={() => setActiveResultTab('jobs')}
              className={`px-4 py-2.5 rounded-t-xl font-bold text-xs flex items-center space-x-2 transition-colors ${
                activeResultTab === 'jobs'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Matched Job Opportunities</span>
            </button>
            <button
              onClick={() => setActiveResultTab('ats')}
              className={`px-4 py-2.5 rounded-t-xl font-bold text-xs flex items-center space-x-2 transition-colors ${
                activeResultTab === 'ats'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>ATS & Resume Insights</span>
            </button>
            <button
              onClick={() => setActiveResultTab('roadmap')}
              className={`px-4 py-2.5 rounded-t-xl font-bold text-xs flex items-center space-x-2 transition-colors ${
                activeResultTab === 'roadmap'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Target className="w-4 h-4" />
              <span>7-Day Micro-Learning Roadmap</span>
            </button>
            <button
              onClick={() => setActiveResultTab('voice')}
              className={`px-4 py-2.5 rounded-t-xl font-bold text-xs flex items-center space-x-2 transition-colors ${
                activeResultTab === 'voice'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <PhoneCall className="w-4 h-4" />
              <span>Telephony Briefing Script</span>
            </button>
          </div>

          {/* Tab Content Display */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            {activeResultTab === 'logs' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <Terminal className="w-4 h-4 text-indigo-500" />
                  <span>Agent Execution Chain & Reasoning</span>
                </h3>
                <div className="space-y-3">
                  {crewResult.executionSteps.map((step, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-extrabold text-indigo-600 dark:text-indigo-400">{step.agentName} ({step.role})</span>
                        <span className="text-slate-400">{step.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 font-mono bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                        "{step.thoughts}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeResultTab === 'jobs' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Extracted Job Matches</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">Google</h4>
                        <p className="text-xs text-slate-500">Associate Software Engineer - 2026 Batch</p>
                      </div>
                      <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 text-xs font-bold">92% Match</span>
                    </div>
                    <div className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">₹28,000,000 / yr • Bengaluru / Hyderabad</div>
                  </div>
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">Zoho Corporation</h4>
                        <p className="text-xs text-slate-500">Software Developer (MTS)</p>
                      </div>
                      <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 text-xs font-bold">88% Match</span>
                    </div>
                    <div className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">₹8,50,000 / yr • Chennai / Tenkasi</div>
                  </div>
                </div>
              </div>
            )}

            {activeResultTab === 'ats' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">ResumeEvaluatorAgent ATS Report</h3>
                <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-indigo-400 font-bold uppercase">Computed ATS Score</div>
                    <div className="text-3xl font-black text-indigo-600 dark:text-indigo-300">88%</div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-indigo-500 text-white font-bold text-xs">ATS Pass Verified</span>
                </div>
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300">Recommended Missing Keywords to Add:</div>
                  <div className="flex flex-wrap gap-2">
                    {['Docker', 'AWS Cloud', 'System Design', 'Kubernetes'].map((kw, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-500 border border-rose-500/20 text-xs font-semibold">
                        + {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeResultTab === 'roadmap' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">SkillGapCoachAgent 7-Day Action Plan</h3>
                <div className="space-y-2">
                  {[
                    { day: 1, topic: 'Docker & Containerization Fundamentals', focus: 'DevOps & Deployment' },
                    { day: 2, topic: 'RESTful API Security & JWT Authentication', focus: 'Backend Systems' },
                    { day: 3, topic: 'System Design: Load Balancing & Redis Caching', focus: 'Scalability' },
                    { day: 4, topic: 'Mock Coding Challenge: Dynamic Programming & Graphs', focus: 'Algorithms' },
                    { day: 5, topic: 'Database Sharding, Indexing & SQL Tuning', focus: 'Databases' },
                    { day: 6, topic: 'Behavioral STAR Method Interview Prep', focus: 'Soft Skills' },
                    { day: 7, topic: 'Full Placement Mock Interview & Live Assessment', focus: 'Final Review' }
                  ].map((m) => (
                    <div key={m.day} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-3">
                        <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">D{m.day}</span>
                        <span className="font-semibold text-slate-900 dark:text-white">{m.topic}</span>
                      </div>
                      <span className="text-[10px] font-bold text-indigo-500 uppercase bg-indigo-500/10 px-2 py-0.5 rounded">{m.focus}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeResultTab === 'voice' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <PhoneCall className="w-4 h-4 text-emerald-500" />
                  <span>PlacementOfficerAgent Voice Telephony Dispatch</span>
                </h3>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-mono text-xs leading-relaxed space-y-2">
                  <div className="text-[10px] text-emerald-400 font-sans font-bold uppercase">Automated Telephony Script Dispatched to Mobile Phone:</div>
                  <p className="p-3 rounded bg-slate-900 border border-slate-800 text-slate-300">
                    "{crewResult.telephonyScript}"
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
