// src/pages/AuditLogs.jsx
import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import { useAuditLogsData, ACTION_TYPES, ENTITY_TYPES, ACTION_META } from '../data/AuditLogsData';
import {
  FaHistory, FaCheckCircle, FaTimesCircle, FaExclamationTriangle,
  FaSearch, FaTimes, FaFilter, FaFileExport, FaEye,
  FaUser, FaCalendarAlt, FaGlobe, FaTag, FaLayerGroup,
  FaInfoCircle, FaShieldAlt, FaSync, FaChevronLeft, FaChevronRight,
  FaCode, FaClock, FaDesktop
} from 'react-icons/fa';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtDate = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const fmtTime = (iso) => {
  const d = new Date(iso);
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
};

const timeAgo = (iso) => {
  const diff = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (diff < 60)     return `${diff}s ago`;
  if (diff < 3600)   return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400)  return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

// ─── Action Badge ─────────────────────────────────────────────────────────────
const ActionBadge = ({ action }) => {
  const meta = ACTION_META[action] ?? { color: 'gray', label: action };
  const colorMap = {
    green:  'bg-green-100  text-green-700  border-green-300',
    blue:   'bg-blue-100   text-blue-700   border-blue-300',
    red:    'bg-red-100    text-red-700    border-red-300',
    purple: 'bg-purple-100 text-purple-700 border-purple-300',
    gray:   'bg-gray-100   text-gray-600   border-gray-300',
    orange: 'bg-orange-100 text-orange-700 border-orange-300',
    yellow: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    pink:   'bg-pink-100   text-pink-700   border-pink-300',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${colorMap[meta.color] ?? colorMap.gray} whitespace-nowrap`}>
      {meta.label}
    </span>
  );
};

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    success: { cls: 'bg-green-100 text-green-700 border-green-300',   icon: <FaCheckCircle     className="text-xs" />, label: 'Success' },
    failed:  { cls: 'bg-red-100   text-red-700   border-red-300',     icon: <FaTimesCircle     className="text-xs" />, label: 'Failed'  },
    warning: { cls: 'bg-yellow-100 text-yellow-700 border-yellow-300', icon: <FaExclamationTriangle className="text-xs" />, label: 'Warning' },
  };
  const s = map[status] ?? map.success;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${s.cls} whitespace-nowrap`}>
      {s.icon} {s.label}
    </span>
  );
};

// ─── View Log Modal ───────────────────────────────────────────────────────────
const ViewLogModal = ({ log, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = log ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [log]);

  if (!log) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl border-2 border-pink-200 w-full max-w-2xl max-h-[90vh] flex flex-col z-10">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b-2 border-pink-100 bg-gradient-to-r from-pink-50 to-white rounded-t-2xl flex-shrink-0">
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-pink-700 bg-clip-text text-transparent">
                Audit Log Detail
              </h2>
              <p className="text-xs text-gray-400 font-mono mt-0.5">{log.id}</p>
            </div>
            <button onClick={onClose}
              className="p-2 hover:bg-pink-100 rounded-xl transition-colors text-gray-500 hover:text-pink-600">
              <FaTimes className="text-lg" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto flex-1 space-y-5">

            {/* Status + Action Row */}
            <div className="flex items-center gap-3 flex-wrap">
              <ActionBadge action={log.action} />
              <StatusBadge status={log.status} />
              <span className="px-2.5 py-1 bg-pink-50 text-pink-700 border border-pink-200 rounded-full text-xs font-bold">
                {log.entity}
              </span>
            </div>

            {/* Description */}
            <div className="bg-gray-50 border-2 border-gray-100 rounded-xl p-4">
              <p className="text-xs font-bold text-gray-500 uppercase mb-1.5 flex items-center gap-1.5">
                <FaInfoCircle className="text-pink-400" /> Description
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">{log.description}</p>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { icon: <FaUser className="text-pink-400 text-xs" />,     label: 'Performed By', value: `${log.performedBy.name} (${log.performedBy.role})` },
                { icon: <FaTag  className="text-pink-400 text-xs" />,     label: 'Email',        value: log.performedBy.email },
                { icon: <FaLayerGroup className="text-pink-400 text-xs" />,label: 'Entity',       value: `${log.entity} — ${log.entityName}` },
                { icon: <FaCode className="text-pink-400 text-xs" />,     label: 'Entity ID',    value: log.entityId, mono: true },
                { icon: <FaGlobe className="text-pink-400 text-xs" />,    label: 'IP Address',   value: log.ipAddress, mono: true },
                { icon: <FaDesktop className="text-pink-400 text-xs" />,  label: 'User Agent',   value: log.userAgent },
                { icon: <FaCalendarAlt className="text-pink-400 text-xs" />, label: 'Date',      value: fmtDate(log.timestamp) },
                { icon: <FaClock className="text-pink-400 text-xs" />,    label: 'Time',         value: fmtTime(log.timestamp) },
              ].map(row => (
                <div key={row.label} className="bg-pink-50/50 border border-pink-100 rounded-xl px-4 py-3">
                  <p className="text-xs font-bold text-gray-400 uppercase flex items-center gap-1.5 mb-1">
                    {row.icon} {row.label}
                  </p>
                  <p className={`text-sm font-semibold text-gray-800 break-all ${row.mono ? 'font-mono text-xs' : ''}`}>
                    {row.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Metadata */}
            {log.metadata && Object.keys(log.metadata).length > 0 && (
              <div className="bg-gray-900 rounded-xl p-4">
                <p className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center gap-1.5">
                  <FaCode className="text-green-400" /> Metadata
                </p>
                <pre className="text-xs text-green-400 font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed">
                  {JSON.stringify(log.metadata, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Pagination ───────────────────────────────────────────────────────────────
const ITEMS_PER_PAGE = 10;

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
const AuditLogs = () => {
  const { logs, allLogs, getLogById, getStats, filterLogs, clearFilters } = useAuditLogsData();
  const stats = getStats();

  // ── View Modal ────────────────────────────────────────────────────────────
  const [selectedLog, setSelectedLog] = useState(null);

  // ── Filter State ──────────────────────────────────────────────────────────
  const [filters, setFilters] = useState({
    search:   '',
    action:   'all',
    entity:   'all',
    status:   'all',
    user:     'all',
    dateFrom: '',
    dateTo:   '',
  });
  const [showFilters, setShowFilters] = useState(false);

  // ── Auto-Refresh ──────────────────────────────────────────────────────────
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const timerRef = useRef(null);

  useEffect(() => {
    if (autoRefresh) {
      timerRef.current = setInterval(() => {
        setLastRefresh(new Date());
        toast.info('Logs refreshed', { autoClose: 1500 });
      }, 30000);
    }
    return () => clearInterval(timerRef.current);
  }, [autoRefresh]);

  // ── Pagination ────────────────────────────────────────────────────────────
  const [page, setPage] = useState(1);
  const totalPages  = Math.ceil(logs.length / ITEMS_PER_PAGE);
  const pagedLogs   = logs.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // Reset page on filter change
  useEffect(() => { setPage(1); }, [logs.length]);

  // ── Unique users for filter ───────────────────────────────────────────────
  const uniqueUsers = [...new Set(allLogs.map(l => l.performedBy.name))];

  // ── Active filter count ───────────────────────────────────────────────────
  const activeFilterCount = [
    filters.search,
    filters.action  !== 'all',
    filters.entity  !== 'all',
    filters.status  !== 'all',
    filters.user    !== 'all',
    filters.dateFrom,
    filters.dateTo,
  ].filter(Boolean).length;

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...filters, [name]: value };
    setFilters(updated);
    filterLogs(updated);
  };

  const handleClearFilters = () => {
    const reset = { search: '', action: 'all', entity: 'all', status: 'all', user: 'all', dateFrom: '', dateTo: '' };
    setFilters(reset);
    clearFilters();
    setShowFilters(false);
  };

  const handleQuickStatus = (status) => {
    const updated = { ...filters, status };
    setFilters(updated);
    filterLogs(updated);
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Timestamp', 'Action', 'Entity', 'Entity Name', 'Description', 'Performed By', 'Role', 'IP Address', 'Status'];
    const rows = logs.map(l => [
      l.id,
      `${fmtDate(l.timestamp)} ${fmtTime(l.timestamp)}`,
      l.action,
      l.entity,
      `"${l.entityName}"`,
      `"${l.description}"`,
      l.performedBy.name,
      l.performedBy.role,
      l.ipAddress,
      l.status,
    ].join(','));
    const blob = new Blob([[headers.join(','), ...rows].join('\n')], { type: 'text/csv' });
    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(blob),
      download: `audit_logs_${new Date().toISOString().split('T')[0]}.csv`,
    });
    a.click();
    toast.success('Audit logs exported!');
  };

  // ── Row click color by status ─────────────────────────────────────────────
  const rowBg = (status) => ({
    success: 'hover:bg-green-50/30',
    failed:  'hover:bg-red-50/40',
    warning: 'hover:bg-yellow-50/40',
  }[status] ?? '');

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <Layout>
      <div className="p-6 space-y-6">

        {/* ── Page Header ────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-pink-700 bg-clip-text text-transparent">
              Audit Logs
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Track every action across the platform
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {/* Auto Refresh */}
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${
                autoRefresh
                  ? 'bg-green-500 text-white border-green-500 shadow-md'
                  : 'bg-white text-gray-600 border-pink-200 hover:border-pink-400'
              }`}
            >
              <FaSync className={`text-xs ${autoRefresh ? 'animate-spin' : ''}`} />
              {autoRefresh ? 'Live' : 'Auto Refresh'}
            </button>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-pink-200 text-gray-700 hover:border-pink-400 rounded-xl text-sm font-semibold transition-all"
            >
              <FaFileExport className="text-pink-500" /> Export CSV
            </button>
          </div>
        </div>

        {/* ── Stats Cards ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            {
              label:   'Total Logs',
              value:   stats.total,
              sub:     'All time',
              icon:    <FaHistory className="text-pink-500 text-2xl" />,
              bg:      'bg-pink-50',
              border:  'border-pink-200',
              valCls:  'text-pink-600',
              iconBg:  'bg-pink-100',
              onClick: () => handleQuickStatus('all'),
            },
            {
              label:   'Today',
              value:   stats.today,
              sub:     'Events today',
              icon:    <FaClock className="text-blue-500 text-2xl" />,
              bg:      'bg-blue-50',
              border:  'border-blue-200',
              valCls:  'text-blue-600',
              iconBg:  'bg-blue-100',
              onClick: null,
            },
            {
              label:   'Success',
              value:   stats.success,
              sub:     'Completed',
              icon:    <FaCheckCircle className="text-green-500 text-2xl" />,
              bg:      'bg-green-50',
              border:  'border-green-200',
              valCls:  'text-green-600',
              iconBg:  'bg-green-100',
              onClick: () => handleQuickStatus('success'),
            },
            {
              label:   'Failed',
              value:   stats.failed,
              sub:     'Errors',
              icon:    <FaTimesCircle className="text-red-500 text-2xl" />,
              bg:      'bg-red-50',
              border:  'border-red-200',
              valCls:  'text-red-600',
              iconBg:  'bg-red-100',
              onClick: () => handleQuickStatus('failed'),
            },
            {
              label:   'Warnings',
              value:   stats.warning,
              sub:     'Partial/Skipped',
              icon:    <FaExclamationTriangle className="text-yellow-500 text-2xl" />,
              bg:      'bg-yellow-50',
              border:  'border-yellow-200',
              valCls:  'text-yellow-600',
              iconBg:  'bg-yellow-100',
              onClick: () => handleQuickStatus('warning'),
            },
          ].map(s => (
            <div
              key={s.label}
              onClick={s.onClick}
              className={`${s.bg} border-2 ${s.border} rounded-2xl p-5 transition-all duration-300 hover:shadow-lg ${s.onClick ? 'cursor-pointer hover:scale-105' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">{s.label}</p>
                  <p className={`text-2xl font-bold ${s.valCls} mt-1`}>{s.value}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
                </div>
                <div className={`w-12 h-12 ${s.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  {s.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Search + Filter Bar ─────────────────────────────────────────── */}
        <div className="bg-white border-2 border-pink-100 rounded-2xl p-4 space-y-4">
          <div className="flex gap-3 flex-wrap">
            {/* Search */}
            <div className="relative flex-1 min-w-[220px]">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-400 pointer-events-none" />
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search description, user, entity, IP..."
                className="w-full pl-10 pr-10 py-2.5 border-2 border-pink-200 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all text-sm"
              />
              {filters.search && (
                <button
                  onClick={() => handleFilterChange({ target: { name: 'search', value: '' } })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-500"
                >
                  <FaTimes />
                </button>
              )}
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${
                showFilters || activeFilterCount > 0
                  ? 'bg-pink-500 text-white border-pink-500 shadow-md'
                  : 'bg-white text-gray-600 border-pink-200 hover:border-pink-400'
              }`}
            >
              <FaFilter />
              Filters
              {activeFilterCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {activeFilterCount > 0 && (
              <button
                onClick={handleClearFilters}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-red-200 text-red-500 hover:bg-red-50 text-sm font-semibold transition-all"
              >
                <FaTimes /> Clear
              </button>
            )}
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 pt-3 border-t-2 border-pink-50">
              {[
                {
                  name: 'action', label: 'Action',
                  options: [{ value: 'all', label: 'All Actions' }, ...ACTION_TYPES.map(a => ({ value: a, label: ACTION_META[a]?.label ?? a }))],
                },
                {
                  name: 'entity', label: 'Entity',
                  options: [{ value: 'all', label: 'All Entities' }, ...ENTITY_TYPES.map(e => ({ value: e, label: e }))],
                },
                {
                  name: 'status', label: 'Status',
                  options: [{ value: 'all', label: 'All Status' }, { value: 'success', label: '✅ Success' }, { value: 'failed', label: '❌ Failed' }, { value: 'warning', label: '⚠ Warning' }],
                },
                {
                  name: 'user', label: 'User',
                  options: [{ value: 'all', label: 'All Users' }, ...uniqueUsers.map(u => ({ value: u, label: u }))],
                },
              ].map(f => (
                <div key={f.name} className="xl:col-span-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">{f.label}</label>
                  <select
                    name={f.name}
                    value={filters[f.name]}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2.5 border-2 border-pink-200 rounded-xl focus:outline-none focus:border-pink-500 text-sm bg-white"
                  >
                    {f.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              ))}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">From Date</label>
                <input type="date" name="dateFrom" value={filters.dateFrom}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2.5 border-2 border-pink-200 rounded-xl focus:outline-none focus:border-pink-500 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">To Date</label>
                <input type="date" name="dateTo" value={filters.dateTo}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2.5 border-2 border-pink-200 rounded-xl focus:outline-none focus:border-pink-500 text-sm" />
              </div>
            </div>
          )}
        </div>

        {/* ── Quick Status Tabs + Count ───────────────────────────────────── */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex gap-2 flex-wrap">
            {[
              { val: 'all',     label: `All (${stats.total})`,        cls: 'bg-pink-500  text-white border-pink-500'  },
              { val: 'success', label: `Success (${stats.success})`,  cls: 'bg-green-500 text-white border-green-500' },
              { val: 'failed',  label: `Failed (${stats.failed})`,    cls: 'bg-red-500   text-white border-red-500'   },
              { val: 'warning', label: `Warning (${stats.warning})`,  cls: 'bg-yellow-500 text-white border-yellow-500'},
            ].map(tab => (
              <button key={tab.val}
                onClick={() => handleQuickStatus(tab.val)}
                className={`px-4 py-2 text-xs font-bold rounded-xl border-2 transition-all ${
                  filters.status === tab.val ? tab.cls + ' shadow-md' : 'bg-white text-gray-600 border-pink-100 hover:border-pink-300'
                }`}>
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <FaHistory className="text-pink-400" />
            Showing <span className="font-bold text-pink-600 mx-1">{logs.length}</span> logs
            {autoRefresh && (
              <span className="text-green-600 font-semibold">
                · Last refresh: {fmtTime(lastRefresh.toISOString())}
              </span>
            )}
          </div>
        </div>

        {/* ── Logs Table ──────────────────────────────────────────────────── */}
        <div className="bg-white border-2 border-pink-100 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b-2 border-pink-50 flex items-center justify-between flex-wrap gap-2">
            <h2 className="font-bold text-gray-700">
              Activity Log
              <span className="text-pink-500 ml-2">({logs.length})</span>
            </h2>
            <p className="text-xs text-gray-400 italic">Click a row to view full details</p>
          </div>

          {logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-4">
              <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                <FaHistory className="text-4xl text-pink-300" />
              </div>
              <p className="text-gray-600 font-bold text-lg">No audit logs found</p>
              <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
              <button onClick={handleClearFilters}
                className="mt-4 px-5 py-2.5 bg-pink-500 text-white rounded-xl text-sm font-semibold hover:bg-pink-600 transition-colors">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-pink-50">
                  <tr>
                    {['Timestamp', 'Action', 'Entity', 'Description', 'Performed By', 'IP Address', 'Status', ''].map(h => (
                      <th key={h} className="px-5 py-3.5 text-left text-xs font-bold text-pink-900 uppercase tracking-wider whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-pink-50">
                  {pagedLogs.map(log => (
                    <tr
                      key={log.id}
                      className={`transition-colors duration-200 cursor-pointer ${rowBg(log.status)}`}
                      onClick={() => setSelectedLog(log)}
                    >
                      {/* Timestamp */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <p className="text-xs font-semibold text-gray-700">{fmtDate(log.timestamp)}</p>
                        <p className="text-xs text-gray-400 font-mono mt-0.5">{fmtTime(log.timestamp)}</p>
                        <p className="text-xs text-pink-400 mt-0.5">{timeAgo(log.timestamp)}</p>
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <ActionBadge action={log.action} />
                      </td>

                      {/* Entity */}
                      <td className="px-5 py-4">
                        <p className="text-xs font-bold text-gray-700">{log.entity}</p>
                        <p className="text-xs text-gray-400 mt-0.5 max-w-[120px] truncate">{log.entityName}</p>
                      </td>

                      {/* Description */}
                      <td className="px-5 py-4">
                        <p className="text-sm text-gray-700 max-w-xs truncate">{log.description}</p>
                      </td>

                      {/* Performed By */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs font-bold">
                              {log.performedBy.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-800">{log.performedBy.name}</p>
                            <p className="text-xs text-gray-400">{log.performedBy.role}</p>
                          </div>
                        </div>
                      </td>

                      {/* IP Address */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded-lg">
                          {log.ipAddress}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <StatusBadge status={log.status} />
                      </td>

                      {/* View */}
                      <td className="px-5 py-4 whitespace-nowrap" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedLog(log)}
                          className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ── Pagination ── */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t-2 border-pink-50 bg-pink-50/30 flex items-center justify-between flex-wrap gap-3">
              <p className="text-xs text-gray-500">
                Page <span className="font-bold text-pink-600">{page}</span> of{' '}
                <span className="font-bold">{totalPages}</span>
                {' '}·{' '}
                <span className="font-bold text-pink-600">{logs.length}</span> total logs
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 border-2 border-pink-200 rounded-lg hover:bg-pink-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <FaChevronLeft className="text-xs text-pink-600" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .reduce((acc, p, idx, arr) => {
                    if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...');
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) =>
                    p === '...'
                      ? <span key={`dot-${i}`} className="px-2 text-gray-400 text-sm">…</span>
                      : (
                        <button key={p}
                          onClick={() => setPage(p)}
                          className={`w-8 h-8 rounded-lg text-xs font-bold border-2 transition-all ${
                            page === p
                              ? 'bg-pink-500 text-white border-pink-500 shadow-md'
                              : 'bg-white text-gray-600 border-pink-200 hover:border-pink-400'
                          }`}>
                          {p}
                        </button>
                      )
                  )}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 border-2 border-pink-200 rounded-lg hover:bg-pink-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <FaChevronRight className="text-xs text-pink-600" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── View Modal ── */}
      <ViewLogModal log={selectedLog} onClose={() => setSelectedLog(null)} />
    </Layout>
  );
};

export default AuditLogs;
