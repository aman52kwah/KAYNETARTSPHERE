// Types for Admin Dashboard

// Types for Admin Dashboard
import type { LucideIcon } from 'lucide-react';

export interface DashboardStats {
  totalOrders: number;
  customOrders: number;
  readyMadeOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  todayRevenue: number;
}

export interface RecentOrder {
  id: string;
  customer: string;
  type: 'Custom' | 'Ready-Made';
  amount: number;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Pending';
  date: string;
}

export interface StatCard {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: 'purple' | 'pink' | 'orange' | 'green';
  change: string;
}