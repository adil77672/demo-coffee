import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { Navbar } from '@/components/Navbar'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function OrdersPage() {
  const user = await requireAuth()
  
  // Only customers can view their orders
  const role = user.user_metadata?.role
  if (role === 'admin') {
    redirect('/admin')
  }

  const supabase = await createClient()

  // Fetch user's orders from analytics_events where event_type is 'checkout'
  const { data: orders, error } = await supabase
    .from('analytics_events')
    .select('*')
    .eq('user_id', user.id)
    .eq('event_type', 'checkout')
    .order('created_at', { ascending: false })
    .limit(50)

  // Also fetch coffee and pastry details for each order
  const ordersWithDetails = await Promise.all(
    (orders || []).map(async (order: any) => {
      let coffee = null
      let pastry = null

      if (order.coffee_id) {
        const { data } = await supabase
          .from('coffees')
          .select('name, price')
          .eq('id', order.coffee_id)
          .single()
        coffee = data
      }

      if (order.pastry_id) {
        const { data } = await supabase
          .from('pastries')
          .select('name, price')
          .eq('id', order.pastry_id)
          .single()
        pastry = data
      }

      return {
        ...order,
        coffee,
        pastry,
      }
    })
  )

  if (error) {
    console.error('Error fetching orders:', error)
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF7F2' }}>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">👤</span>
              <h1 className="text-3xl font-bold text-blue-900">My Orders</h1>
            </div>
            <p className="text-blue-800">
              Welcome, <strong>{user.user_metadata?.name || user.email}</strong>! 
              You're logged in as a <strong>Customer</strong>.
            </p>
            <p className="text-blue-700 text-sm mt-2">
              View your order history and track your coffee pairings.
            </p>
          </div>

          {!ordersWithDetails || ordersWithDetails.length === 0 ? (
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-sm border border-amber-100 p-8 text-center">
              <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
              <Link
                href="/"
                className="text-amber-700 hover:text-amber-900 font-medium"
              >
                Browse shops →
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {ordersWithDetails.map((order: any) => {
                const metadata = (order.event_data as Record<string, any>) || {}
                const orderDate = new Date(order.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })

                const coffeePrice = order.coffee?.price || 0
                const pastryPrice = order.pastry?.price || 0
                const total = coffeePrice + pastryPrice

                return (
                  <div
                    key={order.id}
                    className="bg-white/95 backdrop-blur-sm rounded-xl shadow-sm border border-amber-100 p-6"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order #{order.id.slice(0, 8)}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">{orderDate}</p>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium">
                        Completed
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      {order.coffee && (
                        <div className="flex justify-between text-gray-700">
                          <span>Coffee:</span>
                          <span className="font-medium">
                            {order.coffee.name} - ${coffeePrice.toFixed(2)}
                          </span>
                        </div>
                      )}
                      {order.pastry && (
                        <div className="flex justify-between text-gray-700">
                          <span>Pastry:</span>
                          <span className="font-medium">
                            {order.pastry.name} - ${pastryPrice.toFixed(2)}
                          </span>
                        </div>
                      )}
                      {metadata.tableNumber && (
                        <div className="flex justify-between text-gray-700">
                          <span>Table:</span>
                          <span className="font-medium">{metadata.tableNumber}</span>
                        </div>
                      )}
                      {metadata.orderType && (
                        <div className="flex justify-between text-gray-700">
                          <span>Type:</span>
                          <span className="font-medium">{metadata.orderType}</span>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-gray-200 pt-2">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-900">Total:</span>
                        <span className="text-lg font-bold text-gray-900">
                          ${total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

