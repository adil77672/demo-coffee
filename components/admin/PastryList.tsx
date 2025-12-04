'use client'

import { useState } from 'react'
import { Pastry, Shop } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'
import { PastryForm } from './PastryForm'

interface PastryListProps {
  shops: Shop[]
  pastries: (Pastry & { shop?: { name: string; slug: string } })[]
}

export function PastryList({ shops, pastries: initialPastries }: PastryListProps) {
  const [pastries, setPastries] = useState(initialPastries)
  const [editingPastry, setEditingPastry] = useState<Pastry | null>(null)
  const [showForm, setShowForm] = useState(false)
  const supabase = createClient()

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this pastry?')) return

    const { error } = await supabase.from('pastries').delete().eq('id', id)

    if (error) {
      alert('Error deleting pastry: ' + error.message)
      return
    }

    setPastries(pastries.filter((p) => p.id !== id))
  }

  const handleEdit = (pastry: Pastry) => {
    setEditingPastry(pastry)
    setShowForm(true)
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingPastry(null)
    window.location.reload()
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">All Pastries</h2>
        <button
          onClick={() => {
            setEditingPastry(null)
            setShowForm(true)
          }}
          className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded-lg"
        >
          Add Pastry
        </button>
      </div>

      {showForm && (
        <PastryForm
          shops={shops}
          pastry={editingPastry}
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setShowForm(false)
            setEditingPastry(null)
          }}
        />
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Shop
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Flavor Profile
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pastries.map((pastry) => (
              <tr key={pastry.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{pastry.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {pastry.shop?.name || 'N/A'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {pastry.flavor_profile || pastry.notes || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {pastry.price ? `$${pastry.price.toFixed(2)}` : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      pastry.active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {pastry.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(pastry)}
                    className="text-amber-600 hover:text-amber-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(pastry.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {pastries.length === 0 && (
          <div className="text-center py-8 text-gray-500">No pastries found</div>
        )}
      </div>
    </div>
  )
}

