import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useAuthStore } from './store/useAuthStore'
import AnnouncementBar from './components/AnnouncementBar'
import ScrollToTop from './components/ScrollToTop'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderDetailPage from './pages/OrderDetailPage'
import OrdersPage from './pages/OrdersPage'
import AccountPage from './pages/AccountPage'
import CollectionsPage from './pages/CollectionsPage'
import CollectionDetailPage from './pages/CollectionDetailPage'
import ReturnsPolicyPage from './pages/ReturnsPolicyPage'
import ContactPage from './pages/ContactPage'
import { useContentStore } from './store/useContentStore'
import { useGuestCartStore } from './store/useGuestCartStore'
import PaymentSuccessPage from './pages/PaymentSuccessPage'

export default function App() {
  const { fetchMe, token } = useAuthStore()
  const { fetch: fetchContent } = useContentStore()
  const { load: loadGuestCart } = useGuestCartStore()

  useEffect(() => {
    if (token) fetchMe()
  }, [])

  useEffect(() => {
    if (token) fetchMe()
    fetchContent()
  }, [])

  useEffect(() => {
    if (token) fetchMe()
    fetchContent()
    loadGuestCart()
  }, [])


  return (
    <BrowserRouter>
      <ScrollToTop />
      <AnnouncementBar />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:slug" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/payment/success" element={<PaymentSuccessPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/:id" element={<OrderDetailPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/collections/:slug" element={<CollectionDetailPage />} />
          <Route path="/returns" element={<ReturnsPolicyPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}