import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp, Menu, X } from 'lucide-react';

const Navigation = () => {
  const [expandedMenu, setExpandedMenu] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const mobileButtonRef = useRef(null);

  const menuItems = [
    { id: 'hot-deal', label: 'HOT DEAL', hasDropdown: false },
    { id: 'hang-moi-ve', label: 'HÀNG MỚI VỀ', hasDropdown: false },
    { id: 'thuong-hieu', label: 'THƯƠNG HIỆU', hasDropdown: true, subcategories: [
      { id: 'chanel', label: 'Chanel' },
      { id: 'dior', label: 'Dior' },
      { id: 'gucci', label: 'Gucci' },
      { id: 'hermes', label: 'Hermes' },
    ] },
    { id: 'noi-bat', label: 'NỔI BẬT', hasDropdown: false },
    { id: 'nuoc-hoa-nam', label: 'NƯỚC HOA NAM', hasDropdown: true, subcategories: [
      { id: 'nuoc-hoa-nam-mini', label: 'Nước hoa nam mini' },
      { id: 'nuoc-hoa-nam-chiet', label: 'Nước hoa nam chiết' },
      { id: 'nuoc-hoa-nam-full', label: 'Nước hoa nam fullsize' },
    ] },
    { id: 'nuoc-hoa-nu', label: 'NƯỚC HOA NỮ', hasDropdown: true, subcategories: [
      { id: 'nuoc-hoa-nu-mini', label: 'Nước hoa nữ mini' },
      { id: 'nuoc-hoa-nu-chiet', label: 'Nước hoa nữ chiết' },
      { id: 'nuoc-hoa-nu-full', label: 'Nước hoa nữ fullsize' },
    ] },
    { id: 'nuoc-hoa-unisex', label: 'NƯỚC HOA UNISEX', hasDropdown: true, subcategories: [
      { id: 'nuoc-hoa-unisex-mini', label: 'Nước hoa unisex mini' },
      { id: 'nuoc-hoa-unisex-chiet', label: 'Nước hoa unisex chiết' },
      { id: 'nuoc-hoa-unisex-full', label: 'Nước hoa unisex fullsize' },
    ] },
    { id: 'blog', label: 'BLOG', hasDropdown: false },
  ];

  const handleToggleDropdown = (menuId) => {
    if (expandedMenu === menuId) {
      setExpandedMenu(null);
    } else {
      setExpandedMenu(menuId);
    }
  };

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

  return (
    <nav className="w-full bg-white border-b border-gray-200 relative">
      <div className="container mx-auto">
        <div className="hidden lg:block">
          <ul className="flex flex-wrap justify-between">
            {menuItems.map((item) => (
              <li key={item.id} className="relative group">
                <div className="flex items-center">
                  <a
                    href={`#${item.id}`}
                    className="px-3 py-4 text-gray-800 hover:text-red-600 font-medium text-sm whitespace-nowrap"
                  >
                    {item.label}
                  </a>
                  {item.hasDropdown && (
                    <button
                      onClick={() => handleToggleDropdown(item.id)}
                      className="ml-1 focus:outline-none"
                    >
                      {expandedMenu === item.id ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </button>
                  )}
                </div>
                
                {item.hasDropdown && (
                  <div className={`absolute z-10 left-0 mt-0 w-56 bg-white shadow-lg border border-gray-200 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ${expandedMenu === item.id ? 'opacity-100 visible' : ''}`}>
                    <ul>
                      {item.subcategories?.map((subcat) => (
                        <li key={subcat.id}>
                          <a
                            href={`#${subcat.id}`}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600"
                          >
                            {subcat.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
        
        {/* <div className="lg:hidden flex justify-center py-2" ref={mobileButtonRef}>
          <button 
            className="text-gray-700 px-4 py-2 border border-gray-300 rounded-md flex items-center"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="mr-2 font-medium">Danh mục</span>
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        

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
                    <div className="flex items-center justify-between px-4 py-3">
                      <a
                        href={`#${item.id}`}
                        className="text-gray-800 font-medium"
                        onClick={(e) => {
                          if (item.hasDropdown) {
                            e.preventDefault();
                            handleToggleDropdown(item.id);
                          } else {
                            setMobileMenuOpen(false);
                          }
                        }}
                      >
                        {item.label}
                      </a>
                      {item.hasDropdown && (
                        <button
                          onClick={() => handleToggleDropdown(item.id)}
                          className="p-1 focus:outline-none"
                        >
                          {expandedMenu === item.id ? (
                            <ChevronUp size={20} className="text-gray-500" />
                          ) : (
                            <ChevronDown size={20} className="text-gray-500" />
                          )}
                        </button>
                      )}
                    </div>
                    
       
                    {item.hasDropdown && expandedMenu === item.id && (
                      <div className="bg-gray-50 py-2">
                        <ul>
                          {item.subcategories?.map((subcat) => (
                            <li key={subcat.id}>
                              <a
                                href={`#${subcat.id}`}
                                className="block px-8 py-2 text-sm text-gray-700 hover:text-red-600"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                {subcat.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )} */}
        
        <div className="lg:hidden md:block hidden overflow-x-auto scrollbar-hide">
          <ul className="flex whitespace-nowrap py-1">
            {menuItems.map((item) => (
              <li key={item.id} className="relative">
                <a
                  href={`#${item.id}`}
                  className="px-3 py-3 text-gray-800 hover:text-red-600 font-medium text-xs inline-block"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;