// src/components/common/Sidebar.jsx
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaHome, FaBox, FaUsers, FaCog, FaSignOutAlt } from 'react-icons/fa';
import api from '../services/api';
import { clearStoredAuth } from '../utils/storage';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: <FaHome />,  label: 'Dashboard' },
    { path: '/products',  icon: <FaBox />,   label: 'Products'  },
    { path: '/customers', icon: <FaUsers />, label: 'Customers' },
    { path: '/settings',  icon: <FaCog />,   label: 'Settings'  },
  ];

  const handleLogout = async () => {
    try { await api.post('/auth/logout'); } catch (_) {}
    clearStoredAuth();
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  return (
    <aside
      style={{
        position: 'fixed', top: 0, left: 0,
        height: '100vh', width: '220px',
        background: '#fff', borderRight: '1px solid #f0f0f0',
        display: 'flex', flexDirection: 'column',
        zIndex: 40, transition: 'transform 0.28s cubic-bezier(0.4,0,0.2,1)',
      }}
      className="sidebar-base"
    >
      {/* Brand */}
      <div style={{
        height: '60px', display: 'flex', alignItems: 'center',
        padding: '0 18px', borderBottom: '1px solid #f0f0f0', flexShrink: 0,
      }}>
        <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '9px', textDecoration: 'none' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '9px',
            background: 'linear-gradient(135deg,#ec4899,#db2777)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <i className="fas fa-shopping-bag" style={{ color: '#fff', fontSize: '14px' }} />
          </div>
          <span style={{ fontSize: '15px', fontWeight: 800, color: '#111827', letterSpacing: '-0.3px' }}>
            Multi<span style={{ color: '#ec4899' }}>Ecom</span>
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
        <ul style={{
          listStyle: 'none', padding: 0, margin: 0,
          display: 'flex', flexDirection: 'column', gap: '2px',
        }}>
          {menuItems.map(item => {
            const active = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => { if (window.innerWidth < 1024) toggleSidebar(); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '9px 12px', borderRadius: '9px', textDecoration: 'none',
                    fontSize: '13.5px', fontWeight: 600, transition: 'all 0.18s',
                    background: active ? '#fdf2f8' : 'transparent',
                    color:      active ? '#ec4899' : '#6b7280',
                  }}
                  onMouseEnter={e => {
                    if (!active) {
                      e.currentTarget.style.background = '#fafafa';
                      e.currentTarget.style.color = '#111827';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!active) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#6b7280';
                    }
                  }}
                >
                  {/* Active Indicator Bar */}
                  <span style={{
                    width: '3px', height: '18px', borderRadius: '3px', flexShrink: 0,
                    background: active ? '#ec4899' : 'transparent',
                    transition: 'background 0.18s',
                  }} />
                  {/* Icon */}
                  <span style={{
                    fontSize: '14px',
                    color: active ? '#ec4899' : '#9ca3af',
                    transition: 'color 0.18s',
                  }}>
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div style={{ padding: '12px 10px', borderTop: '1px solid #f0f0f0', flexShrink: 0 }}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '9px',
            padding: '10px 14px', borderRadius: '9px', border: 'none',
            background: '#fdf2f8', color: '#ec4899',
            fontSize: '13.5px', fontWeight: 600, cursor: 'pointer',
            fontFamily: 'inherit', transition: 'all 0.18s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'linear-gradient(135deg,#ec4899,#db2777)';
            e.currentTarget.style.color = '#fff';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = '#fdf2f8';
            e.currentTarget.style.color = '#ec4899';
          }}
        >
          <FaSignOutAlt style={{ fontSize: '14px' }} />
          Logout
        </button>
      </div>

      {/* Responsive */}
      <style>{`
        .sidebar-base { transform: translateX(0); }
        @media (max-width: 1023px) {
          .sidebar-base {
            transform: ${isOpen ? 'translateX(0)' : 'translateX(-100%)'};
            box-shadow: ${isOpen ? '4px 0 24px rgba(0,0,0,0.1)' : 'none'};
          }
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
