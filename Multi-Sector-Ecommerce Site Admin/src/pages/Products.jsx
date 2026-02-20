import { useState } from 'react';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import { Card, CardHeader, CardBody } from '../components/common/Card';
import { PrimaryButton, SecondaryButton, ActionButtons, ButtonIcons } from '../components/common/Button';
import { useProductsData, INDUSTRIES } from '../data/ProductsData';
import { CreateProductModal, EditProductModal, ViewProductModal, DeleteConfirmModal } from '../modals/ProductsModals';
import { FaBox, FaRupeeSign, FaCubes, FaExclamationTriangle, FaChartLine, FaFileExport } from 'react-icons/fa';

const Products = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    filterProducts,
    clearFilters,
    allProducts
  } = useProductsData();

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Filter States
  const [filters, setFilters] = useState({
    search: '',
    industry: 'all',
    status: 'all',
    minPrice: '',
    maxPrice: ''
  });

  // Calculate Statistics
  const totalProducts = allProducts.length;
  const totalValue = allProducts.reduce((sum, product) => sum + (product.price * product.stock), 0);
  const totalStock = allProducts.reduce((sum, product) => sum + product.stock, 0);
  const lowStockProducts = allProducts.filter(product => product.stock < 100).length;

  // Filter Handlers
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    filterProducts(newFilters);
  };

  const handleClearFilters = () => {
    const resetFilters = {
      search: '',
      industry: 'all',
      status: 'all',
      minPrice: '',
      maxPrice: ''
    };
    setFilters(resetFilters);
    clearFilters();
  };

  // Modal Handlers
  const handleCreateProduct = (productData) => {
    addProduct(productData);
    toast.success('Product created successfully!');
    setIsCreateModalOpen(false);
  };

  const handleEditProduct = (productData) => {
    updateProduct(selectedProduct.id, productData);
    toast.success('Product updated successfully!');
    setIsEditModalOpen(false);
    setSelectedProduct(null);
  };

  const handleDeleteProduct = () => {
    deleteProduct(selectedProduct.id);
    toast.success('Product deleted successfully!');
    setIsDeleteModalOpen(false);
    setSelectedProduct(null);
  };

  const handleViewProduct = (id) => {
    const product = getProductById(id);
    setSelectedProduct(product);
    setIsViewModalOpen(true);
  };

  const handleOpenEditModal = (id) => {
    const product = getProductById(id);
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleOpenDeleteModal = (id) => {
    const product = getProductById(id);
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['SKU', 'Product Name', 'Industry', 'Category', 'Price', 'Stock', 'Status'];
    const csvContent = [
      headers.join(','),
      ...products.map(p => [
        p.sku,
        `"${p.name}"`,
        p.industries[0],
        p.category,
        p.price,
        p.stock,
        p.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `products_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Products exported successfully!');
  };

  return (
    <Layout>
      {/* Page Header with Add Button */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-pink-700 bg-clip-text text-transparent mb-2">
            Products
          </h1>
          <p className="text-gray-600">Manage your product inventory</p>
        </div>
        <div className="flex gap-3">
          <SecondaryButton onClick={handleExportCSV} icon={<FaFileExport />}>
            Export CSV
          </SecondaryButton>
          <PrimaryButton onClick={() => setIsCreateModalOpen(true)} icon={ButtonIcons.Add}>
            Add Product
          </PrimaryButton>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Total Products */}
        <Card className="hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">Total Products</p>
              <p className="text-2xl font-bold text-gray-800">{totalProducts}</p>
              <p className="text-xs text-gray-500 mt-1">Active inventory items</p>
            </div>
            <div className="w-14 h-14 bg-pink-100 rounded-xl flex items-center justify-center">
              <FaBox className="text-pink-600 text-2xl" />
            </div>
          </div>
        </Card>

        {/* Total Value */}
        <Card className="hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">Total Value</p>
              <p className="text-2xl font-bold text-gray-800">₹{totalValue.toLocaleString('en-IN')}</p>
              <p className="text-xs text-gray-500 mt-1">Inventory worth</p>
            </div>
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
              <FaRupeeSign className="text-green-600 text-2xl" />
            </div>
          </div>
        </Card>

        {/* Total Stock */}
        <Card className="hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">Total Stock</p>
              <p className="text-2xl font-bold text-gray-800">{totalStock.toLocaleString('en-IN')}</p>
              <p className="text-xs text-gray-500 mt-1">Units available</p>
            </div>
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
              <FaCubes className="text-blue-600 text-2xl" />
            </div>
          </div>
        </Card>

        {/* Low Stock Alert */}
        <Card className="hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">Low Stock</p>
              <p className="text-2xl font-bold text-gray-800">{lowStockProducts}</p>
              <p className="text-xs text-gray-500 mt-1">Items below 100 units</p>
            </div>
            <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center">
              <FaExclamationTriangle className="text-orange-600 text-2xl" />
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions Bar */}
      <Card className="mb-6">
        <CardBody>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <FaChartLine className="text-pink-500 text-xl" />
              <span className="text-sm font-semibold text-gray-700">
                Showing {products.length} of {totalProducts} products
              </span>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 text-sm font-medium text-pink-600 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors">
                All ({totalProducts})
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                Active ({allProducts.filter(p => p.status === 'active').length})
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                Low Stock ({lowStockProducts})
              </button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Filters Card */}
      <Card className="mb-6">
        <CardHeader
          title="Filters"
          action={
            <SecondaryButton onClick={handleClearFilters} icon={ButtonIcons.Clear}>
              Clear Filters
            </SecondaryButton>
          }
        />
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search products..."
                className="w-full px-4 py-2 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200"
              />
            </div>

            {/* Industry Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Industry</label>
              <select
                name="industry"
                value={filters.industry}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200"
              >
                <option value="all">All Industries</option>
                {INDUSTRIES.map((industry) => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Min Price */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Min Price (₹)</label>
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                placeholder="0"
                className="w-full px-4 py-2 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200"
              />
            </div>

            {/* Max Price */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Max Price (₹)</label>
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                placeholder="10000"
                className="w-full px-4 py-2 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200"
              />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Products Table Card */}
      <Card>
        <CardHeader
          title={`Products (${products.length})`}
          subtitle="View and manage all products"
        />
        <CardBody>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y-2 divide-pink-200">
              <thead className="bg-pink-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-pink-900 uppercase tracking-wider">SKU</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-pink-900 uppercase tracking-wider">Product Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-pink-900 uppercase tracking-wider">Industry</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-pink-900 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-pink-900 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-pink-900 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-pink-900 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-pink-900 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-pink-100">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <FaBox className="text-6xl text-gray-300 mb-4" />
                        <p className="text-gray-500 font-medium">No products found</p>
                        <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or add a new product</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className="hover:bg-pink-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">{product.sku}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{product.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-medium">
                          {product.industries[0]}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">₹{product.price.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`font-medium ${product.stock < 100 ? 'text-orange-600' : 'text-gray-700'}`}>
                          {product.stock} units
                        </span>
                        {product.stock < 100 && (
                          <FaExclamationTriangle className="inline ml-1 text-orange-500" />
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                          product.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <ActionButtons
                          onView={() => handleViewProduct(product.id)}
                          onEdit={() => handleOpenEditModal(product.id)}
                          onDelete={() => handleOpenDeleteModal(product.id)}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      {/* Modals */}
      <CreateProductModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateProduct}
      />

      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedProduct(null);
        }}
        onUpdate={handleEditProduct}
        product={selectedProduct}
      />

      <ViewProductModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedProduct(null);
        }}
        onConfirm={handleDeleteProduct}
        productName={selectedProduct?.name}
      />
    </Layout>
  );
};

export default Products;
