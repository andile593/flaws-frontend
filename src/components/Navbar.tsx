import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import { useGuestCartStore } from '../store/useGuestCartStore'
import { useBreakpoint } from '../hooks/useBreakpoint'
import { useCartStore } from '../store/useCartStore'
import SearchModal from './SearchModal'

export default function Navbar() {
  const { user } = useAuthStore()
  const { items: serverItems } = useCartStore()
  const { items: guestItems } = useGuestCartStore()
  const { isMobile } = useBreakpoint()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  useEffect(() => {
    if (!isMobile) setMenuOpen(false)
  }, [isMobile])

  const cartCount = user ? serverItems.length : guestItems.length

  const navLinks = [
    { label: 'Shop', to: '/products' },
    { label: 'Collections', to: '/collections' },
  ]

  return (
    <>
      <nav style={{
        position: 'fixed',
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

        {/* Left */}
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
              <Link key={to} to={to} style={linkStyle}>{label}</Link>
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

        {/* Right */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '1.5rem' }}>
          {!isMobile && (
            <Link to={user ? '/account' : '/login'} style={linkStyle}>
              {user ? (user.name?.split(' ')[0] || 'Account') : 'Login'}
            </Link>
          )}
          <button
            onClick={() => setSearchOpen(true)}
            style={{
              background: 'none',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              fontSize: '1.1rem',
              lineHeight: 1,
            }}
            aria-label="Search"
          >
            ⌕
          </button>
          <Link to="/cart" style={linkStyle}>
            Cart{cartCount > 0 ? ` (${cartCount})` : ''}
          </Link>
        </div>
      </nav>

      {/* Search Modal — outside nav so it's not clipped */}
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Mobile Menu Overlay */}
      {isMobile && menuOpen && (
        <div style={{
          position: 'fixed',
          top: '64px', left: 0, right: 0, bottom: 0,
          background: '#0a0a0a',
          zIndex: 999,
          display: 'flex',
          flexDirection: 'column',
          padding: '3rem 2rem',
          borderTop: '1px solid #1a1a1a',
          overflowY: 'auto',
        }}>
          {navLinks.map(({ label, to }) => (
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

          {/* Search in mobile menu */}
          <button
            onClick={() => { setMenuOpen(false); setSearchOpen(true) }}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: '1px solid #1a1a1a',
              color: '#ffffff',
              cursor: 'pointer',
              fontSize: '1.5rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              padding: '1.25rem 0',
              textAlign: 'left',
              width: '100%',
            }}
          >
            Search
          </button>

          {/* Account / Login */}
          <Link
            to={user ? '/account' : '/login'}
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
            {user ? (user.name?.split(' ')[0] || 'Account') : 'Login'}
          </Link>
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