import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import firebaseConfigData from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: firebaseConfigData.apiKey,
  authDomain: firebaseConfigData.authDomain,
  projectId: firebaseConfigData.projectId,
  storageBucket: firebaseConfigData.storageBucket,
  messagingSenderId: firebaseConfigData.messagingSenderId,
  appId: firebaseConfigData.appId,
};

// Initialize Firebase App
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth
export const auth = getAuth(app);

// Initialize Firestore
const databaseId = firebaseConfigData.firestoreDatabaseId && firebaseConfigData.firestoreDatabaseId !== '(default)'
  ? firebaseConfigData.firestoreDatabaseId
  : undefined;

export const db = databaseId ? getFirestore(app, databaseId) : getFirestore(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export interface AppUserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: 'candidate' | 'surveyor' | 'admin';
  district?: string;
  phone?: string;
  isAnonymous: boolean;
  createdAt: string;
  lastLoginAt: string;
}

// Helper to create or sync user profile in Firestore
export async function syncUserProfile(user: FirebaseUser, roleOverride?: 'candidate' | 'surveyor' | 'admin'): Promise<AppUserProfile> {
  const userRef = doc(db, 'users', user.uid);
  let existingProfile: Partial<AppUserProfile> = {};
  
  try {
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      existingProfile = snap.data() as Partial<AppUserProfile>;
    }
  } catch (err) {
    console.warn('Could not read user profile from Firestore, using defaults:', err);
  }

  const role = roleOverride || existingProfile.role || (user.isAnonymous ? 'candidate' : 'candidate');

  const profile: AppUserProfile = {
    uid: user.uid,
    email: user.email || null,
    displayName: user.displayName || (user.isAnonymous ? 'Beneficiary (Guest)' : user.email?.split('@')[0] || 'User'),
    photoURL: user.photoURL || null,
    role,
    district: existingProfile.district || 'Nadia',
    phone: existingProfile.phone || user.phoneNumber || undefined,
    isAnonymous: user.isAnonymous,
    createdAt: existingProfile.createdAt || new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  };

  try {
    await setDoc(userRef, profile, { merge: true });
  } catch (err) {
    console.warn('Could not save user profile to Firestore:', err);
  }

  return profile;
}

export {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  updateProfile,
};
