'use client'

import { AlertTriangle } from 'lucide-react'
import type { ShippingInfo } from '@/lib/shipping'

type FieldKey = keyof ShippingInfo

export function ShippingFields({
  value,
  onChange,
  errors,
  lang,
}: {
  value: ShippingInfo
  onChange: (next: ShippingInfo) => void
  errors: Partial<Record<FieldKey, boolean>>
  lang: 'tr' | 'en'
}) {
  const tr = lang === 'tr'

  const labels: Record<FieldKey, string> = tr
    ? {
        fullName: 'Ad Soyad',
        phone: 'Telefon Numarası',
        address: 'Açık Adres',
        city: 'Şehir',
        district: 'Semt / İlçe',
        postalCode: 'Posta Kodu',
        tcNo: 'T.C. Kimlik No (isteğe bağlı)',
      }
    : {
        fullName: 'Full Name',
        phone: 'Phone Number',
        address: 'Address',
        city: 'City',
        district: 'District',
        postalCode: 'Postal Code',
        tcNo: 'National ID (optional)',
      }

  const set = (key: FieldKey) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    onChange({ ...value, [key]: e.target.value })

  const requiredMark = <span className="text-destructive"> *</span>
  const errorText = tr ? 'Bu alan zorunludur.' : 'This field is required.'

  const inputClass = (key: FieldKey) =>
    `w-full rounded-md border bg-background px-3 py-2 font-sans text-sm text-foreground outline-none transition-colors focus:border-primary ${
      errors[key] ? 'border-destructive' : 'border-border'
    }`

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-2.5 rounded-md border border-primary/40 bg-primary/5 p-3">
        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
        <p className="font-sans text-xs leading-relaxed text-foreground">
          {tr
            ? 'Ad soyad, gönderim adresi ve telefon numarası aynı kişiye ait olmalıdır. Ad soyad yanlış girilmişse kargo firmasında gönderim sırasında sorun yaşanabilir; bu durumda sorumluluk tarafımıza ait değildir.'
            : 'The full name, delivery address and phone number must belong to the same person. If the name is entered incorrectly, shipping problems may occur at the courier; in that case we are not responsible.'}
        </p>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="font-sans text-xs uppercase tracking-wider text-muted-foreground">{labels.fullName}{requiredMark}</span>
        <input type="text" value={value.fullName} onChange={set('fullName')} autoComplete="name" className={inputClass('fullName')} />
        {errors.fullName ? <span className="font-sans text-xs text-destructive">{errorText}</span> : null}
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="font-sans text-xs uppercase tracking-wider text-muted-foreground">{labels.phone}{requiredMark}</span>
        <input type="tel" value={value.phone} onChange={set('phone')} autoComplete="tel" inputMode="tel" className={inputClass('phone')} />
        {errors.phone ? <span className="font-sans text-xs text-destructive">{errorText}</span> : null}
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="font-sans text-xs uppercase tracking-wider text-muted-foreground">{labels.address}{requiredMark}</span>
        <textarea value={value.address} onChange={set('address')} autoComplete="street-address" rows={3} className={inputClass('address')} />
        {errors.address ? <span className="font-sans text-xs text-destructive">{errorText}</span> : null}
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="font-sans text-xs uppercase tracking-wider text-muted-foreground">{labels.city}{requiredMark}</span>
          <input type="text" value={value.city} onChange={set('city')} autoComplete="address-level1" className={inputClass('city')} />
          {errors.city ? <span className="font-sans text-xs text-destructive">{errorText}</span> : null}
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="font-sans text-xs uppercase tracking-wider text-muted-foreground">{labels.district}{requiredMark}</span>
          <input type="text" value={value.district} onChange={set('district')} autoComplete="address-level2" className={inputClass('district')} />
          {errors.district ? <span className="font-sans text-xs text-destructive">{errorText}</span> : null}
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="font-sans text-xs uppercase tracking-wider text-muted-foreground">{labels.postalCode}{requiredMark}</span>
          <input type="text" value={value.postalCode} onChange={set('postalCode')} autoComplete="postal-code" inputMode="numeric" className={inputClass('postalCode')} />
          {errors.postalCode ? <span className="font-sans text-xs text-destructive">{errorText}</span> : null}
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="font-sans text-xs uppercase tracking-wider text-muted-foreground">{labels.tcNo}</span>
          <input type="text" value={value.tcNo} onChange={set('tcNo')} inputMode="numeric" maxLength={11} className={inputClass('tcNo')} />
        </label>
      </div>
    </div>
  )
}
