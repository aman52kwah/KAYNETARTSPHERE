// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Components
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetailPage.tsx';
import CustomOrder from './pages/Customorderpage';
import Cart from './pages/Cart';
import Checkout from './pages/Checkoutpage';
import OrderHistory from './pages/OrderHistory';
import PaymentVerify from './pages/PaymentVerify';
import AdminDashboard from './pages/admin/Admindashboard.tsx';
import AdminProducts from './pages/admin/AdminProducts.tsx';
import AdminStyles from './pages/admin/Styles';
import AdminMaterials from './pages/admin/Materials';
import AdminCategories from './pages/admin/Categories';
import AdminOrders from './pages/admin/AdminOrdersPage';
import AdminCustomOrders from './pages/admin/AdminCustomOrderPage';
//import ReadyMadePage from './pages/Readymadepage';
import Login from './pages/LoginPage';
import Layout from './components/Layout';
import RegisterPage from './pages/RegisterPage';

// Configure axios defaults
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
axios.defaults.withCredentials = true;

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Layout>
            <div className="min-h-screen bg-gray-50">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<RegisterPage />} />
             

                {/* Protected Routes */}
                <Route path="/custom-order" element={<CustomOrder />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/orders" element={<OrderHistory />} />
                <Route path="/payment/verify" element={<PaymentVerify />} />

                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/products" element={<AdminProducts />} />
                <Route path="/admin/styles" element={<AdminStyles />} />
                <Route path="/admin/materials" element={<AdminMaterials />} />
                <Route path="/admin/categories" element={<AdminCategories />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
                <Route path="/admin/custom-orders" element={<AdminCustomOrders />} />
              </Routes>
            </div>
          </Layout>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;