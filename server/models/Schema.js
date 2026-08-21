import mongoose from 'mongoose';

// 1. User Schema (6 Roles)
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: {
    type: String,
    enum: ['student', 'placement_officer', 'hod', 'faculty', 'recruiter', 'super_admin'],
    default: 'student'
  },
  department: { type: String, default: 'Computer Science & Engineering' },
  collegeId: { type: mongoose.Schema.Types.ObjectId, ref: 'College' },
  createdAt: { type: Date, default: Date.now }
});

// 2. Student Profile Schema
const ProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  phone: String,
  department: String,
  graduationYear: Number,
  cgpa: Number,
  backlogs: { type: Number, default: 0 },
  codingLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'], default: 'Intermediate' },
  communicationScore: { type: Number, default: 85 },
  preferredCompanies: [String],
  preferredRoles: [String],
  preferredCities: [String],
  technicalSkills: [String],
  softSkills: [String],
  languages: [String],
  socialLinks: {
    github: String,
    linkedin: String,
    portfolio: String
  },
  certifications: [{ title: String, issuer: String, year: Number }],
  projects: [{ title: String, description: String, techStack: [String], githubUrl: String }],
  placementReadinessScore: { type: Number, default: 80 },
  employabilityScore: { type: Number, default: 85 },
  atsScore: { type: Number, default: 82 },
  dailyStreak: { type: Number, default: 1 },
  updatedAt: { type: Date, default: Date.now }
});

// 3. Resume & ATS Schema
const ResumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fileUrl: String,
  extractedText: String,
  atsScore: Number,
  scoreBreakdown: {
    keywords: Number,
    formatting: Number,
    impactMetrics: Number,
    skillsMatch: Number
  },
  detectedSkills: [String],
  detectedProjects: [String],
  detectedCertifications: [String],
  suggestedImprovements: [String],
  createdAt: { type: Date, default: Date.now }
});

// 4. Verified Job Opportunity Schema
const JobSchema = new mongoose.Schema({
  company: { type: String, required: true },
  role: { type: String, required: true },
  logoUrl: String,
  department: String,
  skillsRequired: [String],
  minCgpa: { type: Number, default: 6.0 },
  maxBacklogs: { type: Number, default: 0 },
  salary: String,
  location: String,
  experience: String,
  education: String,
  deadline: Date,
  applyLink: { type: String, required: true },
  source: {
    type: String,
    enum: ['Official Company Careers', 'Gov Employment Portal', 'Public RSS Feed', 'Authorized Job Feed'],
    default: 'Official Company Careers'
  },
  isInternship: { type: Boolean, default: false },
  status: { type: String, enum: ['Active', 'Expired', 'Verified'], default: 'Active' },
  postedDate: { type: Date, default: Date.now },
  verifiedDate: { type: Date, default: Date.now }
});

// 5. Leave Request Schema (HOD Approval)
const LeaveRequestSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentName: String,
  department: String,
  companyName: String,
  interviewRole: String,
  leaveDate: Date,
  reason: String,
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  comments: String,
  createdAt: { type: Date, default: Date.now }
});

// Exports
export const User = mongoose.model('User', UserSchema);
export const Profile = mongoose.model('Profile', ProfileSchema);
export const Resume = mongoose.model('Resume', ResumeSchema);
export const Job = mongoose.model('Job', JobSchema);
export const LeaveRequest = mongoose.model('LeaveRequest', LeaveRequestSchema);
