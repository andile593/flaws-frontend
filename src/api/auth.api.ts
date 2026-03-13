import api from './axios'

export const login = (email: string, password: string) =>
  api.post('/auth/login', { email, password }).then(r => r.data)

export const register = (name: string, email: string, password: string, phone?: string) =>
  api.post('/auth/register', { name, email, password, phone }).then(r => r.data)

export const getMe = () => api.get('/auth/me').then(r => r.data)