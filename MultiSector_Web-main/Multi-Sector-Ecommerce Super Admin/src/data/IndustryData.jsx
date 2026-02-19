// src/data/IndustryData.jsx
import { useState } from 'react';

const INITIAL_INDUSTRIES = [
  {
    id: 'IND-001',
    name: 'School',
    description: 'Educational institutions including primary, secondary and higher education',
    color: 'blue',
    sitesCount: 42,
    adminsCount: 42,
    status: 'active',
    createdAt: '2025-11-01'
  },
  {
    id: 'IND-002',
    name: 'Hospital',
    description: 'Healthcare facilities including general and specialty hospitals',
    color: 'red',
    sitesCount: 35,
    adminsCount: 35,
    status: 'active',
    createdAt: '2025-11-05'
  },
  {
    id: 'IND-003',
    name: 'Garage',
    description: 'Automobile service centers, repair shops and spare parts dealers',
    color: 'orange',
    sitesCount: 28,
    adminsCount: 28,
    status: 'active',
    createdAt: '2025-11-10'
  },
  {
    id: 'IND-004',
    name: 'Pharmacy',
    description: 'Medical stores, drug dispensaries and online pharmacy portals',
    color: 'green',
    sitesCount: 18,
    adminsCount: 18,
    status: 'active',
    createdAt: '2025-12-01'
  },
  {
    id: 'IND-005',
    name: 'Restaurant',
    description: 'Food service businesses including dine-in, takeaway and cloud kitchens',
    color: 'yellow',
    sitesCount: 11,
    adminsCount: 11,
    status: 'active',
    createdAt: '2025-12-15'
  },
  {
    id: 'IND-006',
    name: 'Gym',
    description: 'Fitness centres, sports clubs and personal training studios',
    color: 'purple',
    sitesCount: 6,
    adminsCount: 6,
    status: 'inactive',
    createdAt: '2026-01-10'
  },
];

// ─── Color Config ─────────────────────────────────────────────────────────────
export const INDUSTRY_COLORS = [
  'blue', 'red', 'green', 'orange', 'purple', 'yellow', 'pink', 'teal'
];

export const COLOR_MAP = {
  blue:   { bg: 'bg-blue-100',   text: 'text-blue-700',   border: 'border-blue-300',   icon: 'bg-blue-500'   },
  red:    { bg: 'bg-red-100',    text: 'text-red-700',    border: 'border-red-300',    icon: 'bg-red-500'    },
  green:  { bg: 'bg-green-100',  text: 'text-green-700',  border: 'border-green-300',  icon: 'bg-green-500'  },
  orange: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300', icon: 'bg-orange-500' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300', icon: 'bg-purple-500' },
  yellow: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300', icon: 'bg-yellow-500' },
  pink:   { bg: 'bg-pink-100',   text: 'text-pink-700',   border: 'border-pink-300',   icon: 'bg-pink-500'   },
  teal:   { bg: 'bg-teal-100',   text: 'text-teal-700',   border: 'border-teal-300',   icon: 'bg-teal-500'   },
};

// ─── Custom Hook ──────────────────────────────────────────────────────────────
export const useIndustryData = () => {
  const [industries, setIndustries]               = useState(INITIAL_INDUSTRIES);
  const [filteredIndustries, setFilteredIndustries] = useState(INITIAL_INDUSTRIES);

  const addIndustry = (data) => {
    const newIndustry = {
      ...data,
      id: `IND-${String(Date.now()).slice(-4)}`,
      sitesCount: 0,
      adminsCount: 0,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0]
    };
    const updated = [...industries, newIndustry];
    setIndustries(updated);
    setFilteredIndustries(updated);
    return newIndustry;
  };

  const updateIndustry = (id, data) => {
    const updated = industries.map(ind =>
      ind.id === id ? { ...ind, ...data } : ind
    );
    setIndustries(updated);
    setFilteredIndustries(updated);
  };

  const deleteIndustry = (id) => {
    const updated = industries.filter(ind => ind.id !== id);
    setIndustries(updated);
    setFilteredIndustries(updated);
  };

  const getIndustryById = (id) => industries.find(ind => ind.id === id);

  const toggleIndustryStatus = (id) => {
    const updated = industries.map(ind =>
      ind.id === id
        ? { ...ind, status: ind.status === 'active' ? 'inactive' : 'active' }
        : ind
    );
    setIndustries(updated);
    setFilteredIndustries(updated);
  };

  const filterIndustries = (filters) => {
    let filtered = [...industries];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      filtered = filtered.filter(ind =>
        ind.name.toLowerCase().includes(q) ||
        ind.description.toLowerCase().includes(q) ||
        ind.id.toLowerCase().includes(q)
      );
    }

    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(ind => ind.status === filters.status);
    }

    setFilteredIndustries(filtered);
  };

  const clearFilters = () => setFilteredIndustries(industries);

  const getStats = () => ({
    total:      industries.length,
    active:     industries.filter(i => i.status === 'active').length,
    inactive:   industries.filter(i => i.status === 'inactive').length,
    totalSites: industries.reduce((sum, i) => sum + i.sitesCount, 0),
  });

  return {
    industries: filteredIndustries,
    allIndustries: industries,
    addIndustry,
    updateIndustry,
    deleteIndustry,
    getIndustryById,
    toggleIndustryStatus,
    filterIndustries,
    clearFilters,
    getStats
  };
};
