import { useState, useEffect } from 'react';

// Mock Dashboard Data
const INITIAL_DASHBOARD_DATA = {
  overview: {
    totalRevenue: 2458900,
    totalOrders: 1254,
    totalProducts: 87,
    totalCustomers: 3421,
    revenueGrowth: 12.5,
    ordersGrowth: 8.3,
    productsGrowth: 5.2,
    customersGrowth: 15.7
  },
  recentOrders: [
    {
      id: 'ORD-001',
      customer: 'Rajesh Kumar',
      product: 'Wireless Headphones',
      amount: 2999,
      status: 'delivered',
      date: '2026-02-17'
    },
    {
      id: 'ORD-002',
      customer: 'Priya Sharma',
      product: 'Smart Watch',
      amount: 8999,
      status: 'pending',
      date: '2026-02-16'
    },
    {
      id: 'ORD-003',
      customer: 'Amit Patel',
      product: 'Cotton T-Shirt',
      amount: 499,
      status: 'processing',
      date: '2026-02-16'
    },
    {
      id: 'ORD-004',
      customer: 'Sneha Reddy',
      product: 'Yoga Mat',
      amount: 1299,
      status: 'delivered',
      date: '2026-02-15'
    },
    {
      id: 'ORD-005',
      customer: 'Vikram Singh',
      product: 'Organic Green Tea',
      amount: 299,
      status: 'cancelled',
      date: '2026-02-15'
    }
  ],
  topProducts: [
    {
      id: 1,
      name: 'Wireless Headphones',
      category: 'Electronics',
      sold: 145,
      revenue: 434855,
      trend: 'up'
    },
    {
      id: 2,
      name: 'Smart Watch',
      category: 'Electronics',
      sold: 98,
      revenue: 881902,
      trend: 'up'
    },
    {
      id: 3,
      name: 'Cotton T-Shirt',
      category: 'Fashion',
      sold: 324,
      revenue: 161676,
      trend: 'down'
    },
    {
      id: 4,
      name: 'Yoga Mat',
      category: 'Sports',
      sold: 87,
      revenue: 112913,
      trend: 'up'
    },
    {
      id: 5,
      name: 'Organic Green Tea',
      category: 'Food & Beverage',
      sold: 256,
      revenue: 76544,
      trend: 'up'
    }
  ],
  salesByCategory: [
    { category: 'Electronics', sales: 1316757, percentage: 53.6 },
    { category: 'Fashion', sales: 491780, percentage: 20.0 },
    { category: 'Sports & Outdoors', sales: 344234, percentage: 14.0 },
    { category: 'Food & Beverage', sales: 196712, percentage: 8.0 },
    { category: 'Others', sales: 109417, percentage: 4.4 }
  ],
  monthlySales: [
    { month: 'Jan', sales: 185000 },
    { month: 'Feb', sales: 220000 },
    { month: 'Mar', sales: 198000 },
    { month: 'Apr', sales: 245000 },
    { month: 'May', sales: 267000 },
    { month: 'Jun', sales: 289000 }
  ],
  notifications: [
    {
      id: 1,
      type: 'warning',
      message: '5 products are low in stock',
      time: '2 hours ago'
    },
    {
      id: 2,
      type: 'success',
      message: 'New order received - ORD-001',
      time: '3 hours ago'
    },
    {
      id: 3,
      type: 'info',
      message: 'Monthly report is ready',
      time: '5 hours ago'
    },
    {
      id: 4,
      type: 'error',
      message: 'Payment failed for order ORD-089',
      time: '1 day ago'
    }
  ]
};

// Custom Hook for Dashboard Data
export const useDashboardData = () => {
  const [dashboardData, setDashboardData] = useState(INITIAL_DASHBOARD_DATA);
  const [loading, setLoading] = useState(false);

  // Refresh Dashboard Data
  const refreshDashboard = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setDashboardData(INITIAL_DASHBOARD_DATA);
    setLoading(false);
  };

  // Get Order Status Color
  const getOrderStatusColor = (status) => {
    const colors = {
      delivered: 'bg-green-100 text-green-700 border-green-300',
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      processing: 'bg-blue-100 text-blue-700 border-blue-300',
      cancelled: 'bg-red-100 text-red-700 border-red-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  // Get Notification Color
  const getNotificationColor = (type) => {
    const colors = {
      success: 'bg-green-50 border-green-200 text-green-800',
      warning: 'bg-orange-50 border-orange-200 text-orange-800',
      error: 'bg-red-50 border-red-200 text-red-800',
      info: 'bg-blue-50 border-blue-200 text-blue-800'
    };
    return colors[type] || 'bg-gray-50 border-gray-200 text-gray-800';
  };

  return {
    dashboardData,
    loading,
    refreshDashboard,
    getOrderStatusColor,
    getNotificationColor
  };
};

// Export constants
export const ORDER_STATUSES = ['delivered', 'pending', 'processing', 'cancelled'];
export const NOTIFICATION_TYPES = ['success', 'warning', 'error', 'info'];
