// src/data/CustomersData.jsx
import { useState } from 'react';

// ─── Constants ────────────────────────────────────────────────────────────────
export const CUSTOMER_STATUSES = ['active', 'inactive', 'blocked'];

export const CUSTOMER_SEGMENTS = [
  'Regular', 'Premium', 'VIP', 'New', 'At Risk', 'Churned',
];

export const SITE_LIST = [
  'abcschool.multiecom.in',
  'petcare.multiecom.in',
  'fashionhub.multiecom.in',
  'grocerymart.multiecom.in',
  'techstore.multiecom.in',
];

// ─── Seed Data ────────────────────────────────────────────────────────────────
const SEED_CUSTOMERS = [
  {
    id: 'CUST-001',
    name: 'Arjun Sharma',
    email: 'arjun.sharma@gmail.com',
    phone: '+91 98400 11001',
    location: 'Chennai, Tamil Nadu',
    site: 'abcschool.multiecom.in',
    segment: 'VIP',
    status: 'active',
    totalOrders: 24,
    totalSpent: 48500,
    lastOrderDate: '2026-02-15',
    joinedDate: '2024-06-10',
    avatar: 'AS',
  },
  {
    id: 'CUST-002',
    name: 'Priya Nair',
    email: 'priya.nair@outlook.com',
    phone: '+91 98400 22002',
    location: 'Kochi, Kerala',
    site: 'petcare.multiecom.in',
    segment: 'Premium',
    status: 'active',
    totalOrders: 11,
    totalSpent: 22300,
    lastOrderDate: '2026-02-10',
    joinedDate: '2024-09-22',
    avatar: 'PN',
  },
  {
    id: 'CUST-003',
    name: 'Ravi Krishnan',
    email: 'ravi.k@yahoo.com',
    phone: '+91 98400 33003',
    location: 'Bangalore, Karnataka',
    site: 'fashionhub.multiecom.in',
    segment: 'Regular',
    status: 'active',
    totalOrders: 6,
    totalSpent: 8700,
    lastOrderDate: '2026-01-28',
    joinedDate: '2025-01-14',
    avatar: 'RK',
  },
  {
    id: 'CUST-004',
    name: 'Meena Subramaniam',
    email: 'meena.sub@gmail.com',
    phone: '+91 98400 44004',
    location: 'Coimbatore, Tamil Nadu',
    site: 'grocerymart.multiecom.in',
    segment: 'New',
    status: 'active',
    totalOrders: 2,
    totalSpent: 1850,
    lastOrderDate: '2026-02-18',
    joinedDate: '2026-01-30',
    avatar: 'MS',
  },
  {
    id: 'CUST-005',
    name: 'Deepak Pillai',
    email: 'deepak.p@hotmail.com',
    phone: '+91 98400 55005',
    location: 'Hyderabad, Telangana',
    site: 'techstore.multiecom.in',
    segment: 'At Risk',
    status: 'inactive',
    totalOrders: 8,
    totalSpent: 14200,
    lastOrderDate: '2025-10-05',
    joinedDate: '2024-08-19',
    avatar: 'DP',
  },
  {
    id: 'CUST-006',
    name: 'Anjali Menon',
    email: 'anjali.m@gmail.com',
    phone: '+91 98400 66006',
    location: 'Trivandrum, Kerala',
    site: 'fashionhub.multiecom.in',
    segment: 'Regular',
    status: 'blocked',
    totalOrders: 3,
    totalSpent: 4100,
    lastOrderDate: '2025-09-12',
    joinedDate: '2024-11-05',
    avatar: 'AM',
  },
  {
    id: 'CUST-007',
    name: 'Suresh Babu',
    email: 'suresh.babu@gmail.com',
    phone: '+91 98400 77007',
    location: 'Madurai, Tamil Nadu',
    site: 'abcschool.multiecom.in',
    segment: 'Premium',
    status: 'active',
    totalOrders: 17,
    totalSpent: 31600,
    lastOrderDate: '2026-02-17',
    joinedDate: '2024-07-08',
    avatar: 'SB',
  },
  {
    id: 'CUST-008',
    name: 'Kavitha Rajan',
    email: 'kavitha.r@gmail.com',
    phone: '+91 98400 88008',
    location: 'Mysore, Karnataka',
    site: 'grocerymart.multiecom.in',
    segment: 'Churned',
    status: 'inactive',
    totalOrders: 1,
    totalSpent: 650,
    lastOrderDate: '2025-06-30',
    joinedDate: '2025-05-20',
    avatar: 'KR',
  },
];

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const useCustomersData = () => {
  const [allCustomers, setAllCustomers] = useState(SEED_CUSTOMERS);
  const [customers, setCustomers]       = useState(SEED_CUSTOMERS);

  // ── CRUD ────────────────────────────────────────────────────────────────────
  const addCustomer = (data) => {
    const newCustomer = {
      ...data,
      id:            `CUST-${String(allCustomers.length + 1).padStart(3, '0')}`,
      totalOrders:   0,
      totalSpent:    0,
      lastOrderDate: '—',
      joinedDate:    new Date().toISOString().split('T')[0],
      avatar:        data.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
    };
    setAllCustomers(p => [newCustomer, ...p]);
    setCustomers(p => [newCustomer, ...p]);
  };

  const updateCustomer = (id, data) => {
    const updater = list =>
      list.map(c => c.id === id ? {
        ...c, ...data,
        avatar: data.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
      } : c);
    setAllCustomers(updater);
    setCustomers(updater);
  };

  const deleteCustomer = (id) => {
    setAllCustomers(p => p.filter(c => c.id !== id));
    setCustomers(p => p.filter(c => c.id !== id));
  };

  const getCustomerById = (id) => allCustomers.find(c => c.id === id);

  // ── Filters ─────────────────────────────────────────────────────────────────
  const filterCustomers = ({ search, status, segment, site }) => {
    let result = [...allCustomers];
    if (search)              result = result.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
    );
    if (status  && status  !== 'all') result = result.filter(c => c.status  === status);
    if (segment && segment !== 'all') result = result.filter(c => c.segment === segment);
    if (site    && site    !== 'all') result = result.filter(c => c.site    === site);
    setCustomers(result);
  };

  const clearFilters = () => setCustomers(allCustomers);

  return {
    customers,
    allCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomerById,
    filterCustomers,
    clearFilters,
  };
};
