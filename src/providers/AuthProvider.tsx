'use client';

import { env } from '@/lib/env';
import { getSupabase } from '@/lib/supabase/client';
import type { Session, User } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!env.isConfigured) {
      setLoading(false);
      return;
    }

    const supabase = getSupabase();
    let mounted = true;
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!mounted) return;
      if (!userData.user) {
        setSession(null);
        setLoading(false);
        return;
      }
      const { data: sessionData } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(sessionData.session);
      setLoading(false);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      loading,
      signIn: async (email, password) => {
        const { error } = await getSupabase().auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
      },
      signUp: async (email, password, fullName) => {
        const { error } = await getSupabase().auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { full_name: fullName.trim() },
            emailRedirectTo: `${env.siteUrl}/auth/callback`,
          },
        });
        if (error) throw error;
      },
      requestPasswordReset: async (email) => {
        const { error } = await getSupabase().auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${env.siteUrl}/auth/reset-password`,
        });
        if (error) throw error;
      },
      updatePassword: async (password) => {
        const { error } = await getSupabase().auth.updateUser({ password });
        if (error) throw error;
      },
      signOut: async () => {
        const { error } = await getSupabase().auth.signOut();
        if (error) throw error;
      },
    }),
    [session, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
