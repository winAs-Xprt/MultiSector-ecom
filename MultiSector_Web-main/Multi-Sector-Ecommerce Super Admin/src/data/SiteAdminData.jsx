// src/data/SiteAdminData.jsx
import { useState } from 'react';

export const SITE_INDUSTRIES = [
  'School', 'Hospital', 'Garage', 'Pharmacy',
  'Restaurant', 'Clinic', 'Gym', 'Hotel', 'Supermarket', 'Others'
];

const INITIAL_SITES = [
  {
    id: 'SITE-001',
    siteName: 'ABC School',
    siteUrl: 'abcschool.multiecom.in',
    location: 'Chennai, Tamil Nadu',
    industry: 'School',
    adminName: 'Rajesh Kumar',
    adminEmail: 'rajesh@abcschool.com',
    adminPassword: 'Admin@1234',
    description: 'Primary school with e-commerce portal for books and uniforms',
    visibility: 'active',
    createdAt: '2026-01-10'
  },
  {
    id: 'SITE-002',
    siteName: 'XYZ Hospital',
    siteUrl: 'xyzhosp.multiecom.in',
    location: 'Bangalore, Karnataka',
    industry: 'Hospital',
    adminName: 'Priya Sharma',
    adminEmail: 'priya@xyzhosp.com',
    adminPassword: 'Admin@5678',
    description: 'Multi-specialty hospital with online pharmacy and appointment portal',
    visibility: 'active',
    createdAt: '2026-01-15'
  },
  {
    id: 'SITE-003',
    siteName: 'Garage Plus',
    siteUrl: 'garageplus.multiecom.in',
    location: 'Mumbai, Maharashtra',
    industry: 'Garage',
    adminName: 'Amit Patel',
    adminEmail: 'amit@garageplus.com',
    adminPassword: 'Admin@9012',
    description: 'Auto repair shop with spare parts online store',
    visibility: 'inactive',
    createdAt: '2026-01-20'
  },
  {
    id: 'SITE-004',
    siteName: 'City School',
    siteUrl: 'cityschool.multiecom.in',
    location: 'Hyderabad, Telangana',
    industry: 'School',
    adminName: 'Sneha Reddy',
    adminEmail: 'sneha@cityschool.com',
    adminPassword: 'Admin@3456',
    description: 'CBSE school with stationery and uniform e-shop',
    visibility: 'active',
    createdAt: '2026-01-25'
  },
  {
    id: 'SITE-005',
    siteName: 'Pharma City',
    siteUrl: 'pharmacity.multiecom.in',
    location: 'Pune, Maharashtra',
    industry: 'Pharmacy',
    adminName: 'Ananya Iyer',
    adminEmail: 'ananya@pharmacity.com',
    adminPassword: 'Admin@2345',
    description: 'Online pharmacy with home delivery',
    visibility: 'active',
    createdAt: '2026-02-05'
  },
  {
    id: 'SITE-006',
    siteName: 'Med Hub',
    siteUrl: 'medhub.multiecom.in',
    location: 'Delhi, NCR',
    industry: 'Hospital',
    adminName: 'Vikram Singh',
    adminEmail: 'vikram@medhub.com',
    adminPassword: 'Admin@7890',
    description: 'Diagnostic center with test booking portal',
    visibility: 'inactive',
    createdAt: '2026-02-01'
  },
];

// ─── Custom Hook ──────────────────────────────────────────────────────────────
export const useSiteAdminData = () => {
  const [sites, setSites]                 = useState(INITIAL_SITES);
  const [filteredSites, setFilteredSites] = useState(INITIAL_SITES);

  const addSite = (data) => {
    const newSite = {
      ...data,
      id: `SITE-${String(Date.now()).slice(-4)}`,
      visibility: 'active',
      createdAt: new Date().toISOString().split('T')[0]
    };
    const updated = [...sites, newSite];
    setSites(updated);
    setFilteredSites(updated);
    return newSite;
  };

  const updateSite = (id, data) => {
    const updated = sites.map(s => s.id === id ? { ...s, ...data } : s);
    setSites(updated);
    setFilteredSites(updated);
  };

  const deleteSite = (id) => {
    const updated = sites.filter(s => s.id !== id);
    setSites(updated);
    setFilteredSites(updated);
  };

  const getSiteById = (id) => sites.find(s => s.id === id);

  const toggleVisibility = (id) => {
    const updated = sites.map(s =>
      s.id === id
        ? { ...s, visibility: s.visibility === 'active' ? 'inactive' : 'active' }
        : s
    );
    setSites(updated);
    setFilteredSites(updated);
  };

  const filterSites = (filters) => {
    let filtered = [...sites];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      filtered = filtered.filter(s =>
        s.siteName.toLowerCase().includes(q)    ||
        s.adminEmail.toLowerCase().includes(q)  ||
        s.location.toLowerCase().includes(q)    ||
        s.id.toLowerCase().includes(q)          ||
        s.adminName.toLowerCase().includes(q)
      );
    }

    if (filters.industry && filters.industry !== 'all') {
      filtered = filtered.filter(s => s.industry === filters.industry);
    }

    if (filters.visibility && filters.visibility !== 'all') {
      filtered = filtered.filter(s => s.visibility === filters.visibility);
    }

    setFilteredSites(filtered);
  };

  const clearFilters = () => setFilteredSites(sites);

  const getStats = () => ({
    total:    sites.length,
    active:   sites.filter(s => s.visibility === 'active').length,
    inactive: sites.filter(s => s.visibility === 'inactive').length,
    industries: [...new Set(sites.map(s => s.industry))].length,
  });

  return {
    sites: filteredSites,
    allSites: sites,
    addSite,
    updateSite,
    deleteSite,
    getSiteById,
    toggleVisibility,
    filterSites,
    clearFilters,
    getStats
  };
};
