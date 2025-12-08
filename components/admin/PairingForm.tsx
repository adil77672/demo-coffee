'use client'

import { useState, useEffect } from 'react'
import { PairingRule, Shop, Coffee, Pastry } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'

interface PairingFormProps {
  shops: Shop[]
  coffees: Coffee[]
  pastries: Pastry[]
  pairing?: PairingRule | null
  onSuccess: () => void
  onCancel: () => void
}

export function PairingForm({
  shops,
  coffees: allCoffees,
  pastries: allPastries,
  pairing,
  onSuccess,
  onCancel,
}: PairingFormProps) {
  const [formData, setFormData] = useState({
    shop_id: pairing?.shop_id || shops[0]?.id || '',
    coffee_id: pairing?.coffee_id || '',
    pastry_id: pairing?.pastry_id || '',
    match_score: pairing?.match_score?.toString() || '50',
    reasoning: pairing?.reasoning || '',
    active: pairing?.active ?? true,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const supabase = createClient()

  const coffees = formData.shop_id
    ? allCoffees.filter((c) => c.shop_id === formData.shop_id)
    : []
  const pastries = formData.shop_id
    ? allPastries.filter((p) => p.shop_id === formData.shop_id)
    : []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const pairingData = {
      shop_id: formData.shop_id,
      coffee_id: formData.coffee_id,
      pastry_id: formData.pastry_id,
      match_score: parseInt(formData.match_score),
      reasoning: formData.reasoning || null,
      active: formData.active,
    }

    let error
    if (pairing) {
      const { error: updateError } = await supabase
        .from('pairing_rules')
        .update(pairingData)
        .eq('id', pairing.id)
      error = updateError
    } else {
      const { error: insertError } = await supabase
        .from('pairing_rules')
        .insert(pairingData)
      error = insertError
    }

    setIsSubmitting(false)

    if (error) {
      alert('Error saving pairing: ' + error.message)
      return
    }

    onSuccess()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 md:p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 md:p-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
            {pairing ? 'Edit Pairing' : 'Add Pairing'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shop *
              </label>
              <select
                value={formData.shop_id}
                onChange={(e) => setFormData({ ...formData, shop_id: e.target.value, coffee_id: '', pastry_id: '' })}
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
                Coffee *
              </label>
              <select
                value={formData.coffee_id}
                onChange={(e) => setFormData({ ...formData, coffee_id: e.target.value })}
                required
                disabled={!formData.shop_id || coffees.length === 0}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 disabled:bg-gray-100"
              >
                <option value="">Select a coffee</option>
                {coffees.map((coffee) => (
                  <option key={coffee.id} value={coffee.id}>
                    {coffee.name}
                  </option>
                ))}
              </select>
              {formData.shop_id && coffees.length === 0 && (
                <p className="text-sm text-gray-500 mt-1">No coffees available for this shop</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pastry *
              </label>
              <select
                value={formData.pastry_id}
                onChange={(e) => setFormData({ ...formData, pastry_id: e.target.value })}
                required
                disabled={!formData.shop_id || pastries.length === 0}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 disabled:bg-gray-100"
              >
                <option value="">Select a pastry</option>
                {pastries.map((pastry) => (
                  <option key={pastry.id} value={pastry.id}>
                    {pastry.name}
                  </option>
                ))}
              </select>
              {formData.shop_id && pastries.length === 0 && (
                <p className="text-sm text-gray-500 mt-1">No pastries available for this shop</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Match Score (1-100) *
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={formData.match_score}
                onChange={(e) => setFormData({ ...formData, match_score: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reasoning
              </label>
              <textarea
                value={formData.reasoning}
                onChange={(e) => setFormData({ ...formData, reasoning: e.target.value })}
                rows={4}
                placeholder="Explain why this pairing works well..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
              />
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

            <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm md:text-base"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm md:text-base"
              >
                {isSubmitting ? 'Saving...' : pairing ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

