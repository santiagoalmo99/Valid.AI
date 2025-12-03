
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { 
  getFirestore, collection, query, where, orderBy, onSnapshot, 
  addDoc, updateDoc, deleteDoc, doc, setDoc 
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// --- FIRESTORE HELPERS ---

// PROJECTS
export const subscribeToProjects = (userId: string, callback: (projects: ProjectTemplate[]) => void) => {
  const q = query(
    collection(db, 'projects'), 
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  return onSnapshot(q, (snapshot) => {
    const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ProjectTemplate));
    callback(projects);
  });
};

export const createProject = async (userId: string, project: ProjectTemplate) => {
  // We use setDoc with the project.id if it exists, or addDoc if we want auto-id.
  // Since our app generates IDs, let's use setDoc to keep them or just addDoc and let Firestore decide.
  // To keep it simple and consistent with our ID generation:
  const { id, ...data } = project;
  // We'll use the generated ID as the document ID
  await setDoc(doc(db, 'projects', id), { ...data, userId });
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
  const q = query(
    collection(db, 'interviews'),
    where('projectId', '==', projectId),
    orderBy('date', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const interviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Interview));
    callback(interviews);
  });
};

export const addInterview = async (interview: Interview) => {
  const { id, ...data } = interview;
  await setDoc(doc(db, 'interviews', id), data);
};

export const deleteInterview = async (interviewId: string) => {
  await deleteDoc(doc(db, 'interviews', interviewId));
};

export const deleteInterviewsBatch = async (interviewIds: string[]) => {
  const { writeBatch } = await import('firebase/firestore');
  const batch = writeBatch(db);
  interviewIds.forEach(id => {
    const ref = doc(db, 'interviews', id);
    batch.delete(ref);
  });
  await batch.commit();
};
