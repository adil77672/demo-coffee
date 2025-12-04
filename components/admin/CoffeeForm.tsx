'use client'

import { useState } from 'react'
import { Coffee, Shop } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'

interface CoffeeFormProps {
  shops: Shop[]
  coffee?: Coffee | null
  onSuccess: () => void
  onCancel: () => void
}

export function CoffeeForm({ shops, coffee, onSuccess, onCancel }: CoffeeFormProps) {
  const [formData, setFormData] = useState({
    shop_id: coffee?.shop_id || shops[0]?.id || '',
    name: coffee?.name || '',
    roast: coffee?.roast || '',
    origin: coffee?.origin || '',
    tasting_notes: coffee?.tasting_notes?.join(', ') || '',
    description: coffee?.description || '',
    image: coffee?.image || '',
    price: coffee?.price?.toString() || '',
    active: coffee?.active ?? true,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const tastingNotesArray = formData.tasting_notes
      .split(',')
      .map((note) => note.trim())
      .filter((note) => note.length > 0)

    const coffeeData = {
      shop_id: formData.shop_id,
      name: formData.name,
      roast: formData.roast || null,
      origin: formData.origin || null,
      tasting_notes: tastingNotesArray.length > 0 ? tastingNotesArray : null,
      description: formData.description || null,
      image: formData.image || null,
      price: formData.price ? parseFloat(formData.price) : null,
      active: formData.active,
    }

    let error
    if (coffee) {
      const { error: updateError } = await supabase
        .from('coffees')
        .update(coffeeData)
        .eq('id', coffee.id)
      error = updateError
    } else {
      const { error: insertError } = await supabase.from('coffees').insert(coffeeData)
      error = insertError
    }

    setIsSubmitting(false)

    if (error) {
      alert('Error saving coffee: ' + error.message)
      return
    }

    onSuccess()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {coffee ? 'Edit Coffee' : 'Add Coffee'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shop *
              </label>
              <select
                value={formData.shop_id}
                onChange={(e) => setFormData({ ...formData, shop_id: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
              >
                <option value="">Select a shop</option>
                {shops.map((shop) => (
                  <option key={shop.id} value={shop.id}>
                    {shop.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Roast
                </label>
                <input
                  type="text"
                  value={formData.roast}
                  onChange={(e) => setFormData({ ...formData, roast: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Origin
                </label>
                <input
                  type="text"
                  value={formData.origin}
                  onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tasting Notes (comma-separated)
              </label>
              <input
                type="text"
                value={formData.tasting_notes}
                onChange={(e) =>
                  setFormData({ ...formData, tasting_notes: e.target.value })
                }
                placeholder="e.g., chocolate, caramel, nutty"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) =>
                    setFormData({ ...formData, active: e.target.checked })
                  }
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">Active</span>
              </label>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : coffee ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

