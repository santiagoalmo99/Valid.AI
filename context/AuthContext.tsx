
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider } from '../services/firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check for Demo Mode in URL ( stakeholder bypass )
    const params = new URLSearchParams(window.location.search);
    if (params.get('demo') === 'true') {
      console.log('🎟️ Demo Mode Active: Injecting Mock User');
      const mockUser = {
        uid: 'demo-user-123',
        email: 'demo@validai.com',
        displayName: 'Demo Stakeholder',
        photoURL: 'https://ui-avatars.com/api/?name=Demo+User&background=6366f1&color=fff',
        emailVerified: true,
        isAnonymous: false,
        providerData: [],
        getIdToken: async () => 'mock-token',
        phoneNumber: null,
      } as unknown as User;
      
      setUser(mockUser);
      setLoading(false);
      return;
    }

    // 2. Standard Firebase Auth
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed", error);
      alert("Login failed. Check console for details. Make sure Firebase is configured.");
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
