// src/pages/SiteAdminManagement.jsx
import { useState } from 'react';
import Layout from '../components/Layout';
import {
  CreateSiteModal,
  EditSiteModal,
  ViewSiteModal,
  DeleteSiteModal,
  ShareCredentialsModal,
  ToggleVisibilityModal
} from '../modals/SiteAdminModals';
import {
  FaPlus, FaSearch, FaFilter, FaSitemap,
  FaEdit, FaTrash, FaEye, FaShare,
  FaCheckCircle, FaBan, FaTimes
} from 'react-icons/fa';
import { PrimaryButton } from '../components/common/Button';
import { SITE_INDUSTRIES, useSiteAdminData } from '../data/SiteAdminData';

const SiteAdminManagement = () => {
  const {
    sites, addSite, updateSite, deleteSite,
    toggleVisibility, filterSites, clearFilters, getStats
  } = useSiteAdminData();

  const [modals, setModals] = useState({
    create: false, edit: false, view: false,
    delete: false, share: false, toggle: false
  });
  const [selectedSite, setSelectedSite] = useState(null);
  const [filters, setFilters] = useState({ search: '', industry: 'all', visibility: 'all' });
  const [showFilters, setShowFilters] = useState(false);

  const openModal  = (name, site = null) => {
    setSelectedSite(site);
    setModals(p => ({ ...p, [name]: true }));
  };
  const closeModal = (name) => {
    setModals(p => ({ ...p, [name]: false }));
    setSelectedSite(null);
  };

  const handleFilter = (key, val) => {
    const updated = { ...filters, [key]: val };
    setFilters(updated);
    filterSites(updated);
  };

  const handleClearFilters = () => {
    setFilters({ search: '', industry: 'all', visibility: 'all' });
    clearFilters();
    setShowFilters(false);
  };

  const stats = getStats();

  const handleCreate = (data) => { addSite(data);                         closeModal('create'); };
  const handleUpdate = (data) => { updateSite(data.id, data);             closeModal('edit');   };
  const handleDelete = ()     => { deleteSite(selectedSite.id);           closeModal('delete'); };
  const handleToggle = ()     => { toggleVisibility(selectedSite.id);     closeModal('toggle'); };

  return (
    <Layout>
      <div className="p-6 space-y-6">

        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-pink-700 bg-clip-text text-transparent">
              Site Admin Management
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">Manage all client sites and their admin credentials</p>
          </div>
          <PrimaryButton onClick={() => openModal('create')} icon={<FaPlus />}>
            Create New Site
          </PrimaryButton>
        </div>

        {/* ── Stats Cards ────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Sites',  value: stats.total,      color: 'from-pink-500 to-pink-600',   bg: 'bg-pink-50',  border: 'border-pink-200'  },
            { label: 'Active',       value: stats.active,     color: 'from-green-500 to-green-600', bg: 'bg-green-50', border: 'border-green-200' },
            { label: 'Inactive',     value: stats.inactive,   color: 'from-red-400 to-red-500',     bg: 'bg-red-50',   border: 'border-red-200'   },
            { label: 'Industries',   value: stats.industries, color: 'from-blue-500 to-blue-600',   bg: 'bg-blue-50',  border: 'border-blue-200'  },
          ].map(s => (
            <div key={s.label} className={`${s.bg} border-2 ${s.border} rounded-2xl p-4 text-center`}>
              <p className={`text-3xl font-bold bg-gradient-to-r ${s.color} bg-clip-text text-transparent`}>
                {s.value}
              </p>
              <p className="text-xs font-semibold text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── Search + Filter Bar ────────────────────────────────────────────── */}
        <div className="bg-white border-2 border-pink-100 rounded-2xl p-4 space-y-3">
          <div className="flex gap-3 flex-wrap">

            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-400" />
              <input
                type="text"
                value={filters.search}
                placeholder="Search sites, admin, location..."
                onChange={e => handleFilter('search', e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all"
              />
              {filters.search && (
                <button onClick={() => handleFilter('search', '')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-500">
                  <FaTimes />
                </button>
              )}
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 font-semibold text-sm transition-all ${
                showFilters
                  ? 'bg-pink-500 text-white border-pink-500'
                  : 'bg-white text-gray-600 border-pink-200 hover:border-pink-400'
              }`}>
              <FaFilter /> Filters
            </button>

            {/* Clear Filters */}
            {(filters.industry !== 'all' || filters.visibility !== 'all') && (
              <button onClick={handleClearFilters}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 border-red-200 text-red-500 hover:bg-red-50 font-semibold text-sm transition-all">
                <FaTimes /> Clear
              </button>
            )}
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t-2 border-pink-50">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Industry</label>
                <select
                  value={filters.industry}
                  onChange={e => handleFilter('industry', e.target.value)}
                  className="w-full px-3 py-2 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-500 text-sm">
                  <option value="all">All Industries</option>
                  {SITE_INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Visibility</label>
                <select
                  value={filters.visibility}
                  onChange={e => handleFilter('visibility', e.target.value)}
                  className="w-full px-3 py-2 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-500 text-sm">
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* ── Sites Table ────────────────────────────────────────────────────── */}
        <div className="bg-white border-2 border-pink-100 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b-2 border-pink-50 flex items-center justify-between">
            <h2 className="font-bold text-gray-700">
              All Sites <span className="text-pink-500 ml-1">({sites.length})</span>
            </h2>
          </div>

          {sites.length === 0 ? (
            <div className="p-16 text-center">
              <FaSitemap className="text-5xl text-pink-200 mx-auto mb-4" />
              <p className="text-gray-500 font-semibold">No sites found</p>
              <p className="text-gray-400 text-sm mt-1">Try clearing your filters or create a new site</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-pink-50 text-left">
                    <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Site</th>
                    <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Admin</th>
                    <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Industry</th>
                    <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-pink-50">
                  {sites.map(site => (
                    <tr key={site.id} className="hover:bg-pink-50/40 transition-colors">

                      {/* Site */}
                      <td className="px-4 py-3">
                        <p className="font-semibold text-gray-800 text-sm">{site.siteName}</p>
                        <p className="text-xs text-pink-500 font-mono mt-0.5">{site.siteUrl}</p>
                        <p className="text-xs text-gray-400 mt-0.5 font-mono">{site.id}</p>
                      </td>

                      {/* Admin */}
                      <td className="px-4 py-3">
                        <p className="text-sm font-semibold text-gray-700">{site.adminName}</p>
                        <p className="text-xs text-gray-400">{site.adminEmail}</p>
                      </td>

                      {/* Industry */}
                      <td className="px-4 py-3">
                        <span className="px-2.5 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-semibold border border-pink-200">
                          {site.industry}
                        </span>
                      </td>

                      {/* Location */}
                      <td className="px-4 py-3 text-sm text-gray-600">{site.location}</td>

                      {/* Status — clickable badge to toggle */}
                      <td className="px-4 py-3">
                        <button
                          onClick={() => openModal('toggle', site)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border-2 transition-all hover:opacity-75 ${
                            site.visibility === 'active'
                              ? 'bg-green-100 text-green-700 border-green-300'
                              : 'bg-red-100 text-red-700 border-red-300'
                          }`}>
                          {site.visibility === 'active' ? <FaCheckCircle /> : <FaBan />}
                          {site.visibility === 'active' ? 'Active' : 'Inactive'}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => openModal('view', site)}
                            className="p-1.5 rounded-lg hover:bg-blue-100 text-blue-500 transition-colors" title="View">
                            <FaEye />
                          </button>
                          <button onClick={() => openModal('edit', site)}
                            className="p-1.5 rounded-lg hover:bg-yellow-100 text-yellow-500 transition-colors" title="Edit">
                            <FaEdit />
                          </button>
                          <button onClick={() => openModal('share', site)}
                            className="p-1.5 rounded-lg hover:bg-green-100 text-green-500 transition-colors" title="Share Credentials">
                            <FaShare />
                          </button>
                          <button onClick={() => openModal('delete', site)}
                            className="p-1.5 rounded-lg hover:bg-red-100 text-red-500 transition-colors" title="Delete">
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── Modals ─────────────────────────────────────────────────────────── */}
      <CreateSiteModal
        isOpen={modals.create}
        onClose={() => closeModal('create')}
        onCreate={handleCreate}
      />
      <EditSiteModal
        isOpen={modals.edit}
        onClose={() => closeModal('edit')}
        onUpdate={handleUpdate}
        site={selectedSite}
      />
      <ViewSiteModal
        isOpen={modals.view}
        onClose={() => closeModal('view')}
        site={selectedSite}
      />
      <DeleteSiteModal
        isOpen={modals.delete}
        onClose={() => closeModal('delete')}
        onConfirm={handleDelete}
        site={selectedSite}
      />
      <ShareCredentialsModal
        isOpen={modals.share}
        onClose={() => closeModal('share')}
        site={selectedSite}
      />
      <ToggleVisibilityModal
        isOpen={modals.toggle}
        onClose={() => closeModal('toggle')}
        onConfirm={handleToggle}
        site={selectedSite}
      />
    </Layout>
  );
};

export default SiteAdminManagement;
