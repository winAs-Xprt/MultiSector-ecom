import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { FaBars } from 'react-icons/fa';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>

      {/* Mobile Toggle */}
      <button
        onClick={() => setSidebarOpen(p => !p)}
        style={{
          position: 'fixed', top: '12px', left: '12px', zIndex: 50,
          width: '38px', height: '38px', borderRadius: '10px',
          background: 'linear-gradient(135deg,#ec4899,#db2777)',
          border: 'none', color: '#fff', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 3px 12px rgba(236,72,153,0.35)',
        }}
        className="lg-hide"
      >
        <FaBars style={{ fontSize: '15px' }} />
      </button>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(17,24,39,0.45)', zIndex: 30, backdropFilter: 'blur(2px)' }}
          className="lg-hide"
        />
      )}

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(p => !p)} />

      {/* Main */}
      <div style={{ marginLeft: '220px', transition: 'margin-left 0.3s' }} className="layout-main">
        <Header />
        <main style={{ padding: '24px' }}>
          {children}
        </main>
      </div>

      {/* Responsive overrides */}
      <style>{`
        @media (max-width: 1023px) {
          .layout-main { margin-left: 0 !important; }
          .lg-hide { display: flex !important; }
        }
        @media (min-width: 1024px) {
          .lg-hide { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default Layout;
