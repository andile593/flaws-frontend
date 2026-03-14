import api from './axios'

export const initializePayment = (addressId: string) =>
  api.post('/payment/initialize', { addressId }).then(r => r.data)

export const verifyPayment = (reference: string) =>
  api.get(`/payment/verify/${reference}`).then(r => r.data)