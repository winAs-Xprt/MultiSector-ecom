// src/data/AuditLogsData.jsx
import { useState } from 'react';

// ─── Constants ────────────────────────────────────────────────────────────────
export const ACTION_TYPES = [
  'CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT',
  'ACTIVATE', 'DEACTIVATE', 'EXPORT', 'BULK_UPDATE',
  'PASSWORD_CHANGE', 'PERMISSION_CHANGE', 'VIEW',
];

export const ENTITY_TYPES = [
  'Product', 'Site', 'User', 'Order', 'Category',
  'Variant', 'Settings', 'ApiKey', 'Report',
];

export const LOG_STATUSES = ['success', 'failed', 'warning'];

// ─── Action → color/icon label map (used in UI) ───────────────────────────────
export const ACTION_META = {
  CREATE:           { color: 'green',  label: 'Create'           },
  UPDATE:           { color: 'blue',   label: 'Update'           },
  DELETE:           { color: 'red',    label: 'Delete'           },
  LOGIN:            { color: 'purple', label: 'Login'            },
  LOGOUT:           { color: 'gray',   label: 'Logout'           },
  ACTIVATE:         { color: 'green',  label: 'Activate'         },
  DEACTIVATE:       { color: 'orange', label: 'Deactivate'       },
  EXPORT:           { color: 'blue',   label: 'Export'           },
  BULK_UPDATE:      { color: 'blue',   label: 'Bulk Update'      },
  PASSWORD_CHANGE:  { color: 'yellow', label: 'Password Change'  },
  PERMISSION_CHANGE:{ color: 'pink',   label: 'Permission Change'},
  VIEW:             { color: 'gray',   label: 'View'             },
};

// ─── Dummy Audit Logs ─────────────────────────────────────────────────────────
const INITIAL_LOGS = [
  {
    id: 'log-001',
    action: 'CREATE',
    entity: 'Product',
    entityId: 'prod-550e8400-0001',
    entityName: 'Wireless Bluetooth Headphones',
    description: 'Created new product "Wireless Bluetooth Headphones" with SKU ELEC-HPH-001',
    performedBy: { id: 'usr-001', name: 'Arun Kumar', email: 'arun@nexotechnologies.in', role: 'Super Admin' },
    ipAddress: '103.21.58.12',
    userAgent: 'Chrome 121 / Windows 11',
    status: 'success',
    timestamp: '2026-02-19T09:14:22.000Z',
    metadata: { price: 2499, quantity: 320, categories: ['Audio'], sites: ['Chennai Store', 'Mumbai Store'] },
  },
  {
    id: 'log-002',
    action: 'UPDATE',
    entity: 'Product',
    entityId: 'prod-550e8400-0002',
    entityName: 'Smart LED TV 43 Inch 4K',
    description: 'Updated price from ₹26,999 to ₹28,999 and quantity from 60 to 45',
    performedBy: { id: 'usr-001', name: 'Arun Kumar', email: 'arun@nexotechnologies.in', role: 'Super Admin' },
    ipAddress: '103.21.58.12',
    userAgent: 'Chrome 121 / Windows 11',
    status: 'success',
    timestamp: '2026-02-19T09:45:10.000Z',
    metadata: { changes: { price: { from: 26999, to: 28999 }, quantity: { from: 60, to: 45 } } },
  },
  {
    id: 'log-003',
    action: 'DELETE',
    entity: 'Product',
    entityId: 'prod-550e8400-0006',
    entityName: 'Ethnic Kurti Set — Floral Print',
    description: 'Attempted to delete product "Ethnic Kurti Set" — failed due to linked orders',
    performedBy: { id: 'usr-002', name: 'Priya Sharma', email: 'priya@nexotechnologies.in', role: 'Site Admin' },
    ipAddress: '182.64.22.101',
    userAgent: 'Firefox 122 / macOS Ventura',
    status: 'failed',
    timestamp: '2026-02-19T10:02:38.000Z',
    metadata: { reason: 'Product has 78 linked orders. Cannot delete.', linkedOrders: 78 },
  },
  {
    id: 'log-004',
    action: 'LOGIN',
    entity: 'User',
    entityId: 'usr-001',
    entityName: 'Arun Kumar',
    description: 'Super Admin logged in successfully from Chennai, India',
    performedBy: { id: 'usr-001', name: 'Arun Kumar', email: 'arun@nexotechnologies.in', role: 'Super Admin' },
    ipAddress: '103.21.58.12',
    userAgent: 'Chrome 121 / Windows 11',
    status: 'success',
    timestamp: '2026-02-19T08:58:00.000Z',
    metadata: { loginMethod: 'Email + Password', location: 'Chennai, Tamil Nadu, IN' },
  },
  {
    id: 'log-005',
    action: 'LOGIN',
    entity: 'User',
    entityId: 'usr-003',
    entityName: 'Rajan Mehta',
    description: 'Failed login attempt — incorrect password (attempt 3 of 5)',
    performedBy: { id: 'usr-003', name: 'Rajan Mehta', email: 'rajan@nexotechnologies.in', role: 'Site Admin' },
    ipAddress: '49.36.128.45',
    userAgent: 'Chrome 120 / Android 14',
    status: 'failed',
    timestamp: '2026-02-19T08:10:15.000Z',
    metadata: { attempt: 3, maxAttempts: 5, loginMethod: 'Email + Password' },
  },
  {
    id: 'log-006',
    action: 'ACTIVATE',
    entity: 'Product',
    entityId: 'prod-550e8400-0006',
    entityName: 'Ethnic Kurti Set — Floral Print',
    description: 'Product "Ethnic Kurti Set" activated and set to live',
    performedBy: { id: 'usr-001', name: 'Arun Kumar', email: 'arun@nexotechnologies.in', role: 'Super Admin' },
    ipAddress: '103.21.58.12',
    userAgent: 'Chrome 121 / Windows 11',
    status: 'success',
    timestamp: '2026-02-19T10:30:00.000Z',
    metadata: { previousStatus: 'inactive', newStatus: 'active' },
  },
  {
    id: 'log-007',
    action: 'DEACTIVATE',
    entity: 'Product',
    entityId: 'prod-550e8400-0014',
    entityName: 'Ceramic Electric Hair Straightener',
    description: 'Product deactivated — pending quality review',
    performedBy: { id: 'usr-002', name: 'Priya Sharma', email: 'priya@nexotechnologies.in', role: 'Site Admin' },
    ipAddress: '182.64.22.101',
    userAgent: 'Firefox 122 / macOS Ventura',
    status: 'success',
    timestamp: '2026-02-18T15:20:44.000Z',
    metadata: { reason: 'Pending quality review', previousStatus: 'active', newStatus: 'inactive' },
  },
  {
    id: 'log-008',
    action: 'BULK_UPDATE',
    entity: 'Product',
    entityId: 'bulk',
    entityName: 'Multiple Products',
    description: 'Bulk status update — 8 products deactivated in Electronics category',
    performedBy: { id: 'usr-001', name: 'Arun Kumar', email: 'arun@nexotechnologies.in', role: 'Super Admin' },
    ipAddress: '103.21.58.12',
    userAgent: 'Chrome 121 / Windows 11',
    status: 'success',
    timestamp: '2026-02-18T14:05:20.000Z',
    metadata: { affectedCount: 8, category: 'Electronics', action: 'deactivate' },
  },
  {
    id: 'log-009',
    action: 'EXPORT',
    entity: 'Report',
    entityId: 'rpt-001',
    entityName: 'Products CSV Export',
    description: 'Exported 15 products to CSV file — products_2026-02-18.csv',
    performedBy: { id: 'usr-001', name: 'Arun Kumar', email: 'arun@nexotechnologies.in', role: 'Super Admin' },
    ipAddress: '103.21.58.12',
    userAgent: 'Chrome 121 / Windows 11',
    status: 'success',
    timestamp: '2026-02-18T13:45:00.000Z',
    metadata: { fileName: 'products_2026-02-18.csv', totalRecords: 15, fileSize: '12.4 KB' },
  },
  {
    id: 'log-010',
    action: 'PASSWORD_CHANGE',
    entity: 'User',
    entityId: 'usr-002',
    entityName: 'Priya Sharma',
    description: 'Password changed successfully for Priya Sharma',
    performedBy: { id: 'usr-002', name: 'Priya Sharma', email: 'priya@nexotechnologies.in', role: 'Site Admin' },
    ipAddress: '182.64.22.101',
    userAgent: 'Firefox 122 / macOS Ventura',
    status: 'success',
    timestamp: '2026-02-18T11:15:30.000Z',
    metadata: { changedBy: 'Self', method: 'Settings Page' },
  },
  {
    id: 'log-011',
    action: 'CREATE',
    entity: 'Site',
    entityId: 'site-006',
    entityName: 'Pune Store',
    description: 'New site "Pune Store" created and assigned to Maharashtra region',
    performedBy: { id: 'usr-001', name: 'Arun Kumar', email: 'arun@nexotechnologies.in', role: 'Super Admin' },
    ipAddress: '103.21.58.12',
    userAgent: 'Chrome 121 / Windows 11',
    status: 'success',
    timestamp: '2026-02-18T10:00:00.000Z',
    metadata: { city: 'Pune', state: 'Maharashtra', assignedAdmin: 'Vikram Patil' },
  },
  {
    id: 'log-012',
    action: 'PERMISSION_CHANGE',
    entity: 'User',
    entityId: 'usr-003',
    entityName: 'Rajan Mehta',
    description: 'User role changed from "Viewer" to "Site Admin" — assigned to Delhi Store',
    performedBy: { id: 'usr-001', name: 'Arun Kumar', email: 'arun@nexotechnologies.in', role: 'Super Admin' },
    ipAddress: '103.21.58.12',
    userAgent: 'Chrome 121 / Windows 11',
    status: 'success',
    timestamp: '2026-02-17T16:30:00.000Z',
    metadata: { previousRole: 'Viewer', newRole: 'Site Admin', assignedSite: 'Delhi Store' },
  },
  {
    id: 'log-013',
    action: 'DELETE',
    entity: 'Variant',
    entityId: 'var-004-xl',
    entityName: 'Men\'s Shirt — XL Blue',
    description: 'Deleted out-of-stock variant XL Blue from Men\'s Cotton Slim Fit Shirt',
    performedBy: { id: 'usr-002', name: 'Priya Sharma', email: 'priya@nexotechnologies.in', role: 'Site Admin' },
    ipAddress: '182.64.22.101',
    userAgent: 'Firefox 122 / macOS Ventura',
    status: 'success',
    timestamp: '2026-02-17T14:22:10.000Z',
    metadata: { parentProduct: "Men's Cotton Slim Fit Shirt", attributes: { Size: 'XL', Color: 'Blue' }, stock: 0 },
  },
  {
    id: 'log-014',
    action: 'UPDATE',
    entity: 'Settings',
    entityId: 'settings-platform',
    entityName: 'Platform Settings',
    description: 'Platform settings updated — low stock threshold changed from 5 to 10',
    performedBy: { id: 'usr-001', name: 'Arun Kumar', email: 'arun@nexotechnologies.in', role: 'Super Admin' },
    ipAddress: '103.21.58.12',
    userAgent: 'Chrome 121 / Windows 11',
    status: 'success',
    timestamp: '2026-02-17T09:10:05.000Z',
    metadata: { changes: { lowStockThreshold: { from: 5, to: 10 }, maintenanceMode: { from: false, to: false } } },
  },
  {
    id: 'log-015',
    action: 'LOGOUT',
    entity: 'User',
    entityId: 'usr-001',
    entityName: 'Arun Kumar',
    description: 'Super Admin logged out',
    performedBy: { id: 'usr-001', name: 'Arun Kumar', email: 'arun@nexotechnologies.in', role: 'Super Admin' },
    ipAddress: '103.21.58.12',
    userAgent: 'Chrome 121 / Windows 11',
    status: 'success',
    timestamp: '2026-02-17T18:00:00.000Z',
    metadata: { sessionDuration: '9h 2m' },
  },
  {
    id: 'log-016',
    action: 'CREATE',
    entity: 'Category',
    entityId: 'cat-019',
    entityName: 'Smart Home',
    description: 'New product category "Smart Home" created',
    performedBy: { id: 'usr-001', name: 'Arun Kumar', email: 'arun@nexotechnologies.in', role: 'Super Admin' },
    ipAddress: '103.21.58.12',
    userAgent: 'Chrome 121 / Windows 11',
    status: 'success',
    timestamp: '2026-02-16T11:30:00.000Z',
    metadata: { categoryId: 'cat-019', parentCategory: null },
  },
  {
    id: 'log-017',
    action: 'BULK_UPDATE',
    entity: 'Site',
    entityId: 'bulk',
    entityName: 'Multiple Sites',
    description: 'Bulk assigned 10 products to Bangalore and Hyderabad stores',
    performedBy: { id: 'usr-001', name: 'Arun Kumar', email: 'arun@nexotechnologies.in', role: 'Super Admin' },
    ipAddress: '103.21.58.12',
    userAgent: 'Chrome 121 / Windows 11',
    status: 'warning',
    timestamp: '2026-02-16T09:55:00.000Z',
    metadata: { affectedSites: ['Bangalore Store', 'Hyderabad Store'], products: 10, warning: '2 products skipped — already assigned' },
  },
  {
    id: 'log-018',
    action: 'VIEW',
    entity: 'Report',
    entityId: 'rpt-002',
    entityName: 'Sales Analytics Report',
    description: 'Super Admin viewed Sales Analytics for January 2026',
    performedBy: { id: 'usr-001', name: 'Arun Kumar', email: 'arun@nexotechnologies.in', role: 'Super Admin' },
    ipAddress: '103.21.58.12',
    userAgent: 'Chrome 121 / Windows 11',
    status: 'success',
    timestamp: '2026-02-15T14:00:00.000Z',
    metadata: { reportPeriod: 'January 2026', reportType: 'Sales Analytics' },
  },
  {
    id: 'log-019',
    action: 'UPDATE',
    entity: 'Order',
    entityId: 'ord-1029',
    entityName: 'Order #ORD-1029',
    description: 'Order status updated from "Processing" to "Shipped"',
    performedBy: { id: 'usr-002', name: 'Priya Sharma', email: 'priya@nexotechnologies.in', role: 'Site Admin' },
    ipAddress: '182.64.22.101',
    userAgent: 'Firefox 122 / macOS Ventura',
    status: 'success',
    timestamp: '2026-02-15T10:30:00.000Z',
    metadata: { previousStatus: 'Processing', newStatus: 'Shipped', trackingId: 'DHL-8473625' },
  },
  {
    id: 'log-020',
    action: 'DELETE',
    entity: 'ApiKey',
    entityId: 'key-003',
    entityName: 'Old Dev API Key',
    description: 'API key "Old Dev API Key" revoked and deleted',
    performedBy: { id: 'usr-001', name: 'Arun Kumar', email: 'arun@nexotechnologies.in', role: 'Super Admin' },
    ipAddress: '103.21.58.12',
    userAgent: 'Chrome 121 / Windows 11',
    status: 'success',
    timestamp: '2026-02-14T16:45:00.000Z',
    metadata: { keyName: 'Old Dev API Key', lastUsed: '2026-01-20' },
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// useAuditLogsData Hook
// ═══════════════════════════════════════════════════════════════════════════════
export const useAuditLogsData = () => {
  const [allLogs, setAllLogs]   = useState(INITIAL_LOGS);
  const [logs,    setLogs]      = useState(INITIAL_LOGS);

  // ── Get by ID ─────────────────────────────────────────────────────────────
  const getLogById = (id) => allLogs.find(l => l.id === id);

  // ── Stats ─────────────────────────────────────────────────────────────────
  const getStats = () => ({
    total:    allLogs.length,
    success:  allLogs.filter(l => l.status === 'success').length,
    failed:   allLogs.filter(l => l.status === 'failed').length,
    warning:  allLogs.filter(l => l.status === 'warning').length,
    today:    allLogs.filter(l => {
      const d = new Date(l.timestamp);
      const t = new Date();
      return d.toDateString() === t.toDateString();
    }).length,
  });

  // ── Filter ─────────────────────────────────────────────────────────────────
  const filterLogs = ({ search = '', action = 'all', entity = 'all', status = 'all', user = 'all', dateFrom = '', dateTo = '' }) => {
    let result = [...allLogs];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(l =>
        l.description.toLowerCase().includes(q)    ||
        l.entityName.toLowerCase().includes(q)     ||
        l.entity.toLowerCase().includes(q)         ||
        l.performedBy.name.toLowerCase().includes(q) ||
        l.performedBy.email.toLowerCase().includes(q) ||
        l.ipAddress.includes(q)
      );
    }

    if (action !== 'all') result = result.filter(l => l.action === action);
    if (entity !== 'all') result = result.filter(l => l.entity === entity);
    if (status !== 'all') result = result.filter(l => l.status === status);
    if (user   !== 'all') result = result.filter(l => l.performedBy.name === user);

    if (dateFrom) {
      result = result.filter(l => new Date(l.timestamp) >= new Date(dateFrom));
    }
    if (dateTo) {
      const end = new Date(dateTo);
      end.setHours(23, 59, 59);
      result = result.filter(l => new Date(l.timestamp) <= end);
    }

    // Always newest first
    result.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    setLogs(result);
  };

  const clearFilters = () => {
    const sorted = [...allLogs].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    setLogs(sorted);
  };

  return { logs, allLogs, getLogById, getStats, filterLogs, clearFilters };
};
