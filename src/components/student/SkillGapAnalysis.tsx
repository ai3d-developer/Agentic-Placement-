import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { GlassCard } from '../ui/GlassCard';
import { generateSkillGapAnalysis, callGeminiAI } from '../../services/aiEngine';
import { Target, CheckCircle2, XCircle, Calendar, Sparkles, BookOpen, Building2, ArrowUpRight, AlertTriangle, HelpCircle, RefreshCw, ChevronDown, ChevronUp, Lightbulb, Play } from 'lucide-react';

interface AIQuestion {
  question: string;
  answer: string;
}

interface AIQuizItem {
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

interface AIData {
  interviewQuestions: AIQuestion[];
  practiceQuiz: AIQuizItem[];
}

export const SkillGapAnalysis: React.FC = () => {
  const { profile, addNotification } = useAuth();
  const getDynamicCompanies = () => {
    const dept = (profile.department || '').toLowerCase();
    if (dept.includes('ece') || dept.includes('eee') || dept.includes('electrical') || dept.includes('electronics')) {
      return ['NVIDIA', 'Intel', 'Qualcomm', 'Bosch', 'Tesla', 'TCS'];
    }
    if (dept.includes('mech') || dept.includes('automation') || dept.includes('mechatronics')) {
      return ['Tesla', 'Tata Motors', 'Boeing', 'Bosch', 'Caterpillar', 'Infosys'];
    }
    if (dept.includes('civil')) {
      return ['L&T Construction', 'Bechtel', 'AECOM', 'Caterpillar', 'TCS', 'Infosys'];
    }
    return ['Google', 'Microsoft', 'Amazon', 'Zoho', 'TCS', 'Infosys'];
  };

  const companiesList = getDynamicCompanies();
  const [selectedCompany, setSelectedCompany] = useState<string>(() => {
    const list = getDynamicCompanies();
    return list[0] || 'Google';
  });
  const [testScores, setTestScores] = useState<Record<string, number>>({});

  // AI Question Hub states
  const [selectedHubSkill, setSelectedHubSkill] = useState<string>('');
  const [isLoadingAI, setIsLoadingAI] = useState<boolean>(false);
  const [aiData, setAiData] = useState<AIData | null>(null);
  const [expandedQA, setExpandedQA] = useState<Record<number, boolean>>({});
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState<Record<number, boolean>>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem('placementos_skill_gap_scores');
      if (saved) {
        setTestScores(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    const list = getDynamicCompanies();
    if (!list.includes(selectedCompany)) {
      setSelectedCompany(list[0] || 'Google');
    }
  }, [profile.department]);

  const isUnparsed = !profile.technicalSkills || profile.technicalSkills.length === 0;

  const gapResult = generateSkillGapAnalysis(selectedCompany, profile);

  // Set initial selected skill for question hub once gapResult is available
  useEffect(() => {
    if (gapResult) {
      const skills = [...gapResult.missingSkills, ...gapResult.strongSkills];
      if (skills.length > 0 && !skills.includes(selectedHubSkill)) {
        setSelectedHubSkill(skills[0]);
      }
    }
  }, [selectedCompany, profile.technicalSkills]);

  // Map of required skills per company to calculate average test performance
  const companySkillMap: Record<string, string[]> = {
    Google: ['java', 'python', 'algorithms'],
    Microsoft: ['java', 'sql', 'algorithms'],
    Amazon: ['java', 'python', 'sql'],
    Zoho: ['react', 'sql', 'java', 'python'],
    TCS: ['java', 'python', 'sql'],
    Infosys: ['java', 'python', 'sql'],
    NVIDIA: ['c++', 'python', 'algorithms'],
    Intel: ['c++', 'python', 'embedded'],
    Qualcomm: ['c++', 'python', 'embedded'],
    Bosch: ['python', 'c++', 'embedded'],
    Tesla: ['python', 'c++', 'solidworks'],
    'Tata Motors': ['python', 'solidworks', 'cad'],
    Boeing: ['python', 'c++', 'cad'],
    Caterpillar: ['python', 'cad', 'solidworks'],
    'L&T Construction': ['autocad', 'solidworks'],
    Bechtel: ['autocad', 'solidworks'],
    AECOM: ['autocad', 'solidworks']
  };

  // Generate recommendation list dynamically
  const recommendations = companiesList.map(comp => {
    const analysis = generateSkillGapAnalysis(comp, profile);
    const requiredSkills = companySkillMap[comp] || ['generic'];
    
    // Find average test score for these required skills
    let totalScore = 0;
    let scoreCount = 0;

    Object.keys(testScores).forEach(testId => {
      const parts = testId.split('-');
      if (parts.length >= 2) {
        const skillName = parts[1];
        if (requiredSkills.includes(skillName)) {
          totalScore += testScores[testId];
          scoreCount++;
        }
      }
    });

    const averageTestScore = scoreCount > 0 ? Math.round(totalScore / scoreCount) : null;
    
    // Calculate final readiness score incorporating skill gap analysis and actual test performance
    let readinessScore = analysis.overallMatch;
    if (averageTestScore !== null) {
      readinessScore = Math.round((analysis.overallMatch + averageTestScore) / 2);
    }

    let status: 'ready' | 'prep' | 'gap' = 'prep';
    let statusText = 'Apply with Preparation';
    let statusColor = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20';

    if (readinessScore >= 75) {
      status = 'ready';
      statusText = 'Ready to Apply Now!';
      statusColor = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20';
    } else if (readinessScore < 55) {
      status = 'gap';
      statusText = 'Needs Skill Assessment';
      statusColor = 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-500/20';
    }

    return {
      company: comp,
      readinessScore,
      status,
      statusText,
      statusColor,
      missingCount: analysis.missingSkills.length,
      averageTestScore
    };
  });

  const generateLocalFallbackQuestions = (skill: string): AIData => {
    return {
      interviewQuestions: [
        {
          question: `Explain the core purpose and architectural role of ${skill} in production environments.`,
          answer: `${skill} provides the foundation for modular, scalable development by isolating concerns, optimizing runtime performance, and standardizing component integration schemas.`
        },
        {
          question: `What are the most common debugging techniques and tools when troubleshooting issues in ${skill}?`,
          answer: `Debugging in ${skill} involves profiling runtime memory footprints, inspecting local execution logs, configuring conditional break points, and validating state transitions under load.`
        },
        {
          question: `How do you handle security and performance optimization constraints in ${skill}?`,
          answer: `Optimization is achieved by caching database queries, minimizing bundle or package sizes, sanitizing user inputs, and implementing secure token-based communication protocols.`
        }
      ],
      practiceQuiz: [
        {
          question: `Which architectural pattern is best suited for deploying solutions utilizing ${skill}?`,
          options: [`Decoupled microservices with state replication`, `Monolithic systems with shared variables`, `Procedural scripts with global scoping`, `Static client pages without API links`],
          correctOptionIndex: 0,
          explanation: `Decoupled architectures allow ${skill} services to scale independently while avoiding cascading dependency failures.`
        },
        {
          question: `What is the most critical constraint when evaluating the performance of ${skill}?`,
          options: [`Theoretical Big O Time & Space complexity bounds`, `The visual theme color selections`, `The absolute byte size of documentation text`, `Physical storage disk spin speeds`],
          correctOptionIndex: 0,
          explanation: `Algorithmic efficiency dictates that minimizing computation steps is primary for scalability.`
        },
        {
          question: `Which practice is considered an industry anti-pattern when working with ${skill}?`,
          options: [`Writing modular, unit-tested components with clear scoping`, `Hardcoding credentials and using globally scoped mutable states`, `Implementing structured logging and trace checkpoints`, `Enforcing secure access controls and input validations`],
          correctOptionIndex: 1,
          explanation: `Hardcoding secrets and leaking variables into global namespaces introduces extreme security flaws.`
        }
      ]
    };
  };

  const handleGenerateQuestions = async (skillName: string) => {
    if (!skillName) return;
    setIsLoadingAI(true);
    setQuizAnswers({});
    setQuizScore(null);
    setShowExplanation({});
    setExpandedQA({});

    const prompt = `Generate technical interview questions and practice questions for the skill: "${skillName}".
The student is targetting placement at "${selectedCompany}" and is in the "${profile.department || 'Engineering'}" department.

Provide the response in the following exact JSON format (no markdown code blocks, no backticks, no comments, just valid JSON):
{
  "interviewQuestions": [
    {
      "question": "Question text here?",
      "answer": "Expert detailed answer showing STAR format and code if applicable."
    },
    {
      "question": "Second question text?",
      "answer": "Expert answer."
    },
    {
      "question": "Third question?",
      "answer": "Expert answer."
    }
  ],
  "practiceQuiz": [
    {
      "question": "A multiple choice question on the skill?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctOptionIndex": 0,
      "explanation": "Why Option A is correct."
    },
    {
      "question": "Second multiple choice question?",
      "options": ["A", "B", "C", "D"],
      "correctOptionIndex": 1,
      "explanation": "Explanation here."
    },
    {
      "question": "Third multiple choice question?",
      "options": ["A", "B", "C", "D"],
      "correctOptionIndex": 2,
      "explanation": "Explanation here."
    }
  ]
}`;

    try {
      const responseText = await callGeminiAI(prompt, "You are a JSON generator. Output raw JSON only.");
      if (responseText) {
        const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        if (parsed.interviewQuestions && parsed.practiceQuiz) {
          setAiData(parsed);
          setIsLoadingAI(false);
          return;
        }
      }
    } catch (e) {
      console.warn("AI question generation failed, falling back:", e);
    }

    // Local fallback
    setAiData(generateLocalFallbackQuestions(skillName));
    setIsLoadingAI(false);
  };

  const handleQuizSubmit = () => {
    if (!aiData) return;
    let score = 0;
    aiData.practiceQuiz.forEach((item, index) => {
      if (quizAnswers[index] === item.correctOptionIndex) {
        score++;
      }
    });
    setQuizScore(score);
    addNotification(`🏆 AI Practice Quiz for ${selectedHubSkill} Completed! Score: ${score}/3`);
  };

  const allSkills = [...gapResult.missingSkills, ...gapResult.strongSkills];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Target className="w-6 h-6 text-indigo-600 dark:text-cyan-400" /> AI Skill Gap & Roadmap Generator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
            <span>Select a target company to analyze missing competencies and generate a weekly learning plan</span>
            {isUnparsed ? (
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 font-extrabold border border-amber-200 dark:bg-amber-500/20 dark:text-amber-300">
                ⚠️ Awaiting Resume Upload
              </span>
            ) : (
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-extrabold border border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/40">
                ✓ Tailored for {profile.name} ({profile.technicalSkills.length} Extracted Skills)
              </span>
            )}
          </p>
        </div>

        {/* Company Selector Buttons */}
        {!isUnparsed && (
          <div className="flex flex-wrap gap-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1.5 rounded-xl">
            {companiesList.map(c => (
              <button
                key={c}
                onClick={() => setSelectedCompany(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedCompany === c ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}
      </div>

      {isUnparsed ? (
        <GlassCard className="p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-cyan-400 mx-auto">
            <Target className="w-8 h-8 animate-bounce" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              📄 Upload Resume to Unlock Personal AI Career Roadmap & Skill Gap Analysis
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              No technical skills extracted yet. Please upload your PDF resume to generate a 100% custom learning roadmap matching your exact technical background for top recruiters!
            </p>
          </div>
        </GlassCard>
      ) : (
        <>
          {/* Target Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <GlassCard glow className="p-5 text-center">
              <div className="text-3xl font-extrabold text-indigo-600 dark:text-cyan-400">{gapResult.overallMatch}%</div>
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">Skill Match Score</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Target: {selectedCompany}</div>
            </GlassCard>

            <GlassCard className="p-5 text-center">
              <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">{gapResult.strongSkills.length}</div>
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">Strong Skills</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Ready for Interview</div>
            </GlassCard>

            <GlassCard className="p-5 text-center">
              <div className="text-3xl font-extrabold text-rose-600 dark:text-rose-400">{gapResult.missingSkills.length}</div>
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">Missing Skills</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Requires Focus</div>
            </GlassCard>

            <GlassCard className="p-5 text-center">
              <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">{gapResult.estimatedWeeks} Weeks</div>
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">Estimated Completion</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Priority: {gapResult.learningPriority}</div>
            </GlassCard>
          </div>

          {/* DYNAMIC RECRUITER MATCH & COMPANY RECOMMENDATIONS */}
          <GlassCard className="p-6 space-y-4 border border-indigo-500/10">
            <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <Building2 className="w-5 h-5 text-indigo-600 dark:text-cyan-400" />
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Target Recruiter Match & Application Advisor
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Calculated dynamically from your technical skills match and cleared Skill Gap Test performance.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendations.map(rec => (
                <div key={rec.company} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-955 dark:text-slate-100">{rec.company}</span>
                      <span className="text-lg font-black text-indigo-600 dark:text-cyan-400">{rec.readinessScore}% Match</span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                      <span className={`text-[9px] px-2 py-0.5 rounded font-extrabold border ${rec.statusColor}`}>
                        {rec.statusText}
                      </span>
                      {rec.averageTestScore !== null && (
                        <span className="text-[9px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-extrabold border border-indigo-500/20">
                          Avg Test: {rec.averageTestScore}%
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 leading-relaxed">
                    {rec.status === 'ready' && (
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                        🚀 High readiness! You have matching profile credentials. Recommended to apply now on the Verified Jobs portal.
                      </span>
                    )}
                    {rec.status === 'prep' && (
                      <span>
                        ⚠️ You match {rec.readinessScore}%. Complete the learning roadmap for the remaining {rec.missingCount} missing skills to increase your chances.
                      </span>
                    )}
                    {rec.status === 'gap' && (
                      <span className="text-rose-500 font-medium">
                        🛑 Take the {rec.company} skill gap tests (Basic to Advanced) to calculate full readiness parameters.
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Skills Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strong Skills */}
            <GlassCard className="p-6 border-emerald-500/20">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Strong Skills Matched with {selectedCompany}
              </h3>
              <div className="space-y-2 mt-4">
                {gapResult.strongSkills.map((sk, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedHubSkill(sk)}
                    className={`w-full flex justify-between items-center p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      selectedHubSkill === sk
                        ? 'bg-indigo-600/15 border-indigo-500 text-indigo-700 dark:text-indigo-300'
                        : 'bg-slate-50 dark:bg-slate-950/70 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span>{sk}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-transparent">Verified ✅</span>
                  </button>
                ))}
                {gapResult.strongSkills.length === 0 && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic">No exact skill matches yet.</p>
                )}
              </div>
            </GlassCard>

            {/* Missing Skills */}
            <GlassCard className="p-6 border-rose-500/20">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" /> Missing Competencies & Skill Gaps
              </h3>
              <div className="space-y-2 mt-4">
                {gapResult.missingSkills.map((sk, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedHubSkill(sk)}
                    className={`w-full flex justify-between items-center p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      selectedHubSkill === sk
                        ? 'bg-indigo-600/15 border-indigo-500 text-indigo-700 dark:text-indigo-300'
                        : 'bg-slate-50 dark:bg-slate-950/70 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span>{sk}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-rose-100 text-rose-800 border border-rose-200 dark:bg-rose-500/20 dark:text-rose-300 dark:border-transparent">High Priority ⚡</span>
                  </button>
                ))}
                {gapResult.missingSkills.length === 0 && (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">🎉 Congratulations! You have 100% skill match for {selectedCompany}!</p>
                )}
              </div>
            </GlassCard>
          </div>

          {/* AI Skill Gap Question Hub */}
          {allSkills.length > 0 && (
            <GlassCard className="p-6 border-indigo-500/20 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/25">
                    <HelpCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                      AI Skill Gap Question Hub & Assessment
                    </h3>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Generate AI-powered interview questions and take quick practice tests on chosen topics.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <select
                    value={selectedHubSkill}
                    onChange={e => setSelectedHubSkill(e.target.value)}
                    className="flex-1 sm:w-56 p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:border-indigo-500 outline-none"
                  >
                    {allSkills.map(sk => (
                      <option key={sk} value={sk}>{sk}</option>
                    ))}
                  </select>

                  <button
                    onClick={() => handleGenerateQuestions(selectedHubSkill)}
                    disabled={isLoadingAI}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-xs font-bold shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                  >
                    {isLoadingAI ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                    <span>Generate AI Hub</span>
                  </button>
                </div>
              </div>

              {isLoadingAI && (
                <div className="p-8 text-center space-y-3">
                  <RefreshCw className="w-8 h-8 text-indigo-600 dark:text-cyan-400 animate-spin mx-auto" />
                  <p className="text-xs text-slate-500">Contacting Gemini AI models via OpenRouter to compile interview sheets & MCQs...</p>
                </div>
              )}

              {aiData && !isLoadingAI && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                  {/* Interview Q&A List */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-wider flex items-center gap-1.5">
                      <Lightbulb className="w-4 h-4" /> AI Technical Interview Q&A Sheet
                    </h4>

                    <div className="space-y-2.5">
                      {aiData.interviewQuestions.map((q, idx) => {
                        const isExpanded = expandedQA[idx];
                        return (
                          <div key={idx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-2">
                            <button
                              onClick={() => setExpandedQA(prev => ({ ...prev, [idx]: !isExpanded }))}
                              className="w-full flex justify-between items-start text-xs font-bold text-left text-slate-900 dark:text-white"
                            >
                              <span>Q{idx+1}: {q.question}</span>
                              {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                            </button>

                            {isExpanded && (
                              <div className="text-[11px] text-slate-600 dark:text-slate-300 border-t border-slate-200 dark:border-slate-800/80 pt-2 leading-relaxed">
                                <strong className="text-indigo-600 dark:text-indigo-400 font-bold">Expert AI Guide Answer:</strong>
                                <p className="mt-1 font-medium bg-white dark:bg-slate-900/60 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800/50">{q.answer}</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* MCQ Practice Quiz */}
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/80 space-y-4">
                    <h4 className="text-xs font-black uppercase text-cyan-600 dark:text-cyan-400 tracking-wider flex items-center gap-1.5">
                      <Target className="w-4 h-4 text-cyan-500" /> Topic Quick Practice Quiz (3 MCQs)
                    </h4>

                    <div className="space-y-4 text-xs font-semibold">
                      {aiData.practiceQuiz.map((q, index) => {
                        const selectedAns = quizAnswers[index];
                        const showExpl = showExplanation[index];
                        return (
                          <div key={index} className="space-y-2.5">
                            <p className="font-bold text-slate-800 dark:text-slate-200">Q{index + 1}: {q.question}</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {q.options.map((opt, oIdx) => {
                                const isSelected = selectedAns === oIdx;
                                return (
                                  <button
                                    key={oIdx}
                                    onClick={() => setQuizAnswers(prev => ({ ...prev, [index]: oIdx }))}
                                    className={`p-2.5 rounded-xl border text-left font-medium transition-all text-[11px] cursor-pointer ${
                                      isSelected
                                        ? 'bg-indigo-600 border-indigo-500 text-white'
                                        : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                                    }`}
                                  >
                                    {opt}
                                  </button>
                                );
                              })}
                            </div>

                            {quizScore !== null && (
                              <div className={`p-2.5 rounded-xl border font-medium text-[11px] ${
                                selectedAns === q.correctOptionIndex
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                  : 'bg-rose-500/10 text-rose-450 border-rose-500/20'
                              }`}>
                                <div className="font-extrabold flex justify-between items-center">
                                  <span>{selectedAns === q.correctOptionIndex ? '✓ Correct Answer!' : '✗ Incorrect Answer'}</span>
                                  <button
                                    onClick={() => setShowExplanation(prev => ({ ...prev, [index]: !showExpl }))}
                                    className="text-[10px] text-indigo-400 underline font-sans font-bold"
                                  >
                                    {showExpl ? 'Hide Explanation' : 'View Explanation'}
                                  </button>
                                </div>
                                {showExpl && (
                                  <p className="mt-1.5 opacity-90 leading-relaxed font-normal bg-white/5 dark:bg-slate-900/60 p-2 rounded border border-white/5">{q.explanation}</p>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {quizScore === null ? (
                        <button
                          onClick={handleQuizSubmit}
                          disabled={Object.keys(quizAnswers).length < 3}
                          className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white font-bold cursor-pointer text-xs transition"
                        >
                          Submit Mini Quiz Answers
                        </button>
                      ) : (
                        <div className="p-3 text-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-slate-800 dark:text-indigo-200">
                          <span className="font-extrabold">Final Assessment Score: {quizScore} / 3 Correct! 🎯</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </GlassCard>
          )}

          {/* Automated Learning Roadmap */}
          <GlassCard className="p-6">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Personalized Multi-Week AI Learning Roadmap
              </h3>
              <span className="text-xs text-indigo-600 dark:text-indigo-400 font-mono font-semibold">Auto-Generated for {selectedCompany}</span>
            </div>

            <div className="space-y-4">
              {gapResult.roadmap.map(item => (
                <div key={item.week} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-600 text-white flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> Week {item.week}
                    </span>
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-300">{item.topic}</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{item.description}</p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {item.resources.map((res, rIdx) => (
                      <span key={rIdx} className="text-[10px] px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 flex items-center gap-1 shadow-sm">
                        <BookOpen className="w-3 h-3 text-cyan-600 dark:text-cyan-400" /> {res}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </>
      )}
    </div>
  );
};
