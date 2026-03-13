import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProducts } from '../api/products.api'
import { useBreakpoint } from '../hooks/useBreakpoint'

interface Product {
  id: string
  name: string
  slug: string
  gender: string
  isFeatured: boolean
  images: { url: string; isPrimary: boolean }[]
  variants: { price: number; salePrice: number | null; size: string }[]
  collection: { name: string }
}

export default function ProductsPage() {
  const { isMobile } = useBreakpoint()
  const [products, setProducts] = useState<Product[]>([])
  const [filtered, setFiltered] = useState<Product[]>([])
  const [activeGender, setActiveGender] = useState<'ALL' | 'MEN' | 'WOMEN'>('ALL')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProducts().then((data) => {
      setProducts(data)
      setFiltered(data)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (activeGender === 'ALL') return setFiltered(products)
    setFiltered(products.filter((p) => p.gender === activeGender))
  }, [activeGender, products])

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', paddingTop: '64px' }}>

      {/* Header */}
      <div style={{
        borderBottom: '1px solid #1a1a1a',
        padding: '4rem 2rem 2rem',
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
      }}>
        <div>
          <p style={{ fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#888', marginBottom: '0.5rem' }}>
            The Store
          </p>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            All Products
          </h1>
        </div>
        <p style={{ fontSize: '0.75rem', color: '#888' }}>{filtered.length} pieces</p>
      </div>

      {/* Filters */}
      <div style={{
        borderBottom: '1px solid #1a1a1a',
        padding: '1rem 2rem',
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        gap: '2rem',
      }}>
        {(['ALL', 'MEN', 'WOMEN'] as const).map((g) => (
          <button
            key={g}
            onClick={() => setActiveGender(g)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.65rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: activeGender === g ? '#ffffff' : '#888',
              borderBottom: activeGender === g ? '1px solid #ffffff' : '1px solid transparent',
              paddingBottom: '4px',
              transition: 'all 0.2s',
            }}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '6rem', color: '#888', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            Loading...
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1px',
            background: '#1a1a1a',
          }}>
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
  const [hovered, setHovered] = useState(false)
  const primaryImage = product.images.find((i) => i.isPrimary)?.url || product.images[0]?.url
  const price = product.variants[0]?.salePrice ?? product.variants[0]?.price
  const sizes = [...new Set(product.variants.map((v) => v.size))]

  return (
    <Link to={`/products/${product.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ background: '#0a0a0a', cursor: 'pointer', overflow: 'hidden' }}
      >
        {/* Image */}
        <div style={{ aspectRatio: '3/4', overflow: 'hidden', background: '#111', position: 'relative' }}>
          {primaryImage ? (
            <img
              src={primaryImage}
              alt={product.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.6s ease',
                transform: hovered ? 'scale(1.05)' : 'scale(1)',
              }}
            />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              background: '#111',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#333',
              fontSize: '0.7rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}>
              No Image
            </div>
          )}

          {/* Sizes on hover */}
          {hovered && sizes.length > 0 && (
            <div style={{
              position: 'absolute',
              bottom: '1rem',
              left: '1rem',
              display: 'flex',
              gap: '6px',
            }}>
              {sizes.map((size) => (
                <span key={size} style={{
                  background: 'rgba(10,10,10,0.85)',
                  color: '#fff',
                  fontSize: '0.6rem',
                  letterSpacing: '0.1em',
                  padding: '4px 8px',
                  textTransform: 'uppercase',
                }}>
                  {size}
                </span>
              ))}
            </div>
          )}

          {product.isFeatured && (
            <div style={{
              position: 'absolute',
              top: '1rem',
              left: '1rem',
              background: '#ffffff',
              color: '#0a0a0a',
              fontSize: '0.55rem',
              letterSpacing: '0.15em',
              padding: '4px 8px',
              textTransform: 'uppercase',
              fontWeight: 600,
            }}>
              Featured
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ padding: '1rem', background: '#0a0a0a' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fff', marginBottom: '0.25rem' }}>
                {product.name}
              </p>
              <p style={{ fontSize: '0.65rem', color: '#888', letterSpacing: '0.05em' }}>
                {product.collection?.name}
              </p>
            </div>
            {price && (
              <p style={{ fontSize: '0.75rem', color: '#888', whiteSpace: 'nowrap' }}>
                R{Number(price).toFixed(2)}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}