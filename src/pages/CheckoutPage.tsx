import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCartStore } from '../store/useCartStore'
import { useBreakpoint } from '../hooks/useBreakpoint'
import { getAddresses, addAddress } from '../api/address.api'
import { createOrder } from '../api/orders.api'

interface Address {
  id: string
  fullName: string
  street: string
  city: string
  province: string
  postalCode: string
  country: string
  isDefault: boolean
}

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { isMobile } = useBreakpoint()
  const { items, total, fetchCart } = useCartStore()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddress, setSelectedAddress] = useState<string>('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    fullName: '',
    street: '',
    city: '',
    province: '',
    postalCode: '',
    country: 'South Africa',
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }
    fetchCart()
    getAddresses().then((data) => {
      setAddresses(data)
      if (data.length > 0) setSelectedAddress(data[0].id)
      else setShowAddForm(true)
    })
  }, [])

  const handleAddAddress = async () => {
    if (!form.fullName || !form.street || !form.city || !form.province || !form.postalCode) {
      return setError('All address fields are required')
    }
    try {
      const newAddress = await addAddress(form)
      setAddresses((prev) => [...prev, newAddress])
      setSelectedAddress(newAddress.id)
      setShowAddForm(false)
      setError('')
    } catch {
      setError('Failed to save address')
    }
  }

  const handlePlaceOrder = async () => {
    if (!selectedAddress) return setError('Please select a delivery address')
    if (items.length === 0) return setError('Your cart is empty')
    setPlacing(true)
    setError('')
    try {
      const order = await createOrder(selectedAddress)
      await fetchCart()
      navigate(`/orders/${order.id}`)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to place order')
    } finally {
      setPlacing(false)
    }
  }

  const shipping = Number(total) >= 1000 ? 0 : 100
  const orderTotal = Number(total) + shipping

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', paddingTop: '64px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: isMobile ? '2rem 1rem' : '4rem 2rem' }}>

        {/* Header */}
        <div style={{ marginBottom: '3rem', borderBottom: '1px solid #1a1a1a', paddingBottom: '2rem' }}>
          <p style={{ fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#888', marginBottom: '0.5rem' }}>
            Final Step
          </p>
          <h1 style={{ fontSize: isMobile ? '1.5rem' : '2rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Checkout
          </h1>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '2rem' : '4rem',
          alignItems: 'flex-start',
        }}>

          {/* Left — Address */}
          <div style={{ flex: 1, width: '100%' }}>
            <p style={{ fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#888', marginBottom: '1.5rem' }}>
              Delivery Address
            </p>

            {addresses.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    onClick={() => setSelectedAddress(address.id)}
                    style={{
                      padding: '1.5rem',
                      border: selectedAddress === address.id ? '1px solid #ffffff' : '1px solid #1a1a1a',
                      cursor: 'pointer',
                      transition: 'border 0.2s',
                    }}
                  >
                    <p style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem' }}>{address.fullName}</p>
                    <p style={{ fontSize: '0.75rem', color: '#888', lineHeight: 1.6 }}>
                      {address.street}, {address.city}<br />
                      {address.province}, {address.postalCode}<br />
                      {address.country}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {!showAddForm ? (
              <button
                onClick={() => setShowAddForm(true)}
                style={{
                  background: 'none',
                  border: '1px solid #333',
                  color: '#888',
                  padding: '0.75rem 1.5rem',
                  fontSize: '0.65rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                + Add New Address
              </button>
            ) : (
              <div style={{ border: '1px solid #1a1a1a', padding: isMobile ? '1.5rem' : '2rem', marginTop: '1rem' }}>
                <p style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#888', marginBottom: '1.5rem' }}>
                  New Address
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {[
                    { key: 'fullName', label: 'Full Name', placeholder: 'John Doe' },
                    { key: 'street', label: 'Street Address', placeholder: '123 Main Street' },
                    { key: 'city', label: 'City', placeholder: 'Johannesburg' },
                    { key: 'province', label: 'Province', placeholder: 'Gauteng' },
                    { key: 'postalCode', label: 'Postal Code', placeholder: '2000' },
                  ].map(({ key, label, placeholder }) => (
                    <div key={key}>
                      <p style={labelStyle}>{label}</p>
                      <input
                        type="text"
                        value={form[key as keyof typeof form]}
                        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                        placeholder={placeholder}
                        style={inputStyle}
                      />
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={handleAddAddress}
                    style={{
                      padding: '0.9rem 2rem',
                      background: '#ffffff',
                      color: '#0a0a0a',
                      border: 'none',
                      fontSize: '0.65rem',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Save Address
                  </button>
                  {addresses.length > 0 && (
                    <button
                      onClick={() => setShowAddForm(false)}
                      style={{
                        padding: '0.9rem 2rem',
                        background: 'none',
                        border: '1px solid #333',
                        color: '#888',
                        fontSize: '0.65rem',
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right — Order Summary */}
          <div style={{
            width: isMobile ? '100%' : '380px',
            flexShrink: 0,
            border: '1px solid #1a1a1a',
            padding: '2rem',
            position: isMobile ? 'static' : 'sticky',
            top: '80px',
            boxSizing: 'border-box',
          }}>
            <p style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#888', marginBottom: '1.5rem' }}>
              Order Summary
            </p>

            <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {items.map((item) => {
                const price = item.variant.salePrice ?? item.variant.price
                return (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.product.name}
                      </p>
                      <p style={{ fontSize: '0.65rem', color: '#888' }}>
                        {item.variant.color} / {item.variant.size} × {item.quantity}
                      </p>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: '#888', whiteSpace: 'nowrap' }}>
                      R{(Number(price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                )
              })}
            </div>

            <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p style={{ fontSize: '0.75rem', color: '#888' }}>Subtotal</p>
                <p style={{ fontSize: '0.75rem' }}>R{Number(total).toFixed(2)}</p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p style={{ fontSize: '0.75rem', color: '#888' }}>Shipping</p>
                <p style={{ fontSize: '0.75rem', color: shipping === 0 ? '#888' : '#fff' }}>
                  {shipping === 0 ? 'Free' : 'R100.00'}
                </p>
              </div>
              <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between' }}>
                <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>Total</p>
                <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>R{orderTotal.toFixed(2)}</p>
              </div>
            </div>

            {error && (
              <p style={{ fontSize: '0.7rem', color: '#ff6b6b', marginBottom: '1rem' }}>{error}</p>
            )}

            <button
              onClick={handlePlaceOrder}
              disabled={placing || items.length === 0}
              style={{
                width: '100%',
                padding: '1.25rem',
                background: placing ? '#333' : '#ffffff',
                color: placing ? '#888' : '#0a0a0a',
                border: 'none',
                fontSize: '0.7rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                fontWeight: 600,
                cursor: placing ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s',
              }}
            >
              {placing ? 'Placing Order...' : 'Place Order'}
            </button>

            <p style={{ fontSize: '0.65rem', color: '#555', textAlign: 'center', marginTop: '1rem', lineHeight: 1.6 }}>
              Payment collected on delivery or via Paystack once integrated.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  fontSize: '0.65rem',
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  color: '#888',
  marginBottom: '8px',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.9rem 1rem',
  background: '#111',
  border: '1px solid #1a1a1a',
  color: '#ffffff',
  fontSize: '0.85rem',
  outline: 'none',
  boxSizing: 'border-box',
}