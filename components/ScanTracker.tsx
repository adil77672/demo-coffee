'use client'

import { useEffect, useRef } from 'react'
import { trackEvent } from '@/lib/analytics'
import { Shop } from '@/lib/types'

interface ScanTrackerProps {
  shop: Shop
}

export function ScanTracker({ shop }: ScanTrackerProps) {
  const hasTracked = useRef(false)

  useEffect(() => {
    // Only track once per component mount
    // Note: QR code page already tracks the scan, so this is a backup
    // We'll skip this to avoid duplicate tracking
    if (!hasTracked.current) {
      hasTracked.current = true
      // Only track if we didn't come from QR code (check URL)
      const cameFromQR = typeof window !== 'undefined' && 
        (document.referrer.includes('/qr/') || sessionStorage.getItem('qr_scan_tracked'))
      
      if (!cameFromQR) {
        trackEvent(shop.id, 'scan', {}).catch(err => {
          console.error('Failed to track scan:', err)
        })
      } else {
        // Mark that QR scan was already tracked
        sessionStorage.removeItem('qr_scan_tracked')
      }
    }
  }, [shop.id])

  return null
}

