import { create } from 'zustand'
import { getSiteContent } from '../api/content.api'
import type { SiteContent } from '../api/content.api'

interface ContentStore {
    content: SiteContent | null
    loading: boolean
    fetch: () => Promise<void>
}

export const useContentStore = create<ContentStore>((set) => ({
    content: {
        banner_text: 'Free shipping on orders over R1000 — South Africa wide',
        hero_headline: 'New Arrivals',
        hero_subtext: 'New Season — 2026',
        featured_product_ids: '',
        featured_collection_ids: '',
    } as SiteContent,
    loading: true,
    fetch: async () => {
        try {
            const content = await getSiteContent()
            set({ content, loading: false })
        } catch {
            set({ loading: false })
        }
    },
}))