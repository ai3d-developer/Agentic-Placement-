import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, Firestore, deleteDoc } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, Auth, User } from 'firebase/auth';
import { UserProfile, MockTestResult, LeaveRequest } from '../types';

const firebaseConfig = {
  apiKey: 'AIzaSyDOGLHW2QoUTHBZ6OWcY_iQXAuRp-2-80o',
  authDomain: 'agentic-placement.firebaseapp.com',
  projectId: 'agentic-placement',
  storageBucket: 'agentic-placement.firebasestorage.app',
  messagingSenderId: '203936372218',
  appId: '1:203936372218:web:33e10621da940edc4dc043'
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;

export const isFirebaseConfigured = (): boolean => {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
};

export const getFirebaseDb = (): Firestore | null => {
  if (!isFirebaseConfigured()) {
    return null;
  }
  if (!db) {
    try {
      app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
      db = getFirestore(app);
    } catch (error) {
      console.warn('⚠️ Firebase Firestore initialization warning:', error);
      return null;
    }
  }
  return db;
};

export const getFirebaseAuth = (): Auth | null => {
  if (!isFirebaseConfigured()) {
    return null;
  }
  if (!auth) {
    try {
      app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
      auth = getAuth(app);
    } catch (error) {
      console.warn('⚠️ Firebase Auth initialization warning:', error);
      return null;
    }
  }
  return auth;
};

/**
 * Sign in user using Google Pop-up
 */
export const signInWithGoogle = async (): Promise<User | null> => {
  const authInstance = getFirebaseAuth();
  if (!authInstance) {
    throw new Error('Firebase Auth is not configured or initialized.');
  }
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(authInstance, provider);
    return result.user;
  } catch (error) {
    console.error('❌ Error signing in with Google:', error);
    throw error;
  }
};

/**
 * Sign out user from Firebase Auth
 */
export const signOutUser = async (): Promise<void> => {
  const authInstance = getFirebaseAuth();
  if (authInstance) {
    await signOut(authInstance);
    console.log('🔥 Signed out from Firebase Auth');
  }
};


/**
 * Save or update Student Profile in Firebase Firestore
 */
export const saveStudentProfileToFirestore = async (profile: UserProfile): Promise<{ success: boolean; error?: string }> => {
  const firestore = getFirebaseDb();
  if (!firestore) {
    console.log('ℹ️ Firestore disabled or unconfigured. Data saved locally.');
    return { success: false, error: 'Firestore is disabled or unconfigured.' };
  }

  try {
    const docId = profile.email ? profile.email.replace(/[^a-zA-Z0-9]/g, '_') : 'current_student';
    const profileRef = doc(firestore, 'students', docId);
    await setDoc(profileRef, {
      ...profile,
      lastSyncedAt: new Date().toISOString()
    }, { merge: true });
    console.log('🔥 Student profile successfully saved to Firebase Firestore!');
    return { success: true };
  } catch (error: any) {
    console.error('❌ Error saving profile to Firestore:', error);
    return { success: false, error: error?.message || String(error) };
  }
};

/**
 * Fetch Student Profile from Firebase Firestore
 */
export const fetchStudentProfileFromFirestore = async (email: string): Promise<UserProfile | null> => {
  const firestore = getFirebaseDb();
  if (!firestore || !email) return null;

  try {
    const docId = email.replace(/[^a-zA-Z0-9]/g, '_');
    const profileRef = doc(firestore, 'students', docId);
    const docSnap = await getDoc(profileRef);

    if (docSnap.exists()) {
      console.log('🔥 Fetched student profile from Firestore');
      return docSnap.data() as UserProfile;
    }
  } catch (error) {
    console.error('❌ Error fetching profile from Firestore:', error);
  }
  return null;
};

/**
 * Delete Student Profile and related documents from Firebase Firestore
 */
export const deleteStudentProfileFromFirestore = async (email: string): Promise<boolean> => {
  const firestore = getFirebaseDb();
  if (!firestore || !email) return false;

  try {
    const docId = email.replace(/[^a-zA-Z0-9]/g, '_');
    
    // 1. Delete from students collection
    const profileRef = doc(firestore, 'students', docId);
    await deleteDoc(profileRef);
    console.log(`🔥 Deleted students doc for ${email} from Firestore.`);

    // 2. Delete from resumes collection
    const resumeRef = doc(firestore, 'resumes', docId);
    await deleteDoc(resumeRef).catch(() => {});
    console.log(`🔥 Deleted resumes doc for ${email} from Firestore.`);

    // 3. Delete from matches collection (if any)
    const matchRef = doc(firestore, 'matches', docId);
    await deleteDoc(matchRef).catch(() => {});
    console.log(`🔥 Deleted matches doc for ${email} from Firestore.`);

    return true;
  } catch (error) {
    console.error('❌ Error deleting profile data from Firestore:', error);
    return false;
  }
};

/**
 * Save Job Application record to Firebase Firestore
 */
export const saveJobApplicationToFirestore = async (application: {
  studentEmail: string;
  studentName: string;
  company: string;
  role: string;
  applyLink: string;
  status: string;
}): Promise<boolean> => {
  const firestore = getFirebaseDb();
  if (!firestore) return false;

  try {
    const appsRef = collection(firestore, 'applications');
    await addDoc(appsRef, {
      ...application,
      appliedAt: new Date().toISOString()
    });
    console.log('🔥 Job application logged in Firestore!');
    return true;
  } catch (error) {
    console.error('❌ Error saving job application to Firestore:', error);
    return false;
  }
};

/**
 * Save Mock Test result to Firebase Firestore
 */
export const saveMockTestResultToFirestore = async (
  studentEmail: string,
  result: MockTestResult
): Promise<boolean> => {
  const firestore = getFirebaseDb();
  if (!firestore) return false;

  try {
    const resultsRef = collection(firestore, 'mock_test_results');
    await addDoc(resultsRef, {
      studentEmail,
      ...result,
      savedAt: new Date().toISOString()
    });
    console.log('🔥 Mock test result saved in Firestore!');
    return true;
  } catch (error) {
    console.error('❌ Error saving test result to Firestore:', error);
    return false;
  }
};

/**
 * Save Leave Request to Firebase Firestore
 */
export const saveLeaveRequestToFirestore = async (request: LeaveRequest): Promise<boolean> => {
  const firestore = getFirebaseDb();
  if (!firestore) return false;

  try {
    const leaveRef = doc(firestore, 'leave_requests', request.id);
    await setDoc(leaveRef, {
      ...request,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    console.log('🔥 Leave request saved in Firestore!');
    return true;
  } catch (error) {
    console.error('❌ Error saving leave request to Firestore:', error);
    return false;
  }
};

/**
 * Save Uploaded Resume Data & Raw Text to Firebase Firestore
 */
export const saveUploadedResumeDataToFirestore = async (
  studentEmail: string,
  fileName: string,
  extractedText: string,
  parsedData: any
): Promise<boolean> => {
  const firestore = getFirebaseDb();
  if (!firestore) return false;

  try {
    const docId = studentEmail ? studentEmail.replace(/[^a-zA-Z0-9]/g, '_') : 'resume_doc';
    const resumeRef = doc(firestore, 'resumes', docId);
    await setDoc(resumeRef, {
      studentEmail,
      fileName,
      extractedText,
      parsedSkills: parsedData.technicalSkills || [],
      parsedProjects: parsedData.projects || [],
      parsedCertifications: parsedData.certifications || [],
      atsScore: parsedData.atsScore || 0,
      uploadedAt: new Date().toISOString()
    }, { merge: true });
    console.log('🔥 Uploaded resume document & text saved to Firebase Firestore!');
    return true;
  } catch (error) {
    console.error('❌ Error saving resume upload to Firestore:', error);
    return false;
  }
};
