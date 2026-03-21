import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

interface Product {
  id: string
  name: string
  slug: string
  gender: string
  images: { url: string; isPrimary: boolean }[]
  variants: { price: number; salePrice: number | null }[]
  collection: { name: string } | null
}

interface SearchModalProps {
  open: boolean
  onClose: () => void
}

const SearchIcon = ({ size = 18, color = '#555' }: { size?: number; color?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ flexShrink: 0 }}
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

export default function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      setQuery('')
      setResults([])
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await api.get(`/products/search?q=${encodeURIComponent(query)}`)
        setResults(res.data)
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 300)
  }, [query])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  if (!open) return null

  return (
    <>
      <style>{`
        .search-modal-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 1px;
          background: #1a1a1a;
        }
        @media (max-width: 480px) {
          .search-modal-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          zIndex: 2000,
          backdropFilter: 'blur(4px)',
        }}
      />

      {/* Modal */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        boxSizing: 'border-box',
        zIndex: 2001,
        background: '#0a0a0a',
        borderBottom: '1px solid #1a1a1a',
        padding: 'clamp(1rem, 4vw, 1.5rem) clamp(1rem, 4vw, 2rem)',
        maxHeight: '85vh',
        overflowY: 'auto',
      }}>

        {/* Search input row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          borderBottom: '1px solid #1a1a1a',
          paddingBottom: '1.25rem',
          marginBottom: '1.5rem',
        }}>
          <SearchIcon size={18} color="#555" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search products..."
            style={{
              flex: 1,
              minWidth: 0, // prevents overflow in flex container
              background: 'none',
              border: 'none',
              outline: 'none',
              color: '#ffffff',
              fontSize: '1rem',
              letterSpacing: '0.05em',
              fontFamily: 'inherit',
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{
                background: 'none',
                border: 'none',
                color: '#555',
                cursor: 'pointer',
                fontSize: '0.65rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                padding: '4px 6px',
                flexShrink: 0,
              }}
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: '1px solid #1a1a1a',
              color: '#888',
              cursor: 'pointer',
              fontSize: '0.65rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              padding: '6px 10px',
              transition: 'all 0.2s',
              flexShrink: 0,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#fff'
              e.currentTarget.style.color = '#fff'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#1a1a1a'
              e.currentTarget.style.color = '#888'
            }}
          >
            Close
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <p style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#555', padding: '1rem 0' }}>
            Searching...
          </p>
        )}

        {/* No results */}
        {!loading && query && results.length === 0 && (
          <div style={{ padding: '2rem 0' }}>
            <p style={{ fontSize: '0.75rem', color: '#555' }}>
              No results for <span style={{ color: '#888' }}>"{query}"</span>
            </p>
            <p style={{ fontSize: '0.7rem', color: '#444', marginTop: '0.5rem' }}>
              Try a different search term or browse our collections.
            </p>
          </div>
        )}

        {/* Results */}
        {!loading && results.length > 0 && (
          <div>
            <p style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#555', marginBottom: '1.25rem' }}>
              {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
            </p>
            <div className="search-modal-grid">
              {results.map(product => {
                const image = product.images.find(i => i.isPrimary)?.url || product.images[0]?.url
                const price = product.variants[0]?.salePrice ?? product.variants[0]?.price
                return (
                  <Link
                    key={product.id}
                    to={`/products/${product.slug}`}
                    onClick={onClose}
                    style={{ textDecoration: 'none', color: 'inherit', background: '#0a0a0a', display: 'block' }}
                  >
                    <div style={{ aspectRatio: '3/4', overflow: 'hidden', background: '#111', position: 'relative' }}>
                      {image
                        ? (
                          <img
                            src={image}
                            alt={product.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                            onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                          />
                        )
                        : <div style={{ width: '100%', height: '100%', background: '#111' }} />
                      }
                    </div>
                    <div style={{ padding: '0.75rem', background: '#0a0a0a' }}>
                      <p style={{ fontSize: '0.7rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#fff', marginBottom: '0.25rem' }}>
                        {product.name}
                      </p>
                      <p style={{ fontSize: '0.65rem', color: '#555' }}>
                        {product.collection?.name || product.gender}
                      </p>
                      {price && (
                        <p style={{ fontSize: '0.7rem', color: '#888', marginTop: '0.25rem' }}>
                          R{Number(price).toFixed(2)}
                        </p>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* Empty state — popular searches */}
        {!query && (
          <div>
            <p style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#555', marginBottom: '1rem' }}>
              Popular Searches
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {['Joggers', 'Tee', 'Dress', 'Cap', 'Cargo'].map(term => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  style={{
                    background: 'none',
                    border: '1px solid #1a1a1a',
                    color: '#888',
                    padding: '0.5rem 1rem',
                    fontSize: '0.65rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = '#fff'
                    e.currentTarget.style.color = '#fff'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = '#1a1a1a'
                    e.currentTarget.style.color = '#888'
                  }}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}