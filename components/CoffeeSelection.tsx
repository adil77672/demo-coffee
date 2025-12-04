'use client'

import { useState } from 'react'
import { Coffee, Shop } from '@/lib/types'
import { trackEvent } from '@/lib/analytics'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface CoffeeSelectionProps {
  shop: Shop
  coffees: Coffee[]
}

export function CoffeeSelection({ shop, coffees }: CoffeeSelectionProps) {
  const router = useRouter()
  const [selectedCoffee, setSelectedCoffee] = useState<Coffee | null>(null)

  const handleCoffeeSelect = async (coffee: Coffee) => {
    setSelectedCoffee(coffee)
    await trackEvent(shop.id, 'coffee_select', { coffeeId: coffee.id })
    router.push(`/shop/${shop.slug}/coffee/${coffee.id}`)
  }

  if (coffees.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No coffees available at this shop.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {coffees.map((coffee) => (
        <button
          key={coffee.id}
          onClick={() => handleCoffeeSelect(coffee)}
          className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 text-left group"
        >
          {coffee.image && (
            <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
              <Image
                src={coffee.image}
                alt={coffee.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform"
              />
            </div>
          )}
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{coffee.name}</h3>
          {coffee.roast && (
            <p className="text-sm text-gray-600 mb-1">Roast: {coffee.roast}</p>
          )}
          {coffee.origin && (
            <p className="text-sm text-gray-600 mb-2">Origin: {coffee.origin}</p>
          )}
          {coffee.tasting_notes && coffee.tasting_notes.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {coffee.tasting_notes.map((note, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full"
                >
                  {note}
                </span>
              ))}
            </div>
          )}
          {coffee.description && (
            <p className="text-sm text-gray-500 line-clamp-2">{coffee.description}</p>
          )}
          {coffee.price && (
            <p className="text-lg font-bold text-gray-900 mt-3">${coffee.price.toFixed(2)}</p>
          )}
        </button>
      ))}
    </div>
  )
}

