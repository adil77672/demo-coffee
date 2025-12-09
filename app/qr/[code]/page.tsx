import { getShopByQRCode } from '@/lib/shop'
import { redirect } from 'next/navigation'
import Link from 'next/link'

interface PageProps {
  params: Promise<{ code: string }>
}

export default async function QRCodePage({ params }: PageProps) {
  const { code } = await params
  
  if (!code) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Invalid QR Code</h1>
          <p className="text-gray-600 mb-6">The QR code is missing or invalid.</p>
          <Link
            href="/"
            className="inline-block bg-amber-800 hover:bg-amber-900 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Go to Home
          </Link>
        </div>
      </div>
    )
  }

  const shop = await getShopByQRCode(code)

  if (!shop) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Shop Not Found</h1>
          <p className="text-gray-600 mb-6">The QR code is invalid or the shop doesn't exist. Please check the QR code and try again.</p>
          <Link
            href="/"
            className="inline-block bg-amber-800 hover:bg-amber-900 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Go to Home
          </Link>
        </div>
      </div>
    )
  }

  // Track scan event - save to database first, then redirect to normalized URL
  const { trackScanEvent } = await import('@/lib/analytics-server')
  
  try {
    await trackScanEvent(shop.id, code)
  } catch (error) {
    // Log error but don't block redirect
    console.error('❌ Error tracking scan event:', error)
  }

  // Redirect to normalized shop URL (always redirect, even if tracking fails)
  redirect(`/shop/${shop.slug}`)
}

