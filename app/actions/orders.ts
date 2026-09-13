'use server'

import { createClient } from '@/lib/supabase/server'

const SHIPPING_FEE_KURUS = 25000
const FREE_SHIPPING_THRESHOLD_KURUS = 300000

type CartLine = { id: string; quantity: number }
type ShippingAddress = { fullName: string; phone: string; address: string; city: string; district: string; postalCode: string; tcNo?: string }

export async function createShopOrder(lines: CartLine[], address: ShippingAddress) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false as const, error: 'auth_required' }
  if (!address.fullName || !address.phone || !address.address || !address.city || !address.district || !address.postalCode) return { ok: false as const, error: 'address_required' }
  const normalized = lines.map((line) => ({ id: String(line.id), quantity: Math.floor(Number(line.quantity)) })).filter((line) => line.quantity > 0 && line.quantity <= 9999)
  if (!normalized.length) return { ok: false as const, error: 'empty_cart' }
  const ids = [...new Set(normalized.map((line) => line.id))]
  const { data: products, error: productsError } = await supabase.from('shop_products').select('id, name, price_kurus, max_quantity, in_stock').in('id', ids)
  if (productsError) return { ok: false as const, error: 'products_unavailable' }
  const productMap = new Map((products ?? []).map((product) => [String(product.id), product]))
  const validated = normalized.map((line) => {
    const product = productMap.get(line.id)
    if (!product || !product.in_stock || line.quantity > Number(product.max_quantity)) return null
    return { product_id: line.id, product_name: String(product.name), unit_price_kurus: Number(product.price_kurus), quantity: line.quantity }
  })
  if (validated.some((line) => !line)) return { ok: false as const, error: 'stock_limit' }
  const items = validated as { product_id: string; product_name: string; unit_price_kurus: number; quantity: number }[]
  const subtotal = items.reduce((sum, item) => sum + item.unit_price_kurus * item.quantity, 0)
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD_KURUS ? 0 : SHIPPING_FEE_KURUS
  const { data: numberData, error: numberError } = await supabase.rpc('tma_next_order_number')
  if (numberError || !numberData) return { ok: false as const, error: 'order_number_failed' }
  const { data: order, error: orderError } = await supabase.from('tma_orders').insert({ order_number: String(numberData), user_id: user.id, subtotal_kurus: subtotal, shipping_kurus: shipping, total_kurus: subtotal + shipping, phone_snapshot: address.phone, address_snapshot: address, current_phone: address.phone, current_address: address }).select('id, order_number').single()
  if (orderError || !order) return { ok: false as const, error: 'order_create_failed' }
  const { error: itemsError } = await supabase.from('tma_order_items').insert(items.map((item) => ({ ...item, order_id: order.id })))
  if (itemsError) return { ok: false as const, error: 'order_items_failed' }
  return { ok: true as const, orderId: order.id, orderNumber: order.order_number, totalKurus: subtotal + shipping }
}

export async function updateOrderContact(orderId: string, address: ShippingAddress) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false as const, error: 'auth_required' }
  if (!address.fullName || !address.phone || !address.address || !address.city || !address.district || !address.postalCode) return { ok: false as const, error: 'address_required' }
  const { error } = await supabase.from('tma_orders').update({ current_phone: address.phone, current_address: address, phone_warning: false, address_warning: false }).eq('id', orderId).eq('user_id', user.id)
  return error ? { ok: false as const, error: 'update_failed' } : { ok: true as const }
}
