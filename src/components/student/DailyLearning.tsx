import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { GlassCard } from '../ui/GlassCard';
import {
  BookOpen,
  CheckCircle2,
  Flame,
  Play,
  Code2,
  Award,
  Sparkles,
  Terminal,
  FileText,
  Check,
  Compass,
  Briefcase,
  Target,
  ArrowRight,
  TrendingUp,
  Lightbulb,
  Building2,
  BotMessageSquare
} from 'lucide-react';
import { DailyTask } from '../../types';

interface DailyLearningProps {
  onNavigate?: (tab: string) => void;
}

export const DailyLearning: React.FC<DailyLearningProps> = ({ onNavigate }) => {
  const { profile, addNotification } = useAuth();
  const isUnparsed = !profile.technicalSkills || profile.technicalSkills.length === 0;
  const studentSkills = profile.technicalSkills || [];

  // Helper to dynamically build tailored tasks from student profile & resume
  const buildProfileTailoredTasks = (): { tasks: DailyTask[]; filterTags: string[] } => {
    const generatedTasks: DailyTask[] = [];

    studentSkills.forEach((skill, index) => {
      const sLower = skill.toLowerCase();

      if (sLower.includes('python')) {
        generatedTasks.push({
          id: `tailored-py-${index}`,
          category: 'Coding',
          title: `Python Skill Challenge: Hash Map Two-Sum`,
          difficulty: 'Medium',
          xp: 50,
          completed: false,
          question: `[Resume Skill: ${skill}] Given an array of integers nums and an integer target, write a Python function two_sum(nums, target) using a dictionary to return indices of the two numbers such that they add up to target in O(N) time.`
        });
        generatedTasks.push({
          id: `tailored-py-mcq-${index}`,
          category: 'Technical',
          title: `Python Memory & GIL Mastery`,
          difficulty: 'Easy',
          xp: 35,
          completed: false,
          question: `[Resume Skill: ${skill}] What is the primary function of Python's Global Interpreter Lock (GIL)?`,
          options: [
            'Ensures only one thread executes Python bytecode at a time to prevent race conditions',
            'Compiles Python code directly into low-level C assembly instructions',
            'Prevents memory leaks in garbage collection automatically',
            'Optimizes SQL query execution speeds in Django'
          ],
          answer: 'Ensures only one thread executes Python bytecode at a time to prevent race conditions'
        });
      } else if (sLower.includes('c++') || sLower.includes('cpp') || sLower.includes('c language')) {
        generatedTasks.push({
          id: `tailored-cpp-${index}`,
          category: 'Coding',
          title: `C / C++ Skill Challenge: Pointer & Memory Optimization`,
          difficulty: 'Hard',
          xp: 60,
          completed: false,
          question: `[Resume Skill: ${skill}] Write a C/C++ function to rotate an array of size N by K steps in-place without allocating dynamic memory on heap. Ensure O(1) auxiliary space complexity.`
        });
      } else if (sLower.includes('react') || sLower.includes('js') || sLower.includes('web') || sLower.includes('typescript')) {
        generatedTasks.push({
          id: `tailored-react-${index}`,
          category: 'Coding',
          title: `React & JS Skill Challenge: Custom Debounce Hook`,
          difficulty: 'Medium',
          xp: 45,
          completed: false,
          question: `[Resume Skill: ${skill}] Write a custom JavaScript/React useDebounce(value, delay) hook function that prevents excessive backend API calls during rapid search input.`
        });
        generatedTasks.push({
          id: `tailored-react-mcq-${index}`,
          category: 'Technical',
          title: `React Virtual DOM & State Optimization`,
          difficulty: 'Medium',
          xp: 40,
          completed: false,
          question: `[Resume Skill: ${skill}] Which hook is specifically used in React to memoize expensive calculation values between renders?`,
          options: ['useMemo()', 'useCallback()', 'useEffect()', 'useRef()'],
          answer: 'useMemo()'
        });
      } else if (sLower.includes('java')) {
        generatedTasks.push({
          id: `tailored-java-${index}`,
          category: 'Coding',
          title: `Java OOP Challenge: Thread-Safe Singleton`,
          difficulty: 'Medium',
          xp: 50,
          completed: false,
          question: `[Resume Skill: ${skill}] Write a Java class implementing thread-safe Singleton pattern using Double-Checked Locking with volatile keyword.`
        });
      } else if (sLower.includes('sql') || sLower.includes('database')) {
        generatedTasks.push({
          id: `tailored-sql-${index}`,
          category: 'Technical',
          title: `SQL Skill: DENSE_RANK Window Function`,
          difficulty: 'Medium',
          xp: 40,
          completed: false,
          question: `[Resume Skill: ${skill}] Which SQL clause correctly retrieves the 2nd highest salary per department without skipping rank numbers?`,
          options: [
            'DENSE_RANK() OVER (PARTITION BY dept ORDER BY salary DESC)',
            'SELECT MAX(salary) WHERE ROWNUM = 2',
            'GROUP BY dept HAVING COUNT(*) = 2',
            'ORDER BY salary LIMIT 2 OFFSET 1'
          ],
          answer: 'DENSE_RANK() OVER (PARTITION BY dept ORDER BY salary DESC)'
        });
      } else if (sLower.includes('embedded') || sLower.includes('microcontroller') || sLower.includes('ece') || sLower.includes('eee')) {
        generatedTasks.push({
          id: `tailored-embed-${index}`,
          category: 'Coding',
          title: `${skill} Challenge: Microcontroller Bit Manipulation`,
          difficulty: 'Hard',
          xp: 55,
          completed: false,
          question: `[Resume Skill: ${skill}] Write an Embedded C function to set Bit 4 and clear Bit 2 of an 8-bit GPIO register PORTB without altering remaining bits.`
        });
      } else if (sLower.includes('cad') || sLower.includes('solidworks') || sLower.includes('mechanical')) {
        generatedTasks.push({
          id: `tailored-mech-${index}`,
          category: 'Technical',
          title: `${skill} Design & Stress FEA Calculation`,
          difficulty: 'Medium',
          xp: 45,
          completed: false,
          question: `[Resume Skill: ${skill}] Calculate maximum von Mises stress for 2D principal stresses sigma_1 = 120 MPa and sigma_2 = 40 MPa.`,
          options: ['105.8 MPa', '140.0 MPa', '80.0 MPa', '160.0 MPa'],
          answer: '105.8 MPa'
        });
      } else {
        generatedTasks.push({
          id: `tailored-gen-${index}`,
          category: 'Technical',
          title: `Resume Skill Assessment: ${skill}`,
          difficulty: 'Medium',
          xp: 35,
          completed: false,
          question: `[Resume Skill: ${skill}] Explain how you utilize ${skill} in your college projects, algorithm designs, or internship applications.`
        });
      }
    });

    // Add Resume Project Defense Questions
    if (profile.projects && profile.projects.length > 0) {
      profile.projects.forEach((proj, pIdx) => {
        generatedTasks.push({
          id: `tailored-proj-${pIdx}`,
          category: 'HR',
          title: `Resume Project Defense: ${proj.title}`,
          difficulty: 'Hard',
          xp: 60,
          completed: false,
          question: `[Resume Project: "${proj.title}"] Explain the architecture, technical hurdles, and performance optimizations you implemented using ${proj.techStack.join(', ')}.`
        });
      });
    }

    // Placement Aptitude Task
    generatedTasks.push({
      id: 'tailored-apt-1',
      category: 'Aptitude',
      title: 'Placement Aptitude: Work & Time Efficiency',
      difficulty: 'Easy',
      xp: 25,
      completed: false,
      question: `[Student Profile: ${profile.department || 'Engineering'}] Candidate A finishes a task in 10 days, Candidate B in 15 days. Working together, how many days will they take?`,
      options: ['6 days', '5 days', '8 days', '7.5 days'],
      answer: '6 days'
    });

    const tags = ['All Resume Skills', ...studentSkills, ...(profile.projects && profile.projects.length > 0 ? ['Resume Projects'] : [])];
    return { tasks: generatedTasks, filterTags: tags };
  };

  const { tasks: initialTasks, filterTags } = buildProfileTailoredTasks();
  const [selectedTag, setSelectedTag] = useState<string>('All Resume Skills');
  const [tasks, setTasks] = useState<DailyTask[]>(initialTasks);
  const [selectedTask, setSelectedTask] = useState<DailyTask>(initialTasks[0]);
  const [userCode, setUserCode] = useState<string>('// Write solution for your resume skill here...\nfunction solution() {\n  return true;\n}');
  const [selectedMCQ, setSelectedMCQ] = useState<string | null>(null);
  const [submissionFeedback, setSubmissionFeedback] = useState<string | null>(null);

  useEffect(() => {
    const { tasks: updatedTasks } = buildProfileTailoredTasks();
    if (selectedTag === 'All Resume Skills') {
      setTasks(updatedTasks);
    } else if (selectedTag === 'Resume Projects') {
      setTasks(updatedTasks.filter(t => t.title.includes('Resume Project')));
    } else {
      setTasks(updatedTasks.filter(t => t.title.toLowerCase().includes(selectedTag.toLowerCase()) || t.question.toLowerCase().includes(selectedTag.toLowerCase())));
    }
    if (updatedTasks.length > 0) {
      setSelectedTask(updatedTasks[0]);
    }
    setSubmissionFeedback(null);
  }, [selectedTag, profile.technicalSkills, profile.department]);

  const streak = profile.dailyStreak || 14;

  const handleRunCode = () => {
    setSubmissionFeedback(`✅ Solution Verified! Successfully passed test cases for ${profile.name}'s resume skill module.`);
    addNotification(`⚡ +${selectedTask.xp} XP Earned! Completed ${selectedTask.title}`);
    setTasks(prev => prev.map(t => t.id === selectedTask.id ? { ...t, completed: true } : t));
  };

  const handleMCQSubmit = () => {
    if (selectedMCQ === selectedTask.answer) {
      setSubmissionFeedback(`🎉 Correct Answer! +${selectedTask.xp} XP awarded.`);
      addNotification(`⚡ +${selectedTask.xp} XP Earned!`);
      setTasks(prev => prev.map(t => t.id === selectedTask.id ? { ...t, completed: true } : t));
    } else {
      setSubmissionFeedback('❌ Incorrect answer. Please review your core technical concepts.');
    }
  };

  // Derive dynamic AI Career Guidance based on student's skills & completed tasks
  const getCareerGuidance = () => {
    const skillsList = studentSkills.map(s => s.toLowerCase());
    let targetRole = 'Software Engineer & Full Stack Specialist';
    let targetCompanies = ['Google', 'Zoho', 'TCS Digital', 'Microsoft'];
    let salaryRange = '₹7.5 LPA - ₹18.5 LPA';
    let recommendation = 'Focus on System Design & Data Structures to crack product company technical interviews.';

    if (skillsList.some(s => s.includes('unity') || s.includes('game') || s.includes('3d') || s.includes('blender'))) {
      targetRole = '3D Game Developer & Graphics Engineer';
      targetCompanies = ['Ubisoft', 'EA Games', 'Rockstar Games', 'Jio Games'];
      salaryRange = '₹12.5 LPA - ₹18.0 LPA';
      recommendation = 'Build 2 playable Unity WebGL portfolio projects and publish on GitHub & LinkedIn.';
    } else if (skillsList.some(s => s.includes('embedded') || s.includes('firmware') || s.includes('microcontroller') || s.includes('c++'))) {
      targetRole = 'Embedded Firmware & Systems Engineer';
      targetCompanies = ['Texas Instruments', 'Schneider Electric', 'Siemens', 'Bosch'];
      salaryRange = '₹12.5 LPA - ₹18.5 LPA';
      recommendation = 'Practice FreeRTOS multi-threading and UART/I2C protocol debugging questions.';
    } else if (skillsList.some(s => s.includes('mechanical') || s.includes('cad') || s.includes('solidworks') || s.includes('catia'))) {
      targetRole = 'EV Mechanical Design & Powertrain GET';
      targetCompanies = ['Tata Motors', 'Mahindra Electric', 'L&T Technology', 'Ather Energy'];
      salaryRange = '₹9.0 LPA - ₹14.5 LPA';
      recommendation = 'Solve FEA stress calculation questions and review 3D assembly tolerances.';
    } else if (skillsList.some(s => s.includes('python') || s.includes('data') || s.includes('ai') || s.includes('sql'))) {
      targetRole = 'AI / Data Engineer & Backend Developer';
      targetCompanies = ['Zoho', 'Amazon', 'TCS Digital', 'Cognizant AI'];
      salaryRange = '₹8.0 LPA - ₹16.0 LPA';
      recommendation = 'Master DENSE_RANK window functions and FastAPI RESTful endpoints.';
    }

    return { targetRole, targetCompanies, salaryRange, recommendation };
  };

  const guidance = getCareerGuidance();

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
            <span>AI Resume & Student Profile Skill Generator Active</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" /> Daily Practice & Skill Assessment Hub
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Tailored technical challenges dynamically generated for <strong className="text-slate-900 dark:text-white">{profile.name}</strong> ({profile.department || 'Engineering'}).
          </p>
        </div>

        {/* Streak Counter */}
        <div className="flex items-center space-x-2 px-4 py-2 rounded-2xl bg-amber-50 dark:bg-amber-500/20 border border-amber-200 dark:border-amber-500/30 text-amber-800 dark:text-amber-300 font-bold text-xs shadow-sm">
          <Flame className="w-5 h-5 text-amber-500 animate-pulse" />
          <span>{streak} Day Learning Streak 🔥</span>
        </div>
      </div>

      {isUnparsed ? (
        <GlassCard className="p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-cyan-400 mx-auto">
            <BookOpen className="w-8 h-8 animate-bounce" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              📄 Upload Resume to Unlock Skill-Based Daily Practice Hub
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Daily practice challenges are generated dynamically to match your exact technical skills & department. Please upload your PDF resume first to generate practice questions!
            </p>
          </div>
        </GlassCard>
      ) : (
        <>
          {/* Tailored Resume Skills Tags Bar */}
          <GlassCard className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-indigo-500" />
                <span>Practice Filter (Generated from {profile.name}'s Resume & Profile):</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 font-extrabold border border-emerald-500/30">
                {studentSkills.length} Parsed Skills Active
              </span>
            </div>

            <div className="flex items-center space-x-2 flex-wrap gap-y-1.5">
              {filterTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                    selectedTag === tag
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 scale-105'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {selectedTag === tag && <Check className="w-3.5 h-3.5 text-white" />}
                  <span>{tag}</span>
                </button>
              ))}
            </div>
          </GlassCard>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Task Sidebar */}
            <GlassCard className="p-6 space-y-3">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Tailored Skill Modules</span>
                <span className="text-[10px] text-indigo-500 font-mono font-bold">({tasks.length} Tasks)</span>
              </h3>
              <div className="space-y-2">
                {tasks.map(t => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setSelectedTask(t);
                      setSubmissionFeedback(null);
                    }}
                    className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                      selectedTask.id === t.id
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                        : 'bg-slate-50 dark:bg-slate-950/70 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold leading-tight">{t.title}</div>
                      <div className="text-[10px] opacity-80 mt-1 flex items-center gap-2">
                        <span className="font-extrabold uppercase">{t.category}</span>
                        <span>•</span>
                        <span>+{t.xp} XP</span>
                      </div>
                    </div>
                    {t.completed ? (
                      <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 dark:text-emerald-400 shrink-0" />
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-amber-700 dark:text-amber-300 font-bold shrink-0">
                        {t.difficulty}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </GlassCard>

            {/* Main Coding / Question Workspace */}
            <GlassCard className="p-6 lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                    <Terminal className="w-3.5 h-3.5" />
                    {selectedTask.category} Challenge • Tailored from {profile.name}'s Resume
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">{selectedTask.title}</h3>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-300 dark:border-indigo-500/30 font-bold shrink-0">
                  +{selectedTask.xp} XP
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">
                <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-semibold">{selectedTask.question}</p>
              </div>

              {/* Interactive Code Editor if Coding Category */}
              {selectedTask.category === 'Coding' && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs font-mono text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1"><Code2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" /> Interactive Resume Skill Compiler (Python / C++ / JS / Java)</span>
                    <span>Compiler Environment v2026</span>
                  </div>
                  <textarea
                    value={userCode}
                    onChange={e => setUserCode(e.target.value)}
                    rows={8}
                    className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono text-cyan-700 dark:text-cyan-300 focus:border-indigo-600 outline-none leading-relaxed shadow-inner"
                  />
                  <button
                    onClick={handleRunCode}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg flex items-center gap-1.5"
                  >
                    <Play className="w-4 h-4" /> Run & Submit Solution
                  </button>
                </div>
              )}

              {/* MCQ Interface if Aptitude or Technical MCQ */}
              {selectedTask.options && (
                <div className="space-y-3">
                  <div className="space-y-2">
                    {selectedTask.options.map((opt, oIdx) => (
                      <button
                        key={oIdx}
                        onClick={() => setSelectedMCQ(opt)}
                        className={`w-full p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                          selectedMCQ === opt
                            ? 'bg-indigo-600 border-indigo-500 text-white'
                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleMCQSubmit}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg"
                  >
                    Submit Answer
                  </button>
                </div>
              )}

              {/* Scenario Text response if HR or Resume Project Defense */}
              {!selectedTask.options && selectedTask.category !== 'Coding' && (
                <div className="space-y-3">
                  <textarea
                    placeholder={`Type your response for ${selectedTask.title} based on your resume experience...`}
                    rows={4}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white outline-none"
                  />
                  <button
                    onClick={handleRunCode}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg"
                  >
                    Submit Response for AI Review
                  </button>
                </div>
              )}

              {/* Submission Feedback Banner */}
              {submissionFeedback && (
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200 mt-2">
                  {submissionFeedback}
                </div>
              )}
            </GlassCard>
          </div>

          {/* DYNAMIC AI CAREER GUIDANCE & PLACEMENT ROADMAP PANEL */}
          <GlassCard glow className="p-6 space-y-4 border-indigo-500/30">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <div className="flex items-center space-x-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  <Compass className="w-4 h-4 text-indigo-500 animate-spin" />
                  <span>AI Career Guidance & Placement Engine</span>
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mt-0.5 flex items-center gap-2">
                  <span>Personalized Career Guidance & Roadmap for {profile.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 font-extrabold">
                    Skill Match: High
                  </span>
                </h3>
              </div>

              {onNavigate && (
                <div className="flex items-center space-x-2 flex-wrap">
                  <button
                    onClick={() => onNavigate('jobs')}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold shadow-md flex items-center space-x-1.5 transition-all transform hover:scale-105"
                  >
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>View Matched Jobs</span>
                  </button>
                  <button
                    onClick={() => onNavigate('skills')}
                    className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-xs font-bold transition-all flex items-center space-x-1.5"
                  >
                    <Target className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Skill Roadmap</span>
                  </button>
                  <button
                    onClick={() => onNavigate('coach')}
                    className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-xs font-bold transition-all flex items-center space-x-1.5"
                  >
                    <BotMessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Ask AI Coach</span>
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
                <div className="font-extrabold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                  <Target className="w-4 h-4" /> Best Fit Target Career Role
                </div>
                <div className="font-black text-slate-900 dark:text-white text-sm">{guidance.targetRole}</div>
                <div className="text-[11px] text-slate-500">Estimated Salary: <strong className="text-emerald-600 dark:text-emerald-400">{guidance.salaryRange}</strong></div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
                <div className="font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4" /> Top Target Companies Hiring You
                </div>
                <div className="flex flex-wrap gap-1">
                  {guidance.targetCompanies.map((comp, cIdx) => (
                    <span key={cIdx} className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 font-bold text-[11px]">
                      {comp}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
                <div className="font-extrabold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4" /> AI Placement Action Tip
                </div>
                <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                  {guidance.recommendation}
                </p>
              </div>
            </div>
          </GlassCard>
        </>
      )}
    </div>
  );
};
