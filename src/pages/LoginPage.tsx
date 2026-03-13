import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../api/auth.api'
import { useAuthStore } from '../store/useAuthStore'

export default function LoginPage() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!email || !password) return setError('All fields required')
    setLoading(true)
    setError('')
    try {
      const data = await login(email, password)
      setAuth(data.token, data.user)
      navigate('/')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      background: '#0a0a0a',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>

        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none' }}>
          <p style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: '#ffffff',
            textAlign: 'center',
            marginBottom: '3rem',
          }}>
            FLAWS
          </p>
        </Link>

        <p style={{
          fontSize: '0.65rem',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: '#888',
          textAlign: 'center',
          marginBottom: '2.5rem',
        }}>
          Sign in to your account
        </p>

        {/* Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <p style={labelStyle}>Email</p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="your@email.com"
              style={inputStyle}
            />
          </div>
          <div>
            <p style={labelStyle}>Password</p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="••••••••"
              style={inputStyle}
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <p style={{ fontSize: '0.7rem', color: '#ff6b6b', marginBottom: '1rem', textAlign: 'center' }}>
            {error}
          </p>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%',
            padding: '1.1rem',
            background: '#ffffff',
            color: '#0a0a0a',
            border: 'none',
            fontSize: '0.7rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            marginBottom: '1.5rem',
          }}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        {/* Register link */}
        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#888' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#ffffff', textDecoration: 'none', borderBottom: '1px solid #444' }}>
            Create one
          </Link>
        </p>
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