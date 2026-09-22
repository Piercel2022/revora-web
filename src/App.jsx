import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import Dashboard from './pages/Dashboard'
import Stores from './pages/Stores'
import Customers from './pages/Customers'
import Products from './pages/Products'
import ProductDetails from './pages/ProductDetails'
import Orders from './pages/Orders'
import OrderDetails from './pages/OrderDetails'
import Opportunities from './pages/Opportunities'
import OpportunityDetails from './pages/OpportunityDetails'
import AppLayout from './layouts/AppLayout'
import ProtectedRoute from './auth/ProtectedRoute'
import StoreDetails from './pages/StoreDetails'
import CustomerDetails from './pages/CustomerDetails'
import PricingPage from './pages/PricingPage'
import Segments from './pages/Segments'
import Integrations from './pages/Integrations'
import FeaturesPage from './pages/FeaturesPage'
import HowItWorksPage from './pages/HowItWorksPage'
import ProductPage from './pages/ProductPage'


function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/features" element={<FeaturesPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/how-it-works" element={<HowItWorksPage />} />
      <Route path="/product" element={<ProductPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/stores" element={<Stores />} />
          <Route path="/stores/:id" element={<StoreDetails />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/customers/:id" element={<CustomerDetails />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderDetails />} />
          <Route path="/opportunities" element={<Opportunities />} />
          <Route path="/opportunities/:id" element={<OpportunityDetails />} />
          <Route path="/segments" element={<Segments />} />
           <Route path="/integrations" element={<Integrations />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App