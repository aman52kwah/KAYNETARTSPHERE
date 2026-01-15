import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { ArrowLeft, Package, User, MapPin, CreditCard, Clock, CheckCircle, XCircle, Edit } from 'lucide-react';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

interface CustomOrder {
  id: string;
  createdAt: string;
  status: string;
  garmentLabel?: string;
  garmentType?: string;
  fabricLabel?: string;
  fabricType?: string;
  fabricColor?: string;
  occasion?: string;
  urgencyLabel?: string;
  style?: string;
  designDetails?: string;
  specialRequests?: string;
  measurements?: string | Record<string, any>;
  fullName: string;
  email: string;
  phone: string;
  shippingAddress?: string;
  totalAmount?: string | number;
  depositAmount?: string | number;
  balanceAmount?: string | number;
  paymentStatus?: string;
}

const AdminCustomOrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<CustomOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/api/custom-orders/${orderId}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch order details');
      }

      const data = await response.json();
      setOrder(data);
    } catch (error) {
      console.error('Error fetching order details:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (newStatus: string) => {
    try {
      setUpdating(true);

      const response = await fetch(`${API_URL}/api/admin/custom-orders/${orderId}/status`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      await fetchOrderDetails();
      alert(`Order status updated to ${newStatus}`);
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const parseMeasurements = (measurementData: unknown): Record<string, string> => {
    try {
      if (typeof measurementData === 'string') {
        return JSON.parse(measurementData);
      }
      return (measurementData as Record<string, string>) || {};
    } catch (err) {
      return {};
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    if (status === 'completed') return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (status === 'cancelled') return <XCircle className="w-5 h-5 text-red-600" />;
    return <Clock className="w-5 h-5 text-gray-600" />;
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading order details...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !order) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-red-900 mb-2">Error</h2>
            <p className="text-red-700">{error || 'Order not found'}</p>
            <button
              onClick={() => navigate('/admin/custom-orders')}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Back to Orders
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const measurements = parseMeasurements(order.measurements);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin/custom-orders')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Custom Orders
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Custom Order #{order.id.slice(0, 8).toUpperCase()}
              </h1>
              <p className="text-gray-600 mt-2">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>

            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${getStatusColor(order.status)}`}>
              {getStatusIcon(order.status)}
              <span className="font-semibold capitalize">{order.status.replace('_', ' ')}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Garment Details */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Garment Details
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Type</p>
                  <p className="font-semibold">{order.garmentLabel || order.garmentType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Fabric</p>
                  <p className="font-semibold">{order.fabricLabel || order.fabricType}</p>
                </div>
                {order.fabricColor && (
                  <div>
                    <p className="text-sm text-gray-600">Color</p>
                    <p className="font-semibold">{order.fabricColor}</p>
                  </div>
                )}
                {order.occasion && (
                  <div>
                    <p className="text-sm text-gray-600">Occasion</p>
                    <p className="font-semibold">{order.occasion}</p>
                  </div>
                )}
                {order.urgencyLabel && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">Timeline</p>
                    <p className="font-semibold">{order.urgencyLabel}</p>
                  </div>
                )}
              </div>

              {order.style && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-600 mb-1">Style Description</p>
                  <p className="text-gray-700">{order.style}</p>
                </div>
              )}

              {order.designDetails && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-600 mb-1">Design Details</p>
                  <p className="text-gray-700">{order.designDetails}</p>
                </div>
              )}

              {order.specialRequests && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-600 mb-1">Special Requests</p>
                  <p className="text-gray-700">{order.specialRequests}</p>
                </div>
              )}
            </div>

            {/* Measurements */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Measurements</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(measurements).map(([key, value]: [string, string]) => (
                  value && (
                    <div key={key}>
                      <p className="text-sm text-gray-600 capitalize">{key}</p>
                      <p className="font-semibold">{String(value)}"</p>
                    </div>
                  )
                ))}
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Customer Information
              </h2>

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-semibold">{order.fullName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold">{order.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-semibold">{order.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions</h2>

              <div className="space-y-3">
                {order.status !== 'in_progress' && order.status !== 'completed' && order.status !== 'cancelled' && (
                  <button
                    onClick={() => updateOrderStatus('in_progress')}
                    disabled={updating}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
                  >
                    Start Production
                  </button>
                )}

                {order.status === 'in_progress' && (
                  <button
                    onClick={() => updateOrderStatus('completed')}
                    disabled={updating}
                    className="w-full px-4 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
                  >
                    Mark Complete
                  </button>
                )}

                {order.status !== 'cancelled' && order.status !== 'completed' && (
                  <button
                    onClick={() => {
                      if (confirm('Cancel this order?')) {
                        updateOrderStatus('cancelled');
                      }
                    }}
                    disabled={updating}
                    className="w-full px-4 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>

            {/* Shipping Address */}
            {order.shippingAddress && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Shipping Address
                </h2>
                <p className="text-gray-700 whitespace-pre-line">{order.shippingAddress}</p>
              </div>
            )}

            {/* Payment Summary */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Payment
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount</span>
                  <span className="font-semibold">GH₵ {parseFloat(String(order.totalAmount || 0)).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Deposit Paid</span>
                  <span className="font-semibold">GH₵ {parseFloat(String(order.depositAmount || 0)).toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span className="text-gray-600">Balance Due</span>
                  <span className="font-semibold text-red-600">GH₵ {parseFloat(String(order.balanceAmount || 0)).toLocaleString()}</span>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-600">Payment Status</p>
                  <p className="font-semibold capitalize">{order.paymentStatus?.replace('_', ' ')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminCustomOrderDetail;