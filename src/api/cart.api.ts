import api from './axios'

export const getCart = () => api.get('/cart').then(r => r.data)
export const addToCart = (data: { productId: string; variantId: string; quantity: number }) =>
  api.post('/cart', data).then(r => r.data)
export const updateCartItem = (variantId: string, quantity: number) =>
  api.patch(`/cart/${variantId}`, { quantity }).then(r => r.data)
export const removeFromCart = (variantId: string) =>
  api.delete(`/cart/${variantId}`).then(r => r.data)
export const clearCart = () => api.delete('/cart').then(r => r.data)