import { useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardHeader, CardBody } from '../components/common/Card';
import { SecondaryButton } from '../components/common/Button';
import { useDashboardData } from '../data/DashboardData';
import { 
  FaRupeeSign, 
  FaShoppingCart, 
  FaBox, 
  FaUsers, 
  FaArrowUp,
  FaArrowDown,
  FaSync,
  FaEye,
  FaChartLine,
  FaCheckCircle,
  FaClock,
  FaSpinner,
  FaTimes,
  FaCaretUp,
  FaCaretDown
} from 'react-icons/fa';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const { dashboardData, loading, refreshDashboard, getOrderStatusColor } = useDashboardData();
  const { overview, recentOrders, topProducts, salesByCategory, monthlySales } = dashboardData;

  // Get Growth Icon
  const getGrowthIcon = (growth) => {
    return growth >= 0 ? (
      <span className="flex items-center text-green-600 text-sm font-semibold">
        <FaArrowUp className="mr-1" />
        {growth}%
      </span>
    ) : (
      <span className="flex items-center text-red-600 text-sm font-semibold">
        <FaArrowDown className="mr-1" />
        {Math.abs(growth)}%
      </span>
    );
  };

  // Get Status Icon
  const getStatusIcon = (status) => {
    const icons = {
      delivered: <FaCheckCircle className="text-green-600" />,
      pending: <FaClock className="text-yellow-600" />,
      processing: <FaSpinner className="text-blue-600" />,
      cancelled: <FaTimes className="text-red-600" />
    };
    return icons[status] || <FaClock className="text-gray-600" />;
  };

  // Line Chart Data - Monthly Sales Trend
  const lineChartData = {
    labels: monthlySales.map(item => item.month),
    datasets: [
      {
        label: 'Sales (₹)',
        data: monthlySales.map(item => item.sales),
        borderColor: 'rgb(236, 72, 153)',
        backgroundColor: 'rgba(236, 72, 153, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: 'rgb(236, 72, 153)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 7
      }
    ]
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        callbacks: {
          label: function(context) {
            return '₹' + context.parsed.y.toLocaleString('en-IN');
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '₹' + (value / 1000) + 'K';
          }
        },
        grid: {
          color: 'rgba(236, 72, 153, 0.1)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  // Bar Chart Data - Sales by Category
  const barChartData = {
    labels: salesByCategory.map(cat => cat.category),
    datasets: [
      {
        label: 'Sales (₹)',
        data: salesByCategory.map(cat => cat.sales),
        backgroundColor: [
          'rgba(236, 72, 153, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(168, 85, 247, 0.8)'
        ],
        borderColor: [
          'rgb(236, 72, 153)',
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(251, 146, 60)',
          'rgb(168, 85, 247)'
        ],
        borderWidth: 2,
        borderRadius: 8
      }
    ]
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        callbacks: {
          label: function(context) {
            return '₹' + context.parsed.y.toLocaleString('en-IN');
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '₹' + (value / 1000) + 'K';
          }
        },
        grid: {
          color: 'rgba(236, 72, 153, 0.1)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  // Doughnut Chart Data - Sales Distribution by Category
  const doughnutChartData = {
    labels: salesByCategory.map(cat => cat.category),
    datasets: [
      {
        data: salesByCategory.map(cat => cat.percentage),
        backgroundColor: [
          'rgba(236, 72, 153, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(168, 85, 247, 0.8)'
        ],
        borderColor: [
          'rgb(236, 72, 153)',
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(251, 146, 60)',
          'rgb(168, 85, 247)'
        ],
        borderWidth: 2
      }
    ]
  };

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          font: {
            size: 12,
            weight: 'bold'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        callbacks: {
          label: function(context) {
            return context.label + ': ' + context.parsed + '%';
          }
        }
      }
    }
  };

  return (
    <Layout>
      {/* Page Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-pink-700 bg-clip-text text-transparent mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600">Welcome back! Here's what's happening today</p>
        </div>
        <SecondaryButton 
          onClick={refreshDashboard} 
          disabled={loading}
          icon={<FaSync className={loading ? 'animate-spin' : ''} />}
        >
          Refresh
        </SecondaryButton>
      </div>

      {/* Overview Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Total Revenue */}
        <Card className="hover:shadow-xl transition-all duration-300 border-l-4 border-pink-500">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
              <FaRupeeSign className="text-white text-xl" />
            </div>
            {getGrowthIcon(overview.revenueGrowth)}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-800">₹{overview.totalRevenue.toLocaleString('en-IN')}</p>
            <p className="text-xs text-gray-500 mt-2">+₹{(overview.totalRevenue * 0.125).toFixed(0)} from last month</p>
          </div>
        </Card>

        {/* Total Orders */}
        <Card className="hover:shadow-xl transition-all duration-300 border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <FaShoppingCart className="text-white text-xl" />
            </div>
            {getGrowthIcon(overview.ordersGrowth)}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">Total Orders</p>
            <p className="text-2xl font-bold text-gray-800">{overview.totalOrders.toLocaleString('en-IN')}</p>
            <p className="text-xs text-gray-500 mt-2">+{Math.round(overview.totalOrders * 0.083)} from last month</p>
          </div>
        </Card>

        {/* Total Products */}
        <Card className="hover:shadow-xl transition-all duration-300 border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <FaBox className="text-white text-xl" />
            </div>
            {getGrowthIcon(overview.productsGrowth)}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">Total Products</p>
            <p className="text-2xl font-bold text-gray-800">{overview.totalProducts}</p>
            <p className="text-xs text-gray-500 mt-2">+{Math.round(overview.totalProducts * 0.052)} new products</p>
          </div>
        </Card>

        {/* Total Customers */}
        <Card className="hover:shadow-xl transition-all duration-300 border-l-4 border-purple-500">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <FaUsers className="text-white text-xl" />
            </div>
            {getGrowthIcon(overview.customersGrowth)}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">Total Customers</p>
            <p className="text-2xl font-bold text-gray-800">{overview.totalCustomers.toLocaleString('en-IN')}</p>
            <p className="text-xs text-gray-500 mt-2">+{Math.round(overview.totalCustomers * 0.157)} new customers</p>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly Sales Trend - Line Chart */}
        <Card>
          <CardHeader 
            title="Monthly Sales Trend" 
            subtitle="Last 6 months performance"
          />
          <CardBody>
            <div className="h-80">
              <Line data={lineChartData} options={lineChartOptions} />
            </div>
          </CardBody>
        </Card>

        {/* Sales by Category - Bar Chart */}
        <Card>
          <CardHeader 
            title="Sales by Category" 
            subtitle="Category-wise revenue breakdown"
          />
          <CardBody>
            <div className="h-80">
              <Bar data={barChartData} options={barChartOptions} />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Sales Distribution and Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Sales Distribution - Doughnut Chart */}
        <Card>
          <CardHeader 
            title="Sales Distribution" 
            subtitle="Percentage by category"
          />
          <CardBody>
            <div className="h-80">
              <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
            </div>
          </CardBody>
        </Card>

        {/* Top Products - 2 columns */}
        <Card className="lg:col-span-2">
          <CardHeader 
            title="Top Products" 
            subtitle="Best selling items"
            action={
              <button className="text-pink-600 hover:text-pink-700 text-sm font-semibold flex items-center gap-1">
                <FaChartLine /> Analytics
              </button>
            }
          />
          <CardBody>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-pink-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-800">₹{product.revenue.toLocaleString('en-IN')}</p>
                    <div className="flex items-center gap-1 justify-end">
                      {product.trend === 'up' ? (
                        <FaCaretUp className="text-green-600 text-sm" />
                      ) : (
                        <FaCaretDown className="text-red-600 text-sm" />
                      )}
                      <span className="text-xs text-gray-500">{product.sold} sold</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader 
          title="Recent Orders" 
          subtitle={`${recentOrders.length} orders`}
          action={
            <button className="text-pink-600 hover:text-pink-700 text-sm font-semibold flex items-center gap-1">
              <FaEye /> View All
            </button>
          }
        />
        <CardBody>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b-2 border-pink-100">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Order ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pink-50">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-pink-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{order.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{order.customer}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{order.product}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-800">₹{order.amount.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border-2 ${getOrderStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </Layout>
  );
};

export default Dashboard;
