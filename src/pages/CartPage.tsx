import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCartStore } from '../store/useCartStore'
import { useGuestCartStore } from '../store/useGuestCartStore'
import { useAuthStore } from '../store/useAuthStore'
import { useBreakpoint } from '../hooks/useBreakpoint'

export default function CartPage() {
  const { user } = useAuthStore()
  const { items: serverItems, total, loading, fetchCart, updateItem, removeItem } = useCartStore()
  const { items: guestItems, updateItem: updateGuest, removeItem: removeGuest } = useGuestCartStore()
  const { isMobile } = useBreakpoint()

  const isGuest = !user

  useEffect(() => {
    if (user) fetchCart()
  }, [user])

  const shipping = Number(total) >= 1000 ? 0 : 100
  const orderTotal = Number(total) + shipping

  // Guest totals
  const guestSubtotal = guestItems.reduce((sum, item) => {
    const price = item.variant.salePrice ?? item.variant.price
    return sum + price * item.quantity
  }, 0)
  const guestShipping = guestSubtotal >= 1000 ? 0 : 100
  const guestTotal = guestSubtotal + guestShipping

  if (loading && user) return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', paddingTop: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#888', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Loading...</p>
    </div>
  )

  const isEmpty = isGuest ? guestItems.length === 0 : serverItems.length === 0

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', paddingTop: '64px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: isMobile ? '2rem 1rem' : '4rem 2rem' }}>

        <div style={{ marginBottom: '3rem', borderBottom: '1px solid #1a1a1a', paddingBottom: '2rem' }}>
          <p style={{ fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#888', marginBottom: '0.5rem' }}>
            Your Selection
          </p>
          <h1 style={{ fontSize: isMobile ? '1.5rem' : '2rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Cart {!isEmpty && `(${isGuest ? guestItems.length : serverItems.length})`}
          </h1>
        </div>

        {isEmpty ? (
          <div style={{ textAlign: 'center', padding: '6rem 0' }}>
            <p style={{ color: '#888', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '2rem' }}>
              Your cart is empty
            </p>
            <Link to="/products" style={{ padding: '1rem 3rem', border: '1px solid #ffffff', color: '#ffffff', textDecoration: 'none', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              Shop Now
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '2rem' : '4rem', alignItems: 'flex-start' }}>

            {/* Items */}
            <div style={{ flex: 1, width: '100%' }}>
              {(isGuest ? guestItems : serverItems).map((item: any) => {
                const image = item.product.images.find((i: any) => i.isPrimary)?.url || item.product.images[0]?.url
                const price = item.variant.salePrice ?? item.variant.price

                return (
                  <div key={item.variantId || item.id} style={{ display: 'grid', gridTemplateColumns: isMobile ? '90px 1fr' : '120px 1fr', gap: '1.5rem', padding: '2rem 0', borderBottom: '1px solid #1a1a1a' }}>
                    <Link to={`/products/${item.product.slug}`}>
                      <div style={{ aspectRatio: '3/4', overflow: 'hidden', background: '#111' }}>
                        {image ? <img src={image} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', background: '#111' }} />}
                      </div>
                    </Link>

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
                        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '0.5rem' : '1rem', border: '1px solid #1a1a1a' }}>
                          <button
                            onClick={() => isGuest
                              ? updateGuest(item.variantId, Math.max(1, item.quantity - 1))
                              : updateItem(item.variant.id, Math.max(1, item.quantity - 1))
                            }
                            style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: isMobile ? '6px 10px' : '8px 14px', fontSize: '1rem' }}
                          >−</button>
                          <span style={{ fontSize: '0.75rem', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                          <button
                            onClick={() => isGuest
                              ? updateGuest(item.variantId, Math.min(item.variant.stock, item.quantity + 1))
                              : updateItem(item.variant.id, Math.min(item.variant.stock, item.quantity + 1))
                            }
                            style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: isMobile ? '6px 10px' : '8px 14px', fontSize: '1rem' }}
                          >+</button>
                        </div>
                        <button
                          onClick={() => isGuest ? removeGuest(item.variantId) : removeItem(item.variant.id)}
                          style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}
                        >Remove</button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Summary */}
            <div style={{ width: isMobile ? '100%' : '380px', flexShrink: 0, border: '1px solid #1a1a1a', padding: '2rem', position: isMobile ? 'static' : 'sticky', top: '80px', boxSizing: 'border-box' }}>
              <p style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#888', marginBottom: '1.5rem' }}>
                Order Summary
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <p style={{ fontSize: '0.8rem', color: '#888' }}>Subtotal</p>
                <p style={{ fontSize: '0.8rem' }}>R{isGuest ? guestSubtotal.toFixed(2) : Number(total).toFixed(2)}</p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <p style={{ fontSize: '0.8rem', color: '#888' }}>Shipping</p>
                <p style={{ fontSize: '0.8rem', color: (isGuest ? guestShipping : shipping) === 0 ? '#888' : '#fff' }}>
                  {(isGuest ? guestShipping : shipping) === 0 ? 'Free' : 'R100.00'}
                </p>
              </div>

              {(isGuest ? guestShipping : shipping) > 0 && (
                <p style={{ fontSize: '0.65rem', color: '#555', marginBottom: '1rem' }}>Free shipping on orders over R1000</p>
              )}

              <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: '1rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between' }}>
                <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>Total</p>
                <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                  R{isGuest ? guestTotal.toFixed(2) : orderTotal.toFixed(2)}
                </p>
              </div>

              {/* Guest prompt */}
              {isGuest && (
                <div style={{ background: '#111', border: '1px solid #1a1a1a', padding: '1rem', marginBottom: '1rem', textAlign: 'center' }}>
                  <p style={{ fontSize: '0.7rem', color: '#888', marginBottom: '0.75rem', lineHeight: 1.6 }}>
                    Sign in to complete your purchase. Your cart will be saved.
                  </p>
                  <Link
                    to="/login"
                    style={{ display: 'block', padding: '1rem', background: '#ffffff', color: '#0a0a0a', textDecoration: 'none', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.5rem' }}
                  >
                    Sign In to Checkout
                  </Link>
                  <Link
                    to="/register"
                    style={{ display: 'block', padding: '0.9rem', border: '1px solid #333', color: '#888', textDecoration: 'none', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}
                  >
                    Create Account
                  </Link>
                </div>
              )}

              {!isGuest && (
                <>
                  <Link
                    to="/checkout"
                    style={{ display: 'block', width: '100%', padding: '1.25rem', background: '#ffffff', color: '#0a0a0a', textDecoration: 'none', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600, textAlign: 'center', marginBottom: '1rem', boxSizing: 'border-box' }}
                  >
                    Checkout
                  </Link>
                  <Link
                    to="/products"
                    style={{ display: 'block', textAlign: 'center', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#888', textDecoration: 'none' }}
                  >
                    Continue Shopping
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}