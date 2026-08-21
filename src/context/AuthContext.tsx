import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, UserProfile } from '../types';
import { unparsedStudentProfile } from '../services/mockData';
import {
  saveStudentProfileToFirestore,
  fetchStudentProfileFromFirestore,
  isFirebaseConfigured,
  signOutUser,
  deleteStudentProfileFromFirestore
} from '../services/firebase';

interface AuthContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  profile: UserProfile;
  updateProfile: (updated: Partial<UserProfile>) => void;
  resetProfile: () => void;
  notifications: string[];
  addNotification: (msg: string) => void;
  completeOnboarding: (data: Partial<UserProfile>) => void;
  isFirebaseConnected: boolean;
  loginUser: (role: UserRole, email: string, displayName?: string) => Promise<void>;
}

const STORAGE_KEY = 'placementos_student_profile_v4';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('student');
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      // Clear legacy storage keys if any
      localStorage.removeItem('placementos_student_profile_v1');
      localStorage.removeItem('placementos_student_profile_v2');
      localStorage.removeItem('placementos_student_profile_v3');

      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // ONLY restore profile if a resume has been uploaded!
        if (parsed.resumeFileName && parsed.technicalSkills && parsed.technicalSkills.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading stored profile:', e);
    }
    // Otherwise start fresh with clean unparsed student profile at 0 scores
    return unparsedStudentProfile;
  });

  const [notifications, setNotifications] = useState<string[]>(() => {
    const isFb = isFirebaseConfigured();
    return [
      isFb
        ? '🔥 Connected to Firebase Firestore! Student profile and activity will auto-sync to cloud.'
        : '📄 Welcome to PlacementOS AI! Standard mode active. Add Firebase keys in .env for Cloud Firestore sync.'
    ];
  });

  // Sync profile with Firebase Firestore whenever available
  useEffect(() => {
    if (isFirebaseConfigured()) {
      // PUSH CURRENT PROFILE TO FIRESTORE IMMEDIATELY ON APP BOOT
      saveStudentProfileToFirestore(profile)
        .then(success => {
          if (success) {
            console.log('🔥 Initial student profile auto-synced to Firestore!');
          }
        })
        .catch(err => {
          console.warn('Firestore auto-sync error:', err);
        });

      if (profile.email) {
        fetchStudentProfileFromFirestore(profile.email).then(cloudProfile => {
          if (cloudProfile && cloudProfile.resumeFileName) {
            setProfile(cloudProfile);
            addNotification('🔥 Student profile synchronized from Firebase Firestore database.');
          }
        }).catch(err => {
          console.warn('Firestore load warning:', err);
        });
      }
    }
  }, []);

  const resetProfile = () => {
    const currentEmail = profile.email;
    const currentName = profile.name;
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('placementos_student_profile_v1');
      localStorage.removeItem('placementos_student_profile_v2');
      localStorage.removeItem('placementos_student_profile_v3');

      if (currentEmail && currentEmail !== 'student@college.edu') {
        console.log(`🔥 [AuthContext] Requesting Firestore deletion for ${currentEmail}...`);
        deleteStudentProfileFromFirestore(currentEmail).then(success => {
          if (success) {
            addNotification(`🧹 Deleted student profile for ${currentEmail} from Firestore.`);
          } else {
            addNotification(`⚠️ Failed to delete student profile for ${currentEmail} from Firestore.`);
          }
        }).catch(err => {
          console.error('Firestore delete warning:', err);
        });
      }
    } catch (e) {
      console.error('Error clearing profile storage:', e);
    }

    const resetStudentProfile = {
      ...unparsedStudentProfile,
      email: currentEmail,
      name: currentName
    };

    setProfile(resetStudentProfile);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resetStudentProfile));

    addNotification('🧹 Student profile cache reset. You remain logged in. Upload a new resume to activate and save to Firestore.');
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    setProfile(prev => {
      const newProfile = { ...prev, ...updated };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
      } catch (e) {
        console.error('Error saving profile to localStorage:', e);
      }

      // Save to Firebase Firestore
      saveStudentProfileToFirestore(newProfile).then(res => {
        if (!res.success) {
          addNotification(`❌ Firestore Sync Error: ${res.error}`);
        }
      }).catch(err => {
        console.warn('Firestore sync error:', err);
        addNotification(`❌ Firestore Sync Failure: ${err?.message || String(err)}`);
      });

      return newProfile;
    });
  };

  const completeOnboarding = (onboardingData: Partial<UserProfile>) => {
    // Calculate readiness scores dynamically based on provided info
    let readinessScore = 40;
    let atsScore = 35;
    let employabilityScore = 45;

    if (onboardingData.resumeFileName || (onboardingData.technicalSkills && onboardingData.technicalSkills.length > 0)) {
      readinessScore += 25;
      atsScore += 45;
      employabilityScore += 25;
    }
    if (onboardingData.github) {
      readinessScore += 10;
      employabilityScore += 10;
    }
    if (onboardingData.linkedin) {
      readinessScore += 10;
      employabilityScore += 10;
    }
    if (onboardingData.portfolio) {
      readinessScore += 15;
      employabilityScore += 10;
    }

    readinessScore = Math.min(98, Math.max(70, readinessScore));
    atsScore = Math.min(98, Math.max(65, atsScore));
    employabilityScore = Math.min(98, Math.max(72, employabilityScore));

    const finalProfile: UserProfile = {
      ...profile,
      ...onboardingData,
      isOnboarded: true,
      placementReadinessScore: readinessScore,
      atsScore: atsScore,
      employabilityScore: employabilityScore
    };

    updateProfile(finalProfile);
    addNotification('🚀 Student Profile initialized & saved to Firebase Firestore!');
  };

  const loginUser = async (selectedRole: UserRole, email: string, displayName?: string) => {
    setRole(selectedRole);
    if (selectedRole === 'student' && email) {
      const emailName = email.split('@')[0];
      const studentName = displayName || profile.name || emailName || 'Student Candidate';
      const localProfile = { ...profile, email, name: studentName };

      if (isFirebaseConfigured()) {
        try {
          console.log(`🔥 [AuthContext] Fetching student profile for ${email} from Firestore...`);
          const cloudProfile = await fetchStudentProfileFromFirestore(email);

          let finalProfile: UserProfile;
          if (cloudProfile && cloudProfile.name) {
            // Merge cloud profile, preserving any cloud data
            finalProfile = { ...localProfile, ...cloudProfile };
            addNotification(`🔥 Welcome back! Loaded profile for ${email} from Firebase.`);
            console.log('🔥 [AuthContext] Found existing cloud profile:', finalProfile);
          } else {
            finalProfile = localProfile;
            addNotification(`🔥 Welcome! Initialized new profile for ${email} in Firebase.`);
            console.log('🔥 [AuthContext] Creating new cloud profile:', finalProfile);
          }

          setProfile(finalProfile);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(finalProfile));

          // Save back immediately to ensure sync is complete on login
          console.log(`🔥 [AuthContext] Saving profile for ${email} to Firestore...`);
          const result = await saveStudentProfileToFirestore(finalProfile);
          if (result.success) {
            console.log('🔥 [AuthContext] Profile successfully written to Firestore on login.');
          } else {
            console.warn('⚠️ [AuthContext] Firestore write failed on login.');
            addNotification(`❌ Firebase Sync Failed: ${result.error}`);
          }
        } catch (e: any) {
          console.error('❌ [AuthContext] Firebase login sync error:', e);
          setProfile(localProfile);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(localProfile));
          addNotification(`❌ Firebase Login Sync Error: ${e?.message || String(e)}`);

          const secResult = await saveStudentProfileToFirestore(localProfile);
          if (!secResult.success) {
            console.error('❌ [AuthContext] Secondary Firestore save attempt failed:', secResult.error);
            addNotification(`❌ Firebase Secondary Sync Failed: ${secResult.error}`);
          }
        }
      } else {
        setProfile(localProfile);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(localProfile));
      }
    } else {
      addNotification(`🔑 Logged in as ${selectedRole.replace('_', ' ').toUpperCase()} (${email})`);
    }
  };

  const addNotification = (msg: string) => {
    setNotifications(prev => [msg, ...prev]);
  };

  return (
    <AuthContext.Provider value={{
      role,
      setRole,
      profile,
      updateProfile,
      resetProfile,
      notifications,
      addNotification,
      completeOnboarding,
      isFirebaseConnected: isFirebaseConfigured(),
      loginUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
