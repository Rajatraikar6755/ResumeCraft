import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
  signOut,
  type User,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDdW5199ISNd5Y7ZMxFgfe9bfRQMeDayFw",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "resume-alchemy-app.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "resume-alchemy-app",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "resume-alchemy-app.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "324979302744",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:324979302744:web:c19f425344e5f06cf6c52d",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();

// ── Auth helpers ──────────────────────────────────────────────

/** Register with email + password, then set displayName */
export const firebaseRegister = async (name: string, email: string, password: string) => {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName: name });
  return cred.user;
};

/** Sign in with email + password */
export const firebaseLogin = async (email: string, password: string) => {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
};

/** Sign in with Google popup */
export const firebaseGoogleSignIn = async () => {
  const cred = await signInWithPopup(auth, googleProvider);
  return cred.user;
};

/** Sign out */
export const firebaseSignOut = async () => {
  await signOut(auth);
};

/** Get the ID token for the currently signed-in user */
export const getIdToken = async (user: User) => {
  return user.getIdToken();
};

export type { User };
