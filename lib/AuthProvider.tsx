'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

/* ---------- Context type ---------- */
type AuthCtxType = {
  user: User | null;
  loading: boolean;
};

/* ---------- Create context ---------- */
const AuthCtx = createContext<AuthCtxType>({
  user: null,
  loading: true
});

/* ---------- Hook for easy access ---------- */
export const useAuth = () => useContext(AuthCtx);

/* ---------- Provider component ---------- */
export default function AuthProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /* --- initial session + listener --- */
  useEffect(() => {
    /* 1. get current session once */
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    /* 2. listen for future auth changes */
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    /* cleanup on unmount */
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthCtx.Provider value={{ user, loading }}>
      {children}
    </AuthCtx.Provider>
  );
}
