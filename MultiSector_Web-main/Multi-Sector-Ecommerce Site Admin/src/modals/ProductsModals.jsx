import { useState, useEffect } from 'react';
import { FaTimes, FaBox, FaTag, FaLayerGroup, FaRupeeSign, FaCubes, FaCheckCircle, FaIndustry, FaAlignLeft } from 'react-icons/fa';
import { PrimaryButton, SecondaryButton, ButtonIcons } from '../components/common/Button';
import { INDUSTRIES } from '../data/ProductsData';

// Modal Wrapper Component
const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Dark Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      ></div>
      
      {/* Modal Container */}
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Modal Content */}
        <div className={`relative bg-white rounded-2xl shadow-2xl border-2 border-pink-200 w-full ${sizes[size]} max-h-[90vh] flex flex-col transform transition-all z-10`}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b-2 border-pink-100 flex-shrink-0">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-pink-700 bg-clip-text text-transparent">
              {title}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-pink-50 rounded-lg transition-colors">
              <FaTimes className="text-xl text-gray-600" />
            </button>
          </div>
          
          {/* Body - Scrollable */}
          <div className="p-6 overflow-y-auto flex-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// Create Product Modal
export const CreateProductModal = ({ isOpen, onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    sku: '',
    price: '',
    stock: '',
    category: '',
    description: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        industry: '',
        sku: '',
        price: '',
        stock: '',
        category: '',
        description: ''
      });
      setErrors({});
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.industry) newErrors.industry = 'Please select an industry';
    if (!formData.sku.trim()) newErrors.sku = 'SKU is required';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Valid price is required';
    if (!formData.stock || parseInt(formData.stock) < 0) newErrors.stock = 'Valid stock quantity is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onCreate({
        ...formData,
        industries: [formData.industry],
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Product" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
              errors.name ? 'border-red-400 focus:border-red-500 focus:ring-red-200' : 'border-pink-200 focus:border-pink-500 focus:ring-pink-200'
            }`}
            placeholder="Enter product name"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Industry - Styled Dropdown */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Industry *</label>
          <div className="relative">
            <select
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 pr-10 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 appearance-none bg-white cursor-pointer ${
                errors.industry ? 'border-red-400 focus:border-red-500 focus:ring-red-200' : 'border-pink-200 focus:border-pink-500 focus:ring-pink-200'
              }`}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ec4899' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 0.5rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.5em 1.5em',
              }}
            >
              <option value="" className="text-gray-400">Select an industry</option>
              {INDUSTRIES.map((industry) => (
                <option key={industry} value={industry} className="py-2">
                  {industry}
                </option>
              ))}
            </select>
          </div>
          {errors.industry && <p className="text-red-500 text-sm mt-1">{errors.industry}</p>}
        </div>

        {/* SKU and Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">SKU *</label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                errors.sku ? 'border-red-400 focus:border-red-500 focus:ring-red-200' : 'border-pink-200 focus:border-pink-500 focus:ring-pink-200'
              }`}
              placeholder="e.g., SKU-001"
            />
            {errors.sku && <p className="text-red-500 text-sm mt-1">{errors.sku}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                errors.category ? 'border-red-400 focus:border-red-500 focus:ring-red-200' : 'border-pink-200 focus:border-pink-500 focus:ring-pink-200'
              }`}
              placeholder="e.g., Electronics"
            />
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
          </div>
        </div>

        {/* Price and Stock */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Price (₹) *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              min="0"
              className={`w-full px-4 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                errors.price ? 'border-red-400 focus:border-red-500 focus:ring-red-200' : 'border-pink-200 focus:border-pink-500 focus:ring-pink-200'
              }`}
              placeholder="0.00"
            />
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Stock Quantity *</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              min="0"
              className={`w-full px-4 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                errors.stock ? 'border-red-400 focus:border-red-500 focus:ring-red-200' : 'border-pink-200 focus:border-pink-500 focus:ring-pink-200'
              }`}
              placeholder="0"
            />
            {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-2.5 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200"
            placeholder="Enter product description"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t-2 border-pink-100">
          <PrimaryButton type="submit" icon={ButtonIcons.Save} className="flex-1">
            Create Product
          </PrimaryButton>
          <SecondaryButton type="button" onClick={onClose} icon={ButtonIcons.Cancel} className="flex-1">
            Cancel
          </SecondaryButton>
        </div>
      </form>
    </Modal>
  );
};

// Edit Product Modal
export const EditProductModal = ({ isOpen, onClose, onUpdate, product }) => {
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    sku: '',
    price: '',
    stock: '',
    category: '',
    description: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product && isOpen) {
      setFormData({
        ...product,
        industry: product.industries && product.industries[0] ? product.industries[0] : ''
      });
      setErrors({});
    }
  }, [product, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.industry) newErrors.industry = 'Please select an industry';
    if (!formData.sku.trim()) newErrors.sku = 'SKU is required';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Valid price is required';
    if (!formData.stock || parseInt(formData.stock) < 0) newErrors.stock = 'Valid stock quantity is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onUpdate({
        ...formData,
        industries: [formData.industry],
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      });
    }
  };

  if (!product) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Product" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
              errors.name ? 'border-red-400 focus:border-red-500 focus:ring-red-200' : 'border-pink-200 focus:border-pink-500 focus:ring-pink-200'
            }`}
            placeholder="Enter product name"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Industry - Styled Dropdown */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Industry *</label>
          <div className="relative">
            <select
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 pr-10 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 appearance-none bg-white cursor-pointer ${
                errors.industry ? 'border-red-400 focus:border-red-500 focus:ring-red-200' : 'border-pink-200 focus:border-pink-500 focus:ring-pink-200'
              }`}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ec4899' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 0.5rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.5em 1.5em',
              }}
            >
              <option value="" className="text-gray-400">Select an industry</option>
              {INDUSTRIES.map((industry) => (
                <option key={industry} value={industry} className="py-2">
                  {industry}
                </option>
              ))}
            </select>
          </div>
          {errors.industry && <p className="text-red-500 text-sm mt-1">{errors.industry}</p>}
        </div>

        {/* SKU and Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">SKU *</label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                errors.sku ? 'border-red-400 focus:border-red-500 focus:ring-red-200' : 'border-pink-200 focus:border-pink-500 focus:ring-pink-200'
              }`}
              placeholder="e.g., SKU-001"
            />
            {errors.sku && <p className="text-red-500 text-sm mt-1">{errors.sku}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                errors.category ? 'border-red-400 focus:border-red-500 focus:ring-red-200' : 'border-pink-200 focus:border-pink-500 focus:ring-pink-200'
              }`}
              placeholder="e.g., Electronics"
            />
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
          </div>
        </div>

        {/* Price and Stock */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Price (₹) *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              min="0"
              className={`w-full px-4 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                errors.price ? 'border-red-400 focus:border-red-500 focus:ring-red-200' : 'border-pink-200 focus:border-pink-500 focus:ring-pink-200'
              }`}
              placeholder="0.00"
            />
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Stock Quantity *</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              min="0"
              className={`w-full px-4 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                errors.stock ? 'border-red-400 focus:border-red-500 focus:ring-red-200' : 'border-pink-200 focus:border-pink-500 focus:ring-pink-200'
              }`}
              placeholder="0"
            />
            {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-2.5 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200"
            placeholder="Enter product description"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t-2 border-pink-100">
          <PrimaryButton type="submit" icon={ButtonIcons.Save} className="flex-1">
            Update Product
          </PrimaryButton>
          <SecondaryButton type="button" onClick={onClose} icon={ButtonIcons.Cancel} className="flex-1">
            Cancel
          </SecondaryButton>
        </div>
      </form>
    </Modal>
  );
};

// View Product Modal - ENHANCED DESIGN
export const ViewProductModal = ({ isOpen, onClose, product }) => {
  if (!product) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Product Details" size="md">
      <div className="space-y-6">
        {/* Product Header Card */}
        <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-6 border-2 border-pink-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h3>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-white border-2 border-pink-300 text-pink-700 rounded-full text-sm font-semibold">
                  {product.sku}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  product.status === 'active' 
                    ? 'bg-green-100 text-green-700 border-2 border-green-300' 
                    : 'bg-gray-100 text-gray-700 border-2 border-gray-300'
                }`}>
                  <FaCheckCircle className="inline mr-1" />
                  {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {product.industries.map((industry, index) => (
                  <span key={index} className="px-3 py-1 bg-pink-500 text-white rounded-full text-sm font-medium shadow-md">
                    <FaIndustry className="inline mr-1" />
                    {industry}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Category */}
          <div className="bg-white border-2 border-pink-100 rounded-xl p-4 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                <FaLayerGroup className="text-pink-600 text-lg" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</p>
                <p className="text-lg font-bold text-gray-800">{product.category}</p>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="bg-white border-2 border-pink-100 rounded-xl p-4 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <FaRupeeSign className="text-green-600 text-lg" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Price</p>
                <p className="text-lg font-bold text-gray-800">₹{product.price.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Stock */}
          <div className="bg-white border-2 border-pink-100 rounded-xl p-4 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaCubes className="text-blue-600 text-lg" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Stock</p>
                <p className="text-lg font-bold text-gray-800">{product.stock} units</p>
              </div>
            </div>
          </div>

          {/* SKU */}
          <div className="bg-white border-2 border-pink-100 rounded-xl p-4 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <FaTag className="text-purple-600 text-lg" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">SKU</p>
                <p className="text-lg font-bold text-gray-800">{product.sku}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        {product.description && (
          <div className="bg-white border-2 border-pink-100 rounded-xl p-5 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FaAlignLeft className="text-pink-600 text-lg" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">Description</p>
                <p className="text-base text-gray-700 leading-relaxed">{product.description}</p>
              </div>
            </div>
          </div>
        )}

        {/* Close Button */}
        <div className="pt-4 border-t-2 border-pink-100">
          <SecondaryButton onClick={onClose} icon={ButtonIcons.Cancel} className="w-full">
            Close
          </SecondaryButton>
        </div>
      </div>
    </Modal>
  );
};

// Delete Confirmation Modal
export const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, productName }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Delete" size="sm">
      <div className="space-y-4">
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
          <p className="text-gray-700 text-center">
            Are you sure you want to delete <br/>
            <strong className="text-red-600 text-lg">"{productName}"</strong>?
          </p>
          <p className="text-sm text-gray-600 text-center mt-2">
            This action cannot be undone.
          </p>
        </div>
        <div className="flex gap-3 pt-2">
          <PrimaryButton
            onClick={onConfirm}
            icon={ButtonIcons.Delete}
            className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
          >
            Delete
          </PrimaryButton>
          <SecondaryButton onClick={onClose} icon={ButtonIcons.Cancel} className="flex-1">
            Cancel
          </SecondaryButton>
        </div>
      </div>
    </Modal>
  );
};
