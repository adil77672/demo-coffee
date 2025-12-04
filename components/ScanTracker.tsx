'use client'

import { useEffect } from 'react'
import { trackEvent } from '@/lib/analytics'
import { Shop } from '@/lib/types'

interface ScanTrackerProps {
  shop: Shop
}

export function ScanTracker({ shop }: ScanTrackerProps) {
  useEffect(() => {
    // Track scan on component mount
    trackEvent(shop.id, 'scan', {})
  }, [shop.id])

  return null
}

