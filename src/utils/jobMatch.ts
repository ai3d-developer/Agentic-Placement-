import { UserProfile } from '../types';

/**
 * Calculate honest dynamic skill match for a job based on the student's profile.
 * No arbitrary percentage boosts are added.
 */
export const calculateDynamicMatch = (jobSkills: string[], profile: UserProfile) => {
  const studentSkillsLower = (profile.technicalSkills || []).map(s => s.toLowerCase().trim());
  
  // Gather technologies and text from projects
  const projectKeywords: string[] = [];
  (profile.projects || []).forEach(p => {
    if (p.techStack) {
      p.techStack.forEach(t => projectKeywords.push(t.toLowerCase().trim()));
    }
    if (p.title) {
      p.title.split(/[\s,/\(\)]+/).forEach(w => {
        const clean = w.toLowerCase().replace(/[^a-z0-9+#]/g, '').trim();
        if (clean.length > 1) projectKeywords.push(clean);
      });
    }
    if (p.description) {
      p.description.split(/[\s,/\(\)]+/).forEach(w => {
        const clean = w.toLowerCase().replace(/[^a-z0-9+#]/g, '').trim();
        if (clean.length > 1) projectKeywords.push(clean);
      });
    }
  });

  // Gather keywords from certifications
  const certKeywords: string[] = [];
  (profile.certifications || []).forEach(c => {
    if (c.title) {
      c.title.split(/[\s,/\(\)]+/).forEach(w => {
        const clean = w.toLowerCase().replace(/[^a-z0-9+#]/g, '').trim();
        if (clean.length > 1) certKeywords.push(clean);
      });
    }
    if (c.issuer) {
      c.issuer.split(/[\s,/\(\)]+/).forEach(w => {
        const clean = w.toLowerCase().replace(/[^a-z0-9+#]/g, '').trim();
        if (clean.length > 1) certKeywords.push(clean);
      });
    }
  });

  const allStudentKeywords = new Set([
    ...studentSkillsLower,
    ...projectKeywords,
    ...certKeywords
  ]);

  if (allStudentKeywords.size === 0) {
    return { matchPct: 0, missing: jobSkills, matched: [] };
  }

  const missing: string[] = [];
  const matched: string[] = [];

  jobSkills.forEach(js => {
    const jsLower = js.toLowerCase().trim();
    let isMatch = false;

    for (const keyword of allStudentKeywords) {
      const kwLower = keyword.toLowerCase().trim();
      
      // 1. Exact match
      if (kwLower === jsLower) {
        isMatch = true;
        break;
      }
      
      // 2. Safe Substring / Fuzzy match
      if (kwLower.length > 2 && jsLower.length > 2) {
        // Prevent Java vs JavaScript confusion
        if ((kwLower === 'java' && jsLower.includes('javascript')) || (jsLower === 'java' && kwLower.includes('javascript'))) {
          continue;
        }
        
        // Prevent C vs C++ or C# substring matching
        if ((kwLower === 'c' || jsLower === 'c') && kwLower !== jsLower) {
          continue;
        }

        // Check if one contains the other as a whole word or clean boundary
        if (kwLower.includes(jsLower) || jsLower.includes(kwLower)) {
          isMatch = true;
          break;
        }
      }
    }

    if (isMatch) {
      matched.push(js);
    } else {
      missing.push(js);
    }
  });

  // Calculate clean match percentage as matched / total required
  const totalSkills = Math.max(1, jobSkills.length);
  const matchPct = Math.round((matched.length / totalSkills) * 100);

  return { matchPct, missing, matched };
};
