'use client'

import { useEffect } from 'react'
import { trackEvent } from '@/lib/analytics'

interface CoffeeSelectionTrackerProps {
  shopId: string
  coffeeId: string
}

export function CoffeeSelectionTracker({ shopId, coffeeId }: CoffeeSelectionTrackerProps) {
  useEffect(() => {
    // Track coffee selection when page loads
    trackEvent(shopId, 'coffee_select', { coffeeId })
  }, [shopId, coffeeId])

  return null
}

