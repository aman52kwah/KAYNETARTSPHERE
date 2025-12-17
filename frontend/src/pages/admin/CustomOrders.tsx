// src/pages/admin/CustomOrders.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface CustomOrder {
  id: string;
  size: string;
  totalPrice: number;
  paidAmount: number;
  status: string;
  createdAt: string;
  specialInstructions: string;
  measurements: {
    chest?: string;
    waist?: string;
    hips?: string;
    length?: string;
  };
  deliveryDate: string | null;
  User: {
    name: string;
    email: string;
    phone: string;
  };
  Style: {
    name: string;
    imageUrl: string;
    basePrice: number;
  };
  Material: {
    name: string;
    pricePerMeter: number;
  };
}

const AdminCustomOrders: React.FC = () => {
  const [orders, setOrders] = useState<CustomOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<CustomOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [deliveryDate, setDeliveryDate] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/admin/custom-orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching custom orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await axios.put(`/admin/custom-orders/${orderId}`, { status: newStatus });
      fetchOrders();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };

  const updateDeliveryDate = async (orderId: string) => {
    if (!deliveryDate) {
      alert('Please select a delivery date');
      return;
    }

    try {
      await axios.put(`/admin/custom-orders/${orderId}`, { deliveryDate });
      fetchOrders();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, deliveryDate });
      }
      alert('Delivery date updated successfully');
    } catch (error) {
      console.error('Error updating delivery date:', error);
      alert('Failed to update delivery date');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-purple-100 text-purple-800',
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
      <h1 className="text-3xl font-bold mb-8">Manage Custom Orders</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left">Customer</th>
              <th className="px-6 py-3 text-left">Style</th>
              <th className="px-6 py-3 text-left">Date</th>
              <th className="px-6 py-3 text-left">Total Price</th>
              <th className="px-6 py-3 text-left">Paid Amount</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-semibold">{order.User?.name}</p>
                    <p className="text-sm text-gray-600">{order.User?.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <img
                      src={order.Style?.imageUrl || 'https://via.placeholder.com/50'}
                      alt={order.Style?.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <span>{order.Style?.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 font-semibold">
                  ₦{parseFloat(String(order.totalPrice)).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <span className="text-green-600 font-semibold">
                    ₦{parseFloat(String(order.paidAmount)).toLocaleString()}
                  </span>
                  <p className="text-xs text-gray-500">
                    (₦{(parseFloat(String(order.totalPrice)) - parseFloat(String(order.paidAmount))).toLocaleString()} remaining)
                  </p>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status.toUpperCase().replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => {
                      setSelectedOrder(order);
                      setDeliveryDate(order.deliveryDate || '');
                    }}
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
            <p>No custom orders yet</p>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-8 max-w-3xl w-full my-8 max-h-screen overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold">Custom Order Details</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-gray-700"
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
              <p>
                <span className="font-semibold">Phone:</span> {selectedOrder.User?.phone || 'N/A'}
              </p>
            </div>

            {/* Order Details */}
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-2">Order Details</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <img
                    src={selectedOrder.Style?.imageUrl || 'https://via.placeholder.com/200'}
                    alt={selectedOrder.Style?.name}
                    className="w-full h-48 object-cover rounded mb-2"
                  />
                  <p>
                    <span className="font-semibold">Style:</span> {selectedOrder.Style?.name}
                  </p>
                  <p>
                    <span className="font-semibold">Material:</span> {selectedOrder.Material?.name}
                  </p>
                  <p>
                    <span className="font-semibold">Size:</span> {selectedOrder.size}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Measurements:</h4>
                  {selectedOrder.measurements && (
                    <div className="space-y-1">
                      {selectedOrder.measurements.chest && (
                        <p>Chest: {selectedOrder.measurements.chest} inches</p>
                      )}
                      {selectedOrder.measurements.waist && (
                        <p>Waist: {selectedOrder.measurements.waist} inches</p>
                      )}
                      {selectedOrder.measurements.hips && (
                        <p>Hips: {selectedOrder.measurements.hips} inches</p>
                      )}
                      {selectedOrder.measurements.length && (
                        <p>Length: {selectedOrder.measurements.length} inches</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {selectedOrder.specialInstructions && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="font-semibold text-sm text-gray-700">Special Instructions:</p>
                  <p className="text-sm text-gray-600">{selectedOrder.specialInstructions}</p>
                </div>
              )}
            </div>

            {/* Pricing */}
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-2">Pricing</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Base Price (Style):</span>
                  <span>₦{parseFloat(String(selectedOrder.Style?.basePrice)).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Material Cost:</span>
                  <span>
                    ₦
                    {(parseFloat(String(selectedOrder.Material?.pricePerMeter)) * 2).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total Price:</span>
                  <span>₦{parseFloat(String(selectedOrder.totalPrice)).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-green-600 font-semibold">
                  <span>Paid (50% Deposit):</span>
                  <span>₦{parseFloat(String(selectedOrder.paidAmount)).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-orange-600 font-semibold">
                  <span>Balance Due:</span>
                  <span>
                    ₦
                    {(
                      parseFloat(String(selectedOrder.totalPrice)) -
                      parseFloat(String(selectedOrder.paidAmount))
                    ).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Update Status */}
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-2">Update Order Status</h3>
              <select
                value={selectedOrder.status}
                onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                className="w-full border rounded px-4 py-2"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Delivery Date */}
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-2">Expected Delivery Date</h3>
              <div className="flex space-x-2">
                <input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="flex-1 border rounded px-4 py-2"
                />
                <button
                  onClick={() => updateDeliveryDate(selectedOrder.id)}
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                  Update
                </button>
              </div>
              {selectedOrder.deliveryDate && (
                <p className="text-sm text-gray-600 mt-2">
                  Current: {new Date(selectedOrder.deliveryDate).toLocaleDateString()}
                </p>
              )}
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

export default AdminCustomOrders;