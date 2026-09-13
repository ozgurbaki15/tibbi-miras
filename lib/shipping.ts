export type ShippingInfo = {
  fullName: string
  phone: string
  address: string
  city: string
  district: string
  postalCode: string
  tcNo: string
}

export type ShippingAddress = ShippingInfo & {
  id: string
  label: string
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

const LEGACY_KEY = 'tma-shipping'
const ADDRESSES_KEY = 'tma-shipping-addresses'
const SELECTED_KEY = 'tma-shipping-selected'

function makeId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `addr-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function newAddress(label = ''): ShippingAddress {
  return { ...EMPTY_SHIPPING, id: makeId(), label }
}

// Reads all saved addresses, migrating a legacy single-address entry the first time.
export function loadAddresses(): ShippingAddress[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(ADDRESSES_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as ShippingAddress[]
      if (Array.isArray(parsed)) return parsed.map((a) => ({ ...EMPTY_SHIPPING, ...a }))
    }
    // Migrate the previous single-address format into a labelled entry.
    const legacy = window.localStorage.getItem(LEGACY_KEY)
    if (legacy) {
      const parsed = JSON.parse(legacy) as Partial<ShippingInfo>
      if (parsed && parsed.fullName) {
        const migrated: ShippingAddress[] = [{ ...EMPTY_SHIPPING, ...parsed, id: makeId(), label: 'Adresim' }]
        saveAddresses(migrated)
        return migrated
      }
    }
  } catch {
    // fall through to empty
  }
  return []
}

export function saveAddresses(list: ShippingAddress[]): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(ADDRESSES_KEY, JSON.stringify(list))
}

export function getSelectedAddressId(): string | null {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(SELECTED_KEY)
}

export function setSelectedAddressId(id: string): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(SELECTED_KEY, id)
}

// All fields are required except tcNo and the address label.
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
