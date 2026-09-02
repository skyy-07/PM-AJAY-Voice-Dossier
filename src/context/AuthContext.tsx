import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  updateProfile,
  syncUserProfile,
  AppUserProfile,
} from '../lib/firebase';
import { User as FirebaseUser } from 'firebase/auth';

interface AuthContextType {
  user: FirebaseUser | null;
  userProfile: AppUserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, name: string, role?: 'candidate' | 'surveyor' | 'admin') => Promise<void>;
  signInGuest: () => Promise<void>;
  logout: () => Promise<void>;
  updateRole: (role: 'candidate' | 'surveyor' | 'admin') => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<AppUserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const profile = await syncUserProfile(currentUser);
          setUserProfile(profile);
        } catch (err) {
          console.error('Failed to sync user profile:', err);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      const profile = await syncUserProfile(cred.user);
      setUserProfile(profile);
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
        console.warn('Google Sign In popup was closed by the user.');
      } else if (err.code === 'auth/popup-blocked') {
        console.warn('Google Sign In popup was blocked by the browser.');
      } else {
        console.error('Google Sign In error:', err);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      const profile = await syncUserProfile(cred.user);
      setUserProfile(profile);
    } catch (err: any) {
      console.error('Email Sign In failed:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (
    email: string,
    pass: string,
    name: string,
    role: 'candidate' | 'surveyor' | 'admin' = 'candidate'
  ) => {
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      if (name) {
        await updateProfile(cred.user, { displayName: name });
      }
      const profile = await syncUserProfile(cred.user, role);
      setUserProfile(profile);
    } catch (err: any) {
      console.error('Sign Up failed:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signInGuest = async () => {
    setLoading(true);
    try {
      const cred = await signInAnonymously(auth);
      const profile = await syncUserProfile(cred.user, 'candidate');
      setUserProfile(profile);
    } catch (err: any) {
      console.error('Guest Sign In failed:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      setUserProfile(null);
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (role: 'candidate' | 'surveyor' | 'admin') => {
    if (!user) return;
    try {
      const profile = await syncUserProfile(user, role);
      setUserProfile(profile);
    } catch (err) {
      console.error('Failed to update role:', err);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      const profile = await syncUserProfile(user);
      setUserProfile(profile);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signInGuest,
        logout,
        updateRole,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
