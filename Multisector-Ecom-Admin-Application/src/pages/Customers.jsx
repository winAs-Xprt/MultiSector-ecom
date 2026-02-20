// src/pages/Customers.jsx
import { useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import { ActionButtons } from '../components/common/Button';
import { useCustomersData, CUSTOMER_SEGMENTS, SITE_LIST } from '../data/CustomersData';
import {
  CreateCustomerModal, EditCustomerModal,
  ViewCustomerModal,   DeleteCustomerModal,
} from '../modals/CustomersModals';
import {
  FaUsers, FaUserCheck, FaUserTimes, FaBan,
  FaRupeeSign, FaFileExport, FaPlus, FaSearch,
  FaFilter, FaChevronLeft, FaChevronRight,
  FaShoppingBag, FaCalendarAlt,
} from 'react-icons/fa';

// ─── Segment colors ───────────────────────────────────────────────────────────
const SEGMENT_STYLE = {
  VIP:       { bg: '#fefce8', color: '#a16207' },
  Premium:   { bg: '#f5f3ff', color: '#7c3aed' },
  Regular:   { bg: '#eff6ff', color: '#2563eb' },
  New:       { bg: '#f0fdf4', color: '#16a34a' },
  'At Risk': { bg: '#fff7ed', color: '#ea580c' },
  Churned:   { bg: '#f3f4f6', color: '#6b7280' },
};

const STATUS_STYLE = {
  active:   { bg: '#f0fdf4', color: '#16a34a' },
  inactive: { bg: '#f3f4f6', color: '#9ca3af' },
  blocked:  { bg: '#fef2f2', color: '#ef4444' },
};

// ─── Stat Card (identical pattern to Products.jsx) ────────────────────────────
const StatCard = ({ label, value, sub, icon, color }) => {
  const colors = {
    pink:   { bg: '#fdf2f8', icon: '#ec4899', border: '#fce7f3' },
    green:  { bg: '#f0fdf4', icon: '#16a34a', border: '#bbf7d0' },
    blue:   { bg: '#eff6ff', icon: '#2563eb', border: '#bfdbfe' },
    orange: { bg: '#fff7ed', icon: '#ea580c', border: '#fed7aa' },
    red:    { bg: '#fef2f2', icon: '#ef4444', border: '#fecaca' },
  };
  const c = colors[color] || colors.pink;
  return (
    <div
      style={{ background: '#fff', borderRadius: '14px', padding: '20px 22px', border: '1px solid #f0f0f0', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', transition: 'box-shadow 0.2s, transform 0.2s' }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)'; e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      <div>
        <p style={{ fontSize: '11.5px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: '6px' }}>{label}</p>
        <p style={{ fontSize: '26px', fontWeight: 800, color: '#111827', letterSpacing: '-0.5px', lineHeight: 1 }}>{value}</p>
        <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '5px' }}>{sub}</p>
      </div>
      <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: c.bg, border: `1px solid ${c.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <span style={{ color: c.icon, fontSize: '17px' }}>{icon}</span>
      </div>
    </div>
  );
};

// ─── Filter Input (identical pattern to Products.jsx) ─────────────────────────
const FilterInput = ({ label, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
    <label style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</label>
    {children}
  </div>
);

const filterInputStyle = {
  width: '100%', padding: '9px 13px', fontSize: '13.5px', fontWeight: 500,
  color: '#111827', background: '#fafafa', border: '1.5px solid #f0f0f0',
  borderRadius: '10px', outline: 'none', fontFamily: 'inherit',
};

// ─── Customer Avatar Cell ─────────────────────────────────────────────────────
const CustomerAvatar = ({ avatar, name, location }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
    <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg,#ec4899,#db2777)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 8px rgba(236,72,153,0.22)' }}>
      <span style={{ color: '#fff', fontSize: '12px', fontWeight: 800, letterSpacing: '0.3px' }}>{avatar}</span>
    </div>
    <div>
      <p style={{ fontWeight: 600, color: '#111827', fontSize: '13.5px', margin: 0, whiteSpace: 'nowrap' }}>{name}</p>
      <p style={{ fontSize: '11.5px', color: '#9ca3af', margin: '2px 0 0', whiteSpace: 'nowrap' }}>{location}</p>
    </div>
  </div>
);

// ─── Pagination (identical pattern to Products.jsx) ───────────────────────────
const Pagination = ({ currentPage, totalPages, totalItems, pageSize, onPageChange, onPageSizeChange }) => {
  if (totalPages <= 1 && totalItems <= pageSize) return null;

  const getPageNumbers = () => {
    const delta = 1;
    const pages = [];
    const left  = currentPage - delta;
    const right = currentPage + delta;
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= left && i <= right)) pages.push(i);
      else if (i === left - 1 || i === right + 1) pages.push('...');
    }
    return pages.filter((p, i) => !(p === '...' && pages[i - 1] === '...'));
  };

  const btnBase = {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    minWidth: '34px', height: '34px', padding: '0 6px',
    borderRadius: '8px', border: '1.5px solid #f0f0f0',
    fontSize: '13px', fontWeight: 600, cursor: 'pointer',
    fontFamily: 'inherit', transition: 'all 0.18s',
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderTop: '1px solid #f5f5f5', flexWrap: 'wrap', gap: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '13px', color: '#9ca3af', fontWeight: 500 }}>
          Showing <strong style={{ color: '#111827' }}>{Math.min((currentPage - 1) * pageSize + 1, totalItems)}</strong>
          {' – '}
          <strong style={{ color: '#111827' }}>{Math.min(currentPage * pageSize, totalItems)}</strong>
          {' of '}
          <strong style={{ color: '#111827' }}>{totalItems}</strong> customers
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '12.5px', color: '#9ca3af', fontWeight: 500 }}>Rows:</span>
          <select value={pageSize} onChange={e => onPageSizeChange(Number(e.target.value))}
            style={{ padding: '5px 8px', fontSize: '13px', fontWeight: 600, color: '#374151', background: '#fafafa', border: '1.5px solid #f0f0f0', borderRadius: '8px', outline: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
            {[5, 10, 20, 50].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}
          style={{ ...btnBase, background: currentPage === 1 ? '#fafafa' : '#fff', color: currentPage === 1 ? '#d1d5db' : '#374151', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
          onMouseEnter={e => { if (currentPage !== 1) { e.currentTarget.style.borderColor = '#ec4899'; e.currentTarget.style.color = '#ec4899'; } }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#f0f0f0'; e.currentTarget.style.color = currentPage === 1 ? '#d1d5db' : '#374151'; }}>
          <FaChevronLeft style={{ fontSize: '11px' }} />
        </button>

        {getPageNumbers().map((page, idx) =>
          page === '...' ? (
            <span key={`e-${idx}`} style={{ padding: '0 4px', color: '#9ca3af', fontSize: '13px', fontWeight: 600 }}>…</span>
          ) : (
            <button key={page} onClick={() => onPageChange(page)}
              style={{ ...btnBase, background: page === currentPage ? '#ec4899' : '#fff', color: page === currentPage ? '#fff' : '#374151', borderColor: page === currentPage ? '#ec4899' : '#f0f0f0', boxShadow: page === currentPage ? '0 2px 8px rgba(236,72,153,0.28)' : 'none' }}
              onMouseEnter={e => { if (page !== currentPage) { e.currentTarget.style.borderColor = '#ec4899'; e.currentTarget.style.color = '#ec4899'; } }}
              onMouseLeave={e => { if (page !== currentPage) { e.currentTarget.style.borderColor = '#f0f0f0'; e.currentTarget.style.color = '#374151'; } }}>
              {page}
            </button>
          )
        )}

        <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}
          style={{ ...btnBase, background: currentPage === totalPages ? '#fafafa' : '#fff', color: currentPage === totalPages ? '#d1d5db' : '#374151', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
          onMouseEnter={e => { if (currentPage !== totalPages) { e.currentTarget.style.borderColor = '#ec4899'; e.currentTarget.style.color = '#ec4899'; } }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#f0f0f0'; e.currentTarget.style.color = currentPage === totalPages ? '#d1d5db' : '#374151'; }}>
          <FaChevronRight style={{ fontSize: '11px' }} />
        </button>
      </div>
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
const Customers = () => {
  const {
    customers, allCustomers,
    addCustomer, updateCustomer, deleteCustomer,
    getCustomerById, filterCustomers, clearFilters,
  } = useCustomersData();

  // ── Modal States ──────────────────────────────────────────────────────────
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen,   setIsEditOpen]   = useState(false);
  const [isViewOpen,   setIsViewOpen]   = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selected,     setSelected]     = useState(null);

  // ── Filter States ─────────────────────────────────────────────────────────
  const [filters, setFilters] = useState({
    search: '', status: 'all', segment: 'all', site: 'all',
  });

  // ── Pagination ────────────────────────────────────────────────────────────
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize,    setPageSize]    = useState(10);

  // ── Stats ─────────────────────────────────────────────────────────────────
  const totalCustomers    = allCustomers.length;
  const activeCount       = allCustomers.filter(c => c.status === 'active').length;
  const inactiveCount     = allCustomers.filter(c => c.status === 'inactive').length;
  const blockedCount      = allCustomers.filter(c => c.status === 'blocked').length;
  const totalRevenue      = allCustomers.reduce((s, c) => s + c.totalSpent, 0);

  // ── Pagination slice ──────────────────────────────────────────────────────
  const totalPages        = Math.max(1, Math.ceil(customers.length / pageSize));
  const paginated         = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return customers.slice(start, start + pageSize);
  }, [customers, currentPage, pageSize]);

  // ── Filter Handlers ───────────────────────────────────────────────────────
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const next = { ...filters, [name]: value };
    setFilters(next);
    filterCustomers(next);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    const reset = { search: '', status: 'all', segment: 'all', site: 'all' };
    setFilters(reset);
    clearFilters();
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    document.getElementById('customers-table')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // ── CRUD Handlers ─────────────────────────────────────────────────────────
  const handleCreate = (data) => {
    addCustomer(data);
    toast.success('Customer added successfully!');
    setIsCreateOpen(false);
    setCurrentPage(1);
  };

  const handleUpdate = (data) => {
    updateCustomer(selected.id, data);
    toast.success('Customer updated successfully!');
    setIsEditOpen(false);
    setSelected(null);
  };

  const handleDelete = () => {
    deleteCustomer(selected.id);
    toast.success('Customer deleted!');
    setIsDeleteOpen(false);
    setSelected(null);
    const newTotal = customers.length - 1;
    const newTotalPages = Math.max(1, Math.ceil(newTotal / pageSize));
    if (currentPage > newTotalPages) setCurrentPage(newTotalPages);
  };

  const openView   = (id) => { setSelected(getCustomerById(id)); setIsViewOpen(true);   };
  const openEdit   = (id) => { setSelected(getCustomerById(id)); setIsEditOpen(true);   };
  const openDelete = (id) => { setSelected(getCustomerById(id)); setIsDeleteOpen(true); };

  // ── CSV Export ────────────────────────────────────────────────────────────
  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Location', 'Site', 'Segment', 'Status', 'Orders', 'Total Spent', 'Joined'];
    const rows = customers.map(c => [
      c.id, `"${c.name}"`, c.email, c.phone,
      `"${c.location}"`, c.site, c.segment,
      c.status, c.totalOrders, c.totalSpent, c.joinedDate,
    ].join(','));
    const blob = new Blob([[headers.join(','), ...rows].join('\n')], { type: 'text/csv' });
    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(blob),
      download: `customers_${new Date().toISOString().split('T')[0]}.csv`,
    });
    a.click();
    toast.success('CSV exported successfully!');
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <Layout>
      <div className="fade-up" style={{ maxWidth: '1400px', margin: '0 auto' }}>

        {/* ── Header ──────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#111827', letterSpacing: '-0.5px', marginBottom: '4px' }}>Customers</h1>
            <p style={{ fontSize: '13.5px', color: '#9ca3af', fontWeight: 500 }}>Manage and track customers across all sites</p>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button onClick={handleExportCSV}
              style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '9px 18px', fontSize: '13.5px', fontWeight: 600, color: '#374151', background: '#fff', border: '1.5px solid #e5e7eb', borderRadius: '10px', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.18s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#ec4899'; e.currentTarget.style.color = '#ec4899'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#374151'; }}>
              <FaFileExport style={{ fontSize: '13px' }} /> Export CSV
            </button>
            <button onClick={() => setIsCreateOpen(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '9px 18px', fontSize: '13.5px', fontWeight: 600, color: '#fff', background: 'linear-gradient(135deg,#ec4899,#db2777)', border: 'none', borderRadius: '10px', cursor: 'pointer', boxShadow: '0 3px 12px rgba(236,72,153,0.3)', fontFamily: 'inherit', transition: 'all 0.18s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 5px 18px rgba(236,72,153,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)';    e.currentTarget.style.boxShadow = '0 3px 12px rgba(236,72,153,0.3)'; }}>
              <FaPlus style={{ fontSize: '11px' }} /> Add Customer
            </button>
          </div>
        </div>

        {/* ── Stats ───────────────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '14px', marginBottom: '24px' }}>
          <StatCard label="Total Customers"   value={totalCustomers}                                      sub="Across all sites"     icon={<FaUsers />}     color="pink"   />
          <StatCard label="Active"            value={activeCount}                                         sub="Currently active"     icon={<FaUserCheck />} color="green"  />
          <StatCard label="Inactive / Blocked" value={inactiveCount + blockedCount}                       sub={`${blockedCount} blocked`} icon={<FaUserTimes />} color="orange" />
          <StatCard label="Total Revenue"     value={`₹${totalRevenue.toLocaleString('en-IN')}`}          sub="Lifetime customer value" icon={<FaRupeeSign />} color="blue"  />
        </div>

        {/* ── Quick Tabs ───────────────────────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '18px', flexWrap: 'wrap' }}>
          {[
            { label: 'All',      count: totalCustomers,              active: filters.status === 'all',      onClick: handleClearFilters },
            { label: 'Active',   count: activeCount,                  active: filters.status === 'active',   onClick: () => handleFilterChange({ target: { name: 'status', value: 'active'   } }) },
            { label: 'Inactive', count: inactiveCount,                active: filters.status === 'inactive', onClick: () => handleFilterChange({ target: { name: 'status', value: 'inactive' } }) },
            { label: 'Blocked',  count: blockedCount,                 active: filters.status === 'blocked',  onClick: () => handleFilterChange({ target: { name: 'status', value: 'blocked'  } }) },
          ].map(tab => (
            <button key={tab.label} onClick={tab.onClick}
              style={{ padding: '7px 14px', fontSize: '13px', fontWeight: 600, borderRadius: '8px', border: 'none', cursor: 'pointer', fontFamily: 'inherit', background: tab.active ? '#fdf2f8' : 'transparent', color: tab.active ? '#ec4899' : '#6b7280', transition: 'all 0.18s' }}
              onMouseEnter={e => { if (!tab.active) e.currentTarget.style.background = '#f9fafb'; }}
              onMouseLeave={e => { if (!tab.active) e.currentTarget.style.background = 'transparent'; }}>
              {tab.label}
              <span style={{ marginLeft: '6px', padding: '1px 7px', borderRadius: '20px', fontSize: '11px', background: tab.active ? '#fce7f3' : '#f3f4f6', color: tab.active ? '#ec4899' : '#9ca3af' }}>
                {tab.count}
              </span>
            </button>
          ))}
          <span style={{ marginLeft: 'auto', fontSize: '13px', color: '#9ca3af', fontWeight: 500 }}>
            Showing <strong style={{ color: '#111827' }}>{customers.length}</strong> of <strong style={{ color: '#111827' }}>{totalCustomers}</strong> customers
          </span>
        </div>

        {/* ── Filters ─────────────────────────────────────────────────── */}
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #f0f0f0', padding: '18px 20px', marginBottom: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              <FaFilter style={{ color: '#ec4899', fontSize: '13px' }} />
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#111827' }}>Filters</span>
            </div>
            <button onClick={handleClearFilters}
              style={{ fontSize: '12.5px', fontWeight: 600, color: '#ec4899', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
              Clear all
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>

            <FilterInput label="Search">
              <div style={{ position: 'relative' }}>
                <FaSearch style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: '#d1d5db', fontSize: '12px' }} />
                <input type="text" name="search" value={filters.search} onChange={handleFilterChange} placeholder="Name, email, ID..."
                  style={{ ...filterInputStyle, paddingLeft: '32px' }}
                  onFocus={e => { e.target.style.borderColor = '#ec4899'; e.target.style.background = '#fff'; }}
                  onBlur={e  => { e.target.style.borderColor = '#f0f0f0'; e.target.style.background = '#fafafa'; }} />
              </div>
            </FilterInput>

            <FilterInput label="Status">
              <select name="status" value={filters.status} onChange={handleFilterChange}
                style={{ ...filterInputStyle, cursor: 'pointer' }}
                onFocus={e => { e.target.style.borderColor = '#ec4899'; e.target.style.background = '#fff'; }}
                onBlur={e  => { e.target.style.borderColor = '#f0f0f0'; e.target.style.background = '#fafafa'; }}>
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="blocked">Blocked</option>
              </select>
            </FilterInput>

            <FilterInput label="Segment">
              <select name="segment" value={filters.segment} onChange={handleFilterChange}
                style={{ ...filterInputStyle, cursor: 'pointer' }}
                onFocus={e => { e.target.style.borderColor = '#ec4899'; e.target.style.background = '#fff'; }}
                onBlur={e  => { e.target.style.borderColor = '#f0f0f0'; e.target.style.background = '#fafafa'; }}>
                <option value="all">All Segments</option>
                {CUSTOMER_SEGMENTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </FilterInput>

            <FilterInput label="Site">
              <select name="site" value={filters.site} onChange={handleFilterChange}
                style={{ ...filterInputStyle, cursor: 'pointer' }}
                onFocus={e => { e.target.style.borderColor = '#ec4899'; e.target.style.background = '#fff'; }}
                onBlur={e  => { e.target.style.borderColor = '#f0f0f0'; e.target.style.background = '#fafafa'; }}>
                <option value="all">All Sites</option>
                {SITE_LIST.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </FilterInput>

          </div>
        </div>

        {/* ── Table ───────────────────────────────────────────────────── */}
        <div id="customers-table" style={{ background: '#fff', borderRadius: '14px', border: '1px solid #f0f0f0', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>

          {/* Title bar */}
          <div style={{ padding: '18px 22px', borderBottom: '1px solid #f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', margin: 0 }}>Customer List</h2>
              <p style={{ fontSize: '12.5px', color: '#9ca3af', marginTop: '2px' }}>
                {customers.length} {customers.length === 1 ? 'customer' : 'customers'} found
                {totalPages > 1 && <span style={{ color: '#d1d5db' }}> · Page {currentPage} of {totalPages}</span>}
              </p>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px' }}>
              <thead>
                <tr style={{ background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
                  {['ID', 'Customer', 'Contact', 'Site', 'Segment', 'Orders', 'Spent', 'Last Order', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '11px 16px', textAlign: h === 'Actions' ? 'center' : 'left', fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.6px', whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={10} style={{ padding: '60px 20px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: '#fdf2f8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <FaUsers style={{ color: '#f9a8d4', fontSize: '22px' }} />
                        </div>
                        <p style={{ fontWeight: 600, color: '#374151', fontSize: '14px', margin: 0 }}>No customers found</p>
                        <p style={{ color: '#9ca3af', fontSize: '13px', margin: 0 }}>Try adjusting your filters or add a new customer</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginated.map((c, idx) => (
                    <tr key={c.id}
                      style={{ borderBottom: idx < paginated.length - 1 ? '1px solid #f9f9f9' : 'none', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#fdf9fc'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>

                      {/* ID */}
                      <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                        <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#ec4899', background: '#fdf2f8', padding: '3px 8px', borderRadius: '6px', letterSpacing: '0.3px', fontFamily: 'monospace' }}>
                          {c.id}
                        </span>
                      </td>

                      {/* Customer */}
                      <td style={{ padding: '12px 16px' }}>
                        <CustomerAvatar avatar={c.avatar} name={c.name} location={c.location} />
                      </td>

                      {/* Contact */}
                      <td style={{ padding: '12px 16px' }}>
                        <p style={{ fontSize: '12.5px', color: '#374151', margin: 0 }}>{c.email}</p>
                        <p style={{ fontSize: '11.5px', color: '#9ca3af', margin: '2px 0 0' }}>{c.phone}</p>
                      </td>

                      {/* Site */}
                      <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#2563eb', background: '#eff6ff', padding: '3px 9px', borderRadius: '6px' }}>
                          {c.site.replace('.multiecom.in', '')}
                        </span>
                      </td>

                      {/* Segment */}
                      <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, padding: '3px 10px', borderRadius: '6px', background: (SEGMENT_STYLE[c.segment] || {}).bg || '#f3f4f6', color: (SEGMENT_STYLE[c.segment] || {}).color || '#6b7280' }}>
                          {c.segment}
                        </span>
                      </td>

                      {/* Orders */}
                      <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontWeight: 600, color: '#374151' }}>
                          <FaShoppingBag style={{ color: '#ec4899', fontSize: '11px' }} />
                          {c.totalOrders}
                        </span>
                      </td>

                      {/* Spent */}
                      <td style={{ padding: '12px 16px', fontWeight: 700, color: '#111827', whiteSpace: 'nowrap' }}>
                        ₹{Number(c.totalSpent).toLocaleString('en-IN')}
                      </td>

                      {/* Last Order */}
                      <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12.5px', color: '#6b7280' }}>
                          <FaCalendarAlt style={{ color: '#d1d5db', fontSize: '11px' }} />
                          {c.lastOrderDate}
                        </span>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, padding: '3px 10px', borderRadius: '6px', background: (STATUS_STYLE[c.status] || {}).bg || '#f3f4f6', color: (STATUS_STYLE[c.status] || {}).color || '#9ca3af' }}>
                          {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <ActionButtons
                          onView={()   => openView(c.id)}
                          onEdit={()   => openEdit(c.id)}
                          onDelete={()  => openDelete(c.id)}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ── Pagination ───────────────────────────────────────────── */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={customers.length}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
          />
        </div>

      </div>

      {/* ── Modals ────────────────────────────────────────────────────── */}
      <CreateCustomerModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)}                                              onCreate={handleCreate}  />
      <EditCustomerModal   isOpen={isEditOpen}   onClose={() => { setIsEditOpen(false);   setSelected(null); }} onUpdate={handleUpdate}  customer={selected} />
      <ViewCustomerModal   isOpen={isViewOpen}   onClose={() => { setIsViewOpen(false);   setSelected(null); }}                          customer={selected} />
      <DeleteCustomerModal isOpen={isDeleteOpen} onClose={() => { setIsDeleteOpen(false); setSelected(null); }} onConfirm={handleDelete} customer={selected} />
    </Layout>
  );
};

export default Customers;
