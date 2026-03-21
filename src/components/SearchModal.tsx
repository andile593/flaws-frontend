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
        zIndex: 2001,
        background: '#0a0a0a',
        borderBottom: '1px solid #1a1a1a',
        padding: '1.5rem 2rem',
        maxHeight: '80vh',
        overflowY: 'auto',
      }}>

        {/* Search input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid #1a1a1a', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
          <span style={{ color: '#555', fontSize: '1rem' }}>⌕</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search products..."
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              outline: 'none',
              color: '#ffffff',
              fontSize: '1.1rem',
              letterSpacing: '0.05em',
              fontFamily: 'inherit',
            }}
          />
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '1rem', padding: '4px' }}
          >
            ✕
          </button>
        </div>

        {/* Results */}
        {loading && (
          <p style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#555', padding: '1rem 0' }}>
            Searching...
          </p>
        )}

        {!loading && query && results.length === 0 && (
          <p style={{ fontSize: '0.75rem', color: '#555', padding: '1rem 0' }}>
            No results for "<span style={{ color: '#888' }}>{query}</span>"
          </p>
        )}

        {!loading && results.length > 0 && (
          <div>
            <p style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#555', marginBottom: '1rem' }}>
              {results.length} result{results.length !== 1 ? 's' : ''}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1px', background: '#1a1a1a' }}>
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
                    <div style={{ aspectRatio: '3/4', overflow: 'hidden', background: '#111' }}>
                      {image
                        ? <img src={image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <div style={{ width: '100%', height: '100%', background: '#111' }} />
                      }
                    </div>
                    <div style={{ padding: '0.75rem' }}>
                      <p style={{ fontSize: '0.7rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#fff', marginBottom: '0.25rem' }}>
                        {product.name}
                      </p>
                      <p style={{ fontSize: '0.65rem', color: '#888' }}>
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