import { useEffect } from 'react'
import { useBreakpoint } from '../hooks/useBreakpoint'

interface SizeGuideModalProps {
  open: boolean
  onClose: () => void
  gender: string
}

const mensSizes = [
  { size: 'XS', chest: '84-88', waist: '70-74', hips: '84-88', length: '68' },
  { size: 'S',  chest: '88-92', waist: '74-78', hips: '88-92', length: '70' },
  { size: 'M',  chest: '92-96', waist: '78-82', hips: '92-96', length: '72' },
  { size: 'L',  chest: '96-100', waist: '82-86', hips: '96-100', length: '74' },
  { size: 'XL', chest: '100-104', waist: '86-90', hips: '100-104', length: '76' },
  { size: 'XXL', chest: '104-108', waist: '90-94', hips: '104-108', length: '78' },
  { size: 'XXXL', chest: '108-112', waist: '94-98', hips: '108-112', length: '80' },
]

const womensSizes = [
  { size: 'XS', chest: '76-80', waist: '60-64', hips: '84-88', length: '62' },
  { size: 'S',  chest: '80-84', waist: '64-68', hips: '88-92', length: '64' },
  { size: 'M',  chest: '84-88', waist: '68-72', hips: '92-96', length: '66' },
  { size: 'L',  chest: '88-92', waist: '72-76', hips: '96-100', length: '68' },
  { size: 'XL', chest: '92-96', waist: '76-80', hips: '100-104', length: '70' },
  { size: 'XXL', chest: '96-100', waist: '80-84', hips: '104-108', length: '72' },
  { size: 'XXXL', chest: '100-104', waist: '84-88', hips: '108-112', length: '74' },
]

export default function SizeGuideModal({ open, onClose, gender }: SizeGuideModalProps) {
  const { isMobile } = useBreakpoint()
  const sizes = gender === 'WOMEN' ? womensSizes : mensSizes

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

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
          background: 'rgba(0,0,0,0.75)',
          zIndex: 2000,
          backdropFilter: 'blur(4px)',
        }}
      />

      {/* Modal */}
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 2001,
        background: '#0a0a0a',
        border: '1px solid #1a1a1a',
        width: isMobile ? 'calc(100vw - 2rem)' : '640px',
        maxHeight: '85vh',
        overflowY: 'auto',
        padding: isMobile ? '1.5rem' : '2.5rem',
      }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
          <div>
            <p style={{ fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#888', marginBottom: '0.4rem' }}>
              {gender === 'WOMEN' ? "Women's" : "Men's"}
            </p>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Size Guide
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '1rem', padding: '4px', lineHeight: 1 }}
          >
            ✕
          </button>
        </div>

        {/* How to measure */}
        <div style={{ background: '#111', border: '1px solid #1a1a1a', padding: '1.25rem', marginBottom: '2rem' }}>
          <p style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#888', marginBottom: '1rem' }}>
            How to Measure
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {[
              { label: 'Chest', desc: 'Measure around the fullest part of your chest, keeping the tape horizontal.' },
              { label: 'Waist', desc: 'Measure around your natural waistline, at the narrowest part of your torso.' },
              { label: 'Hips', desc: 'Measure around the fullest part of your hips and seat.' },
              { label: 'Length', desc: 'Measure from the top of the shoulder to the hem.' },
            ].map(({ label, desc }) => (
              <div key={label} style={{ display: 'flex', gap: '1rem' }}>
                <span style={{ fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fff', minWidth: '50px' }}>
                  {label}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#888', lineHeight: 1.6 }}>{desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Size table */}
        <p style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#888', marginBottom: '1rem' }}>
          Measurements in centimetres (cm)
        </p>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '400px' }}>
            <thead>
              <tr>
                {['Size', 'Chest', 'Waist', 'Hips', 'Length'].map(h => (
                  <th key={h} style={{
                    fontSize: '0.6rem',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: '#888',
                    padding: '0.75rem',
                    textAlign: 'left',
                    borderBottom: '1px solid #1a1a1a',
                    whiteSpace: 'nowrap',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sizes.map((row, i) => (
                <tr key={row.size} style={{ background: i % 2 === 0 ? 'transparent' : '#0f0f0f' }}>
                  <td style={cellStyle}><strong>{row.size}</strong></td>
                  <td style={cellStyle}>{row.chest}</td>
                  <td style={cellStyle}>{row.waist}</td>
                  <td style={cellStyle}>{row.hips}</td>
                  <td style={cellStyle}>{row.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tip */}
        <p style={{ fontSize: '0.7rem', color: '#555', marginTop: '1.5rem', lineHeight: 1.7 }}>
          If you're between sizes, we recommend sizing up for a relaxed fit or sizing down for a more fitted look.
          Still unsure?{' '}
          <a href="/contact" style={{ color: '#888', textDecoration: 'underline' }}>Contact us</a> and we'll help.
        </p>
      </div>
    </>
  )
}

const cellStyle: React.CSSProperties = {
  fontSize: '0.8rem',
  color: '#ccc',
  padding: '0.9rem 0.75rem',
  borderBottom: '1px solid #111',
}