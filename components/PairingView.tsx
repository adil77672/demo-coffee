'use client'

import { useState, useEffect } from 'react'
import { Shop, Coffee, PairingWithDetails } from '@/lib/types'
import { trackEvent } from '@/lib/analytics'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

interface PairingViewProps {
  shop: Shop
  coffee: Coffee
  pairings: PairingWithDetails[]
}

export function PairingView({ shop, coffee, pairings }: PairingViewProps) {
  const router = useRouter()
  const [viewedPairings, setViewedPairings] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Track pairing views
    pairings.forEach((pairing) => {
      if (!viewedPairings.has(pairing.id)) {
        trackEvent(shop.id, 'pairing_view', {
          coffeeId: coffee.id,
          pastryId: pairing.pastry_id,
          pairingRuleId: pairing.id,
        })
        setViewedPairings((prev) => new Set(prev).add(pairing.id))
      }
    })
  }, [pairings, shop.id, coffee.id, viewedPairings])

  const handleAcceptPairing = async (pairing: PairingWithDetails) => {
    setIsLoading(true)
    try {
      await trackEvent(shop.id, 'pairing_accept', {
        coffeeId: coffee.id,
        pastryId: pairing.pastry_id,
        pairingRuleId: pairing.id,
      })
      router.push(`/shop/${shop.slug}/cart?coffee=${coffee.id}&pastry=${pairing.pastry_id}&pairing=${pairing.id}`)
    } catch (error) {
      console.error('Error accepting pairing:', error)
      setIsLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'bg-green-500'
    if (score >= 75) return 'bg-amber-500'
    if (score >= 60) return 'bg-yellow-500'
    return 'bg-gray-400'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent Match'
    if (score >= 75) return 'Great Match'
    if (score >= 60) return 'Good Match'
    return 'Fair Match'
  }

  return (
    <div className="w-full">
      <Link
        href={`/shop/${shop.slug}`}
        className="text-amber-700 hover:text-amber-900 mb-4 md:mb-6 inline-block font-medium transition-colors"
      >
        ← Back to coffees
      </Link>

      {/* Coffee Info Card */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-sm border border-amber-100 p-6 md:p-8 mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row gap-6">
          {coffee.image && (
            <div className="relative w-full md:w-64 h-48 md:h-64 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={coffee.image}
                alt={coffee.name}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{coffee.name}</h1>
            <div className="space-y-2 mb-4">
              {coffee.roast && (
                <p className="text-sm md:text-base text-gray-600">
                  <span className="font-semibold text-gray-700">Roast:</span> <span className="font-medium">{coffee.roast}</span>
                </p>
              )}
              {coffee.origin && (
                <p className="text-sm md:text-base text-gray-600">
                  <span className="font-semibold text-gray-700">Origin:</span> <span className="font-medium">{coffee.origin}</span>
                </p>
              )}
            </div>
            {coffee.tasting_notes && coffee.tasting_notes.length > 0 && (
              <div className="flex flex-wrap gap-2 my-3">
                {coffee.tasting_notes.map((note, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-amber-100 text-amber-800 text-xs md:text-sm rounded-full font-medium"
                  >
                    {note}
                  </span>
                ))}
              </div>
            )}
            {coffee.description && (
              <p className="text-sm md:text-base text-gray-700 mt-4 leading-relaxed">{coffee.description}</p>
            )}
            {coffee.price && (
              <p className="text-xl md:text-2xl font-bold text-gray-900 mt-4">${coffee.price.toFixed(2)}</p>
            )}
          </div>
        </div>
      </div>

      {/* Pairings Section */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Recommended Pairings</h2>
        {pairings.length === 0 ? (
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-amber-100 p-8 text-center">
            <p className="text-gray-600">No pairings available for this coffee.</p>
            <Link
              href={`/shop/${shop.slug}`}
              className="text-amber-700 hover:text-amber-900 mt-4 inline-block font-medium"
            >
              Browse other coffees
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {pairings.map((pairing) => (
              <div
                key={pairing.id}
                className="bg-white/95 backdrop-blur-sm rounded-xl shadow-sm border border-amber-100 hover:shadow-lg hover:border-amber-300 transition-all duration-200 p-5 md:p-6 flex flex-col"
              >
                {pairing.pastry.image && (
                  <div className="relative w-full h-40 md:h-48 mb-4 rounded-lg overflow-hidden">
                    <Image
                      src={pairing.pastry.image}
                      alt={pairing.pastry.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">
                  {pairing.pastry.name}
                </h3>
                
                {/* Enhanced Match Score Display */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs md:text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      {getScoreLabel(pairing.match_score)}
                    </span>
                    <span className="text-sm md:text-base font-bold text-amber-600">
                      {pairing.match_score}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 md:h-2.5 overflow-hidden">
                    <div
                      className={`${getScoreColor(pairing.match_score)} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${pairing.match_score}%` }}
                    />
                  </div>
                </div>

                {/* Enhanced Reasoning Display */}
                {pairing.reasoning && (
                  <div className="mb-4 flex-1">
                    <div className="bg-amber-50 border-l-4 border-amber-500 p-3 md:p-4 rounded-r-lg">
                      <p className="text-xs md:text-sm font-semibold text-amber-900 mb-1.5">
                        Why this pairing works:
                      </p>
                      <p className="text-xs md:text-sm text-amber-800 leading-relaxed">
                        {pairing.reasoning}
                      </p>
                    </div>
                  </div>
                )}

                {/* Pastry Flavor Profile */}
                {pairing.pastry.flavor_profile && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 italic leading-relaxed">
                      <span className="font-medium text-gray-600">Flavor notes:</span> {pairing.pastry.flavor_profile}
                    </p>
                  </div>
                )}

                {/* Price */}
                {pairing.pastry.price && (
                  <p className="text-lg md:text-xl font-bold text-gray-900 mb-4">
                    ${pairing.pastry.price.toFixed(2)}
                  </p>
                )}

                {/* Add to Cart Button */}
                <button
                  onClick={() => handleAcceptPairing(pairing)}
                  disabled={isLoading}
                  className="w-full bg-amber-800 hover:bg-amber-900 disabled:bg-amber-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 mt-auto"
                >
                  {isLoading ? 'Adding...' : 'Add to Cart'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

