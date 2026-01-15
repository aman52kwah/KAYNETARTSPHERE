import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import { Package, ShoppingBag, Users, TrendingUp, DollarSign, Clock, AlertCircle } from 'lucide-react';
import { adminApi } from '../../services/adminapi';
import type { DashboardStats, RecentOrder, StatCard } from '../../types/admin';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    customOrders: 0,
    readyMadeOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    todayRevenue: 0,
  });

  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch both stats and recent orders
      const [statsData, ordersData] = await Promise.all([
        adminApi.getDashboardStats(),
        adminApi.getRecentOrders(5),
      ]);

      setStats(statsData);
      setRecentOrders(ordersData);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Define color mappings to avoid dynamic Tailwind classes
  const colorClasses = {
    purple: {
      bg: 'bg-purple-100',
      text: 'text-purple-600',
    },
    pink: {
      bg: 'bg-pink-100',
      text: 'text-pink-600',
    },
    orange: {
      bg: 'bg-orange-100',
      text: 'text-orange-600',
    },
    green: {
      bg: 'bg-green-100',
      text: 'text-green-600',
    },
  };

  const statCards: StatCard[] = [
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: 'purple',
      change: '+12%'
    },
    {
      title: 'Custom Orders',
      value: stats.customOrders,
      icon: Package,
      color: 'pink',
      change: '+8%'
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      icon: Clock,
      color: 'orange',
      change: '-5%'
    },
    {
      title: 'Total Revenue',
      value: `GH₵ ${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'green',
      change: '+15%'
    },
  ];

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-600';
      case 'Shipped':
        return 'bg-blue-100 text-blue-600';
      case 'Processing':
        return 'bg-yellow-100 text-yellow-600';
      case 'Pending':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600"></p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="glass-effect rounded-2xl p-8 text-center">
            <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
            <h3 className="text-xl font-bold text-gray-700 mb-2">Error Loading Dashboard</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchDashboardData}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold serif mb-2 text-gray-700">Admin Dashboard</h1>
          <p className="text-xl text-gray-600">Manage your fashion business</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statCards.map((stat, idx) => {
            const IconComponent = stat.icon;
            const colors = colorClasses[stat.color];
            
            return (
              <div
                key={idx}
                className="glass-effect rounded-2xl p-6 hover:scale-105 transition-transform"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`${colors.bg} p-3 rounded-xl`}>
                    <IconComponent className={colors.text} size={24} />
                  </div>
                  <span className={`text-sm font-semibold ${
                    stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-gray-600 text-sm mb-2">{stat.title}</h3>
                <p className="text-3xl font-bold text-gray-700">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Link
            to="/admin/products"
            className="glass-effect rounded-2xl p-8 hover:scale-105 transition-transform group"
          >
            <div className="bg-purple-100 w-16 h-16 rounded-xl flex items-center justify-center mb-4">
              <Package className="text-purple-600" size={32} />
            </div>
            <h3 className="text-2xl font-bold serif mb-2 group-hover:text-purple-600 transition-colors">
              Manage Products
            </h3>
            <p className="text-gray-600">Add, edit, or remove ready-made products</p>
          </Link>

          <Link
            to="/admin/orders"
            className="glass-effect rounded-2xl p-8 hover:scale-105 transition-transform group"
          >
            <div className="bg-pink-100 w-16 h-16 rounded-xl flex items-center justify-center mb-4">
              <ShoppingBag className="text-pink-600" size={32} />
            </div>
            <h3 className="text-2xl font-bold serif mb-2 group-hover:text-pink-600 transition-colors">
              Manage Orders
            </h3>
            <p className="text-gray-600">View and update order statuses</p>
          </Link>

          <Link
            to="/admin/custom-orders"
            className="glass-effect rounded-2xl p-8 hover:scale-105 transition-transform group"
          >
            <div className="bg-orange-100 w-16 h-16 rounded-xl flex items-center justify-center mb-4">
              <TrendingUp className="text-orange-600" size={32} />
            </div>
            <h3 className="text-2xl font-bold serif mb-2 group-hover:text-orange-600 transition-colors">
              Custom Orders
            </h3>
            <p className="text-gray-600">Review and process custom orders</p>
          </Link>
        </div>

        {/* Recent Orders */}
        <div className="glass-effect rounded-2xl p-8">
          <h2 className="text-2xl font-bold serif mb-6 text-gray-700">Recent Orders</h2>
          
          {recentOrders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="mx-auto mb-4 text-gray-400" size={48} />
              <p className="text-gray-600">No recent orders found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-purple-100">
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">Order ID</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">Customer</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">Type</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">Amount</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">Status</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">Date</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="border-b border-gray-100 hover:bg-purple-50 transition-colors"
                      >
                        <td className="py-4 px-4 font-mono text-sm text-gray-600">{order.id}</td>
                        <td className="py-4 px-4 text-gray-700">{order.customer}</td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            order.type === 'Custom' 
                              ? 'bg-purple-100 text-purple-600'
                              : 'bg-pink-100 text-pink-600'
                          }`}>
                            {order.type}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-semibold text-gray-700">
                          GH₵ {order.amount.toLocaleString()}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            getStatusColor(order.status)
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600">
                          {new Date(order.date).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4">
                          <Link
                            to={`api/admin/orders/${order.id}`}
                            className="text-purple-600 hover:text-purple-800 font-semibold text-sm"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 text-center">
                <Link
                  to="/admin/orders"
                  className="text-purple-600 font-semibold hover:underline"
                >
                  View All Orders →
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;