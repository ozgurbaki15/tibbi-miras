'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/components/auth-provider'
import { isSupabaseConfigured, supabase } from '@/lib/supabase/client'

type Entitlements = {
  premium: boolean
  platin: boolean
  loading: boolean
  membershipType: string | null
  membershipExpiresAt: number | null
  originalUnlocks: Record<string, number>
  hasOriginalAccess: (articleId: string | number) => boolean
}

const EntitlementsContext = createContext<Entitlements>({
  premium: false,
  platin: false,
  loading: true,
  membershipType: null,
  membershipExpiresAt: null,
  originalUnlocks: {},
  hasOriginalAccess: () => false,
})

// user_membership.expires_at may arrive as an ISO date string or epoch ms.
function parseExpiry(value: unknown): number | null {
  if (value == null) return null
  if (typeof value === 'number' && Number.isFinite(value)) return value
  const asNumber = Number(value)
  if (Number.isFinite(asNumber) && String(value).trim() !== '') return asNumber
  const parsed = Date.parse(String(value))
  return Number.isFinite(parsed) ? parsed : null
}

function rowBelongsToUser(row: Record<string, unknown>, userId: string) {
  return ['user_id', 'profile_id', 'id'].some((key) => String(row[key] ?? '') === userId)
}

function rowIsActive(row: Record<string, unknown>) {
  const values = ['status', 'membership', 'plan', 'tier', 'type', 'level', 'product'].map((key) => String(row[key] ?? '').toLowerCase())
  return !values.some((value) => ['expired', 'cancelled', 'canceled', 'inactive', 'false'].includes(value))
}

export function EntitlementsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [state, setState] = useState<{ premium: boolean; platin: boolean; loading: boolean; membershipType: string | null; membershipExpiresAt: number | null; originalUnlocks: Record<string, number> }>({ premium: false, platin: false, loading: true, membershipType: null, membershipExpiresAt: null, originalUnlocks: {} })

  useEffect(() => {
    let active = true
    if (!user || !isSupabaseConfigured) {
      setState({ premium: false, platin: false, loading: false, membershipType: null, membershipExpiresAt: null, originalUnlocks: {} })
      return () => { active = false }
    }

    Promise.all(['user_membership', 'user_premium_unlocks', 'user_ottoman_unlocks', 'user_unlocks'].map(async (table) => {
      const { data, error } = await supabase.from(table).select('*').limit(500)
      if (error) console.log('[v0] entitlement fetch error', table, error.message)
      return { table, rows: (data ?? []).filter((row) => rowBelongsToUser(row as Record<string, unknown>, user.id)) as Record<string, unknown>[] }
    })).then((results) => {
      if (!active) return
      const rowsOf = (table: string) => results.find((result) => result.table === table)?.rows ?? []
      const membership = rowsOf('user_membership').filter(rowIsActive)
      const premium = membership.some((row) => JSON.stringify(row).toLowerCase().includes('premium'))
        || membership.some((row) => JSON.stringify(row).toLowerCase().includes('platin'))
        || rowsOf('user_premium_unlocks').filter(rowIsActive).length > 0
        || rowsOf('user_unlocks').filter(rowIsActive).length > 0
      const platin = membership.some((row) => JSON.stringify(row).toLowerCase().includes('platin'))

      // Capture the active membership row so Settings can show type + expiry.
      const membershipRow = membership.find((row) => JSON.stringify(row).toLowerCase().includes('platin'))
        ?? membership.find((row) => JSON.stringify(row).toLowerCase().includes('premium'))
        ?? membership[0]
      const membershipType = membershipRow ? String(membershipRow.type ?? (platin ? 'platin' : premium ? 'premium' : '')) || null : null
      const membershipExpiresAt = membershipRow ? parseExpiry(membershipRow.expires_at) : null

      // user_ottoman_unlocks holds per-article original-text unlocks synced from
      // the mobile app: expires_at is epoch-ms (Long.MAX_VALUE = lifetime purchase,
      // otherwise a 24h ad unlock).
      const originalUnlocks: Record<string, number> = {}
      rowsOf('user_ottoman_unlocks').forEach((row) => {
        const articleId = String(row.article_id ?? '')
        const expiresAt = Number(row.expires_at ?? 0)
        if (!articleId || !Number.isFinite(expiresAt)) return
        originalUnlocks[articleId] = Math.max(originalUnlocks[articleId] ?? 0, expiresAt)
      })

      setState({ premium, platin, loading: false, membershipType, membershipExpiresAt, originalUnlocks })
    })

    return () => { active = false }
  }, [user])

  const value = useMemo<Entitlements>(() => ({
    premium: state.premium,
    platin: state.platin,
    loading: state.loading,
    membershipType: state.membershipType,
    membershipExpiresAt: state.membershipExpiresAt,
    originalUnlocks: state.originalUnlocks,
    hasOriginalAccess: (articleId: string | number) => {
      if (state.premium || state.platin) return true
      const expiry = state.originalUnlocks[String(articleId)]
      if (expiry == null) return false
      return Date.now() < expiry
    },
  }), [state])

  return <EntitlementsContext.Provider value={value}>{children}</EntitlementsContext.Provider>
}

export const useEntitlements = () => useContext(EntitlementsContext)
