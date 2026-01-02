import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { Edit, Eye, Loader } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:8080';
interface Order {
  id: string;
  customer: string;
  customerEmail: string;
  items: number;
  total: number;
  status: string;
  date: string;
  type: string;
  orderItems?: Array<{
    productName: string;
    quantity: number;
    price: number;
    imageUrl?: string;
  }>;
}

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  

  const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'paid'];

  useEffect(() => {
    // Check if user is admin
    if (user && user.role !== 'admin') {
      navigate('/');
      return;
    }

    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BACKEND_URL}/api/admin/orders`, {
        withCredentials: true
      });
      setOrders(response.data);
      setError('');
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      if (err.response?.status === 403) {
        setError('Admin access required');
        navigate('/');
      } else {
        setError(err.response?.data?.message || 'Failed to load orders');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingOrderId(orderId);
      await axios.patch(
        `${BACKEND_URL}/api/admin/orders/${orderId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );

      // Update local state
      setOrders(orders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (err: any) {
      console.error('Error updating order status:', err);
      alert(err.response?.data?.message || 'Failed to update order status');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleViewOrder = (orderId: string) => {
    navigate(`/admin/orders/${orderId}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      processing: 'bg-blue-100 text-blue-800 border-blue-300',
      shipped: 'bg-purple-100 text-purple-800 border-purple-300',
      delivered: 'bg-green-100 text-green-800 border-green-300',
      cancelled: 'bg-red-100 text-red-800 border-red-300',
      paid: 'bg-emerald-100 text-emerald-800 border-emerald-300'
    };
    return colors[status.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  if (!user || user.role !== 'admin') {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold text-red-600">Access Denied</h1>
          <p className="mt-4 text-gray-600">You need admin privileges to access this page.</p>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-12 flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <Loader className="animate-spin h-12 w-12 text-purple-600 mx-auto mb-4" />
            <p className="text-gray-600"></p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-5xl font-bold serif">Manage Orders</h1>
          <div className="text-right">
            <p className="text-sm text-gray-600">Total Orders</p>
            <p className="text-3xl font-bold text-purple-600">{orders.length}</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="glass-effect rounded-2xl p-12 text-center">
            <p className="text-xl text-gray-600">No orders found</p>
          </div>
        ) : (
          <div className="glass-effect rounded-2xl p-8 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-purple-100">
                    <th className="text-left py-4 px-4 font-semibold">Order ID</th>
                    <th className="text-left py-4 px-4 font-semibold">Customer</th>
                    <th className="text-left py-4 px-4 font-semibold">Email</th>
                    <th className="text-left py-4 px-4 font-semibold">Items</th>
                    <th className="text-left py-4 px-4 font-semibold">Total</th>
                    <th className="text-left py-4 px-4 font-semibold">Status</th>
                    <th className="text-left py-4 px-4 font-semibold">Date</th>
                    <th className="text-left py-4 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-100 hover:bg-purple-50 transition-colors">
                      <td className="py-4 px-4 font-mono text-sm">
                        {order.id.substring(0, 8)}...
                      </td>
                      <td className="py-4 px-4 font-semibold">{order.customer}</td>
                      <td className="py-4 px-4 text-sm text-gray-600">{order.customerEmail}</td>
                      <td className="py-4 px-4">{order.items} items</td>
                      <td className="py-4 px-4 font-semibold">GH₵ {order.total.toFixed(2)}</td>
                      <td className="py-4 px-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          disabled={updatingOrderId === order.id}
                          className={`px-3 py-1 rounded-lg border-2 text-sm font-semibold focus:outline-none capitalize ${getStatusColor(order.status)} ${
                            updatingOrderId === order.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                          }`}
                        >
                          {statuses.map(status => (
                            <option key={status} value={status} className="capitalize">
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {formatDate(order.date)}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewOrder(order.id)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title="Edit Order"
                          >
                            <Edit size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminOrders;