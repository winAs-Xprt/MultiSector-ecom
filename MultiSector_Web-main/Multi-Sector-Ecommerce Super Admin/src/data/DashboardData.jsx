// src/data/DashboardData.jsx
import { useState } from 'react';

const INITIAL_DASHBOARD_DATA = {
  overview: {
    totalIndustries: 12,
    totalAdmins: 48,
    totalSites: 134,
    totalBuyers: 2891,
    industriesGrowth: 8.3,
    adminsGrowth: 12.5,
    sitesGrowth: 18.7,
    buyersGrowth: 22.4
  },

  recentActivity: [
    {
      id: 'ACT-001',
      adminName: 'Rajesh Kumar',
      email: 'rajesh@abcschool.com',
      action: 'Site Created',
      site: 'ABC School',
      industry: 'School',
      status: 'active',
      date: '2026-02-17'
    },
    {
      id: 'ACT-002',
      adminName: 'Priya Sharma',
      email: 'priya@xyzhosp.com',
      action: 'Admin Created',
      site: 'XYZ Hospital',
      industry: 'Hospital',
      status: 'active',
      date: '2026-02-16'
    },
    {
      id: 'ACT-003',
      adminName: 'Amit Patel',
      email: 'amit@garageplus.com',
      action: 'Access Revoked',
      site: 'Garage Plus',
      industry: 'Garage',
      status: 'inactive',
      date: '2026-02-16'
    },
    {
      id: 'ACT-004',
      adminName: 'Sneha Reddy',
      email: 'sneha@cityschool.com',
      action: 'Password Reset',
      site: 'City School',
      industry: 'School',
      status: 'active',
      date: '2026-02-15'
    },
    {
      id: 'ACT-005',
      adminName: 'Vikram Singh',
      email: 'vikram@medhub.com',
      action: 'Site Deactivated',
      site: 'Med Hub',
      industry: 'Hospital',
      status: 'inactive',
      date: '2026-02-15'
    }
  ],

  topSites: [
    { id: 1, name: 'ABC School',    industry: 'School',   admin: 'Rajesh Kumar', buyers: 342, status: 'active',   trend: 'up'   },
    { id: 2, name: 'XYZ Hospital',  industry: 'Hospital', admin: 'Priya Sharma', buyers: 289, status: 'active',   trend: 'up'   },
    { id: 3, name: 'Garage Plus',   industry: 'Garage',   admin: 'Amit Patel',   buyers: 187, status: 'active',   trend: 'down' },
    { id: 4, name: 'City School',   industry: 'School',   admin: 'Sneha Reddy',  buyers: 156, status: 'active',   trend: 'up'   },
    { id: 5, name: 'Med Hub',       industry: 'Hospital', admin: 'Vikram Singh', buyers: 98,  status: 'inactive', trend: 'down' }
  ],

  industryStats: [
    { industry: 'School',   sites: 42, admins: 42, buyers: 980, percentage: 31.3 },
    { industry: 'Hospital', sites: 35, admins: 35, buyers: 756, percentage: 26.1 },
    { industry: 'Garage',   sites: 28, admins: 28, buyers: 534, percentage: 20.9 },
    { industry: 'Pharmacy', sites: 18, admins: 18, buyers: 387, percentage: 13.4 },
    { industry: 'Others',   sites: 11, admins: 11, buyers: 234, percentage: 8.2  }
  ],

  monthlyGrowth: [
    { month: 'Sep', sites: 18, admins: 18 },
    { month: 'Oct', sites: 24, admins: 22 },
    { month: 'Nov', sites: 31, admins: 28 },
    { month: 'Dec', sites: 27, admins: 25 },
    { month: 'Jan', sites: 38, admins: 35 },
    { month: 'Feb', sites: 42, admins: 38 }
  ],

  systemAlerts: [
    { id: 1, type: 'warning', message: '3 admin accounts pending verification',       time: '1 hour ago'  },
    { id: 2, type: 'success', message: 'New site "ABC School" created successfully',   time: '2 hours ago' },
    { id: 3, type: 'error',   message: 'Login failed 5 times — admin@medhub.com',     time: '3 hours ago' },
    { id: 4, type: 'info',    message: 'Monthly admin activity report is ready',       time: '5 hours ago' }
  ]
};

// ─── Custom Hook ───────────────────────────────────────────────────────────────
export const useDashboardData = () => {
  const [dashboardData, setDashboardData] = useState(INITIAL_DASHBOARD_DATA);
  const [loading, setLoading] = useState(false);

  const refreshDashboard = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setDashboardData(INITIAL_DASHBOARD_DATA);
    setLoading(false);
  };

  const getActivityStatusColor = (status) => {
    const colors = {
      active:   'bg-green-100 text-green-700 border-green-300',
      inactive: 'bg-red-100 text-red-700 border-red-300',
      pending:  'bg-yellow-100 text-yellow-700 border-yellow-300',
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const getActionColor = (action) => {
    const colors = {
      'Site Created':    'bg-green-100 text-green-700 border-green-300',
      'Admin Created':   'bg-blue-100 text-blue-700 border-blue-300',
      'Access Revoked':  'bg-red-100 text-red-700 border-red-300',
      'Password Reset':  'bg-yellow-100 text-yellow-700 border-yellow-300',
      'Site Deactivated':'bg-orange-100 text-orange-700 border-orange-300',
    };
    return colors[action] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const getNotificationColor = (type) => {
    const colors = {
      success: 'bg-green-50 border-green-200 text-green-800',
      warning: 'bg-orange-50 border-orange-200 text-orange-800',
      error:   'bg-red-50 border-red-200 text-red-800',
      info:    'bg-blue-50 border-blue-200 text-blue-800'
    };
    return colors[type] || 'bg-gray-50 border-gray-200 text-gray-800';
  };

  return {
    dashboardData,
    loading,
    refreshDashboard,
    getActivityStatusColor,
    getActionColor,
    getNotificationColor
  };
};

export const ACTIVITY_STATUSES  = ['active', 'inactive', 'pending'];
export const NOTIFICATION_TYPES = ['success', 'warning', 'error', 'info'];
