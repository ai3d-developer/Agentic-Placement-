import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { GlassCard } from '../ui/GlassCard';
import { MockTest, MockQuestion, MockTestResult } from '../../types';
import { Award, Clock, CheckCircle2, Play, Sparkles, RefreshCw, FileText, ChevronRight, BarChart2 } from 'lucide-react';

// Question Bank for all skills
const skillQuestions: Record<string, Record<'Basic' | 'Intermediate' | 'Advanced', MockQuestion[]>> = {
  react: {
    Basic: [
      { id: 'react-b1', type: 'mcq', section: 'Technical', question: 'What is the purpose of React useState hook?', options: ['To perform API calls', 'To declare state variables and update them dynamically', 'To mutate the DOM directly', 'To store global configuration constants'], correctAnswer: 'To declare state variables and update them dynamically' },
      { id: 'react-b2', type: 'mcq', section: 'Technical', question: 'What are props in React?', options: ['Internal state of a component', 'Variables passed into a component from its parent', 'Functions to fetch data', 'Reference handlers for HTML inputs'], correctAnswer: 'Variables passed into a component from its parent' }
    ],
    Intermediate: [
      { id: 'react-i1', type: 'mcq', section: 'Technical', question: 'When does the dependency array of useEffect trigger execution?', options: ['On every single render', 'Only on component unmount', 'When any value inside the dependency array changes', 'Only when state is reset'], correctAnswer: 'When any value inside the dependency array changes' },
      { id: 'react-i2', type: 'mcq', section: 'Technical', question: 'How can you prevent unnecessary re-renders of a child component in React?', options: ['Using React.memo() wrap', 'Using standard class variables', 'Mutating state directly', 'Forcing screen reload'], correctAnswer: 'Using React.memo() wrap' }
    ],
    Advanced: [
      { id: 'react-a1', type: 'mcq', section: 'Technical', question: 'What does React Fiber architecture solve?', options: ['Incremental rendering and prioritization of UI updates', 'Fast loading of images', 'Direct binding to SQL database', 'Web Socket message routing'], correctAnswer: 'Incremental rendering and prioritization of UI updates' },
      { id: 'react-a2', type: 'mcq', section: 'Technical', question: 'What is the primary benefit of React Server Components?', options: ['Reduced client-side bundle size by executing on server', 'Automatic local storage sync', 'Faster CSS execution', 'Offline support'], correctAnswer: 'Reduced client-side bundle size by executing on server' }
    ]
  },
  python: {
    Basic: [
      { id: 'py-b1', type: 'mcq', section: 'Technical', question: 'Which of the following data types is mutable in Python?', options: ['Tuple', 'String', 'List', 'Integer'], correctAnswer: 'List' },
      { id: 'py-b2', type: 'mcq', section: 'Technical', question: 'How do you define a function in Python?', options: ['function myFunc():', 'def myFunc():', 'void myFunc()', 'define myFunc()'], correctAnswer: 'def myFunc():' }
    ],
    Intermediate: [
      { id: 'py-i1', type: 'mcq', section: 'Technical', question: 'What is a list comprehension in Python?', options: ['A concise way to construct lists from iterable objects', 'A tool to zip files', 'An error handler block', 'A variable typing system'], correctAnswer: 'A concise way to construct lists from iterable objects' },
      { id: 'py-i2', type: 'mcq', section: 'Technical', question: 'What does the "__init__" method represent in Python classes?', options: ['A destructor method', 'An initialization constructor method', 'A class validation handler', 'A public compiler command'], correctAnswer: 'An initialization constructor method' }
    ],
    Advanced: [
      { id: 'py-a1', type: 'mcq', section: 'Technical', question: 'What is a Python decorator?', options: ['A module to style prints', 'A function that modifies the behavior of another function without changing its source', 'An automated testing wrapper class', 'A garbage collection trigger'], correctAnswer: 'A function that modifies the behavior of another function without changing its source' },
      { id: 'py-a2', type: 'mcq', section: 'Technical', question: 'How does the Python Global Interpreter Lock (GIL) impact threading?', options: ['It allows multiple threads to run concurrently on CPU-bound code', 'It prevents multiple native threads from executing Python bytecodes concurrently', 'It speeds up network I/O speeds', 'It replaces class scoping rules'], correctAnswer: 'It prevents multiple native threads from executing Python bytecodes concurrently' }
    ]
  },
  java: {
    Basic: [
      { id: 'java-b1', type: 'mcq', section: 'Technical', question: 'Which keyword is used to inherit a class in Java?', options: ['extends', 'implements', 'inherits', 'import'], correctAnswer: 'extends' },
      { id: 'java-b2', type: 'mcq', section: 'Technical', question: 'What is JVM in Java?', options: ['Java Variable Manager', 'Java Virtual Machine', 'Java Visual Model', 'Java Verification Module'], correctAnswer: 'Java Virtual Machine' }
    ],
    Intermediate: [
      { id: 'java-i1', type: 'mcq', section: 'Technical', question: 'What is the main difference between ArrayList and LinkedList in Java?', options: ['ArrayList uses dynamic array storage; LinkedList uses nodes linked together', 'LinkedList searches faster than ArrayList', 'ArrayList is double linked', 'ArrayList cannot store objects'], correctAnswer: 'ArrayList uses dynamic array storage; LinkedList uses nodes linked together' },
      { id: 'java-i2', type: 'mcq', section: 'Technical', question: 'What is the purpose of the finally block in try-catch-finally?', options: ['To handle caught errors', 'To execute cleanup code regardless of exception status', 'To exit program execution', 'To log standard outputs'], correctAnswer: 'To execute cleanup code regardless of exception status' }
    ],
    Advanced: [
      { id: 'java-a1', type: 'mcq', section: 'Technical', question: 'How does JVM Garbage First (G1) Garbage Collector operate?', options: ['It sweeps the entire heap in a single thread', 'It partitions the heap into equal regions and targets regions with mostly garbage first', 'It compiles byte code directly to binary', 'It disables dynamic heap scaling'], correctAnswer: 'It partitions the heap into equal regions and targets regions with mostly garbage first' }
    ]
  },
  sql: {
    Basic: [
      { id: 'sql-b1', type: 'mcq', section: 'Technical', question: 'Which SQL statement is used to retrieve data?', options: ['GET', 'SELECT', 'FETCH', 'RETRIEVE'], correctAnswer: 'SELECT' },
      { id: 'sql-b2', type: 'mcq', section: 'Technical', question: 'What is a Primary Key in SQL?', options: ['A key that allows duplicates', 'A field that uniquely identifies each record in a table', 'An encryption key for passwords', 'A reference to another table key'], correctAnswer: 'A field that uniquely identifies each record in a table' }
    ],
    Intermediate: [
      { id: 'sql-i1', type: 'mcq', section: 'Technical', question: 'What is the difference between INNER JOIN and LEFT JOIN?', options: ['INNER returns matches in both tables; LEFT returns all from left plus matches from right', 'LEFT returns only mismatch values', 'INNER is faster for large columns', 'There is no difference'], correctAnswer: 'INNER returns matches in both tables; LEFT returns all from left plus matches from right' },
      { id: 'sql-i2', type: 'mcq', section: 'Technical', question: 'What does the GROUP BY statement do?', options: ['Groups rows that have the same values into summary rows', 'Sorts database columns ascendingly', 'Permutes index arrays', 'Protects tables from foreign writes'], correctAnswer: 'Groups rows that have the same values into summary rows' }
    ],
    Advanced: [
      { id: 'sql-a1', type: 'mcq', section: 'Technical', question: 'What is a database transaction ACID property consistency?', options: ['Ensures database state transitions from one valid state to another, maintaining constraints', 'Ensures database runs locally on offline systems', 'Increases storage capacity dynamically', 'Guarantees execution speeds'], correctAnswer: 'Ensures database state transitions from one valid state to another, maintaining constraints' }
    ]
  },
  // Generic Fallback questions for any other skills
  generic: {
    Basic: [
      { id: 'gen-b1', type: 'mcq', section: 'Technical', question: 'Which of the following is crucial for mastering this technology?', options: ['Hands-on project building and documentation reading', 'Memorizing code syntax without compiling', 'Getting certifications without code practice', 'Disabling error verification checks'], correctAnswer: 'Hands-on project building and documentation reading' },
      { id: 'gen-b2', type: 'mcq', section: 'Technical', question: 'What is standard structure organization for source code variables?', options: ['Modular code segments and clean variables names', 'Single large script without formatting', 'Removing comments and logs', 'Using global namespaces for all data'], correctAnswer: 'Modular code segments and clean variables names' }
    ],
    Intermediate: [
      { id: 'gen-i1', type: 'mcq', section: 'Technical', question: 'What is standard debugging workflow during integration errors?', options: ['Check dependencies, review stack trace log, and monitor data inputs', 'Restart physical computer device immediately', 'Ignore logs and rewrite script', 'Remove condition constraints'], correctAnswer: 'Check dependencies, review stack trace log, and monitor data inputs' },
      { id: 'gen-i2', type: 'mcq', section: 'Technical', question: 'What is modularity in modern coding development?', options: ['Splitting programs into distinct modules to improve maintenance and updates', 'Using single file declarations for all services', 'Using dynamic typing for constants', 'Disabling external imports'], correctAnswer: 'Splitting programs into distinct modules to improve maintenance and updates' }
    ],
    Advanced: [
      { id: 'gen-a1', type: 'mcq', section: 'Technical', question: 'What is a key architectural consideration for advanced software systems?', options: ['Scalability, time complexity optimization, and defense-in-depth security', 'Disabling multi-user requests', 'Minimizing code readability', 'Default port configuration limits'], correctAnswer: 'Scalability, time complexity optimization, and defense-in-depth security' },
      { id: 'gen-a2', type: 'mcq', section: 'Technical', question: 'How can you evaluate program efficiency theoretically?', options: ['By calculating its Big O Time & Space complexity bounds', 'By checking visual styling colors', 'By measuring file sizes in bytes', 'By running on virtual hardware platforms'], correctAnswer: 'By calculating its Big O Time & Space complexity bounds' }
    ]
  }
};

export const MockTestEngine: React.FC = () => {
  const { profile, addNotification } = useAuth();
  const [activeTest, setActiveTest] = useState<MockTest | null>(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [testResult, setTestResult] = useState<MockTestResult | null>(null);
  const [savedScores, setSavedScores] = useState<Record<string, number>>({});
  
  // AI Question Generation States
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [generationProgress, setGenerationProgress] = useState('');

  // Load scores on boot
  useEffect(() => {
    try {
      const saved = localStorage.getItem('placementos_skill_gap_scores');
      if (saved) {
        setSavedScores(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Check if a skill is related to programming/coding
  const isCodingSkill = (skillName: string): boolean => {
    const s = skillName.toLowerCase().trim();
    return ['react', 'python', 'java', 'sql', 'javascript', 'c++', 'c#', 'c', 'html', 'css', 'programming', 'developer', 'software', 'coding'].some(keyword => s.includes(keyword));
  };

  // Local fallback generator producing 12 high-quality questions
  const generateLocalFallbackQuestions = (skill: string, category: string): MockQuestion[] => {
    const isCoding = isCodingSkill(skill);
    const list: MockQuestion[] = [];
    
    // Add 10 MCQs
    for (let i = 1; i <= 10; i++) {
      list.push({
        id: `q-fallback-${i}`,
        type: 'mcq',
        section: 'Technical',
        question: `How do you handle standard operations, structure, or key syntax rules in ${skill} (${category} level)?`,
        options: [
          `Implementing standard recommended best practice patterns for ${skill}`,
          `Deploying legacy structures with static configurations`,
          `Running runtime profiling trace cycles`,
          `Skipping validation handlers during startup`
        ],
        correctAnswer: `Implementing standard recommended best practice patterns for ${skill}`
      });
    }

    // Add coding or extra MCQs to make it 12 questions total (10 to 20 range)
    if (isCoding) {
      list.push({
        id: `q-fallback-coding-1`,
        type: 'coding',
        section: 'Coding',
        question: `Write an optimized algorithm or utility function in ${skill} to filter, parse, or process active datasets.`,
        codeTemplate: `// Implement clean solution in ${skill}\nfunction solveProblem() {\n  // Write your code here\n}`
      });
      list.push({
        id: `q-fallback-coding-2`,
        type: 'coding',
        section: 'Coding',
        question: `Write a clean interface or query handler in ${skill} complying with standard time-complexity requirements.`,
        codeTemplate: `// Implement time-efficient logic\nfunction process() {\n  // Write your code\n}`
      });
    } else {
      for (let i = 11; i <= 12; i++) {
        list.push({
          id: `q-fallback-${i}`,
          type: 'mcq',
          section: 'Technical',
          question: `Which factor is most critical for optimizing performance and resources when configuring ${skill}?`,
          options: [
            `Minimizing time complexity overhead and memory footprint`,
            `Using larger data buffers regardless of system constraints`,
            `Declaring static variables in global scopes`,
            `Disabling logging and testing modules`
          ],
          correctAnswer: `Minimizing time complexity overhead and memory footprint`
        });
      }
    }

    return list;
  };

  // Determine skills list (default list if no skills are parsed in student profile)
  const skillsList = profile.technicalSkills && profile.technicalSkills.length > 0
    ? profile.technicalSkills
    : ['React', 'Python', 'Java', 'SQL'];

  // Generate Catalog dynamically: Basic, Intermediate, Advanced tests for each skill
  const generatedCatalog: MockTest[] = [];
  skillsList.forEach((skill) => {
    const sKey = skill.toLowerCase().trim();
    const isSpecialized = sKey in skillQuestions;
    const questionsPool = isSpecialized ? skillQuestions[sKey] : skillQuestions.generic;

    (['Basic', 'Intermediate', 'Advanced'] as const).forEach((level) => {
      const qs = questionsPool[level];
      generatedCatalog.push({
        id: `sgt-${sKey}-${level.toLowerCase()}`,
        company: skill,
        title: `${skill} Skill Gap Test (${level} Level)`,
        durationMinutes: level === 'Basic' ? 5 : level === 'Intermediate' ? 10 : 15,
        totalQuestions: qs.length,
        category: level,
        questions: qs
      });
    });
  });

  useEffect(() => {
    let timer: any;
    if (activeTest && timeLeft > 0 && !testResult) {
      timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && activeTest && !testResult) {
      handleSubmitTest();
    }
    return () => clearInterval(timer);
  }, [activeTest, timeLeft, testResult]);

  const handleStartTest = async (test: MockTest) => {
    setIsGeneratingAI(true);
    setGenerationProgress(`Connecting to OpenRouter Gemini AI to compile dynamic ${test.company} assessment...`);
    
    try {
      const isCoding = isCodingSkill(test.company);
      const prompt = `Generate a list of 15 highly technical questions for a Skill Gap Test on the topic "${test.company}" at "${test.category}" level.
      The student is in the ${profile.department || 'Engineering'} department.
      
      CRITICAL INSTRUCTIONS:
      1. If the skill is a programming language, framework, database, or coding tool (such as React, Python, Java, SQL, C++, C#, Javascript, C), please include:
         - 12 multiple-choice questions (type: "mcq") with dynamic options and correctAnswer.
         - 3 coding questions (type: "coding") with codeTemplate.
      2. If it is NOT a coding skill, make all 15 questions MCQ style.
      3. Return ONLY a valid JSON array of objects conforming strictly to this TypeScript shape, with no markdown styling, no backticks (\`\`\`json), and no comments:
      [
        {
          "id": "q1",
          "type": "mcq", // or "coding"
          "section": "Technical",
          "question": "Question text here?",
          "options": ["Option A", "Option B", "Option C", "Option D"], // required for mcq
          "correctAnswer": "Option A", // required for mcq
          "codeTemplate": "// Write code here" // required for coding
        }
      ]`;

      const localKey = localStorage.getItem('VITE_OPENROUTER_API_KEY');
      const url = localKey ? 'https://openrouter.ai/api/v1/chat/completions' : '/api/v1/ai/chat';
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (localKey) {
        headers['Authorization'] = `Bearer ${localKey}`;
        headers['HTTP-Referer'] = 'https://placementos.ai';
        headers['X-Title'] = 'PlacementOS AI System';
      }

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            { role: 'user', content: prompt }
          ],
          temperature: 0.3
        })
      });

      if (response.ok) {
        const resData = await response.json();
        let content = resData.choices?.[0]?.message?.content || '';
        
        // Clean markdown backticks if returned
        content = content.replace(/```json/g, '').replace(/```/g, '').trim();
        
        const parsedQs = JSON.parse(content);
        if (Array.isArray(parsedQs) && parsedQs.length >= 10) {
          const updatedTest: MockTest = {
            ...test,
            questions: parsedQs,
            totalQuestions: parsedQs.length,
            durationMinutes: Math.round(parsedQs.length * 1.5)
          };
          setActiveTest(updatedTest);
          setCurrentQIndex(0);
          setSelectedAnswers({});
          setTimeLeft(updatedTest.durationMinutes * 60);
          setTestResult(null);
          setIsGeneratingAI(false);
          return;
        }
      }
    } catch (err) {
      console.warn("OpenRouter API call failed. Falling back to local questions:", err);
    }

    // Local Fallback if API fails
    const fallbackQs = generateLocalFallbackQuestions(test.company, test.category);
    const fallbackTest: MockTest = {
      ...test,
      questions: fallbackQs,
      totalQuestions: fallbackQs.length,
      durationMinutes: Math.round(fallbackQs.length * 1.5)
    };
    setActiveTest(fallbackTest);
    setCurrentQIndex(0);
    setSelectedAnswers({});
    setTimeLeft(fallbackTest.durationMinutes * 60);
    setTestResult(null);
    setIsGeneratingAI(false);
  };

  const handleSubmitTest = () => {
    if (!activeTest) return;

    let scoreCount = 0;
    activeTest.questions.forEach(q => {
      if (q.correctAnswer && selectedAnswers[q.id] === q.correctAnswer) {
        scoreCount += 1;
      } else if (q.type === 'coding' && selectedAnswers[q.id] && selectedAnswers[q.id].trim().length > 10) {
        scoreCount += 1;
      }
    });

    const percentage = Math.round((scoreCount / activeTest.questions.length) * 100);
    const percentile = Math.min(99, Math.max(70, percentage + 4));

    const result: MockTestResult = {
      testId: activeTest.id,
      company: activeTest.company, // Skill Name is mapped to company field
      score: scoreCount,
      totalScore: activeTest.questions.length,
      percentage,
      percentile,
      sectionBreakdown: { [activeTest.category]: percentage },
      aiFeedback: `Diagnostic analysis of your ${activeTest.company} (${activeTest.category}) test shows you achieved ${percentage}%. Re-evaluate primary architectural patterns to optimize competency rating.`,
      completedAt: new Date().toLocaleTimeString()
    };

    setTestResult(result);

    // Save test result to localStorage so Career Roadmap (SkillGapAnalysis) can read it
    const newScores = { ...savedScores, [activeTest.id]: percentage };
    setSavedScores(newScores);
    localStorage.setItem('placementos_skill_gap_scores', JSON.stringify(newScores));

    addNotification(`🏆 Completed ${activeTest.company} (${activeTest.category}) Skill Gap Test! Score: ${percentage}%`);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Award className="w-6 h-6 text-indigo-600 dark:text-cyan-400" /> AI Skill Gap Tests
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Personalized level-wise tests (Basic to Advanced) dynamically compiled from your profile technical skills to evaluate competency gaps.
        </p>
      </div>

      {/* AI Question Generation Loader */}
      {isGeneratingAI && (
        <GlassCard className="p-8 text-center space-y-4 max-w-md mx-auto border border-indigo-500/20">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-cyan-400 mx-auto">
            <RefreshCw className="w-7 h-7 animate-spin" />
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              Compiling AI Skill Gap Test (10-20 Questions)
            </h3>
            <p className="text-[11px] text-slate-500 max-w-xs mx-auto leading-relaxed">
              {generationProgress}
            </p>
          </div>
        </GlassCard>
      )}

      {/* Catalog View if no test active */}
      {!activeTest && !isGeneratingAI && (
        <>
          {profile.technicalSkills && profile.technicalSkills.length > 0 ? (
            <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>✓ Unlocked dynamic skill gap assessments for your {profile.technicalSkills.length} parsed resume skills!</span>
            </div>
          ) : (
            <GlassCard className="p-5 border-amber-300 dark:border-amber-500/30 flex items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-amber-500 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">📄 Using Standard Tech Assessments</h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    Upload your resume or add custom technical skills in Profile to unlock personalized skill gap tests.
                  </p>
                </div>
              </div>
            </GlassCard>
          )}

          {/* Test Catalog List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {generatedCatalog.map(test => {
              const bestScore = savedScores[test.id];
              const sKey = test.company.toLowerCase().trim();
              
              let isLocked = false;
              let lockMessage = "";

              if (test.category === 'Intermediate') {
                const prevCompleted = savedScores[`sgt-${sKey}-basic`] !== undefined;
                if (!prevCompleted) {
                  isLocked = true;
                  lockMessage = "🔒 Complete Basic level test first";
                }
              } else if (test.category === 'Advanced') {
                const prevCompleted = savedScores[`sgt-${sKey}-intermediate`] !== undefined;
                if (!prevCompleted) {
                  isLocked = true;
                  lockMessage = "🔒 Complete Intermediate level test first";
                }
              }

              return (
                <GlassCard 
                  key={test.id} 
                  className={`p-5 flex flex-col justify-between transition-all border border-slate-200 dark:border-slate-800 ${
                    isLocked 
                      ? 'opacity-60 bg-slate-100/50 dark:bg-slate-900/50' 
                      : 'hover:border-indigo-400 dark:hover:border-indigo-500/50'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-300 font-extrabold uppercase">
                        {test.company}
                      </span>
                      <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {test.durationMinutes} Mins
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{test.title}</h3>
                    <p className="text-[11px] text-slate-500">
                      Evaluates core concepts, debugging, and intermediate structures. ({test.totalQuestions} Questions)
                    </p>

                    {isLocked ? (
                      <div className="pt-1 text-[10px] font-bold text-rose-500 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded w-fit border border-rose-500/20">
                        {lockMessage}
                      </div>
                    ) : bestScore !== undefined ? (
                      <div className="pt-1.5 flex items-center gap-2">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300 font-bold flex items-center gap-1 border border-emerald-200 dark:border-emerald-500/20">
                          Best Score: {bestScore}%
                        </span>
                        {bestScore >= 70 ? (
                          <span className="text-[9px] text-emerald-600 font-extrabold uppercase">Ready for Job ⚡</span>
                        ) : (
                          <span className="text-[9px] text-indigo-500 font-extrabold uppercase">Retry to improve</span>
                        )}
                      </div>
                    ) : (
                      <div className="pt-1 text-[10px] font-bold text-indigo-600 dark:text-cyan-400">
                        ⚡ Unlocked • Ready to take
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => !isLocked && handleStartTest(test)}
                    disabled={isLocked}
                    className={`mt-4 w-full py-2 px-4 rounded-xl font-bold text-[11px] flex items-center justify-center gap-2 transition-all border ${
                      isLocked
                        ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 border-slate-300 dark:border-slate-800 cursor-not-allowed'
                        : 'bg-slate-900 dark:bg-indigo-600/30 hover:bg-slate-800 dark:hover:bg-indigo-600/50 text-white dark:text-indigo-200 border-slate-800 dark:border-indigo-500/30 cursor-pointer'
                    }`}
                  >
                    {isLocked ? (
                      <span>Locked 🔒</span>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-white dark:fill-indigo-300" />
                        <span>Start Gap Assessment</span>
                      </>
                    )}
                  </button>
                </GlassCard>
              );
            })}
          </div>
        </>
      )}

      {/* Active Test Session */}
      {activeTest && !testResult && (
        <GlassCard className="p-6 space-y-6 max-w-2xl mx-auto border border-indigo-500/20 shadow-2xl">
          {/* Test Top Bar */}
          <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">{activeTest.company} ({activeTest.category} Assessment)</span>
              <h3 className="text-base font-black text-slate-900 dark:text-white mt-0.5">
                Question {currentQIndex + 1} of {activeTest.questions.length}
              </h3>
            </div>
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-slate-950 border border-amber-200 dark:border-slate-800 text-amber-700 dark:text-amber-400 font-mono font-bold text-xs shadow-sm">
              <Clock className="w-3.5 h-3.5 animate-pulse" />
              <span>{formatTime(timeLeft)}</span>
            </div>
          </div>

          {/* Current Question */}
          {(() => {
            const q = activeTest.questions[currentQIndex];
            return (
              <div className="space-y-4">
                <p className="text-sm font-extrabold text-slate-800 dark:text-slate-100 leading-relaxed">{q.question}</p>

                {/* MCQ Options */}
                {q.options && (
                  <div className="space-y-2">
                    {q.options.map((opt, oIdx) => (
                      <button
                        key={oIdx}
                        onClick={() => setSelectedAnswers({ ...selectedAnswers, [q.id]: opt })}
                        className={`w-full p-3.5 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                          selectedAnswers[q.id] === opt
                            ? 'bg-indigo-600 border-indigo-500 text-white'
                            : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}

                {/* Coding Template */}
                {q.type === 'coding' && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Write code:</span>
                    <textarea
                      value={selectedAnswers[q.id] || q.codeTemplate || ''}
                      onChange={e => setSelectedAnswers({ ...selectedAnswers, [q.id]: e.target.value })}
                      rows={10}
                      className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-400 focus:border-indigo-500 focus:ring-0 outline-none"
                      placeholder="// Write code here..."
                    />
                  </div>
                )}
              </div>
            );
          })()}

          {/* Navigation & Submit Buttons */}
          <div className="flex justify-between items-center border-t border-slate-200 dark:border-slate-800 pt-4">
            <button
              onClick={() => setCurrentQIndex(i => Math.max(0, i - 1))}
              disabled={currentQIndex === 0}
              className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300 disabled:opacity-40"
            >
              Previous
            </button>

            {currentQIndex < activeTest.questions.length - 1 ? (
              <button
                onClick={() => setCurrentQIndex(i => i + 1)}
                className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white text-[11px] font-bold shadow-md cursor-pointer"
              >
                Next Question
              </button>
            ) : (
              <button
                onClick={handleSubmitTest}
                className="px-5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold shadow-md cursor-pointer"
              >
                Submit Gap Assessment
              </button>
            )}
          </div>
        </GlassCard>
      )}

      {/* Test Result View */}
      {testResult && (
        <GlassCard glow className="p-6 space-y-6 max-w-2xl mx-auto border border-indigo-500/20 shadow-2xl">
          <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Test Report</span>
              <h3 className="text-base font-black text-slate-900 dark:text-white">{testResult.company} Gap Test Completed</h3>
            </div>
            <button
              onClick={() => {
                setActiveTest(null);
                setTestResult(null);
              }}
              className="px-3.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Back to Assessments
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <div className="text-xl font-extrabold text-indigo-600 dark:text-cyan-400">{testResult.percentage}%</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Assessment Score</div>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {testResult.percentage >= 70 ? 'Competent ✅' : 'Gap Found ⚠️'}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Recruiting Status</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
            <h4 className="text-[11px] font-black text-slate-900 dark:text-white flex items-center gap-1.5 uppercase">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> AI Feedback & Placement Suggestion
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {testResult.percentage >= 70
                ? `Excellent! Your ${testResult.company} competency score of ${testResult.percentage}% meets standard recruiter requirements. You are fully recommended to apply for ${testResult.company}-based roles now.`
                : `A gap was detected in your ${testResult.company} fundamentals (${testResult.percentage}% achieved). Review the structured Career Roadmap to address Gaps before applying for top-tier roles.`}
            </p>
          </div>
        </GlassCard>
      )}
    </div>
  );
};
