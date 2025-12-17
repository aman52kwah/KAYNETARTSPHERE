import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface Stats {
  totalCustomers: number;
  totalCustomOrders: number;
  totalOrders: number;
  totalRevenue: number | string;
  customOrdersByStatus: {
    pending: number;
    confirmed: number;
    inProgress: number;
  };
  ordersByStatus: {
    pending: number;
    paid: number;
  };
  // Add other fields if needed
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get<{ data: Stats }>('/admin/stats');
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-8">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-600 text-sm mb-2">Total Customers</h3>
          <p className="text-3xl font-bold text-purple-600">{stats?.totalCustomers || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-600 text-sm mb-2">Custom Orders</h3>
          <p className="text-3xl font-bold text-blue-600">{stats?.totalCustomOrders || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-600 text-sm mb-2">Ready-Made Orders</h3>
          <p className="text-3xl font-bold text-green-600">{stats?.totalOrders || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-600 text-sm mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-pink-600">
            ₦{parseFloat(stats?.totalRevenue?.toString() || '0').toLocaleString()}
          </p>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Custom Orders Status</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Pending:</span>
              <span className="font-bold">{stats?.customOrdersByStatus?.pending || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Confirmed:</span>
              <span className="font-bold">{stats?.customOrdersByStatus?.confirmed || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>In Progress:</span>
              <span className="font-bold">{stats?.customOrdersByStatus?.inProgress || 0}</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Ready-Made Orders Status</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Pending:</span>
              <span className="font-bold">{stats?.ordersByStatus?.pending || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Paid:</span>
              <span className="font-bold">{stats?.ordersByStatus?.paid || 0}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <Link
          to="/admin/products"
          className="bg-purple-600 text-white p-6 rounded-lg shadow-md hover:bg-purple-700 text-center"
        >
          <h3 className="text-xl font-bold">Manage Products</h3>
          <p className="text-sm mt-2">Add, edit, delete ready-made products</p>
        </Link>
        <Link
          to="/admin/styles"
          className="bg-blue-600 text-white p-6 rounded-lg shadow-md hover:bg-blue-700 text-center"
        >
          <h3 className="text-xl font-bold">Manage Styles</h3>
          <p className="text-sm mt-2">Add, edit, delete custom styles</p>
        </Link>
        <Link
          to="/admin/materials"
          className="bg-green-600 text-white p-6 rounded-lg shadow-md hover:bg-green-700 text-center"
        >
          <h3 className="text-xl font-bold">Manage Materials</h3>
          <p className="text-sm mt-2">Add, edit, delete materials</p>
        </Link>
        <Link
          to="/admin/categories"
          className="bg-pink-600 text-white p-6 rounded-lg shadow-md hover:bg-pink-700 text-center"
        >
          <h3 className="text-xl font-bold">Manage Categories</h3>
          <p className="text-sm mt-2">Add, edit, delete categories</p>
        </Link>
        <Link
          to="/admin/orders"
          className="bg-orange-600 text-white p-6 rounded-lg shadow-md hover:bg-orange-700 text-center"
        >
          <h3 className="text-xl font-bold">View Orders</h3>
          <p className="text-sm mt-2">Manage ready-made orders</p>
        </Link>
        <Link
          to="/admin/custom-orders"
          className="bg-indigo-600 text-white p-6 rounded-lg shadow-md hover:bg-indigo-700 text-center"
        >
          <h3 className="text-xl font-bold">View Custom Orders</h3>
          <p className="text-sm mt-2">Manage custom orders</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;