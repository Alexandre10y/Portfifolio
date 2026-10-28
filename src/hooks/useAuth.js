import { useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../firebase/config';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setLoading(false);
      return undefined;
    }

    const unsub = onAuthStateChanged(auth, (next) => {
      setUser(next);
      setLoading(false);
    });
    return unsub;
  }, []);

  const login = async (email, password) => {
    if (!auth) throw new Error('Firebase Auth não configurado.');
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    if (!auth) return;
    await signOut(auth);
  };

  return {
    user,
    loading,
    login,
    logout,
    configured: isFirebaseConfigured,
  };
}
