import { useState, useEffect, useRef, useCallback } from 'react';
import {
  FaTimes, FaBox, FaTag, FaLayerGroup, FaRupeeSign, FaCubes,
  FaIndustry, FaAlignLeft, FaExclamationTriangle, FaTrash,
  FaStar, FaImage, FaCloudUploadAlt, FaPlus, FaListAlt
} from 'react-icons/fa';
import { INDUSTRIES, validateProduct } from '../data/ProductsData';

// ─── helpers ──────────────────────────────────────────────────────────────────
const parseImages = (images) => {
  if (!images) return [];
  try {
    const parsed = typeof images === 'string' ? JSON.parse(images) : images;
    if (Array.isArray(parsed)) return parsed;
    if (typeof parsed === 'string') return [parsed];
  } catch {
    if (typeof images === 'string' && images.startsWith('http')) return [images];
  }
  return [];
};

const getSrc = (img) => (typeof img === 'string' ? img : img?.preview);

// ─── Empty form — all DB fields + UI fields ───────────────────────────────────
const emptyForm = () => ({
  // DB fields
  name:           '',
  product_sku_key: '',
  description:    '',       // varchar(191), nullable
  price:          '',       // double, NOT NULL
  quantity:       '',       // int(11), NOT NULL, default 0
  isActive:       true,     // tinyint(1), NOT NULL, default 1
  hasVariants:    false,    // tinyint(1), NOT NULL, default 0
  images:         [],       // longtext, nullable — ImageManager array
  specifications: '',       // longtext, nullable
  // UI-only fields (not in DB)
  industry:       '',
  category:       '',
});

// ─── Modal Shell ──────────────────────────────────────────────────────────────
const Modal = ({ isOpen, onClose, title, subtitle, children, size = 'md' }) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;
  const maxW = { sm: '440px', md: '640px', lg: '900px' }[size] || '640px';

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: 'fixed', inset: 0, zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', background: 'rgba(17,24,39,0.55)', backdropFilter: 'blur(5px)' }}
    >
      <div style={{ background: '#fff', width: '100%', maxWidth: maxW, maxHeight: '92vh', borderRadius: '18px', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', animation: 'modalIn 0.22s ease' }}>
        <style>{`
          @keyframes modalIn { from { opacity:0; transform:scale(0.97) translateY(6px); } to { opacity:1; transform:scale(1) translateY(0); } }
          .img-card:hover .img-overlay { opacity: 1 !important; }
        `}</style>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px 18px', borderBottom: '1px solid #f5f5f5', flexShrink: 0 }}>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', letterSpacing: '-0.2px', margin: 0 }}>{title}</h2>
            {subtitle && <p style={{ fontSize: '12.5px', color: '#9ca3af', marginTop: '3px', fontWeight: 500 }}>{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1.5px solid #f0f0f0', background: '#fafafa', color: '#9ca3af', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', flexShrink: 0 }}
            onMouseEnter={e => { e.currentTarget.style.background = '#fdf2f8'; e.currentTarget.style.color = '#ec4899'; e.currentTarget.style.borderColor = '#fce7f3'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fafafa'; e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.borderColor = '#f0f0f0'; }}
          >
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '22px 24px' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

// ─── Form Field ───────────────────────────────────────────────────────────────
const Field = ({ label, required, error, children, icon }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
    <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '5px' }}>
      {icon && <span style={{ color: '#ec4899', fontSize: '11px' }}>{icon}</span>}
      {label}
      {required && <span style={{ color: '#ef4444' }}>*</span>}
    </label>
    {children}
    {error && (
      <p style={{ fontSize: '12px', color: '#ef4444', fontWeight: 500, margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
        <FaExclamationTriangle style={{ fontSize: '10px' }} /> {error}
      </p>
    )}
  </div>
);

// ─── Input style ──────────────────────────────────────────────────────────────
const inputStyle = (err = false) => ({
  width: '100%', padding: '10px 13px', fontSize: '13.5px', fontWeight: 500,
  color: '#111827', background: err ? '#fff8f8' : '#fafafa',
  border: `1.5px solid ${err ? '#fca5a5' : '#f0f0f0'}`,
  borderRadius: '10px', outline: 'none', fontFamily: 'inherit',
  transition: 'all 0.18s', boxSizing: 'border-box',
});

const onFocus = (e) => {
  e.target.style.borderColor = '#ec4899';
  e.target.style.background  = '#fff';
  e.target.style.boxShadow   = '0 0 0 3px rgba(236,72,153,0.08)';
};
const onBlur = (e, err) => {
  e.target.style.borderColor = err ? '#fca5a5' : '#f0f0f0';
  e.target.style.background  = err ? '#fff8f8' : '#fafafa';
  e.target.style.boxShadow   = 'none';
};

// ─── Section Label ────────────────────────────────────────────────────────────
const SectionLabel = ({ text }) => (
  <p style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #f5f5f5' }}>
    {text}
  </p>
);

// ─── Toggle ───────────────────────────────────────────────────────────────────
const Toggle = ({ checked, onChange, label }) => (
  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
    <div
      onClick={() => onChange(!checked)}
      style={{ width: '44px', height: '24px', borderRadius: '12px', position: 'relative', flexShrink: 0, background: checked ? '#ec4899' : '#e5e7eb', transition: 'background 0.22s', cursor: 'pointer' }}
    >
      <div style={{ position: 'absolute', top: '3px', left: checked ? '23px' : '3px', width: '18px', height: '18px', borderRadius: '50%', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.18)', transition: 'left 0.22s' }} />
    </div>
    <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#374151' }}>{label}</span>
  </label>
);

// ─── Image Card ───────────────────────────────────────────────────────────────
const ImageCard = ({ img, isPrimary, onRemove, onSetPrimary }) => {
  const [err, setErr] = useState(false);
  const src  = getSrc(img);
  const name = typeof img === 'string' ? '' : img?.name;

  return (
    <div
      className="img-card"
      style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', border: `2px solid ${isPrimary ? '#ec4899' : '#f0f0f0'}`, background: '#fafafa', aspectRatio: '1', transition: 'border-color 0.18s' }}
    >
      {err ? (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', background: '#fdf2f8' }}>
          <FaImage style={{ color: '#f9a8d4', fontSize: '18px' }} />
        </div>
      ) : (
        <img src={src} alt={name} onError={() => setErr(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      )}

      {isPrimary && (
        <div style={{ position: 'absolute', top: '5px', left: '5px', background: '#ec4899', color: '#fff', fontSize: '9px', fontWeight: 700, padding: '2px 7px', borderRadius: '4px', letterSpacing: '0.4px', pointerEvents: 'none' }}>
          PRIMARY
        </div>
      )}

      {name && (
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent,rgba(0,0,0,0.6))', padding: '14px 6px 5px', pointerEvents: 'none' }}>
          <p style={{ fontSize: '10px', color: '#fff', fontWeight: 600, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</p>
        </div>
      )}

      {/* Hover overlay */}
      <div
        className="img-overlay"
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.48)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', opacity: 0, transition: 'opacity 0.18s' }}
      >
        {!isPrimary && (
          <button type="button" onClick={onSetPrimary} title="Set as primary"
            style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'rgba(255,255,255,0.92)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onMouseEnter={e => e.currentTarget.style.background = '#fff'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.92)'}
          >
            <FaStar style={{ color: '#ec4899', fontSize: '12px' }} />
          </button>
        )}
        <button type="button" onClick={onRemove} title="Remove"
          style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'rgba(255,255,255,0.92)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onMouseEnter={e => e.currentTarget.style.background = '#fff'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.92)'}
        >
          <FaTrash style={{ color: '#ef4444', fontSize: '12px' }} />
        </button>
      </div>
    </div>
  );
};

// ─── Image Manager ────────────────────────────────────────────────────────────
const ImageManager = ({ images = [], onChange }) => {
  const [dragOver,   setDragOver]   = useState(false);
  const [fileErrors, setFileErrors] = useState([]);
  const fileInputRef                = useRef(null);

  const MAX_IMAGES  = 8;
  const MAX_SIZE_MB = 5;
  const ALLOWED     = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

  const processFiles = useCallback((files) => {
    setFileErrors([]);
    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) { setFileErrors([`Maximum ${MAX_IMAGES} images allowed`]); return; }

    const valid  = [];
    const errors = [];

    Array.from(files).slice(0, remaining).forEach(file => {
      if (!ALLOWED.includes(file.type)) { errors.push(`"${file.name}" — unsupported format (JPG, PNG, WEBP, GIF only)`); return; }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) { errors.push(`"${file.name}" — exceeds ${MAX_SIZE_MB}MB limit`); return; }
      valid.push({ file, preview: URL.createObjectURL(file), name: file.name });
    });

    if (errors.length > 0) setFileErrors(errors);
    if (valid.length  > 0) onChange([...images, ...valid]);
  }, [images, onChange]);

  const onDragEnter = (e) => { e.preventDefault(); e.stopPropagation(); setDragOver(true); };
  const onDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setDragOver(false); };
  const onDragOver  = (e) => { e.preventDefault(); e.stopPropagation(); };
  const onDrop      = (e) => {
    e.preventDefault(); e.stopPropagation(); setDragOver(false);
    if (e.dataTransfer.files?.length > 0) processFiles(e.dataTransfer.files);
  };

  const handleFileInput = (e) => {
    if (e.target.files?.length > 0) { processFiles(e.target.files); e.target.value = ''; }
  };

  const removeImage = (idx) => {
    const removed = images[idx];
    if (removed?.preview?.startsWith('blob:')) URL.revokeObjectURL(removed.preview);
    onChange(images.filter((_, i) => i !== idx));
    setFileErrors([]);
  };

  const setPrimary = (idx) => {
    const reordered = [...images];
    const [item] = reordered.splice(idx, 1);
    reordered.unshift(item);
    onChange(reordered);
  };

  const canAddMore = images.length < MAX_IMAGES;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <input ref={fileInputRef} type="file" accept={ALLOWED.join(',')} multiple onChange={handleFileInput} style={{ display: 'none' }} />

      {/* Drop Zone */}
      {canAddMore && (
        <div
          onDragEnter={onDragEnter} onDragLeave={onDragLeave}
          onDragOver={onDragOver}   onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{ border: `2px dashed ${dragOver ? '#ec4899' : '#e5e7eb'}`, borderRadius: '12px', padding: '32px 20px', textAlign: 'center', cursor: 'pointer', background: dragOver ? '#fdf2f8' : '#fafafa', transition: 'all 0.2s', userSelect: 'none' }}
          onMouseEnter={e => { if (!dragOver) { e.currentTarget.style.borderColor = '#f9a8d4'; e.currentTarget.style.background = '#fdf9fc'; } }}
          onMouseLeave={e => { if (!dragOver) { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.background = '#fafafa'; } }}
        >
          <div style={{ width: '54px', height: '54px', borderRadius: '14px', background: dragOver ? '#fce7f3' : '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', transition: 'all 0.2s' }}>
            <FaCloudUploadAlt style={{ fontSize: '24px', color: dragOver ? '#ec4899' : '#9ca3af', transition: 'color 0.2s' }} />
          </div>
          <p style={{ fontSize: '14px', fontWeight: 700, color: dragOver ? '#ec4899' : '#374151', margin: '0 0 4px', transition: 'color 0.2s' }}>
            {dragOver ? 'Drop images here' : 'Drag & drop images here'}
          </p>
          <p style={{ fontSize: '12.5px', color: '#9ca3af', margin: '0 0 14px' }}>or click to browse from your computer</p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 18px', borderRadius: '8px', background: dragOver ? '#ec4899' : '#fff', color: dragOver ? '#fff' : '#ec4899', border: `1.5px solid ${dragOver ? '#ec4899' : '#fce7f3'}`, fontSize: '13px', fontWeight: 700, transition: 'all 0.2s' }}>
            <FaPlus style={{ fontSize: '11px' }} /> Browse Files
          </div>
          <p style={{ fontSize: '11.5px', color: '#d1d5db', marginTop: '12px', marginBottom: 0 }}>
            JPG, PNG, WEBP, GIF · Max {MAX_SIZE_MB}MB per file · Up to {MAX_IMAGES} images
          </p>
        </div>
      )}

      {/* Max reached */}
      {!canAddMore && (
        <div style={{ padding: '10px 14px', background: '#fdf2f8', borderRadius: '10px', border: '1px solid #fce7f3', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FaImage style={{ color: '#ec4899', fontSize: '13px', flexShrink: 0 }} />
          <p style={{ fontSize: '12.5px', color: '#ec4899', fontWeight: 600, margin: 0 }}>
            Maximum {MAX_IMAGES} images reached. Remove one to add more.
          </p>
        </div>
      )}

      {/* File errors */}
      {fileErrors.length > 0 && (
        <div style={{ padding: '10px 14px', background: '#fef2f2', borderRadius: '10px', border: '1px solid #fecaca' }}>
          {fileErrors.map((err, i) => (
            <p key={i} style={{ fontSize: '12px', color: '#ef4444', fontWeight: 500, margin: i === 0 ? 0 : '4px 0 0', display: 'flex', alignItems: 'flex-start', gap: '5px' }}>
              <FaExclamationTriangle style={{ fontSize: '10px', flexShrink: 0, marginTop: '2px' }} /> {err}
            </p>
          ))}
        </div>
      )}

      {/* Preview Grid */}
      {images.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <p style={{ fontSize: '12px', fontWeight: 600, color: '#9ca3af', margin: 0 }}>
              {images.length} / {MAX_IMAGES} images
              <span style={{ color: '#d1d5db' }}> · First image is primary</span>
            </p>
            {images.length > 1 && (
              <button type="button"
                onClick={() => { images.forEach(img => { if (img?.preview?.startsWith('blob:')) URL.revokeObjectURL(img.preview); }); onChange([]); }}
                style={{ fontSize: '12px', fontWeight: 600, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                Clear all
              </button>
            )}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(88px, 1fr))', gap: '10px' }}>
            {images.map((img, idx) => (
              <ImageCard
                key={idx} img={img} isPrimary={idx === 0}
                onRemove={() => removeImage(idx)}
                onSetPrimary={() => setPrimary(idx)}
              />
            ))}
            {/* Inline add more tile */}
            {canAddMore && images.length > 0 && (
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{ aspectRatio: '1', borderRadius: '10px', border: '2px dashed #e5e7eb', background: '#fafafa', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '5px', cursor: 'pointer', transition: 'all 0.18s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#ec4899'; e.currentTarget.style.background = '#fdf2f8'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.background = '#fafafa'; }}
              >
                <FaPlus style={{ color: '#d1d5db', fontSize: '16px' }} />
                <span style={{ fontSize: '10px', color: '#d1d5db', fontWeight: 600 }}>Add</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── View Row ─────────────────────────────────────────────────────────────────
const ViewRow = ({ label, value, icon }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
    <span style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '5px' }}>
      {icon && <span style={{ color: '#ec4899' }}>{icon}</span>} {label}
    </span>
    <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#111827', wordBreak: 'break-word' }}>
      {value ?? '—'}
    </span>
  </div>
);

// ─── Modal Footer ─────────────────────────────────────────────────────────────
const ModalFooter = ({ onClose, submitLabel }) => (
  <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', paddingTop: '10px', borderTop: '1px solid #f5f5f5', marginTop: '4px' }}>
    <button type="button" onClick={onClose}
      style={{ padding: '10px 20px', fontSize: '13.5px', fontWeight: 600, color: '#6b7280', background: '#fafafa', border: '1.5px solid #f0f0f0', borderRadius: '10px', cursor: 'pointer', fontFamily: 'inherit' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = '#ec4899'; e.currentTarget.style.color = '#ec4899'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = '#f0f0f0'; e.currentTarget.style.color = '#6b7280'; }}
    >
      Cancel
    </button>
    <button type="submit"
      style={{ padding: '10px 24px', fontSize: '13.5px', fontWeight: 700, color: '#fff', background: 'linear-gradient(135deg,#ec4899,#db2777)', border: 'none', borderRadius: '10px', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 3px 12px rgba(236,72,153,0.28)' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 5px 18px rgba(236,72,153,0.38)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 3px 12px rgba(236,72,153,0.28)'; }}
    >
      {submitLabel}
    </button>
  </div>
);

// ─── Shared Form Fields ───────────────────────────────────────────────────────
// Reused identically in both Create and Edit
const ProductFormFields = ({ form, errors, set }) => (
  <>
    {/* ── Basic Info ── */}
    <div>
      <SectionLabel text="Basic Information" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <Field label="Product Name" required error={errors.name} icon={<FaBox />}>
          <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Cotton T-Shirt"
            style={inputStyle(!!errors.name)} onFocus={onFocus} onBlur={e => onBlur(e, !!errors.name)} />
        </Field>
        <Field label="SKU Key" required error={errors.product_sku_key} icon={<FaTag />}>
          <input value={form.product_sku_key} onChange={e => set('product_sku_key', e.target.value.toUpperCase())} placeholder="e.g. SKU-001"
            style={inputStyle(!!errors.product_sku_key)} onFocus={onFocus} onBlur={e => onBlur(e, !!errors.product_sku_key)} />
        </Field>
        <Field label="Industry" required error={errors.industry} icon={<FaIndustry />}>
          <select value={form.industry} onChange={e => set('industry', e.target.value)}
            style={{ ...inputStyle(!!errors.industry), cursor: 'pointer' }} onFocus={onFocus} onBlur={e => onBlur(e, !!errors.industry)}>
            <option value="">Select Industry</option>
            {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
        </Field>
        <Field label="Category" icon={<FaLayerGroup />}>
          <input value={form.category} onChange={e => set('category', e.target.value)} placeholder="e.g. Apparel"
            style={inputStyle()} onFocus={onFocus} onBlur={e => onBlur(e, false)} />
        </Field>
      </div>
    </div>

    {/* ── Pricing & Stock ── */}
    <div>
      <SectionLabel text="Pricing & Stock" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <Field label="Price (₹)" required error={errors.price} icon={<FaRupeeSign />}>
          <input type="number" value={form.price} min="0" step="0.01" onChange={e => set('price', e.target.value)} placeholder="0.00"
            style={inputStyle(!!errors.price)} onFocus={onFocus} onBlur={e => onBlur(e, !!errors.price)} />
        </Field>
        <Field label="Quantity" required error={errors.quantity} icon={<FaCubes />}>
          <input type="number" value={form.quantity} min="0" onChange={e => set('quantity', e.target.value)} placeholder="0"
            style={inputStyle(!!errors.quantity)} onFocus={onFocus} onBlur={e => onBlur(e, !!errors.quantity)} />
        </Field>
      </div>
    </div>

    {/* ── Description — varchar(191), nullable ── */}
    <div>
      <SectionLabel text="Description" />
      <Field label="Product Description" error={errors.description} icon={<FaAlignLeft />}>
        <textarea value={form.description} onChange={e => set('description', e.target.value)}
          placeholder="Describe the product... (max 191 characters)" rows={3} maxLength={191}
          style={{ ...inputStyle(!!errors.description), resize: 'vertical', lineHeight: 1.55 }}
          onFocus={onFocus} onBlur={e => onBlur(e, !!errors.description)} />
        {/* Character counter */}
        <span style={{ fontSize: '11px', color: form.description?.length > 170 ? '#ef4444' : '#d1d5db', textAlign: 'right', display: 'block', marginTop: '3px' }}>
          {form.description?.length || 0} / 191
        </span>
      </Field>
    </div>

    {/* ── Specifications — longtext, nullable ── */}
    <div>
      <SectionLabel text="Specifications" />
      <Field label="Specifications (optional)" icon={<FaListAlt />}>
        <textarea value={form.specifications} onChange={e => set('specifications', e.target.value)}
          placeholder='e.g. {"color":"black","weight":"200g","dimensions":"10x5x3cm"} or plain text'
          rows={3}
          style={{ ...inputStyle(), resize: 'vertical', lineHeight: 1.55, fontFamily: 'monospace' }}
          onFocus={onFocus} onBlur={e => onBlur(e, false)} />
        <span style={{ fontSize: '11px', color: '#d1d5db', marginTop: '2px' }}>
          Stored as longtext — no character limit. JSON or plain text accepted.
        </span>
      </Field>
    </div>

    {/* ── Images — longtext, nullable ── */}
    <div>
      <SectionLabel text="Product Images" />
      <ImageManager images={form.images} onChange={imgs => set('images', imgs)} />
    </div>

    {/* ── Options — tinyint(1) toggles ── */}
    <div>
      <SectionLabel text="Options" />
      <div style={{ display: 'flex', gap: '28px', flexWrap: 'wrap' }}>
        <Toggle checked={form.hasVariants} onChange={v => set('hasVariants', v)} label="Has Variants" />
        <Toggle checked={form.isActive}    onChange={v => set('isActive', v)}    label="Active" />
      </div>
    </div>
  </>
);

// ─── CREATE Modal ─────────────────────────────────────────────────────────────
export const CreateProductModal = ({ isOpen, onClose, onCreate }) => {
  const [form,   setForm]   = useState(emptyForm());
  const [errors, setErrors] = useState({});

  useEffect(() => { if (isOpen) { setForm(emptyForm()); setErrors({}); } }, [isOpen]);

  const set = (name, value) => {
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validateProduct(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    onCreate({
      ...form,
      description:    form.description?.trim()    || null,
      specifications: form.specifications?.trim() || null,
      // Serialize image array → JSON string for DB (longtext)
      // In production: replace preview blob URLs with API-returned URLs first
      images: form.images.length > 0
        ? JSON.stringify(form.images.map(img => (typeof img === 'string' ? img : img.preview)))
        : null,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Product" subtitle="Fill in the details to create a product" size="lg">
      <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
        <ProductFormFields form={form} errors={errors} set={set} />
        <ModalFooter onClose={onClose} submitLabel="Create Product" />
      </form>
    </Modal>
  );
};

// ─── EDIT Modal ───────────────────────────────────────────────────────────────
export const EditProductModal = ({ isOpen, onClose, onUpdate, product }) => {
  const [form,   setForm]   = useState(emptyForm());
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen && product) {
      setForm({
        // DB fields
        name:            product.name             || '',
        product_sku_key: product.product_sku_key  || '',
        description:     product.description      || '',
        price:           product.price            || '',
        quantity:        product.quantity         ?? '',
        isActive:        product.isActive         ?? true,
        hasVariants:     product.hasVariants      ?? false,
        specifications:  product.specifications   || '',
        // Parse existing images JSON string → array for ImageManager
        images:          parseImages(product.images),
        // UI-only fields
        industry:        product.industry         || '',
        category:        product.category         || '',
      });
      setErrors({});
    }
  }, [isOpen, product]);

  const set = (name, value) => {
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validateProduct(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    onUpdate({
      ...form,
      description:    form.description?.trim()    || null,
      specifications: form.specifications?.trim() || null,
      images: form.images.length > 0
        ? JSON.stringify(form.images.map(img => (typeof img === 'string' ? img : img.preview)))
        : null,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Product" subtitle={product?.name} size="lg">
      <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
        <ProductFormFields form={form} errors={errors} set={set} />
        <ModalFooter onClose={onClose} submitLabel="Save Changes" />
      </form>
    </Modal>
  );
};

// ─── VIEW Modal ───────────────────────────────────────────────────────────────
export const ViewProductModal = ({ isOpen, onClose, product }) => {
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => { setActiveImg(0); }, [product]);

  if (!product) return null;

  const images = parseImages(product.images);

  // Try to parse specifications as JSON for pretty display
  const renderSpecifications = () => {
    if (!product.specifications) return null;
    try {
      const parsed = JSON.parse(product.specifications);
      return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '8px' }}>
          {Object.entries(parsed).map(([key, val]) => (
            <div key={key} style={{ background: '#fafafa', borderRadius: '8px', padding: '8px 10px', border: '1px solid #f0f0f0' }}>
              <p style={{ fontSize: '10.5px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.4px', margin: '0 0 3px' }}>{key}</p>
              <p style={{ fontSize: '13px', fontWeight: 600, color: '#111827', margin: 0 }}>{String(val)}</p>
            </div>
          ))}
        </div>
      );
    } catch {
      // Not JSON — render as plain text
      return <p style={{ fontSize: '13.5px', color: '#374151', lineHeight: 1.65, margin: 0 }}>{product.specifications}</p>;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Product Details" subtitle={`SKU: ${product.product_sku_key}`} size="lg">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>

        {/* ── Images gallery ── */}
        {images.length > 0 && (
          <div>
            <SectionLabel text="Images" />
            <div style={{ width: '100%', height: '220px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #f0f0f0', background: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
              <img src={images[activeImg]} alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                onError={e => { e.target.style.display = 'none'; }} />
            </div>
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {images.map((url, idx) => (
                  <div key={idx} onClick={() => setActiveImg(idx)}
                    style={{ width: '54px', height: '54px', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', border: `2px solid ${idx === activeImg ? '#ec4899' : '#f0f0f0'}`, transition: 'border-color 0.18s', flexShrink: 0 }}>
                    <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Product Info grid ── */}
        <div>
          <SectionLabel text="Product Information" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <ViewRow label="Product Name"  value={product.name}            icon={<FaBox />} />
            <ViewRow label="SKU"           value={product.product_sku_key} icon={<FaTag />} />
            <ViewRow label="Industry"      value={product.industry}        icon={<FaIndustry />} />
            <ViewRow label="Category"      value={product.category}        icon={<FaLayerGroup />} />
            <ViewRow label="Price"
              value={`₹${parseFloat(product.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
              icon={<FaRupeeSign />}
            />
            <ViewRow label="Quantity"
              value={
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: product.quantity < 100 ? '#ea580c' : '#111827' }}>
                  {product.quantity?.toLocaleString('en-IN')}
                  {product.quantity < 100 && <FaExclamationTriangle style={{ color: '#ea580c', fontSize: '11px' }} />}
                </span>
              }
              icon={<FaCubes />}
            />
            {/* ── FIX 1: averageRating — double, nullable, default 0 ── */}
            <ViewRow
              label="Avg Rating"
              value={
                product.averageRating > 0
                  ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#f59e0b' }}>
                      <FaStar style={{ fontSize: '12px' }} />
                      {parseFloat(product.averageRating).toFixed(1)}
                    </span>
                  )
                  : <span style={{ color: '#9ca3af', fontWeight: 500 }}>No ratings yet</span>
              }
              icon={<FaStar />}
            />
            <ViewRow label="Images count"
              value={images.length > 0 ? `${images.length} image${images.length > 1 ? 's' : ''}` : 'No images'}
              icon={<FaImage />}
            />
          </div>
        </div>

        {/* ── Description — varchar(191), nullable ── */}
        {product.description && (
          <div>
            <SectionLabel text="Description" />
            <p style={{ fontSize: '13.5px', color: '#374151', lineHeight: 1.65, margin: 0 }}>{product.description}</p>
          </div>
        )}

        {/* ── Specifications — longtext, nullable ── */}
        {product.specifications && (
          <div>
            <SectionLabel text="Specifications" />
            {renderSpecifications()}
          </div>
        )}

        {/* ── Status badges ── */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ padding: '5px 14px', borderRadius: '20px', fontSize: '12.5px', fontWeight: 600, background: product.isActive ? '#f0fdf4' : '#f3f4f6', color: product.isActive ? '#16a34a' : '#9ca3af', border: `1px solid ${product.isActive ? '#bbf7d0' : '#e5e7eb'}` }}>
            {product.isActive ? '● Active' : '● Inactive'}
          </span>
          <span style={{ padding: '5px 14px', borderRadius: '20px', fontSize: '12.5px', fontWeight: 600, background: product.hasVariants ? '#eff6ff' : '#f3f4f6', color: product.hasVariants ? '#2563eb' : '#9ca3af', border: `1px solid ${product.hasVariants ? '#bfdbfe' : '#e5e7eb'}` }}>
            {product.hasVariants ? 'Has Variants' : 'No Variants'}
          </span>
          {product.quantity < 100 && (
            <span style={{ padding: '5px 14px', borderRadius: '20px', fontSize: '12.5px', fontWeight: 600, background: '#fff7ed', color: '#ea580c', border: '1px solid #fed7aa', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <FaExclamationTriangle style={{ fontSize: '11px' }} /> Low Stock
            </span>
          )}
        </div>

      </div>
    </Modal>
  );
};

// ─── DELETE Modal ─────────────────────────────────────────────────────────────
export const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, productName }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Delete Product" size="sm">
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'center' }}>
      <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: '#fef2f2', border: '1.5px solid #fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
        <FaTrash style={{ color: '#ef4444', fontSize: '20px' }} />
      </div>
      <div>
        <p style={{ fontSize: '14px', fontWeight: 600, color: '#111827', marginBottom: '6px' }}>Are you sure you want to delete</p>
        <p style={{ fontSize: '15px', fontWeight: 800, color: '#ec4899' }}>"{productName}"?</p>
        <p style={{ fontSize: '13px', color: '#9ca3af', marginTop: '8px' }}>
          This action cannot be undone. All product data will be permanently removed.
        </p>
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button type="button" onClick={onClose}
          style={{ flex: 1, padding: '10px', fontSize: '13.5px', fontWeight: 600, color: '#6b7280', background: '#fafafa', border: '1.5px solid #f0f0f0', borderRadius: '10px', cursor: 'pointer', fontFamily: 'inherit' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#374151'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#f0f0f0'; e.currentTarget.style.color = '#6b7280'; }}>
          Cancel
        </button>
        <button type="button" onClick={onConfirm}
          style={{ flex: 1, padding: '10px', fontSize: '13.5px', fontWeight: 700, color: '#fff', background: 'linear-gradient(135deg,#ef4444,#dc2626)', border: 'none', borderRadius: '10px', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 3px 12px rgba(239,68,68,0.28)' }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 5px 18px rgba(239,68,68,0.38)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 3px 12px rgba(239,68,68,0.28)'; }}>
          Delete
        </button>
      </div>
    </div>
  </Modal>
);
