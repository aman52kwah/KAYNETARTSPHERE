import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

declare global {
  interface Window {
    PaystackPop: any;
  }
}

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, clearCart, cartTotal } = useCart();
  const { user } = useAuth();

  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    region: '',
  });

  const [loading, setLoading] = useState(false);
  const [paystackLoaded, setPaystackLoaded] = useState(false);

  // Load Paystack script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => setPaystackLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const isFormValid = () => {
    return shippingInfo.fullName && 
           shippingInfo.email && 
           shippingInfo.phone && 
           shippingInfo.address && 
           shippingInfo.city && 
           shippingInfo.region;
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      alert('Please fill in all required fields');
      return;
    }

    if (!paystackLoaded) {
      alert('Payment system is loading. Please try again in a moment.');
      return;
    }

    setLoading(true);

    try {
      // Create order in backend
      const orderData = {
        items: cart.map(item => ({
          productId: item.id,
          quantity: item.quantity
        })),
        shippingAddress: `${shippingInfo.fullName}, ${shippingInfo.phone}, ${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.region}`
      };

      const orderResponse = await axios.post('/orders', orderData);
      const order = orderResponse.data;

      // Initialize payment with backend
      const paymentResponse = await axios.post('/payments/initialize-order', {
        orderId: order.id
      });

      const { authorizationUrl, reference } = paymentResponse.data;

      // Redirect to Paystack payment page
      window.location.href = authorizationUrl;

    } catch (error: any) {
      console.error('Payment initialization error:', error);
      alert(error.response?.data?.message || 'Failed to initialize payment. Please try again.');
      setLoading(false);
    }
  };

  const amount = cartTotal;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-gray-600">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shipping Information */}
        <div className="lg:col-span-2">
          <form onSubmit={handlePayment}>
            <div className="bg-white rounded-2xl p-8 mb-6 shadow-md">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Shipping Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={shippingInfo.fullName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={shippingInfo.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingInfo.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Delivery Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none"
                    placeholder="Street address, house number"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={shippingInfo.city}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">Region *</label>
                    <select
                      name="region"
                      value={shippingInfo.region}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none"
                    >
                      <option value="">Select Region</option>
                      <option value="Greater Accra">Greater Accra</option>
                      <option value="Ashanti">Ashanti</option>
                      <option value="Central">Central</option>
                      <option value="Eastern">Eastern</option>
                      <option value="Western">Western</option>
                      <option value="Northern">Northern</option>
                      <option value="Upper East">Upper East</option>
                      <option value="Upper West">Upper West</option>
                      <option value="Volta">Volta</option>
                      <option value="Bono East">Bono East</option>
                      <option value="Western North">Western North</option>
                      <option value="Bono Ahafo">Bono Ahafo</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl p-8 shadow-md">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Payment Method</h2>
              
              <div className="bg-purple-50 rounded-xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <CreditCard className="text-purple-600" size={24} />
                  <span className="font-semibold text-gray-800">Paystack Payment Gateway</span>
                </div>
                <p className="text-sm text-gray-800">
                  Secure payment via Mobile Money, Bank Cards, or Bank Transfer
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
                <Lock size={16} className="text-green-600" />
                <span>Secure SSL encrypted payment</span>
              </div>

              <button
                type="submit"
                disabled={!isFormValid() || loading}
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-transform shadow-lg ${
                  isFormValid() && !loading
                    ? 'bg-gradient-to-r from-green-600 to-green-600 text-white hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {loading ? 'Processing...' : isFormValid() ? `Pay GHC ${amount.toLocaleString()} Now` : 'Complete Shipping Information'}
              </button>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-8 sticky top-24 shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Order Summary</h2>

            <div className="space-y-4">
              <div className="pb-4 border-b border-gray-200">
                <h3 className="font-semibold text-lg mb-2 text-gray-800">Items ({cart.length})</h3>
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">{item.name} x{item.quantity}</span>
                    <span className="font-semibold">GH₵  {(parseFloat(String(item.price)) * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t-2 border-green-400">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount:</span>
                  <span className="text-green-600">GH₵ {amount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;