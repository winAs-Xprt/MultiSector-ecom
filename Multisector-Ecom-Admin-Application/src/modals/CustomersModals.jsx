// src/modals/CustomersModals.jsx
import { useState, useEffect } from 'react';
import {
  FaTimes, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt,
  FaGlobe, FaUserTag, FaCopy, FaCheckCircle, FaBan,
  FaExclamationTriangle, FaShoppingBag, FaRupeeSign,
  FaCalendarAlt, FaAlignLeft,
} from 'react-icons/fa';
import { CUSTOMER_STATUSES, CUSTOMER_SEGMENTS, SITE_LIST } from '../data/CustomersData';

// ─── Segment / Status style maps ─────────────────────────────────────────────
const SEGMENT_STYLE = {
  VIP:       { bg: '#fefce8', color: '#a16207' },
  Premium:   { bg: '#f5f3ff', color: '#7c3aed' },
  Regular:   { bg: '#eff6ff', color: '#2563eb' },
  New:       { bg: '#f0fdf4', color: '#16a34a' },
  'At Risk': { bg: '#fff7ed', color: '#ea580c' },
  Churned:   { bg: '#f3f4f6', color: '#6b7280' },
};

const STATUS_STYLE = {
  active:   { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
  inactive: { bg: '#f3f4f6', color: '#9ca3af', border: '#e5e7eb' },
  blocked:  { bg: '#fef2f2', color: '#ef4444', border: '#fecaca' },
};

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
        <style>{`@keyframes modalIn { from { opacity:0; transform:scale(0.97) translateY(6px); } to { opacity:1; transform:scale(1) translateY(0); } }`}</style>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px 18px', borderBottom: '1px solid #f5f5f5', flexShrink: 0 }}>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', letterSpacing: '-0.2px', margin: 0 }}>{title}</h2>
            {subtitle && <p style={{ fontSize: '12.5px', color: '#9ca3af', marginTop: '3px', fontWeight: 500 }}>{subtitle}</p>}
          </div>
          <button onClick={onClose}
            style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1.5px solid #f0f0f0', background: '#fafafa', color: '#9ca3af', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', flexShrink: 0 }}
            onMouseEnter={e => { e.currentTarget.style.background = '#fdf2f8'; e.currentTarget.style.color = '#ec4899'; e.currentTarget.style.borderColor = '#fce7f3'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fafafa'; e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.borderColor = '#f0f0f0'; }}>
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

// ─── Field ────────────────────────────────────────────────────────────────────
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

// ─── Modal Footer ─────────────────────────────────────────────────────────────
const ModalFooter = ({ onClose, submitLabel, danger = false }) => (
  <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', paddingTop: '10px', borderTop: '1px solid #f5f5f5', marginTop: '4px' }}>
    <button type="button" onClick={onClose}
      style={{ padding: '10px 20px', fontSize: '13.5px', fontWeight: 600, color: '#6b7280', background: '#fafafa', border: '1.5px solid #f0f0f0', borderRadius: '10px', cursor: 'pointer', fontFamily: 'inherit' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = '#ec4899'; e.currentTarget.style.color = '#ec4899'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = '#f0f0f0'; e.currentTarget.style.color = '#6b7280'; }}>
      Cancel
    </button>
    <button type="submit"
      style={{ padding: '10px 24px', fontSize: '13.5px', fontWeight: 700, color: '#fff', background: danger ? 'linear-gradient(135deg,#ef4444,#dc2626)' : 'linear-gradient(135deg,#ec4899,#db2777)', border: 'none', borderRadius: '10px', cursor: 'pointer', fontFamily: 'inherit', boxShadow: danger ? '0 3px 12px rgba(239,68,68,0.28)' : '0 3px 12px rgba(236,72,153,0.28)' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}>
      {submitLabel}
    </button>
  </div>
);

// ─── Status Toggle ────────────────────────────────────────────────────────────
const StatusToggle = ({ value, onChange }) => (
  <div style={{ display: 'flex', gap: '8px' }}>
    {['active', 'inactive', 'blocked'].map(v => {
      const active = value === v;
      const styles = {
        active:   { activeBg: '#ec4899', activeColor: '#fff', label: '✓ Active' },
        inactive: { activeBg: '#9ca3af', activeColor: '#fff', label: '— Inactive' },
        blocked:  { activeBg: '#ef4444', activeColor: '#fff', label: '✕ Blocked' },
      };
      const s = styles[v];
      return (
        <button key={v} type="button" onClick={() => onChange(v)}
          style={{ flex: 1, padding: '9px 0', fontSize: '12.5px', fontWeight: 600, borderRadius: '9px', border: `1.5px solid ${active ? s.activeBg : '#f0f0f0'}`, background: active ? s.activeBg : '#fafafa', color: active ? s.activeColor : '#9ca3af', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.18s' }}
          onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = s.activeBg; e.currentTarget.style.color = s.activeBg; } }}
          onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = '#f0f0f0'; e.currentTarget.style.color = '#9ca3af'; } }}>
          {s.label}
        </button>
      );
    })}
  </div>
);

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

// ─── Shared Form Fields ───────────────────────────────────────────────────────
const CustomerFormFields = ({ form, errors, set }) => (
  <>
    {/* ── Personal Info ── */}
    <div>
      <SectionLabel text="Personal Information" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <Field label="Full Name" required error={errors.name} icon={<FaUser />}>
          <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Arjun Sharma"
            style={inputStyle(!!errors.name)} onFocus={onFocus} onBlur={e => onBlur(e, !!errors.name)} />
        </Field>
        <Field label="Phone Number" required error={errors.phone} icon={<FaPhone />}>
          <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+91 98400 00000"
            style={inputStyle(!!errors.phone)} onFocus={onFocus} onBlur={e => onBlur(e, !!errors.phone)} />
        </Field>
        <Field label="Email Address" required error={errors.email} icon={<FaEnvelope />}>
          <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="customer@email.com"
            style={inputStyle(!!errors.email)} onFocus={onFocus} onBlur={e => onBlur(e, !!errors.email)} />
        </Field>
        <Field label="Location" required error={errors.location} icon={<FaMapMarkerAlt />}>
          <input value={form.location} onChange={e => set('location', e.target.value)} placeholder="City, State"
            style={inputStyle(!!errors.location)} onFocus={onFocus} onBlur={e => onBlur(e, !!errors.location)} />
        </Field>
      </div>
    </div>

    {/* ── Classification ── */}
    <div>
      <SectionLabel text="Classification" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <Field label="Associated Site" required error={errors.site} icon={<FaGlobe />}>
          <select value={form.site} onChange={e => set('site', e.target.value)}
            style={{ ...inputStyle(!!errors.site), cursor: 'pointer' }}
            onFocus={onFocus} onBlur={e => onBlur(e, !!errors.site)}>
            <option value="">Select a site</option>
            {SITE_LIST.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="Segment" icon={<FaUserTag />}>
          <select value={form.segment} onChange={e => set('segment', e.target.value)}
            style={{ ...inputStyle(false), cursor: 'pointer' }}
            onFocus={onFocus} onBlur={e => onBlur(e, false)}>
            {CUSTOMER_SEGMENTS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
      </div>
    </div>

    {/* ── Status ── */}
    <div>
      <SectionLabel text="Status" />
      <StatusToggle value={form.status} onChange={v => set('status', v)} />
    </div>

    {/* ── Notes ── */}
    <div>
      <SectionLabel text="Notes" />
      <Field label="Internal Notes" icon={<FaAlignLeft />}>
        <textarea value={form.notes || ''} onChange={e => set('notes', e.target.value)}
          placeholder="Any notes about this customer..." rows={3}
          style={{ ...inputStyle(false), resize: 'vertical', lineHeight: 1.55 }}
          onFocus={onFocus} onBlur={e => onBlur(e, false)} />
      </Field>
    </div>
  </>
);

// ═══════════════════════════════════════════════════════════════════════════════
// 1. CREATE CUSTOMER MODAL
// ═══════════════════════════════════════════════════════════════════════════════
export const CreateCustomerModal = ({ isOpen, onClose, onCreate }) => {
  const empty = {
    name: '', email: '', phone: '', location: '',
    site: '', segment: 'Regular', status: 'active', notes: '',
  };
  const [form,   setForm]   = useState(empty);
  const [errors, setErrors] = useState({});

  useEffect(() => { if (isOpen) { setForm(empty); setErrors({}); } }, [isOpen]);

  const set = (key, val) => {
    setForm(p => ({ ...p, [key]: val }));
    if (errors[key]) setErrors(p => ({ ...p, [key]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())                           e.name     = 'Name is required';
    if (!form.email.trim())                          e.email    = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email))      e.email    = 'Enter a valid email';
    if (!form.phone.trim())                          e.phone    = 'Phone is required';
    if (!form.location.trim())                       e.location = 'Location is required';
    if (!form.site)                                  e.site     = 'Please select a site';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) onCreate(form);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Customer" subtitle="Fill in the details to register a customer" size="lg">
      <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
        <CustomerFormFields form={form} errors={errors} set={set} />
        <ModalFooter onClose={onClose} submitLabel="Add Customer" />
      </form>
    </Modal>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 2. EDIT CUSTOMER MODAL
// ═══════════════════════════════════════════════════════════════════════════════
export const EditCustomerModal = ({ isOpen, onClose, onUpdate, customer }) => {
  const [form,   setForm]   = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen && customer) {
      setForm({
        name:     customer.name     || '',
        email:    customer.email    || '',
        phone:    customer.phone    || '',
        location: customer.location || '',
        site:     customer.site     || '',
        segment:  customer.segment  || 'Regular',
        status:   customer.status   || 'active',
        notes:    customer.notes    || '',
      });
      setErrors({});
    }
  }, [isOpen, customer]);

  const set = (key, val) => {
    setForm(p => ({ ...p, [key]: val }));
    if (errors[key]) setErrors(p => ({ ...p, [key]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.name?.trim())                          e.name     = 'Name is required';
    if (!form.email?.trim())                         e.email    = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email))      e.email    = 'Enter a valid email';
    if (!form.phone?.trim())                         e.phone    = 'Phone is required';
    if (!form.location?.trim())                      e.location = 'Location is required';
    if (!form.site)                                  e.site     = 'Please select a site';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) onUpdate(form);
  };

  if (!customer) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Customer" subtitle={`Editing: ${customer.name}`} size="lg">
      <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
        <CustomerFormFields form={form} errors={errors} set={set} />
        <ModalFooter onClose={onClose} submitLabel="Save Changes" />
      </form>
    </Modal>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 3. VIEW CUSTOMER MODAL
// ═══════════════════════════════════════════════════════════════════════════════
export const ViewCustomerModal = ({ isOpen, onClose, customer }) => {
  const [copied, setCopied] = useState('');

  useEffect(() => { setCopied(''); }, [customer]);

  if (!customer) return null;

  const copy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(''), 2000);
  };

  const seg = SEGMENT_STYLE[customer.segment] || { bg: '#f3f4f6', color: '#6b7280' };
  const sts = STATUS_STYLE[customer.status]   || STATUS_STYLE.inactive;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Customer Details" subtitle={`ID: ${customer.id}`} size="md">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>

        {/* ── Profile Header ── */}
        <div style={{ background: 'linear-gradient(135deg,#fdf2f8,#fce7f3)', borderRadius: '14px', padding: '20px', border: '1px solid #fce7f3' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'linear-gradient(135deg,#ec4899,#db2777)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 14px rgba(236,72,153,0.3)' }}>
              <span style={{ color: '#fff', fontSize: '20px', fontWeight: 800, letterSpacing: '0.5px' }}>{customer.avatar}</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#111827', margin: '0 0 4px', letterSpacing: '-0.3px' }}>{customer.name}</h3>
              <p style={{ fontSize: '13px', color: '#ec4899', fontWeight: 600, margin: '0 0 10px' }}>{customer.email}</p>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '11.5px', fontWeight: 700, padding: '3px 10px', borderRadius: '6px', border: `1px solid ${sts.border}`, background: sts.bg, color: sts.color }}>
                  {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                </span>
                <span style={{ fontSize: '11.5px', fontWeight: 700, padding: '3px 10px', borderRadius: '6px', background: seg.bg, color: seg.color }}>
                  {customer.segment}
                </span>
                <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '6px', background: '#f3f4f6', color: '#6b7280', fontFamily: 'monospace' }}>
                  {customer.id}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Stats Row ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
          {[
            { icon: <FaShoppingBag style={{ color: '#ec4899', fontSize: '13px' }} />, iconBg: '#fdf2f8', label: 'Orders',      value: customer.totalOrders },
            { icon: <FaRupeeSign   style={{ color: '#16a34a', fontSize: '13px' }} />, iconBg: '#f0fdf4', label: 'Total Spent', value: `₹${Number(customer.totalSpent).toLocaleString('en-IN')}` },
            { icon: <FaCalendarAlt style={{ color: '#2563eb', fontSize: '13px' }} />, iconBg: '#eff6ff', label: 'Last Order',  value: customer.lastOrderDate },
          ].map((s, i) => (
            <div key={i} style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '12px', padding: '14px 12px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.08)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'}>
              <div style={{ width: '32px', height: '32px', background: s.iconBg, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
                {s.icon}
              </div>
              <p style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 3px' }}>{s.label}</p>
              <p style={{ fontSize: '13.5px', fontWeight: 800, color: '#111827', margin: 0 }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* ── Details Grid ── */}
        <div>
          <SectionLabel text="Contact & Details" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>

            {/* Phone (copyable) */}
            <div style={{ background: '#fafafa', border: '1px solid #f0f0f0', borderRadius: '10px', padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '30px', height: '30px', background: '#fdf2f8', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <FaPhone style={{ color: '#ec4899', fontSize: '11px' }} />
                </div>
                <div>
                  <p style={{ fontSize: '10.5px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.4px', margin: '0 0 2px' }}>Phone</p>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: '#111827', margin: 0 }}>{customer.phone || '—'}</p>
                </div>
              </div>
              {customer.phone && (
                <button onClick={() => copy(customer.phone, 'phone')} type="button"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: copied === 'phone' ? '#16a34a' : '#d1d5db', fontSize: '13px', padding: '4px', transition: 'color 0.18s' }}
                  onMouseEnter={e => { if (copied !== 'phone') e.currentTarget.style.color = '#ec4899'; }}
                  onMouseLeave={e => { if (copied !== 'phone') e.currentTarget.style.color = '#d1d5db'; }}>
                  {copied === 'phone' ? <FaCheckCircle /> : <FaCopy />}
                </button>
              )}
            </div>

            {/* Location */}
            <div style={{ background: '#fafafa', border: '1px solid #f0f0f0', borderRadius: '10px', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '30px', height: '30px', background: '#fef2f2', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <FaMapMarkerAlt style={{ color: '#ef4444', fontSize: '11px' }} />
              </div>
              <div>
                <p style={{ fontSize: '10.5px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.4px', margin: '0 0 2px' }}>Location</p>
                <p style={{ fontSize: '13px', fontWeight: 600, color: '#111827', margin: 0 }}>{customer.location || '—'}</p>
              </div>
            </div>

            {/* Site */}
            <div style={{ background: '#fafafa', border: '1px solid #f0f0f0', borderRadius: '10px', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '30px', height: '30px', background: '#eff6ff', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <FaGlobe style={{ color: '#2563eb', fontSize: '11px' }} />
              </div>
              <div>
                <p style={{ fontSize: '10.5px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.4px', margin: '0 0 2px' }}>Site</p>
                <p style={{ fontSize: '13px', fontWeight: 600, color: '#2563eb', margin: 0 }}>{customer.site || '—'}</p>
              </div>
            </div>

            {/* Joined */}
            <div style={{ background: '#fafafa', border: '1px solid #f0f0f0', borderRadius: '10px', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '30px', height: '30px', background: '#f0fdfa', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <FaCalendarAlt style={{ color: '#0d9488', fontSize: '11px' }} />
              </div>
              <div>
                <p style={{ fontSize: '10.5px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.4px', margin: '0 0 2px' }}>Joined</p>
                <p style={{ fontSize: '13px', fontWeight: 600, color: '#111827', margin: 0 }}>{customer.joinedDate || '—'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Notes ── */}
        {customer.notes && (
          <div>
            <SectionLabel text="Notes" />
            <p style={{ fontSize: '13.5px', color: '#374151', lineHeight: 1.65, margin: 0, background: '#fafafa', padding: '12px 14px', borderRadius: '10px', border: '1px solid #f0f0f0' }}>
              {customer.notes}
            </p>
          </div>
        )}

        {/* ── Close ── */}
        <div style={{ paddingTop: '4px', borderTop: '1px solid #f5f5f5' }}>
          <button type="button" onClick={onClose}
            style={{ width: '100%', padding: '10px', fontSize: '13.5px', fontWeight: 600, color: '#6b7280', background: '#fafafa', border: '1.5px solid #f0f0f0', borderRadius: '10px', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.18s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#ec4899'; e.currentTarget.style.color = '#ec4899'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#f0f0f0'; e.currentTarget.style.color = '#6b7280'; }}>
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 4. DELETE CUSTOMER MODAL
// ═══════════════════════════════════════════════════════════════════════════════
export const DeleteCustomerModal = ({ isOpen, onClose, onConfirm, customer }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Delete Customer" size="sm">
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'center' }}>
      <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: '#fef2f2', border: '1.5px solid #fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
        <FaBan style={{ color: '#ef4444', fontSize: '20px' }} />
      </div>
      <div>
        <p style={{ fontSize: '14px', fontWeight: 600, color: '#111827', marginBottom: '6px' }}>Are you sure you want to delete</p>
        <p style={{ fontSize: '15px', fontWeight: 800, color: '#ec4899' }}>"{customer?.name}"?</p>
        <p style={{ fontSize: '12.5px', color: '#9ca3af', marginTop: '4px' }}>{customer?.email} · {customer?.site}</p>
        <p style={{ fontSize: '13px', color: '#9ca3af', marginTop: '10px' }}>
          This action cannot be undone. All customer data will be permanently removed.
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
          Yes, Delete
        </button>
      </div>
    </div>
  </Modal>
);
