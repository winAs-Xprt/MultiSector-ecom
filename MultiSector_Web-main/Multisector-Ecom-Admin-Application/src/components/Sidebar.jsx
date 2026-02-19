// import { useNavigate, Link, useLocation } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { FaHome, FaBox, FaCog, FaSignOutAlt } from 'react-icons/fa';


// const Sidebar = ({ isOpen, toggleSidebar }) => {
//   const navigate = useNavigate();
//   const location = useLocation();


//   const menuItems = [
//     { path: '/dashboard', icon: <FaHome className="text-xl" />, label: 'Dashboard' },
//     { path: '/products', icon: <FaBox className="text-xl" />, label: 'Products' },
//     { path: '/settings', icon: <FaCog className="text-xl" />, label: 'Settings' },
//   ];


//   const handleLogout = () => {
//     localStorage.removeItem('isAuthenticated');
//     localStorage.removeItem('userEmail');
//     toast.success('Logged out successfully!');
//     navigate('/login');
//   };


//   return (
//     <>
//       <aside
//         className={`fixed top-0 left-0 h-screen w-56 bg-white border-r-2 border-pink-100 shadow-lg transition-transform duration-300 z-40 flex flex-col ${
//           isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
//         }`}
//       >
//         {/* Logo/Brand Section - Height matches Header */}
//         <div className="h-16 flex items-center px-3 border-b-2 border-pink-100">
//           <Link
//             to="/dashboard"
//             className="flex items-center gap-2 no-underline hover:opacity-80 transition-opacity duration-200"
//           >
//             <i className="fas fa-shopping-bag text-pink-500 text-2xl"></i>
//             <span className="text-pink-600 text-xl font-semibold">
//               Multi Ecom
//             </span>
//           </Link>
//         </div>


//         {/* Navigation Menu */}
//         <nav className="flex-1 p-3 overflow-y-auto">
//           <ul className="space-y-2 list-none p-0 m-0">
//             {menuItems.map((item) => (
//               <li key={item.path}>
//                 <Link
//                   to={item.path}
//                   className={`flex items-center gap-3 px-3 py-3 no-underline rounded-lg text-base font-semibold transition-all duration-200 ${
//                     location.pathname === item.path
//                       ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg'
//                       : 'text-gray-700 hover:bg-pink-50 hover:text-pink-600 hover:translate-x-1'
//                   }`}
//                   onClick={() => {
//                     if (window.innerWidth < 1024) {
//                       toggleSidebar();
//                     }
//                   }}
//                 >
//                   {item.icon}
//                   <span>{item.label}</span>
//                 </Link>
//               </li>
//             ))}
//           </ul>
//         </nav>


//         {/* Logout Button */}
//         <div className="p-3 border-t-2 border-pink-100">
//           <button
//             onClick={handleLogout}
//             className="w-full flex items-center justify-center gap-2.5 py-3 px-3 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white border-none rounded-lg text-base font-semibold cursor-pointer transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
//           >
//             <FaSignOutAlt className="text-lg" />
//             <span>Logout</span>
//           </button>
//         </div>
//       </aside>


//       {/* Custom Scrollbar Styles */}
//       <style jsx>{`
//         aside {
//           scrollbar-width: thin;
//           scrollbar-color: #ec4899 #fce7f3;
//         }
        
//         aside::-webkit-scrollbar {
//           width: 6px;
//         }
        
//         aside::-webkit-scrollbar-track {
//           background: #fce7f3;
//           border-radius: 10px;
//         }
        
//         aside::-webkit-scrollbar-thumb {
//           background: #ec4899;
//           border-radius: 10px;
//         }
        
//         aside::-webkit-scrollbar-thumb:hover {
//           background: #db2777;
//         }
//       `}</style>
//     </>
//   );
// };


// export default Sidebar;

import { useNavigate, Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaHome, FaBox, FaCog, FaSignOutAlt } from 'react-icons/fa';
import api from '../services/api';
import { clearStoredAuth } from '../utils/storage';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: <FaHome className="text-xl" />, label: 'Dashboard' },
    { path: '/products', icon: <FaBox className="text-xl" />, label: 'Products' },
    { path: '/settings', icon: <FaCog className="text-xl" />, label: 'Settings' },
  ];

  const handleLogout = async () => {
    try {
      // Call logout API - token is automatically added by api interceptor
      await api.post('/auth/logout');
      
      // Clear all stored auth data
      clearStoredAuth();
      
      toast.success('Logged out successfully!');
      navigate('/login');
      
    } catch (error) {
      // Even if API fails, clear local storage and redirect
      clearStoredAuth();
      toast.success('Logged out successfully!');
      navigate('/login');
    }
  };

  return (
    <>
      <aside
        className={`fixed top-0 left-0 h-screen w-56 bg-white border-r-2 border-pink-100 shadow-lg transition-transform duration-300 z-40 flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo/Brand Section - Height matches Header */}
        <div className="h-16 flex items-center px-3 border-b-2 border-pink-100">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 no-underline hover:opacity-80 transition-opacity duration-200"
          >
            <i className="fas fa-shopping-bag text-pink-500 text-2xl"></i>
            <span className="text-pink-600 text-xl font-semibold">
              Multi Ecom
            </span>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-3 overflow-y-auto">
          <ul className="space-y-2 list-none p-0 m-0">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-3 no-underline rounded-lg text-base font-semibold transition-all duration-200 ${
                    location.pathname === item.path
                      ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-pink-50 hover:text-pink-600 hover:translate-x-1'
                  }`}
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      toggleSidebar();
                    }
                  }}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-3 border-t-2 border-pink-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2.5 py-3 px-3 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white border-none rounded-lg text-base font-semibold cursor-pointer transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            <FaSignOutAlt className="text-lg" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        aside {
          scrollbar-width: thin;
          scrollbar-color: #ec4899 #fce7f3;
        }
        
        aside::-webkit-scrollbar {
          width: 6px;
        }
        
        aside::-webkit-scrollbar-track {
          background: #fce7f3;
          border-radius: 10px;
        }
        
        aside::-webkit-scrollbar-thumb {
          background: #ec4899;
          border-radius: 10px;
        }
        
        aside::-webkit-scrollbar-thumb:hover {
          background: #db2777;
        }
      `}</style>
    </>
  );
};

export default Sidebar;
