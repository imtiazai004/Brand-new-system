import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { authService, UserProfile } from './auth.service';
import { getPermissions } from '../../lib/permissions';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let profileUnsubscribe: (() => void) | null = null;

    const authUnsubscribe = authService.onAuthStateChange(async (firebaseUser) => {
      setLoading(true);
      setError(null);
      
      if (profileUnsubscribe) {
        profileUnsubscribe();
        profileUnsubscribe = null;
      }

      try {
        if (firebaseUser) {
          setUser(firebaseUser);
          profileUnsubscribe = authService.subscribeToProfile(firebaseUser.uid, (userProfile) => {
            setProfile(userProfile);
            setLoading(false);
          });
        } else {
          setUser(null);
          setProfile(null);
          setLoading(false);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to handle auth change'));
        setLoading(false);
      }
    });

    return () => {
      authUnsubscribe();
      if (profileUnsubscribe) profileUnsubscribe();
    };
  }, []);

  return {
    user,
    profile,
    role: profile?.role || null,
    schoolId: profile?.schoolId || null,
    studentId: profile?.studentId || null,
    permissions: getPermissions(profile?.role),
    isAuthenticated: !!user,
    loading,
    error,
    logout: authService.logout
  };
}
