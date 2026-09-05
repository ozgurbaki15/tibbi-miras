'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from '@/components/auth-provider'
import { isSupabaseConfigured, supabase } from '@/lib/supabase/client'

type Entitlements = { premium: boolean; platin: boolean; loading: boolean }
const EntitlementsContext = createContext<Entitlements>({ premium: false, platin: false, loading: true })

function rowBelongsToUser(row: Record<string, unknown>, userId: string) {
  return ['user_id', 'profile_id', 'id'].some((key) => String(row[key] ?? '') === userId)
}

function rowIsActive(row: Record<string, unknown>) {
  const values = ['status', 'membership', 'plan', 'tier', 'type', 'level', 'product'].map((key) => String(row[key] ?? '').toLowerCase())
  return !values.some((value) => ['expired', 'cancelled', 'canceled', 'inactive', 'false'].includes(value))
}

export function EntitlementsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [entitlements, setEntitlements] = useState<Entitlements>({ premium: false, platin: false, loading: true })

  useEffect(() => {
    let active = true
    if (!user || !isSupabaseConfigured) {
      setEntitlements({ premium: false, platin: false, loading: false })
      return () => { active = false }
    }

    Promise.all(['user_membership', 'user_premium_unlocks', 'user_ottoman_unlocks', 'user_unlocks'].map(async (table) => {
      const { data, error } = await supabase.from(table).select('*').limit(100)
      if (error) console.log('[v0] entitlement fetch error', table, error.message)
      return { table, rows: (data ?? []).filter((row) => rowBelongsToUser(row as Record<string, unknown>, user.id) && rowIsActive(row as Record<string, unknown>)) as Record<string, unknown>[] }
    })).then((results) => {
      if (!active) return
      const membership = results.find((result) => result.table === 'user_membership')?.rows ?? []
      const premium = membership.some((row) => JSON.stringify(row).toLowerCase().includes('premium')) || results.some((result) => result.table === 'user_premium_unlocks' && result.rows.length > 0) || results.some((result) => result.table === 'user_unlocks' && result.rows.length > 0)
      const platin = membership.some((row) => JSON.stringify(row).toLowerCase().includes('platin')) || results.some((result) => result.table === 'user_ottoman_unlocks' && result.rows.length > 0)
      setEntitlements({ premium, platin, loading: false })
    })

    return () => { active = false }
  }, [user])

  return <EntitlementsContext.Provider value={entitlements}>{children}</EntitlementsContext.Provider>
}

export const useEntitlements = () => useContext(EntitlementsContext)
