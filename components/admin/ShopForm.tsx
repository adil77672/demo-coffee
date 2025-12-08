'use client'

import { useState } from 'react'
import { Shop } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'

interface ShopFormProps {
  shop?: Shop | null
  onSuccess: () => void
  onCancel: () => void
}

export function ShopForm({ shop, onSuccess, onCancel }: ShopFormProps) {
  const [formData, setFormData] = useState({
    name: shop?.name || '',
    slug: shop?.slug || '',
    description: shop?.settings?.description || '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const shopData = {
      name: formData.name,
      slug: formData.slug,
      settings: {
        description: formData.description || '',
        ...(shop?.settings || {}),
      },
    }

    let error
    if (shop) {
      const { error: updateError } = await supabase
        .from('shops')
        .update(shopData)
        .eq('id', shop.id)
      error = updateError
    } else {
      // For new shops, generate a QR code
      const qrCode = `shop-${formData.slug}-${Date.now()}`
      const { error: insertError } = await supabase.from('shops').insert({
        ...shopData,
        qr_code: qrCode,
      })
      error = insertError
    }

    setIsSubmitting(false)

    if (error) {
      alert('Error saving shop: ' + error.message)
      return
    }

    onSuccess()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 md:p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 md:p-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
            {shop ? 'Edit Shop' : 'Add Shop'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shop Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm md:text-base"
                placeholder="e.g., Sweet Spot Coffee"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug *
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
                  })
                }
                required
                disabled={!!shop}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 disabled:bg-gray-100 text-sm md:text-base"
                placeholder="e.g., sweet-spot-coffee"
              />
              {shop && (
                <p className="text-xs text-gray-500 mt-1">Slug cannot be changed after creation</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                placeholder="Enter shop description..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm md:text-base"
              />
            </div>

            {shop && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">QR Code:</p>
                <p className="text-sm font-mono text-gray-900 break-all">{shop.qr_code}</p>
                <p className="text-xs text-gray-500 mt-2">
                  QR URL: <code className="bg-white px-1 rounded">{`/qr/${shop.qr_code}`}</code>
                </p>
              </div>
            )}

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
                {isSubmitting ? 'Saving...' : shop ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

