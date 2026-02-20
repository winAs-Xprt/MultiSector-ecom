import { useState } from 'react';
import Layout from '../components/Layout';
import { useDashboardData } from '../data/DashboardData';
import {
  FaRupeeSign, FaShoppingCart, FaBox, FaUsers,
  FaArrowUp, FaArrowDown, FaSync, FaEye, FaChartLine,
  FaCheckCircle, FaClock, FaSpinner, FaTimes,
  FaCaretUp, FaCaretDown
} from 'react-icons/fa';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend, Filler
);

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, sub, icon, accentColor, growth }) => {
  const accents = {
    pink:   { bg: '#fdf2f8', iconBg: '#ec4899', bar: '#ec4899' },
    blue:   { bg: '#eff6ff', iconBg: '#2563eb', bar: '#2563eb' },
    green:  { bg: '#f0fdf4', iconBg: '#16a34a', bar: '#16a34a' },
    purple: { bg: '#faf5ff', iconBg: '#7c3aed', bar: '#7c3aed' },
  };
  const a = accents[accentColor] || accents.pink;
  const positive = growth >= 0;

  return (
    <div style={{
      background: '#fff', borderRadius: '14px', padding: '20px 22px',
      border: '1px solid #f0f0f0', boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
      position: 'relative', overflow: 'hidden', transition: 'box-shadow 0.2s, transform 0.2s',
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)'; e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      {/* Left color bar */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', background: a.bar, borderRadius: '14px 0 0 14px' }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: a.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ color: a.iconBg, fontSize: '17px' }}>{icon}</span>
        </div>
        {/* Growth Badge */}
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: '3px',
          padding: '3px 8px', borderRadius: '20px', fontSize: '12px', fontWeight: 700,
          background: positive ? '#f0fdf4' : '#fef2f2',
          color: positive ? '#16a34a' : '#ef4444',
        }}>
          {positive ? <FaArrowUp style={{ fontSize: '9px' }} /> : <FaArrowDown style={{ fontSize: '9px' }} />}
          {Math.abs(growth)}%
        </span>
      </div>

      <p style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '5px' }}>
        {label}
      </p>
      <p style={{ fontSize: '26px', fontWeight: 800, color: '#111827', letterSpacing: '-0.5px', lineHeight: 1, marginBottom: '5px' }}>
        {value}
      </p>
      <p style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 500 }}>{sub}</p>
    </div>
  );
};

// ─── Section Header ───────────────────────────────────────────────────────────
const SectionHeader = ({ title, subtitle, action }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', paddingBottom: '14px', borderBottom: '1px solid #f5f5f5' }}>
    <div>
      <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', margin: 0, letterSpacing: '-0.2px' }}>{title}</h2>
      {subtitle && <p style={{ fontSize: '12.5px', color: '#9ca3af', marginTop: '3px', fontWeight: 500 }}>{subtitle}</p>}
    </div>
    {action}
  </div>
);

// ─── Panel ────────────────────────────────────────────────────────────────────
const Panel = ({ children, style = {} }) => (
  <div style={{ background: '#fff', borderRadius: '14px', padding: '20px 22px', border: '1px solid #f0f0f0', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', ...style }}>
    {children}
  </div>
);

// ─── Status Badge ─────────────────────────────────────────────────────────────
const statusConfig = {
  delivered:  { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0', icon: <FaCheckCircle style={{ fontSize: '10px' }} /> },
  pending:    { bg: '#fefce8', color: '#ca8a04', border: '#fde68a', icon: <FaClock        style={{ fontSize: '10px' }} /> },
  processing: { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe', icon: <FaSpinner      style={{ fontSize: '10px' }} /> },
  cancelled:  { bg: '#fef2f2', color: '#ef4444', border: '#fecaca', icon: <FaTimes        style={{ fontSize: '10px' }} /> },
};

const StatusBadge = ({ status }) => {
  const s = statusConfig[status] || statusConfig.pending;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
      {s.icon}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// ─── Chart config helpers ─────────────────────────────────────────────────────
const tooltipDefaults = {
  backgroundColor: '#1f2937',
  padding: 10,
  cornerRadius: 8,
  titleFont: { size: 13, weight: 'bold', family: 'Plus Jakarta Sans' },
  bodyFont:  { size: 12, family: 'Plus Jakarta Sans' },
  titleColor: '#f9fafb',
  bodyColor:  '#d1d5db',
};

const CHART_COLORS = [
  '#ec4899', '#2563eb', '#16a34a', '#ea580c', '#7c3aed'
];
const CHART_COLORS_ALPHA = [
  'rgba(236,72,153,0.75)', 'rgba(37,99,235,0.75)', 'rgba(22,163,74,0.75)',
  'rgba(234,88,12,0.75)',  'rgba(124,58,237,0.75)'
];

// ─── Dashboard ────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const { dashboardData, loading, refreshDashboard } = useDashboardData();
  const { overview, recentOrders, topProducts, salesByCategory, monthlySales } = dashboardData;

  // ── Chart Data ──
  const lineChartData = {
    labels: monthlySales.map(i => i.month),
    datasets: [{
      label: 'Sales (₹)',
      data: monthlySales.map(i => i.sales),
      borderColor: '#ec4899',
      backgroundColor: 'rgba(236,72,153,0.08)',
      fill: true, tension: 0.4,
      pointRadius: 4, pointBackgroundColor: '#ec4899',
      pointBorderColor: '#fff', pointBorderWidth: 2, pointHoverRadius: 6,
    }],
  };

  const lineChartOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { ...tooltipDefaults, callbacks: { label: ctx => ' ₹' + ctx.parsed.y.toLocaleString('en-IN') } },
    },
    scales: {
      y: { beginAtZero: true, ticks: { callback: v => '₹' + v / 1000 + 'K', font: { size: 11, family: 'Plus Jakarta Sans' }, color: '#9ca3af' }, grid: { color: '#f5f5f5' }, border: { display: false } },
      x: { ticks: { font: { size: 11, family: 'Plus Jakarta Sans' }, color: '#9ca3af' }, grid: { display: false }, border: { display: false } },
    },
  };

  const barChartData = {
    labels: salesByCategory.map(c => c.category),
    datasets: [{
      label: 'Sales (₹)',
      data: salesByCategory.map(c => c.sales),
      backgroundColor: CHART_COLORS_ALPHA,
      borderColor: CHART_COLORS,
      borderWidth: 1.5, borderRadius: 6,
    }],
  };

  const barChartOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { ...tooltipDefaults, callbacks: { label: ctx => ' ₹' + ctx.parsed.y.toLocaleString('en-IN') } },
    },
    scales: {
      y: { beginAtZero: true, ticks: { callback: v => '₹' + v / 1000 + 'K', font: { size: 11, family: 'Plus Jakarta Sans' }, color: '#9ca3af' }, grid: { color: '#f5f5f5' }, border: { display: false } },
      x: { ticks: { font: { size: 11, family: 'Plus Jakarta Sans' }, color: '#9ca3af' }, grid: { display: false }, border: { display: false } },
    },
  };

  const doughnutChartData = {
    labels: salesByCategory.map(c => c.category),
    datasets: [{
      data: salesByCategory.map(c => c.percentage),
      backgroundColor: CHART_COLORS_ALPHA,
      borderColor: CHART_COLORS,
      borderWidth: 2,
    }],
  };

  const doughnutChartOptions = {
    responsive: true, maintainAspectRatio: false,
    cutout: '68%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: { padding: 14, font: { size: 11, weight: '600', family: 'Plus Jakarta Sans' }, color: '#6b7280', usePointStyle: true, pointStyleWidth: 8 },
      },
      tooltip: { ...tooltipDefaults, callbacks: { label: ctx => ' ' + ctx.label + ': ' + ctx.parsed + '%' } },
    },
  };

  return (
    <Layout>
      <div className="fade-up" style={{ maxWidth: '1400px', margin: '0 auto' }}>

        {/* ── Page Header ───────────────────────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#111827', letterSpacing: '-0.5px', marginBottom: '4px' }}>
              Dashboard
            </h1>
            <p style={{ fontSize: '13.5px', color: '#9ca3af', fontWeight: 500 }}>
              Welcome back! Here's what's happening today
            </p>
          </div>
          <button
            onClick={refreshDashboard}
            disabled={loading}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '7px',
              padding: '9px 18px', fontSize: '13.5px', fontWeight: 600,
              color: loading ? '#9ca3af' : '#374151',
              background: '#fff', border: '1.5px solid #f0f0f0',
              borderRadius: '10px', cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit', transition: 'all 0.18s',
            }}
            onMouseEnter={e => { if (!loading) { e.currentTarget.style.borderColor = '#ec4899'; e.currentTarget.style.color = '#ec4899'; } }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#f0f0f0'; e.currentTarget.style.color = '#374151'; }}
          >
            <FaSync style={{ fontSize: '12px', animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
          <style>{`@keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }`}</style>
        </div>

        {/* ── Stat Cards ─────────────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '14px', marginBottom: '22px' }}>
          <StatCard
            label="Total Revenue" accentColor="pink" growth={overview.revenueGrowth}
            value={`₹${overview.totalRevenue.toLocaleString('en-IN')}`}
            sub={`+₹${(overview.totalRevenue * 0.125).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} from last month`}
            icon={<FaRupeeSign />}
          />
          <StatCard
            label="Total Orders" accentColor="blue" growth={overview.ordersGrowth}
            value={overview.totalOrders.toLocaleString('en-IN')}
            sub={`+${Math.round(overview.totalOrders * 0.083)} from last month`}
            icon={<FaShoppingCart />}
          />
          <StatCard
            label="Total Products" accentColor="green" growth={overview.productsGrowth}
            value={overview.totalProducts}
            sub={`+${Math.round(overview.totalProducts * 0.052)} new products`}
            icon={<FaBox />}
          />
          <StatCard
            label="Total Customers" accentColor="purple" growth={overview.customersGrowth}
            value={overview.totalCustomers.toLocaleString('en-IN')}
            sub={`+${Math.round(overview.totalCustomers * 0.157)} new customers`}
            icon={<FaUsers />}
          />
        </div>

        {/* ── Charts Row 1 ───────────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '14px', marginBottom: '14px' }}>

          {/* Line Chart */}
          <Panel>
            <SectionHeader title="Monthly Sales Trend" subtitle="Last 6 months performance" />
            <div style={{ height: '260px' }}>
              <Line data={lineChartData} options={lineChartOptions} />
            </div>
          </Panel>

          {/* Bar Chart */}
          <Panel>
            <SectionHeader title="Sales by Category" subtitle="Category-wise revenue breakdown" />
            <div style={{ height: '260px' }}>
              <Bar data={barChartData} options={barChartOptions} />
            </div>
          </Panel>

        </div>

        {/* ── Charts Row 2 + Top Products ────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '14px', marginBottom: '14px' }} className="dashboard-grid-2">

          {/* Doughnut */}
          <Panel>
            <SectionHeader title="Sales Distribution" subtitle="Percentage by category" />
            <div style={{ height: '280px' }}>
              <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
            </div>
          </Panel>

          {/* Top Products */}
          <Panel>
            <SectionHeader
              title="Top Products"
              subtitle="Best selling items this month"
              action={
                <button
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '13px', fontWeight: 600, color: '#ec4899', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#db2777'}
                  onMouseLeave={e => e.currentTarget.style.color = '#ec4899'}
                >
                  <FaChartLine style={{ fontSize: '11px' }} /> Analytics
                </button>
              }
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {topProducts.map((product, idx) => (
                <div
                  key={product.id}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 13px', borderRadius: '10px', background: '#fafafa', border: '1px solid #f5f5f5', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#fdf2f8'}
                  onMouseLeave={e => e.currentTarget.style.background = '#fafafa'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
                    <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: idx === 0 ? 'linear-gradient(135deg,#ec4899,#db2777)' : '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: idx === 0 ? '#fff' : '#6b7280' }}>{idx + 1}</span>
                    </div>
                    <div>
                      <p style={{ fontSize: '13.5px', fontWeight: 600, color: '#111827', margin: 0, lineHeight: 1.3 }}>{product.name}</p>
                      <p style={{ fontSize: '11.5px', color: '#9ca3af', margin: '2px 0 0' }}>{product.category}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '13.5px', fontWeight: 700, color: '#111827', margin: 0 }}>
                      ₹{product.revenue.toLocaleString('en-IN')}
                    </p>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '11.5px', color: product.trend === 'up' ? '#16a34a' : '#ef4444', fontWeight: 600, marginTop: '2px' }}>
                      {product.trend === 'up'
                        ? <FaCaretUp style={{ fontSize: '11px' }} />
                        : <FaCaretDown style={{ fontSize: '11px' }} />
                      }
                      {product.sold} sold
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

        </div>

        {/* ── Recent Orders ──────────────────────────────────────────────── */}
        <Panel>
          <SectionHeader
            title="Recent Orders"
            subtitle={`${recentOrders.length} latest orders`}
            action={
              <button
                style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '13px', fontWeight: 600, color: '#ec4899', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                onMouseEnter={e => e.currentTarget.style.color = '#db2777'}
                onMouseLeave={e => e.currentTarget.style.color = '#ec4899'}
              >
                <FaEye style={{ fontSize: '11px' }} /> View All
              </button>
            }
          />
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                  {['Order ID', 'Customer', 'Product', 'Amount', 'Status'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', background: '#fafafa' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, idx) => (
                  <tr
                    key={order.id}
                    style={{ borderBottom: idx < recentOrders.length - 1 ? '1px solid #f9f9f9' : 'none', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#fdf2f8'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '13px 14px', whiteSpace: 'nowrap' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#ec4899', background: '#fdf2f8', padding: '3px 8px', borderRadius: '6px' }}>
                        {order.id}
                      </span>
                    </td>
                    <td style={{ padding: '13px 14px', fontWeight: 600, color: '#111827', whiteSpace: 'nowrap' }}>{order.customer}</td>
                    <td style={{ padding: '13px 14px', color: '#6b7280', whiteSpace: 'nowrap' }}>{order.product}</td>
                    <td style={{ padding: '13px 14px', fontWeight: 700, color: '#111827', whiteSpace: 'nowrap' }}>
                      ₹{order.amount.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '13px 14px' }}>
                      <StatusBadge status={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        {/* Responsive */}
        <style>{`
          @media (max-width: 900px) {
            .dashboard-grid-2 { grid-template-columns: 1fr !important; }
          }
        `}</style>

      </div>
    </Layout>
  );
};

export default Dashboard;
