// src/pages/admin/Orders.tsx
import React, { useState, useEffect, ChangeEvent } from 'react';
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

interface User {
  name: string;
  email: string;
}

interface Order {
  id: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  shippingAddress: string;
  User: User;
  OrderItems: OrderItem[];
}

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/admin/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await axios.put(`/admin/orders/${orderId}`, { status: newStatus });
      fetchOrders();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };

  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
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
      <h1 className="text-3xl font-bold mb-8">Manage Ready-Made Orders</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left">Order #</th>
              <th className="px-6 py-3 text-left">Customer</th>
              <th className="px-6 py-3 text-left">Date</th>
              <th className="px-6 py-3 text-left">Total</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold">{order.orderNumber}</td>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-semibold">{order.User?.name}</p>
                    <p className="text-sm text-gray-600">{order.User?.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 font-semibold">
                  ₦{parseFloat(String(order.totalAmount)).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <p>No orders yet</p>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-3xl w-full max-h-screen overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold">Order #{selectedOrder.orderNumber}</h2>
                <p className="text-gray-600">
                  {new Date(selectedOrder.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Customer Info */}
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-2">Customer Information</h3>
              <p>
                <span className="font-semibold">Name:</span> {selectedOrder.User?.name}
              </p>
              <p>
                <span className="font-semibold">Email:</span> {selectedOrder.User?.email}
              </p>
              <p className="mt-2">
                <span className="font-semibold">Shipping Address:</span>
              </p>
              <p className="text-gray-700">{selectedOrder.shippingAddress}</p>
            </div>

            {/* Order Items */}
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-2">Order Items</h3>
              <div className="space-y-3">
                {selectedOrder.OrderItems?.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 border-b pb-3">
                    <img
                      src={item.ReadyMadeProduct?.imageUrl || 'https://via.placeholder.com/80'}
                      alt={item.ReadyMadeProduct?.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-semibold">{item.ReadyMadeProduct?.name}</p>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity} × ₦
                        {parseFloat(String(item.price)).toLocaleString()}
                      </p>
                    </div>
                    <p className="font-bold">
                      ₦{(parseFloat(String(item.price)) * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-right">
                <p className="text-xl font-bold">
                  Total: ₦{parseFloat(String(selectedOrder.totalAmount)).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Update Status */}
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-2">Update Order Status</h3>
              <select
                value={selectedOrder.status}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => 
                  updateOrderStatus(selectedOrder.id, e.target.value)
                }
                className="w-full border rounded px-4 py-2"
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="bg-gray-300 px-6 py-2 rounded hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;