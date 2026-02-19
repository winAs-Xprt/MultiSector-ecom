// src/modals/SiteAdminModals.jsx
import { useState, useEffect } from 'react';
import {
  FaTimes, FaSitemap, FaBuilding, FaUser, FaEnvelope,
  FaLock, FaMapMarkerAlt, FaLink, FaAlignLeft,
  FaEye, FaEyeSlash, FaKey, FaCopy, FaCheckCircle,
  FaBan, FaExclamationTriangle, FaShare
} from 'react-icons/fa';
import { PrimaryButton, SecondaryButton, DangerButton, ButtonIcons } from '../components/common/Button';
import { SITE_INDUSTRIES } from '../data/SiteAdminData';

const inputCls = (err) =>
  `w-full px-4 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
    err ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
        : 'border-pink-200 focus:border-pink-500 focus:ring-pink-200'
  }`;

const dropdownArrow = {
  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ec4899' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
  backgroundPosition: 'right 0.5rem center',
  backgroundRepeat: 'no-repeat',
  backgroundSize: '1.5em 1.5em',
};

const Field = ({ label, error, children }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
    {children}
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

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
          <div className="flex items-center justify-between px-6 py-5 border-b-2 border-pink-100 bg-gradient-to-r from-pink-50 to-white rounded-t-2xl flex-shrink-0">
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
          <div className="p-6 overflow-y-auto flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 1. CREATE SITE MODAL
// ═══════════════════════════════════════════════════════════════════════════════
export const CreateSiteModal = ({ isOpen, onClose, onCreate }) => {
  const empty = {
    siteName: '', siteUrl: '', location: '', industry: '',
    adminName: '', adminEmail: '', adminPassword: '', description: ''
  };
  const [form, setForm]         = useState(empty);
  const [errors, setErrors]     = useState({});
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (isOpen) { setForm(empty); setErrors({}); setShowPass(false); }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const handleSiteNameChange = (e) => {
    const val = e.target.value;
    setForm(p => ({
      ...p,
      siteName: val,
      siteUrl: val.toLowerCase().replace(/\s+/g, '') + '.multiecom.in'
    }));
    if (errors.siteName) setErrors(p => ({ ...p, siteName: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.siteName.trim())    e.siteName      = 'Site name is required';
    if (!form.location.trim())    e.location      = 'Location is required';
    if (!form.industry)           e.industry      = 'Please select an industry';
    if (!form.adminName.trim())   e.adminName     = 'Admin name is required';
    if (!form.adminEmail.trim())  e.adminEmail    = 'Admin email is required';
    else if (!/\S+@\S+\.\S+/.test(form.adminEmail)) e.adminEmail = 'Enter a valid email';
    if (!form.adminPassword)      e.adminPassword = 'Password is required';
    else if (form.adminPassword.length < 8)         e.adminPassword = 'Minimum 8 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) onCreate(form);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Site"
      subtitle="Fill in the details to create a working site" size="lg">
      <form onSubmit={handleSubmit} className="space-y-5">

        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <FaSitemap className="text-blue-500 text-xl flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-700 font-medium">
            After creation, site login credentials will be shared with the assigned admin automatically.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Site Name *" error={errors.siteName}>
            <div className="relative">
              <FaSitemap className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-400" />
              <input type="text" name="siteName" value={form.siteName}
                onChange={handleSiteNameChange} placeholder="e.g., ABC School"
                className={`${inputCls(errors.siteName)} pl-10`} />
            </div>
          </Field>
          <Field label="Industry *" error={errors.industry}>
            <div className="relative">
              <FaBuilding className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-400" />
              <select name="industry" value={form.industry} onChange={handleChange}
                className={`${inputCls(errors.industry)} pl-10 appearance-none cursor-pointer`}
                style={dropdownArrow}>
                <option value="">Select Industry</option>
                {SITE_INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
          </Field>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Site URL" error={errors.siteUrl}>
            <div className="relative">
              <FaLink className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-400" />
              <input type="text" name="siteUrl" value={form.siteUrl}
                onChange={handleChange} placeholder="site.multiecom.in"
                className={`${inputCls(errors.siteUrl)} pl-10`} />
            </div>
          </Field>
          <Field label="Location *" error={errors.location}>
            <div className="relative">
              <FaMapMarkerAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-400" />
              <input type="text" name="location" value={form.location}
                onChange={handleChange} placeholder="e.g., Chennai, Tamil Nadu"
                className={`${inputCls(errors.location)} pl-10`} />
            </div>
          </Field>
        </div>

        <div className="border-t-2 border-dashed border-pink-100 pt-1">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Admin Credentials</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Admin Name *" error={errors.adminName}>
            <div className="relative">
              <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-400" />
              <input type="text" name="adminName" value={form.adminName}
                onChange={handleChange} placeholder="e.g., Rajesh Kumar"
                className={`${inputCls(errors.adminName)} pl-10`} />
            </div>
          </Field>
          <Field label="Admin Email *" error={errors.adminEmail}>
            <div className="relative">
              <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-400" />
              <input type="email" name="adminEmail" value={form.adminEmail}
                onChange={handleChange} placeholder="admin@site.com"
                className={`${inputCls(errors.adminEmail)} pl-10`} />
            </div>
          </Field>
        </div>

        <Field label="Admin Password *" error={errors.adminPassword}>
          <div className="relative">
            <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-400" />
            <input
              type={showPass ? 'text' : 'password'}
              name="adminPassword" value={form.adminPassword}
              onChange={handleChange} placeholder="Min. 8 characters"
              className={`${inputCls(errors.adminPassword)} pl-10 pr-10`}
            />
            <button type="button" onClick={() => setShowPass(!showPass)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-500">
              {showPass ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </Field>

        <Field label="Description (Optional)">
          <div className="relative">
            <FaAlignLeft className="absolute left-3.5 top-3.5 text-pink-400" />
            <textarea name="description" value={form.description}
              onChange={handleChange} rows="2"
              placeholder="Brief description of this site..."
              className={`${inputCls(false)} pl-10 resize-none`} // ← FIXED
            />
          </div>
        </Field>

        <div className="flex gap-3 pt-4 border-t-2 border-pink-100">
          <PrimaryButton type="submit" icon={ButtonIcons.Save} className="flex-1">Create Site</PrimaryButton>
          <SecondaryButton type="button" onClick={onClose} icon={ButtonIcons.Cancel} className="flex-1">Cancel</SecondaryButton>
        </div>
      </form>
    </Modal>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 2. EDIT SITE MODAL
// ═══════════════════════════════════════════════════════════════════════════════
export const EditSiteModal = ({ isOpen, onClose, onUpdate, site }) => {
  const [form, setForm]     = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (site && isOpen) { setForm({ ...site }); setErrors({}); }
  }, [site, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.siteName?.trim())   e.siteName   = 'Site name is required';
    if (!form.location?.trim())   e.location   = 'Location is required';
    if (!form.industry)           e.industry   = 'Please select an industry';
    if (!form.adminName?.trim())  e.adminName  = 'Admin name is required';
    if (!form.adminEmail?.trim()) e.adminEmail = 'Admin email is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) onUpdate(form);
  };

  if (!site) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Site"
      subtitle={`Editing: ${site.siteName}`} size="lg">
      <form onSubmit={handleSubmit} className="space-y-5">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Site Name *" error={errors.siteName}>
            <div className="relative">
              <FaSitemap className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-400" />
              <input type="text" name="siteName" value={form.siteName || ''}
                onChange={handleChange} placeholder="Site name"
                className={`${inputCls(errors.siteName)} pl-10`} />
            </div>
          </Field>
          <Field label="Industry *" error={errors.industry}>
            <div className="relative">
              <FaBuilding className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-400" />
              <select name="industry" value={form.industry || ''} onChange={handleChange}
                className={`${inputCls(errors.industry)} pl-10 appearance-none cursor-pointer`}
                style={dropdownArrow}>
                <option value="">Select Industry</option>
                {SITE_INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
          </Field>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Site URL">
            <div className="relative">
              <FaLink className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-400" />
              <input type="text" name="siteUrl" value={form.siteUrl || ''}
                onChange={handleChange} placeholder="site.multiecom.in"
                className={`${inputCls(false)} pl-10`} // ← FIXED
              />
            </div>
          </Field>
          <Field label="Location *" error={errors.location}>
            <div className="relative">
              <FaMapMarkerAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-400" />
              <input type="text" name="location" value={form.location || ''}
                onChange={handleChange} placeholder="City, State"
                className={`${inputCls(errors.location)} pl-10`} />
            </div>
          </Field>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Admin Name *" error={errors.adminName}>
            <div className="relative">
              <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-400" />
              <input type="text" name="adminName" value={form.adminName || ''}
                onChange={handleChange} placeholder="Admin name"
                className={`${inputCls(errors.adminName)} pl-10`} />
            </div>
          </Field>
          <Field label="Admin Email *" error={errors.adminEmail}>
            <div className="relative">
              <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-400" />
              <input type="email" name="adminEmail" value={form.adminEmail || ''}
                onChange={handleChange} placeholder="admin@site.com"
                className={`${inputCls(errors.adminEmail)} pl-10`} />
            </div>
          </Field>
        </div>

        <Field label="Visibility">
          <div className="flex gap-3">
            {['active', 'inactive'].map(v => (
              <button key={v} type="button"
                onClick={() => setForm(p => ({ ...p, visibility: v }))}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold border-2 transition-all duration-200 ${
                  form.visibility === v
                    ? v === 'active'
                      ? 'bg-green-500 text-white border-green-500 shadow-md'
                      : 'bg-red-500 text-white border-red-500 shadow-md'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-pink-300'
                }`}>
                {v === 'active' ? '✓ Active' : '✕ Inactive'}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Description">
          <div className="relative">
            <FaAlignLeft className="absolute left-3.5 top-3.5 text-pink-400" />
            <textarea name="description" value={form.description || ''}
              onChange={handleChange} rows="2"
              placeholder="Brief description..."
              className={`${inputCls(false)} pl-10 resize-none`} // ← FIXED
            />
          </div>
        </Field>

        <div className="flex gap-3 pt-4 border-t-2 border-pink-100">
          <PrimaryButton type="submit" icon={ButtonIcons.Save} className="flex-1">Update Site</PrimaryButton>
          <SecondaryButton type="button" onClick={onClose} icon={ButtonIcons.Cancel} className="flex-1">Cancel</SecondaryButton>
        </div>
      </form>
    </Modal>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 3. VIEW SITE MODAL
// ═══════════════════════════════════════════════════════════════════════════════
export const ViewSiteModal = ({ isOpen, onClose, site }) => {
  const [copied, setCopied] = useState('');

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(''), 2000);
  };

  if (!site) return null;

  const DetailCard = ({ icon, iconBg, label, value, copyField }) => (
    <div className="bg-white border-2 border-pink-100 rounded-xl p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 ${iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
            {icon}
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
            <p className="text-sm font-bold text-gray-800 mt-0.5">{value || '—'}</p>
          </div>
        </div>
        {copyField && (
          <button onClick={() => copyToClipboard(value, copyField)}
            className="p-1.5 rounded-lg hover:bg-pink-50 transition-colors text-gray-400 hover:text-pink-500">
            {copied === copyField
              ? <FaCheckCircle className="text-green-500 text-sm" />
              : <FaCopy className="text-sm" />
            }
          </button>
        )}
      </div>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Site Details"
      subtitle="Full site and credentials information" size="md">
      <div className="space-y-5">

        <div className="bg-gradient-to-br from-pink-50 to-pink-100 border-2 border-pink-200 rounded-xl p-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
              <FaSitemap className="text-white text-2xl" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800">{site.siteName}</h3>
              <p className="text-sm text-pink-600 font-medium mt-0.5">{site.siteUrl}</p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border-2 ${
                  site.visibility === 'active'
                    ? 'bg-green-100 text-green-700 border-green-300'
                    : 'bg-red-100 text-red-700 border-red-300'
                }`}>
                  {site.visibility === 'active' ? <FaCheckCircle /> : <FaBan />}
                  {site.visibility === 'active' ? 'Active' : 'Inactive'}
                </span>
                <span className="px-3 py-1 bg-pink-100 text-pink-700 border-2 border-pink-300 rounded-full text-xs font-semibold">
                  {site.industry}
                </span>
                <span className="px-2 py-1 bg-gray-100 text-gray-600 border border-gray-200 rounded-full text-xs font-mono">
                  {site.id}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <DetailCard icon={<FaMapMarkerAlt className="text-pink-500 text-sm" />} iconBg="bg-pink-100" label="Location" value={site.location} />
          <DetailCard icon={<FaBuilding className="text-blue-500 text-sm" />}     iconBg="bg-blue-100"  label="Industry" value={site.industry} />
        </div>

        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
          <p className="text-sm font-bold text-yellow-800 flex items-center gap-2 mb-3">
            <FaKey className="text-yellow-600" /> Admin Credentials
          </p>
          <div className="space-y-3">
            <DetailCard icon={<FaUser className="text-purple-500 text-sm" />}   iconBg="bg-purple-100" label="Admin Name"  value={site.adminName} />
            <DetailCard icon={<FaEnvelope className="text-blue-500 text-sm" />} iconBg="bg-blue-100"   label="Admin Email" value={site.adminEmail}    copyField="email" />
            <DetailCard icon={<FaLock className="text-green-500 text-sm" />}    iconBg="bg-green-100"  label="Password"    value={site.adminPassword} copyField="password" />
          </div>
        </div>

        {site.description && (
          <div className="bg-gray-50 border-2 border-gray-100 rounded-xl p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Description</p>
            <p className="text-sm text-gray-700">{site.description}</p>
          </div>
        )}

        <div className="pt-4 border-t-2 border-pink-100">
          <SecondaryButton onClick={onClose} icon={ButtonIcons.Cancel} className="w-full">Close</SecondaryButton>
        </div>
      </div>
    </Modal>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 4. SHARE CREDENTIALS MODAL
// ═══════════════════════════════════════════════════════════════════════════════
export const ShareCredentialsModal = ({ isOpen, onClose, onShare, site }) => {
  const [copied, setCopied] = useState(false);

  if (!site) return null;

  const credentialText =
    `Site: ${site.siteName}\nURL: ${site.siteUrl}\nIndustry: ${site.industry}\nLocation: ${site.location}\n\nAdmin Credentials:\nName: ${site.adminName}\nEmail: ${site.adminEmail}\nPassword: ${site.adminPassword}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(credentialText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share Credentials"
      subtitle={`For: ${site.siteName}`} size="sm">
      <div className="space-y-4">
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 flex items-start gap-3">
          <FaShare className="text-green-500 text-xl flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-green-800">Ready to share with admin</p>
            <p className="text-xs text-green-700 mt-0.5">{site.adminEmail}</p>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm">
          <div className="space-y-1.5 text-gray-100">
            <p><span className="text-pink-400">Site:</span>     {site.siteName}</p>
            <p><span className="text-pink-400">URL:</span>      {site.siteUrl}</p>
            <p><span className="text-pink-400">Industry:</span> {site.industry}</p>
            <p><span className="text-pink-400">Location:</span> {site.location}</p>
            <div className="border-t border-gray-700 pt-2 mt-2 space-y-1.5">
              <p><span className="text-yellow-400">Admin:</span>    {site.adminName}</p>
              <p><span className="text-yellow-400">Email:</span>    {site.adminEmail}</p>
              <p><span className="text-yellow-400">Password:</span> {site.adminPassword}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <PrimaryButton onClick={handleCopy} icon={copied ? <FaCheckCircle /> : <FaCopy />} className="flex-1">
            {copied ? 'Copied!' : 'Copy Credentials'}
          </PrimaryButton>
          <SecondaryButton onClick={onClose} icon={ButtonIcons.Cancel} className="flex-1">Close</SecondaryButton>
        </div>
      </div>
    </Modal>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 5. TOGGLE VISIBILITY MODAL
// ═══════════════════════════════════════════════════════════════════════════════
export const ToggleVisibilityModal = ({ isOpen, onClose, onConfirm, site }) => {
  const isActivating = site?.visibility === 'inactive';
  if (!site) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}
      title={isActivating ? 'Activate Site' : 'Deactivate Site'} size="sm">
      <div className="space-y-4">
        <div className={`border-2 rounded-xl p-4 flex items-start gap-3 ${
          isActivating ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'
        }`}>
          {isActivating
            ? <FaCheckCircle className="text-green-500 text-xl flex-shrink-0 mt-0.5" />
            : <FaExclamationTriangle className="text-orange-500 text-xl flex-shrink-0 mt-0.5" />
          }
          <div>
            <p className={`text-sm font-bold ${isActivating ? 'text-green-800' : 'text-orange-800'}`}>
              {isActivating ? 'Make this site visible to users:' : 'Hide this site from users:'}
            </p>
            <p className="text-base font-bold text-gray-800 mt-1">{site.siteName}</p>
            <p className="text-xs text-gray-500 mt-0.5">{site.industry} · {site.location}</p>
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          {isActivating ? (
            <PrimaryButton onClick={onConfirm} icon={<FaCheckCircle />} className="flex-1">Activate Site</PrimaryButton>
          ) : (
            <DangerButton onClick={onConfirm} icon={<FaBan />} className="flex-1">Deactivate Site</DangerButton>
          )}
          <SecondaryButton onClick={onClose} icon={ButtonIcons.Cancel} className="flex-1">Cancel</SecondaryButton>
        </div>
      </div>
    </Modal>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 6. DELETE SITE MODAL
// ═══════════════════════════════════════════════════════════════════════════════
export const DeleteSiteModal = ({ isOpen, onClose, onConfirm, site }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Delete Site" size="sm">
    <div className="space-y-4">
      <div className="bg-red-50 border-2 border-red-200 rounded-xl p-5 text-center">
        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <FaExclamationTriangle className="text-red-500 text-2xl" />
        </div>
        <p className="text-gray-700 text-sm">You are about to permanently delete</p>
        <p className="text-red-600 font-bold text-xl mt-1">"{site?.siteName}"</p>
        <p className="text-gray-500 text-xs mt-1">{site?.industry} · {site?.location}</p>
        <p className="text-xs text-red-500 mt-3 font-semibold">This action cannot be undone.</p>
      </div>
      <div className="flex gap-3">
        <DangerButton onClick={onConfirm} icon={ButtonIcons.Delete} className="flex-1">Yes, Delete</DangerButton>
        <SecondaryButton onClick={onClose} icon={ButtonIcons.Cancel} className="flex-1">Cancel</SecondaryButton>
      </div>
    </div>
  </Modal>
);
