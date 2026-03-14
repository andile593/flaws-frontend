import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from '../api/axios'
import { useBreakpoint } from '../hooks/useBreakpoint'
import { useContentStore } from '../store/useContentStore'

interface Product {
  id: string
  name: string
  slug: string
  isFeatured: boolean
  images: { url: string; isPrimary: boolean }[]
  variants: { price: number; salePrice: number | null }[]
}

export default function HomePage() {
  const { isMobile } = useBreakpoint()
  const { content } = useContentStore()
  const [featured, setFeatured] = useState<Product[]>([])

  useEffect(() => {
    axios.get('/products').then((res) => {
      const allProducts: Product[] = res.data

      const featuredIds = content?.featured_product_ids
        ? content.featured_product_ids.split(',').filter(Boolean)
        : []

      if (featuredIds.length > 0) {
        const ordered = featuredIds
          .map((id: string) => allProducts.find(p => p.id === id))
          .filter(Boolean) as Product[]
        setFeatured(ordered.length > 0 ? ordered : allProducts.filter(p => p.isFeatured))
      } else {
        setFeatured(allProducts.filter(p => p.isFeatured))
      }
    })
  }, [content])

  const heroHeadline = content?.hero_headline || 'FLAWS'
  const heroSubtext = content?.hero_subtext || 'New Season — 2026'

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh' }}>

      {/* Hero */}
      <div style={{
        height: '100svh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isMobile ? '0 1.5rem' : '0 4rem',
        textAlign: 'center',
      }}>
        <p style={{
          fontSize: isMobile ? '0.6rem' : '0.7rem',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: '#888',
          marginBottom: '1.5rem',
        }}>
          {heroSubtext}
        </p>
        <h1 style={{
          fontSize: isMobile ? 'clamp(3rem, 15vw, 5rem)' : 'clamp(4rem, 10vw, 9rem)',
          fontWeight: 900,
          letterSpacing: isMobile ? '0.1em' : '0.2em',
          textTransform: 'uppercase',
          lineHeight: 0.9,
          marginBottom: '2rem',
        }}>
          {heroHeadline}
        </h1>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/products" style={{
            padding: isMobile ? '0.9rem 2rem' : '1rem 3rem',
            background: '#ffffff',
            color: '#0a0a0a',
            textDecoration: 'none',
            fontSize: '0.65rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            fontWeight: 600,
          }}>
            Shop Now
          </Link>
          <Link to="/collections" style={{
            padding: isMobile ? '0.9rem 2rem' : '1rem 3rem',
            border: '1px solid #ffffff',
            color: '#ffffff',
            textDecoration: 'none',
            fontSize: '0.65rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
          }}>
            Collections
          </Link>
        </div>
      </div>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section style={{ padding: isMobile ? '3rem 1rem' : '6rem 2rem', maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '3rem',
          }}>
            <div>
              <p style={{ fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#888', marginBottom: '0.5rem' }}>
                Selected Pieces
              </p>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Featured
              </h2>
            </div>
            <Link to="/products" style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#888', textDecoration: 'none', borderBottom: '1px solid #888', paddingBottom: '2px' }}>
              View All
            </Link>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1px',
            background: '#1a1a1a',
          }}>
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Collections Banner */}
      <section style={{ padding: isMobile ? '3rem 1rem' : '6rem 2rem', borderTop: '1px solid #1a1a1a' }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: '1px',
          background: '#1a1a1a',
        }}>
          <CollectionBanner title="Men's" subtitle="Essentials" href="/collections?gender=MEN" isMobile={isMobile} />
          <CollectionBanner title="Women's" subtitle="Essentials" href="/collections?gender=WOMEN" isMobile={isMobile} />
        </div>
      </section>

      {/* Brand Statement */}
      <section style={{ padding: isMobile ? '4rem 1.5rem' : '8rem 2rem', borderTop: '1px solid #1a1a1a', textAlign: 'center' }}>
        <p style={{
          fontSize: isMobile ? '1.3rem' : 'clamp(1.5rem, 4vw, 3rem)',
          fontWeight: 300,
          letterSpacing: '0.05em',
          color: '#ffffff',
          maxWidth: '800px',
          margin: '0 auto',
          lineHeight: 1.5,
        }}>
          Designed for those who find beauty in imperfection.
        </p>
        <div style={{ width: '40px', height: '1px', background: '#888', margin: '2rem auto 0' }} />
      </section>
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
  const [hovered, setHovered] = useState(false)
  const primaryImage = product.images.find((i) => i.isPrimary)?.url || product.images[0]?.url
  const price = product.variants[0]?.salePrice ?? product.variants[0]?.price

  return (
    <Link to={`/products/${product.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ background: '#0a0a0a', cursor: 'pointer', overflow: 'hidden' }}
      >
        <div style={{ aspectRatio: '3/4', overflow: 'hidden', background: '#111' }}>
          {primaryImage ? (
            <img src={primaryImage} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease', transform: hovered ? 'scale(1.05)' : 'scale(1)' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              No Image
            </div>
          )}
        </div>
        <div style={{ padding: '1rem' }}>
          <p style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#ffffff', marginBottom: '0.25rem' }}>
            {product.name}
          </p>
          {price && <p style={{ fontSize: '0.75rem', color: '#888' }}>R{Number(price).toFixed(2)}</p>}
        </div>
      </div>
    </Link>
  )
}

function CollectionBanner({ title, subtitle, href, isMobile }: { title: string; subtitle: string; href: string; isMobile: boolean }) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link to={href} style={{ textDecoration: 'none' }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: hovered ? '#111' : '#0a0a0a',
          padding: isMobile ? '3rem 1.5rem' : '6rem 3rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          minHeight: isMobile ? '220px' : '400px',
          transition: 'background 0.3s ease',
          cursor: 'pointer',
        }}
      >
        <p style={{ fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#888', marginBottom: '0.5rem' }}>
          {subtitle}
        </p>
        <h3 style={{ fontSize: isMobile ? '2rem' : '2.5rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#ffffff' }}>
          {title}
        </h3>
        <p style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#888', marginTop: '1.5rem' }}>
          Shop Now →
        </p>
      </div>
    </Link>
  )
}