import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { GlassCard } from '../ui/GlassCard';
import { queryAICareerCoachAsync, FREE_OPENROUTER_MODELS } from '../../services/aiEngine';
const OPENROUTER_PRIMARY_MODEL = FREE_OPENROUTER_MODELS[0];
import { BotMessageSquare, Send, Sparkles, User, Zap, Bot, RefreshCw } from 'lucide-react';

interface ChatMessage {
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  modelUsed?: string;
}

export const CareerCoachChat: React.FC = () => {
  const { profile } = useAuth();
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'ai',
      text: `Hello ${profile.name}! 👋 I am your **PlacementOS AI Career Coach** powered by **OpenRouter free AI models (${OPENROUTER_PRIMARY_MODEL})**.\n\nAsk me anything about your department (${profile.department}), target companies (e.g. "I want Google", "How to crack Texas Instruments / Zoho / Tata Motors?"), system design, or ATS resume tuning!`,
      timestamp: 'Just now',
      modelUsed: OPENROUTER_PRIMARY_MODEL
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
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: OPENROUTER_PRIMARY_MODEL
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-indigo-600 dark:text-cyan-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>OpenRouter LLM Integration Active</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <BotMessageSquare className="w-6 h-6 text-indigo-600 dark:text-indigo-400" /> AI Placement & Career Coach
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Powered by OpenRouter API (`{OPENROUTER_PRIMARY_MODEL}`)
          </p>
        </div>

        {/* Model Badge */}
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 text-xs font-mono font-bold text-indigo-700 dark:text-indigo-300">
          <Bot className="w-4 h-4 text-indigo-500" />
          <span>OpenRouter Free AI</span>
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
                    ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white'
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-[80%] space-y-1 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                <div
                  className={`p-4 rounded-2xl text-xs leading-relaxed font-medium whitespace-pre-line ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {msg.text}
                </div>
                <div className="text-[10px] text-slate-400 font-mono flex items-center justify-end space-x-2 px-1">
                  {msg.modelUsed && <span>Model: {msg.modelUsed}</span>}
                  <span>• {msg.timestamp}</span>
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
              <span className="font-extrabold text-xs text-indigo-900 dark:text-indigo-200">AI is thinking & analyzing...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center space-x-2 shrink-0">
          <input
            type="text"
            placeholder="Ask AI Placement Coach about career roadmaps, interview prep, or skills..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            disabled={isThinking}
            className="flex-1 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
          />
          <button
            onClick={() => handleSend()}
            disabled={isThinking}
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
