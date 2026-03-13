import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getCollections } from '../api/collections.api'

interface Collection {
  id: string
  name: string
  slug: string
  description: string | null
  imageUrl: string | null
  gender: string
  products: { id: string }[]
}

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [filtered, setFiltered] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [searchParams] = useSearchParams()
  const genderParam = searchParams.get('gender')

  useEffect(() => {
    getCollections().then((data) => {
      setCollections(data)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (genderParam) {
      setFiltered(collections.filter((c) => c.gender === genderParam))
    } else {
      setFiltered(collections)
    }
  }, [genderParam, collections])

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
            Browse
          </p>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Collections
          </h1>
        </div>
        <p style={{ fontSize: '0.75rem', color: '#888' }}>{filtered.length} collections</p>
      </div>

      {/* Gender Filter */}
      <div style={{
        borderBottom: '1px solid #1a1a1a',
        padding: '1rem 2rem',
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        gap: '2rem',
      }}>
        {[
          { label: 'All', value: null },
          { label: 'Men', value: 'MEN' },
          { label: 'Women', value: 'WOMEN' },
        ].map(({ label, value }) => {
          const isActive = genderParam === value || (!genderParam && value === null)
          return (
            <Link
              key={label}
              to={value ? `/collections?gender=${value}` : '/collections'}
              style={{
                fontSize: '0.65rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: isActive ? '#ffffff' : '#888',
                textDecoration: 'none',
                borderBottom: isActive ? '1px solid #ffffff' : '1px solid transparent',
                paddingBottom: '4px',
                transition: 'all 0.2s',
              }}
            >
              {label}
            </Link>
          )
        })}
      </div>

      {/* Grid */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '6rem', color: '#888', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            Loading...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '6rem' }}>
            <p style={{ color: '#888', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              No collections found
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
            gap: '1px',
            background: '#1a1a1a',
          }}>
            {filtered.map((collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function CollectionCard({ collection }: { collection: Collection }) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link to={`/collections/${collection.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: hovered ? '#111' : '#0a0a0a',
          transition: 'background 0.3s ease',
          cursor: 'pointer',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Image or placeholder */}
        <div style={{ aspectRatio: '16/9', overflow: 'hidden', background: '#0f0f0f', position: 'relative' }}>
          {collection.imageUrl ? (
            <img
              src={collection.imageUrl}
              alt={collection.name}
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
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#0f0f0f',
            }}>
              <p style={{
                fontSize: 'clamp(2rem, 5vw, 4rem)',
                fontWeight: 700,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#1a1a1a',
              }}>
                {collection.name.charAt(0)}
              </p>
            </div>
          )}

          {/* Gender badge */}
          <div style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'rgba(10,10,10,0.8)',
            color: '#888',
            fontSize: '0.55rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            padding: '4px 10px',
            border: '1px solid #1a1a1a',
          }}>
            {collection.gender}
          </div>
        </div>

        {/* Info */}
        <div style={{
          padding: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        }}>
          <div>
            <p style={{
              fontSize: '0.65rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#888',
              marginBottom: '0.5rem',
            }}>
              {collection.products.length} pieces
            </p>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#ffffff',
              marginBottom: collection.description ? '0.5rem' : 0,
            }}>
              {collection.name}
            </h2>
            {collection.description && (
              <p style={{ fontSize: '0.75rem', color: '#888', maxWidth: '320px', lineHeight: 1.6 }}>
                {collection.description}
              </p>
            )}
          </div>

          <p style={{
            fontSize: '0.65rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: hovered ? '#ffffff' : '#555',
            transition: 'color 0.3s',
            whiteSpace: 'nowrap',
            marginLeft: '1rem',
          }}>
            Shop →
          </p>
        </div>
      </div>
    </Link>
  )
}
