'use client'

import { Shop, Coffee, Pastry } from '@/lib/types'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import dynamic from 'next/dynamic'

const QRCodeSVG = dynamic(() => import('qrcode.react').then(mod => mod.QRCodeSVG), {
  ssr: false,
})

interface ShopMenuProps {
  shop: Shop
  coffees: Coffee[]
  pastries: Pastry[]
}

export function ShopMenu({ shop, coffees, pastries }: ShopMenuProps) {
  const router = useRouter()
  const shopUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/shop/${shop.slug}`
    : `https://localhost:3000/shop/${shop.slug}`

  return (
    <div className="space-y-8">
      {/* QR Menu Card */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-sm border border-amber-100 p-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1">
            <div className="text-xs uppercase text-gray-400 tracking-wider mb-2">QR MENU</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{shop.name}</h1>
            <p className="text-gray-600">Scan, order, and enjoy cozy café vibes.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
              <QRCodeSVG value={shopUrl} size={150} />
            </div>
            <p className="text-sm text-gray-500 mt-3">Share this QR with friends</p>
            <button className="mt-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
              Share menu link
            </button>
          </div>
        </div>
      </div>

      {/* House Coffees Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-amber-600 text-xl">☕</span>
          <div>
            <div className="text-xs uppercase text-amber-600 tracking-wider">HOUSE COFFEES</div>
            <h2 className="text-2xl font-bold text-gray-900">Coffee menu</h2>
          </div>
        </div>

        {coffees.length === 0 ? (
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-amber-100 p-8 text-center text-gray-600">
            No items in this category yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {coffees.map((coffee) => (
              <div
                key={coffee.id}
                onClick={() => router.push(`/shop/${shop.slug}/coffee/${coffee.id}`)}
                className="bg-white/95 backdrop-blur-sm rounded-xl shadow-sm border border-amber-100 p-4 cursor-pointer hover:shadow-md hover:border-amber-200 transition-all"
              >
                {coffee.image && (
                  <div className="relative w-full h-32 mb-3 rounded-lg overflow-hidden">
                    <Image
                      src={coffee.image}
                      alt={coffee.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="text-xs text-gray-400 mb-1">• Coffee</div>
                    <h3 className="font-semibold text-gray-900">{coffee.name}</h3>
                    {coffee.description && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{coffee.description}</p>
                    )}
                  </div>
                  {coffee.price && (
                    <div className="text-lg font-bold text-gray-900 ml-2">
                      ${coffee.price.toFixed(2)}
                    </div>
                  )}
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push(`/shop/${shop.slug}/coffee/${coffee.id}`)
                  }}
                  className="w-full mt-3 px-4 py-2 bg-amber-800 text-white rounded-lg hover:bg-amber-900 transition-colors font-medium"
                >
                  Add to tray
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fresh Pastry Case Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-amber-600 text-xl">🥐</span>
          <div>
            <div className="text-xs uppercase text-amber-600 tracking-wider">FRESH PASTRY CASE</div>
            <h2 className="text-2xl font-bold text-gray-900">Pastry menu</h2>
          </div>
        </div>

        {pastries.length === 0 ? (
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-amber-100 p-8 text-center text-gray-600">
            No items in this category yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pastries.map((pastry) => (
              <div
                key={pastry.id}
                className="bg-white/95 backdrop-blur-sm rounded-xl shadow-sm border border-amber-100 p-4 hover:shadow-md hover:border-amber-200 transition-all"
              >
                {pastry.image && (
                  <div className="relative w-full h-32 mb-3 rounded-lg overflow-hidden">
                    <Image
                      src={pastry.image}
                      alt={pastry.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="text-xs text-gray-400 mb-1">• Pastry</div>
                    <h3 className="font-semibold text-gray-900">{pastry.name}</h3>
                    {pastry.flavor_profile && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{pastry.flavor_profile}</p>
                    )}
                  </div>
                  {pastry.price && (
                    <div className="text-lg font-bold text-gray-900 ml-2">
                      ${pastry.price.toFixed(2)}
                    </div>
                  )}
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push(`/shop/${shop.slug}/coffee/${coffee.id}`)
                  }}
                  className="w-full mt-3 px-4 py-2 bg-amber-800 text-white rounded-lg hover:bg-amber-900 transition-colors font-medium"
                >
                  Add to tray
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Pairing Lab Section */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-sm border border-amber-100 p-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs uppercase text-gray-400 tracking-wider mb-2">AI PAIRING LAB</div>
            <h2 className="text-2xl font-bold text-gray-900">Find the sweetest combo</h2>
            <p className="text-gray-600 mt-1">
              Pick a coffee, pastry, and season to let the AI suggest wow-factor pairings for upsells or specials.
            </p>
          </div>
        </div>
        <div className="mt-6">
          {coffees.length > 0 ? (
            <Link
              href={`/shop/${shop.slug}/coffee/${coffees[0].id}`}
              className="inline-block px-6 py-3 bg-amber-800 text-white rounded-lg hover:bg-amber-900 transition-colors font-semibold"
            >
              Explore Pairings
            </Link>
          ) : (
            <p className="text-gray-500 text-sm">Add coffees to enable pairing suggestions</p>
          )}
        </div>
      </div>
    </div>
  )
}

