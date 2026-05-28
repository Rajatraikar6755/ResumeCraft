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
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBElESrzbF67oh_LJuQBtMf_dRgaR0NqjU",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "resume-alchemy-2025.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "resume-alchemy-2025",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "resume-alchemy-2025.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "918941914945",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:918941914945:web:df5a7ceeb7f454a7fd73c0",
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
