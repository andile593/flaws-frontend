import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid #1a1a1a', marginTop: '6rem', padding: '4rem 2rem 2rem' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginBottom: '4rem' }}>

          <div>
            <p style={footerHeading}>FLAWS</p>
            <p style={{ fontSize: '0.8rem', color: '#888', lineHeight: 1.8, maxWidth: '240px' }}>
              Premium clothing for those who move with intention. Based in South Africa.
            </p>
          </div>

          <div>
            <p style={footerHeading}>Shop</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link to="/products" style={footerLink}>All Products</Link>
              <Link to="/collections" style={footerLink}>Collections</Link>
            </div>
          </div>

          <div>
            <p style={footerHeading}>Info</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link to="/account" style={footerLink}>My Account</Link>
              <Link to="/orders" style={footerLink}>Orders</Link>
            </div>
          </div>

        </div>

        <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontSize: '0.75rem', color: '#555' }}>© 2026 FLAWS. All rights reserved.</p>
          <p style={{ fontSize: '0.75rem', color: '#555' }}>South Africa</p>
        </div>
      </div>
    </footer>
  )
}

const footerHeading: React.CSSProperties = {
  fontSize: '0.7rem',
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  color: '#ffffff',
  marginBottom: '1.25rem',
  fontWeight: 600,
}

const footerLink: React.CSSProperties = {
  fontSize: '0.8rem',
  color: '#888',
  textDecoration: 'none',
}