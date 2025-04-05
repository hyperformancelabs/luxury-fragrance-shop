import React, { useState } from 'react';

const Navigation = () => {
  const [expandedMenu, setExpandedMenu] = useState(null);

  const menuItems = [
    { id: 'hot-deal', label: 'HOT DEAL', hasDropdown: false },
    { id: 'hang-moi-ve', label: 'HÀNG MỚI VỀ', hasDropdown: false },
    { id: 'thuong-hieu', label: 'THƯƠNG HIỆU', hasDropdown: false },
    { id: 'noi-bat', label: 'NỔI BẬT', hasDropdown: false },
    { id: 'nuoc-hoa-nam', label: 'NƯỚC HOA NAM', hasDropdown: true },
    { id: 'nuoc-hoa-nu', label: 'NƯỚC HOA NỮ', hasDropdown: true },
    { id: 'nuoc-hoa-unisex', label: 'NƯỚC HOA UNISEX', hasDropdown: true },
    { id: 'blog', label: 'BLOG', hasDropdown: false },
  ];

  const handleToggleDropdown = (menuId) => {
    if (expandedMenu === menuId) {
      setExpandedMenu(null);
    } else {
      setExpandedMenu(menuId);
    }
  };

  return (
    <nav className="w-full bg-white border-b border-gray-200">
      <div className="container mx-auto">
        <ul className="flex flex-wrap justify-center md:justify-between">
          {menuItems.map((item) => (
            <li key={item.id} className="relative">
              <div className="flex items-center">
                <a
                  href={`#${item.id}`}
                  className="px-4 py-4 text-gray-800 hover:text-gray-600 font-medium text-sm"
                >
                  {item.label}
                </a>
                {item.hasDropdown && (
                  <button
                    onClick={() => handleToggleDropdown(item.id)}
                    className="ml-1 focus:outline-none"
                  >
                    {expandedMenu === item.id ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M18 15l-6-6-6 6" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    )}
                  </button>
                )}
              </div>
              {item.hasDropdown && expandedMenu === item.id && (
                <div className="absolute z-10 left-0 mt-1 w-48 bg-white shadow-lg border border-gray-200 rounded">
                  <ul>
                    <li>
                      <a
                        href="#subcategory-1"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Subcategory 1
                      </a>
                    </li>
                    <li>
                      <a
                        href="#subcategory-2"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Subcategory 2
                      </a>
                    </li>
                    <li>
                      <a
                        href="#subcategory-3"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Subcategory 3
                      </a>
                    </li>
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;