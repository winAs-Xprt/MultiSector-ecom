// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login      from './auth/Login';
import Dashboard  from './pages/Dashboard';
import Products   from './pages/Products';
import Settings   from './pages/Settings';
import Customers  from './pages/Customers';
import { isAuthenticated } from './utils/storage';

// ─── Protected Route ──────────────────────────────────────────────────────────
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  return children;
};

// ─── Auth Route ───────────────────────────────────────────────────────────────
const AuthRoute = ({ children }) => {
  if (isAuthenticated()) return <Navigate to="/dashboard" replace />;
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"     element={<AuthRoute><Login /></AuthRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/products"  element={<ProtectedRoute><Products /></ProtectedRoute>} />
        <Route path="/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
        <Route path="/settings"  element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/orders"    element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/"          element={<Navigate to="/login" replace />} />
        <Route path="*"          element={<Navigate to="/login" replace />} />
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
