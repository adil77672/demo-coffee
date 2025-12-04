'use client'

import { useState } from 'react'
import { Coffee, Shop } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'
import { CoffeeForm } from './CoffeeForm'

interface CoffeeListProps {
  shops: Shop[]
  coffees: (Coffee & { shop?: { name: string; slug: string } })[]
}

export function CoffeeList({ shops, coffees: initialCoffees }: CoffeeListProps) {
  const [coffees, setCoffees] = useState(initialCoffees)
  const [editingCoffee, setEditingCoffee] = useState<Coffee | null>(null)
  const [showForm, setShowForm] = useState(false)
  const supabase = createClient()

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coffee?')) return

    const { error } = await supabase.from('coffees').delete().eq('id', id)

    if (error) {
      alert('Error deleting coffee: ' + error.message)
      return
    }

    setCoffees(coffees.filter((c) => c.id !== id))
  }

  const handleEdit = (coffee: Coffee) => {
    setEditingCoffee(coffee)
    setShowForm(true)
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingCoffee(null)
    window.location.reload()
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">All Coffees</h2>
        <button
          onClick={() => {
            setEditingCoffee(null)
            setShowForm(true)
          }}
          className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded-lg"
        >
          Add Coffee
        </button>
      </div>

      {showForm && (
        <CoffeeForm
          shops={shops}
          coffee={editingCoffee}
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setShowForm(false)
            setEditingCoffee(null)
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
                Roast
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
            {coffees.map((coffee) => (
              <tr key={coffee.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{coffee.name}</div>
                  {coffee.origin && (
                    <div className="text-sm text-gray-500">{coffee.origin}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {coffee.shop?.name || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {coffee.roast || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {coffee.price ? `$${coffee.price.toFixed(2)}` : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      coffee.active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {coffee.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(coffee)}
                    className="text-amber-600 hover:text-amber-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(coffee.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {coffees.length === 0 && (
          <div className="text-center py-8 text-gray-500">No coffees found</div>
        )}
      </div>
    </div>
  )
}

