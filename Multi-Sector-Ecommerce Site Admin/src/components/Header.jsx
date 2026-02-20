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
    <header className="h-16 bg-white border-b-2 border-pink-100 flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Global Search Bar */}
      <div className="flex-1 max-w-2xl">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-pink-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products, orders, customers..."
            className="w-full pl-12 pr-4 py-2.5 border-2 border-pink-200 rounded-lg text-sm focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4 ml-6">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowAccountMenu(false);
            }}
            className="relative p-2.5 text-gray-600 hover:bg-pink-50 rounded-lg transition-colors"
          >
            <FaBell className="text-xl" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <>
              <div 
                className="fixed inset-0 z-30" 
                onClick={() => setShowNotifications(false)}
              ></div>
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border-2 border-pink-200 overflow-hidden z-40">
                <div className="p-4 border-b-2 border-pink-100 bg-pink-50">
                  <h3 className="font-bold text-gray-800">Notifications</h3>
                  <p className="text-xs text-gray-600">{unreadCount} unread notifications</p>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-pink-50 hover:bg-pink-50 transition-colors cursor-pointer ${
                        notification.unread ? 'bg-pink-25' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {notification.unread && (
                          <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                        )}
                        <div className="flex-1">
                          <p className="text-sm text-gray-800 font-medium">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t-2 border-pink-100 bg-pink-50 text-center">
                  <button className="text-sm font-semibold text-pink-600 hover:text-pink-700">
                    View All Notifications
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Account Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setShowAccountMenu(!showAccountMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-3 p-2 hover:bg-pink-50 rounded-lg transition-colors"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center">
              <FaUser className="text-white" />
            </div>
            <div className="text-left hidden md:block">
              <p className="text-sm font-semibold text-gray-800">Admin User</p>
              <p className="text-xs text-gray-500">{userEmail}</p>
            </div>
            <FaChevronDown className="text-gray-400 text-sm" />
          </button>

          {/* Account Dropdown */}
          {showAccountMenu && (
            <>
              <div 
                className="fixed inset-0 z-30" 
                onClick={() => setShowAccountMenu(false)}
              ></div>
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border-2 border-pink-200 overflow-hidden z-40">
                <div className="p-4 border-b-2 border-pink-100 bg-pink-50">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center">
                      <FaUser className="text-white text-lg" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">Admin User</p>
                      <p className="text-xs text-gray-600">{userEmail}</p>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-pink-50 rounded-lg transition-colors">
                    My Profile
                  </button>
                  <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-pink-50 rounded-lg transition-colors">
                    Account Settings
                  </button>
                  <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-pink-50 rounded-lg transition-colors">
                    Help & Support
                  </button>
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
