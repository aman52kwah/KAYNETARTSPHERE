// src/components/Layout.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Menu, X, LogOut } from "lucide-react";
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
    setMobileMenuOpen(false); // Close mobile menu after logout
  };

  return (
    <div className="w-screen min-h-screen">
      <div className="min-h-screen bg-gray-50">
        {/* Navbar */}
        <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link to="/" className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-gray-800">KAYNET ARTSPHERE</span>
                </Link>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-6">
                <Link to="/shop" className="text-gray-700 hover:text-purple-600 transition-colors">
                  Shop
                </Link>
                <Link to="/custom-order" className="text-gray-700 hover:text-purple-600 transition-colors">
                  Custom Order
                </Link>

                {isAuthenticated ? (
                  <>
                    <Link to="/orders" className="text-gray-700 hover:text-purple-600 transition-colors">
                      My Orders
                    </Link>
                    <Link to="/cart" className="relative text-gray-700 hover:text-purple-600 transition-colors">
                      <ShoppingCart className="w-6 h-6" />
                      {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                          {cartCount}
                        </span>
                      )}
                    </Link>
                    {isAdmin && (
                      <Link 
                        to="/admin/dashboard" 
                        className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
                      >
                        Admin
                      </Link>
                    )}
                    <div className="flex items-center space-x-2 border-l pl-4 ml-2">
                      <User className="w-5 h-5 text-gray-600" />
                      <span className="text-sm text-gray-700">{user?.name}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/cart" className="relative text-gray-700 hover:text-purple-600 transition-colors">
                      <ShoppingCart className="w-6 h-6" />
                      {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                          {cartCount}
                        </span>
                      )}
                    </Link>
                    <Link
                      to="/login"
                      className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
                    >
                      Login
                    </Link>
                  </>
                )}
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden flex items-center space-x-4">
                {/* Cart icon for mobile */}
                <Link to="/cart" className="relative text-gray-700">
                  <ShoppingCart className="w-6 h-6" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="text-gray-700"
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 bg-white">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link
                  to="/shop"
                  className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Shop
                </Link>
                <Link
                  to="/custom-order"
                  className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Custom Order
                </Link>

                {isAuthenticated ? (
                  <>
                    {/* User info in mobile menu */}
                    <div className="px-3 py-2 border-b border-gray-200 mb-2">
                      <div className="flex items-center space-x-2 text-sm">
                        <User className="w-5 h-5 text-gray-600" />
                        <span className="font-semibold text-gray-800">{user?.name}</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{user?.email}</p>
                    </div>

                    <Link
                      to="/orders"
                      className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      My Orders
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        className="block px-3 py-2 text-blue-600 hover:bg-blue-50 rounded font-semibold transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-center bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
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