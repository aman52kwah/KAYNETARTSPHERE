// src/pages/OrderHistory.tsx - FIXED VERSION
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { ShoppingBag, Package, AlertCircle } from 'lucide-react';

// IMPORTANT: Use the correct API base URL
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  Products: {
    name: string;
    imageUrl: string;
  };
}

interface Order {
  id: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  shippingAddress: string;
  OrderItems: OrderItem[];
}

interface CustomOrder {
  id: string;
  size: string;
  totalPrice: number;
  paidAmount: number;
  status: string;
  createdAt: string;
  specialInstructions: string;
  measurements: Record<string, string>;
  Style: {
    name: string;
    imageUrl: string;
  };
  Material: {
    name: string;
  };
}

const OrderHistory: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ready-made' | 'custom'>('ready-made');
  const [orders, setOrders] = useState<Order[]>([]);
  const [customOrders, setCustomOrders] = useState<CustomOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
    fetchCustomOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      console.log('Fetching orders from:', `${API_BASE_URL}/api/orders`);
      
      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Orders response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Orders data:', data);
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError(error instanceof Error ? error.message : 'Failed to load orders');
    }
  };

  const fetchCustomOrders = async () => {
    try {
      console.log('Fetching custom orders from:', `${API_BASE_URL}/api/custom-orders`);
      
      const response = await fetch(`${API_BASE_URL}/api/custom-orders`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Custom orders response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Custom orders data:', data);
      setCustomOrders(data);
    } catch (error) {
      console.error('Error fetching custom orders:', error);
      setError(error instanceof Error ? error.message : 'Failed to load custom orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your orders...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={24} />
              <div className="flex-1">
                <h3 className="font-semibold text-red-800 mb-2">Error Loading Orders</h3>
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={() => {
                    setError(null);
                    setLoading(true);
                    fetchOrders();
                    fetchCustomOrders();
                  }}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">My Orders</h1>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8 border-b">
          <button
            onClick={() => setActiveTab('ready-made')}
            className={`pb-4 px-4 font-semibold transition-colors ${
              activeTab === 'ready-made'
                ? 'border-b-2 border-purple-600 text-purple-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <div className="flex items-center space-x-2">
              <ShoppingBag size={20} />
              <span>Ready-Made Orders ({orders.length})</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`pb-4 px-4 font-semibold transition-colors ${
              activeTab === 'custom'
                ? 'border-b-2 border-purple-600 text-purple-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Package size={20} />
              <span>Custom Orders ({customOrders.length})</span>
            </div>
          </button>
        </div>

        {/* Ready-Made Orders */}
        {activeTab === 'ready-made' && (
          <div className="space-y-6">
            {orders.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-lg">
                <ShoppingBag className="mx-auto mb-4 text-gray-400" size={48} />
                <p className="text-gray-600 text-lg font-semibold mb-2">No ready-made orders yet</p>
                <p className="text-gray-500">Start shopping to see your orders here!</p>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">Order #{order.orderNumber}</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-3 mb-4">
                    {order.OrderItems?.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4">
                        <img
                          src={item.Products?.imageUrl || 'https://via.placeholder.com/80'}
                          alt={item.Products?.name}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">{item.Products?.name}</p>
                          <p className="text-sm text-gray-600">
                            Quantity: {item.quantity} × GH₵{parseFloat(String(item.price)).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="text-xl font-bold text-purple-600">
                        GH₵{parseFloat(String(order.totalAmount)).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Custom Orders */}
        {activeTab === 'custom' && (
          <div className="space-y-6">
            {customOrders.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-lg">
                <Package className="mx-auto mb-4 text-gray-400" size={48} />
                <p className="text-gray-600 text-lg font-semibold mb-2">No custom orders yet</p>
                <p className="text-gray-500">Create a custom order to see it here!</p>
              </div>
            ) : (
              customOrders.map((order) => (
                <div key={order.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-4">
                      <img
                        src={order.Style?.imageUrl || 'https://via.placeholder.com/100'}
                        alt={order.Style?.name}
                        className="w-24 h-24 object-cover rounded"
                      />
                      <div>
                        <h3 className="font-bold text-lg text-gray-800">{order.Style?.name}</h3>
                        <p className="text-sm text-gray-600">
                          Material: {order.Material?.name}
                        </p>
                        <p className="text-sm text-gray-600">Size: {order.size}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status.toUpperCase().replace('_', ' ')}
                    </span>
                  </div>

                  {order.specialInstructions && (
                    <div className="mb-4 p-3 bg-gray-50 rounded">
                      <p className="text-sm font-semibold text-gray-700">Special Instructions:</p>
                      <p className="text-sm text-gray-600">{order.specialInstructions}</p>
                    </div>
                  )}

                  <div className="border-t pt-4 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Total Price</p>
                      <p className="text-lg font-bold text-gray-800">
                        GH₵{parseFloat(String(order.totalPrice)).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Amount Paid (50% Deposit)</p>
                      <p className="text-lg font-bold text-green-600">
                        GH₵{parseFloat(String(order.paidAmount)).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default OrderHistory;