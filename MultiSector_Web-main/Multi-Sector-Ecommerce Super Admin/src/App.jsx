// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Auth
import Login from './auth/Login';

// Pages
import Dashboard          from './pages/Dashboard';
import IndustryManagement from './pages/IndustryManagement';
import AdminManagement    from './pages/AdminManagement';
import SiteAdminManagement from './pages/SiteAdminManagement';
import Settings           from './pages/Settings';

// ─── Protected Route ─────────────────────────────────────────────────────────
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// ─── Auth Route (redirect to dashboard if already logged in) ─────────────────
const AuthRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

// ─── App ─────────────────────────────────────────────────────────────────────
function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── Auth ─────────────────────────────────────────── */}
        <Route
          path="/login"
          element={
            <AuthRoute>
              <Login />
            </AuthRoute>
          }
        />

        {/* ── Dashboard ────────────────────────────────────── */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* ── Industry Management ──────────────────────────── */}
        <Route
          path="/industry"
          element={
            <ProtectedRoute>
              <IndustryManagement />
            </ProtectedRoute>
          }
        />

        {/* ── Admin Management ─────────────────────────────── */}
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

        {/* ── Settings ─────────────────────────────────────── */}
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        {/* ── Default & Catch-all ──────────────────────────── */}
        <Route path="/"  element={<Navigate to="/login" replace />} />
        <Route path="*"  element={<Navigate to="/login" replace />} />

      </Routes>

      {/* Toast Notifications */}
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
