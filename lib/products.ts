export type Product = { id: string; name: string; description: string; priceInCents: number; mode: 'payment' | 'subscription' }

export const PRODUCTS: Product[] = [
  { id: 'premium-monthly', name: 'Tıbbi Miras Premium', description: 'Premium historical medicine archive access.', priceInCents: 499, mode: 'subscription' },
  { id: 'platin-monthly', name: 'Tıbbi Miras Platin', description: 'Full archive and advanced reading access.', priceInCents: 999, mode: 'subscription' },
  { id: 'single-unlock', name: 'Tekil Eser Erişimi', description: 'Unlock one premium historical medicine article.', priceInCents: 199, mode: 'payment' },
]
