import { useState } from 'react';

const INITIAL_DASHBOARD_DATA = {
  overview: {
    totalRevenue:     2458900,
    totalOrders:      1254,
    totalProducts:    87,
    totalCustomers:   3421,
    revenueGrowth:    12.5,
    ordersGrowth:     8.3,
    productsGrowth:   5.2,
    customersGrowth:  15.7,
  },
  recentOrders: [
    { id: 'ORD-001', customer: 'Rajesh Kumar',  product: 'Wireless Headphones', amount: 2999, status: 'delivered',  date: '2026-02-17' },
    { id: 'ORD-002', customer: 'Priya Sharma',  product: 'Smart Watch',         amount: 8999, status: 'pending',    date: '2026-02-16' },
    { id: 'ORD-003', customer: 'Amit Patel',    product: 'Cotton T-Shirt',      amount: 499,  status: 'processing', date: '2026-02-16' },
    { id: 'ORD-004', customer: 'Sneha Reddy',   product: 'Yoga Mat',            amount: 1299, status: 'delivered',  date: '2026-02-15' },
    { id: 'ORD-005', customer: 'Vikram Singh',  product: 'Organic Green Tea',   amount: 299,  status: 'cancelled',  date: '2026-02-15' },
  ],
  topProducts: [
    { id: 1, name: 'Wireless Headphones', category: 'Electronics',    sold: 145, revenue: 434855, trend: 'up' },
    { id: 2, name: 'Smart Watch',         category: 'Electronics',    sold: 98,  revenue: 881902, trend: 'up' },
    { id: 3, name: 'Cotton T-Shirt',      category: 'Fashion',        sold: 324, revenue: 161676, trend: 'down' },
    { id: 4, name: 'Yoga Mat',            category: 'Sports',         sold: 87,  revenue: 112913, trend: 'up' },
    { id: 5, name: 'Organic Green Tea',   category: 'Food & Beverage',sold: 256, revenue: 76544,  trend: 'up' },
  ],
  salesByCategory: [
    { category: 'Electronics',     sales: 1316757, percentage: 53.6 },
    { category: 'Fashion',         sales: 491780,  percentage: 20.0 },
    { category: 'Sports & Outdoors',sales: 344234, percentage: 14.0 },
    { category: 'Food & Beverage', sales: 196712,  percentage: 8.0  },
    { category: 'Others',          sales: 109417,  percentage: 4.4  },
  ],
  monthlySales: [
    { month: 'Jan', sales: 185000 },
    { month: 'Feb', sales: 220000 },
    { month: 'Mar', sales: 198000 },
    { month: 'Apr', sales: 245000 },
    { month: 'May', sales: 267000 },
    { month: 'Jun', sales: 289000 },
  ],
};

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const useDashboardData = () => {
  const [dashboardData, setDashboardData] = useState(INITIAL_DASHBOARD_DATA);
  const [loading, setLoading]             = useState(false);

  const refreshDashboard = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setDashboardData({ ...INITIAL_DASHBOARD_DATA });
    setLoading(false);
  };

  // Status color — returns inline style object instead of Tailwind classes
  const getOrderStatusColor = (status) => {
    const map = {
      delivered:  { background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' },
      pending:    { background: '#fefce8', color: '#ca8a04', border: '1px solid #fde68a' },
      processing: { background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe' },
      cancelled:  { background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca' },
    };
    return map[status] || { background: '#f9fafb', color: '#6b7280', border: '1px solid #e5e7eb' };
  };

  const getNotificationColor = (type) => {
    const map = {
      success: { background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' },
      warning: { background: '#fff7ed', color: '#ea580c', border: '1px solid #fed7aa' },
      error:   { background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca' },
      info:    { background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe' },
    };
    return map[type] || { background: '#f9fafb', color: '#6b7280', border: '1px solid #e5e7eb' };
  };

  return {
    dashboardData,
    loading,
    refreshDashboard,
    getOrderStatusColor,
    getNotificationColor,
  };
};

export const ORDER_STATUSES    = ['delivered', 'pending', 'processing', 'cancelled'];
export const NOTIFICATION_TYPES = ['success', 'warning', 'error', 'info'];
