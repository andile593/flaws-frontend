// pages/PaymentSuccessPage.tsx
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { verifyPayment } from '../api/payment.api'
import { useCartStore } from '../store/useCartStore'

export default function PaymentSuccessPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { fetchCart } = useCartStore()
  const [status, setStatus] = useState<'loading' | 'error'>('loading')

  useEffect(() => {
    const reference = searchParams.get('reference')
    if (!reference) {
      navigate('/')
      return
    }

    verifyPayment(reference)
      .then(async (result) => {
        await fetchCart()
        navigate(`/orders/${result.orderId}`, { replace: true })
      })
      .catch(() => setStatus('error'))
  }, [])

  if (status === 'error') {
    return (
      <div style={{ background: '#0a0a0a', minHeight: '100vh', paddingTop: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#888', marginBottom: '1rem' }}>
            Something went wrong
          </p>
          <p style={{ fontSize: '0.8rem', color: '#ff6b6b', marginBottom: '2rem' }}>
            Payment may have succeeded but we couldn't confirm your order. Contact support with your reference.
          </p>
          <button
            onClick={() => navigate('/')}
            style={{ padding: '0.9rem 2rem', background: '#fff', color: '#0a0a0a', border: 'none', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer' }}
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', paddingTop: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#888', marginBottom: '1rem' }}>
          Confirming your order...
        </p>
        <div style={{ width: '32px', height: '32px', border: '2px solid #333', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    </div>
  )
}