import { useState } from 'react';

// Industries List
export const INDUSTRIES = [
  'Electronics',
  'Fashion',
  'Food & Beverage',
  'Home & Garden',
  'Sports & Outdoors',
  'Books & Media',
  'Toys & Games',
  'Health & Beauty',
  'Automotive',
  'Office Supplies'
];

// Dummy Products Data
const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: 'Wireless Headphones',
    industries: ['Electronics'],
    sku: 'WH-001',
    price: 2999,
    stock: 150,
    category: 'Audio',
    description: 'Premium wireless headphones with noise cancellation',
    status: 'active'
  },
  {
    id: 2,
    name: 'Cotton T-Shirt',
    industries: ['Fashion'],
    sku: 'TS-002',
    price: 499,
    stock: 500,
    category: 'Clothing',
    description: 'Comfortable cotton t-shirt in multiple colors',
    status: 'active'
  },
  {
    id: 3,
    name: 'Organic Green Tea',
    industries: ['Food & Beverage'],
    sku: 'GT-003',
    price: 299,
    stock: 200,
    category: 'Beverages',
    description: 'Premium organic green tea leaves',
    status: 'active'
  },
  {
    id: 4,
    name: 'Smart Watch',
    industries: ['Electronics'],
    sku: 'SW-004',
    price: 8999,
    stock: 75,
    category: 'Wearables',
    description: 'Fitness tracking smart watch with heart rate monitor',
    status: 'active'
  },
  {
    id: 5,
    name: 'Yoga Mat',
    industries: ['Sports & Outdoors'],
    sku: 'YM-005',
    price: 1299,
    stock: 300,
    category: 'Fitness',
    description: 'Non-slip eco-friendly yoga mat',
    status: 'active'
  },
];

// Custom Hook for Products Management
export const useProductsData = () => {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [filteredProducts, setFilteredProducts] = useState(INITIAL_PRODUCTS);

  // Add Product
  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
      status: 'active'
    };
    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);
    setFilteredProducts(updatedProducts);
    return newProduct;
  };

  // Update Product
  const updateProduct = (id, updatedData) => {
    const updatedProducts = products.map(product =>
      product.id === id ? { ...product, ...updatedData } : product
    );
    setProducts(updatedProducts);
    setFilteredProducts(updatedProducts);
  };

  // Delete Product
  const deleteProduct = (id) => {
    const updatedProducts = products.filter(product => product.id !== id);
    setProducts(updatedProducts);
    setFilteredProducts(updatedProducts);
  };

  // Get Product by ID
  const getProductById = (id) => {
    return products.find(product => product.id === id);
  };

  // Filter Products
  const filterProducts = (filters) => {
    let filtered = [...products];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.sku.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower)
      );
    }

    if (filters.industry && filters.industry !== 'all') {
      filtered = filtered.filter(product =>
        product.industries.includes(filters.industry)
      );
    }

    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(product => product.status === filters.status);
    }

    if (filters.minPrice) {
      filtered = filtered.filter(product => product.price >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(product => product.price <= parseFloat(filters.maxPrice));
    }

    setFilteredProducts(filtered);
  };

  // Clear Filters
  const clearFilters = () => {
    setFilteredProducts(products);
  };

  return {
    products: filteredProducts,
    allProducts: products,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    filterProducts,
    clearFilters
  };
};
