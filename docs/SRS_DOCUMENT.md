# Enterprise Software Requirement Specification (SRS) - PlacementOS AI

## 1. Executive Summary & Vision
**PlacementOS AI** is an enterprise-grade AI-Powered Placement Operating System engineered for universities and higher education institutions. Unlike traditional static job portals, PlacementOS AI assigns every student a dedicated **Personal AI Placement Agent**. This agent continuously monitors student competencies, resumes, GitHub portfolios, academic standing, and career preferences, automatically guiding each student until successful campus placement.

---

## 2. User Roles & Access Matrix

PlacementOS AI supports six distinct enterprise actor roles with Role-Based Access Control (RBAC):

1. **Student**:
   - Manages personal profile, technical/soft skills, academic records, and target company preferences.
   - Interacts with dedicated Personal AI Placement Agent & daily morning voice call briefings.
   - Analyzes resume ATS scores, generates target job/company resumes and cover letters.
   - Completes daily streak challenges (Coding, Aptitude, Technical, English Communication).
   - Takes company-specific timed mock tests (Google, Microsoft, Amazon, Zoho, TCS, Infosys, Wipro).
   - Participates in AI Voice/Text Mock Interviews with automated multi-metric feedback reports.
   - Requests interview leaves from HOD and tracks job applications.

2. **Placement Officer (College Admin)**:
   - Orchestrates campus recruitment drives, company eligibility criteria, and job posting broadcasts.
   - Filters candidate rosters by CGPA, department, backlogs, and skill readiness indexes.
   - Tracks real-time placement statistics, company pipeline analytics, and generates official audit reports.

3. **Head of Department (HOD)**:
   - Reviews and approves/rejects student interview leave requests and placement training requests.
   - Monitors department-wide placement readiness, skill gap matrices, and faculty mentorship progress.

4. **Faculty**:
   - Mentors assigned student cohorts, verifies student technical skill claims and certifications.
   - Monitors class attendance, daily learning streaks, and mock test performance.

5. **Recruiter / HR**:
   - Searches verified student pool using multi-field filters (Skills, CGPA, Department, Programming Languages, Preferred Cities).
   - Views parsed candidate resumes, ATS match scores, and GitHub portfolios.
   - Contacts eligible candidates directly and schedules campus/virtual interview rounds.

6. **Super Admin**:
   - Manages institutional SaaS subscriptions, global job aggregation feeds, and API credentials.
   - Configures AI model pipelines (CrewAI, LLM prompts, Voice call synthesis parameters).
   - Audits system-wide security logs, compliance standards, and user access.

---

## 3. Core Functional Requirements

### 3.1 Personal AI Placement Agent & Morning Automation
- **FR-1.1**: Every student profile is bound to a stateless/stateful Personal AI Placement Agent worker.
- **FR-1.2**: Daily morning automated scan checking verified job feeds, off-campus drives, walk-ins, and internship postings.
- **FR-1.3**: Multi-channel alert dispatch (In-app UI popup, Email, WhatsApp API, AI Voice Assistant Call).
- **FR-1.4**: Interactive AI Voice Call Simulator utilizing Web Speech Synthesis to deliver morning schedule briefings and readiness stats.

### 3.2 Job Collection Engine & Smart Search
- **FR-2.1**: Ingestion from legitimate sources (Official Company Careers, Verified APIs, Govt Employment Portals, Authorized Feeds).
- **FR-2.2**: Strict deduplication and compliance—never copy protected content without authorization; display original source attribution and direct official application URL redirects.
- **FR-2.3**: Automated expiration management—expired job postings automatically update status and disappear from active feeds.

### 3.3 Semantic AI Skill Matching & Career Roadmaps
- **FR-3.1**: Compute multi-variable match score comparing student profile vector against target job specs.
- **FR-3.2**: Output match %, eligibility badge, missing skills, learning priority, and estimated selection probability.
- **FR-3.3**: Generate week-by-week company-tailored career roadmaps (e.g. Google, Microsoft, Zoho, TCS).

### 3.4 Resume AI & ATS Engine
- **FR-4.1**: Parse PDF/Docx resumes into structured JSON (skills, experience, education, projects, certifications).
- **FR-4.2**: Calculate 4-part ATS Score (Keywords, Formatting, Impact Metrics, Skill Relevance).
- **FR-4.3**: Generate company-tailored resumes and cover letters with strict non-falsification constraints (no fake skills/experience).

### 3.5 Daily Practice & Assessment Suite
- **FR-5.1**: Automated daily question generation across Coding, Aptitude, Technical, and English Communication.
- **FR-5.2**: Timed company mock tests with instant AI question explanations upon completion.
- **FR-5.3**: AI Voice/Text Mock Interview simulator evaluating Communication, Confidence, Technical Accuracy, Problem Solving, and Grammar.

### 3.6 HOD & Recruiter Workflows
- **FR-6.1**: HOD Leave Approval Engine for student placement interviews with digital audit trail.
- **FR-6.2**: Recruiter search tool with real-time candidate filtering, resume preview, and interview invitation dispatch.

---

## 4. Non-Functional & Security Requirements
- **Performance**: Sub-100ms API latency for candidate search and dashboard metrics.
- **Security**: JWT authorization with RBAC middleware, bcrypt password hashing (12 salt rounds), HTTPS/TLS encryption.
- **Compliance**: AI clearly identifies itself as an automated assistant; zero invented qualifications; source attribution on all external job listings.
- **Architecture**: Micro-frontend architecture with Next.js/Vite React frontend, Express.js backend, and Docker deployment.
