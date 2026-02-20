// src/components/Sidebar.jsx
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  FaHome, FaUserShield,
  FaSitemap, FaCog, FaSignOutAlt, FaShieldAlt,
  FaHistory,
} from 'react-icons/fa';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      path:  '/dashboard',
      icon:  <FaHome      className="text-lg" />,
      label: 'Dashboard',
    },
    {
      path:  '/admin-management',
      icon:  <FaUserShield className="text-lg" />,
      label: 'Admin Management',
    },
    {
      path:  '/site-admin',
      icon:  <FaSitemap   className="text-lg" />,
      label: 'Site Admin',
    },
    {
      path:  '/audit-logs',
      icon:  <FaHistory   className="text-lg" />,
      label: 'Audit Logs',
    },
    {
      path:  '/settings',
      icon:  <FaCog       className="text-lg" />,
      label: 'Settings',
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  return (
    <>
      <aside
        className={`fixed top-0 left-0 h-screen w-56 bg-white border-r-2 border-pink-100 shadow-lg transition-transform duration-300 z-40 flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* ── Brand ─────────────────────────────────────────── */}
        <div className="h-16 flex items-center px-4 border-b-2 border-pink-100 flex-shrink-0">
          <Link
            to="/dashboard"
            className="flex items-center gap-2.5 no-underline hover:opacity-80 transition-opacity duration-200"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
              <FaShieldAlt className="text-white text-base" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-pink-600 text-sm font-bold">Multi Ecom</span>
              <span className="text-gray-400 text-xs font-medium">Super Admin</span>
            </div>
          </Link>
        </div>

        {/* ── Navigation ────────────────────────────────────── */}
        <nav className="flex-1 p-3 overflow-y-auto">
          <p className="text-xs font-semibold text-gray-400 uppercase px-3 mb-3 tracking-wider">
            Main Menu
          </p>
          <ul className="space-y-1 list-none p-0 m-0">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 no-underline rounded-lg text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-md'
                        : 'text-gray-600 hover:bg-pink-50 hover:text-pink-600 hover:translate-x-1'
                    }`}
                    onClick={() => {
                      if (window.innerWidth < 1024) toggleSidebar();
                    }}
                  >
                    <span className={isActive ? 'text-white' : 'text-pink-400'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* ── Logout ────────────────────────────────────────── */}
        <div className="p-3 border-t-2 border-pink-100 flex-shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2.5 py-2.5 px-3 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white border-none rounded-lg text-sm font-semibold cursor-pointer transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            <FaSignOutAlt className="text-base" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ── Scrollbar Styles ──────────────────────────────────── */}
      <style>{`
        aside { scrollbar-width: thin; scrollbar-color: #ec4899 #fce7f3; }
        aside::-webkit-scrollbar { width: 6px; }
        aside::-webkit-scrollbar-track { background: #fce7f3; border-radius: 10px; }
        aside::-webkit-scrollbar-thumb { background: #ec4899; border-radius: 10px; }
        aside::-webkit-scrollbar-thumb:hover { background: #db2777; }
      `}</style>
    </>
  );
};

export default Sidebar;
