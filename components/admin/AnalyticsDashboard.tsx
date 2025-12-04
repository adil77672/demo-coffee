'use client'

import { useState, useMemo } from 'react'
import { Shop, AnalyticsEvent } from '@/lib/types'

interface AnalyticsDashboardProps {
  shops: Shop[]
  events: AnalyticsEvent[]
}

export function AnalyticsDashboard({ shops, events }: AnalyticsDashboardProps) {
  const [selectedShop, setSelectedShop] = useState<string>('')

  const filteredEvents = useMemo(() => {
    return selectedShop
      ? events.filter((e) => e.shop_id === selectedShop)
      : events
  }, [events, selectedShop])

  const stats = useMemo(() => {
    const scans = filteredEvents.filter((e) => e.event_type === 'scan').length
    const coffeeSelects = filteredEvents.filter((e) => e.event_type === 'coffee_select').length
    const pairingViews = filteredEvents.filter((e) => e.event_type === 'pairing_view').length
    const pairingAccepts = filteredEvents.filter((e) => e.event_type === 'pairing_accept').length
    const addToCarts = filteredEvents.filter((e) => e.event_type === 'add_to_cart').length
    const checkouts = filteredEvents.filter((e) => e.event_type === 'checkout').length

    const acceptRate = pairingViews > 0 ? (pairingAccepts / pairingViews) * 100 : 0
    const conversionRate = scans > 0 ? (checkouts / scans) * 100 : 0

    return {
      scans,
      coffeeSelects,
      pairingViews,
      pairingAccepts,
      addToCarts,
      checkouts,
      acceptRate,
      conversionRate,
    }
  }, [filteredEvents])

  const uniqueSessions = useMemo(() => {
    return new Set(filteredEvents.map((e) => e.session_id)).size
  }, [filteredEvents])

  return (
    <div>
      <div className="mb-6">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total Scans</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.scans}</p>
          <p className="text-sm text-gray-500 mt-1">{uniqueSessions} unique sessions</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Coffee Selections</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.coffeeSelects}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Pairing Views</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.pairingViews}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Pairing Accepts</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.pairingAccepts}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Add to Cart</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.addToCarts}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Checkouts</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.checkouts}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Accept Rate</h3>
          <p className="text-3xl font-bold text-gray-900">
            {stats.acceptRate.toFixed(1)}%
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {stats.pairingAccepts} / {stats.pairingViews} views
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Conversion Rate</h3>
          <p className="text-3xl font-bold text-gray-900">
            {stats.conversionRate.toFixed(1)}%
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {stats.checkouts} / {stats.scans} scans
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Recent Events</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Session ID
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEvents.slice(0, 50).map((event) => (
                <tr key={event.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(event.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-100 text-amber-800">
                      {event.event_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono text-xs">
                    {event.session_id.substring(0, 8)}...
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

