// API service for Admin Dashboard

import type { DashboardStats,RecentOrder}  from "../types/admin";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080/api';

export const adminApi = {
  // Fetch dashboard statistics
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await fetch(`${API_BASE_URL}/admin/stats`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch dashboard stats');
    }

    return response.json();
  },

  // Fetch recent orders
  getRecentOrders: async (limit: number = 10): Promise<RecentOrder[]> => {
    const response = await fetch(`${API_BASE_URL}/admin/orders/recent?limit=${limit}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch recent orders');
    }

    return response.json();
  },

  // Get all orders
  getAllOrders: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/orders`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch orders');
    }

    return response.json();
  },

  // Get all custom orders
  getAllCustomOrders: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/custom-orders`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch custom orders');
    }

    return response.json();
  },

  // Update order status
  updateOrderStatus: async (orderId: string, status: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error('Failed to update order status');
    }

    return response.json();
  },
};