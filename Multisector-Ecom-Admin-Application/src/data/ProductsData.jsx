import { useState } from 'react';

// ─── Industries (UI only — not in DB schema) ──────────────────────────────────
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
  'Office Supplies',
];

// ─── Validation — strictly aligned to DB schema ───────────────────────────────
export const validateProduct = (data) => {
  const errors = {};

  // ── name — varchar(191), NOT NULL ──────────────────────────────────────────
  if (!data.name || !data.name.trim()) {
    errors.name = 'Product name is required.';
  } else if (data.name.trim().length > 191) {
    errors.name = 'Product name must be 191 characters or fewer.';
  }

  // ── product_sku_key — varchar(191), NOT NULL ───────────────────────────────
  if (!data.product_sku_key || !data.product_sku_key.trim()) {
    errors.product_sku_key = 'SKU is required.';
  } else if (data.product_sku_key.trim().length > 191) {
    errors.product_sku_key = 'SKU must be 191 characters or fewer.';
  } else if (!/^[A-Za-z0-9\-_]+$/.test(data.product_sku_key.trim())) {
    errors.product_sku_key = 'SKU can only contain letters, numbers, hyphens, and underscores.';
  }

  // ── price — double, NOT NULL ───────────────────────────────────────────────
  if (data.price === '' || data.price === null || data.price === undefined) {
    errors.price = 'Price is required.';
  } else if (isNaN(Number(data.price))) {
    errors.price = 'Price must be a valid number.';
  } else if (Number(data.price) < 0) {
    errors.price = 'Price must be a non-negative number.';
  }

  // ── quantity — int(11), NOT NULL, default 0 ────────────────────────────────
  if (data.quantity === '' || data.quantity === null || data.quantity === undefined) {
    errors.quantity = 'Quantity is required.';
  } else if (!Number.isInteger(Number(data.quantity))) {
    errors.quantity = 'Quantity must be a whole number.';
  } else if (Number(data.quantity) < 0) {
    errors.quantity = 'Quantity must be a non-negative whole number.';
  }

  // ── description — varchar(191), nullable ───────────────────────────────────
  // Only validate length if provided — it is nullable in DB
  if (data.description && data.description.trim().length > 191) {
    errors.description = 'Description must be 191 characters or fewer.';
  }

  // ── images — longtext, nullable ────────────────────────────────────────────
  // No length validation needed — longtext supports up to 4GB
  // Stored as JSON stringified array — no field-level validation required

  // ── specifications — longtext, nullable ────────────────────────────────────
  // No length validation needed — longtext supports up to 4GB

  // ── averageRating — double, nullable, default 0 ────────────────────────────
  // Read-only computed field — never validated on input

  // ── isActive — tinyint(1), NOT NULL, default 1 ─────────────────────────────
  // Boolean toggle — always has a value, no validation needed

  // ── hasVariants — tinyint(1), NOT NULL, default 0 ──────────────────────────
  // Boolean toggle — always has a value, no validation needed

  // ── industry & category — UI only fields, not in DB ────────────────────────
  // Validate only for UI filtering purposes
  if (!data.industry) {
    errors.industry = 'Industry is required.';
  }

  return errors;
};

// ─── Initial Products (15 items) — all fields match DB schema ─────────────────
const INITIAL_PRODUCTS = [
  {
    id: 'prod-001',
    name: 'Wireless Headphones',
    description: 'Premium wireless headphones with noise cancellation',
    product_sku_key: 'WH-001',
    price: 2999,
    quantity: 150,
    isActive: true,
    hasVariants: false,
    images: null,             // longtext, nullable
    specifications: null,     // longtext, nullable
    averageRating: 0,         // double, nullable, default 0
    // UI-only fields (not in DB)
    industry: 'Electronics',
    category: 'Audio',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-002',
    name: 'Cotton T-Shirt',
    description: 'Comfortable cotton t-shirt in multiple colors',
    product_sku_key: 'TS-002',
    price: 499,
    quantity: 500,
    isActive: true,
    hasVariants: true,
    images: null,
    specifications: null,
    averageRating: 0,
    industry: 'Fashion',
    category: 'Clothing',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-003',
    name: 'Organic Green Tea',
    description: 'Premium organic green tea leaves — 100 bags',
    product_sku_key: 'GT-003',
    price: 299,
    quantity: 200,
    isActive: true,
    hasVariants: false,
    images: null,
    specifications: null,
    averageRating: 0,
    industry: 'Food & Beverage',
    category: 'Beverages',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-004',
    name: 'Smart Watch',
    description: 'Fitness tracking smart watch with heart rate monitor',
    product_sku_key: 'SW-004',
    price: 8999,
    quantity: 75,
    isActive: true,
    hasVariants: false,
    images: null,
    specifications: null,
    averageRating: 0,
    industry: 'Electronics',
    category: 'Wearables',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-005',
    name: 'Yoga Mat',
    description: 'Non-slip eco-friendly yoga mat with alignment lines',
    product_sku_key: 'YM-005',
    price: 1299,
    quantity: 300,
    isActive: true,
    hasVariants: false,
    images: null,
    specifications: null,
    averageRating: 0,
    industry: 'Sports & Outdoors',
    category: 'Fitness',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-006',
    name: 'Ceramic Coffee Mug',
    description: 'Handcrafted ceramic mug — 350ml, microwave safe',
    product_sku_key: 'CM-006',
    price: 349,
    quantity: 60,
    isActive: false,
    hasVariants: true,
    images: null,
    specifications: null,
    averageRating: 0,
    industry: 'Home & Garden',
    category: 'Kitchen',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-007',
    name: 'Bluetooth Speaker',
    description: 'Portable waterproof bluetooth speaker with 12hr battery',
    product_sku_key: 'BS-007',
    price: 1899,
    quantity: 90,
    isActive: true,
    hasVariants: false,
    images: null,
    specifications: null,
    averageRating: 0,
    industry: 'Electronics',
    category: 'Audio',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-008',
    name: 'Running Shoes',
    description: 'Lightweight breathable running shoes for all terrain',
    product_sku_key: 'RS-008',
    price: 3499,
    quantity: 180,
    isActive: true,
    hasVariants: true,
    images: null,
    specifications: null,
    averageRating: 0,
    industry: 'Sports & Outdoors',
    category: 'Footwear',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-009',
    name: 'Face Moisturizer SPF 50',
    description: 'Daily hydrating face cream with SPF 50 sun protection',
    product_sku_key: 'FM-009',
    price: 799,
    quantity: 85,
    isActive: true,
    hasVariants: false,
    images: null,
    specifications: null,
    averageRating: 0,
    industry: 'Health & Beauty',
    category: 'Skincare',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-010',
    name: 'Mechanical Keyboard',
    description: 'Compact TKL mechanical keyboard with RGB backlight',
    product_sku_key: 'MK-010',
    price: 4999,
    quantity: 40,
    isActive: true,
    hasVariants: true,
    images: null,
    specifications: null,
    averageRating: 0,
    industry: 'Electronics',
    category: 'Accessories',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-011',
    name: 'Stainless Steel Water Bottle',
    description: 'Double-wall insulated bottle — cold 24hr, hot 12hr',
    product_sku_key: 'WB-011',
    price: 699,
    quantity: 420,
    isActive: true,
    hasVariants: true,
    images: null,
    specifications: null,
    averageRating: 0,
    industry: 'Sports & Outdoors',
    category: 'Hydration',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-012',
    name: 'Leather Wallet',
    description: 'Slim genuine leather bifold wallet with RFID blocking',
    product_sku_key: 'LW-012',
    price: 1199,
    quantity: 95,
    isActive: true,
    hasVariants: false,
    images: null,
    specifications: null,
    averageRating: 0,
    industry: 'Fashion',
    category: 'Accessories',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-013',
    name: 'LED Desk Lamp',
    description: 'Eye-care LED desk lamp with adjustable brightness and color temperature',
    product_sku_key: 'DL-013',
    price: 1599,
    quantity: 55,
    isActive: true,
    hasVariants: false,
    images: null,
    specifications: null,
    averageRating: 0,
    industry: 'Office Supplies',
    category: 'Lighting',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-014',
    name: 'Car Phone Mount',
    description: 'Magnetic dashboard phone mount with universal compatibility',
    product_sku_key: 'CP-014',
    price: 449,
    quantity: 78,
    isActive: false,
    hasVariants: false,
    images: null,
    specifications: null,
    averageRating: 0,
    industry: 'Automotive',
    category: 'Car Accessories',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-015',
    name: 'LEGO City Set',
    description: '450-piece LEGO city building set for ages 6 and above',
    product_sku_key: 'LG-015',
    price: 2499,
    quantity: 30,
    isActive: true,
    hasVariants: false,
    images: null,
    specifications: null,
    averageRating: 0,
    industry: 'Toys & Games',
    category: 'Building Sets',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const useProductsData = () => {
  const [products,         setProducts]         = useState(INITIAL_PRODUCTS);
  const [filteredProducts, setFilteredProducts] = useState(INITIAL_PRODUCTS);

  // ── Add ──
  const addProduct = (product) => {
    const newProduct = {
      // DB fields
      id:             `prod-${Date.now()}`,
      name:           product.name.trim(),
      description:    product.description?.trim() || null,   // nullable
      product_sku_key: product.product_sku_key.trim(),
      price:          parseFloat(product.price),
      quantity:       parseInt(product.quantity, 10),
      isActive:       product.isActive       ?? true,         // default 1
      hasVariants:    product.hasVariants    ?? false,        // default 0
      images:         product.images         ?? null,         // longtext, nullable
      specifications: product.specifications ?? null,         // longtext, nullable
      averageRating:  0,                                      // default 0, read-only
      createdAt:      new Date().toISOString(),
      updatedAt:      new Date().toISOString(),
      // UI-only fields
      industry:       product.industry || '',
      category:       product.category || '',
    };
    const updated = [newProduct, ...products];
    setProducts(updated);
    setFilteredProducts(updated);
    return newProduct;
  };

  // ── Update ──
  const updateProduct = (id, updatedData) => {
    const updated = products.map(p =>
      p.id === id
        ? {
            ...p,
            // DB fields — only update what's editable
            name:           updatedData.name.trim(),
            description:    updatedData.description?.trim() || null,
            product_sku_key: updatedData.product_sku_key.trim(),
            price:          parseFloat(updatedData.price),
            quantity:       parseInt(updatedData.quantity, 10),
            isActive:       updatedData.isActive       ?? p.isActive,
            hasVariants:    updatedData.hasVariants    ?? p.hasVariants,
            images:         updatedData.images         ?? p.images,
            specifications: updatedData.specifications ?? p.specifications,
            // averageRating — NOT editable, keep existing value
            updatedAt:      new Date().toISOString(),
            // UI-only
            industry:       updatedData.industry || p.industry,
            category:       updatedData.category || p.category,
          }
        : p
    );
    setProducts(updated);
    setFilteredProducts(updated);
  };

  // ── Delete ──
  const deleteProduct = (id) => {
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    setFilteredProducts(updated);
  };

  // ── Get by ID ──
  const getProductById = (id) => products.find(p => p.id === id) ?? null;

  // ── Filter ──
  const filterProducts = (filters) => {
    let result = [...products];

    if (filters.search?.trim()) {
      const q = filters.search.trim().toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.product_sku_key.toLowerCase().includes(q) ||
        (p.category && p.category.toLowerCase().includes(q))
      );
    }

    if (filters.industry && filters.industry !== 'all') {
      result = result.filter(p => p.industry === filters.industry);
    }

    if (filters.status && filters.status !== 'all') {
      const isActive = filters.status === 'active';
      result = result.filter(p => p.isActive === isActive);
    }

    if (filters.minPrice !== '' && !isNaN(Number(filters.minPrice))) {
      result = result.filter(p => p.price >= parseFloat(filters.minPrice));
    }

    if (filters.maxPrice !== '' && !isNaN(Number(filters.maxPrice))) {
      result = result.filter(p => p.price <= parseFloat(filters.maxPrice));
    }

    setFilteredProducts(result);
  };

  // ── Clear ──
  const clearFilters = () => setFilteredProducts(products);

  return {
    products:       filteredProducts,
    allProducts:    products,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    filterProducts,
    clearFilters,
  };
};
