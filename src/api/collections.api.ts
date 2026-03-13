import api from './axios'

export const getCollections = () => api.get('/collections').then(r => r.data)
export const getCollectionBySlug = (slug: string) => api.get(`/collections/${slug}`).then(r => r.data)