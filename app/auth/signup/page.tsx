import Link from 'next/link'

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAF7F2' }}>
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-600 rounded flex items-center justify-center">
              <span className="text-white text-sm font-bold">☕</span>
            </div>
            <div>
              <div className="font-bold text-gray-900">AI Coffee</div>
              <div className="text-xs text-gray-500">QR cafe ordering</div>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-700 hover:text-gray-900">
              Cart
            </Link>
            <Link href="/" className="text-gray-700 hover:text-gray-900">
              Checkout
            </Link>
            <Link
              href="/auth/login"
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Login
            </Link>
            <span className="px-4 py-2 bg-amber-800 text-white rounded-lg font-medium">
              Sign up
            </span>
          </div>
        </div>
      </nav>

      <div className="w-full max-w-md px-4">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-sm border border-amber-100 p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Join AI Coffee</h1>
          <p className="text-gray-600 mb-8">Choose how you want to get started.</p>

          <div className="space-y-4">
            <Link
              href="/auth/signup/admin"
              className="block w-full bg-amber-800 hover:bg-amber-900 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Sign up as a Shop Owner
            </Link>
            <Link
              href="/auth/signup/user"
              className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Sign up as a Customer
            </Link>
          </div>

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-amber-700 hover:text-amber-900 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
