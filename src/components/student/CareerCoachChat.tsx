import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { GlassCard } from '../ui/GlassCard';
import { queryAICareerCoachAsync, parseResumeTextToProfile } from '../../services/aiEngine';
import { extractTextFromPdfFile } from '../../utils/pdfExtractor';
import { saveUploadedResumeDataToFirestore } from '../../services/firebase';
import { 
  BotMessageSquare, Send, Sparkles, User, Zap, Bot, RefreshCw, 
  Upload, Paperclip, FileText, CheckCircle2, ShieldCheck, ArrowRight
} from 'lucide-react';

interface ChatMessage {
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export const CareerCoachChat: React.FC = () => {
  const { profile, updateProfile, addNotification } = useAuth();
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'ai',
      text: `Hello ${profile.name || 'Candidate'}! 👋 I am your **PlacementOS AI Career Coach**.\n\nI can help you with personalized interview preparation for your department (**${profile.department || 'Engineering'}**), target recruiter strategies (e.g. Google, Microsoft, Zoho, Tata Motors), system design, or ATS resume tuning.\n\n💡 *Tip: You can upload your PDF resume using the attachment button below for instant tailored interview coaching!*`,
      timestamp: 'Just now'
    }
  ]);

  const quickPrompts = [
    'How to crack Google ASE / SDE round?',
    'How to prepare for EEE / Embedded Systems interviews at TI & Intel?',
    'How to crack Tata Motors GET Mechanical round?',
    'Explain STAR method for HR interviews',
    'How to improve ATS score for my resume?'
  ];

  const handleSend = async (textToSend?: string) => {
    const prompt = textToSend || input;
    if (!prompt.trim() || isThinking) return;

    const userMsg: ChatMessage = {
      sender: 'user',
      text: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsThinking(true);

    try {
      const responseText = await queryAICareerCoachAsync(prompt, profile);
      const aiMsg: ChatMessage = {
        sender: 'ai',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsThinking(false);
    }
  };

  const handleResumeUploadInChat = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingResume(true);
    setIsThinking(true);

    // Add user upload message
    const userMsg: ChatMessage = {
      sender: 'user',
      text: `📎 Uploaded Resume: **${file.name}**\n*Analyzing technical skills & career alignment...*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);

    try {
      const text = await extractTextFromPdfFile(file);
      const parsed = await parseResumeTextToProfile(text || file.name, profile);

      // Auto update student profile
      updateProfile({
        name: parsed.name !== 'Student Candidate' ? parsed.name : (profile.name || 'Candidate'),
        department: parsed.department || profile.department,
        technicalSkills: parsed.technicalSkills,
        projects: parsed.projects,
        certifications: parsed.certifications,
        atsScore: parsed.atsScore,
        placementReadinessScore: parsed.placementReadinessScore,
        resumeFileName: file.name,
        resumeUploadedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      });

      // Save to Firebase Firestore
      saveUploadedResumeDataToFirestore(
        parsed.email || profile.email,
        file.name,
        text,
        parsed
      );

      addNotification(`⚡ Resume Analyzed & Saved! ${parsed.technicalSkills.length} Skills Extracted | ATS: ${parsed.atsScore}/100`);

      // Generate customized coach feedback based on resume
      const aiResponseText = `📄 **Resume Analysis & Career Strategy Ready!**\n\n` +
        `• **Extracted Candidate**: **${parsed.name || profile.name}**\n` +
        `• **Department**: ${parsed.department || profile.department}\n` +
        `• **Extracted Technical Skills (${parsed.technicalSkills.length})**: ${parsed.technicalSkills.slice(0, 8).join(', ')}${parsed.technicalSkills.length > 8 ? '...' : ''}\n` +
        `• **ATS Compatibility Score**: **${parsed.atsScore}/100**\n` +
        `• **Extracted Projects**: ${parsed.projects?.length || 0} Projects identified\n\n` +
        `🎯 **Placement Coach Assessment**:\n` +
        `Your profile shows high proficiency in **${parsed.technicalSkills.slice(0, 3).join(', ')}**. For campus recruitment at top tech companies, I recommend practicing data structures & algorithm problems (Tree/Graph traversals, Dynamic Programming) and preparing STAR-format stories for your **${parsed.projects?.[0]?.title || 'core project'}**.\n\n` +
        `What specific company or technical round would you like to prepare for today?`;

      const aiMsg: ChatMessage = {
        sender: 'ai',
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error('Resume coaching error:', err);
      const errMsg: ChatMessage = {
        sender: 'ai',
        text: '❌ There was an issue processing your resume file. Please ensure it is a readable PDF or TXT document and try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsUploadingResume(false);
      setIsThinking(false);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-indigo-600 dark:text-cyan-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>PlacementOS AI Intelligence Engine Active</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <BotMessageSquare className="w-6 h-6 text-indigo-600 dark:text-indigo-400" /> AI Placement & Career Coach
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Intelligent 24/7 placement mentor tailored for campus placements, technical rounds, and interview coaching.
          </p>
        </div>

        {/* Coach Badge */}
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 text-xs font-bold text-indigo-700 dark:text-indigo-300">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Verified AI Placement Coach</span>
        </div>
      </div>

      {/* Resume Quick Upload Strip in Career Coach */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-teal-500/10 border border-indigo-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <span className="font-extrabold text-slate-900 dark:text-white">
              Upload Resume for Instant AI Coach Diagnosis
            </span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Upload your PDF resume to have the AI Coach analyze your extracted skills and tailor interview questions!
            </p>
          </div>
        </div>

        <div>
          <input
            type="file"
            accept=".pdf,.docx,.txt"
            id="chat-resume-upload-input"
            onChange={handleResumeUploadInChat}
            className="hidden"
            disabled={isThinking || isUploadingResume}
          />
          <label
            htmlFor="chat-resume-upload-input"
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs transition-all shadow cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{isUploadingResume ? 'Analyzing Resume...' : 'Upload PDF Resume'}</span>
          </label>
        </div>
      </div>

      <GlassCard className="p-6 flex flex-col h-[620px]">
        {/* Quick Prompts Bar */}
        <div className="flex flex-wrap gap-2 pb-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-500" /> Quick Prompts:
          </span>
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(qp)}
              disabled={isThinking}
              className="text-xs px-3 py-1 rounded-full bg-indigo-50 dark:bg-slate-950 border border-indigo-200 dark:border-slate-800 hover:border-indigo-500 text-indigo-700 dark:text-indigo-300 font-medium transition-all"
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Chat Messages Log */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-2">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start space-x-3 ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow'
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-[80%] space-y-1 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                <div
                  className={`p-4 rounded-2xl text-xs leading-relaxed font-medium whitespace-pre-line shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {msg.text}
                </div>
                <div className="text-[10px] text-slate-400 font-mono flex items-center justify-end space-x-2 px-1">
                  <span>PlacementOS AI • {msg.timestamp}</span>
                </div>
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex items-center space-x-3 text-xs font-bold text-indigo-600 dark:text-cyan-400 p-3 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/50 w-fit">
              <div className="flex space-x-1.5 items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 dark:bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 dark:bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 dark:bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="font-extrabold text-xs text-indigo-900 dark:text-indigo-200">
                {isUploadingResume ? 'Analyzing Resume & Synthesizing Recommendations...' : 'AI Career Coach is thinking & analyzing...'}
              </span>
            </div>
          )}
        </div>

        {/* Input Bar with Resume Attachment Button */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center space-x-2 shrink-0">
          <input
            type="file"
            accept=".pdf,.docx,.txt"
            id="chat-input-paperclip"
            onChange={handleResumeUploadInChat}
            className="hidden"
            disabled={isThinking || isUploadingResume}
          />
          <label
            htmlFor="chat-input-paperclip"
            title="Attach & Upload PDF Resume for Analysis"
            className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:border-indigo-400 text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-all cursor-pointer flex items-center justify-center shrink-0"
          >
            <Paperclip className="w-4 h-4" />
          </label>

          <input
            type="text"
            placeholder="Ask AI Placement Coach about interview questions, skills, or system design..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            disabled={isThinking}
            className="flex-1 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
          />
          <button
            onClick={() => handleSend()}
            disabled={isThinking || !input.trim()}
            className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg flex items-center space-x-1.5 transition-all disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>Send</span>
          </button>
        </div>
      </GlassCard>
    </div>
  );
};
