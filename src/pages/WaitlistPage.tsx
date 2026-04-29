import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import flawsLogo from '../assets/flaws-logo.png'

const API = import.meta.env.VITE_API_URL || 'https://flaws-backend-production.up.railway.app'

export default function WaitlistPage() {
  const [form, setForm] = useState({ name: '', email: '', city: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [mounted, setMounted] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    setMounted(true)
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let animFrame: number
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)
    const drawGrain = () => {
      const { width, height } = canvas
      const imageData = ctx.createImageData(width, height)
      const data = imageData.data
      for (let i = 0; i < data.length; i += 4) {
        const val = Math.random() * 255
        data[i] = val; data[i + 1] = val; data[i + 2] = val; data[i + 3] = 8
      }
      ctx.putImageData(imageData, 0, 0)
      animFrame = requestAnimationFrame(drawGrain)
    }
    drawGrain()
    return () => { cancelAnimationFrame(animFrame); window.removeEventListener('resize', resize) }
  }, [])

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.city) {
      setErrorMsg('Please fill in all fields')
      return
    }
    setStatus('loading')
    setErrorMsg('')
    try {
      await axios.post(`${API}/waitlist`, { ...form, province: '', interests: [] })
      setStatus('success')
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Something went wrong')
      setStatus('error')
    }
  }

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      background: '#000000',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    }}>
      {/* The Seasons font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,700&display=swap');
        .seasons-font {
          font-family: 'Playfair Display', 'Georgia', serif;
          font-style: italic;
          font-weight: 700;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Grain overlay */}
      <canvas ref={canvasRef} style={{
        position: 'fixed', top: 0, left: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 0, mixBlendMode: 'overlay',
      }} />

      <div style={{
        position: 'relative', zIndex: 1,
        width: '100%', maxWidth: '480px',
        padding: '2.5rem 1.5rem',
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.8s ease, transform 0.8s ease',
      }}>

        {status === 'success' ? (
          <SuccessState name={form.name} />
        ) : (
          <>
            {/* FLAWS Logo Image */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <img
                src={flawsLogo}
                alt="FLAWS"
                style={{
                  width: '420px', height: 'auto',
                  display: 'block',
                  margin: '0 auto',
                }}
                onError={e => {
                  // Fallback to text logo if image not found
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  const fallback = document.getElementById('logo-fallback')
                  if (fallback) fallback.style.display = 'block'
                }}
              />
              <h1
                id="logo-fallback"
                className="seasons-font"
                style={{
                  display: 'none',
                  margin: 0,
                  fontSize: '3.5rem',
                  color: '#8B0000',
                  letterSpacing: '0.05em',
                }}
              >
                Flaws
              </h1>
            </div>

            {/* Welcome headline */}
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <h2 className="seasons-font" style={{
                margin: '0 0 1rem',
                fontSize: '1.75rem',
                color: '#ffffff',
                lineHeight: 1.3,
                letterSpacing: '0.02em',
              }}>
                Welcome to the FLAWS Family
              </h2>
              <p style={{
                margin: 0,
                fontSize: '0.75rem',
                color: '#666',
                lineHeight: 1.9,
                letterSpacing: '0.03em',
              }}>
                Get early access, exclusive drops, and member pricing<br />
                before we open to the world.
              </p>
            </div>

            {/* Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <p style={labelStyle}>Full name</p>
                <input
                  type="text"
                  placeholder="Your name"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = '#8B0000')}
                  onBlur={e => (e.target.style.borderColor = '#222')}
                />
              </div>
              <div>
                <p style={labelStyle}>Email Address</p>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = '#8B0000')}
                  onBlur={e => (e.target.style.borderColor = '#222')}
                />
              </div>
              <div>
                <p style={labelStyle}>Your city</p>
                <input
                  type="text"
                  placeholder="Johannesburg"
                  value={form.city}
                  onChange={e => setForm({ ...form, city: e.target.value })}
                  style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = '#8B0000')}
                  onBlur={e => (e.target.style.borderColor = '#222')}
                />
              </div>
            </div>

            {errorMsg && (
              <p style={{ fontSize: '0.7rem', color: '#ff6b6b', marginBottom: '1rem', letterSpacing: '0.05em' }}>
                {errorMsg}
              </p>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={status === 'loading'}
              style={{
                width: '100%',
                padding: '1.25rem',
                background: 'transparent',
                color: status === 'loading' ? '#ffffff' : '#8B0000',
                border: '1px solid #8B0000',
                fontSize: '1rem',
                letterSpacing: '0.05em',
                fontWeight: 600,
                cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s',
                fontFamily: 'inherit',
              }}
              onMouseEnter={e => {
                if (status !== 'loading') {
                  (e.target as HTMLButtonElement).style.background = '#8B0000'
                    ; (e.target as HTMLButtonElement).style.color = '#fff'
                }
              }}
              onMouseLeave={e => {
                ; (e.target as HTMLButtonElement).style.background = 'transparent'
                  ; (e.target as HTMLButtonElement).style.color = '#8B0000'
              }}
            >
              {status === 'loading' ? 'Joining...' : 'Join The Family'}
            </button>

            {/* Socials */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '1.5rem',
              marginTop: '2.5rem',
            }}>
              <a
                href="https://instagram.com/flaws"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                style={{ color: '#444', transition: 'color 0.2s', display: 'flex', alignItems: 'center' }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = '#8B0000')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = '#444')}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
                </svg>
              </a>

              <a
                href="https://tiktok.com/@flaws"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                style={{ color: '#444', transition: 'color 0.2s', display: 'flex', alignItems: 'center' }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = '#8B0000')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = '#444')}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z" />
                </svg>
              </a>

              <a
                href="https://x.com/flaws"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
                style={{ color: '#444', transition: 'color 0.2s', display: 'flex', alignItems: 'center' }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = '#8B0000')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = '#444')}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>

            <p style={{
              textAlign: 'center',
              marginTop: '2rem',
              fontSize: '0.55rem',
              color: '#333',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}>
              No spam. Just FLAWS.
            </p>
          </>
        )}
      </div>
    </div>
  )
}

function SuccessState({ name }: { name: string }) {
  return (
    <div style={{ textAlign: 'center', animation: 'fadeIn 0.6s ease' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <img
          src={flawsLogo}
          alt="FLAWS"
          style={{
            width: '420px', height: 'auto',
            display: 'block',
            margin: '0 auto',
          }}
          onError={e => {
            // Fallback to text logo if image not found
            const target = e.target as HTMLImageElement
            target.style.display = 'none'
            const fallback = document.getElementById('logo-fallback')
            if (fallback) fallback.style.display = 'block'
          }}
        />
        <h1
          id="logo-fallback"
          className="seasons-font"
          style={{
            display: 'none',
            margin: 0,
            fontSize: '3.5rem',
            color: '#8B0000',
            letterSpacing: '0.05em',
          }}
        >
          Flaws
        </h1>
      </div>


      <div style={{
        borderTop: '1px solid #1a1a1a',
        borderBottom: '1px solid #1a1a1a',
        padding: '2.5rem 0',
        marginBottom: '2rem',
      }}>
        <p style={{
          margin: '0 0 0.75rem',
          fontSize: '0.6rem',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: '#555',
        }}>
          You're in
        </p>
        <h2 style={{
          margin: '0 0 1rem',
          fontSize: '1.25rem',
          fontWeight: 700,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: '#ffffff',
        }}>
          Welcome to the Family, {name.split(' ')[0]}
        </h2>
        <p style={{
          margin: 0,
          fontSize: '0.75rem',
          color: '#555',
          lineHeight: 1.9,
        }}>
          You'll hear from us before anyone else.
        </p>
      </div>

      <p style={{
        fontSize: '0.6rem',
        color: '#333',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
      }}>
        © 2026 FLAWS — South Africa
      </p>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  margin: '0 0 8px',
  fontSize: '0.7rem',
  letterSpacing: '0.05em',
  color: '#888',
  fontWeight: 400,
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.9rem 1rem',
  background: 'transparent',
  border: '1px solid #222',
  borderBottom: '1px solid #444',
  color: '#ffffff',
  fontSize: '0.9rem',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s',
  fontFamily: 'inherit',
}