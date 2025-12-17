
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext, AuthContext } from '../App';

interface CartItem {
  id: string | number;
  name: string;
  price: number | string;
  quantity: number;
  // Add other fields as needed
}

interface User {
  id: string | number;
  name: string;
  role: 'user' | 'admin';
  // Add other fields as needed
}

interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

interface CartContextType {
  cart: CartItem[];
  clearCart: () => void;
  // Add other fields if needed
}

interface AuthContextType {
  user: User | null;
  // Add other fields if needed
}

const Checkout: React.FC = () => {
  const cartContext = useContext(CartContext);
  const authContext = useContext(AuthContext);

  if (!cartContext) {
    throw new Error('Checkout must be used within a CartContext provider');
  }
  if (!authContext) {
    throw new Error('Checkout must be used within an AuthContext provider');
  }

  const { cart, clearCart } = cartContext;
  const { user } = authContext;
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: user?.name || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });

  const total = cart.reduce((sum, item) => sum + parseFloat(item.price.toString()) * item.quantity, 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Create order
      const orderData = {
        items: cart.map((item) => ({ productId: item.id, quantity: item.quantity })),
        shippingAddress: `${shippingAddress.fullName}, ${shippingAddress.phone}, ${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.state}, ${shippingAddress.zipCode}`,
      };
      const orderResponse = await axios.post<{ data: { id: string | number } }>('/orders', orderData);
      const order = orderResponse.data;

      // Initialize payment
      const paymentResponse = await axios.post<{ data: { authorizationUrl: string } }>('/payments/initialize-order', {
        orderId: order.id,
      });

      // Clear cart
      clearCart();

      // Redirect to Paystack
      window.location.href = paymentResponse.data.authorizationUrl;
    } catch (error) {
      console.error('Error processing checkout:', error);
      alert('Failed to process checkout. Please try again.');
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
            <div className="mb-4">
              <label className="block font-semibold mb-2">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={shippingAddress.fullName}
                onChange={handleInputChange}
                required
                className="w-full border rounded px-4 py-2"
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-2">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={shippingAddress.phone}
                onChange={handleInputChange}
                required
                className="w-full border rounded px-4 py-2"
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-2">Address</label>
              <input
                type="text"
                name="address"
                value={shippingAddress.address}
                onChange={handleInputChange}
                required
                className="w-full border rounded px-4 py-2"
              />
            </div>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block font-semibold mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={shippingAddress.city}
                  onChange={handleInputChange}
                  required
                  className="w-full border rounded px-4 py-2"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">State</label>
                <input
                  type="text"
                  name="state"
                  value={shippingAddress.state}
                  onChange={handleInputChange}
                  required
                  className="w-full border rounded px-4 py-2"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Zip Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={shippingAddress.zipCode}
                  onChange={handleInputChange}
                  required
                  className="w-full border rounded px-4 py-2"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 font-semibold disabled:bg-gray-400"
            >
              {loading ? 'Processing...' : `Pay ₦${total.toLocaleString()}`}
            </button>
          </form>
        </div>
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-4">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.name} x{item.quantity}
                  </span>
                  <span>₦{(parseFloat(item.price.toString()) * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              <hr className="my-2" />
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span className="text-purple-600">₦{total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
