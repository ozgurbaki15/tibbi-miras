import { createAdminClient } from '@/lib/supabase/admin'
import { decodeMerchantOid, paytrCredentials, verifyCallbackHash } from '@/lib/paytr'
import { LIFETIME_EXPIRES_AT, OTTOMAN_LIFETIME_MS } from '@/lib/products'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// PayTR posts payment results server-to-server. We verify the signature, then
// record the membership/unlock with the service-role client. Responding "OK"
// stops PayTR from retrying.
export async function POST(request: Request) {
  const creds = paytrCredentials()
  if (!creds) return new Response('not configured', { status: 500 })

  const form = await request.formData()
  const merchantOid = String(form.get('merchant_oid') ?? '')
  const status = String(form.get('status') ?? '')
  const totalAmount = String(form.get('total_amount') ?? '')
  const hash = String(form.get('hash') ?? '')

  if (!verifyCallbackHash({ merchantKey: creds.merchantKey, merchantSalt: creds.merchantSalt, merchantOid, status, totalAmount, hash })) {
    console.log('[v0] paytr callback bad hash', merchantOid)
    return new Response('bad hash', { status: 400 })
  }

  if (status !== 'success') {
    console.log('[v0] paytr callback not successful', merchantOid, status)
    return new Response('OK')
  }

  const decoded = decodeMerchantOid(merchantOid)
  if (!decoded) {
    console.log('[v0] paytr callback undecodable oid', merchantOid)
    return new Response('OK')
  }

  // Guard against amount tampering: PayTR reports the charged amount in kuruş.
  if (Number(totalAmount) !== decoded.product.amountKurus) {
    console.log('[v0] paytr callback amount mismatch', merchantOid, totalAmount, decoded.product.amountKurus)
    return new Response('OK')
  }

  const admin = createAdminClient()
  if (!admin) return new Response('not configured', { status: 500 })

  const { product, userId, articleId } = decoded

  try {
    if (product.kind === 'single') {
      if (!articleId) return new Response('OK')
      await admin.from('user_ottoman_unlocks').upsert(
        { user_id: userId, article_id: Number(articleId), expires_at: OTTOMAN_LIFETIME_MS },
        { onConflict: 'user_id,article_id' },
      )
      return new Response('OK')
    }

    const { data: existingRows } = await admin.from('user_membership').select('*').eq('user_id', userId).limit(1)
    const existing = (existingRows ?? [])[0] as Record<string, unknown> | undefined

    let expiresAt: string
    if (product.durationDays == null) {
      expiresAt = LIFETIME_EXPIRES_AT
    } else {
      const existingMs = existing ? Date.parse(String(existing.expires_at)) : NaN
      const sameTier = existing && String(existing.type ?? '').toLowerCase().includes(product.tier)
      const base = sameTier && Number.isFinite(existingMs) && existingMs > Date.now() ? existingMs : Date.now()
      expiresAt = new Date(base + product.durationDays * 86400000).toISOString()
    }

    const row = { user_id: userId, type: product.tier, expires_at: expiresAt }
    if (existing) await admin.from('user_membership').update(row).eq('user_id', userId)
    else await admin.from('user_membership').insert(row)

    return new Response('OK')
  } catch (error) {
    console.log('[v0] paytr callback grant error', (error as Error).message)
    return new Response('OK')
  }
}
