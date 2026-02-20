// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Auth
import Login from './auth/Login';

// Pages
import Dashboard           from './pages/Dashboard';
import AdminManagement     from './pages/AdminManagement';
import SiteAdminManagement from './pages/SiteAdminManagement';
import AuditLogs           from './pages/AuditLogs';
import Settings            from './pages/Settings';

// ─── Protected Route ──────────────────────────────────────────────────────────
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// ─── Auth Route ───────────────────────────────────────────────────────────────
const AuthRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

// ─── App ──────────────────────────────────────────────────────────────────────
function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── Auth ──────────────────────────────────────────── */}
        <Route
          path="/login"
          element={
            <AuthRoute>
              <Login />
            </AuthRoute>
          }
        />

        {/* ── Dashboard ─────────────────────────────────────── */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* ── Admin Management ──────────────────────────────── */}
        <Route
          path="/admin-management"
          element={
            <ProtectedRoute>
              <AdminManagement />
            </ProtectedRoute>
          }
        />

        {/* ── Site Admin Management ─────────────────────────── */}
        <Route
          path="/site-admin"
          element={
            <ProtectedRoute>
              <SiteAdminManagement />
            </ProtectedRoute>
          }
        />

        {/* ── Audit Logs ────────────────────────────────────── */}
        <Route
          path="/audit-logs"
          element={
            <ProtectedRoute>
              <AuditLogs />
            </ProtectedRoute>
          }
        />

        {/* ── Settings ──────────────────────────────────────── */}
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        {/* ── Default & Catch-all ───────────────────────────── */}
        <Route path="/"  element={<Navigate to="/login" replace />} />
        <Route path="*"  element={<Navigate to="/login" replace />} />

      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
    </BrowserRouter>
  );
}

export default App;
