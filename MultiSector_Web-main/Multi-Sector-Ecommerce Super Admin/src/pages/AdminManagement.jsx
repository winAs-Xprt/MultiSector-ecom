// src/pages/AdminManagement.jsx
import { useState } from 'react';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import { Card, CardHeader, CardBody } from '../components/common/Card';
import { PrimaryButton, SecondaryButton, ButtonIcons } from '../components/common/Button';
import { useAdminData, INDUSTRIES, ROLES } from '../data/AdminData';
import {
  CreateAdminModal,
  EditAdminModal,
  ViewAdminModal,
  DeleteConfirmModal,
  ToggleAccessModal,
  ResetPasswordModal
} from '../modals/AdminModals';
import {
  FaUserShield, FaCheckCircle, FaBan, FaUsers,
  FaFileExport, FaChartLine, FaKey, FaFilter
} from 'react-icons/fa';

const AdminManagement = () => {
  const {
    admins,
    allAdmins,
    addAdmin,
    updateAdmin,
    deleteAdmin,
    getAdminById,
    toggleAdminAccess,
    resetPassword,
    filterAdmins,
    clearFilters,
    getStats
  } = useAdminData();

  const stats = getStats();

  // ─── Modal States ─────────────────────────────────────────────────────────
  const [isCreateOpen,       setIsCreateOpen]       = useState(false);
  const [isEditOpen,         setIsEditOpen]         = useState(false);
  const [isViewOpen,         setIsViewOpen]         = useState(false);
  const [isDeleteOpen,       setIsDeleteOpen]       = useState(false);
  const [isToggleOpen,       setIsToggleOpen]       = useState(false);
  const [isResetPassOpen,    setIsResetPassOpen]    = useState(false);
  const [selectedAdmin,      setSelectedAdmin]      = useState(null);

  // ─── Filter States ────────────────────────────────────────────────────────
  const [filters, setFilters] = useState({
    search:   '',
    industry: 'all',
    status:   'all',
    role:     'all'
  });

  // ─── Filter Handlers ──────────────────────────────────────────────────────
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    filterAdmins(newFilters);
  };

  const handleClearFilters = () => {
    const reset = { search: '', industry: 'all', status: 'all', role: 'all' };
    setFilters(reset);
    clearFilters();
  };

  // ─── Open Modal Helpers ───────────────────────────────────────────────────
  const openModal = (setter, id = null) => {
    if (id) setSelectedAdmin(getAdminById(id));
    setter(true);
  };

  const closeModal = (setter) => {
    setter(false);
    setSelectedAdmin(null);
  };

  // ─── CRUD Handlers ────────────────────────────────────────────────────────
  const handleCreate = (data) => {
    addAdmin(data);
    toast.success(`Admin "${data.fullName}" created successfully!`);
    setIsCreateOpen(false);
  };

  const handleEdit = (data) => {
    updateAdmin(selectedAdmin.id, data);
    toast.success(`Admin "${data.fullName}" updated successfully!`);
    closeModal(setIsEditOpen);
  };

  const handleDelete = () => {
    toast.success(`Admin "${selectedAdmin.fullName}" deleted successfully!`);
    deleteAdmin(selectedAdmin.id);
    closeModal(setIsDeleteOpen);
  };

  const handleToggleAccess = (reason) => {
    const isActivating = selectedAdmin.status === 'inactive';
    toggleAdminAccess(selectedAdmin.id);
    toast.success(
      isActivating
        ? `Access restored for "${selectedAdmin.fullName}"`
        : `Access revoked for "${selectedAdmin.fullName}"`
    );
    closeModal(setIsToggleOpen);
  };

  const handleResetPassword = (newPassword) => {
    resetPassword(selectedAdmin.id, newPassword);
    toast.success(`Password reset successfully for "${selectedAdmin.fullName}"`);
    closeModal(setIsResetPassOpen);
  };

  // ─── Export CSV ───────────────────────────────────────────────────────────
  const handleExportCSV = () => {
    const headers = ['ID', 'Full Name', 'Email', 'Phone', 'Industry', 'Site', 'Role', 'Status', 'Created At'];
    const csvContent = [
      headers.join(','),
      ...admins.map(a => [
        a.id,
        `"${a.fullName}"`,
        a.email,
        a.phone,
        a.industry,
        `"${a.siteName}"`,
        a.role,
        a.status,
        a.createdAt
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url  = window.URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `admins_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Admin list exported successfully!');
  };

  // ─── Inline Action Button ─────────────────────────────────────────────────
  const ActionBtn = ({ onClick, icon, title, colorClass }) => (
    <button
      onClick={onClick}
      title={title}
      className={`p-2 rounded-lg border-2 transition-all duration-200 hover:shadow-md active:scale-95 ${colorClass}`}
    >
      {icon}
    </button>
  );

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <Layout>

      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-pink-700 bg-clip-text text-transparent mb-2">
            Admin Management
          </h1>
          <p className="text-gray-600">Create and manage admin & buyer accounts</p>
        </div>
        <div className="flex gap-3">
          <SecondaryButton onClick={handleExportCSV} icon={<FaFileExport />}>
            Export CSV
          </SecondaryButton>
          <PrimaryButton onClick={() => setIsCreateOpen(true)} icon={ButtonIcons.Add}>
            Add Admin
          </PrimaryButton>
        </div>
      </div>

      {/* ── Stats Cards ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">

        <Card className="hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">Total Admins</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
              <p className="text-xs text-gray-500 mt-1">All registered accounts</p>
            </div>
            <div className="w-14 h-14 bg-pink-100 rounded-xl flex items-center justify-center">
              <FaUserShield className="text-pink-600 text-2xl" />
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">Active</p>
              <p className="text-2xl font-bold text-gray-800">{stats.active}</p>
              <p className="text-xs text-gray-500 mt-1">Currently active accounts</p>
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
              <p className="text-xs text-gray-500 mt-1">Access revoked accounts</p>
            </div>
            <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center">
              <FaBan className="text-red-600 text-2xl" />
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">Buyers</p>
              <p className="text-2xl font-bold text-gray-800">{stats.buyers}</p>
              <p className="text-xs text-gray-500 mt-1">Buyer role accounts</p>
            </div>
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
              <FaUsers className="text-purple-600 text-2xl" />
            </div>
          </div>
        </Card>
      </div>

      {/* ── Quick Actions Bar ─────────────────────────────────────────────── */}
      <Card className="mb-6">
        <CardBody>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <FaChartLine className="text-pink-500 text-xl" />
              <span className="text-sm font-semibold text-gray-700">
                Showing {admins.length} of {stats.total} admins
              </span>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 text-sm font-medium text-pink-600 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors"
              >
                All ({stats.total})
              </button>
              <button
                onClick={() => { const f = { ...filters, status: 'active' }; setFilters(f); filterAdmins(f); }}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-green-50 hover:text-green-700 transition-colors"
              >
                Active ({stats.active})
              </button>
              <button
                onClick={() => { const f = { ...filters, status: 'inactive' }; setFilters(f); filterAdmins(f); }}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors"
              >
                Inactive ({stats.inactive})
              </button>
              <button
                onClick={() => { const f = { ...filters, role: 'Buyer' }; setFilters(f); filterAdmins(f); }}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-purple-50 hover:text-purple-700 transition-colors"
              >
                Buyers ({stats.buyers})
              </button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* ── Filters ───────────────────────────────────────────────────────── */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* Search */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
              <input
                type="text" name="search" value={filters.search}
                onChange={handleFilterChange}
                placeholder="Name, email, site, ID..."
                className="w-full px-4 py-2 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200"
              />
            </div>

            {/* Industry */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Industry</label>
              <select
                name="industry" value={filters.industry}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200"
              >
                <option value="all">All Industries</option>
                {INDUSTRIES.map(ind => <option key={ind} value={ind}>{ind}</option>)}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
              <select
                name="status" value={filters.status}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
              <select
                name="role" value={filters.role}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200"
              >
                <option value="all">All Roles</option>
                {ROLES.map(role => <option key={role} value={role}>{role}</option>)}
              </select>
            </div>

          </div>
        </CardBody>
      </Card>

      {/* ── Admins Table ──────────────────────────────────────────────────── */}
      <Card>
        <CardHeader
          title={`Admins (${admins.length})`}
          subtitle="View and manage all admin & buyer accounts"
        />
        <CardBody>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y-2 divide-pink-200">
              <thead className="bg-pink-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-pink-900 uppercase tracking-wider">ID</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-pink-900 uppercase tracking-wider">Admin</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-pink-900 uppercase tracking-wider">Industry</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-pink-900 uppercase tracking-wider">Site</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-pink-900 uppercase tracking-wider">Role</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-pink-900 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-pink-900 uppercase tracking-wider">Created</th>
                  <th className="px-5 py-3 text-center text-xs font-semibold text-pink-900 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-pink-100">
                {admins.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mb-4">
                          <FaUserShield className="text-4xl text-pink-300" />
                        </div>
                        <p className="text-gray-500 font-semibold text-lg">No admins found</p>
                        <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or add a new admin</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  admins.map((admin) => (
                    <tr key={admin.id} className="hover:bg-pink-50 transition-colors duration-200">

                      {/* ID */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="text-xs font-mono font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {admin.id}
                        </span>
                      </td>

                      {/* Admin Name + Email */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                            <span className="text-white text-sm font-bold">
                              {admin.fullName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{admin.fullName}</p>
                            <p className="text-xs text-gray-500">{admin.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Industry */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-semibold">
                          {admin.industry}
                        </span>
                      </td>

                      {/* Site */}
                      <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                        {admin.siteName}
                      </td>

                      {/* Role */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                          admin.role === 'Admin'
                            ? 'bg-blue-100 text-blue-700 border-blue-300'
                            : 'bg-purple-100 text-purple-700 border-purple-300'
                        }`}>
                          {admin.role}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                          admin.status === 'active'
                            ? 'bg-green-100 text-green-700 border-green-300'
                            : 'bg-red-100 text-red-700 border-red-300'
                        }`}>
                          {admin.status === 'active'
                            ? <FaCheckCircle className="text-xs" />
                            : <FaBan className="text-xs" />
                          }
                          {admin.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </td>

                      {/* Created At */}
                      <td className="px-5 py-4 whitespace-nowrap text-xs text-gray-500">
                        {admin.createdAt}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* View */}
                          <ActionBtn
                            onClick={() => openModal(setIsViewOpen, admin.id)}
                            icon={<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/></svg>}
                            title="View Details"
                            colorClass="bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200"
                          />
                          {/* Edit */}
                          <ActionBtn
                            onClick={() => openModal(setIsEditOpen, admin.id)}
                            icon={<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/></svg>}
                            title="Edit Admin"
                            colorClass="bg-green-50 text-green-600 hover:bg-green-100 border-green-200"
                          />
                          {/* Toggle Access */}
                          <ActionBtn
                            onClick={() => openModal(setIsToggleOpen, admin.id)}
                            icon={admin.status === 'active'
                              ? <FaBan className="w-4 h-4" />
                              : <FaCheckCircle className="w-4 h-4" />
                            }
                            title={admin.status === 'active' ? 'Deactivate Access' : 'Activate Access'}
                            colorClass={admin.status === 'active'
                              ? 'bg-orange-50 text-orange-600 hover:bg-orange-100 border-orange-200'
                              : 'bg-green-50 text-green-600 hover:bg-green-100 border-green-200'
                            }
                          />
                          {/* Reset Password */}
                          <ActionBtn
                            onClick={() => openModal(setIsResetPassOpen, admin.id)}
                            icon={<FaKey className="w-4 h-4" />}
                            title="Reset Password"
                            colorClass="bg-yellow-50 text-yellow-600 hover:bg-yellow-100 border-yellow-200"
                          />
                          {/* Delete */}
                          <ActionBtn
                            onClick={() => openModal(setIsDeleteOpen, admin.id)}
                            icon={<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/></svg>}
                            title="Delete Admin"
                            colorClass="bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      {/* ── Modals ────────────────────────────────────────────────────────── */}
      <CreateAdminModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={handleCreate}
      />
      <EditAdminModal
        isOpen={isEditOpen}
        onClose={() => closeModal(setIsEditOpen)}
        onUpdate={handleEdit}
        admin={selectedAdmin}
      />
      <ViewAdminModal
        isOpen={isViewOpen}
        onClose={() => closeModal(setIsViewOpen)}
        admin={selectedAdmin}
      />
      <ToggleAccessModal
        isOpen={isToggleOpen}
        onClose={() => closeModal(setIsToggleOpen)}
        onConfirm={handleToggleAccess}
        admin={selectedAdmin}
      />
      <ResetPasswordModal
        isOpen={isResetPassOpen}
        onClose={() => closeModal(setIsResetPassOpen)}
        onReset={handleResetPassword}
        admin={selectedAdmin}
      />
      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => closeModal(setIsDeleteOpen)}
        onConfirm={handleDelete}
        admin={selectedAdmin}
      />
    </Layout>
  );
};

export default AdminManagement;
