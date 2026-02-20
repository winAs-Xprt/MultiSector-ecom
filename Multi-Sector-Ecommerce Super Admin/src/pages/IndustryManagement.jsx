// src/pages/IndustryManagement.jsx
import { useState } from 'react';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import { Card, CardHeader, CardBody } from '../components/common/Card';
import { PrimaryButton, SecondaryButton, ButtonIcons } from '../components/common/Button';
import { useIndustryData, COLOR_MAP } from '../data/IndustryData';
import {
  CreateIndustryModal,
  EditIndustryModal,
  ViewIndustryModal,
  DeleteIndustryModal
} from '../modals/IndustryModals';
import {
  FaBuilding, FaCheckCircle, FaBan, FaSitemap,
  FaChartLine, FaFileExport, FaLayerGroup
} from 'react-icons/fa';

const IndustryManagement = () => {
  const {
    industries,
    allIndustries,
    addIndustry,
    updateIndustry,
    deleteIndustry,
    getIndustryById,
    toggleIndustryStatus,
    filterIndustries,
    clearFilters,
    getStats
  } = useIndustryData();

  const stats = getStats();

  // ─── Modal States ──────────────────────────────────────────────────────────
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen,   setIsEditOpen]   = useState(false);
  const [isViewOpen,   setIsViewOpen]   = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selected,     setSelected]     = useState(null);

  // ─── Filter States ─────────────────────────────────────────────────────────
  const [filters, setFilters] = useState({ search: '', status: 'all' });

  // ─── Helpers ───────────────────────────────────────────────────────────────
  const openModal = (setter, id = null) => {
    if (id) setSelected(getIndustryById(id));
    setter(true);
  };

  const closeModal = (setter) => {
    setter(false);
    setSelected(null);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    filterIndustries(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({ search: '', status: 'all' });
    clearFilters();
  };

  // ─── CRUD Handlers ─────────────────────────────────────────────────────────
  const handleCreate = (data) => {
    addIndustry(data);
    toast.success(`Industry "${data.name}" created successfully!`);
    setIsCreateOpen(false);
  };

  const handleUpdate = (data) => {
    updateIndustry(selected.id, data);
    toast.success(`Industry "${data.name}" updated successfully!`);
    closeModal(setIsEditOpen);
  };

  const handleDelete = () => {
    toast.success(`Industry "${selected.name}" deleted successfully!`);
    deleteIndustry(selected.id);
    closeModal(setIsDeleteOpen);
  };

  const handleToggle = (id) => {
    const industry = getIndustryById(id);
    const isActivating = industry.status === 'inactive';
    toggleIndustryStatus(id);
    toast.success(
      isActivating
        ? `"${industry.name}" is now Active`
        : `"${industry.name}" has been Deactivated`
    );
  };

  // ─── Export CSV ────────────────────────────────────────────────────────────
  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Description', 'Color', 'Sites', 'Admins', 'Status', 'Created'];
    const csv = [
      headers.join(','),
      ...industries.map(i => [
        i.id, `"${i.name}"`, `"${i.description}"`,
        i.color, i.sitesCount, i.adminsCount, i.status, i.createdAt
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = window.URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `industries_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Industries exported successfully!');
  };

  // ─── Action Button ─────────────────────────────────────────────────────────
  const ActionBtn = ({ onClick, icon, title, colorClass }) => (
    <button
      onClick={onClick} title={title}
      className={`p-2 rounded-lg border-2 transition-all duration-200 hover:shadow-md active:scale-95 ${colorClass}`}
    >
      {icon}
    </button>
  );

  return (
    <Layout>

      {/* ── Page Header ────────────────────────────────────────────────────── */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-pink-700 bg-clip-text text-transparent mb-2">
            Industry Management
          </h1>
          <p className="text-gray-600">Add, edit and manage platform industries</p>
        </div>
        <div className="flex gap-3">
          <SecondaryButton onClick={handleExportCSV} icon={<FaFileExport />}>
            Export CSV
          </SecondaryButton>
          <PrimaryButton onClick={() => setIsCreateOpen(true)} icon={ButtonIcons.Add}>
            Add Industry
          </PrimaryButton>
        </div>
      </div>

      {/* ── Stats Cards ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card className="hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">Total Industries</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
              <p className="text-xs text-gray-500 mt-1">All registered industries</p>
            </div>
            <div className="w-14 h-14 bg-pink-100 rounded-xl flex items-center justify-center">
              <FaLayerGroup className="text-pink-600 text-2xl" />
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">Active</p>
              <p className="text-2xl font-bold text-gray-800">{stats.active}</p>
              <p className="text-xs text-gray-500 mt-1">Currently enabled</p>
            </div>
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
              <FaCheckCircle className="text-green-600 text-2xl" />
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">Inactive</p>
              <p className="text-2xl font-bold text-gray-800">{stats.inactive}</p>
              <p className="text-xs text-gray-500 mt-1">Currently disabled</p>
            </div>
            <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center">
              <FaBan className="text-red-600 text-2xl" />
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">Total Sites</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalSites}</p>
              <p className="text-xs text-gray-500 mt-1">Across all industries</p>
            </div>
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
              <FaSitemap className="text-blue-600 text-2xl" />
            </div>
          </div>
        </Card>
      </div>

      {/* ── Quick Filter Bar ────────────────────────────────────────────────── */}
      <Card className="mb-6">
        <CardBody>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <FaChartLine className="text-pink-500 text-xl" />
              <span className="text-sm font-semibold text-gray-700">
                Showing {industries.length} of {stats.total} industries
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 text-sm font-medium text-pink-600 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors"
              >
                All ({stats.total})
              </button>
              <button
                onClick={() => { const f = { ...filters, status: 'active' }; setFilters(f); filterIndustries(f); }}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-green-50 hover:text-green-700 transition-colors"
              >
                Active ({stats.active})
              </button>
              <button
                onClick={() => { const f = { ...filters, status: 'inactive' }; setFilters(f); filterIndustries(f); }}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors"
              >
                Inactive ({stats.inactive})
              </button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* ── Search & Filter ─────────────────────────────────────────────────── */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
              <input
                type="text" name="search" value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search by name, description or ID..."
                className="w-full px-4 py-2 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
              <select
                name="status" value={filters.status}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* ── Industry Table ──────────────────────────────────────────────────── */}
      <Card>
        <CardHeader
          title={`Industries (${industries.length})`}
          subtitle="Manage all platform industry categories"
        />
        <CardBody>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y-2 divide-pink-200">
              <thead className="bg-pink-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-pink-900 uppercase tracking-wider">ID</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-pink-900 uppercase tracking-wider">Industry</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-pink-900 uppercase tracking-wider">Description</th>
                  <th className="px-5 py-3 text-center text-xs font-semibold text-pink-900 uppercase tracking-wider">Sites</th>
                  <th className="px-5 py-3 text-center text-xs font-semibold text-pink-900 uppercase tracking-wider">Admins</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-pink-900 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-pink-900 uppercase tracking-wider">Created</th>
                  <th className="px-5 py-3 text-center text-xs font-semibold text-pink-900 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-pink-100">
                {industries.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mb-4">
                          <FaBuilding className="text-4xl text-pink-300" />
                        </div>
                        <p className="text-gray-500 font-semibold text-lg">No industries found</p>
                        <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or add a new industry</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  industries.map((industry) => {
                    const c = COLOR_MAP[industry.color] || COLOR_MAP.blue;
                    return (
                      <tr key={industry.id} className="hover:bg-pink-50 transition-colors duration-200">

                        {/* ID */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className="text-xs font-mono font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {industry.id}
                          </span>
                        </td>

                        {/* Industry Name */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 ${c.icon} rounded-xl flex items-center justify-center shadow-sm flex-shrink-0`}>
                              <FaBuilding className="text-white text-base" />
                            </div>
                            <div>
                              <p className={`text-sm font-bold ${c.text}`}>{industry.name}</p>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${c.bg} ${c.text} border ${c.border} font-medium`}>
                                {industry.color}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Description */}
                        <td className="px-5 py-4 max-w-xs">
                          <p className="text-sm text-gray-600 truncate">{industry.description}</p>
                        </td>

                        {/* Sites Count */}
                        <td className="px-5 py-4 whitespace-nowrap text-center">
                          <span className="inline-flex items-center gap-1 text-sm font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
                            <FaSitemap className="text-xs" />
                            {industry.sitesCount}
                          </span>
                        </td>

                        {/* Admins Count */}
                        <td className="px-5 py-4 whitespace-nowrap text-center">
                          <span className="text-sm font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full">
                            {industry.adminsCount}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                            industry.status === 'active'
                              ? 'bg-green-100 text-green-700 border-green-300'
                              : 'bg-red-100 text-red-700 border-red-300'
                          }`}>
                            {industry.status === 'active'
                              ? <FaCheckCircle className="text-xs" />
                              : <FaBan className="text-xs" />
                            }
                            {industry.status === 'active' ? 'Active' : 'Inactive'}
                          </span>
                        </td>

                        {/* Created */}
                        <td className="px-5 py-4 whitespace-nowrap text-xs text-gray-500">
                          {industry.createdAt}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* View */}
                            <ActionBtn
                              onClick={() => openModal(setIsViewOpen, industry.id)}
                              icon={<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/></svg>}
                              title="View Details"
                              colorClass="bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200"
                            />
                            {/* Edit */}
                            <ActionBtn
                              onClick={() => openModal(setIsEditOpen, industry.id)}
                              icon={<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/></svg>}
                              title="Edit Industry"
                              colorClass="bg-green-50 text-green-600 hover:bg-green-100 border-green-200"
                            />
                            {/* Toggle */}
                            <ActionBtn
                              onClick={() => handleToggle(industry.id)}
                              icon={industry.status === 'active'
                                ? <FaBan className="w-4 h-4" />
                                : <FaCheckCircle className="w-4 h-4" />
                              }
                              title={industry.status === 'active' ? 'Deactivate' : 'Activate'}
                              colorClass={industry.status === 'active'
                                ? 'bg-orange-50 text-orange-600 hover:bg-orange-100 border-orange-200'
                                : 'bg-green-50 text-green-600 hover:bg-green-100 border-green-200'
                              }
                            />
                            {/* Delete */}
                            <ActionBtn
                              onClick={() => openModal(setIsDeleteOpen, industry.id)}
                              icon={<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/></svg>}
                              title="Delete Industry"
                              colorClass="bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      {/* ── Modals ─────────────────────────────────────────────────────────── */}
      <CreateIndustryModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={handleCreate}
      />
      <EditIndustryModal
        isOpen={isEditOpen}
        onClose={() => closeModal(setIsEditOpen)}
        onUpdate={handleUpdate}
        industry={selected}
      />
      <ViewIndustryModal
        isOpen={isViewOpen}
        onClose={() => closeModal(setIsViewOpen)}
        industry={selected}
      />
      <DeleteIndustryModal
        isOpen={isDeleteOpen}
        onClose={() => closeModal(setIsDeleteOpen)}
        onConfirm={handleDelete}
        industry={selected}
      />
    </Layout>
  );
};

export default IndustryManagement;
