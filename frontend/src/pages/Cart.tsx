import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext, AuthContext } from '../App';

interface CartItem {
  id: string | number;
  name: string;
  price: number | string;
  quantity: number;
  imageUrl?: string;
  size: string;
  color: string;
  // Add other fields as needed
}

interface User {
  id: string | number;
  name: string;
  role: 'user' | 'admin';
  // Add other fields as needed
}

interface CartContextType {
  cart: CartItem[];
  removeFromCart: (productId: string | number) => void;
  updateCartQuantity: (productId: string | number, quantity: number) => void;
  // Add other fields if needed
}

interface AuthContextType {
  user: User | null;
  // Add other fields if needed
}

const Cart: React.FC = () => {
  const cartContext = useContext(CartContext);
  const authContext = useContext(AuthContext);

  if (!cartContext) {
    throw new Error('Cart must be used within a CartContext provider');
  }
  if (!authContext) {
    throw new Error('Cart must be used within an AuthContext provider');
  }

  const { cart, removeFromCart, updateCartQuantity } = cartContext;
  const { user } = authContext;
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + parseFloat(item.price.toString()) * item.quantity, 0);

  const handleCheckout = () => {
    if (!user) {
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <button
          onClick={() => navigate('/shop')}
          className="bg-purple-600 text-white px-6 py-3 rounded hover:bg-purple-700"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {cart.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-lg shadow-md mb-4 flex">
              <img
                src={item.imageUrl || 'https://via.placeholder.com/150'}
                alt={item.name}
                className="w-32 h-32 object-cover rounded"
              />
              <div className="ml-4 flex-1">
                <h3 className="font-bold text-lg">{item.name}</h3>
                <p className="text-gray-600">
                  {item.size} • {item.color}
                </p>
                <p className="text-purple-600 font-bold mt-2">
                  ₦{parseFloat(item.price.toString()).toLocaleString()}
                </p>
                <div className="flex items-center mt-4 space-x-4">
                  <div className="flex items-center border rounded">
                    <button
                      onClick={() => updateCartQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="px-3 py-1 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="px-4">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-1 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">
                  ₦{(parseFloat(item.price.toString()) * item.quantity).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-4">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₦{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping:</span>
                <span>Calculated at checkout</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span className="text-purple-600">₦{total.toLocaleString()}</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 font-semibold"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;