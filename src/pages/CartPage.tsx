import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCartStore } from '../store/useCartStore'
import { useBreakpoint } from '../hooks/useBreakpoint'

export default function CartPage() {
  const { items, total, loading, fetchCart, updateItem, removeItem } = useCartStore()
  const navigate = useNavigate()
  const { isMobile } = useBreakpoint()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }
    fetchCart()
  }, [])

  if (loading) return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', paddingTop: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#888', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Loading...</p>
    </div>
  )

  const shipping = Number(total) >= 1000 ? 0 : 100
  const orderTotal = Number(total) + shipping

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', paddingTop: '64px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: isMobile ? '2rem 1rem' : '4rem 2rem' }}>

        {/* Header */}
        <div style={{ marginBottom: '3rem', borderBottom: '1px solid #1a1a1a', paddingBottom: '2rem' }}>
          <p style={{ fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#888', marginBottom: '0.5rem' }}>
            Your Selection
          </p>
          <h1 style={{ fontSize: isMobile ? '1.5rem' : '2rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Cart {items.length > 0 && `(${items.length})`}
          </h1>
        </div>

        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '6rem 0' }}>
            <p style={{ color: '#888', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '2rem' }}>
              Your cart is empty
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
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? '2rem' : '4rem',
            alignItems: 'flex-start',
          }}>

            {/* Items */}
            <div style={{ flex: 1, width: '100%' }}>
              {items.map((item) => {
                const image = item.product.images.find(i => i.isPrimary)?.url || item.product.images[0]?.url
                const price = item.variant.salePrice ?? item.variant.price

                return (
                  <div key={item.id} style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '90px 1fr' : '120px 1fr',
                    gap: '1.5rem',
                    padding: '2rem 0',
                    borderBottom: '1px solid #1a1a1a',
                  }}>
                    {/* Image */}
                    <Link to={`/products/${item.product.slug}`}>
                      <div style={{ aspectRatio: '3/4', overflow: 'hidden', background: '#111' }}>
                        {image ? (
                          <img src={image} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', background: '#111' }} />
                        )}
                      </div>
                    </Link>

                    {/* Details */}
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <Link to={`/products/${item.product.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <p style={{ fontSize: isMobile ? '0.7rem' : '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                            {item.product.name}
                          </p>
                        </Link>
                        <p style={{ fontSize: '0.7rem', color: '#888', marginBottom: '0.25rem' }}>
                          {item.variant.color} / {item.variant.size}
                        </p>
                        <p style={{ fontSize: '0.8rem', color: '#fff' }}>
                          R{Number(price).toFixed(2)}
                        </p>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {/* Quantity */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '0.5rem' : '1rem', border: '1px solid #1a1a1a' }}>
                          <button
                            onClick={() => updateItem(item.variant.id, Math.max(1, item.quantity - 1))}
                            style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: isMobile ? '6px 10px' : '8px 14px', fontSize: '1rem' }}
                          >
                            −
                          </button>
                          <span style={{ fontSize: '0.75rem', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                          <button
                            onClick={() => updateItem(item.variant.id, Math.min(item.variant.stock, item.quantity + 1))}
                            style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: isMobile ? '6px 10px' : '8px 14px', fontSize: '1rem' }}
                          >
                            +
                          </button>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => removeItem(item.variant.id)}
                          style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Summary */}
            <div style={{
              width: isMobile ? '100%' : '380px',
              flexShrink: 0,
              border: '1px solid #1a1a1a',
              padding: '2rem',
              position: isMobile ? 'static' : 'sticky',
              top: '80px',
            }}>
              <p style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#888', marginBottom: '1.5rem' }}>
                Order Summary
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <p style={{ fontSize: '0.8rem', color: '#888' }}>Subtotal</p>
                <p style={{ fontSize: '0.8rem' }}>R{Number(total).toFixed(2)}</p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <p style={{ fontSize: '0.8rem', color: '#888' }}>Shipping</p>
                <p style={{ fontSize: '0.8rem', color: shipping === 0 ? '#888' : '#fff' }}>
                  {shipping === 0 ? 'Free' : 'R100.00'}
                </p>
              </div>

              {shipping > 0 && (
                <p style={{ fontSize: '0.65rem', color: '#555', marginBottom: '1rem' }}>
                  Free shipping on orders over R1000
                </p>
              )}

              <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: '1rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between' }}>
                <p style={{ fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em' }}>Total</p>
                <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                  R{orderTotal.toFixed(2)}
                </p>
              </div>

              <Link
                to="/checkout"
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '1.25rem',
                  background: '#ffffff',
                  color: '#0a0a0a',
                  textDecoration: 'none',
                  fontSize: '0.7rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  textAlign: 'center',
                  marginBottom: '1rem',
                  boxSizing: 'border-box',
                }}
              >
                Checkout
              </Link>

              <Link
                to="/products"
                style={{
                  display: 'block',
                  textAlign: 'center',
                  fontSize: '0.65rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: '#888',
                  textDecoration: 'none',
                }}
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}