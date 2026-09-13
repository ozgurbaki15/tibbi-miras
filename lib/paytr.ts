import 'server-only'
import crypto from 'crypto'
import { getProduct, getProductByCode, type Product } from '@/lib/products'

export const PAYTR_TOKEN_URL = 'https://www.paytr.com/odeme/api/get-token'
export const PAYTR_IFRAME_BASE = 'https://www.paytr.com/odeme/guvenli/'

export function paytrCredentials() {
  const merchantId = process.env.PAYTR_MERCHANT_ID
  const merchantKey = process.env.PAYTR_MERCHANT_KEY
  const merchantSalt = process.env.PAYTR_MERCHANT_SALT
  if (!merchantId || !merchantKey || !merchantSalt) return null
  return { merchantId, merchantKey, merchantSalt }
}

export function isTestMode() {
  // Defaults to test mode until PAYTR_TEST_MODE is explicitly set to "0".
  return process.env.PAYTR_TEST_MODE !== '0'
}

function randomAlnum(length: number) {
  return crypto.randomBytes(length).toString('hex').replace(/[^a-z0-9]/gi, '').slice(0, length) || 'x'
}

// merchant_oid must be unique and alphanumeric only. We encode the product code
// and the buyer's user id (uuid hex) so the verified callback can resolve the
// grant statelessly. Single-article unlocks also carry the numeric article id.
export function buildMerchantOid(product: Product, userId: string, articleId?: string): string {
  const userHex = userId.replace(/-/g, '')
  let oid = `TM${product.code}${userHex}`
  if (product.kind === 'single') oid += `${String(articleId ?? '').replace(/\D/g, '')}Z`
  oid += `T${Date.now().toString(36)}${randomAlnum(4)}`
  return oid.replace(/[^A-Za-z0-9]/g, '')
}

export type DecodedOid = { product: Product; userId: string; articleId: string | null } | null

export function decodeMerchantOid(oid: string): DecodedOid {
  if (!oid.startsWith('TM') || oid.length < 36) return null
  const code = oid.slice(2, 4)
  const product = getProductByCode(code)
  if (!product) return null
  const userHex = oid.slice(4, 36)
  if (!/^[0-9a-f]{32}$/i.test(userHex)) return null
  const userId = `${userHex.slice(0, 8)}-${userHex.slice(8, 12)}-${userHex.slice(12, 16)}-${userHex.slice(16, 20)}-${userHex.slice(20)}`
  let articleId: string | null = null
  if (product.kind === 'single') {
    const rest = oid.slice(36)
    const digits = rest.match(/^\d+/)
    articleId = digits ? digits[0] : null
  }
  return { product, userId, articleId }
}

// PayTR get-token signature.
export function buildPaytrToken(params: {
  merchantId: string
  merchantKey: string
  merchantSalt: string
  userIp: string
  merchantOid: string
  email: string
  paymentAmount: number
  userBasket: string
  noInstallment: string
  maxInstallment: string
  currency: string
  testMode: string
}): string {
  const hashStr = params.merchantId + params.userIp + params.merchantOid + params.email + params.paymentAmount + params.userBasket + params.noInstallment + params.maxInstallment + params.currency + params.testMode
  return crypto.createHmac('sha256', params.merchantKey).update(hashStr + params.merchantSalt).digest('base64')
}

// PayTR callback signature.
export function verifyCallbackHash(params: { merchantKey: string; merchantSalt: string; merchantOid: string; status: string; totalAmount: string; hash: string }): boolean {
  const hashStr = params.merchantOid + params.merchantSalt + params.status + params.totalAmount
  const token = crypto.createHmac('sha256', params.merchantKey).update(hashStr).digest('base64')
  try {
    return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(params.hash))
  } catch {
    return false
  }
}

export function buildUserBasket(product: Product): string {
  const json = JSON.stringify([[product.name, (product.amountKurus / 100).toFixed(2), 1]])
  return Buffer.from(json).toString('base64')
}

export { getProduct }
