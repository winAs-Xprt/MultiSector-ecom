import { useState } from 'react';
import { FaSearch, FaBell, FaUser, FaChevronDown } from 'react-icons/fa';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  const notifications = [
    { id: 1, message: '5 products are low in stock', time: '2 hours ago', unread: true },
    { id: 2, message: 'New order received - ORD-001', time: '3 hours ago', unread: true },
    { id: 3, message: 'Monthly report is ready', time: '5 hours ago', unread: false },
    { id: 4, message: 'Payment failed for order ORD-089', time: '1 day ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;
  const userEmail = localStorage.getItem('userEmail') || 'admin@nexo.com';

  return (
    <header style={{
      height: '60px', background: '#fff', borderBottom: '1px solid #f0f0f0',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px', position: 'sticky', top: 0, zIndex: 30,
    }}>

      {/* Search */}
      <div style={{ flex: 1, maxWidth: '480px' }}>
        <div style={{ position: 'relative' }}>
          <FaSearch style={{
            position: 'absolute', left: '12px', top: '50%',
            transform: 'translateY(-50%)', color: '#d1d5db', fontSize: '12px',
          }} />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search products, orders, customers..."
            style={{
              width: '100%', paddingLeft: '34px', paddingRight: '14px',
              paddingTop: '9px', paddingBottom: '9px',
              fontSize: '13.5px', fontWeight: 500, color: '#111827',
              background: '#fafafa', border: '1.5px solid #f0f0f0',
              borderRadius: '10px', outline: 'none', fontFamily: 'inherit',
              boxSizing: 'border-box', transition: 'all 0.18s',
            }}
            onFocus={e => { e.target.style.borderColor = '#ec4899'; e.target.style.background = '#fff'; e.target.style.boxShadow = '0 0 0 3px rgba(236,72,153,0.1)'; }}
            onBlur={e => { e.target.style.borderColor = '#f0f0f0'; e.target.style.background = '#fafafa'; e.target.style.boxShadow = 'none'; }}
          />
        </div>
      </div>

      {/* Right Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '20px' }}>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => { setShowNotifications(p => !p); setShowAccountMenu(false); }}
            style={{
              width: '38px', height: '38px', borderRadius: '10px',
              border: '1.5px solid #f0f0f0', background: '#fafafa',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', position: 'relative', color: '#6b7280',
              transition: 'all 0.18s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#fdf2f8'; e.currentTarget.style.borderColor = '#fce7f3'; e.currentTarget.style.color = '#ec4899'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fafafa'; e.currentTarget.style.borderColor = '#f0f0f0'; e.currentTarget.style.color = '#6b7280'; }}
          >
            <FaBell style={{ fontSize: '15px' }} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute', top: '-4px', right: '-4px',
                width: '18px', height: '18px', borderRadius: '50%',
                background: '#ef4444', color: '#fff',
                fontSize: '10px', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '2px solid #fff',
              }}>
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <>
              <div style={{ position: 'fixed', inset: 0, zIndex: 30 }} onClick={() => setShowNotifications(false)} />
              <div style={{
                position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                width: '320px', background: '#fff', borderRadius: '14px',
                border: '1px solid #f0f0f0', zIndex: 40,
                boxShadow: '0 12px 40px rgba(0,0,0,0.1)',
                overflow: 'hidden',
                animation: 'fadeDown 0.18s ease',
              }}>
                <style>{`@keyframes fadeDown { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }`}</style>

                {/* Notif Header */}
                <div style={{ padding: '14px 16px', borderBottom: '1px solid #f5f5f5' }}>
                  <p style={{ fontSize: '14px', fontWeight: 700, color: '#111827', margin: 0 }}>Notifications</p>
                  <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>{unreadCount} unread</p>
                </div>

                {/* Notif List */}
                <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                  {notifications.map((n, idx) => (
                    <div
                      key={n.id}
                      style={{
                        padding: '12px 16px',
                        borderBottom: idx < notifications.length - 1 ? '1px solid #f9f9f9' : 'none',
                        background: n.unread ? '#fdf2f8' : '#fff',
                        cursor: 'pointer', transition: 'background 0.15s',
                        display: 'flex', alignItems: 'flex-start', gap: '10px',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#fdf2f8'}
                      onMouseLeave={e => e.currentTarget.style.background = n.unread ? '#fdf2f8' : '#fff'}
                    >
                      {n.unread && (
                        <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#ec4899', flexShrink: 0, marginTop: '5px' }} />
                      )}
                      {!n.unread && <div style={{ width: '7px', flexShrink: 0 }} />}
                      <div>
                        <p style={{ fontSize: '13px', fontWeight: 600, color: '#111827', margin: 0, lineHeight: 1.4 }}>{n.message}</p>
                        <p style={{ fontSize: '11.5px', color: '#9ca3af', marginTop: '3px' }}>{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div style={{ padding: '11px 16px', borderTop: '1px solid #f5f5f5', textAlign: 'center' }}>
                  <button style={{ fontSize: '13px', fontWeight: 600, color: '#ec4899', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                    View all notifications
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Divider */}
        <div style={{ width: '1px', height: '24px', background: '#f0f0f0', margin: '0 4px' }} />

        {/* Account */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => { setShowAccountMenu(p => !p); setShowNotifications(false); }}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '6px 10px 6px 6px', borderRadius: '10px',
              border: '1.5px solid #f0f0f0', background: '#fafafa',
              cursor: 'pointer', transition: 'all 0.18s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#fdf2f8'; e.currentTarget.style.borderColor = '#fce7f3'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fafafa'; e.currentTarget.style.borderColor = '#f0f0f0'; }}
          >
            <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'linear-gradient(135deg,#ec4899,#db2777)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <FaUser style={{ color: '#fff', fontSize: '12px' }} />
            </div>
            <div style={{ textAlign: 'left', display: 'none' }} className="md-show">
              <p style={{ fontSize: '13px', fontWeight: 700, color: '#111827', margin: 0, lineHeight: 1.2 }}>Admin User</p>
              <p style={{ fontSize: '11.5px', color: '#9ca3af', margin: 0 }}>{userEmail}</p>
            </div>
            <FaChevronDown style={{ fontSize: '10px', color: '#9ca3af' }} />
          </button>

          {showAccountMenu && (
            <>
              <div style={{ position: 'fixed', inset: 0, zIndex: 30 }} onClick={() => setShowAccountMenu(false)} />
              <div style={{
                position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                width: '240px', background: '#fff', borderRadius: '14px',
                border: '1px solid #f0f0f0', zIndex: 40,
                boxShadow: '0 12px 40px rgba(0,0,0,0.1)',
                overflow: 'hidden', animation: 'fadeDown 0.18s ease',
              }}>
                {/* User Info */}
                <div style={{ padding: '14px 16px', borderBottom: '1px solid #f5f5f5', display: 'flex', alignItems: 'center', gap: '11px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg,#ec4899,#db2777)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FaUser style={{ color: '#fff', fontSize: '14px' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: '13.5px', fontWeight: 700, color: '#111827', margin: 0 }}>Admin User</p>
                    <p style={{ fontSize: '11.5px', color: '#9ca3af', margin: '2px 0 0' }}>{userEmail}</p>
                  </div>
                </div>

                {/* Menu Items */}
                <div style={{ padding: '6px' }}>
                  {['My Profile', 'Account Settings', 'Help & Support'].map(item => (
                    <button
                      key={item}
                      style={{
                        width: '100%', textAlign: 'left', padding: '9px 12px',
                        fontSize: '13.5px', fontWeight: 500, color: '#374151',
                        background: 'none', border: 'none', borderRadius: '8px',
                        cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
                        display: 'block',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#fdf2f8'; e.currentTarget.style.color = '#ec4899'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#374151'; }}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
