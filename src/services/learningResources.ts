export interface StudyResourceItem {
  title: string;
  url: string;
  type: 'Documentation' | 'Course' | 'Tutorial' | 'Practice' | 'Video' | 'CheatSheet';
  provider: string;
  description: string;
  isFree: boolean;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface SkillResourcePack {
  skillName: string;
  category: 'Missing Skill (Gap Bridge)' | 'Provided Skill (Mastery Booster)';
  overview: string;
  primaryWebsite: string;
  resources: StudyResourceItem[];
  practicePlatforms: { name: string; url: string; badge: string }[];
}

// Database of curated top resources for tech, AI/ML, data, web, mobile, core engineering
const CURATED_RESOURCES: Record<string, StudyResourceItem[]> = {
  tensorflow: [
    {
      title: 'TensorFlow Official Documentation & Tutorials',
      url: 'https://www.tensorflow.org/tutorials',
      type: 'Documentation',
      provider: 'TensorFlow.org',
      description: 'Official guides from beginner neural networks to advanced computer vision and NLP models.',
      isFree: true,
      difficulty: 'Beginner'
    },
    {
      title: 'DeepLearning.AI TensorFlow Developer Professional Certificate',
      url: 'https://www.coursera.org/professional-certificates/tensorflow-in-practice',
      type: 'Course',
      provider: 'Coursera / DeepLearning.AI',
      description: 'Comprehensive industry standard certification curriculum by Andrew Ng and Laurence Moroney.',
      isFree: false,
      difficulty: 'Intermediate'
    },
    {
      title: 'TensorFlow 2.0 Complete FreeCodeCamp Course',
      url: 'https://www.youtube.com/watch?v=tPYj3fFJGjk',
      type: 'Video',
      provider: 'freeCodeCamp (YouTube)',
      description: '7-hour in-depth masterclass on building CNNs, RNNs, and deployment.',
      isFree: true,
      difficulty: 'Beginner'
    },
    {
      title: 'Kaggle Intro to Deep Learning (TensorFlow/Keras)',
      url: 'https://www.kaggle.com/learn/intro-to-deep-learning',
      type: 'Practice',
      provider: 'Kaggle Learn',
      description: 'Hands-on interactive GPU notebooks with real datasets and immediate feedback.',
      isFree: true,
      difficulty: 'Beginner'
    },
    {
      title: 'TensorFlow Cheat Sheet & Quick Reference',
      url: 'https://quickref.me/tensorflow',
      type: 'CheatSheet',
      provider: 'QuickRef',
      description: 'Fast lookup for Layers, Optimizers, Loss functions, and Tensor operations.',
      isFree: true,
      difficulty: 'Intermediate'
    }
  ],
  pytorch: [
    {
      title: 'PyTorch Official Tutorials & Deep Learning with PyTorch',
      url: 'https://pytorch.org/tutorials/',
      type: 'Documentation',
      provider: 'PyTorch.org',
      description: 'Comprehensive 60-minute blitz, autograd tutorials, and production deployment guides.',
      isFree: true,
      difficulty: 'Beginner'
    },
    {
      title: 'PyTorch for Deep Learning Bootcamp (Zero to Mastery)',
      url: 'https://www.youtube.com/watch?v=V_xro1bcAuA',
      type: 'Video',
      provider: 'freeCodeCamp (YouTube)',
      description: '26-hour complete PyTorch course by Daniel Bourke covering neural nets and computer vision.',
      isFree: true,
      difficulty: 'Beginner'
    },
    {
      title: 'Deep Learning with PyTorch on Udacity',
      url: 'https://www.udacity.com/course/deep-learning-pytorch--ud188',
      type: 'Course',
      provider: 'Udacity / Meta AI',
      description: 'Co-created by Meta AI engineering team covering PyTorch fundamentals and torch vision.',
      isFree: true,
      difficulty: 'Intermediate'
    },
    {
      title: 'PyTorch Cheat Sheet',
      url: 'https://pytorch.org/tutorials/beginner/ptcheat.html',
      type: 'CheatSheet',
      provider: 'PyTorch Docs',
      description: 'Summary of Tensor creation, slicing, mathematical operations, and neural net modules.',
      isFree: true,
      difficulty: 'Intermediate'
    }
  ],
  html: [
    {
      title: 'MDN Web Docs — HTML: Structuring the Web',
      url: 'https://developer.mozilla.org/en-US/docs/Learn/HTML',
      type: 'Documentation',
      provider: 'MDN Web Docs',
      description: 'The gold standard reference for modern semantic HTML5 tags, accessibility, and forms.',
      isFree: true,
      difficulty: 'Beginner'
    },
    {
      title: 'freeCodeCamp Responsive Web Design (HTML5)',
      url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/',
      type: 'Course',
      provider: 'freeCodeCamp',
      description: 'Interactive interactive coding curriculum with hands-on projects and certificate.',
      isFree: true,
      difficulty: 'Beginner'
    },
    {
      title: 'W3Schools HTML5 Comprehensive Tutorial',
      url: 'https://www.w3schools.com/html/',
      type: 'Tutorial',
      provider: 'W3Schools',
      description: 'Quick-reference interactive playground with "Try It Yourself" live editor.',
      isFree: true,
      difficulty: 'Beginner'
    },
    {
      title: 'HTML5 Cheat Sheet & Semantic Tags Guide',
      url: 'https://htmlcheatsheet.com/',
      type: 'CheatSheet',
      provider: 'HTML CheatSheet',
      description: 'Interactive grid of HTML tags, attributes, character entities, and SEO meta tags.',
      isFree: true,
      difficulty: 'Beginner'
    }
  ],
  css: [
    {
      title: 'MDN Web Docs — CSS: Styling the Web',
      url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS',
      type: 'Documentation',
      provider: 'MDN Web Docs',
      description: 'Learn Flexbox, CSS Grid, Responsive Design, Animations, and modern CSS properties.',
      isFree: true,
      difficulty: 'Beginner'
    },
    {
      title: 'CSS Tricks — Complete Guide to Flexbox & Grid',
      url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/',
      type: 'Tutorial',
      provider: 'CSS-Tricks',
      description: 'Visual reference guide for container and item properties with graphical examples.',
      isFree: true,
      difficulty: 'Intermediate'
    },
    {
      title: 'Flexbox Froggy & Grid Garden (Gamified Practice)',
      url: 'https://flexboxfroggy.com/',
      type: 'Practice',
      provider: 'Codepip',
      description: 'Interactive coding game to master CSS Flexbox and CSS Grid layout algorithms.',
      isFree: true,
      difficulty: 'Beginner'
    },
    {
      title: 'Kevin Powell CSS Mastery Channel',
      url: 'https://www.youtube.com/@KevinPowell',
      type: 'Video',
      provider: 'YouTube (Kevin Powell)',
      description: 'Deep dives into modern CSS layouts, responsive architecture, and styling tricks.',
      isFree: true,
      difficulty: 'Intermediate'
    }
  ],
  react: [
    {
      title: 'React Official Documentation (React.dev)',
      url: 'https://react.dev/learn',
      type: 'Documentation',
      provider: 'React.dev / Meta',
      description: 'The official interactive tutorial covering Hooks, State Management, and Server Components.',
      isFree: true,
      difficulty: 'Beginner'
    },
    {
      title: 'Scrimba — Learn React for Free',
      url: 'https://scrimba.com/learn/learnreact',
      type: 'Course',
      provider: 'Scrimba',
      description: 'Interactive video player where you can pause and edit code directly inside the video.',
      isFree: true,
      difficulty: 'Beginner'
    },
    {
      title: 'GreatFrontEnd & LeetCode Front-End Practice',
      url: 'https://www.greatfrontend.com/',
      type: 'Practice',
      provider: 'GreatFrontEnd',
      description: 'Top front-end interview coding challenges and UI component design patterns.',
      isFree: true,
      difficulty: 'Intermediate'
    },
    {
      title: 'React Hooks & Patterns Cheat Sheet',
      url: 'https://reactpatterns.js.org/',
      type: 'CheatSheet',
      provider: 'React Patterns',
      description: 'Quick reference for useEffect, useMemo, useCallback, and Custom Hooks.',
      isFree: true,
      difficulty: 'Intermediate'
    }
  ],
  python: [
    {
      title: 'Python Official Documentation & Tutorial',
      url: 'https://docs.python.org/3/tutorial/',
      type: 'Documentation',
      provider: 'Python Software Foundation',
      description: 'Official comprehensive Python 3 guide covering syntax, data types, modules, and OOP.',
      isFree: true,
      difficulty: 'Beginner'
    },
    {
      title: 'GeeksforGeeks Python Programming Language Tutorial',
      url: 'https://www.geeksforgeeks.org/python-programming-language-tutorial/',
      type: 'Tutorial',
      provider: 'GeeksforGeeks',
      description: 'Curated university syllabus covering syntax, algorithms, data structures, and interview questions.',
      isFree: true,
      difficulty: 'Beginner'
    },
    {
      title: 'LeetCode Python 50 Study Plan',
      url: 'https://leetcode.com/studyplan/top-interview-150/',
      type: 'Practice',
      provider: 'LeetCode',
      description: 'Solve curated algorithmic challenges in Python with time & space complexity analysis.',
      isFree: true,
      difficulty: 'Intermediate'
    },
    {
      title: 'Corey Schafer Python Masterclass Tutorials',
      url: 'https://www.youtube.com/user/schafer5/playlists',
      type: 'Video',
      provider: 'YouTube (Corey Schafer)',
      description: 'Best-in-class deep dives on OOP, Generators, Decorators, Context Managers, and Django/Flask.',
      isFree: true,
      difficulty: 'Intermediate'
    }
  ],
  java: [
    {
      title: 'Oracle Java Documentation & Trails',
      url: 'https://docs.oracle.com/javase/tutorial/',
      type: 'Documentation',
      provider: 'Oracle',
      description: 'Official Java Language and Platform guides covering OOP, Generics, and Collections.',
      isFree: true,
      difficulty: 'Beginner'
    },
    {
      title: 'Java Brains (Spring Boot & Microservices)',
      url: 'https://www.youtube.com/@Java.Brains',
      type: 'Video',
      provider: 'YouTube (Java Brains)',
      description: 'Industry-standard tutorials on Spring Boot, REST APIs, Hibernate, and Design Patterns.',
      isFree: true,
      difficulty: 'Intermediate'
    },
    {
      title: 'GeeksforGeeks Java Programming Language',
      url: 'https://www.geeksforgeeks.org/java/',
      type: 'Tutorial',
      provider: 'GeeksforGeeks',
      description: 'Core Java, Multithreading, JVM Architecture, and Top Placement Interview Questions.',
      isFree: true,
      difficulty: 'Beginner'
    },
    {
      title: 'HackerRank Java Practice Track',
      url: 'https://www.hackerrank.com/domains/java',
      type: 'Practice',
      provider: 'HackerRank',
      description: 'Earn 5 stars solving Java OOP, Strings, BigInteger, and Data Structure problems.',
      isFree: true,
      difficulty: 'Beginner'
    }
  ],
  sql: [
    {
      title: 'SQLZoo Interactive SQL Tutorial & Exercises',
      url: 'https://sqlzoo.net/wiki/SQL_Tutorial',
      type: 'Practice',
      provider: 'SQLZoo',
      description: 'Interactive browser-based live SQL query tester with real database schemas.',
      isFree: true,
      difficulty: 'Beginner'
    },
    {
      title: 'LeetCode SQL 50 Study Plan',
      url: 'https://leetcode.com/studyplan/top-sql-50/',
      type: 'Practice',
      provider: 'LeetCode',
      description: '50 most frequently asked SQL interview questions (Joins, Windows Functions, Aggregations).',
      isFree: true,
      difficulty: 'Intermediate'
    },
    {
      title: 'PostgreSQL & MySQL Official Documentation',
      url: 'https://www.postgresql.org/docs/',
      type: 'Documentation',
      provider: 'PostgreSQL',
      description: 'In-depth reference on Indexing (B-Tree, Hash), Transactions (ACID), and Query Execution Plans.',
      isFree: true,
      difficulty: 'Intermediate'
    },
    {
      title: 'W3Schools SQL Tutorial',
      url: 'https://www.w3schools.com/sql/',
      type: 'Tutorial',
      provider: 'W3Schools',
      description: 'Simple and fast overview of SELECT, INSERT, UPDATE, DELETE, GROUP BY, and HAVING.',
      isFree: true,
      difficulty: 'Beginner'
    }
  ],
  javascript: [
    {
      title: 'The Modern JavaScript Tutorial (javascript.info)',
      url: 'https://javascript.info/',
      type: 'Tutorial',
      provider: 'javascript.info',
      description: 'Comprehensive guide from basic syntax to advanced closures, prototypes, event loops, and async.',
      isFree: true,
      difficulty: 'Beginner'
    },
    {
      title: 'MDN Web Docs — JavaScript Reference',
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
      type: 'Documentation',
      provider: 'MDN Web Docs',
      description: 'The definitive JavaScript specification and API reference.',
      isFree: true,
      difficulty: 'Beginner'
    },
    {
      title: 'Namaste JavaScript by Akshay Saini',
      url: 'https://www.youtube.com/playlist?list=PLlasXeu85E9cQ32gLCvAvPE9rvCbfWDG8',
      type: 'Video',
      provider: 'YouTube (Akshay Saini)',
      description: 'Legendary playlist explaining JavaScript Execution Context, Call Stack, Hoisting, and Promises.',
      isFree: true,
      difficulty: 'Intermediate'
    },
    {
      title: 'JS30 — 30 Day Vanilla JS Challenge by Wes Bos',
      url: 'https://javascript30.com/',
      type: 'Practice',
      provider: 'Wes Bos',
      description: 'Build 30 projects in 30 days with pure JS without frameworks.',
      isFree: true,
      difficulty: 'Beginner'
    }
  ],
  cpp: [
    {
      title: 'LearnCpp.com — Comprehensive C++ Tutorial',
      url: 'https://www.learncpp.com/',
      type: 'Tutorial',
      provider: 'LearnCpp',
      description: 'The best free structured course on modern C++ (C++11 through C++23), memory management, and pointers.',
      isFree: true,
      difficulty: 'Beginner'
    },
    {
      title: 'cppreference.com — C++ Reference Manual',
      url: 'https://en.cppreference.com/w/',
      type: 'Documentation',
      provider: 'cppreference',
      description: 'Complete STL documentation: vector, map, unordered_map, priority_queue, algorithms.',
      isFree: true,
      difficulty: 'Intermediate'
    },
    {
      title: 'The Cherno C++ Series (YouTube)',
      url: 'https://www.youtube.com/playlist?list=PLlrATfBNZ98dudnM48yfGUldqGD0S4G6b',
      type: 'Video',
      provider: 'YouTube (The Cherno)',
      description: 'Master low-level C++, assembly insight, memory alignment, templates, and game engine architecture.',
      isFree: true,
      difficulty: 'Intermediate'
    },
    {
      title: 'LeetCode C++ Practice & STL Problem Solving',
      url: 'https://leetcode.com/problemset/all/',
      type: 'Practice',
      provider: 'LeetCode',
      description: 'Practice high-performance algorithmic implementations in C++.',
      isFree: true,
      difficulty: 'Intermediate'
    }
  ],
  'c++': [
    {
      title: 'LearnCpp.com — Comprehensive C++ Tutorial',
      url: 'https://www.learncpp.com/',
      type: 'Tutorial',
      provider: 'LearnCpp',
      description: 'The best free structured course on modern C++ (C++11 through C++23), memory management, and pointers.',
      isFree: true,
      difficulty: 'Beginner'
    },
    {
      title: 'cppreference.com — C++ Reference Manual',
      url: 'https://en.cppreference.com/w/',
      type: 'Documentation',
      provider: 'cppreference',
      description: 'Complete STL documentation: vector, map, unordered_map, priority_queue, algorithms.',
      isFree: true,
      difficulty: 'Intermediate'
    },
    {
      title: 'The Cherno C++ Series',
      url: 'https://www.youtube.com/playlist?list=PLlrATfBNZ98dudnM48yfGUldqGD0S4G6b',
      type: 'Video',
      provider: 'YouTube (The Cherno)',
      description: 'Master low-level C++, assembly insight, memory alignment, and templates.',
      isFree: true,
      difficulty: 'Intermediate'
    }
  ],
  'data structures': [
    {
      title: 'NeetCode 150 — DSA Roadmap & Video Explanations',
      url: 'https://neetcode.io/roadmap',
      type: 'Practice',
      provider: 'NeetCode.io',
      description: 'Visual interactive roadmap of all 150 top coding interview patterns with video solutions.',
      isFree: true,
      difficulty: 'Beginner'
    },
    {
      title: 'Striver A2Z DSA Course & Sheet (Take U Forward)',
      url: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/',
      type: 'Course',
      provider: 'takeUforward',
      description: 'The most popular step-by-step DSA guide for college placement interviews.',
      isFree: true,
      difficulty: 'Intermediate'
    },
    {
      title: 'GeeksforGeeks Data Structures & Algorithms',
      url: 'https://www.geeksforgeeks.org/data-structures/',
      type: 'Tutorial',
      provider: 'GeeksforGeeks',
      description: 'Detailed code implementations with time and space complexity proofs in C++, Java, and Python.',
      isFree: true,
      difficulty: 'Beginner'
    },
    {
      title: 'Visualgo — Visualising Data Structures and Algorithms',
      url: 'https://visualgo.net/en',
      type: 'Practice',
      provider: 'VisuAlgo',
      description: 'Interactive animated visualizations of Trees, Graphs, Sorting, and Dynamic Programming.',
      isFree: true,
      difficulty: 'Beginner'
    }
  ],
  algorithms: [
    {
      title: 'NeetCode 150 — Algorithms Roadmap',
      url: 'https://neetcode.io/roadmap',
      type: 'Practice',
      provider: 'NeetCode',
      description: 'Curated algorithm tracks: Binary Search, Two Pointers, Graphs, Dynamic Programming, and Backtracking.',
      isFree: true,
      difficulty: 'Intermediate'
    },
    {
      title: 'MIT 6.006 Introduction to Algorithms (OpenCourseWare)',
      url: 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/',
      type: 'Course',
      provider: 'MIT OCW',
      description: 'World-renowned lecture videos, problem sets, and recitations by MIT faculty.',
      isFree: true,
      difficulty: 'Advanced'
    },
    {
      title: 'LeetCode Algorithmic Problem Solving',
      url: 'https://leetcode.com/problemset/algorithms/',
      type: 'Practice',
      provider: 'LeetCode',
      description: 'Practice Top 100 Liked algorithmic interview questions with instant judge feedback.',
      isFree: true,
      difficulty: 'Intermediate'
    }
  ],
  'machine learning': [
    {
      title: 'Coursera Machine Learning Specialization by Andrew Ng',
      url: 'https://www.coursera.org/specializations/machine-learning-introduction',
      type: 'Course',
      provider: 'Coursera / Stanford Online',
      description: 'The definitive foundation course covering Linear/Logistic Regression, Neural Networks, Trees, and PCA.',
      isFree: false,
      difficulty: 'Beginner'
    },
    {
      title: 'StatQuest with Josh Starmer (Machine Learning)',
      url: 'https://www.youtube.com/@statquest',
      type: 'Video',
      provider: 'YouTube (StatQuest)',
      description: 'Crystal-clear visual explanations of ML mathematics, Random Forests, Gradient Boost, and SVMs.',
      isFree: true,
      difficulty: 'Beginner'
    },
    {
      title: 'Kaggle Learn: Intro to Machine Learning & Pandas',
      url: 'https://www.kaggle.com/learn',
      type: 'Practice',
      provider: 'Kaggle',
      description: 'Hands-on bite-sized interactive micro-courses with Scikit-learn and real-world competitions.',
      isFree: true,
      difficulty: 'Beginner'
    },
    {
      title: 'Scikit-learn Official Documentation & User Guide',
      url: 'https://scikit-learn.org/stable/user_guide.html',
      type: 'Documentation',
      provider: 'Scikit-learn',
      description: 'Official API reference with code examples for clustering, dimensionality reduction, and evaluation.',
      isFree: true,
      difficulty: 'Intermediate'
    }
  ],
  embedded: [
    {
      title: 'Embedded Systems Programming on ARM Cortex-M (FastBit)',
      url: 'https://www.udemy.com/course/microcontroller-embedded-c-programming/',
      type: 'Course',
      provider: 'Udemy / FastBit',
      description: 'Master Microcontroller Embedded C programming, memory-mapped registers, and GPIO/UART peripheral drivers.',
      isFree: false,
      difficulty: 'Beginner'
    },
    {
      title: 'FreeRTOS Official Kernel Documentation & Guides',
      url: 'https://www.freertos.org/Documentation/RTOS_book.html',
      type: 'Documentation',
      provider: 'FreeRTOS.org',
      description: 'Master Task Scheduling, Semaphores, Mutexes, Queues, and Real-Time constraints.',
      isFree: true,
      difficulty: 'Intermediate'
    },
    {
      title: 'Quantum Leaps Modern Embedded Systems Programming (YouTube)',
      url: 'https://www.youtube.com/playlist?list=PLPW8O6W-1chwyTzI3BHwBLbGQoPFxPAPM',
      type: 'Video',
      provider: 'YouTube (Miro Samek)',
      description: 'In-depth engineering video series on Cortex-M processor architecture, assembly, and RTOS.',
      isFree: true,
      difficulty: 'Intermediate'
    }
  ],
  solidworks: [
    {
      title: 'SolidWorks Official Tutorials & CAD Certification Prep',
      url: 'https://my.solidworks.com/training',
      type: 'Course',
      provider: 'Dassault Systèmes',
      description: 'Official self-paced lessons for CSWA and CSWP Mechanical Design certifications.',
      isFree: true,
      difficulty: 'Beginner'
    },
    {
      title: 'CAD CAM Tutorial (YouTube)',
      url: 'https://www.youtube.com/@CADCAMTUTORIAL',
      type: 'Video',
      provider: 'YouTube',
      description: 'Over 1000 step-by-step practical 3D part modeling, assembly, and sheet metal tutorials.',
      isFree: true,
      difficulty: 'Beginner'
    },
    {
      title: 'GrabCAD Community & 3D Engineering Library',
      url: 'https://grabcad.com/library',
      type: 'Practice',
      provider: 'GrabCAD',
      description: 'Over 5 million free CAD models, drawings, and peer feedback for mechanical engineers.',
      isFree: true,
      difficulty: 'Intermediate'
    }
  ],
  autocad: [
    {
      title: 'Autodesk AutoCAD Official Learning Hub',
      url: 'https://www.autodesk.com/support/technical/article/caas/tsarticles/ts/3223G7gQx6U3zR5gR1cK0o.html',
      type: 'Documentation',
      provider: 'Autodesk',
      description: 'Official beginner to advanced drafting, layer management, and 2D/3D documentation.',
      isFree: true,
      difficulty: 'Beginner'
    },
    {
      title: 'SourceCAD AutoCAD Tutorials & Video Guides',
      url: 'https://sourcecad.com/autocad-tutorials/',
      type: 'Tutorial',
      provider: 'SourceCAD',
      description: 'Detailed drawings, dimensioning rules, and architectural drafting exercises.',
      isFree: true,
      difficulty: 'Beginner'
    }
  ],
  git: [
    {
      title: 'Pro Git Book (Official Free Book)',
      url: 'https://git-scm.com/book/en/v2',
      type: 'Documentation',
      provider: 'Git-SCM',
      description: 'The complete official guide by Scott Chacon covering branching, rebase, submodules, and internals.',
      isFree: true,
      difficulty: 'Beginner'
    },
    {
      title: 'Learn Git Branching (Interactive Visual Game)',
      url: 'https://learngitbranching.js.org/',
      type: 'Practice',
      provider: 'LearnGitBranching',
      description: 'The most visual and interactive way to master Git branches, cherry-pick, and rebase in your browser.',
      isFree: true,
      difficulty: 'Beginner'
    }
  ],
  docker: [
    {
      title: 'Docker Official Documentation & Getting Started',
      url: 'https://docs.docker.com/get-started/',
      type: 'Documentation',
      provider: 'Docker.com',
      description: 'Hands-on guide to containerization, Dockerfiles, multi-stage builds, and Docker Compose.',
      isFree: true,
      difficulty: 'Beginner'
    },
    {
      title: 'Docker Mastery (freeCodeCamp YouTube)',
      url: 'https://www.youtube.com/watch?v=fqMOX6JJhGo',
      type: 'Video',
      provider: 'freeCodeCamp (YouTube)',
      description: 'Full course covering image optimization, container networking, and volumes.',
      isFree: true,
      difficulty: 'Intermediate'
    }
  ]
};

/**
 * Get curated or dynamically constructed study websites & materials for ANY skill
 */
export function getStudyResourcesForSkill(
  skillName: string, 
  category: 'Missing Skill (Gap Bridge)' | 'Provided Skill (Mastery Booster)' = 'Missing Skill (Gap Bridge)'
): SkillResourcePack {
  const clean = skillName.trim();
  const lower = clean.toLowerCase();

  // Find exact or partial key match in curated database
  let matchedKey = Object.keys(CURATED_RESOURCES).find(k => {
    return lower === k || lower.includes(k) || k.includes(lower);
  });

  // Additional alias mapping
  if (!matchedKey) {
    if (lower.includes('js') || lower.includes('node') || lower.includes('express')) matchedKey = 'javascript';
    else if (lower.includes('c#') || lower.includes('c-sharp')) matchedKey = 'cpp';
    else if (lower.includes('dsa') || lower.includes('algo') || lower.includes('leetcode')) matchedKey = 'data structures';
    else if (lower.includes('ai') || lower.includes('deep learning') || lower.includes('neural')) matchedKey = 'machine learning';
    else if (lower.includes('cad') || lower.includes('drawing') || lower.includes('drafting')) matchedKey = 'autocad';
    else if (lower.includes('iot') || lower.includes('arduino') || lower.includes('microcontroller')) matchedKey = 'embedded';
    else if (lower.includes('db') || lower.includes('mysql') || lower.includes('postgres') || lower.includes('oracle')) matchedKey = 'sql';
  }

  let resources: StudyResourceItem[] = [];

  if (matchedKey && CURATED_RESOURCES[matchedKey]) {
    resources = [...CURATED_RESOURCES[matchedKey]];
  } else {
    // Dynamic universal fallback with verified search portals
    const encoded = encodeURIComponent(clean);
    resources = [
      {
        title: `${clean} Official Documentation & Reference Guides`,
        url: `https://devdocs.io/#q=${encoded}`,
        type: 'Documentation',
        provider: 'DevDocs / Official Portal',
        description: `Explore API references, best practices, and official guides for ${clean}.`,
        isFree: true,
        difficulty: 'Beginner'
      },
      {
        title: `GeeksforGeeks — ${clean} Complete Placement Syllabus & Notes`,
        url: `https://www.geeksforgeeks.org/search?q=${encoded}`,
        type: 'Tutorial',
        provider: 'GeeksforGeeks',
        description: `Step-by-step topic breakdown, code examples, and frequently asked technical interview questions for ${clean}.`,
        isFree: true,
        difficulty: 'Beginner'
      },
      {
        title: `YouTube — ${clean} Full Crash Course & Project Walkthroughs`,
        url: `https://www.youtube.com/results?search_query=${encoded}+full+course+tutorial`,
        type: 'Video',
        provider: 'YouTube Education',
        description: `Top-rated video crash courses, code walkthroughs, and practical projects on ${clean}.`,
        isFree: true,
        difficulty: 'Intermediate'
      },
      {
        title: `Coursera & edX Free Courses for ${clean}`,
        url: `https://www.coursera.org/search?query=${encoded}`,
        type: 'Course',
        provider: 'Coursera / Top Universities',
        description: `University-level accredited specialization courses and hands-on guided projects for ${clean}.`,
        isFree: false,
        difficulty: 'Intermediate'
      },
      {
        title: `${clean} Cheat Sheet & Fast Revision Guide`,
        url: `https://quickref.me/${encoded}`,
        type: 'CheatSheet',
        provider: 'QuickRef',
        description: `Instant syntax lookup, essential commands, and design patterns for ${clean}.`,
        isFree: true,
        difficulty: 'Intermediate'
      }
    ];
  }

  const encoded = encodeURIComponent(clean);
  const practicePlatforms = [
    { name: 'GeeksforGeeks', url: `https://www.geeksforgeeks.org/search?q=${encoded}`, badge: 'Articles & Quizzes' },
    { name: 'LeetCode / Practice', url: `https://leetcode.com/problemset/all/?search=${encoded}`, badge: 'Coding Tests' },
    { name: 'freeCodeCamp', url: `https://www.freecodecamp.org/news/search/?query=${encoded}`, badge: 'Free Courses' },
    { name: 'Roadmap.sh', url: `https://roadmap.sh/search?q=${encoded}`, badge: 'Visual Roadmaps' },
    { name: 'W3Schools', url: `https://www.w3schools.com/tags/ref_byfunc.asp`, badge: 'Interactive Play' }
  ];

  const primaryWebsite = resources[0]?.url || `https://www.google.com/search?q=${encoded}+official+documentation`;

  return {
    skillName: clean,
    category,
    overview: category === 'Missing Skill (Gap Bridge)'
      ? `Bridge your technical gap in "${clean}" by studying official docs, watching video crash courses, and attempting practice quizzes.`
      : `Deepen your mastery of "${clean}" for technical interviews, system design rounds, and recruitment screening tests.`,
    primaryWebsite,
    resources,
    practicePlatforms
  };
}

/**
 * Get structured learning resources for both missing skills (gap) and provided resume skills
 */
export function getComprehensiveStudyPlan(missingSkills: string[], providedSkills: string[]) {
  const missingPacks = (missingSkills || []).map(sk => getStudyResourcesForSkill(sk, 'Missing Skill (Gap Bridge)'));
  const providedPacks = (providedSkills || []).map(sk => getStudyResourcesForSkill(sk, 'Provided Skill (Mastery Booster)'));

  return {
    missingPacks,
    providedPacks,
    totalSkillsCount: missingPacks.length + providedPacks.length
  };
}
