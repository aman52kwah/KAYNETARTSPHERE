// src/components/Layout.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Menu, X,  LogOut } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartCount } = useCart();
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="w-screen h-screen">
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                {/* <Scissors className="w-8 h-8 text-purple-600" /> */}
                <span className="text-2xl font-bold text-gray-800">KAYNET ARTSPHERE</span>
              </Link>
            </div>
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/shop" className="text-gray-700 hover:text-purple-600">
                Shop
              </Link>
              <Link to="/custom-order" className="text-gray-700 hover:text-purple-600">
                Custom Order
              </Link>

              {isAuthenticated ? (
                <>
                  <Link to="/orders" className="text-gray-700 hover:text-purple-600">
                    My Orders
                    
                  </Link>
                  <Link to="/cart" className="relative text-gray-700 hover:text-purple-600">
                    <ShoppingCart className="w-6 h-6" />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                  {isAdmin && (
                    <Link to="/admin/dashboard" className="text-blue-600 hover:text-blue-800">
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-gray-700 hover:text-purple-600"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link to="/cart" className="relative text-gray-700 hover:text-purple-600">
                    <ShoppingCart className="w-6 h-6" />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                  
                  <a  href={`${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}/auth/google`}
                    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700" >
                    Login
                  </a>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-700"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

       
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
               
              <Link
                to="/shop"
                className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded"
              >
                Shop
              </Link>
              <Link
                to="/custom-order"
                className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded"
              >
                Custom Order
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    to="/orders"
                    className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded"
                  >
                    My Orders
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin/dashboard"
                      className="block px-3 py-2 text-blue-600 hover:bg-gray-100 rounded"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main>{children}</main>
    </div>
   </div>
  );
};

export default Layout;