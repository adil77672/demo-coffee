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
    await trackEvent(shop.id, 'pairing_accept', {
      coffeeId: coffee.id,
      pastryId: pairing.pastry_id,
      pairingRuleId: pairing.id,
    })
    router.push(`/shop/${shop.slug}/cart?coffee=${coffee.id}&pastry=${pairing.pastry_id}&pairing=${pairing.id}`)
  }

  return (
    <div>
        <Link
          href={`/shop/${shop.slug}`}
          className="text-amber-700 hover:text-amber-900 mb-4 inline-block font-medium"
        >
          ← Back to coffees
        </Link>

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-sm border border-amber-100 p-8 mb-8">
        <div className="flex flex-col md:flex-row gap-6">
          {coffee.image && (
            <div className="relative w-full md:w-64 h-64 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={coffee.image}
                alt={coffee.name}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{coffee.name}</h1>
            {coffee.roast && (
              <p className="text-gray-600 mb-1">Roast: <span className="font-medium">{coffee.roast}</span></p>
            )}
            {coffee.origin && (
              <p className="text-gray-600 mb-1">Origin: <span className="font-medium">{coffee.origin}</span></p>
            )}
            {coffee.tasting_notes && coffee.tasting_notes.length > 0 && (
              <div className="flex flex-wrap gap-2 my-3">
                {coffee.tasting_notes.map((note, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-amber-100 text-amber-800 text-sm rounded-full"
                  >
                    {note}
                  </span>
                ))}
              </div>
            )}
            {coffee.description && (
              <p className="text-gray-700 mt-4">{coffee.description}</p>
            )}
            {coffee.price && (
              <p className="text-2xl font-bold text-gray-900 mt-4">${coffee.price.toFixed(2)}</p>
            )}
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommended Pairings</h2>
        {pairings.length === 0 ? (
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-amber-100 p-8 text-center">
            <p className="text-gray-600">No pairings available for this coffee.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pairings.map((pairing) => (
              <div
                key={pairing.id}
                className="bg-white/95 backdrop-blur-sm rounded-xl shadow-sm border border-amber-100 hover:shadow-md hover:border-amber-200 transition-all p-6"
              >
                {pairing.pastry.image && (
                  <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                    <Image
                      src={pairing.pastry.image}
                      alt={pairing.pastry.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {pairing.pastry.name}
                </h3>
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-600">Match Score:</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-amber-600 h-2 rounded-full"
                        style={{ width: `${pairing.match_score}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-amber-600">{pairing.match_score}%</span>
                  </div>
                </div>
                {pairing.reasoning && (
                  <p className="text-sm text-gray-600 mb-4">{pairing.reasoning}</p>
                )}
                {pairing.pastry.flavor_profile && (
                  <p className="text-xs text-gray-500 mb-4 italic">
                    {pairing.pastry.flavor_profile}
                  </p>
                )}
                {pairing.pastry.price && (
                  <p className="text-lg font-bold text-gray-900 mb-4">
                    ${pairing.pastry.price.toFixed(2)}
                  </p>
                )}
                <button
                  onClick={() => handleAcceptPairing(pairing)}
                  className="w-full bg-amber-800 hover:bg-amber-900 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

