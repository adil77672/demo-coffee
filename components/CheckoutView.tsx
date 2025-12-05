'use client'

import { useState, useEffect } from 'react'
import { Shop, Coffee, Pastry, PairingRule } from '@/lib/types'
import { trackEvent } from '@/lib/analytics'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

interface CheckoutViewProps {
  shop: Shop
  coffee: Coffee | null
  pastry: Pastry | null
  pairing: PairingRule | null
}

export function CheckoutView({ shop, coffee, pastry, pairing }: CheckoutViewProps) {
  const router = useRouter()
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: 'Guest',
    tableNumber: 'Table 4',
    orderType: 'Serve to table',
    notes: '',
  })

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user)
        setFormData(prev => ({
          ...prev,
          name: user.user_metadata?.name || user.email || 'Guest',
        }))
      }
    })
  }, [])

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true)
    
    if (coffee && pastry && pairing) {
      await trackEvent(shop.id, 'checkout', {
        coffeeId: coffee.id,
        pastryId: pastry.id,
        pairingRuleId: pairing.id,
        metadata: {
          name: formData.name,
          tableNumber: formData.tableNumber,
          orderType: formData.orderType,
        },
      })
    }

    // Simulate order processing
    setTimeout(() => {
      router.push(`/shop/${shop.slug}/checkout/success`)
    }, 1000)
  }

  if (!coffee) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-sm border border-amber-100 p-8 text-center">
          <p className="text-gray-600 mb-4">Your cart is empty. Add items before completing checkout.</p>
          <Link
            href={`/shop/${shop.slug}`}
            className="inline-block bg-amber-800 hover:bg-amber-900 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Browse menu
          </Link>
        </div>
      </div>
    )
  }

  const coffeePrice = coffee.price || 0
  const pastryPrice = pastry?.price || 0
  const total = coffeePrice + pastryPrice

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Checkout Form */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600 mb-6">No payment is processed — this simulates the user journey.</p>

          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-sm border border-amber-100 p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Table number or pickup</label>
              <input
                type="text"
                value={formData.tableNumber}
                onChange={(e) => setFormData({ ...formData, tableNumber: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Order type</label>
              <select
                value={formData.orderType}
                onChange={(e) => setFormData({ ...formData, orderType: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              >
                <option>Serve to table</option>
                <option>Pickup at counter</option>
                <option>Takeaway</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={4}
                maxLength={240}
                placeholder="Allergies, brew preference, etc."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
              <p className="text-xs text-gray-500 mt-1">{formData.notes.length}/240 characters</p>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder}
              className="w-full bg-amber-800 hover:bg-amber-900 disabled:bg-amber-400 text-white font-semibold py-4 px-6 rounded-lg transition-colors"
            >
              {isPlacingOrder ? 'Placing order...' : 'Place order'}
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <Link
            href={`/shop/${shop.slug}/cart?coffee=${coffee.id}&pastry=${pastry?.id}&pairing=${pairing?.id}`}
            className="text-amber-700 hover:text-amber-900 mb-4 inline-block font-medium"
          >
            ← Back to cart
          </Link>

          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-sm border border-amber-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order summary</h2>

            {coffee && (
              <div className="space-y-4 mb-6">
                <div className="flex gap-4 pb-4 border-b border-gray-200">
                  {coffee.image && (
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={coffee.image}
                        alt={coffee.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{coffee.name}</h3>
                    {coffee.price && (
                      <p className="text-gray-600">${coffee.price.toFixed(2)}</p>
                    )}
                  </div>
                </div>

                {pastry && (
                  <div className="flex gap-4 pb-4 border-b border-gray-200">
                    {pastry.image && (
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={pastry.image}
                          alt={pastry.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{pastry.name}</h3>
                      {pairing && (
                        <p className="text-sm text-amber-700 mb-1">
                          Perfect pairing ({pairing.match_score}% match)
                        </p>
                      )}
                      {pastry.price && (
                        <p className="text-gray-600">${pastry.price.toFixed(2)}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Total</span>
                <span className="text-xl font-bold text-gray-900">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

