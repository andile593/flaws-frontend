import { useContentStore } from '../store/useContentStore'

export default function AnnouncementBar() {
  const { content } = useContentStore()

  const text = content?.banner_text || 'Free shipping on orders over R1000 — South Africa wide'

  return (
    <div style={{
      width: '100%',
      backgroundColor: '#ffffff',
      color: '#0a0a0a',
      textAlign: 'center',
      padding: '8px 16px',
      fontSize: '0.7rem',
      letterSpacing: '0.15em',
      textTransform: 'uppercase',
      fontWeight: 500,
    }}>
      {text}
    </div>
  )
}