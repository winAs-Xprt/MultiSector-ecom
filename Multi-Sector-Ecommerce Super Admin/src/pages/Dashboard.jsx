// src/pages/Dashboard.jsx
import Layout from '../components/Layout';
import { Card, CardHeader, CardBody } from '../components/common/Card';
import { SecondaryButton } from '../components/common/Button';
import { useDashboardData } from '../data/DashboardData';
import {
  FaBuilding, FaUserShield, FaSitemap, FaUsers,
  FaArrowUp, FaArrowDown, FaSync, FaEye, FaChartLine,
  FaCheckCircle, FaTimesCircle, FaLock, FaPlus, FaBan,
  FaCaretUp, FaCaretDown, FaTimes
} from 'react-icons/fa';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend, Filler
);

const Dashboard = () => {
  const {
    dashboardData, loading, refreshDashboard,
    getActivityStatusColor, getActionColor
  } = useDashboardData();

  const { overview, recentActivity, topSites, industryStats, monthlyGrowth } = dashboardData;

  // ─── Growth Icon ──────────────────────────────────────────────────────────
  const getGrowthIcon = (growth) =>
    growth >= 0 ? (
      <span className="flex items-center text-green-600 text-sm font-semibold">
        <FaArrowUp className="mr-1" /> {growth}%
      </span>
    ) : (
      <span className="flex items-center text-red-600 text-sm font-semibold">
        <FaArrowDown className="mr-1" /> {Math.abs(growth)}%
      </span>
    );

  // ─── Action Icon ──────────────────────────────────────────────────────────
  const getActionIcon = (action) => {
    const icons = {
      'Site Created':    <FaCheckCircle  className="text-green-600" />,
      'Admin Created':   <FaPlus         className="text-blue-600"  />,
      'Access Revoked':  <FaBan          className="text-red-600"   />,
      'Password Reset':  <FaLock         className="text-yellow-600"/>,
      'Site Deactivated':<FaTimesCircle  className="text-orange-600"/>,
    };
    return icons[action] || <FaCheckCircle className="text-gray-600" />;
  };

  // ─── Line Chart — Monthly Growth ──────────────────────────────────────────
  const lineChartData = {
    labels: monthlyGrowth.map(i => i.month),
    datasets: [
      {
        label: 'Sites Created',
        data: monthlyGrowth.map(i => i.sites),
        borderColor: 'rgb(236, 72, 153)',
        backgroundColor: 'rgba(236, 72, 153, 0.1)',
        fill: true, tension: 0.4,
        pointRadius: 5, pointBackgroundColor: 'rgb(236, 72, 153)',
        pointBorderColor: '#fff', pointBorderWidth: 2, pointHoverRadius: 7
      },
      {
        label: 'Admins Added',
        data: monthlyGrowth.map(i => i.admins),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.05)',
        fill: true, tension: 0.4,
        pointRadius: 5, pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff', pointBorderWidth: 2, pointHoverRadius: 7
      }
    ]
  };

  const lineChartOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'top', labels: { font: { size: 12, weight: 'bold' }, padding: 15 } },
      tooltip: { backgroundColor: 'rgba(0,0,0,0.8)', padding: 12, titleFont: { size: 14, weight: 'bold' }, bodyFont: { size: 13 } }
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 10 }, grid: { color: 'rgba(236, 72, 153, 0.1)' } },
      x: { grid: { display: false } }
    }
  };

  // ─── Bar Chart — Industry-wise Sites ─────────────────────────────────────
  const barChartData = {
    labels: industryStats.map(i => i.industry),
    datasets: [{
      label: 'Sites',
      data: industryStats.map(i => i.sites),
      backgroundColor: ['rgba(236,72,153,0.8)','rgba(59,130,246,0.8)','rgba(16,185,129,0.8)','rgba(251,146,60,0.8)','rgba(168,85,247,0.8)'],
      borderColor:      ['rgb(236,72,153)','rgb(59,130,246)','rgb(16,185,129)','rgb(251,146,60)','rgb(168,85,247)'],
      borderWidth: 2, borderRadius: 8
    }]
  };

  const barChartOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)', padding: 12,
        titleFont: { size: 14, weight: 'bold' }, bodyFont: { size: 13 },
        callbacks: { label: (ctx) => ctx.parsed.y + ' Sites' }
      }
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 10 }, grid: { color: 'rgba(236, 72, 153, 0.1)' } },
      x: { grid: { display: false } }
    }
  };

  // ─── Doughnut Chart — Industry Distribution ───────────────────────────────
  const doughnutChartData = {
    labels: industryStats.map(i => i.industry),
    datasets: [{
      data: industryStats.map(i => i.percentage),
      backgroundColor: ['rgba(236,72,153,0.8)','rgba(59,130,246,0.8)','rgba(16,185,129,0.8)','rgba(251,146,60,0.8)','rgba(168,85,247,0.8)'],
      borderColor:      ['rgb(236,72,153)','rgb(59,130,246)','rgb(16,185,129)','rgb(251,146,60)','rgb(168,85,247)'],
      borderWidth: 2
    }]
  };

  const doughnutChartOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { padding: 15, font: { size: 12, weight: 'bold' } } },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)', padding: 12,
        titleFont: { size: 14, weight: 'bold' }, bodyFont: { size: 13 },
        callbacks: { label: (ctx) => ctx.label + ': ' + ctx.parsed + '%' }
      }
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <Layout>
      {/* Page Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-pink-700 bg-clip-text text-transparent mb-2">
            Super Admin Dashboard
          </h1>
          <p className="text-gray-600">Welcome back! Here's the platform overview for today</p>
        </div>
        <SecondaryButton
          onClick={refreshDashboard}
          disabled={loading}
          icon={<FaSync className={loading ? 'animate-spin' : ''} />}
        >
          Refresh
        </SecondaryButton>
      </div>

      {/* ── Overview Cards ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">

        {/* Industries */}
        <Card className="hover:shadow-xl transition-all duration-300 border-l-4 border-pink-500">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
              <FaBuilding className="text-white text-xl" />
            </div>
            {getGrowthIcon(overview.industriesGrowth)}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">Total Industries</p>
            <p className="text-2xl font-bold text-gray-800">{overview.totalIndustries}</p>
            <p className="text-xs text-gray-500 mt-2">School, Hospital, Garage & more</p>
          </div>
        </Card>

        {/* Admins */}
        <Card className="hover:shadow-xl transition-all duration-300 border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <FaUserShield className="text-white text-xl" />
            </div>
            {getGrowthIcon(overview.adminsGrowth)}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">Total Admins</p>
            <p className="text-2xl font-bold text-gray-800">{overview.totalAdmins}</p>
            <p className="text-xs text-gray-500 mt-2">+{Math.round(overview.totalAdmins * 0.125)} added this month</p>
          </div>
        </Card>

        {/* Sites */}
        <Card className="hover:shadow-xl transition-all duration-300 border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <FaSitemap className="text-white text-xl" />
            </div>
            {getGrowthIcon(overview.sitesGrowth)}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">Total Sites</p>
            <p className="text-2xl font-bold text-gray-800">{overview.totalSites}</p>
            <p className="text-xs text-gray-500 mt-2">+{Math.round(overview.totalSites * 0.08)} new this month</p>
          </div>
        </Card>

        {/* Buyers */}
        <Card className="hover:shadow-xl transition-all duration-300 border-l-4 border-purple-500">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <FaUsers className="text-white text-xl" />
            </div>
            {getGrowthIcon(overview.buyersGrowth)}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">Total Buyers</p>
            <p className="text-2xl font-bold text-gray-800">{overview.totalBuyers.toLocaleString('en-IN')}</p>
            <p className="text-xs text-gray-500 mt-2">+{Math.round(overview.totalBuyers * 0.157)} new buyers</p>
          </div>
        </Card>
      </div>

      {/* ── Charts Row ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader
            title="Monthly Growth Trend"
            subtitle="Sites created vs Admins added — last 6 months"
          />
          <CardBody>
            <div className="h-80">
              <Line data={lineChartData} options={lineChartOptions} />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Industry-wise Sites"
            subtitle="Number of active sites per industry"
          />
          <CardBody>
            <div className="h-80">
              <Bar data={barChartData} options={barChartOptions} />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* ── Distribution + Top Sites ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader
            title="Industry Distribution"
            subtitle="Percentage share by industry"
          />
          <CardBody>
            <div className="h-80">
              <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
            </div>
          </CardBody>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader
            title="Top Performing Sites"
            subtitle="Ranked by buyer count"
            action={
              <button className="text-pink-600 hover:text-pink-700 text-sm font-semibold flex items-center gap-1">
                <FaChartLine /> Analytics
              </button>
            }
          />
          <CardBody>
            <div className="space-y-4">
              {topSites.map((site, index) => (
                <div
                  key={site.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-pink-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{site.name}</p>
                      <p className="text-xs text-gray-500">{site.industry} · {site.admin}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${
                      site.status === 'active'
                        ? 'bg-green-100 text-green-700 border-green-300'
                        : 'bg-red-100 text-red-700 border-red-300'
                    }`}>
                      {site.status}
                    </span>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-800">{site.buyers} Buyers</p>
                      <div className="flex items-center gap-1 justify-end">
                        {site.trend === 'up'
                          ? <FaCaretUp   className="text-green-600 text-sm" />
                          : <FaCaretDown className="text-red-600 text-sm"   />
                        }
                        <span className="text-xs text-gray-500">this month</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* ── Recent Admin Activity Table ──────────────────────────────────────── */}
      <Card>
        <CardHeader
          title="Recent Admin Activity"
          subtitle={`${recentActivity.length} latest actions`}
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
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Admin</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Site</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Industry</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Action</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pink-50">
                {recentActivity.map((activity) => (
                  <tr key={activity.id} className="hover:bg-pink-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{activity.id}</td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-semibold text-gray-800">{activity.adminName}</p>
                      <p className="text-xs text-gray-500">{activity.email}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{activity.site}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{activity.industry}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border-2 ${getActionColor(activity.action)}`}>
                        {getActionIcon(activity.action)}
                        {activity.action}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border-2 ${getActivityStatusColor(activity.status)}`}>
                        {activity.status === 'active'
                          ? <FaCheckCircle className="text-green-600" />
                          : <FaTimes       className="text-red-600"   />
                        }
                        {activity.status}
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
