# REST API Documentation - PlacementOS AI

All REST API endpoints are served with prefix `/api/v1`. Bearer JWT authentication header `Authorization: Bearer <token>` is required for protected endpoints.

---

## 1. Authentication (`/api/v1/auth`)
- `POST /register`: Registers user account with specified role (`student`, `placement_officer`, `hod`, `faculty`, `recruiter`, `super_admin`).
- `POST /login`: Authenticates credentials and returns JWT token & user profile payload.
- `GET /me`: Fetches current authenticated user context and permissions.

## 2. Student & Agent Endpoints (`/api/v1/profile`)
- `GET /`: Returns student profile (CGPA, skills, preferences, readiness index).
- `PUT /`: Updates student skills, projects, certifications, target companies, target cities.
- `GET /readiness`: Returns calculated 6-factor Placement Readiness Index breakdown.
- `GET /ai-agent/status`: Returns active Personal AI Agent monitoring status, daily matches count, and voice briefing payload.

## 3. Resume AI (`/api/v1/resume`)
- `POST /upload`: Uploads resume PDF/Text, parses content, computes 4-part ATS Score.
- `GET /ats`: Fetches ATS score, weak area warnings, keyword matching suggestions.
- `POST /generate-resume`: Generates tailored target job/company resume (enforcing strict factual skills).
- `POST /generate-cover-letter`: Generates custom cover letter for target role.

## 4. Job Engine & Smart Search (`/api/v1/jobs`)
- `GET /`: Lists all verified active jobs & internships with search query, location, salary, and deduplication filters.
- `GET /matching`: Returns personalized matching jobs tailored for the student's AI Agent.
- `GET /:id/match-analysis`: Computes exact skill match %, eligibility status, missing skills, and estimated selection probability.
- `POST /:id/apply`: Tracks job application lifecycle.

## 5. Career Roadmap & Daily Practice (`/api/v1/ai`)
- `POST /roadmap`: Generates multi-week target company learning roadmap (Google, Microsoft, Zoho, TCS, etc.).
- `GET /daily-learning`: Fetches today's questions (Coding, Aptitude, Technical, English Communication) and streak.
- `POST /daily-learning/submit`: Validates daily question answers and updates XP/streak points.

## 6. Assessments & AI Interview (`/api/v1/assessments`)
- `GET /mock-tests`: Fetches company-specific test catalog.
- `POST /mock-tests/:id/submit`: Scores test and generates AI question explanations.
- `POST /interview/evaluate`: Processes voice/text interview transcript and returns multi-metric evaluation report.

## 7. HOD Approvals (`/api/v1/hod`)
- `GET /leave-requests`: Fetches department student interview leave applications.
- `PATCH /leave-requests/:id`: Approves or rejects student interview leave with comments.
- `GET /analytics`: Department-wide student readiness and placement statistics.

## 8. Recruiter Candidate Search (`/api/v1/recruiter`)
- `POST /search-students`: Filters student database by Skills, CGPA, Department, Location, Programming Languages.
- `POST /schedule-interview`: Invites student to campus or virtual interview round.

## 9. Placement Officer & Admin (`/api/v1/placement`)
- `GET /stats`: College-wide placement progress, active hiring drives, company demand trends.
- `GET /students-export`: Export eligible candidate lists to CSV/PDF.
