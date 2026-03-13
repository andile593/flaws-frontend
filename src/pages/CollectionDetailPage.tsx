import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getCollectionBySlug } from '../api/collections.api'

interface Product {
  id: string
  name: string
  slug: string
  gender: string
  isFeatured: boolean
  images: { url: string; isPrimary: boolean }[]
  variants: { price: number; salePrice: number | null; size: string }[]
}

interface Collection {
  id: string
  name: string
  slug: string
  description: string | null
  imageUrl: string | null
  gender: string
  products: Product[]
}

export default function CollectionDetailPage() {
  const { slug } = useParams()
  const [collection, setCollection] = useState<Collection | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    getCollectionBySlug(slug).then((data) => {
      setCollection(data)
      setLoading(false)
    })
  }, [slug])

  if (loading) return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', paddingTop: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#888', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Loading...</p>
    </div>
  )

  if (!collection) return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', paddingTop: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#888', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Collection not found</p>
    </div>
  )

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
          <Link
            to="/collections"
            style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#555', textDecoration: 'none', display: 'block', marginBottom: '0.75rem' }}
          >
            ← Collections
          </Link>
          <p style={{ fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#888', marginBottom: '0.5rem' }}>
            {collection.gender}
          </p>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {collection.name}
          </h1>
          {collection.description && (
            <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.75rem', maxWidth: '480px', lineHeight: 1.7 }}>
              {collection.description}
            </p>
          )}
        </div>
        <p style={{ fontSize: '0.75rem', color: '#888' }}>{collection.products.length} pieces</p>
      </div>

      {/* Products Grid */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        {collection.products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '6rem' }}>
            <p style={{ color: '#888', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '2rem' }}>
              No products in this collection yet
            </p>
            <Link
              to="/products"
              style={{
                padding: '1rem 3rem',
                border: '1px solid #ffffff',
                color: '#ffffff',
                textDecoration: 'none',
                fontSize: '0.7rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
              }}
            >
              Shop All
            </Link>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1px',
            background: '#1a1a1a',
          }}>
            {collection.products.map((product) => (
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
            <div style={{ width: '100%', height: '100%', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              No Image
            </div>
          )}

          {hovered && sizes.length > 0 && (
            <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', display: 'flex', gap: '6px' }}>
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

        <div style={{ padding: '1rem', background: '#0a0a0a' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <p style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fff' }}>
              {product.name}
            </p>
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