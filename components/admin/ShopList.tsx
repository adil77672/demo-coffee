'use client'

import { useState } from 'react'
import { Shop } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'
import { ShopForm } from './ShopForm'

interface ShopListProps {
  shops: Shop[]
}

export function ShopList({ shops: initialShops }: ShopListProps) {
  const [shops, setShops] = useState(initialShops)
  const [editingShop, setEditingShop] = useState<Shop | null>(null)
  const [showForm, setShowForm] = useState(false)
  const supabase = createClient()

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this shop? This will delete all associated coffees, pastries, and pairings.')) return

    const { error } = await supabase.from('shops').delete().eq('id', id)

    if (error) {
      alert('Error deleting shop: ' + error.message)
      return
    }

    setShops(shops.filter((s) => s.id !== id))
  }

  const handleEdit = (shop: Shop) => {
    setEditingShop(shop)
    setShowForm(true)
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingShop(null)
    window.location.reload()
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center flex-col sm:flex-row gap-4">
        <h2 className="text-xl font-semibold text-gray-900">All Shops</h2>
        <button
          onClick={() => {
            setEditingShop(null)
            setShowForm(true)
          }}
          className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm md:text-base"
        >
          Add Shop
        </button>
      </div>

      {showForm && (
        <ShopForm
          shop={editingShop}
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setShowForm(false)
            setEditingShop(null)
          }}
        />
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  QR Code
                </th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-4 md:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {shops.map((shop) => {
                const description = shop.settings?.description || '-'
                return (
                  <tr key={shop.id} className="hover:bg-gray-50">
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{shop.name}</div>
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {shop.slug}
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono text-xs">
                      {shop.qr_code}
                    </td>
                    <td className="px-4 md:px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {description}
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(shop)}
                        className="text-amber-600 hover:text-amber-900 mr-4 transition-colors"
                      >
                        Edit
                      </button>
                      <a
                        href={`/shop/${shop.slug}`}
                        target="_blank"
                        className="text-blue-600 hover:text-blue-900 mr-4 transition-colors"
                      >
                        View
                      </a>
                      <button
                        onClick={() => handleDelete(shop.id)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {shops.length === 0 && (
          <div className="text-center py-8 text-gray-500">No shops found</div>
        )}
      </div>
    </div>
  )
}

