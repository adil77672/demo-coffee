'use client'

import { useState, useEffect } from 'react'
import { PairingRule, Shop, Coffee, Pastry } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'
import { PairingForm } from './PairingForm'

interface PairingListProps {
  shops: Shop[]
  coffees: Coffee[]
  pastries: Pastry[]
  pairings: (PairingRule & { coffee?: { name: string }; pastry?: { name: string } })[]
}

export function PairingList({
  shops,
  coffees: allCoffees,
  pastries: allPastries,
  pairings: initialPairings,
}: PairingListProps) {
  const [pairings, setPairings] = useState(initialPairings)
  const [editingPairing, setEditingPairing] = useState<PairingRule | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [selectedShop, setSelectedShop] = useState<string>('')
  const supabase = createClient()

  const coffees = selectedShop
    ? allCoffees.filter((c) => c.shop_id === selectedShop)
    : allCoffees
  const pastries = selectedShop
    ? allPastries.filter((p) => p.shop_id === selectedShop)
    : allPastries

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this pairing?')) return

    const { error } = await supabase.from('pairing_rules').delete().eq('id', id)

    if (error) {
      alert('Error deleting pairing: ' + error.message)
      return
    }

    setPairings(pairings.filter((p) => p.id !== id))
  }

  const handleEdit = (pairing: PairingRule) => {
    setEditingPairing(pairing)
    setShowForm(true)
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingPairing(null)
    window.location.reload()
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">All Pairings</h2>
        <button
          onClick={() => {
            setEditingPairing(null)
            setShowForm(true)
          }}
          className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded-lg"
        >
          Add Pairing
        </button>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Shop
        </label>
        <select
          value={selectedShop}
          onChange={(e) => setSelectedShop(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
        >
          <option value="">All Shops</option>
          {shops.map((shop) => (
            <option key={shop.id} value={shop.id}>
              {shop.name}
            </option>
          ))}
        </select>
      </div>

      {showForm && (
        <PairingForm
          shops={shops}
          coffees={coffees}
          pastries={pastries}
          pairing={editingPairing}
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setShowForm(false)
            setEditingPairing(null)
          }}
        />
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Coffee
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pastry
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Match Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reasoning
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
            {pairings
              .filter((p) => !selectedShop || p.shop_id === selectedShop)
              .map((pairing) => (
                <tr key={pairing.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {pairing.coffee?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {pairing.pastry?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {pairing.match_score}%
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {pairing.reasoning ? (
                      <span className="line-clamp-2">{pairing.reasoning}</span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        pairing.active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {pairing.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(pairing)}
                      className="text-amber-600 hover:text-amber-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(pairing.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {pairings.filter((p) => !selectedShop || p.shop_id === selectedShop).length === 0 && (
          <div className="text-center py-8 text-gray-500">No pairings found</div>
        )}
      </div>
    </div>
  )
}

