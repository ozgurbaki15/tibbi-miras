'use server'

import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { getProduct } from '@/lib/products'
import { PAYTR_IFRAME_BASE, PAYTR_TOKEN_URL, buildMerchantOid, buildPaytrToken, buildUserBasket, isTestMode, paytrCredentials } from '@/lib/paytr'

export type PaymentResult = { ok: true; iframeUrl: string } | { ok: false; error: string }

// Determines whether the signed-in user currently holds a lifetime Premium
// membership, which is the only state that qualifies for the discounted
// lifetime-Platin upgrade (difference-only price).
async function hasLifetimePremium(supabase: Awaited<ReturnType<typeof createClient>>, userId: string): Promise<boolean> {
  const { data } = await supabase.from('user_membership').select('*').limit(50)
  const rows = (data ?? []).filter((row) => String((row as Record<string, unknown>).user_id ?? '') === userId) as Record<string, unknown>[]
  return rows.some((row) => {
    const blob = JSON.stringify(row).toLowerCase()
    if (!blob.includes('premium') && !blob.includes('platin')) return false
    const raw = row.expires_at
    if (raw == null) return true
    const ms = typeof raw === 'number' ? raw : Date.parse(String(raw)) || Number(raw)
    return Number.isFinite(ms) && ms > 4102444800000 // beyond year 2100 => lifetime
  })
}

export async function createPaytrPayment(productId: string, articleId?: string): Promise<PaymentResult> {
  const product = getProduct(productId)
  if (!product) return { ok: false, error: 'invalid_product' }
  if (product.kind === 'single' && !articleId) return { ok: false, error: 'missing_article' }

  const creds = paytrCredentials()
  if (!creds) return { ok: false, error: 'not_configured' }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !user.email) return { ok: false, error: 'auth_required' }

  // Guard the discounted upgrade so only eligible members can pay the difference.
  if (product.id === 'platin-lifetime-upgrade' && !(await hasLifetimePremium(supabase, user.id))) {
    return { ok: false, error: 'upgrade_not_eligible' }
  }

  const requestHeaders = await headers()
  const origin = requestHeaders.get('origin') ?? `https://${requestHeaders.get('host') ?? 'localhost:3000'}`
  const userIp = (requestHeaders.get('x-forwarded-for') ?? '').split(',')[0].trim() || '127.0.0.1'

  const merchantOid = buildMerchantOid(product, user.id, articleId)
  const userBasket = buildUserBasket(product)
  const testMode = isTestMode() ? '1' : '0'
  const paymentAmount = product.amountKurus

  const paytrToken = buildPaytrToken({
    merchantId: creds.merchantId,
    merchantKey: creds.merchantKey,
    merchantSalt: creds.merchantSalt,
    userIp,
    merchantOid,
    email: user.email,
    paymentAmount,
    userBasket,
    noInstallment: '0',
    maxInstallment: '0',
    currency: 'TL',
    testMode,
  })

  const body = new URLSearchParams({
    merchant_id: creds.merchantId,
    user_ip: userIp,
    merchant_oid: merchantOid,
    email: user.email,
    payment_amount: String(paymentAmount),
    paytr_token: paytrToken,
    user_basket: userBasket,
    debug_on: '1',
    no_installment: '0',
    max_installment: '0',
    user_name: user.email.split('@')[0],
    user_address: 'Tibbi Miras',
    user_phone: '05000000000',
    merchant_ok_url: `${origin}/settings?payment=success`,
    merchant_fail_url: `${origin}/settings?payment=fail`,
    timeout_limit: '30',
    currency: 'TL',
    test_mode: testMode,
    lang: 'tr',
  })

  try {
    const response = await fetch(PAYTR_TOKEN_URL, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body })
    const result = (await response.json()) as { status: string; token?: string; reason?: string }
    if (result.status !== 'success' || !result.token) {
      console.log('[v0] paytr get-token failed', result.reason)
      return { ok: false, error: 'paytr_rejected' }
    }
    return { ok: true, iframeUrl: `${PAYTR_IFRAME_BASE}${result.token}` }
  } catch (error) {
    console.log('[v0] paytr get-token error', (error as Error).message)
    return { ok: false, error: 'network' }
  }
}
