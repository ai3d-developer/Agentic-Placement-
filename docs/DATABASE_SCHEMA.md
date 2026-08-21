# Database Schema Specification - PlacementOS AI (MongoDB / Mongoose)

## 1. Collection: `users`
```json
{
  "_id": "ObjectId",
  "name": "String",
  "email": "String (Unique)",
  "passwordHash": "String",
  "role": "Enum['student', 'placement_officer', 'hod', 'faculty', 'recruiter', 'super_admin']",
  "collegeId": "ObjectId (Ref: College)",
  "department": "String",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## 2. Collection: `profiles` (Student Profile)
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (Ref: User)",
  "phone": "String",
  "department": "String",
  "graduationYear": "Number",
  "cgpa": "Number",
  "backlogs": "Number",
  "codingLevel": "Enum['Beginner', 'Intermediate', 'Advanced', 'Expert']",
  "communicationScore": "Number",
  "preferredCompanies": ["String"],
  "preferredRoles": ["String"],
  "preferredCities": ["String"],
  "technicalSkills": ["String"],
  "softSkills": ["String"],
  "languages": ["String"],
  "socialLinks": {
    "github": "String",
    "linkedin": "String",
    "portfolio": "String"
  },
  "certifications": [
    { "title": "String", "issuer": "String", "year": "Number" }
  ],
  "projects": [
    { "title": "String", "description": "String", "techStack": ["String"], "githubUrl": "String" }
  ],
  "placementReadinessScore": "Number",
  "employabilityScore": "Number",
  "dailyStreak": "Number",
  "updatedAt": "Date"
}
```

## 3. Collection: `resumes`
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (Ref: User)",
  "fileUrl": "String",
  "extractedText": "String",
  "atsScore": "Number",
  "scoreBreakdown": {
    "keywords": "Number",
    "formatting": "Number",
    "impactMetrics": "Number",
    "skillsMatch": "Number"
  },
  "detectedSkills": ["String"],
  "detectedProjects": ["String"],
  "detectedCertifications": ["String"],
  "suggestedImprovements": ["String"],
  "generatedResumes": [
    { "targetCompany": "String", "targetRole": "String", "resumeText": "String", "createdAt": "Date" }
  ],
  "coverLetters": [
    { "company": "String", "role": "String", "content": "String", "createdAt": "Date" }
  ],
  "createdAt": "Date"
}
```

## 4. Collection: `jobs`
```json
{
  "_id": "ObjectId",
  "company": "String",
  "role": "String",
  "logoUrl": "String",
  "skillsRequired": ["String"],
  "minCgpa": "Number",
  "maxBacklogs": "Number",
  "salary": "String",
  "location": "String",
  "experience": "String",
  "education": "String",
  "deadline": "Date",
  "applyLink": "String",
  "source": "Enum['Official Company Careers', 'Gov Employment Portal', 'Public RSS Feed', 'Authorized Job Feed']",
  "isInternship": "Boolean",
  "status": "Enum['Active', 'Expired', 'Verified']",
  "postedDate": "Date",
  "verifiedDate": "Date"
}
```

## 5. Collection: `mock_tests`
```json
{
  "_id": "ObjectId",
  "title": "String",
  "targetCompany": "String",
  "durationMinutes": "Number",
  "totalQuestions": "Number",
  "category": "String",
  "questions": [
    {
      "questionId": "String",
      "section": "Enum['Coding', 'Aptitude', 'Technical', 'HR', 'English']",
      "text": "String",
      "options": ["String"],
      "correctAnswer": "String",
      "codeTemplate": "String",
      "explanation": "String"
    }
  ]
}
```

## 6. Collection: `interviews`
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (Ref: User)",
  "targetRole": "String",
  "targetCompany": "String",
  "mode": "Enum['Voice', 'Text', 'Video']",
  "transcript": [
    { "speaker": "Enum['ai', 'candidate']", "message": "String", "timestamp": "Date" }
  ],
  "evaluation": {
    "communicationScore": "Number",
    "confidenceScore": "Number",
    "technicalKnowledgeScore": "Number",
    "problemSolvingScore": "Number",
    "grammarScore": "Number",
    "overallScore": "Number",
    "feedbackSummary": "String",
    "strengths": ["String"],
    "areasForImprovement": ["String"]
  },
  "completedAt": "Date"
}
```

## 7. Collection: `leave_requests` (HOD Approvals)
```json
{
  "_id": "ObjectId",
  "studentId": "ObjectId (Ref: User)",
  "studentName": "String",
  "department": "String",
  "companyName": "String",
  "interviewRole": "String",
  "leaveDate": "Date",
  "reason": "String",
  "status": "Enum['Pending', 'Approved', 'Rejected']",
  "approvedBy": "ObjectId (Ref: User)",
  "comments": "String",
  "createdAt": "Date"
}
```

## 8. Collection: `colleges`
```json
{
  "_id": "ObjectId",
  "name": "String",
  "code": "String",
  "city": "String",
  "totalStudents": "Number",
  "placedStudents": "Number",
  "placementPercentage": "Number",
  "createdAt": "Date"
}
```

## 9. Collection: `audit_logs`
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (Ref: User)",
  "action": "String",
  "ipAddress": "String",
  "details": "Object",
  "timestamp": "Date"
}
```
