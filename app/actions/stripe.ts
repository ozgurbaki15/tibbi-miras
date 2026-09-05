'use server'

import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { PRODUCTS } from '@/lib/products'

export async function createCheckoutSession(productId: string) {
  const product = PRODUCTS.find((item) => item.id === productId)
  if (!product) throw new Error('Product not found')
  const origin = (await headers()).get('origin') ?? 'http://localhost:3000'
  const session = await stripe.checkout.sessions.create({
    ui_mode: 'hosted_page',
    mode: product.mode,
    line_items: [{ price_data: { currency: 'usd', product_data: { name: product.name, description: product.description }, unit_amount: product.priceInCents, recurring: product.mode === 'subscription' ? { interval: 'month' } : undefined }, quantity: 1 }],
    success_url: `${origin}/settings?checkout=success`,
    cancel_url: `${origin}/settings?checkout=cancelled`,
    integration_identifier: `tibbi-miras-${Math.random().toString(36).slice(2, 10)}`,
  })
  return session.url
}
