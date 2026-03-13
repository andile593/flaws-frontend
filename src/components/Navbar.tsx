import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import { useBreakpoint } from '../hooks/useBreakpoint'

export default function Navbar() {
  const { user } = useAuthStore()
  const { isMobile } = useBreakpoint()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // close menu on resize to desktop
  useEffect(() => {
    if (!isMobile) setMenuOpen(false)
  }, [isMobile])

  const navLinks = [
    { label: 'Shop', to: '/products' },
    { label: 'Collections', to: '/collections' },
  ]

  return (
    <>
      <nav style={{
        position: 'sticky',
        top: 0, left: 0, right: 0,
        zIndex: 1000,
        height: '64px',
        background: scrolled || menuOpen ? 'rgba(10,10,10,0.98)' : 'transparent',
        borderBottom: scrolled || menuOpen ? '1px solid #1a1a1a' : '1px solid transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        padding: '0 2rem',
      }}>

        {/* Left — nav links (desktop) or hamburger (mobile) */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '2rem' }}>
          {isMobile ? (
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', flexDirection: 'column', gap: '5px' }}
            >
              {menuOpen ? (
                <span style={{ color: '#fff', fontSize: '1.2rem', lineHeight: 1 }}>✕</span>
              ) : (
                <>
                  <span style={{ display: 'block', width: '22px', height: '1px', background: '#fff' }} />
                  <span style={{ display: 'block', width: '22px', height: '1px', background: '#fff' }} />
                  <span style={{ display: 'block', width: '22px', height: '1px', background: '#fff' }} />
                </>
              )}
            </button>
          ) : (
            navLinks.map(({ label, to }) => (
              <Link key={to} to={to} style={{
                fontSize: '0.65rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#ffffff',
                textDecoration: 'none',
              }}>
                {label}
              </Link>
            ))
          )}
        </div>

        {/* Center — Logo */}
        <Link to="/" style={{
          fontSize: isMobile ? '1rem' : '1.2rem',
          fontWeight: 900,
          letterSpacing: '0.4em',
          textTransform: 'uppercase',
          color: '#ffffff',
          textDecoration: 'none',
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
        }}>
          FLAWS
        </Link>

        {/* Right — account + cart */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '1.5rem' }}>
          {!isMobile && (
            <Link to={user ? '/account' : '/login'} style={linkStyle}>
              {user ? user.name.split(' ')[0] : 'Login'}
            </Link>
          )}
          <Link to="/cart" style={linkStyle}>Cart</Link>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobile && menuOpen && (
        <div style={{
          position: 'sticky',
          top: '64px', left: 0, right: 0, bottom: 0,
          background: '#0a0a0a',
          zIndex: 999,
          display: 'flex',
          flexDirection: 'column',
          padding: '3rem 2rem',
          borderTop: '1px solid #1a1a1a',
        }}>
          {[...navLinks, { label: user ? 'Account' : 'Login', to: user ? '/account' : '/login' }].map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#ffffff',
                textDecoration: 'none',
                padding: '1.25rem 0',
                borderBottom: '1px solid #1a1a1a',
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </>
  )
}

const linkStyle: React.CSSProperties = {
  fontSize: '0.65rem',
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  color: '#ffffff',
  textDecoration: 'none',
}
