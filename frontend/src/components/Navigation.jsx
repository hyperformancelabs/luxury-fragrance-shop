import React, { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const mobileButtonRef = useRef(null);

  const menuItems = [
    { id: 'flash-deal', label: 'FLASH DEALS' },
    { id: 'brand', label: 'THƯƠNG HIỆU' },
    { id: 'new-product', label: 'BỘ SƯU TẬP' },
    { id: 'noi-bat', label: 'NỔI BẬT' },
    { id: 'nuoc-hoa-nam', label: 'NƯỚC HOA NAM', gender: 'Men' },
    { id: 'nuoc-hoa-nu', label: 'NƯỚC HOA NỮ', gender: 'Women' },
    { id: 'nuoc-hoa-unisex', label: 'NƯỚC HOA UNISEX', gender: 'Unisex' },
    { id: 'blog', label: 'BLOG' },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuOpen &&
        mobileMenuRef.current &&
        mobileButtonRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !mobileButtonRef.current.contains(event.target)
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const getLink = (item) =>
    item.gender ? `/category?gender=${item.gender}` : `/${item.id}`;

  return (
    <nav className="w-full bg-white border-b border-gray-200 relative py-2">
      <div className="container mx-auto">
        {/* Desktop menu */}
        <div className="hidden lg:block">
          <ul className="flex flex-wrap justify-between h-10">
            {menuItems.map((item) => (
              <li key={item.id} className="relative group p-2">
                <Link
                  to={getLink(item)}
                  className="text-gray-800 hover:text-red-600 font-medium text-sm relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-red-500 after:w-0 group-hover:after:w-full after:transition-all after:duration-500"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile menu button */}
        <div className="lg:hidden flex justify-center py-2" ref={mobileButtonRef}>
          <button
            className="text-gray-700 px-4 py-2 border border-gray-300 rounded-md flex items-center"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="mr-2 font-medium">Danh mục</span>
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu overlay */}
        {mobileMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div
              className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-xl overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
              ref={mobileMenuRef}
            >
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-bold text-lg text-gray-800">Danh mục sản phẩm</h3>
                <button onClick={() => setMobileMenuOpen(false)}>
                  <X size={24} className="text-gray-500" />
                </button>
              </div>

              <ul className="py-2">
                {menuItems.map((item) => (
                  <li key={item.id} className="border-b border-gray-100">
                    <div className="px-4 py-3">
                      <Link
                        to={getLink(item)}
                        className="text-gray-800 font-medium block"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Horizontal scroll (for small mobile) */}
        <div className="lg:hidden md:block hidden overflow-x-auto scrollbar-hide">
          <ul className="flex whitespace-nowrap py-1">
            {menuItems.map((item) => (
              <li key={item.id} className="relative">
                <Link
                  to={getLink(item)}
                  className="px-3 py-3 text-gray-800 hover:text-red-600 font-medium text-xs inline-block"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
