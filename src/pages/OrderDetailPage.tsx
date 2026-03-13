import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getOrderById } from '../api/orders.api'

interface OrderItem {
  id: string
  quantity: number
  unitPrice: number
  total: number
  product: {
    name: string
    slug: string
    images: { url: string; isPrimary: boolean }[]
  }
  variant: {
    size: string
    color: string
  }
}

interface Order {
  id: string
  status: string
  subtotal: number
  shippingCost: number
  discount: number
  total: number
  isPaid: boolean
  createdAt: string
  trackingNumber: string | null
  address: {
    fullName: string
    street: string
    city: string
    province: string
    postalCode: string
    country: string
  }
  items: OrderItem[]
}

export default function OrderDetailPage() {
  const { id } = useParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    getOrderById(id).then((data) => {
      setOrder(data)
      setLoading(false)
    })
  }, [id])

  if (loading) return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', paddingTop: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#888', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Loading...</p>
    </div>
  )

  if (!order) return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', paddingTop: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#888', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Order not found</p>
    </div>
  )

  const statusColor = {
    PENDING: '#888',
    CONFIRMED: '#4CAF50',
    PROCESSING: '#2196F3',
    SHIPPED: '#9C27B0',
    DELIVERED: '#4CAF50',
    CANCELLED: '#ff6b6b',
    REFUNDED: '#ff6b6b',
  }[order.status] || '#888'

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', paddingTop: '64px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '4rem 2rem' }}>

        {/* Header */}
        <div style={{ marginBottom: '3rem', borderBottom: '1px solid #1a1a1a', paddingBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#888', marginBottom: '0.5rem' }}>
                Order Confirmed
              </p>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Thank You
              </h1>
              <p style={{ fontSize: '0.7rem', color: '#555', fontFamily: 'monospace' }}>
                #{order.id.slice(0, 8).toUpperCase()}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{
                fontSize: '0.6rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: statusColor,
                border: `1px solid ${statusColor}`,
                padding: '6px 12px',
              }}>
                {order.status}
              </span>
              <p style={{ fontSize: '0.7rem', color: '#555', marginTop: '0.75rem' }}>
                {new Date(order.createdAt).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        </div>

        {/* Items */}
        <div style={{ marginBottom: '3rem' }}>
          <p style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#888', marginBottom: '1.5rem' }}>
            Items
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {order.items.map((item) => {
              const image = item.product.images.find(i => i.isPrimary)?.url || item.product.images[0]?.url
              return (
                <div key={item.id} style={{
                  display: 'grid',
                  gridTemplateColumns: '80px 1fr auto',
                  gap: '1.5rem',
                  padding: '1.5rem 0',
                  borderBottom: '1px solid #1a1a1a',
                  alignItems: 'center',
                }}>
                  <div style={{ aspectRatio: '3/4', overflow: 'hidden', background: '#111' }}>
                    {image ? (
                      <img src={image} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: '#111' }} />
                    )}
                  </div>
                  <div>
                    <p style={{ fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                      {item.product.name}
                    </p>
                    <p style={{ fontSize: '0.7rem', color: '#888' }}>
                      {item.variant.color} / {item.variant.size}
                    </p>
                    <p style={{ fontSize: '0.7rem', color: '#888', marginTop: '0.25rem' }}>
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#fff' }}>
                    R{Number(item.total).toFixed(2)}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>

          {/* Delivery Address */}
          <div style={{ border: '1px solid #1a1a1a', padding: '1.5rem' }}>
            <p style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#888', marginBottom: '1rem' }}>
              Delivery Address
            </p>
            <p style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem' }}>{order.address.fullName}</p>
            <p style={{ fontSize: '0.75rem', color: '#888', lineHeight: 1.8 }}>
              {order.address.street}<br />
              {order.address.city}, {order.address.province}<br />
              {order.address.postalCode}<br />
              {order.address.country}
            </p>
          </div>

          {/* Order Total */}
          <div style={{ border: '1px solid #1a1a1a', padding: '1.5rem' }}>
            <p style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#888', marginBottom: '1rem' }}>
              Payment Summary
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p style={{ fontSize: '0.75rem', color: '#888' }}>Subtotal</p>
                <p style={{ fontSize: '0.75rem' }}>R{Number(order.subtotal).toFixed(2)}</p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p style={{ fontSize: '0.75rem', color: '#888' }}>Shipping</p>
                <p style={{ fontSize: '0.75rem' }}>
                  {Number(order.shippingCost) === 0 ? 'Free' : `R${Number(order.shippingCost).toFixed(2)}`}
                </p>
              </div>
              {Number(order.discount) > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <p style={{ fontSize: '0.75rem', color: '#888' }}>Discount</p>
                  <p style={{ fontSize: '0.75rem', color: '#4CAF50' }}>-R{Number(order.discount).toFixed(2)}</p>
                </div>
              )}
              <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between' }}>
                <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>Total</p>
                <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>R{Number(order.total).toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tracking */}
        {order.trackingNumber && (
          <div style={{ border: '1px solid #1a1a1a', padding: '1.5rem', marginBottom: '3rem' }}>
            <p style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#888', marginBottom: '0.5rem' }}>
              Tracking Number
            </p>
            <p style={{ fontSize: '0.9rem', fontFamily: 'monospace', color: '#fff' }}>
              {order.trackingNumber}
            </p>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link
            to="/orders"
            style={{
              padding: '1rem 2rem',
              border: '1px solid #333',
              color: '#888',
              textDecoration: 'none',
              fontSize: '0.65rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}
          >
            All Orders
          </Link>
          <Link
            to="/products"
            style={{
              padding: '1rem 2rem',
              background: '#ffffff',
              color: '#0a0a0a',
              textDecoration: 'none',
              fontSize: '0.65rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              fontWeight: 600,
            }}
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}