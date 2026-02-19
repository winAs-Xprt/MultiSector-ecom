// src/modals/AdminModals.jsx
import { useState, useEffect } from 'react';
import {
  FaTimes, FaUserShield, FaEnvelope, FaLock, FaPhone,
  FaBuilding, FaSitemap, FaCheckCircle, FaBan, FaEye,
  FaEyeSlash, FaKey, FaUserTag, FaIdBadge, FaExclamationTriangle
} from 'react-icons/fa';
import { PrimaryButton, SecondaryButton, DangerButton, ButtonIcons } from '../components/common/Button';

// ─── Industries List ────────────────────────────────────────────────────────
export const INDUSTRIES = ['School', 'Hospital', 'Garage', 'Pharmacy', 'Restaurant', 'Others'];

// ─── Reusable Field Component ───────────────────────────────────────────────
const Field = ({ label, error, children }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
    {children}
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

// ─── Input Styles Helper ────────────────────────────────────────────────────
const inputCls = (error) =>
  `w-full px-4 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
    error
      ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
      : 'border-pink-200 focus:border-pink-500 focus:ring-pink-200'
  }`;

const selectCls = (error) =>
  `w-full px-4 py-2.5 pr-10 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 appearance-none bg-white cursor-pointer ${
    error
      ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
      : 'border-pink-200 focus:border-pink-500 focus:ring-pink-200'
  }`;

const dropdownArrow = {
  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ec4899' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
  backgroundPosition: 'right 0.5rem center',
  backgroundRepeat: 'no-repeat',
  backgroundSize: '1.5em 1.5em',
};

// ─── Modal Wrapper ──────────────────────────────────────────────────────────
const Modal = ({ isOpen, onClose, title, subtitle, children, size = 'md' }) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = { sm: 'max-w-md', md: 'max-w-2xl', lg: 'max-w-3xl' };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className={`relative bg-white rounded-2xl shadow-2xl border-2 border-pink-200 w-full ${sizes[size]} max-h-[90vh] flex flex-col z-10`}>
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b-2 border-pink-100 flex-shrink-0 bg-gradient-to-r from-pink-50 to-white rounded-t-2xl">
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-pink-700 bg-clip-text text-transparent">
                {title}
              </h2>
              {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
            </div>
            <button onClick={onClose} className="p-2 hover:bg-pink-100 rounded-lg transition-colors">
              <FaTimes className="text-xl text-gray-500" />
            </button>
          </div>
          {/* Body */}
          <div className="p-6 overflow-y-auto flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// 1. CREATE ADMIN MODAL
// ═══════════════════════════════════════════════════════════════════════════
export const CreateAdminModal = ({ isOpen, onClose, onCreate }) => {
  const emptyForm = {
    fullName: '', email: '', password: '', confirmPassword: '',
    phone: '', industry: '', siteName: '', role: 'Admin', notes: ''
  };
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors]     = useState({});
  const [showPassword, setShowPassword]        = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => { if (isOpen) { setFormData(emptyForm); setErrors({}); } }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!formData.fullName.trim())               e.fullName = 'Full name is required';
    if (!formData.email.trim())                  e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Enter a valid email address';
    if (!formData.password)                      e.password = 'Password is required';
    else if (formData.password.length < 8)       e.password = 'Minimum 8 characters';
    if (formData.confirmPassword !== formData.password) e.confirmPassword = 'Passwords do not match';
    if (!formData.industry)                      e.industry = 'Please select an industry';
    if (!formData.siteName.trim())               e.siteName = 'Site name is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onCreate({
        ...formData,
        id: `ADM-${Date.now()}`,
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0]
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Admin" subtitle="Fill in the details to create an admin account" size="lg">
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Info Banner */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <FaUserShield className="text-blue-500 text-xl flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-700 font-medium">
            Credentials (email &amp; password) will be shared with the admin after account creation.
          </p>
        </div>

        {/* Row 1 — Full Name + Role */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Full Name *" error={errors.fullName}>
            <div className="relative">
              <FaIdBadge className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-400" />
              <input
                type="text" name="fullName" value={formData.fullName}
                onChange={handleChange} placeholder="e.g., Rajesh Kumar"
                className={`${inputCls(errors.fullName)} pl-10`}
              />
            </div>
          </Field>
          <Field label="Role *" error={errors.role}>
            <div className="relative">
              <FaUserTag className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-400" />
              <select
                name="role" value={formData.role}
                onChange={handleChange}
                className={`${selectCls(errors.role)} pl-10`}
                style={dropdownArrow}
              >
                <option value="Admin">Admin</option>
                <option value="Buyer">Buyer</option>
              </select>
            </div>
          </Field>
        </div>

        {/* Row 2 — Email + Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Email Address *" error={errors.email}>
            <div className="relative">
              <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-400" />
              <input
                type="email" name="email" value={formData.email}
                onChange={handleChange} placeholder="admin@site.com"
                className={`${inputCls(errors.email)} pl-10`}
              />
            </div>
          </Field>
          <Field label="Phone Number" error={errors.phone}>
            <div className="relative">
              <FaPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-400" />
              <input
                type="tel" name="phone" value={formData.phone}
                onChange={handleChange} placeholder="+91 98765 43210"
                className={`${inputCls(errors.phone)} pl-10`}
              />
            </div>
          </Field>
        </div>

        {/* Row 3 — Password + Confirm Password */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Password *" error={errors.password}>
            <div className="relative">
              <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password" value={formData.password}
                onChange={handleChange} placeholder="Min. 8 characters"
                className={`${inputCls(errors.password)} pl-10 pr-10`}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-500">
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </Field>
          <Field label="Confirm Password *" error={errors.confirmPassword}>
            <div className="relative">
              <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-400" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword" value={formData.confirmPassword}
                onChange={handleChange} placeholder="Re-enter password"
                className={`${inputCls(errors.confirmPassword)} pl-10 pr-10`}
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-500">
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </Field>
        </div>

        {/* Row 4 — Industry + Site Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Industry *" error={errors.industry}>
            <div className="relative">
              <FaBuilding className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-400" />
              <select
                name="industry" value={formData.industry}
                onChange={handleChange}
                className={`${selectCls(errors.industry)} pl-10`}
                style={dropdownArrow}
              >
                <option value="">Select Industry</option>
                {INDUSTRIES.map(ind => <option key={ind} value={ind}>{ind}</option>)}
              </select>
            </div>
          </Field>
          <Field label="Assigned Site *" error={errors.siteName}>
            <div className="relative">
              <FaSitemap className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-400" />
              <input
                type="text" name="siteName" value={formData.siteName}
                onChange={handleChange} placeholder="e.g., ABC School"
                className={`${inputCls(errors.siteName)} pl-10`}
              />
            </div>
          </Field>
        </div>

        {/* Notes */}
        <Field label="Notes (Optional)" error={errors.notes}>
          <textarea
            name="notes" value={formData.notes}
            onChange={handleChange} rows="2"
            placeholder="Any additional information about this admin..."
            className="w-full px-4 py-2.5 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200 resize-none"
          />
        </Field>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t-2 border-pink-100">
          <PrimaryButton type="submit" icon={ButtonIcons.Save} className="flex-1">Create Admin</PrimaryButton>
          <SecondaryButton type="button" onClick={onClose} icon={ButtonIcons.Cancel} className="flex-1">Cancel</SecondaryButton>
        </div>
      </form>
    </Modal>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// 2. EDIT ADMIN MODAL
// ═══════════════════════════════════════════════════════════════════════════
export const EditAdminModal = ({ isOpen, onClose, onUpdate, admin }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors]     = useState({});

  useEffect(() => {
    if (admin && isOpen) {
      setFormData({ ...admin, password: '', confirmPassword: '' });
      setErrors({});
    }
  }, [admin, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!formData.fullName?.trim())              e.fullName = 'Full name is required';
    if (!formData.email?.trim())                 e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Enter a valid email';
    if (!formData.industry)                      e.industry = 'Please select an industry';
    if (!formData.siteName?.trim())              e.siteName = 'Site name is required';
    if (formData.password && formData.password.length < 8) e.password = 'Minimum 8 characters';
    if (formData.password && formData.confirmPassword !== formData.password) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const { confirmPassword, ...rest } = formData;
      onUpdate({ ...rest, ...(rest.password ? {} : { password: admin.password }) });
    }
  };

  if (!admin) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Admin Details" subtitle={`Editing: ${admin.fullName}`} size="lg">
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Full Name *" error={errors.fullName}>
            <div className="relative">
              <FaIdBadge className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-400" />
              <input type="text" name="fullName" value={formData.fullName || ''} onChange={handleChange}
                placeholder="Full Name" className={`${inputCls(errors.fullName)} pl-10`} />
            </div>
          </Field>
          <Field label="Role *">
            <div className="relative">
              <FaUserTag className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-400" />
              <select name="role" value={formData.role || 'Admin'} onChange={handleChange}
                className={`${selectCls()} pl-10`} style={dropdownArrow}>
                <option value="Admin">Admin</option>
                <option value="Buyer">Buyer</option>
              </select>
            </div>
          </Field>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Email Address *" error={errors.email}>
            <div className="relative">
              <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-400" />
              <input type="email" name="email" value={formData.email || ''} onChange={handleChange}
                placeholder="Email" className={`${inputCls(errors.email)} pl-10`} />
            </div>
          </Field>
          <Field label="Phone Number">
            <div className="relative">
              <FaPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-400" />
              <input type="tel" name="phone" value={formData.phone || ''} onChange={handleChange}
                placeholder="+91 98765 43210" className={`${inputCls()} pl-10`} />
            </div>
          </Field>
        </div>

        {/* Password Reset Section */}
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
          <p className="text-sm font-semibold text-yellow-800 mb-3 flex items-center gap-2">
            <FaKey className="text-yellow-600" /> Reset Password (leave blank to keep current)
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="New Password" error={errors.password}>
              <input type="password" name="password" value={formData.password || ''} onChange={handleChange}
                placeholder="Min. 8 characters" className={inputCls(errors.password)} />
            </Field>
            <Field label="Confirm New Password" error={errors.confirmPassword}>
              <input type="password" name="confirmPassword" value={formData.confirmPassword || ''} onChange={handleChange}
                placeholder="Re-enter password" className={inputCls(errors.confirmPassword)} />
            </Field>
          </div>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Industry *" error={errors.industry}>
            <div className="relative">
              <FaBuilding className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-400" />
              <select name="industry" value={formData.industry || ''} onChange={handleChange}
                className={`${selectCls(errors.industry)} pl-10`} style={dropdownArrow}>
                <option value="">Select Industry</option>
                {INDUSTRIES.map(ind => <option key={ind} value={ind}>{ind}</option>)}
              </select>
            </div>
          </Field>
          <Field label="Assigned Site *" error={errors.siteName}>
            <div className="relative">
              <FaSitemap className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-400" />
              <input type="text" name="siteName" value={formData.siteName || ''} onChange={handleChange}
                placeholder="e.g., ABC School" className={`${inputCls(errors.siteName)} pl-10`} />
            </div>
          </Field>
        </div>

        <Field label="Notes">
          <textarea name="notes" value={formData.notes || ''} onChange={handleChange} rows="2"
            placeholder="Additional notes..."
            className="w-full px-4 py-2.5 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200 resize-none" />
        </Field>

        <div className="flex gap-3 pt-4 border-t-2 border-pink-100">
          <PrimaryButton type="submit" icon={ButtonIcons.Save} className="flex-1">Update Admin</PrimaryButton>
          <SecondaryButton type="button" onClick={onClose} icon={ButtonIcons.Cancel} className="flex-1">Cancel</SecondaryButton>
        </div>
      </form>
    </Modal>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// 3. VIEW ADMIN MODAL
// ═══════════════════════════════════════════════════════════════════════════
export const ViewAdminModal = ({ isOpen, onClose, admin }) => {
  if (!admin) return null;

  const DetailCard = ({ icon, iconBg, label, value }) => (
    <div className="bg-white border-2 border-pink-100 rounded-xl p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 ${iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
          {icon}
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
          <p className="text-sm font-bold text-gray-800 mt-0.5">{value || '—'}</p>
        </div>
      </div>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Admin Details" subtitle="Full account information" size="md">
      <div className="space-y-5">

        {/* Profile Header */}
        <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-5 border-2 border-pink-200">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
              <FaUserShield className="text-white text-2xl" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800">{admin.fullName}</h3>
              <p className="text-sm text-gray-600 mt-0.5">{admin.email}</p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border-2 ${
                  admin.status === 'active'
                    ? 'bg-green-100 text-green-700 border-green-300'
                    : 'bg-red-100 text-red-700 border-red-300'
                }`}>
                  {admin.status === 'active' ? <FaCheckCircle /> : <FaBan />}
                  {admin.status === 'active' ? 'Active' : 'Inactive'}
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-pink-100 text-pink-700 border-2 border-pink-300">
                  <FaUserTag className="text-xs" /> {admin.role}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-gray-100 text-gray-700 border-2 border-gray-300">
                  {admin.id}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3">
          <DetailCard
            icon={<FaPhone className="text-pink-600 text-base" />}
            iconBg="bg-pink-100" label="Phone" value={admin.phone} />
          <DetailCard
            icon={<FaBuilding className="text-blue-600 text-base" />}
            iconBg="bg-blue-100" label="Industry" value={admin.industry} />
          <DetailCard
            icon={<FaSitemap className="text-green-600 text-base" />}
            iconBg="bg-green-100" label="Assigned Site" value={admin.siteName} />
          <DetailCard
            icon={<FaIdBadge className="text-purple-600 text-base" />}
            iconBg="bg-purple-100" label="Created On" value={admin.createdAt} />
        </div>

        {/* Notes */}
        {admin.notes && (
          <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Notes</p>
            <p className="text-sm text-gray-700 leading-relaxed">{admin.notes}</p>
          </div>
        )}

        <div className="pt-4 border-t-2 border-pink-100">
          <SecondaryButton onClick={onClose} icon={ButtonIcons.Cancel} className="w-full">Close</SecondaryButton>
        </div>
      </div>
    </Modal>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// 4. TOGGLE ACCESS MODAL (Activate / Deactivate)
// ═══════════════════════════════════════════════════════════════════════════
export const ToggleAccessModal = ({ isOpen, onClose, onConfirm, admin }) => {
  const [reason, setReason] = useState('');
  const isActivating = admin?.status === 'inactive';

  useEffect(() => { if (isOpen) setReason(''); }, [isOpen]);

  if (!admin) return null;

  return (
    <Modal
      isOpen={isOpen} onClose={onClose}
      title={isActivating ? 'Activate Admin Access' : 'Deactivate Admin Access'}
      size="sm"
    >
      <div className="space-y-4">
        {/* Warning Banner */}
        <div className={`border-2 rounded-xl p-4 flex items-start gap-3 ${
          isActivating
            ? 'bg-green-50 border-green-200'
            : 'bg-orange-50 border-orange-200'
        }`}>
          {isActivating
            ? <FaCheckCircle className="text-green-500 text-xl flex-shrink-0 mt-0.5" />
            : <FaExclamationTriangle className="text-orange-500 text-xl flex-shrink-0 mt-0.5" />
          }
          <div>
            <p className={`text-sm font-bold ${isActivating ? 'text-green-800' : 'text-orange-800'}`}>
              {isActivating ? 'Restore full access for:' : 'Revoke access for:'}
            </p>
            <p className="text-base font-bold text-gray-800 mt-1">{admin.fullName}</p>
            <p className="text-xs text-gray-600">{admin.email} · {admin.siteName}</p>
          </div>
        </div>

        {/* Reason */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Reason {!isActivating && '*'}
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows="3"
            placeholder={isActivating ? 'Optional reason for re-activation...' : 'Reason for deactivation (required)...'}
            className="w-full px-4 py-2.5 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200 resize-none"
          />
          {!isActivating && !reason.trim() && (
            <p className="text-xs text-orange-500 mt-1">Please provide a reason for deactivation.</p>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          {isActivating ? (
            <PrimaryButton onClick={() => onConfirm(reason)} icon={<FaCheckCircle />} className="flex-1">
              Activate Access
            </PrimaryButton>
          ) : (
            <DangerButton
              onClick={() => { if (reason.trim()) onConfirm(reason); }}
              icon={<FaBan />} className="flex-1"
              disabled={!reason.trim()}
            >
              Deactivate Access
            </DangerButton>
          )}
          <SecondaryButton onClick={onClose} icon={ButtonIcons.Cancel} className="flex-1">Cancel</SecondaryButton>
        </div>
      </div>
    </Modal>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// 5. RESET PASSWORD MODAL
// ═══════════════════════════════════════════════════════════════════════════
export const ResetPasswordModal = ({ isOpen, onClose, onReset, admin }) => {
  const [formData, setFormData] = useState({ newPassword: '', confirmPassword: '' });
  const [errors, setErrors]     = useState({});
  const [showNew, setShowNew]   = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => { if (isOpen) { setFormData({ newPassword: '', confirmPassword: '' }); setErrors({}); } }, [isOpen]);

  const validate = () => {
    const e = {};
    if (!formData.newPassword)                e.newPassword = 'New password is required';
    else if (formData.newPassword.length < 8) e.newPassword = 'Minimum 8 characters';
    if (formData.confirmPassword !== formData.newPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) onReset(formData.newPassword);
  };

  if (!admin) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Reset Password" subtitle={`For: ${admin.fullName}`} size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 flex items-center gap-3">
          <FaKey className="text-yellow-600 text-xl flex-shrink-0" />
          <div>
            <p className="text-sm font-bold text-yellow-800">{admin.fullName}</p>
            <p className="text-xs text-yellow-700">{admin.email}</p>
          </div>
        </div>

        <Field label="New Password *" error={errors.newPassword}>
          <div className="relative">
            <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-400" />
            <input
              type={showNew ? 'text' : 'password'}
              value={formData.newPassword}
              onChange={(e) => setFormData(p => ({ ...p, newPassword: e.target.value }))}
              placeholder="Min. 8 characters"
              className={`${inputCls(errors.newPassword)} pl-10 pr-10`}
            />
            <button type="button" onClick={() => setShowNew(!showNew)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-500">
              {showNew ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </Field>

        <Field label="Confirm New Password *" error={errors.confirmPassword}>
          <div className="relative">
            <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-400" />
            <input
              type={showConfirm ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => setFormData(p => ({ ...p, confirmPassword: e.target.value }))}
              placeholder="Re-enter new password"
              className={`${inputCls(errors.confirmPassword)} pl-10 pr-10`}
            />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-500">
              {showConfirm ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </Field>

        <div className="flex gap-3 pt-4 border-t-2 border-pink-100">
          <PrimaryButton type="submit" icon={<FaKey />} className="flex-1">Reset Password</PrimaryButton>
          <SecondaryButton type="button" onClick={onClose} icon={ButtonIcons.Cancel} className="flex-1">Cancel</SecondaryButton>
        </div>
      </form>
    </Modal>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// 6. DELETE CONFIRM MODAL
// ═══════════════════════════════════════════════════════════════════════════
export const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, admin }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Admin Account" size="sm">
      <div className="space-y-4">
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-5 text-center">
          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <FaExclamationTriangle className="text-red-500 text-2xl" />
          </div>
          <p className="text-gray-700 text-sm">You are about to permanently delete</p>
          <p className="text-red-600 font-bold text-lg mt-1">"{admin?.fullName}"</p>
          <p className="text-gray-500 text-xs mt-1">{admin?.email} · {admin?.siteName}</p>
          <p className="text-xs text-red-500 mt-3 font-semibold">This action cannot be undone.</p>
        </div>
        <div className="flex gap-3">
          <DangerButton onClick={onConfirm} icon={ButtonIcons.Delete} className="flex-1">
            Yes, Delete
          </DangerButton>
          <SecondaryButton onClick={onClose} icon={ButtonIcons.Cancel} className="flex-1">
            Cancel
          </SecondaryButton>
        </div>
      </div>
    </Modal>
  );
};
