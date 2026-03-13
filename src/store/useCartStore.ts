import { create } from 'zustand'
import { getCart, updateCartItem, removeFromCart, clearCart } from '../api/cart.api'

interface CartItem {
  id: string
  quantity: number
  variantId: string
  productId: string
  variant: {
    id: string
    size: string
    color: string
    price: number
    salePrice: number | null
    stock: number
  }
  product: {
    id: string
    name: string
    slug: string
    images: { url: string; isPrimary: boolean }[]
  }
}

interface CartStore {
  items: CartItem[]
  total: number
  loading: boolean
  fetchCart: () => Promise<void>
  updateItem: (variantId: string, quantity: number) => Promise<void>
  removeItem: (variantId: string) => Promise<void>
  clear: () => Promise<void>
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  total: 0,
  loading: false,

  fetchCart: async () => {
    set({ loading: true })
    try {
      const data = await getCart()
      set({ items: data.items, total: data.total, loading: false })
    } catch {
      set({ loading: false })
    }
  },

  updateItem: async (variantId, quantity) => {
    await updateCartItem(variantId, quantity)
    const data = await getCart()
    set({ items: data.items, total: data.total })
  },

  removeItem: async (variantId) => {
    await removeFromCart(variantId)
    const data = await getCart()
    set({ items: data.items, total: data.total })
  },

  clear: async () => {
    await clearCart()
    set({ items: [], total: 0 })
  },
}))