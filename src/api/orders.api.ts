import api from './axios'

export const createOrder = (addressId: string) =>
  api.post('/orders', { addressId }).then(r => r.data)

export const getOrders = () =>
  api.get('/orders').then(r => r.data)

export const getOrderById = (id: string) =>
  api.get(`/orders/${id}`).then(r => r.data)