import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  
  // Fetch all shops
  const { data: shops } = await supabase
    .from('shops')
    .select('*')
    .order('name')

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF7F2' }}>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Coffee Pairing Experience
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Discover perfect coffee and pastry pairings
          </p>
          <p className="text-gray-500">
            Scan a QR code or select a shop to begin
          </p>
        </div>

        {shops && shops.length > 0 ? (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
              Available Shops
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shops.map((shop: any) => (
                <Link
                  key={shop.id}
                  href={`/shop/${shop.slug}`}
                  className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-lg border border-amber-100 transition-all p-6 text-center group"
                >
                  <div className="mb-4">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-amber-200 transition-colors">
                      <svg
                        className="w-8 h-8 text-amber-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">
                      {shop.name}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">
                    QR Code: {shop.qr_code}
                  </p>
                  <div className="text-amber-600 font-medium group-hover:text-amber-700">
                    Visit Shop →
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-amber-100 p-8 text-center">
            <p className="text-gray-500 mb-4">No shops available yet.</p>
            <Link
              href="/admin"
              className="text-amber-600 hover:text-amber-800 font-medium"
            >
              Go to Admin Panel →
            </Link>
          </div>
        )}

        <div className="mt-12 text-center">
          <div className="inline-flex gap-4">
            <Link
              href="/admin"
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
            >
              Admin Panel
            </Link>
            {shops && shops.length > 0 && (
              <Link
                href={`/shop/${shops[0].slug}`}
                className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors"
              >
                Quick Start
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
