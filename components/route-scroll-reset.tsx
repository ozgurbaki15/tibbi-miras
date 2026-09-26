'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function RouteScrollReset() {
  const pathname = usePathname()

  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'

    const reset = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    }

    reset()
    const frame = window.requestAnimationFrame(() => {
      reset()
      window.requestAnimationFrame(reset)
    })
    const timeout = window.setTimeout(reset, 100)

    return () => {
      window.cancelAnimationFrame(frame)
      window.clearTimeout(timeout)
    }
  }, [pathname])

  return null
}
