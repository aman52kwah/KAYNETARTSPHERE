// API service for Admin Dashboard

import type { DashboardStats, RecentOrder } from "../types/admin";

// FIXED: Remove /api from here since we add it in each endpoint
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

export const adminApi = {
  // Fetch dashboard statistics
  getDashboardStats: async (): Promise<DashboardStats> => {
    console.log('Fetching dashboard stats from:', `${API_BASE_URL}/api/admin/dashboard/stats`);
    
    const response = await fetch(`${API_BASE_URL}/api/admin/dashboard/stats`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Dashboard stats response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(errorData.message || 'Failed to fetch dashboard stats');
    }

    return response.json();
  },

  // Fetch recent orders
  getRecentOrders: async (limit: number = 5): Promise<RecentOrder[]> => {
    console.log('Fetching recent orders from:', `${API_BASE_URL}/api/admin/orders/recent?limit=${limit}`);
    
    const response = await fetch(`${API_BASE_URL}/api/admin/orders/recent?limit=${limit}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Recent orders response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(errorData.message || 'Failed to fetch recent orders');
    }

    return response.json();
  },

  // Get all orders
  getAllOrders: async () => {
    const response = await fetch(`${API_BASE_URL}/api/admin/orders`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(errorData.message || 'Failed to fetch orders');
    }

    return response.json();
  },

  // Get all custom orders
  getAllCustomOrders: async () => {
    const response = await fetch(`${API_BASE_URL}/api/admin/custom-orders`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(errorData.message || 'Failed to fetch custom orders');
    }

    return response.json();
  },

  // Update order status
  updateOrderStatus: async (orderId: string, status: string) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(errorData.message || 'Failed to update order status');
    }

    return response.json();
  },
};