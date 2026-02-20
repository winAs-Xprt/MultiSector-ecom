// src/modals/IndustryModals.jsx
import { useState, useEffect } from 'react';
import {
  FaTimes, FaBuilding, FaAlignLeft, FaPalette,
  FaExclamationTriangle, FaCheckCircle, FaBan
} from 'react-icons/fa';
import { PrimaryButton, SecondaryButton, DangerButton, ButtonIcons } from '../components/common/Button';
import { INDUSTRY_COLORS, COLOR_MAP } from '../data/IndustryData';

// ─── Modal Wrapper ────────────────────────────────────────────────────────────
const Modal = ({ isOpen, onClose, title, subtitle, children, size = 'md' }) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-2xl' };

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

// ─── Shared Input Style ───────────────────────────────────────────────────────
const inputCls = (error) =>
  `w-full px-4 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
    error
      ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
      : 'border-pink-200 focus:border-pink-500 focus:ring-pink-200'
  }`;

// ═══════════════════════════════════════════════════════════════════════════════
// 1. CREATE INDUSTRY MODAL
// ═══════════════════════════════════════════════════════════════════════════════
export const CreateIndustryModal = ({ isOpen, onClose, onCreate }) => {
  const emptyForm = { name: '', description: '', color: 'blue' };
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors]     = useState({});

  useEffect(() => { if (isOpen) { setFormData(emptyForm); setErrors({}); } }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!formData.name.trim())        e.name = 'Industry name is required';
    if (!formData.description.trim()) e.description = 'Description is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) onCreate(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Industry" subtitle="Define a new industry category for the platform">
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Industry Name *</label>
          <div className="relative">
            <FaBuilding className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-400" />
            <input
              type="text" name="name" value={formData.name}
              onChange={handleChange} placeholder="e.g., School, Hospital, Garage"
              className={`${inputCls(errors.name)} pl-10`}
            />
          </div>
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
          <div className="relative">
            <FaAlignLeft className="absolute left-3.5 top-3.5 text-pink-400" />
            <textarea
              name="description" value={formData.description}
              onChange={handleChange} rows="3"
              placeholder="Brief description of this industry..."
              className={`${inputCls(errors.description)} pl-10 resize-none`}
            />
          </div>
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
        </div>

        {/* Color Picker */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            <FaPalette className="inline mr-2 text-pink-400" />
            Label Color
          </label>
          <div className="flex flex-wrap gap-3">
            {INDUSTRY_COLORS.map(color => (
              <button
                key={color}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, color }))}
                className={`w-10 h-10 rounded-xl ${COLOR_MAP[color].icon} transition-all duration-200 hover:scale-110 ${
                  formData.color === color
                    ? 'ring-4 ring-offset-2 ring-pink-400 scale-110 shadow-lg'
                    : 'opacity-70 hover:opacity-100'
                }`}
                title={color.charAt(0).toUpperCase() + color.slice(1)}
              />
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Selected: <span className={`font-semibold ${COLOR_MAP[formData.color].text}`}>
              {formData.color.charAt(0).toUpperCase() + formData.color.slice(1)}
            </span>
          </p>
        </div>

        {/* Preview */}
        <div className={`${COLOR_MAP[formData.color].bg} border-2 ${COLOR_MAP[formData.color].border} rounded-xl p-4`}>
          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Preview</p>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 ${COLOR_MAP[formData.color].icon} rounded-xl flex items-center justify-center`}>
              <FaBuilding className="text-white text-lg" />
            </div>
            <div>
              <p className={`font-bold text-base ${COLOR_MAP[formData.color].text}`}>
                {formData.name || 'Industry Name'}
              </p>
              <p className="text-xs text-gray-500 truncate max-w-xs">
                {formData.description || 'Description will appear here'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t-2 border-pink-100">
          <PrimaryButton type="submit" icon={ButtonIcons.Save} className="flex-1">Create Industry</PrimaryButton>
          <SecondaryButton type="button" onClick={onClose} icon={ButtonIcons.Cancel} className="flex-1">Cancel</SecondaryButton>
        </div>
      </form>
    </Modal>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 2. EDIT INDUSTRY MODAL
// ═══════════════════════════════════════════════════════════════════════════════
export const EditIndustryModal = ({ isOpen, onClose, onUpdate, industry }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors]     = useState({});

  useEffect(() => {
    if (industry && isOpen) { setFormData({ ...industry }); setErrors({}); }
  }, [industry, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!formData.name?.trim())        e.name = 'Industry name is required';
    if (!formData.description?.trim()) e.description = 'Description is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) onUpdate(formData);
  };

  if (!industry) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Industry" subtitle={`Editing: ${industry.name}`}>
      <form onSubmit={handleSubmit} className="space-y-5">

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Industry Name *</label>
          <div className="relative">
            <FaBuilding className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-400" />
            <input
              type="text" name="name" value={formData.name || ''}
              onChange={handleChange} placeholder="Industry name"
              className={`${inputCls(errors.name)} pl-10`}
            />
          </div>
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
          <div className="relative">
            <FaAlignLeft className="absolute left-3.5 top-3.5 text-pink-400" />
            <textarea
              name="description" value={formData.description || ''}
              onChange={handleChange} rows="3"
              placeholder="Industry description..."
              className={`${inputCls(errors.description)} pl-10 resize-none`}
            />
          </div>
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
        </div>

        {/* Color Picker */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            <FaPalette className="inline mr-2 text-pink-400" />
            Label Color
          </label>
          <div className="flex flex-wrap gap-3">
            {INDUSTRY_COLORS.map(color => (
              <button
                key={color} type="button"
                onClick={() => setFormData(prev => ({ ...prev, color }))}
                className={`w-10 h-10 rounded-xl ${COLOR_MAP[color].icon} transition-all duration-200 hover:scale-110 ${
                  formData.color === color
                    ? 'ring-4 ring-offset-2 ring-pink-400 scale-110 shadow-lg'
                    : 'opacity-70 hover:opacity-100'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Status Toggle */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
          <div className="flex gap-3">
            {['active', 'inactive'].map(s => (
              <button
                key={s} type="button"
                onClick={() => setFormData(prev => ({ ...prev, status: s }))}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold border-2 transition-all duration-200 ${
                  formData.status === s
                    ? s === 'active'
                      ? 'bg-green-500 text-white border-green-500 shadow-md'
                      : 'bg-red-500 text-white border-red-500 shadow-md'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-pink-300'
                }`}
              >
                {s === 'active' ? '✓ Active' : '✕ Inactive'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t-2 border-pink-100">
          <PrimaryButton type="submit" icon={ButtonIcons.Save} className="flex-1">Update Industry</PrimaryButton>
          <SecondaryButton type="button" onClick={onClose} icon={ButtonIcons.Cancel} className="flex-1">Cancel</SecondaryButton>
        </div>
      </form>
    </Modal>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 3. VIEW INDUSTRY MODAL
// ═══════════════════════════════════════════════════════════════════════════════
export const ViewIndustryModal = ({ isOpen, onClose, industry }) => {
  if (!industry) return null;
  const c = COLOR_MAP[industry.color] || COLOR_MAP.blue;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Industry Details" size="md">
      <div className="space-y-5">

        {/* Header Card */}
        <div className={`${c.bg} border-2 ${c.border} rounded-xl p-5`}>
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 ${c.icon} rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0`}>
              <FaBuilding className="text-white text-2xl" />
            </div>
            <div className="flex-1">
              <h3 className={`text-2xl font-bold ${c.text}`}>{industry.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{industry.description}</p>
              <div className="flex items-center gap-2 mt-3">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border-2 ${
                  industry.status === 'active'
                    ? 'bg-green-100 text-green-700 border-green-300'
                    : 'bg-red-100 text-red-700 border-red-300'
                }`}>
                  {industry.status === 'active' ? <FaCheckCircle /> : <FaBan />}
                  {industry.status === 'active' ? 'Active' : 'Inactive'}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-white text-gray-600 border-2 border-gray-200">
                  {industry.id}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white border-2 border-pink-100 rounded-xl p-4 text-center hover:shadow-md transition-shadow">
            <p className="text-2xl font-bold text-gray-800">{industry.sitesCount}</p>
            <p className="text-xs font-semibold text-gray-500 uppercase mt-1">Sites</p>
          </div>
          <div className="bg-white border-2 border-pink-100 rounded-xl p-4 text-center hover:shadow-md transition-shadow">
            <p className="text-2xl font-bold text-gray-800">{industry.adminsCount}</p>
            <p className="text-xs font-semibold text-gray-500 uppercase mt-1">Admins</p>
          </div>
          <div className="bg-white border-2 border-pink-100 rounded-xl p-4 text-center hover:shadow-md transition-shadow">
            <p className={`text-2xl font-bold ${c.text}`}>{industry.color?.charAt(0).toUpperCase() + industry.color?.slice(1)}</p>
            <p className="text-xs font-semibold text-gray-500 uppercase mt-1">Color</p>
          </div>
        </div>

        <div className="bg-gray-50 border-2 border-gray-100 rounded-xl p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Created On</p>
          <p className="text-sm font-bold text-gray-700">{industry.createdAt}</p>
        </div>

        <div className="pt-4 border-t-2 border-pink-100">
          <SecondaryButton onClick={onClose} icon={ButtonIcons.Cancel} className="w-full">Close</SecondaryButton>
        </div>
      </div>
    </Modal>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 4. DELETE CONFIRM MODAL
// ═══════════════════════════════════════════════════════════════════════════════
export const DeleteIndustryModal = ({ isOpen, onClose, onConfirm, industry }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Delete Industry" size="sm">
    <div className="space-y-4">
      <div className="bg-red-50 border-2 border-red-200 rounded-xl p-5 text-center">
        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <FaExclamationTriangle className="text-red-500 text-2xl" />
        </div>
        <p className="text-gray-700 text-sm">You are about to permanently delete</p>
        <p className="text-red-600 font-bold text-xl mt-1">"{industry?.name}"</p>
        {industry?.sitesCount > 0 && (
          <div className="bg-red-100 border border-red-300 rounded-lg p-2 mt-3">
            <p className="text-xs text-red-700 font-semibold">
              ⚠️ This industry has {industry.sitesCount} active sites linked to it.
            </p>
          </div>
        )}
        <p className="text-xs text-red-500 mt-3 font-semibold">This action cannot be undone.</p>
      </div>
      <div className="flex gap-3">
        <DangerButton onClick={onConfirm} icon={ButtonIcons.Delete} className="flex-1">Yes, Delete</DangerButton>
        <SecondaryButton onClick={onClose} icon={ButtonIcons.Cancel} className="flex-1">Cancel</SecondaryButton>
      </div>
    </div>
  </Modal>
);
