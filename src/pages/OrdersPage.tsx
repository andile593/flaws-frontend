import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getOrders } from '../api/orders.api'

interface Order {
  id: string
  status: string
  total: number
  createdAt: string
  items: { id: string; quantity: number; product: { name: string } }[]
}

export default function OrdersPage() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }
    getOrders().then((data) => {
      setOrders(data)
      setLoading(false)
    })
  }, [])

  const statusColor = (status: string) => ({
    PENDING: '#888',
    CONFIRMED: '#4CAF50',
    PROCESSING: '#2196F3',
    SHIPPED: '#9C27B0',
    DELIVERED: '#4CAF50',
    CANCELLED: '#ff6b6b',
    REFUNDED: '#ff6b6b',
  }[status] || '#888')

  if (loading) return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', paddingTop: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#888', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Loading...</p>
    </div>
  )

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', paddingTop: '64px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '4rem 2rem' }}>

        <div style={{ marginBottom: '3rem', borderBottom: '1px solid #1a1a1a', paddingBottom: '2rem' }}>
          <p style={{ fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#888', marginBottom: '0.5rem' }}>
            Your History
          </p>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Orders
          </h1>
        </div>

        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '6rem 0' }}>
            <p style={{ color: '#888', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '2rem' }}>
              No orders yet
            </p>
            <Link
              to="/products"
              style={{
                padding: '1rem 3rem',
                border: '1px solid #ffffff',
                color: '#ffffff',
                textDecoration: 'none',
                fontSize: '0.7rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
              }}
            >
              Shop Now
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {orders.map((order) => (
              <Link
                key={order.id}
                to={`/orders/${order.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  gap: '2rem',
                  padding: '2rem 0',
                  borderBottom: '1px solid #1a1a1a',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => e.currentTarget.style.paddingLeft = '1rem'}
                onMouseLeave={(e) => e.currentTarget.style.paddingLeft = '0'}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                      <p style={{ fontSize: '0.7rem', fontFamily: 'monospace', color: '#555' }}>
                        #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                      <span style={{
                        fontSize: '0.55rem',
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        color: statusColor(order.status),
                        border: `1px solid ${statusColor(order.status)}`,
                        padding: '3px 8px',
                      }}>
                        {order.status}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.8rem', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                      {order.items.map(i => i.product.name).join(', ')}
                    </p>
                    <p style={{ fontSize: '0.7rem', color: '#555' }}>
                      {new Date(order.createdAt).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>R{Number(order.total).toFixed(2)}</p>
                    <p style={{ fontSize: '0.65rem', color: '#555', marginTop: '0.25rem' }}>
                      {order.items.reduce((sum, i) => sum + i.quantity, 0)} items
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}