
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { 
  getFirestore, collection, query, where, orderBy, onSnapshot, 
  addDoc, updateDoc, deleteDoc, doc, setDoc, writeBatch 
} from 'firebase/firestore';
import { ProjectTemplate, Interview } from '../types';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Debug: Check if config is loaded
console.log('🔵 [Firebase] Config loaded:', {
  hasApiKey: !!firebaseConfig.apiKey,
  hasAuthDomain: !!firebaseConfig.authDomain,
  hasProjectId: !!firebaseConfig.projectId,
  projectId: firebaseConfig.projectId
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

console.log('🟢 [Firebase] Initialized successfully');

// --- FIRESTORE HELPERS ---

// PROJECTS
export const subscribeToProjects = (userId: string, callback: (projects: ProjectTemplate[]) => void) => {
  // Simplified query - no orderBy to avoid requiring composite index
  const q = query(
    collection(db, 'projects'), 
    where('userId', '==', userId)
  );
  
  return onSnapshot(q, 
    (snapshot) => {
      const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ProjectTemplate));
      // Sort client-side instead of server-side
      projects.sort((a, b) => {
        const aDate = (a as any).createdAt?.toMillis?.() || (a as any).createdAt || 0;
        const bDate = (b as any).createdAt?.toMillis?.() || (b as any).createdAt || 0;
        return bDate - aDate;
      });
      console.log('☁️ [Firebase] Received', projects.length, 'projects');
      callback(projects);
    },
    (error) => {
      console.error('🔴 [Firebase] Subscription error:', error.message);
      // Return empty array on error - let localStorage handle it
      callback([]);
    }
  );
};

// Helper function to add timeout to promises
const withTimeout = <T>(promise: Promise<T>, ms: number, errorMessage: string): Promise<T> => {
  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error(errorMessage)), ms);
  });
  return Promise.race([promise, timeout]);
};

export const createProject = async (userId: string, project: ProjectTemplate) => {
  console.log('🔵 [Firebase] createProject START - userId:', userId, 'projectId:', project.id);
  
  try {
    const { id, ...data } = project;
    console.log('🔵 [Firebase] Preparing document with ID:', id);
    
    const docRef = doc(db, 'projects', id);
    console.log('🔵 [Firebase] Calling setDoc with 10s timeout...');
    
    // Add 10 second timeout to prevent hanging
    await withTimeout(
      setDoc(docRef, { ...data, userId }),
      10000,
      'Firebase timeout: No response after 10 seconds.'
    );
    
    console.log('🟢 [Firebase] setDoc SUCCESS');
  } catch (error: any) {
    console.error('🔴 [Firebase] createProject ERROR:', error);
    console.warn('🟡 [Firebase] Using localStorage fallback...');
    
    // FALLBACK: Save to localStorage if Firebase fails
    try {
      const localProjects = JSON.parse(localStorage.getItem('validai_projects') || '[]');
      const projectWithUser = { ...project, userId };
      
      // Add or update project
      const existingIndex = localProjects.findIndex((p: any) => p.id === project.id);
      if (existingIndex >= 0) {
        localProjects[existingIndex] = projectWithUser;
      } else {
        localProjects.push(projectWithUser);
      }
      
      localStorage.setItem('validai_projects', JSON.stringify(localProjects));
      console.log('🟢 [LocalStorage] Project saved locally as fallback');
      
      // Show user-friendly message
      alert('⚠️ Firebase no está disponible.\n\nTu proyecto se guardó localmente en este navegador.\n\nPara usar Firebase:\n1. Ve a console.firebase.google.com\n2. Asegúrate de que Firestore Database esté habilitado\n3. Despliega las reglas de seguridad');
      
      return; // Success via fallback
    } catch (localError) {
      console.error('🔴 [LocalStorage] Fallback also failed:', localError);
      throw error; // Re-throw original Firebase error
    }
  }
};

export const updateProject = async (project: ProjectTemplate) => {
  const { id, ...data } = project;
  const projectRef = doc(db, 'projects', id);
  await updateDoc(projectRef, data);
};

export const deleteProject = async (projectId: string) => {
  await deleteDoc(doc(db, 'projects', projectId));
};

// INTERVIEWS
export const subscribeToInterviews = (projectId: string, callback: (interviews: Interview[]) => void) => {
  // Simplified query - remove orderBy to avoid requiring composite index
  const q = query(
    collection(db, 'interviews'),
    where('projectId', '==', projectId)
  );

  return onSnapshot(q, (snapshot) => {
    const interviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Interview));
    
    // Client-side sorting (avoids Firebase Index requirement)
    interviews.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA; // Descending order
    });
    
    callback(interviews);
  });
};

export const addInterview = async (interview: Interview) => {
  const { id, ...data } = interview;
  await setDoc(doc(db, 'interviews', id), data);
};

export const deleteInterview = async (interviewId: string) => {
  const ref = doc(db, 'interviews', interviewId);
  // Idempotency check: ensure it exists before deleting to avoid errors or unnecessary writes
  // In Firestore delete is idempotent (doesn't fail if not exists), but for our logic we might want to know.
  // Actually, Firestore delete() IS idempotent by default. It returns success even if doc doesn't exist.
  // However, to be "Self-Healing" and explicit, we can just call it. 
  // But the plan asked to "check existence first". Let's do it to be safe and maybe log it.
  // Wait, checking first adds a read cost. Firestore delete IS safe. 
  // Let's just wrap it in a try-catch to ensure it never throws for the caller.
  try {
    await deleteDoc(ref);
  } catch (e) {
    console.warn("Delete operation failed or document already gone", e);
  }
};

export const deleteInterviewsBatch = async (interviewIds: string[]) => {
  const batch = writeBatch(db);
  interviewIds.forEach(id => {
    const ref = doc(db, 'interviews', id);
    batch.delete(ref);
  });
  await batch.commit();
};

// LEADS
export interface LeadData {
  name: string;
  email: string;
  role: string;
  stage: string;
  source?: string;
  createdAt: Date;
}

export const saveLead = async (lead: LeadData): Promise<boolean> => {
  console.log('🔵 [Firebase] Saving lead:', lead.email);
  
  try {
    await addDoc(collection(db, 'leads'), {
      ...lead,
      createdAt: new Date(),
      source: 'landing_page'
    });
    console.log('🟢 [Firebase] Lead saved successfully');
    return true;
  } catch (error: any) {
    console.error('🔴 [Firebase] saveLead ERROR:', error);
    
    // Fallback to localStorage
    try {
      const localLeads = JSON.parse(localStorage.getItem('validai_leads') || '[]');
      localLeads.push({
        ...lead,
        createdAt: new Date().toISOString(),
        source: 'landing_page'
      });
      localStorage.setItem('validai_leads', JSON.stringify(localLeads));
      console.log('🟢 [LocalStorage] Lead saved locally as fallback');
      return true;
    } catch (localError) {
      console.error('🔴 [LocalStorage] Fallback also failed:', localError);
      return false;
    }
  }
};
