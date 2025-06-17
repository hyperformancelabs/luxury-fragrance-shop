import React, { useState, useEffect } from "react";

const ProductFilterSidebar = ({ onFilterChange, onPriceChange, initialFilters, initialPrice, gender }) => {
  // Removed internal state for selectedFilters and priceRange.
  // These are now fully controlled by props from the parent component.

  const [apiFilterOptions, setApiFilterOptions] = useState({
    brands: [],
    style: [],
    toneScent: [],
    suitableGender: [],
    priceRange: { min: 0, max: 56531700 } // Initialize priceRange in API options
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
          const formatOptions = (items) => (items || []).map(item => ({
            name: item, 
            count: Math.floor(Math.random() * 50) + 1 
          }));

          setApiFilterOptions({
            brands: formatOptions(data.brands),
            style: formatOptions(data.productDetails?.style),
            toneScent: formatOptions(data.productDetails?.toneScent),
            suitableGender: formatOptions(data.productDetails?.suitableGender),
            priceRange: data.priceRange || { min: 0, max: 56531700 } // Ensure priceRange is set
          });
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
  }, []); // Empty dependency array: run once on mount

  // No longer need useEffect for initialFilters and initialPrice as component is now controlled

  const filterCategoriesConfig = [
    { title: "Thương hiệu", optionsKey: "brands", data: apiFilterOptions.brands },
    { title: "Phong cách", optionsKey: "style", data: apiFilterOptions.style },
    { title: "Tone hương", optionsKey: "toneScent", data: apiFilterOptions.toneScent },
    ...(gender || !apiFilterOptions.suitableGender || apiFilterOptions.suitableGender.length === 0 ? [] : [
      { title: "Giới tính", optionsKey: "suitableGender", data: apiFilterOptions.suitableGender }
    ])
  ];

  const handleCheckboxChange = (filterKey, value) => {
    // Directly use initialFilters and call onFilterChange
    const currentValues = initialFilters[filterKey] || [];
    const newFilters = {
      ...initialFilters,
      [filterKey]: currentValues.includes(value)
        ? currentValues.filter(item => item !== value)
        : [...currentValues, value]
    };
    onFilterChange(newFilters);
  };

  const resetFilters = () => {
    // Call onFilterChange and onPriceChange with default values
    onFilterChange({ brands: [], style: [], toneScent: [], suitableGender: [] });
    onPriceChange({
      minPrice: apiFilterOptions.priceRange.min,
      maxPrice: apiFilterOptions.priceRange.max,
      current: apiFilterOptions.priceRange.max // Reset to max of API range
    });
    setSearchTerms({
      brands: "",
      style: "",
      toneScent: "",
      suitableGender: ""
    });
  };

  const formatPriceDisplay = (price) => {
    if (typeof price !== 'number') return 'N/A';
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  if (isLoading) {
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
            fill="currentColor"
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
                      checked={initialFilters[category.optionsKey]?.includes(option.name)} // Use initialFilters
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
          <span>{formatPriceDisplay(apiFilterOptions.priceRange.min)}</span> {/* Use apiFilterOptions for min/max display */}
          <span>{formatPriceDisplay(initialPrice.current)}</span> {/* Use initialPrice.current for current value */}
        </div>
        <input
          type="range"
          className="w-full"
          min={apiFilterOptions.priceRange.min} // Use apiFilterOptions for min/max range
          max={apiFilterOptions.priceRange.max} // Use apiFilterOptions for min/max range
          step={Math.max(1, (apiFilterOptions.priceRange.max - apiFilterOptions.priceRange.min) / 100)} 
          value={initialPrice.current} // Use initialPrice.current
          onChange={(e) => {
            const newPrice = Number(e.target.value);
            onPriceChange({ minPrice: apiFilterOptions.priceRange.min, maxPrice: newPrice, current: newPrice }); // Pass updated object
          }}
          disabled={apiFilterOptions.priceRange.min >= apiFilterOptions.priceRange.max}
        />
      </div>

    </div>
  );
};

export default ProductFilterSidebar; 