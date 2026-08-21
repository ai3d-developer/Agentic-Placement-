export type UserRole = 'student' | 'placement_officer' | 'hod' | 'faculty' | 'recruiter' | 'super_admin';

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  college: string;
  department: string;
  graduationYear: number;
  cgpa: number;
  backlogs: number;
  codingLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  communicationScore: number;
  preferredCompanies: string[];
  preferredRoles: string[];
  preferredCities: string[];
  technicalSkills: string[];
  softSkills: string[];
  languages: string[];
  certifications: Array<{ title: string; issuer: string; year: number }>;
  projects: Array<{ title: string; description: string; techStack: string[]; githubUrl?: string }>;
  github: string;
  linkedin: string;
  portfolio: string;
  placementReadinessScore: number;
  employabilityScore: number;
  atsScore: number;
  dailyStreak: number;
  isOnboarded?: boolean;
  resumeFileName?: string;
  resumeUploadedAt?: string;
}

export type JobSourceType = 'Official Company Careers' | 'LinkedIn Verified Jobs' | 'Naukri Verified Jobs' | 'Indeed Verified Jobs' | 'Twitter/X Verified Jobs' | 'Social Media Verified Jobs' | 'Gov Employment Portal' | 'Public RSS Feed' | 'Authorized Job Feed' | 'Official Careers' | 'LinkedIn' | 'Naukri' | 'Indeed' | 'Glassdoor' | 'Gov Portal' | 'Startup Portal';

export interface JobOpportunity {
  id: string;
  company: string;
  role: string;
  officialSiteRoleName?: string;
  linkedInRoleName?: string;
  naukriRoleName?: string;
  indeedRoleName?: string;
  socialMediaRoleName?: string;
  description?: string;
  logoUrl?: string;
  department?: string;
  skillsRequired: string[];
  salary: string;
  location: string;
  experience: string;
  education: string;
  minCgpa?: number;
  maxBacklogs?: number;
  postedDate: string;
  lastDate: string;
  openDate?: string;
  closeDate?: string;
  vacancies?: number | string;
  applyLink: string;
  source: JobSourceType;
  isInternship: boolean;
  verifiedDate: string;
  status: 'Active' | 'Expired' | 'Verified';
  matchPercentage: number;
  missingSkills: string[];
  eligible: boolean;
  estimatedInterviewProbability: number;
  appliedStatus?: 'Not Applied' | 'Applying' | 'Applied' | 'Confirmed';
  applicationRefNo?: string;
}

export interface SkillGapAnalysis {
  company: string;
  targetRole: string;
  overallMatch: number;
  strongSkills: string[];
  missingSkills: string[];
  learningPriority: 'High' | 'Medium' | 'Low';
  estimatedWeeks: number;
  roadmap: Array<{
    week: number;
    topic: string;
    description: string;
    skillsCovered: string[];
    resources: string[];
  }>;
}

export interface ResumeAnalysisResult {
  atsScore: number;
  breakdown: {
    keywords: number;
    formatting: number;
    impactMetrics: number;
    skillsMatch: number;
  };
  detectedSkills: string[];
  detectedProjects: string[];
  detectedCertifications: string[];
  suggestedImprovements: string[];
  optimizedResumeText: string;
  sampleCoverLetter: string;
}

export interface MockQuestion {
  id: string;
  type: 'mcq' | 'coding' | 'text';
  section: 'Coding' | 'Aptitude' | 'Technical' | 'HR' | 'English';
  question: string;
  options?: string[];
  correctAnswer?: string;
  codeTemplate?: string;
  explanation?: string;
}

export interface MockTest {
  id: string;
  company: string;
  title: string;
  durationMinutes: number;
  totalQuestions: number;
  category: string;
  questions: MockQuestion[];
}

export interface MockTestResult {
  testId: string;
  company: string;
  score: number;
  totalScore: number;
  percentage: number;
  percentile: number;
  sectionBreakdown: Record<string, number>;
  aiFeedback: string;
  completedAt: string;
}

export interface InterviewEvaluationReport {
  overallScore: number;
  communicationScore: number;
  technicalScore: number;
  problemSolvingScore: number;
  confidenceScore: number;
  grammarScore: number;
  feedbackSummary: string;
  strengths: string[];
  areasForImprovement: string[];
}

export interface DailyTask {
  id: string;
  category: 'Coding' | 'Aptitude' | 'Technical' | 'HR' | 'English';
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  xp: number;
  completed: boolean;
  question: string;
  options?: string[];
  answer?: string;
}

export interface LeaveRequest {
  id: string;
  studentId: string;
  studentName: string;
  department: string;
  companyName: string;
  interviewRole: string;
  leaveDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedDate: string;
  comments?: string;
}

export interface RecruiterCandidateSearch {
  skills: string[];
  minCgpa: number;
  department: string;
  location: string;
  programmingLanguages: string[];
}

export interface AIAgentStatus {
  agentName: string;
  status: 'Active Monitoring' | 'Scanning Jobs' | 'Idle';
  lastScanTime: string;
  todayMatchingJobsCount: number;
  todayInternshipsCount: number;
  todayMockTestsCount: number;
  todayInterviewsCount: number;
  monitoredCompanies: string[];
  monitoredCities: string[];
}
