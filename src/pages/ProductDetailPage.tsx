import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProductBySlug } from '../api/products.api'
import { useBreakpoint } from '../hooks/useBreakpoint'
import api from '../api/axios'
import { useGuestCartStore } from '../store/useGuestCartStore'
import { useAuthStore } from '../store/useAuthStore'

interface Variant {
  id: string
  size: string
  color: string
  colorHex: string
  price: number
  salePrice: number | null
  stock: number
}

interface Product {
  id: string
  name: string
  slug: string
  description: string
  gender: string
  isFeatured: boolean
  collection: { name: string; slug: string }
  images: { id: string; url: string; isPrimary: boolean; position: number }[]
  variants: Variant[]
}

export default function ProductDetailPage() {
  const { slug } = useParams()
  const { addItem: addToGuestCart } = useGuestCartStore()
  const { user } = useAuthStore()
  const { isMobile } = useBreakpoint()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!slug) return
    getProductBySlug(slug).then((data) => {
      setProduct(data)
      setSelectedVariant(data.variants[0] || null)
      setLoading(false)
    })
  }, [slug])

  const sortedImages = product?.images.sort((a, b) => a.position - b.position) || []
  const colors = [...new Map(product?.variants.map((v) => [v.color, v]) || []).values()]
  const selectedColor = selectedVariant?.color
  const sizesForColor = product?.variants.filter((v) => v.color === selectedColor) || []


  const handleAddToCart = async () => {
    if (!selectedVariant) return setError('Please select a size')

    setAdding(true)
    setError('')

    try {
      if (user) {
        // Logged in — add to server cart
        await api.post('/cart', {
          productId: product!.id,
          variantId: selectedVariant.id,
          quantity,
        })
      } else {
        // Guest — add to local cart
        addToGuestCart({
          productId: product!.id,
          variantId: selectedVariant.id,
          quantity,
          product: {
            name: product!.name,
            slug: product!.slug,
            images: product!.images,
          },
          variant: {
            id: selectedVariant.id,
            size: selectedVariant.size,
            color: selectedVariant.color,
            price: selectedVariant.price,
            salePrice: selectedVariant.salePrice,
            stock: selectedVariant.stock,
          },
        })
      }

      setAdded(true)
      setTimeout(() => setAdded(false), 2500)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add to cart')
    } finally {
      setAdding(false)
    }
  }

  if (loading) return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', paddingTop: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#888', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Loading...</p>
    </div>
  )

  if (!product) return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', paddingTop: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#888', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Product not found</p>
    </div>
  )

  const price = selectedVariant?.salePrice ?? selectedVariant?.price

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', paddingTop: '64px' }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: isMobile ? '1.5rem 1rem' : '2rem',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? '2rem' : '4rem',
        alignItems: 'start',
      }}>

        {/* Images */}
        {isMobile ? (
          // Mobile: main image top, thumbnails below as horizontal strip
          <div style={{ width: '100%' }}>
            <div style={{ aspectRatio: '3/4', overflow: 'hidden', background: '#111', marginBottom: '0.75rem' }}>
              {sortedImages[selectedImage] ? (
                <img
                  src={sortedImages[selectedImage].url}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ width: '100%', height: '100%', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  No Image
                </div>
              )}
            </div>
            {sortedImages.length > 1 && (
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                {sortedImages.map((img, i) => (
                  <div
                    key={img.id}
                    onClick={() => setSelectedImage(i)}
                    style={{
                      width: '64px',
                      flexShrink: 0,
                      aspectRatio: '1',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: selectedImage === i ? '1px solid #ffffff' : '1px solid #1a1a1a',
                      transition: 'border 0.2s',
                    }}
                  >
                    <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          // Desktop: thumbnails left, main image right
          <div style={{ flex: '1.2', display: 'grid', gridTemplateColumns: '80px 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {sortedImages.map((img, i) => (
                <div
                  key={img.id}
                  onClick={() => setSelectedImage(i)}
                  style={{
                    aspectRatio: '1',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: selectedImage === i ? '1px solid #ffffff' : '1px solid #1a1a1a',
                    transition: 'border 0.2s',
                  }}
                >
                  <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
            <div style={{ aspectRatio: '3/4', overflow: 'hidden', background: '#111' }}>
              {sortedImages[selectedImage] ? (
                <img
                  src={sortedImages[selectedImage].url}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ width: '100%', height: '100%', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  No Image
                </div>
              )}
            </div>
          </div>
        )}

        {/* Product Info */}
        <div style={{ flex: 1, paddingTop: isMobile ? 0 : '2rem', minWidth: 0 }}>

          {/* Breadcrumb */}
          <p style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#888', marginBottom: '1.5rem' }}>
            {product.collection?.name} / {product.gender}
          </p>

          {/* Name */}
          <h1 style={{ fontSize: isMobile ? '1.4rem' : '1.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>
            {product.name}
          </h1>

          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <p style={{ fontSize: '1.1rem', fontWeight: 500, color: '#ffffff' }}>
              R{price ? Number(price).toFixed(2) : '—'}
            </p>
            {selectedVariant?.salePrice && (
              <p style={{ fontSize: '0.9rem', color: '#888', textDecoration: 'line-through' }}>
                R{Number(selectedVariant.price).toFixed(2)}
              </p>
            )}
          </div>

          {/* Color */}
          {colors.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <p style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#888', marginBottom: '1rem' }}>
                Color — <span style={{ color: '#fff' }}>{selectedColor}</span>
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                {colors.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => {
                      const first = product.variants.find((v) => v.color === variant.color)
                      if (first) setSelectedVariant(first)
                    }}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: variant.colorHex || '#888',
                      border: selectedColor === variant.color ? '2px solid #ffffff' : '2px solid transparent',
                      outline: selectedColor === variant.color ? '1px solid #888' : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    title={variant.color}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size */}
          <div style={{ marginBottom: '2rem' }}>
            <p style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#888', marginBottom: '1rem' }}>
              Size
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {sizesForColor.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariant(variant)}
                  disabled={variant.stock === 0}
                  style={{
                    padding: '10px 16px',
                    background: 'none',
                    border: selectedVariant?.id === variant.id ? '1px solid #ffffff' : '1px solid #333',
                    color: variant.stock === 0 ? '#444' : selectedVariant?.id === variant.id ? '#ffffff' : '#888',
                    fontSize: '0.65rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    cursor: variant.stock === 0 ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    textDecoration: variant.stock === 0 ? 'line-through' : 'none',
                  }}
                >
                  {variant.size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div style={{ marginBottom: '2rem' }}>
            <p style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#888', marginBottom: '1rem' }}>
              Quantity
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid #1a1a1a', width: 'fit-content' }}>
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '10px 16px', fontSize: '1rem' }}
              >
                −
              </button>
              <span style={{ fontSize: '0.8rem', minWidth: '24px', textAlign: 'center' }}>{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(selectedVariant?.stock || 1, quantity + 1))}
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '10px 16px', fontSize: '1rem' }}
              >
                +
              </button>
            </div>
          </div>

          {/* Stock */}
          {selectedVariant && (
            <p style={{ fontSize: '0.65rem', letterSpacing: '0.1em', color: selectedVariant.stock < 5 ? '#ff6b6b' : '#888', marginBottom: '1.5rem' }}>
              {selectedVariant.stock === 0 ? 'Out of stock' : selectedVariant.stock < 5 ? `Only ${selectedVariant.stock} left` : 'In stock'}
            </p>
          )}

          {/* Error */}
          {error && (
            <p style={{ fontSize: '0.7rem', color: '#ff6b6b', marginBottom: '1rem', letterSpacing: '0.05em' }}>{error}</p>
          )}

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={adding || selectedVariant?.stock === 0}
            style={{
              width: '100%',
              padding: '1.25rem',
              background: added ? '#222' : '#ffffff',
              color: added ? '#888' : '#0a0a0a',
              border: 'none',
              fontSize: '0.7rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              fontWeight: 600,
              cursor: adding || selectedVariant?.stock === 0 ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              marginBottom: '1rem',
            }}
          >
            {adding ? 'Adding...' : added ? 'Added to Cart ✓' : 'Add to Cart'}
          </button>

          {/* Description */}
          <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #1a1a1a' }}>
            <p style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#888', marginBottom: '1rem' }}>
              Details
            </p>
            <p style={{ fontSize: '0.85rem', color: '#888', lineHeight: 1.8 }}>
              {product.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}