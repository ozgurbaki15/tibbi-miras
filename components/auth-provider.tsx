'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client'

type AuthContextValue = { user: User | null; session: Session | null; loading: boolean; signOut: () => Promise<void> }
const AuthContext = createContext<AuthContextValue>({ user: null, session: null, loading: true, signOut: async () => {} })

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    if (!isSupabaseConfigured) { setLoading(false); return }
    let active = true
    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return
      if (error) console.error('[v0] Supabase session error:', error.message)
      setSession(data.session)
      setLoading(false)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (active) {
        setSession(nextSession)
        setLoading(false)
      }
    })
    return () => { active = false; listener.subscription.unsubscribe() }
  }, [])
  const value = useMemo(() => ({ user: session?.user ?? null, session, loading, signOut: async () => { await supabase.auth.signOut() } }), [session, loading])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
