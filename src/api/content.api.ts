import api from './axios'

export interface SiteContent {
  banner_text: string
  hero_headline: string
  hero_subtext: string
  featured_product_ids: string
  featured_collection_ids: string
  waitlist_mode: string  
}
 

export const getSiteContent = (): Promise<SiteContent> =>
  api.get('/content').then(r => r.data)