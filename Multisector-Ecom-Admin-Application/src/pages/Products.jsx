import { useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import { ActionButtons } from '../components/common/Button';
import { useProductsData, INDUSTRIES } from '../data/ProductsData';
import {
  CreateProductModal, EditProductModal,
  ViewProductModal, DeleteConfirmModal
} from '../modals/ProductsModals';
import {
  FaBox, FaRupeeSign, FaCubes, FaExclamationTriangle,
  FaFileExport, FaPlus, FaSearch, FaFilter, FaImage,
  FaChevronLeft, FaChevronRight
} from 'react-icons/fa';

// ─── helpers ──────────────────────────────────────────────────────────────────
const getFirstImage = (images) => {
  if (!images) return null;
  try {
    const parsed = typeof images === 'string' ? JSON.parse(images) : images;
    if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
    if (typeof parsed === 'string') return parsed;
  } catch {
    if (typeof images === 'string' && images.startsWith('http')) return images;
  }
  return null;
};

// ─── Product Thumbnail ────────────────────────────────────────────────────────
const ProductThumb = ({ images, name }) => {
  const [imgError, setImgError] = useState(false);
  const rawSrc = getFirstImage(images);
  const src    = typeof rawSrc === 'string' ? rawSrc : rawSrc?.preview;

  if (!src || imgError) {
    return (
      <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#fdf2f8', border: '1px solid #fce7f3', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <FaImage style={{ color: '#f9a8d4', fontSize: '15px' }} />
      </div>
    );
  }
  return (
    <img src={src} alt={name} onError={() => setImgError(true)}
      style={{ width: '42px', height: '42px', borderRadius: '10px', objectFit: 'cover', border: '1px solid #f0f0f0', flexShrink: 0, display: 'block' }}
    />
  );
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, sub, icon, color }) => {
  const colors = {
    pink:   { bg: '#fdf2f8', icon: '#ec4899', border: '#fce7f3' },
    green:  { bg: '#f0fdf4', icon: '#16a34a', border: '#bbf7d0' },
    blue:   { bg: '#eff6ff', icon: '#2563eb', border: '#bfdbfe' },
    orange: { bg: '#fff7ed', icon: '#ea580c', border: '#fed7aa' },
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

// ─── Filter Input ─────────────────────────────────────────────────────────────
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

// ─── Pagination ───────────────────────────────────────────────────────────────
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

      {/* Left — info + rows per page */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '13px', color: '#9ca3af', fontWeight: 500 }}>
          Showing <strong style={{ color: '#111827' }}>{Math.min((currentPage - 1) * pageSize + 1, totalItems)}</strong>
          {' – '}
          <strong style={{ color: '#111827' }}>{Math.min(currentPage * pageSize, totalItems)}</strong>
          {' of '}
          <strong style={{ color: '#111827' }}>{totalItems}</strong> products
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '12.5px', color: '#9ca3af', fontWeight: 500 }}>Rows:</span>
          <select
            value={pageSize}
            onChange={e => onPageSizeChange(Number(e.target.value))}
            style={{ padding: '5px 8px', fontSize: '13px', fontWeight: 600, color: '#374151', background: '#fafafa', border: '1.5px solid #f0f0f0', borderRadius: '8px', outline: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            {[5, 10, 20, 50].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>

      {/* Right — page buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <button
          onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}
          style={{ ...btnBase, background: currentPage === 1 ? '#fafafa' : '#fff', color: currentPage === 1 ? '#d1d5db' : '#374151', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
          onMouseEnter={e => { if (currentPage !== 1) { e.currentTarget.style.borderColor = '#ec4899'; e.currentTarget.style.color = '#ec4899'; } }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#f0f0f0'; e.currentTarget.style.color = currentPage === 1 ? '#d1d5db' : '#374151'; }}
        >
          <FaChevronLeft style={{ fontSize: '11px' }} />
        </button>

        {getPageNumbers().map((page, idx) =>
          page === '...' ? (
            <span key={`ellipsis-${idx}`} style={{ padding: '0 4px', color: '#9ca3af', fontSize: '13px', fontWeight: 600 }}>…</span>
          ) : (
            <button key={page} onClick={() => onPageChange(page)}
              style={{ ...btnBase, background: page === currentPage ? '#ec4899' : '#fff', color: page === currentPage ? '#fff' : '#374151', borderColor: page === currentPage ? '#ec4899' : '#f0f0f0', boxShadow: page === currentPage ? '0 2px 8px rgba(236,72,153,0.28)' : 'none' }}
              onMouseEnter={e => { if (page !== currentPage) { e.currentTarget.style.borderColor = '#ec4899'; e.currentTarget.style.color = '#ec4899'; } }}
              onMouseLeave={e => { if (page !== currentPage) { e.currentTarget.style.borderColor = '#f0f0f0'; e.currentTarget.style.color = '#374151'; } }}
            >
              {page}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}
          style={{ ...btnBase, background: currentPage === totalPages ? '#fafafa' : '#fff', color: currentPage === totalPages ? '#d1d5db' : '#374151', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
          onMouseEnter={e => { if (currentPage !== totalPages) { e.currentTarget.style.borderColor = '#ec4899'; e.currentTarget.style.color = '#ec4899'; } }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#f0f0f0'; e.currentTarget.style.color = currentPage === totalPages ? '#d1d5db' : '#374151'; }}
        >
          <FaChevronRight style={{ fontSize: '11px' }} />
        </button>
      </div>
    </div>
  );
};

// ─── Products Page ────────────────────────────────────────────────────────────
const Products = () => {
  const {
    products, addProduct, updateProduct, deleteProduct,
    getProductById, filterProducts, clearFilters, allProducts,
  } = useProductsData();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen,   setIsEditModalOpen]   = useState(false);
  const [isViewModalOpen,   setIsViewModalOpen]   = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct,   setSelectedProduct]   = useState(null);

  const [filters, setFilters] = useState({
    search: '', industry: 'all', status: 'all', minPrice: '', maxPrice: '',
  });

  // ── Pagination state ──
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize,    setPageSize]    = useState(10);

  // ── Stats ──
  const totalProducts    = allProducts.length;
  const totalValue       = allProducts.reduce((s, p) => s + p.price * p.quantity, 0);
  const totalStock       = allProducts.reduce((s, p) => s + p.quantity, 0);
  const lowStock         = allProducts.filter(p => p.quantity < 100).length;
  const activeProducts   = allProducts.filter(p =>  p.isActive).length;
  const inactiveProducts = allProducts.filter(p => !p.isActive).length;

  // ── Paginated slice ──
  const totalPages         = Math.max(1, Math.ceil(products.length / pageSize));
  const paginatedProducts  = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return products.slice(start, start + pageSize);
  }, [products, currentPage, pageSize]);

  // ── Filters ──
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const next = { ...filters, [name]: value };
    setFilters(next);
    filterProducts(next);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    const reset = { search: '', industry: 'all', status: 'all', minPrice: '', maxPrice: '' };
    setFilters(reset);
    clearFilters();
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    document.getElementById('products-table')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  // ── CRUD ──
  const handleCreateProduct = (data) => {
    addProduct(data);
    toast.success('Product created successfully!');
    setIsCreateModalOpen(false);
    setCurrentPage(1);
  };

  const handleEditProduct = (data) => {
    updateProduct(selectedProduct.id, data);
    toast.success('Product updated successfully!');
    setIsEditModalOpen(false);
    setSelectedProduct(null);
  };

  const handleDeleteProduct = () => {
    deleteProduct(selectedProduct.id);
    toast.success('Product deleted successfully!');
    setIsDeleteModalOpen(false);
    setSelectedProduct(null);
    const newTotal      = products.length - 1;
    const newTotalPages = Math.max(1, Math.ceil(newTotal / pageSize));
    if (currentPage > newTotalPages) setCurrentPage(newTotalPages);
  };

  const openView   = (id) => { setSelectedProduct(getProductById(id)); setIsViewModalOpen(true); };
  const openEdit   = (id) => { setSelectedProduct(getProductById(id)); setIsEditModalOpen(true); };
  const openDelete = (id) => { setSelectedProduct(getProductById(id)); setIsDeleteModalOpen(true); };

  // ── CSV Export (all filtered products) ──
  const handleExportCSV = () => {
    const headers = ['ID', 'SKU', 'Product Name', 'Industry', 'Category', 'Price', 'Quantity', 'Has Variants', 'Status'];
    const rows = products.map(p => [
      p.id, p.product_sku_key, `"${p.name}"`, p.industry,
      p.category ?? '', p.price, p.quantity,
      p.hasVariants ? 'Yes' : 'No', p.isActive ? 'Active' : 'Inactive',
    ].join(','));
    const blob = new Blob([[headers.join(','), ...rows].join('\n')], { type: 'text/csv' });
    const a    = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(blob),
      download: `products_${new Date().toISOString().split('T')[0]}.csv`,
    });
    a.click();
    toast.success('CSV exported successfully!');
  };

  return (
    <Layout>
      <div className="fade-up" style={{ maxWidth: '1400px', margin: '0 auto' }}>

        {/* ── Header ─────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#111827', letterSpacing: '-0.5px', marginBottom: '4px' }}>Products</h1>
            <p style={{ fontSize: '13.5px', color: '#9ca3af', fontWeight: 500 }}>Manage and track your product inventory</p>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button onClick={handleExportCSV}
              style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '9px 18px', fontSize: '13.5px', fontWeight: 600, color: '#374151', background: '#fff', border: '1.5px solid #e5e7eb', borderRadius: '10px', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.18s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#ec4899'; e.currentTarget.style.color = '#ec4899'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#374151'; }}
            >
              <FaFileExport style={{ fontSize: '13px' }} /> Export CSV
            </button>
            <button onClick={() => setIsCreateModalOpen(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '9px 18px', fontSize: '13.5px', fontWeight: 600, color: '#fff', background: 'linear-gradient(135deg,#ec4899,#db2777)', border: 'none', borderRadius: '10px', cursor: 'pointer', boxShadow: '0 3px 12px rgba(236,72,153,0.3)', fontFamily: 'inherit', transition: 'all 0.18s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 5px 18px rgba(236,72,153,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)';    e.currentTarget.style.boxShadow = '0 3px 12px rgba(236,72,153,0.3)'; }}
            >
              <FaPlus style={{ fontSize: '11px' }} /> Add Product
            </button>
          </div>
        </div>

        {/* ── Stats ──────────────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '14px', marginBottom: '24px' }}>
          <StatCard label="Total Products" value={totalProducts}                             sub="Inventory items"  icon={<FaBox />}                color="pink"   />
          <StatCard label="Total Value"    value={`₹${totalValue.toLocaleString('en-IN')}`} sub="Inventory worth" icon={<FaRupeeSign />}           color="green"  />
          <StatCard label="Total Stock"    value={totalStock.toLocaleString('en-IN')}        sub="Units available" icon={<FaCubes />}               color="blue"   />
          <StatCard label="Low Stock"      value={lowStock}                                  sub="Below 100 units" icon={<FaExclamationTriangle />} color="orange" />
        </div>

        {/* ── Quick Tabs ──────────────────────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '18px', flexWrap: 'wrap' }}>
          {[
            {
              label:  'All',
              count:  totalProducts,
              active: filters.status === 'all',
              onClick: handleClearFilters,
            },
            {
              label:  'Active',
              count:  activeProducts,
              active: filters.status === 'active',
              onClick: () => handleFilterChange({ target: { name: 'status', value: 'active' } }),
            },
            {
              label:  'Inactive',
              count:  inactiveProducts,
              active: filters.status === 'inactive',
              onClick: () => handleFilterChange({ target: { name: 'status', value: 'inactive' } }),
            },
          ].map(tab => (
            <button key={tab.label} onClick={tab.onClick}
              style={{ padding: '7px 14px', fontSize: '13px', fontWeight: 600, borderRadius: '8px', border: 'none', cursor: 'pointer', fontFamily: 'inherit', background: tab.active ? '#fdf2f8' : 'transparent', color: tab.active ? '#ec4899' : '#6b7280', transition: 'all 0.18s' }}
              onMouseEnter={e => { if (!tab.active) e.currentTarget.style.background = '#f9fafb'; }}
              onMouseLeave={e => { if (!tab.active) e.currentTarget.style.background = 'transparent'; }}
            >
              {tab.label}
              <span style={{ marginLeft: '6px', padding: '1px 7px', borderRadius: '20px', fontSize: '11px', background: tab.active ? '#fce7f3' : '#f3f4f6', color: tab.active ? '#ec4899' : '#9ca3af' }}>
                {tab.count}
              </span>
            </button>
          ))}
          <span style={{ marginLeft: 'auto', fontSize: '13px', color: '#9ca3af', fontWeight: 500 }}>
            Showing <strong style={{ color: '#111827' }}>{products.length}</strong> of <strong style={{ color: '#111827' }}>{totalProducts}</strong> products
          </span>
        </div>

        {/* ── Filters ────────────────────────────────────────────────── */}
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
                <input type="text" name="search" value={filters.search} onChange={handleFilterChange} placeholder="Name, SKU..."
                  style={{ ...filterInputStyle, paddingLeft: '32px' }}
                  onFocus={e => { e.target.style.borderColor = '#ec4899'; e.target.style.background = '#fff'; }}
                  onBlur={e =>  { e.target.style.borderColor = '#f0f0f0'; e.target.style.background = '#fafafa'; }}
                />
              </div>
            </FilterInput>

            <FilterInput label="Industry">
              <select name="industry" value={filters.industry} onChange={handleFilterChange}
                style={{ ...filterInputStyle, cursor: 'pointer' }}
                onFocus={e => { e.target.style.borderColor = '#ec4899'; e.target.style.background = '#fff'; }}
                onBlur={e =>  { e.target.style.borderColor = '#f0f0f0'; e.target.style.background = '#fafafa'; }}>
                <option value="all">All Industries</option>
                {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </FilterInput>

            <FilterInput label="Status">
              <select name="status" value={filters.status} onChange={handleFilterChange}
                style={{ ...filterInputStyle, cursor: 'pointer' }}
                onFocus={e => { e.target.style.borderColor = '#ec4899'; e.target.style.background = '#fff'; }}
                onBlur={e =>  { e.target.style.borderColor = '#f0f0f0'; e.target.style.background = '#fafafa'; }}>
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </FilterInput>

            <FilterInput label="Min Price (₹)">
              <input type="number" name="minPrice" value={filters.minPrice} onChange={handleFilterChange} placeholder="0" min="0"
                style={filterInputStyle}
                onFocus={e => { e.target.style.borderColor = '#ec4899'; e.target.style.background = '#fff'; }}
                onBlur={e =>  { e.target.style.borderColor = '#f0f0f0'; e.target.style.background = '#fafafa'; }}
              />
            </FilterInput>

            <FilterInput label="Max Price (₹)">
              <input type="number" name="maxPrice" value={filters.maxPrice} onChange={handleFilterChange} placeholder="99999" min="0"
                style={filterInputStyle}
                onFocus={e => { e.target.style.borderColor = '#ec4899'; e.target.style.background = '#fff'; }}
                onBlur={e =>  { e.target.style.borderColor = '#f0f0f0'; e.target.style.background = '#fafafa'; }}
              />
            </FilterInput>

          </div>
        </div>

        {/* ── Table ──────────────────────────────────────────────────── */}
        <div id="products-table" style={{ background: '#fff', borderRadius: '14px', border: '1px solid #f0f0f0', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>

          {/* Title bar */}
          <div style={{ padding: '18px 22px', borderBottom: '1px solid #f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', margin: 0 }}>Product List</h2>
              <p style={{ fontSize: '12.5px', color: '#9ca3af', marginTop: '2px' }}>
                {products.length} {products.length === 1 ? 'product' : 'products'} found
                {totalPages > 1 && <span style={{ color: '#d1d5db' }}> · Page {currentPage} of {totalPages}</span>}
              </p>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px' }}>
              <thead>
                <tr style={{ background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
                  {['Image', 'SKU', 'Product Name', 'Industry', 'Category', 'Price', 'Quantity', 'Variants', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '11px 16px', textAlign: h === 'Actions' ? 'center' : 'left', fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.6px', whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.length === 0 ? (
                  <tr>
                    <td colSpan={10} style={{ padding: '60px 20px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: '#fdf2f8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <FaBox style={{ color: '#f9a8d4', fontSize: '22px' }} />
                        </div>
                        <p style={{ fontWeight: 600, color: '#374151', fontSize: '14px', margin: 0 }}>No products found</p>
                        <p style={{ color: '#9ca3af', fontSize: '13px', margin: 0 }}>Try adjusting your filters or add a new product</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedProducts.map((product, idx) => (
                    <tr key={product.id}
                      style={{ borderBottom: idx < paginatedProducts.length - 1 ? '1px solid #f9f9f9' : 'none', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#fdf9fc'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      {/* Image */}
                      <td style={{ padding: '12px 16px' }}>
                        <ProductThumb images={product.images} name={product.name} />
                      </td>
                      {/* SKU */}
                      <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#ec4899', background: '#fdf2f8', padding: '3px 8px', borderRadius: '6px', letterSpacing: '0.3px' }}>
                          {product.product_sku_key}
                        </span>
                      </td>
                      {/* Name */}
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: 600, color: '#111827', whiteSpace: 'nowrap' }}>{product.name}</span>
                          {product.description && (
                            <span style={{ fontSize: '11.5px', color: '#9ca3af', marginTop: '2px', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {product.description}
                            </span>
                          )}
                        </div>
                      </td>
                      {/* Industry */}
                      <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#374151', background: '#f3f4f6', padding: '3px 10px', borderRadius: '6px' }}>
                          {product.industry}
                        </span>
                      </td>
                      {/* Category */}
                      <td style={{ padding: '12px 16px', color: '#6b7280', whiteSpace: 'nowrap' }}>
                        {product.category || '—'}
                      </td>
                      {/* Price */}
                      <td style={{ padding: '12px 16px', fontWeight: 700, color: '#111827', whiteSpace: 'nowrap' }}>
                        ₹{parseFloat(product.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      {/* Quantity */}
                      <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontWeight: 600, color: product.quantity < 100 ? '#ea580c' : '#374151' }}>
                          {product.quantity.toLocaleString('en-IN')}
                          {product.quantity < 100 && <FaExclamationTriangle style={{ color: '#ea580c', fontSize: '11px' }} />}
                        </span>
                      </td>
                      {/* Variants */}
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, padding: '3px 10px', borderRadius: '6px', background: product.hasVariants ? '#eff6ff' : '#f3f4f6', color: product.hasVariants ? '#2563eb' : '#9ca3af' }}>
                          {product.hasVariants ? 'Yes' : 'No'}
                        </span>
                      </td>
                      {/* Status */}
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, padding: '3px 10px', borderRadius: '6px', background: product.isActive ? '#f0fdf4' : '#f3f4f6', color: product.isActive ? '#16a34a' : '#9ca3af' }}>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      {/* Actions */}
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <ActionButtons
                          onView={() => openView(product.id)}
                          onEdit={() => openEdit(product.id)}
                          onDelete={() => openDelete(product.id)}
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
            totalItems={products.length}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>

      </div>

      {/* ── Modals ─────────────────────────────────────────────────── */}
      <CreateProductModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}          onCreate={handleCreateProduct} />
      <EditProductModal   isOpen={isEditModalOpen}   onClose={() => { setIsEditModalOpen(false);   setSelectedProduct(null); }} onUpdate={handleEditProduct}  product={selectedProduct} />
      <ViewProductModal   isOpen={isViewModalOpen}   onClose={() => { setIsViewModalOpen(false);   setSelectedProduct(null); }} product={selectedProduct} />
      <DeleteConfirmModal isOpen={isDeleteModalOpen} onClose={() => { setIsDeleteModalOpen(false); setSelectedProduct(null); }} onConfirm={handleDeleteProduct} productName={selectedProduct?.name} />
    </Layout>
  );
};

export default Products;
