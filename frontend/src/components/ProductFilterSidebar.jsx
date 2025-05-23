// src/components/ProductFilterSidebar.js

import React, { useState, useEffect } from "react";

const ProductFilterSidebar = ({ onFilterChange, onPriceChange, initialFilters, initialPrice, gender }) => {
  const [selectedFilters, setSelectedFilters] = useState({
    brands: initialFilters?.brands || [],
    style: initialFilters?.style || [], // Singular key
    toneScent: initialFilters?.toneScent || [], // Singular key
    suitableGender: initialFilters?.suitableGender || [] // Singular key
  });

  const [priceRange, setPriceRange] = useState({
    min: 124200, // Default, will be updated from API
    max: 56531700, // Default, will be updated from API
    current: initialPrice || 56531700 
  });

  const [apiFilterOptions, setApiFilterOptions] = useState({
    brands: [],
    style: [],
    toneScent: [],
    suitableGender: []
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerms, setSearchTerms] = useState({
    brands: "",
    style: "",
    toneScent: "",
    suitableGender: ""
  });

  const handleSearchChange = (categoryKey, value) => {
    setSearchTerms(prev => ({
      ...prev,
      [categoryKey]: value
    }));
  };

  const getFilteredOptions = (categoryKey, options) => {
    const searchTerm = searchTerms[categoryKey]?.toLowerCase() || "";
    if (!searchTerm) return options;
    
    return options.filter(option => 
      option.name.toLowerCase().includes(searchTerm)
    );
  };
  
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .scrollbar::-webkit-scrollbar {
        width: 4px;
        height: 4px;
      }
      .scrollbar::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 10px;
      }
      .scrollbar::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 10px;
      }
      .scrollbar::-webkit-scrollbar-thumb:hover {
        background: #555;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    const fetchFilterData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:8080/api/v1/products/filter-options");
        const result = await response.json();
        
        if (result.status === "success" && result.data) {
          const data = result.data;
          // Format options with a dummy count for display, API doesn't provide counts here
          const formatOptions = (items) => (items || []).map(item => ({ // Added (items || []) for safety
            name: item, 
            count: Math.floor(Math.random() * 50) + 1 
          }));

          setApiFilterOptions({
            brands: formatOptions(data.brands),
            style: formatOptions(data.productDetails?.style),
            toneScent: formatOptions(data.productDetails?.toneScent),
            suitableGender: formatOptions(data.productDetails?.suitableGender)
          });
          
          setPriceRange(prev => ({
            min: data.priceRange?.min || prev.min,
            max: data.priceRange?.max || prev.max,
            current: initialPrice !== undefined ? initialPrice : (data.priceRange?.max || prev.max)
          }));
          setError(null);
        } else {
          throw new Error(result.message || "Failed to fetch filter options");
        }
      } catch (err) {
        console.error("Error fetching filter data:", err);
        setError("Không thể tải dữ liệu bộ lọc. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFilterData();
  }, [initialPrice]); // Rerun if initialPrice changes, though typically it's static

  useEffect(() => {
    if (onFilterChange && !isLoading) {
      onFilterChange(selectedFilters);
    }
  }, [selectedFilters, isLoading, onFilterChange]);

  useEffect(() => {
    if (onPriceChange && !isLoading) {
      onPriceChange(priceRange.current);
    }
  }, [priceRange.current, isLoading, onPriceChange]);
  
  const filterCategoriesConfig = [
    { title: "Thương hiệu", optionsKey: "brands", data: apiFilterOptions.brands },
    { title: "Phong cách", optionsKey: "style", data: apiFilterOptions.style },
    { title: "Tone hương", optionsKey: "toneScent", data: apiFilterOptions.toneScent },
    ...(gender || !apiFilterOptions.suitableGender || apiFilterOptions.suitableGender.length === 0 ? [] : [ // Conditionally show gender filter
      { title: "Giới tính", optionsKey: "suitableGender", data: apiFilterOptions.suitableGender }
    ])
  ];

  const handleCheckboxChange = (filterKey, value) => {
    setSelectedFilters(prev => {
      const currentValues = prev[filterKey] || []; // Ensure currentValues is an array
      return {
        ...prev,
        [filterKey]: currentValues.includes(value)
          ? currentValues.filter(item => item !== value)
          : [...currentValues, value]
      };
    });
  };

  const resetFilters = () => {
    setSelectedFilters({
      brands: [],
      style: [],
      toneScent: [],
      suitableGender: []
    });
    setPriceRange(prev => ({
      ...prev,
      current: prev.max 
    }));
    setSearchTerms({
      brands: "",
      style: "",
      toneScent: "",
      suitableGender: ""
    });
    // Note: This internal reset will trigger onFilterChange and onPriceChange,
    // allowing the parent component to react.
  };

  const formatPriceDisplay = (price) => {
    if (typeof price !== 'number') return 'N/A';
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  if (isLoading) {
    // Skeleton loader remains the same
    return (
      <div className="w-full md:w-64 md:pr-6 mb-6 md:mb-0 animate-pulse">
        <div className="h-10 bg-gray-200 rounded mb-6"></div>
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="mb-6">
            <div className="h-6 bg-gray-200 rounded mb-2 w-24"></div>
            <div className="h-8 bg-gray-200 rounded mb-2"></div>
            <div className="space-y-2">
              {[1, 2, 3].map(j => (
                <div key={j} className="h-5 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    // Error display remains the same
    return (
      <div className="w-full md:w-64 md:pr-6 mb-6 md:mb-0">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
          <button 
            className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={() => window.location.reload()}
          >
            Tải lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full md:w-64 md:pr-6 mb-6 md:mb-0">
      <div className="mb-6">
        <button className="bg-gray-800 text-white px-4 py-2 rounded flex items-center text-sm w-full md:w-auto">
          <span>Lọc sản phẩm theo</span>
          <svg
            className="w-4 h-4 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </button>
      </div>

      {filterCategoriesConfig.map((category) => {
        // Ensure category.data is an array before mapping
        const categoryOptions = Array.isArray(category.data) ? category.data : [];
        const displayOptions = getFilteredOptions(category.optionsKey, categoryOptions);

        return (
          <div key={category.optionsKey} className="mb-6">
            <h3 className="font-semibold mb-2">{category.title}</h3>
            
            <div className="mb-2 relative">
              <input
                type="text"
                placeholder={`Tìm ${category.title.toLowerCase()}...`}
                value={searchTerms[category.optionsKey]}
                onChange={(e) => handleSearchChange(category.optionsKey, e.target.value)}
                className="w-full p-1 text-sm border border-gray-300 rounded pl-7"
              />
              <svg 
                className="w-4 h-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" 
                fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
              > <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path> </svg>
              {searchTerms[category.optionsKey] && (
                <button
                  onClick={() => handleSearchChange(category.optionsKey, "")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                > <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg> </button>
              )}
            </div>
            
            <div className="max-h-56 overflow-y-auto scrollbar pr-1">
              <ul className="space-y-1">
                {displayOptions.map((option, idx) => (
                  <li key={`${category.optionsKey}-${option.name}-${idx}`} className="flex items-center mb-1">
                    <input
                      type="checkbox"
                      id={`${category.optionsKey}-${option.name}`}
                      checked={selectedFilters[category.optionsKey]?.includes(option.name)}
                      onChange={() => handleCheckboxChange(category.optionsKey, option.name)}
                      className="mr-2"
                    />
                    <label
                      htmlFor={`${category.optionsKey}-${option.name}`}
                      className="text-sm flex justify-between w-full cursor-pointer"
                    >
                      <span className="truncate pr-2">{option.name}</span>
                      <span className="text-gray-500 flex-shrink-0">({option.count})</span>
                    </label>
                  </li>
                ))}
                {displayOptions.length === 0 && (
                  <li className="text-sm text-gray-500 py-1">Không tìm thấy kết quả</li>
                )}
              </ul>
            </div>
          </div>
        );
      })}

      <div className="mb-6">
        <h3 className="font-semibold mb-2">Khoảng giá</h3>
        <div className="flex justify-between text-sm mb-2">
          <span>{formatPriceDisplay(priceRange.min)}</span>
          <span>{formatPriceDisplay(priceRange.current)}</span>
        </div>
        <input
          type="range"
          className="w-full"
          min={priceRange.min}
          max={priceRange.max}
          step={Math.max(1, (priceRange.max - priceRange.min) / 100)} 
          value={priceRange.current}
          onChange={(e) => setPriceRange(prev => ({
            ...prev,
            current: Number(e.target.value)
          }))}
          disabled={priceRange.min >= priceRange.max}
        />
      </div>

      {/* Decide if this internal reset button is needed, or if parent's reset is sufficient
      <div className="mb-6">
        <button
          className="bg-red-600 text-white w-full py-2 rounded hover:bg-red-700 transition"
          onClick={resetFilters}
        >
          Xóa bộ lọc
        </button>
      </div> 
      */}
    </div>
  );
};

export default ProductFilterSidebar;