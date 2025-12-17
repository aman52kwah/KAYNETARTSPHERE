// src/App.tsx
import React, { useState, useEffect, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

// Components
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import CustomOrder from './pages/CustomOrder';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderHistory from './pages/OrderHistory';
import PaymentVerify from './pages/PaymentVerify';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminStyles from './pages/admin/Styles';
import AdminMaterials from './pages/admin/Materials';
import AdminCategories from './pages/admin/Categories';
import AdminOrders from './pages/admin/Orders';
import AdminCustomOrders from './pages/admin/CustomOrders';
import Login from './pages/Login';

// Configure axios defaults
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
axios.defaults.withCredentials = true;

// Define types
interface User {
  id: string | number;
  username: string;
  role: 'user' | 'admin';
  // Add other user fields as needed
}

interface CartItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  // Add other product fields you use (image, description, etc.)
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  logout: () => Promise<void>;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: CartItem, quantity?: number) => void;
  removeFromCart: (productId: string | number) => void;
  updateCartQuantity: (productId: string | number, quantity: number) => void;
  clearCart: () => void;
}

// Create contexts with proper types
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const CartContext = createContext<CartContextType | undefined>(undefined);

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    checkAuth();
    loadCart();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await axios.get<{ data: User }>('/auth/user');
      setUser(response.data.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const loadCart = () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart from localStorage:', e);
        setCart([]);
      }
    }
  };

  const addToCart = (product: CartItem, quantity = 1) => {
    const existingItem = cart.find(item => item.id === product.id);
    let newCart: CartItem[];

    if (existingItem) {
      newCart = cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      newCart = [...cart, { ...product, quantity }];
    }

    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const removeFromCart = (productId: string | number) => {
    const newCart = cart.filter(item => item.id !== productId);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const updateCartQuantity = (productId: string | number, quantity: number) => {
    if (quantity < 1) return; // Optional: prevent negative/zero quantities

    const newCart = cart.map(item =>
      item.id === productId ? { ...item, quantity } : item
    );
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  const logout = async () => {
    try {
      await axios.post('/auth/logout');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      <CartContext.Provider
        value={{
          cart,
          addToCart,
          removeFromCart,
          updateCartQuantity,
          clearCart,
        }}
      >
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/login" element={<Login />} />

              {/* Protected Routes */}
              <Route
                path="/custom-order"
                element={user ? <CustomOrder /> : <Navigate to="/login" />}
              />
              <Route path="/cart" element={<Cart />} />
              <Route
                path="/checkout"
                element={user ? <Checkout /> : <Navigate to="/login" />}
              />
              <Route
                path="/orders"
                element={user ? <OrderHistory /> : <Navigate to="/login" />}
              />
              <Route
                path="/payment/verify"
                element={user ? <PaymentVerify /> : <Navigate to="/login" />}
              />

              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />}
              />
              <Route
                path="/admin/products"
                element={user?.role === 'admin' ? <AdminProducts /> : <Navigate to="/" />}
              />
              <Route
                path="/admin/styles"
                element={user?.role === 'admin' ? <AdminStyles /> : <Navigate to="/" />}
              />
              <Route
                path="/admin/materials"
                element={user?.role === 'admin' ? <AdminMaterials /> : <Navigate to="/" />}
              />
              <Route
                path="/admin/categories"
                element={user?.role === 'admin' ? <AdminCategories /> : <Navigate to="/" />}
              />
              <Route
                path="/admin/orders"
                element={user?.role === 'admin' ? <AdminOrders /> : <Navigate to="/" />}
              />
              <Route
                path="/admin/custom-orders"
                element={user?.role === 'admin' ? <AdminCustomOrders /> : <Navigate to="/" />}
              />
            </Routes>
          </div>
        </Router>
      </CartContext.Provider>
    </AuthContext.Provider>
  );
};

export default App;