import api from './axios'

export const getAddresses = () =>
  api.get('/addresses').then(r => r.data)

export const addAddress = (data: {
  fullName: string
  street: string
  city: string
  province: string
  postalCode: string
  country: string
}) => api.post('/addresses', data).then(r => r.data)