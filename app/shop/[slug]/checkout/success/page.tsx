import { getShopBySlug } from '@/lib/shop'
import Link from 'next/link'
import { notFound } from 'next/navigation'


interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function CheckoutSuccessPage({ params }: PageProps) {
  const { slug } = await params
  const shop = await getShopBySlug(slug)

  if (!shop) {
    notFound()
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAF7F2' }}>
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href={`/shop/${shop.slug}`} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-600 rounded flex items-center justify-center">
              <span className="text-white text-sm font-bold">☕</span>
            </div>
            <div>
              <div className="font-bold text-gray-900">AI Coffee</div>
              <div className="text-xs text-gray-500">QR cafe ordering</div>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Link href={`/shop/${shop.slug}/cart`} className="text-gray-700 hover:text-gray-900">
              Cart
            </Link>
            <Link href={`/shop/${shop.slug}/checkout`} className="text-gray-700 hover:text-gray-900">
              Checkout
            </Link>
            <Link
              href="/auth/login"
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Login
            </Link>
            <Link
              href="/auth/signup"
              className="px-4 py-2 bg-amber-800 text-white rounded-lg hover:bg-amber-900 font-medium"
            >
              Sign up
            </Link>
          </div>
        </div>
      </nav>

      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-sm border border-amber-100 p-8 max-w-md text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">
            Thank you for your order. Your coffee and pastry pairing will be ready soon.
          </p>
        </div>
        <Link
          href={`/shop/${shop.slug}`}
          className="inline-block bg-amber-800 hover:bg-amber-900 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Order Again
        </Link>
      </div>
    </div>
  )
}

