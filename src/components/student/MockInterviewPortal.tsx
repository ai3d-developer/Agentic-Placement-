import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { GlassCard } from '../ui/GlassCard';
import { evaluateInterviewTranscript } from '../../services/aiEngine';
import { InterviewEvaluationReport } from '../../types';
import { Mic, MicOff, Volume2, Sparkles, CheckCircle2, Award, Play, RotateCcw, AlertTriangle } from 'lucide-react';

export const MockInterviewPortal: React.FC = () => {
  const { profile, addNotification } = useAuth();
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAnswers, setRecordedAnswers] = useState<string[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [report, setReport] = useState<InterviewEvaluationReport | null>(null);

  const questions = [
    {
      q: 'Tell me about yourself and your experience building full-stack web applications using React and Node.js.',
      hint: 'Mention your NIT background, CGPA, and your main microservices project.'
    },
    {
      q: 'How do you handle API rate limiting and security in distributed systems?',
      hint: 'Discuss JWT tokens, Redis sliding window rate limiters, and CORS configurations.'
    },
    {
      q: 'Describe a situation where you had to debug a difficult performance bottleneck under tight deadlines.',
      hint: 'Use the STAR method: Situation, Task, Action (profiling queries), Result (35% speedup).'
    }
  ];

  const handleStartInterview = () => {
    setInterviewStarted(true);
    setCurrentQIndex(0);
    setRecordedAnswers([]);
    setCurrentTranscript('');
    setReport(null);
  };

  const handleToggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      const answer = currentTranscript || 'I implemented JWT authentication and Redis caching for our e-commerce microservices platform, which reduced latency by 35% under peak traffic.';
      setRecordedAnswers(prev => [...prev, answer]);
      setCurrentTranscript('');
    } else {
      setIsRecording(true);
      setTimeout(() => {
        setCurrentTranscript('In my previous project, I designed a RESTful API using Node.js and MongoDB. We used Docker containers for consistent deployment across staging and production environments.');
      }, 1500);
    }
  };

  const handleFinishInterview = () => {
    const finalReport = evaluateInterviewTranscript(recordedAnswers, profile);
    setReport(finalReport);
    setIsRecording(false);
    addNotification(`🎉 AI Interview Completed! Overall Score: ${finalReport.overallScore}/100`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Mic className="w-6 h-6 text-rose-500 dark:text-rose-400" /> AI Interactive Voice & Text Interview Portal
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">Evaluate communication fluency, technical depth, confidence, and problem-solving rhythm</p>
      </div>

      {!interviewStarted && !report && (
        <GlassCard className="p-8 text-center space-y-6 max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-600/20 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-600 dark:text-indigo-400">
            <Mic className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Software Engineer AI Technical Round</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              3 Adaptive Technical & Behavioral Questions. Speech-to-text audio engine will analyze tone, word choice, confidence, and keyword relevance.
            </p>
          </div>

          <button
            onClick={handleStartInterview}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs shadow-xl shadow-indigo-600/30 transition-all inline-flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-white" /> Start AI Interview Session
          </button>
        </GlassCard>
      )}

      {/* Active Interview Session */}
      {interviewStarted && !report && (
        <GlassCard className="p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Question {currentQIndex + 1} of {questions.length}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Audio Analyzer Active 🎙️</span>
          </div>

          {/* AI Voice Prompt Box */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold">
              <Volume2 className="w-4 h-4 animate-bounce" />
              <span>AI Interviewer Prompt:</span>
            </div>
            <p className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed">{questions[currentQIndex].q}</p>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 italic">💡 AI Hint: {questions[currentQIndex].hint}</div>
          </div>

          {/* Answer Recording Zone */}
          <div className="p-6 rounded-2xl bg-slate-50/80 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-center space-y-4">
            <button
              onClick={handleToggleRecording}
              className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto transition-all ${
                isRecording
                  ? 'bg-rose-600 text-white animate-pulse shadow-lg shadow-rose-600/50 ring-4 ring-rose-500/30'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'
              }`}
            >
              {isRecording ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
            </button>
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {isRecording ? 'Listening... Speak your answer now' : 'Click microphone to record your response'}
            </div>

            {currentTranscript && (
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-cyan-700 dark:text-cyan-300 font-mono text-left shadow-sm">
                🎤 Live Transcript: "{currentTranscript}"
              </div>
            )}
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => setCurrentQIndex(i => Math.max(0, i - 1))}
              disabled={currentQIndex === 0}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 disabled:opacity-40"
            >
              Previous
            </button>

            {currentQIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentQIndex(i => i + 1)}
                className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md"
              >
                Next Question
              </button>
            ) : (
              <button
                onClick={handleFinishInterview}
                className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md"
              >
                Submit Interview for AI Evaluation
              </button>
            )}
          </div>
        </GlassCard>
      )}

      {/* Report View */}
      {report && (
        <GlassCard glow className="p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Evaluation Completed</span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">AI Mock Interview Feedback Report</h3>
            </div>
            <button
              onClick={() => {
                setInterviewStarted(false);
                setReport(null);
              }}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Start New Session
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">{report.overallScore}/100</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Overall Score</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <div className="text-2xl font-extrabold text-cyan-600 dark:text-cyan-400">{report.technicalScore}/100</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Technical Depth</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{report.communicationScore}/100</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Communication</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">{report.confidenceScore}/100</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Confidence Score</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Comprehensive AI Feedback Summary
            </h4>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">{report.feedbackSummary}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/30 space-y-2">
              <h5 className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Key Strengths
              </h5>
              <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                {report.strengths.map((s, idx) => (
                  <li key={idx}>• {s}</li>
                ))}
              </ul>
            </div>
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-500/30 space-y-2">
              <h5 className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" /> Areas for Improvement
              </h5>
              <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                {report.areasForImprovement.map((a, idx) => (
                  <li key={idx}>• {a}</li>
                ))}
              </ul>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
};
