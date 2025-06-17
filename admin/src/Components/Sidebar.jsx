import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BarChart2, Package, Tag, ShoppingBag, TrendingUp, DollarSign, Users, Settings, X, Menu, LogOut, User2 } from 'lucide-react';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const [showLabels, setShowLabels] = useState(sidebarOpen);
  
  // Delay showing labels until sidebar is fully expanded
  useEffect(() => {
    let timer;
    if (sidebarOpen) {
      timer = setTimeout(() => {
        setShowLabels(true);
      }, 150); // Half of the transition duration
    } else {
      setShowLabels(false);
    }
    
    return () => clearTimeout(timer);
  }, [sidebarOpen]);

  const navItems = [
    { icon: <Home size={20} />, label: 'Tổng quan', path: '/dashboard' },
    { icon: <BarChart2 size={20} />, label: 'Thống kê', path: '/statistics' },
    { icon: <Package size={20} />, label: 'Đơn hàng', path: '/orders' },
    { icon: <Tag size={20} />, label: 'Sản phẩm', path: '/products' },
    { icon: <Users size={20} /> , label: 'Khách hàng', path:'/customers' },
    { icon: <ShoppingBag size={20} />, label: 'Vật tư' , path: '/materials'},
    { icon: <TrendingUp size={20} />, label: 'Marketing', path: '/marketings' },
    { icon: <User2 size={20} />, label: 'Nhân viên' , path: '/staffs'},
  ];

  return (
    <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-md transition-all duration-300 fixed h-full z-10 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
      <div className="flex items-center justify-end p-4 border-b md:hidden">
        <button onClick={() => setSidebarOpen(false)} className="p-1 rounded-full hover:bg-gray-100">
          <X size={20} />
        </button>
      </div>

      <nav className="p-4 pt-20">
        <ul className="space-y-2">
          {navItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.path}
                className={`flex items-center w-full p-3 rounded-lg ${
                  location.pathname === item.path ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className={`flex items-center justify-center ${sidebarOpen ? '' : 'w-full'} ${location.pathname === item.path ? 'text-blue-600' : 'text-gray-500'}`}>
                  {item.icon}
                </div>
                {showLabels && (
                  <span className={`ml-3 whitespace-nowrap transition-opacity duration-150 ${showLabels ? 'opacity-100' : 'opacity-0'}`}>
                    {item.label}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
