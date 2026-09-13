export type ShippingInfo = {
  fullName: string
  phone: string
  address: string
  city: string
  district: string
  postalCode: string
  tcNo: string
}

export const EMPTY_SHIPPING: ShippingInfo = {
  fullName: '',
  phone: '',
  address: '',
  city: '',
  district: '',
  postalCode: '',
  tcNo: '',
}

const STORAGE_KEY = 'tma-shipping'

export function loadShipping(): ShippingInfo {
  if (typeof window === 'undefined') return { ...EMPTY_SHIPPING }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...EMPTY_SHIPPING }
    const parsed = JSON.parse(raw) as Partial<ShippingInfo>
    return { ...EMPTY_SHIPPING, ...parsed }
  } catch {
    return { ...EMPTY_SHIPPING }
  }
}

export function saveShipping(info: ShippingInfo): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(info))
}

// All fields are required except tcNo.
export const REQUIRED_SHIPPING_FIELDS: (keyof ShippingInfo)[] = [
  'fullName',
  'phone',
  'address',
  'city',
  'district',
  'postalCode',
]

export function shippingErrors(info: ShippingInfo): Partial<Record<keyof ShippingInfo, boolean>> {
  const errors: Partial<Record<keyof ShippingInfo, boolean>> = {}
  for (const field of REQUIRED_SHIPPING_FIELDS) {
    if (!String(info[field] ?? '').trim()) errors[field] = true
  }
  return errors
}

export function isShippingComplete(info: ShippingInfo): boolean {
  return Object.keys(shippingErrors(info)).length === 0
}
