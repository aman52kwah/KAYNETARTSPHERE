// src/pages/OrderHistory.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  ReadyMadeProduct: {
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

  useEffect(() => {
    fetchOrders();
    fetchCustomOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchCustomOrders = async () => {
    try {
      const response = await axios.get('/custom-orders');
      setCustomOrders(response.data);
    } catch (error) {
      console.error('Error fetching custom orders:', error);
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      {/* Tabs */}
      <div className="flex space-x-4 mb-8 border-b">
        <button
          onClick={() => setActiveTab('ready-made')}
          className={`pb-4 px-4 font-semibold ${
            activeTab === 'ready-made'
              ? 'border-b-2 border-purple-600 text-purple-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Ready-Made Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('custom')}
          className={`pb-4 px-4 font-semibold ${
            activeTab === 'custom'
              ? 'border-b-2 border-purple-600 text-purple-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Custom Orders ({customOrders.length})
        </button>
      </div>

      {/* Ready-Made Orders */}
      {activeTab === 'ready-made' && (
        <div className="space-y-6">
          {orders.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <p>No ready-made orders yet</p>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg">Order #{order.orderNumber}</h3>
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
                        src={item.ReadyMadeProduct?.imageUrl || 'https://via.placeholder.com/80'}
                        alt={item.ReadyMadeProduct?.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-semibold">{item.ReadyMadeProduct?.name}</p>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity} × ₦{parseFloat(String(item.price)).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="text-xl font-bold text-purple-600">
                      ₦{parseFloat(String(order.totalAmount)).toLocaleString()}
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
            <div className="text-center py-16 text-gray-500">
              <p>No custom orders yet</p>
            </div>
          ) : (
            customOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={order.Style?.imageUrl || 'https://via.placeholder.com/100'}
                      alt={order.Style?.name}
                      className="w-24 h-24 object-cover rounded"
                    />
                    <div>
                      <h3 className="font-bold text-lg">{order.Style?.name}</h3>
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
                    <p className="text-lg font-bold">
                      ₦{parseFloat(String(order.totalPrice)).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Amount Paid (50% Deposit)</p>
                    <p className="text-lg font-bold text-green-600">
                      ₦{parseFloat(String(order.paidAmount)).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;