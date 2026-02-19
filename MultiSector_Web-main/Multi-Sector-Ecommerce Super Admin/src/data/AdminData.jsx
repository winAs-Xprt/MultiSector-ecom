// src/data/AdminData.jsx
import { useState } from 'react';

// ─── Industries List ────────────────────────────────────────────────────────
export const INDUSTRIES = [
  'School',
  'Hospital',
  'Garage',
  'Pharmacy',
  'Restaurant',
  'Clinic',
  'Gym',
  'Hotel',
  'Supermarket',
  'Others'
];

// ─── Roles List ─────────────────────────────────────────────────────────────
export const ROLES = ['Admin', 'Buyer'];

// ─── Initial Admins Data ────────────────────────────────────────────────────
const INITIAL_ADMINS = [
  {
    id: 'ADM-001',
    fullName: 'Rajesh Kumar',
    email: 'rajesh@abcschool.com',
    password: 'Admin@1234',
    phone: '+91 98765 43210',
    industry: 'School',
    siteName: 'ABC School',
    role: 'Admin',
    status: 'active',
    notes: 'Primary admin for ABC School portal',
    createdAt: '2026-01-10'
  },
  {
    id: 'ADM-002',
    fullName: 'Priya Sharma',
    email: 'priya@xyzhosp.com',
    password: 'Admin@5678',
    phone: '+91 87654 32109',
    industry: 'Hospital',
    siteName: 'XYZ Hospital',
    role: 'Admin',
    status: 'active',
    notes: 'Manages XYZ Hospital patient portal',
    createdAt: '2026-01-15'
  },
  {
    id: 'ADM-003',
    fullName: 'Amit Patel',
    email: 'amit@garageplus.com',
    password: 'Admin@9012',
    phone: '+91 76543 21098',
    industry: 'Garage',
    siteName: 'Garage Plus',
    role: 'Admin',
    status: 'inactive',
    notes: 'Access revoked due to inactivity',
    createdAt: '2026-01-20'
  },
  {
    id: 'ADM-004',
    fullName: 'Sneha Reddy',
    email: 'sneha@cityschool.com',
    password: 'Admin@3456',
    phone: '+91 65432 10987',
    industry: 'School',
    siteName: 'City School',
    role: 'Admin',
    status: 'active',
    notes: '',
    createdAt: '2026-01-25'
  },
  {
    id: 'ADM-005',
    fullName: 'Vikram Singh',
    email: 'vikram@medhub.com',
    password: 'Admin@7890',
    phone: '+91 54321 09876',
    industry: 'Hospital',
    siteName: 'Med Hub',
    role: 'Admin',
    status: 'inactive',
    notes: 'Site temporarily deactivated for maintenance',
    createdAt: '2026-02-01'
  },
  {
    id: 'ADM-006',
    fullName: 'Ananya Iyer',
    email: 'ananya@pharmacity.com',
    password: 'Admin@2345',
    phone: '+91 43210 98765',
    industry: 'Pharmacy',
    siteName: 'Pharma City',
    role: 'Admin',
    status: 'active',
    notes: 'Newly onboarded admin',
    createdAt: '2026-02-05'
  },
  {
    id: 'ADM-007',
    fullName: 'Karan Mehta',
    email: 'karan@fitzone.com',
    password: 'Buyer@1234',
    phone: '+91 32109 87654',
    industry: 'Gym',
    siteName: 'Fit Zone',
    role: 'Buyer',
    status: 'active',
    notes: 'Buyer account for Fit Zone members',
    createdAt: '2026-02-10'
  }
];

// ─── Custom Hook ─────────────────────────────────────────────────────────────
export const useAdminData = () => {
  const [admins, setAdmins]               = useState(INITIAL_ADMINS);
  const [filteredAdmins, setFilteredAdmins] = useState(INITIAL_ADMINS);

  // ── Add Admin ──────────────────────────────────────────────────────────────
  const addAdmin = (adminData) => {
    const newAdmin = {
      ...adminData,
      id: `ADM-${String(Date.now()).slice(-4)}`,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0]
    };
    const updated = [...admins, newAdmin];
    setAdmins(updated);
    setFilteredAdmins(updated);
    return newAdmin;
  };

  // ── Update Admin ───────────────────────────────────────────────────────────
  const updateAdmin = (id, updatedData) => {
    const updated = admins.map(admin =>
      admin.id === id ? { ...admin, ...updatedData } : admin
    );
    setAdmins(updated);
    setFilteredAdmins(updated);
  };

  // ── Delete Admin ───────────────────────────────────────────────────────────
  const deleteAdmin = (id) => {
    const updated = admins.filter(admin => admin.id !== id);
    setAdmins(updated);
    setFilteredAdmins(updated);
  };

  // ── Get Admin by ID ────────────────────────────────────────────────────────
  const getAdminById = (id) => admins.find(admin => admin.id === id);

  // ── Toggle Access (Activate / Deactivate) ─────────────────────────────────
  const toggleAdminAccess = (id) => {
    const updated = admins.map(admin =>
      admin.id === id
        ? { ...admin, status: admin.status === 'active' ? 'inactive' : 'active' }
        : admin
    );
    setAdmins(updated);
    setFilteredAdmins(updated);
  };

  // ── Reset Password ─────────────────────────────────────────────────────────
  const resetPassword = (id, newPassword) => {
    const updated = admins.map(admin =>
      admin.id === id ? { ...admin, password: newPassword } : admin
    );
    setAdmins(updated);
    setFilteredAdmins(updated);
  };

  // ── Filter Admins ──────────────────────────────────────────────────────────
  const filterAdmins = (filters) => {
    let filtered = [...admins];

    // Search by name, email, site, or ID
    if (filters.search) {
      const q = filters.search.toLowerCase();
      filtered = filtered.filter(admin =>
        admin.fullName.toLowerCase().includes(q) ||
        admin.email.toLowerCase().includes(q)    ||
        admin.siteName.toLowerCase().includes(q) ||
        admin.id.toLowerCase().includes(q)
      );
    }

    // Filter by industry
    if (filters.industry && filters.industry !== 'all') {
      filtered = filtered.filter(admin => admin.industry === filters.industry);
    }

    // Filter by status
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(admin => admin.status === filters.status);
    }

    // Filter by role
    if (filters.role && filters.role !== 'all') {
      filtered = filtered.filter(admin => admin.role === filters.role);
    }

    setFilteredAdmins(filtered);
  };

  // ── Clear Filters ──────────────────────────────────────────────────────────
  const clearFilters = () => setFilteredAdmins(admins);

  // ── Summary Stats ──────────────────────────────────────────────────────────
  const getStats = () => ({
    total:    admins.length,
    active:   admins.filter(a => a.status === 'active').length,
    inactive: admins.filter(a => a.status === 'inactive').length,
    admins:   admins.filter(a => a.role === 'Admin').length,
    buyers:   admins.filter(a => a.role === 'Buyer').length,
  });

  return {
    admins: filteredAdmins,
    allAdmins: admins,
    addAdmin,
    updateAdmin,
    deleteAdmin,
    getAdminById,
    toggleAdminAccess,
    resetPassword,
    filterAdmins,
    clearFilters,
    getStats
  };
};
