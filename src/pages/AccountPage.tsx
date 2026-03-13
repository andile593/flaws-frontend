import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import { getAddresses, addAddress } from '../api/address.api'

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

export default function AccountPage() {
  const navigate = useNavigate()
  const { user, logout, fetchMe } = useAuthStore()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses'>('profile')
  const [form, setForm] = useState({
    fullName: '',
    street: '',
    city: '',
    province: '',
    postalCode: '',
    country: 'South Africa',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }
    fetchMe()
    getAddresses().then(setAddresses)
  }, [])

  const handleAddAddress = async () => {
    if (!form.fullName || !form.street || !form.city || !form.province || !form.postalCode) {
      return setError('All fields are required')
    }
    try {
      const newAddress = await addAddress(form)
      setAddresses((prev) => [...prev, newAddress])
      setShowAddForm(false)
      setForm({ fullName: '', street: '', city: '', province: '', postalCode: '', country: 'South Africa' })
      setSuccess('Address saved')
      setError('')
      setTimeout(() => setSuccess(''), 3000)
    } catch {
      setError('Failed to save address')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', paddingTop: '64px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '4rem 2rem' }}>

        {/* Header */}
        <div style={{ marginBottom: '3rem', borderBottom: '1px solid #1a1a1a', paddingBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <p style={{ fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#888', marginBottom: '0.5rem' }}>
              My Account
            </p>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              {user?.name || 'Account'}
            </h1>
          </div>
          <button
            onClick={handleLogout}
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
            Sign Out
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid #1a1a1a', marginBottom: '2.5rem' }}>
          {(['profile', 'addresses'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.65rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: activeTab === tab ? '#ffffff' : '#888',
                borderBottom: activeTab === tab ? '1px solid #ffffff' : '1px solid transparent',
                paddingBottom: '1rem',
                marginBottom: '-1px',
                transition: 'all 0.2s',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '480px' }}>
              <div style={{ border: '1px solid #1a1a1a', padding: '1.5rem' }}>
                <p style={labelStyle}>Name</p>
                <p style={{ fontSize: '0.85rem', color: '#fff' }}>{user?.name}</p>
              </div>
              <div style={{ border: '1px solid #1a1a1a', padding: '1.5rem' }}>
                <p style={labelStyle}>Email</p>
                <p style={{ fontSize: '0.85rem', color: '#fff' }}>{user?.email}</p>
              </div>
              {user?.phone && (
                <div style={{ border: '1px solid #1a1a1a', padding: '1.5rem' }}>
                  <p style={labelStyle}>Phone</p>
                  <p style={{ fontSize: '0.85rem', color: '#fff' }}>{user.phone}</p>
                </div>
              )}
            </div>

            <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #1a1a1a' }}>
              <Link
                to="/orders"
                style={{
                  display: 'inline-block',
                  padding: '1rem 2rem',
                  border: '1px solid #333',
                  color: '#888',
                  textDecoration: 'none',
                  fontSize: '0.65rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                }}
              >
                View Order History →
              </Link>
            </div>
          </div>
        )}

        {/* Addresses Tab */}
        {activeTab === 'addresses' && (
          <div>
            {success && (
              <p style={{ fontSize: '0.7rem', color: '#4CAF50', marginBottom: '1.5rem', letterSpacing: '0.1em' }}>
                {success}
              </p>
            )}

            {addresses.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                {addresses.map((address) => (
                  <div key={address.id} style={{ border: '1px solid #1a1a1a', padding: '1.5rem' }}>
                    <p style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.75rem' }}>
                      {address.fullName}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: '#888', lineHeight: 1.8 }}>
                      {address.street}<br />
                      {address.city}, {address.province}<br />
                      {address.postalCode}<br />
                      {address.country}
                    </p>
                    {address.isDefault && (
                      <span style={{
                        display: 'inline-block',
                        marginTop: '0.75rem',
                        fontSize: '0.55rem',
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        color: '#fff',
                        border: '1px solid #333',
                        padding: '3px 8px',
                      }}>
                        Default
                      </span>
                    )}
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
                  padding: '0.9rem 1.5rem',
                  fontSize: '0.65rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                + Add New Address
              </button>
            ) : (
              <div style={{ border: '1px solid #1a1a1a', padding: '2rem', maxWidth: '480px' }}>
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

                {error && (
                  <p style={{ fontSize: '0.7rem', color: '#ff6b6b', marginTop: '1rem' }}>{error}</p>
                )}

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
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
                  <button
                    onClick={() => { setShowAddForm(false); setError('') }}
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
                </div>
              </div>
            )}
          </div>
        )}
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
}