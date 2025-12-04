'use client'

import { useState } from 'react'
import { Pastry, Shop } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'

interface PastryFormProps {
  shops: Shop[]
  pastry?: Pastry | null
  onSuccess: () => void
  onCancel: () => void
}

export function PastryForm({ shops, pastry, onSuccess, onCancel }: PastryFormProps) {
  const [formData, setFormData] = useState({
    shop_id: pastry?.shop_id || shops[0]?.id || '',
    name: pastry?.name || '',
    notes: pastry?.notes || '',
    flavor_profile: pastry?.flavor_profile || '',
    image: pastry?.image || '',
    price: pastry?.price?.toString() || '',
    active: pastry?.active ?? true,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const pastryData = {
      shop_id: formData.shop_id,
      name: formData.name,
      notes: formData.notes || null,
      flavor_profile: formData.flavor_profile || null,
      image: formData.image || null,
      price: formData.price ? parseFloat(formData.price) : null,
      active: formData.active,
    }

    let error
    if (pastry) {
      const { error: updateError } = await supabase
        .from('pastries')
        .update(pastryData)
        .eq('id', pastry.id)
      error = updateError
    } else {
      const { error: insertError } = await supabase.from('pastries').insert(pastryData)
      error = insertError
    }

    setIsSubmitting(false)

    if (error) {
      alert('Error saving pastry: ' + error.message)
      return
    }

    onSuccess()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {pastry ? 'Edit Pastry' : 'Add Pastry'}
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Flavor Profile
              </label>
              <input
                type="text"
                value={formData.flavor_profile}
                onChange={(e) =>
                  setFormData({ ...formData, flavor_profile: e.target.value })
                }
                placeholder="e.g., sweet, buttery, flaky"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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
                {isSubmitting ? 'Saving...' : pastry ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

