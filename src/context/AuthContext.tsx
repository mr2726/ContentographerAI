'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { LoaderCircle } from 'lucide-react';

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
}

interface UserData {
  plan: 'free' | 'pro' | 'ultimate';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeFirestore: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (unsubscribeFirestore) {
        unsubscribeFirestore();
      }

      setUser(user);
      if (user) {
        setLoading(true);
        const userDocRef = doc(db, 'users', user.uid);
        unsubscribeFirestore = onSnapshot(userDocRef, 
          (doc) => {
            if (doc.exists()) {
              setUserData(doc.data() as UserData);
            } else {
              setUserData(null);
            }
            setLoading(false);
          },
          (error) => {
            console.error("Error fetching user data with snapshot: ", error);
            setUserData(null);
            setLoading(false);
          }
        );
      } else {
        setUserData(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeFirestore) {
        unsubscribeFirestore();
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoaderCircle className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, userData, loading }}>
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
