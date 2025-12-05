import { getShopBySlug } from '@/lib/shop'
import { Navbar } from '@/components/Navbar'
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
      <Navbar shopSlug={shop.slug} />
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

