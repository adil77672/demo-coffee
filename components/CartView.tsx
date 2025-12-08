'use client'

import { useState, useEffect } from 'react'
import { Shop, Coffee, Pastry, PairingRule } from '@/lib/types'
import { trackEvent } from '@/lib/analytics'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

interface CartViewProps {
  shop: Shop
  coffee: Coffee | null
  pastry: Pastry | null
  pairing: PairingRule | null
}

export function CartView({ shop, coffee, pastry, pairing }: CartViewProps) {
  const router = useRouter()
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const handleAddToCart = async () => {
    if (coffee && pastry && pairing) {
      await trackEvent(shop.id, 'add_to_cart', {
        coffeeId: coffee.id,
        pastryId: pastry.id,
        pairingRuleId: pairing.id,
      })
    }
  }

  const handleCheckout = async () => {
    if (!coffee || !pastry || !pairing) {
      return
    }
    
    setIsCheckingOut(true)
    await trackEvent(shop.id, 'checkout', {
      coffeeId: coffee.id,
      pastryId: pastry.id,
      pairingRuleId: pairing.id,
    })
    
    // Redirect to checkout page
    router.push(`/shop/${shop.slug}/checkout?coffee=${coffee.id}&pastry=${pastry.id}&pairing=${pairing.id}`)
  }

  // Track add to cart on mount if items are present
  useEffect(() => {
    if (coffee && pastry && pairing) {
      handleAddToCart()
    }
  }, [coffee, pastry, pairing])

  if (!coffee) {
    return (
      <div className="min-h-screen -m-4 p-4" style={{ backgroundColor: '#FAF7F2' }}>
        <div className="container mx-auto">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-sm border border-amber-100 p-8 text-center max-w-md mx-auto">
            <p className="text-gray-600 mb-4">No items in cart.</p>
            <Link
              href={`/shop/${shop.slug}`}
              className="text-amber-700 hover:text-amber-900 font-medium"
            >
              Browse coffees
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const coffeePrice = coffee.price || 0
  const pastryPrice = pastry?.price || 0
  const total = coffeePrice + pastryPrice

  return (
    <div className="w-full">
      <Link
        href={`/shop/${shop.slug}/coffee/${coffee.id}`}
        className="text-amber-700 hover:text-amber-900 mb-4 md:mb-6 inline-block font-medium transition-colors"
      >
        ← Back to pairings
      </Link>

      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-sm border border-amber-100 p-6 md:p-8 max-w-2xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">Your Cart</h1>

        <div className="space-y-4 md:space-y-6 mb-6">
          {/* Coffee Item */}
          <div className="flex gap-3 md:gap-4 pb-4 md:pb-6 border-b border-gray-200">
            {coffee.image && (
              <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={coffee.image}
                  alt={coffee.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1">{coffee.name}</h3>
              {coffee.roast && (
                <p className="text-xs md:text-sm text-gray-600 mb-1">{coffee.roast}</p>
              )}
              {coffee.origin && (
                <p className="text-xs md:text-sm text-gray-600 mb-2">{coffee.origin}</p>
              )}
              {coffee.price && (
                <p className="text-base md:text-lg font-bold text-gray-900 mt-2">
                  ${coffee.price.toFixed(2)}
                </p>
              )}
            </div>
          </div>

          {/* Pastry Item */}
          {pastry && (
            <div className="flex gap-3 md:gap-4 pb-4 md:pb-6 border-b border-gray-200">
              {pastry.image && (
                <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={pastry.image}
                    alt={pastry.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1">{pastry.name}</h3>
                {pairing && (
                  <div className="mb-2">
                    <span className="inline-block px-2 py-1 bg-amber-100 text-amber-800 text-xs md:text-sm font-medium rounded-md mb-1">
                      Perfect Pairing
                    </span>
                    <p className="text-xs md:text-sm text-amber-700 font-medium">
                      {pairing.match_score}% match score
                    </p>
                    {pairing.reasoning && (
                      <p className="text-xs text-gray-600 mt-1 italic line-clamp-2">
                        {pairing.reasoning}
                      </p>
                    )}
                  </div>
                )}
                {pastry.price && (
                  <p className="text-base md:text-lg font-bold text-gray-900 mt-2">
                    ${pastry.price.toFixed(2)}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Total */}
        <div className="border-t border-gray-200 pt-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-lg md:text-xl font-semibold text-gray-900">Total</span>
            <span className="text-xl md:text-2xl font-bold text-gray-900">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Checkout Button */}
        <button
          onClick={handleCheckout}
          disabled={isCheckingOut}
          className="w-full bg-amber-800 hover:bg-amber-900 disabled:bg-amber-400 disabled:cursor-not-allowed text-white font-semibold py-3 md:py-4 px-6 rounded-lg transition-all duration-200 text-sm md:text-base"
        >
          {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
        </button>

        <p className="text-xs text-gray-500 text-center mt-4">
          This is a simulated checkout. No payment will be processed.
        </p>
      </div>
    </div>
  )
}
