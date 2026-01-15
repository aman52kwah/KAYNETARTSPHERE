import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CreditCard, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

declare global {
  interface Window {
    PaystackPop: any;
  }
}

// IMPORTANT: Use the correct API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, clearCart, cartTotal } = useCart();
  const { user } = useAuth();

  // Check if this is a custom order checkout
  const customOrderData = location.state || JSON.parse(sessionStorage.getItem('customOrderCheckout') || 'null');
  const isCustomOrder = customOrderData?.orderType === 'custom';

  const [shippingInfo, setShippingInfo] = useState({
    fullName: isCustomOrder ? customOrderData?.customOrder?.fullName : (user?.name || ''),
    email: isCustomOrder ? customOrderData?.customOrder?.email : (user?.email || ''),
    phone: isCustomOrder ? customOrderData?.customOrder?.phone : '',
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
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Redirect if cart is empty AND no custom order
  useEffect(() => {
    if (!isCustomOrder && cart.length === 0) {
      console.log('No items in cart and no custom order, redirecting to cart');
      navigate('/cart');
    }
  }, [cart, isCustomOrder, navigate]);

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
      console.log('Creating order...');
      console.log('Is custom order:', isCustomOrder);
      
      let orderData;
      
      if (isCustomOrder) {
        // Custom order data
        orderData = {
          orderType: 'custom',
          customOrderDetails: customOrderData.customOrder,
          shippingAddress: `${shippingInfo.fullName}, ${shippingInfo.phone}, ${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.region}`,
          totalAmount: customOrderData.total,
          depositAmount: customOrderData.deposit
        };
      } else {
        // Regular cart order data - include calculated total with tax and shipping
        orderData = {
          orderType: 'regular',
          items: cart.map(item => ({
            productId: item.id,
            quantity: item.quantity
          })),
          shippingAddress: `${shippingInfo.fullName}, ${shippingInfo.phone}, ${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.region}`,
          totalAmount: finalAmount  // Total with tax and shipping
        };
      }

      console.log('Order data:', orderData);

      // Choose appropriate endpoint based on order type
      const endpoint = isCustomOrder ? '/api/custom-orders' : '/api/orders';

      const orderResponse = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json().catch(() => ({ message: 'Failed to create order' }));
        throw new Error(errorData.message || 'Failed to create order');
      }

      const order = await orderResponse.json();
      console.log('Order created:', order);

      // Initialize payment with backend
      console.log('Initializing payment for order:', order.id);

      const paymentResponse = await fetch(`${API_BASE_URL}/api/payments/initialize-order`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId: order.id })
      });

      if (!paymentResponse.ok) {
        const errorData = await paymentResponse.json().catch(() => ({ message: 'Failed to initialize payment' }));
        throw new Error(errorData.message || 'Failed to initialize payment');
      }

      const paymentData = await paymentResponse.json();
      console.log('Payment initialized:', paymentData);

      const { authorizationUrl, reference } = paymentData;

      // Clear cart if this was a regular order
      if (!isCustomOrder) {
        clearCart();
      }

      // Clear custom order data from sessionStorage
      if (isCustomOrder) {
        sessionStorage.removeItem('customOrderCheckout');
      }

      // Redirect to Paystack payment page
      console.log('Redirecting to payment page:', authorizationUrl);
      window.location.href = authorizationUrl;

    } catch (error: any) {
      console.error('Payment initialization error:', error);
      alert(error.message || 'Failed to initialize payment. Please try again.');
      setLoading(false);
    }
  };

  // Calculate financial breakdown with tax and shipping
  const calculateFinancialBreakdown = () => {
    const itemsTotal = isCustomOrder ? customOrderData.deposit : cartTotal;
    const shippingCost = 20; // Fixed GH₵ 20
    const taxAmount = Math.round((itemsTotal * 0.10) * 100) / 100; // 10% tax
    const grandTotal = Math.round((itemsTotal + shippingCost + taxAmount) * 100) / 100;
    
    return {
      subtotal: itemsTotal,
      shipping: shippingCost,
      tax: taxAmount,
      total: grandTotal
    };
  };

  const { subtotal, shipping, tax, total: finalAmount } = calculateFinancialBreakdown();

  // Get items to display
  const displayItems = isCustomOrder ? customOrderData.items : cart;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-gray-700">Checkout</h1>

      {/* Custom Order Banner */}
      {isCustomOrder && (
        <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-bold text-purple-900 mb-3">Custom Order Checkout</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-700"><span className="font-semibold">Garment:</span> {customOrderData.customOrder.garmentLabel}</p>
              <p className="text-gray-700"><span className="font-semibold">Fabric:</span> {customOrderData.customOrder.fabricLabel}</p>
            </div>
            <div>
              <p className="text-gray-700"><span className="font-semibold">Timeline:</span> {customOrderData.customOrder.urgencyLabel}</p>
              <p className="text-gray-700"><span className="font-semibold">Total Price:</span> GH₵ {customOrderData.total.toLocaleString()}</p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-900">
              <span className="font-bold">Note:</span> You are paying a 50% deposit (GH₵ {customOrderData.deposit.toLocaleString()}) to begin production. 
              The remaining balance will be collected upon delivery.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shipping Information */}
        <div className="lg:col-span-2">
          <form onSubmit={handlePayment}>
            <div className="bg-white rounded-2xl p-8 mb-6 shadow-md">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                Shipping Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Full Name *
                  </label>
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
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Email *
                    </label>
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
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Phone *
                    </label>
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
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Delivery Address *
                  </label>
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
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      City *
                    </label>
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
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Region *
                    </label>
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
                      <option value="Bono">Bono</option>
                      <option value="Bono East">Bono East</option>
                      <option value="Ahafo">Ahafo</option>
                      <option value="Central">Central</option>
                      <option value="Eastern">Eastern</option>
                      <option value="Northern">Northern</option>
                      <option value="North East">North East</option>
                      <option value="Oti">Oti</option>
                      <option value="Upper East">Upper East</option>
                      <option value="Upper West">Upper West</option>
                      <option value="Savannah">Savannah</option>
                      <option value="Volta">Volta</option>
                      <option value="Western">Western</option>
                      <option value="Western North">Western North</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl p-8 shadow-md">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                Payment Method
              </h2>

              <div className="bg-purple-50 rounded-xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <CreditCard className="text-purple-600" size={24} />
                  <span className="font-semibold text-gray-800">
                    Paystack Payment Gateway
                  </span>
                </div>
                <p className="text-sm text-gray-700">
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
                    ? "bg-gradient-to-r from-green-600 to-green-600 text-white hover:scale-105"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {loading
                  ? "Processing..."
                  : isFormValid()
                  ? isCustomOrder
                    ? `Pay 50% Deposit - GH₵ ${finalAmount.toLocaleString()}`
                    : `Pay GH₵ ${finalAmount.toLocaleString()} Now`
                  : "Complete Shipping Information"}
              </button>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-8 sticky top-24 shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Order Summary
            </h2>

            <div className="space-y-4">
              <div className="pb-4 border-b border-gray-200">
                <h3 className="font-semibold text-lg mb-2 text-gray-800">
                  Items ({displayItems.length})
                </h3>
                {displayItems.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-sm mb-2"
                  >
                    <span className="text-gray-600">
                      {item.name} {item.quantity > 1 && `x${item.quantity}`}
                    </span>
                    <span className="font-semibold text-gray-800">
                      GH₵{" "}
                      {(
                        parseFloat(String(item.price)) * (item.quantity || 1)
                      ).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {isCustomOrder && (
                <div className="pb-4 border-b border-gray-200">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Full Amount:</span>
                    <span className="font-semibold text-gray-800">
                      GH₵ {customOrderData.total.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-yellow-700">
                    <span className="font-semibold">50% Deposit:</span>
                    <span className="font-bold">
                      GH₵ {customOrderData.deposit.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              {/* Financial Breakdown */}
              <div className="pb-4 border-b border-gray-200 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold text-gray-800">
                    GH₵ {subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="font-semibold text-gray-800">
                    GH₵ {shipping.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (10%):</span>
                  <span className="font-semibold text-gray-800">
                    GH₵ {tax.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t-2 border-green-400">
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-gray-800">
                    {isCustomOrder ? 'Amount to Pay Now:' : 'Total Amount:'}
                  </span>
                  <span className="text-green-600">
                    GH₵ {finalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              {isCustomOrder && (
                <div className="pt-2 text-xs text-gray-600">
                  <p>Balance due on delivery: GH₵ {(customOrderData.total - customOrderData.deposit).toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;