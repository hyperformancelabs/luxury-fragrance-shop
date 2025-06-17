// src/pages/ProductListByGender.js

import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import QuickView from "../components/QuickView";
import ProductFilterSidebar from "../components/ProductFilterSidebar";
import { Eye, Heart, Filter /* Check */ } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import ErrorMessages from "../constants/ErrorMessages.js";

const DEFAULT_MAX_PRICE = 56531700; // Fallback if API doesn't provide one initially
const DEFAULT_FILTERS = { brands: [], style: [], toneScent: [], suitableGender: [] };
const DEFAULT_PRICE_RANGE = { minPrice: 0, maxPrice: DEFAULT_MAX_PRICE, current: DEFAULT_MAX_PRICE };

const ProductListByGender = () => {
  const [searchParams] = useSearchParams();
  const gender = searchParams.get("gender") || "Unisex";
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Applied filters (trigger product fetch)
  const [appliedPriceRange, setAppliedPriceRange] = useState(DEFAULT_PRICE_RANGE);
  const [appliedFilters, setAppliedFilters] = useState(DEFAULT_FILTERS);

  // Filters being edited in the sidebar (pending)
  const [sidebarPriceRange, setSidebarPriceRange] = useState(DEFAULT_PRICE_RANGE);
  const [sidebarFilters, setSidebarFilters] = useState(DEFAULT_FILTERS);

  const [apiFilterOptions, setApiFilterOptions] = useState({
    brands: [],
    style: [],
    toneScent: [],
    suitableGender: [],
    priceRange: { min: 0, max: DEFAULT_MAX_PRICE } // Ensure it has default structure
  });

  const [showVolumePopup, setShowVolumePopup] = useState(false);
  const [volumeOptions, setVolumeOptions] = useState([]);
  const [popupTargetProduct, setPopupTargetProduct] = useState(null);
  
  const [isFiltersApplied, setIsFiltersApplied] = useState(false);
  
  const [sortBy, setSortBy] = useState("price"); // Default sort to price
  const [sortDir, setSortDir] = useState("asc"); // Default sort direction

  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const pageSize = 25;

  // State to track if initial states are set
  const [initialStatesSet, setInitialStatesSet] = useState(false);

  // 1. Fetch API filter options once on mount
  useEffect(() => {
    axios.get("http://localhost:8080/api/v1/products/filter-options")
      .then(response => {
        if (response.data && response.data.data) {
          const data = response.data.data;
          const apiMin = data.priceRange?.min || 0;
          const apiMax = data.priceRange?.max || DEFAULT_MAX_PRICE;
          setApiFilterOptions(prev => ({
            ...prev,
            brands: data.brands || [],
            style: data.productDetails?.style || [],
            toneScent: data.productDetails?.toneScent || [],
            suitableGender: data.productDetails?.suitableGender || [],
            priceRange: { min: apiMin, max: apiMax } // Ensure priceRange is set correctly
          }));
        }
      })
      .catch(err => {
        console.error("Error fetching initial filter options:", err);
        // Fallback to default if API fails
        setApiFilterOptions(prev => ({ ...prev, priceRange: DEFAULT_PRICE_RANGE }));
      });
  }, []); // Empty dependency array: run once on mount

  // 2. Initialize applied and sidebar filters/price range ONLY when apiFilterOptions is loaded
  useEffect(() => {
    if (apiFilterOptions.brands.length > 0 && !initialStatesSet) { // Check for some data to ensure API options are loaded
        const initialApiMin = apiFilterOptions.priceRange.min;
        const initialApiMax = apiFilterOptions.priceRange.max;

        // Set initial applied filters/price range
        setAppliedFilters({ ...DEFAULT_FILTERS });
        setAppliedPriceRange({ minPrice: initialApiMin, maxPrice: initialApiMax, current: initialApiMax });

        // Set initial sidebar filters/price range
        setSidebarFilters({ ...DEFAULT_FILTERS });
        setSidebarPriceRange({ minPrice: initialApiMin, maxPrice: initialApiMax, current: initialApiMax });

        setInitialStatesSet(true); // Mark as set to prevent re-running
    }
  }, [apiFilterOptions, initialStatesSet]); // Depend on apiFilterOptions and initialStatesSet


  const fetchProductsCallback = useCallback(async (currentFilters, currentPriceRange, page, currentSortBy, currentSortDir) => {
    setLoading(true);
    setError("");

    const endpoint = `http://localhost:8080/api/v1/products/filter`;
    
    let apiSortByValue = "price";
    let apiSortDirValue = "asc";

    if (currentSortBy === "Giá thấp đến cao") {
      apiSortByValue = "price";
      apiSortDirValue = "asc";
    } else if (currentSortBy === "Giá cao đến thấp") {
      apiSortByValue = "price";
      apiSortDirValue = "desc";
    } else if (currentSortBy === "A–Z") {
      apiSortByValue = "name";
      apiSortDirValue = "asc";
    }

    const payload = {
      brands: currentFilters.brands?.length > 0 ? currentFilters.brands : undefined,
      productDetails: {},
      minPrice: currentPriceRange.minPrice,
      maxPrice: currentPriceRange.maxPrice,
    };

    if (currentFilters.style?.length > 0) {
      payload.productDetails.style = currentFilters.style;
    }
    if (currentFilters.toneScent?.length > 0) {
      payload.productDetails.toneScent = currentFilters.toneScent;
    }
    
    let suitableGenderFilterValues = [];
    if (currentFilters.suitableGender?.length > 0) {
      suitableGenderFilterValues = currentFilters.suitableGender;
    } else if (gender && gender !== "Unisex") {
      suitableGenderFilterValues = [gender]; // Default gender for the page if no specific gender filter chosen
    }

    if (suitableGenderFilterValues.length > 0) {
      payload.productDetails.suitableGender = suitableGenderFilterValues;
    }

    try {
      const response = await axios.post(endpoint, payload, {
        params: {
          page: page,
          size: pageSize,
          sortBy: apiSortByValue,
          sortDir: apiSortDirValue
        }
      });
      const { items, totalPages: newTotalPages } = response.data.data || {};

      if (!Array.isArray(items) || typeof newTotalPages !== "number") {
        throw new Error(ErrorMessages.INVALID_RESPONSE);
      }
      
      setProducts(items);
      setTotalPages(newTotalPages);

    } catch (err) {
      console.error(`Lỗi khi tải sản phẩm:`, err);
      setError(err.message === ErrorMessages.INVALID_RESPONSE ? ErrorMessages.INVALID_RESPONSE : ErrorMessages.PRODUCT_LOAD_FAIL);
    } finally {
      setTimeout(() => setLoading(false), 300);
    }
  }, [gender, pageSize, apiFilterOptions]); // apiFilterOptions is now a dependency

  // Effect to trigger fetch when relevant states change, only after initial setup
  useEffect(() => {
    if (initialStatesSet) { // Only fetch products after initial states are set
        fetchProductsCallback(appliedFilters, appliedPriceRange, currentPage, sortBy, sortDir);
    }
  }, [currentPage, sortBy, sortDir, appliedFilters, appliedPriceRange, fetchProductsCallback, initialStatesSet]);

  // Effect to reset to page 0 when gender, sort, or initial states are set (no longer watching applied filters directly for reset)
  useEffect(() => {
    if (initialStatesSet) {
      // This effect primarily handles changes to gender or sort options that should reset the page.
      // Applied filters and price range changes trigger page reset via applyFilters/clearFilters.
      setCurrentPage(0);
    } else {
      // During initial load, keep page at 0.
      setCurrentPage(0);
    }
  }, [gender, sortBy, sortDir, initialStatesSet]);
  
  // Effect to determine if any filters are actively applied
  useEffect(() => {
    const hasActiveFilters = 
      (appliedFilters.brands && appliedFilters.brands.length > 0) ||
      (appliedFilters.style && appliedFilters.style.length > 0) ||
      (appliedFilters.toneScent && appliedFilters.toneScent.length > 0) ||
      (appliedFilters.suitableGender && appliedFilters.suitableGender.length > 0) ||
      appliedPriceRange.minPrice > apiFilterOptions.priceRange.min ||
      appliedPriceRange.maxPrice < apiFilterOptions.priceRange.max;

    setIsFiltersApplied(hasActiveFilters);
  }, [appliedFilters, appliedPriceRange, apiFilterOptions]);


  const handleQuickView = (product) => {
    setSelectedProduct(product);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedProduct(null);
  };

  const handleClickProduct = (id) => {
    navigate(`/products/${id}`);
  };

  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages && page !== currentPage) {
      setCurrentPage(page);
      window.scrollTo(0, 0);
    }
  };

  // Callbacks for ProductFilterSidebar to update pending filters
  const handleFilterChange = useCallback((newFilters) => {
    setSidebarFilters({ ...newFilters }); // Ensure new object reference
  }, []);
  
  const handlePriceChange = useCallback((priceRangeObj) => {
    setSidebarPriceRange({ ...priceRangeObj }); // Ensure new object reference
  }, []);
  
  const applyFilters = () => {
    setAppliedFilters({ ...sidebarFilters }); // Apply pending filters to main filter state
    setAppliedPriceRange({ ...sidebarPriceRange }); // Apply pending price range
    setCurrentPage(0); // Explicitly reset page to 0 when applying new filters
  };
  
  const clearFilters = () => {
    const defaultFilters = DEFAULT_FILTERS;
    const defaultPriceRange = apiFilterOptions.priceRange; // Use the actual API default range

    setSidebarFilters({ ...defaultFilters }); // Reset sidebar's pending filters
    setSidebarPriceRange({ ...defaultPriceRange, current: defaultPriceRange.max }); // Reset sidebar's pending price range

    setAppliedFilters({ ...defaultFilters }); // Reset applied filters (triggers fetch)
    setAppliedPriceRange({ ...defaultPriceRange, current: defaultPriceRange.max }); // Reset applied price range (triggers fetch)
    setSortBy("price"); // Reset sort to default
    setSortDir("asc"); // Reset sort direction to default
    setCurrentPage(0); // Explicitly reset page to 0 when clearing filters
  };

  const sortOptions = [
    { label: "Giá thấp đến cao", sortBy: "price", sortDir: "asc" },
    { label: "Giá cao đến thấp", sortBy: "price", sortDir: "desc" },
    { label: "A–Z", sortBy: "name", sortDir: "asc" }
  ];

  const renderPagination = () => (
    <div className="flex justify-center items-center mt-8 mb-6 gap-2">
      <button
        className={`px-3 py-1 border rounded ${ currentPage === 0 ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-100" }`}
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 0}
      > {"<"} </button>
      {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
        let pageNum;
        if (totalPages <= 5) pageNum = idx;
        else if (currentPage < 3) pageNum = idx;
        else if (currentPage > totalPages - 3) pageNum = totalPages - 5 + idx;
        else pageNum = currentPage - 2 + idx;
        if (pageNum < 0 || pageNum >= totalPages) return null; // Boundary check
        return (
          <button key={pageNum}
            className={`px-3 py-1 border rounded ${ currentPage === pageNum ? "bg-gray-800 text-white" : "hover:bg-gray-100"}`}
            onClick={() => handlePageChange(pageNum)}
          > {pageNum + 1} </button>
        );
      })}
      <button
        className={`px-3 py-1 border rounded ${ currentPage >= totalPages - 1 ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-100" }`}
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages - 1 || totalPages === 0}
      > {">"} </button>
    </div>
  );

  // Wishlist handler with volume selection popup
  const handleWishlistClick = (e, product) => {
    e.stopPropagation();
    const volumePrices = product.volumePrices || [];
    if (volumePrices.length === 0) {
      console.warn(ErrorMessages.WISHLIST_ERROR); return;
    }
    if (volumePrices.length === 1) {
      const variantId = volumePrices[0].productVariantId;
      if (isInWishlist(variantId)) removeFromWishlist(variantId);
      else addToWishlist(variantId);
    } else {
      setPopupTargetProduct(product);
      setVolumeOptions(volumePrices);
      setShowVolumePopup(true);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-gray-900 text-white p-4">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center text-sm">
            <a href="/" className="hover:underline">TRANG CHỦ</a> <span className="mx-2">/</span>
            <a href="/category" className="hover:underline">DANH MỤC</a> <span className="mx-2">/</span>
            NƯỚC HOA {gender === "Men" ? "NAM" : gender === "Women" ? "NỮ" : "UNISEX"}
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4 flex flex-col md:flex-row">
        <div className="md:w-64 flex-shrink-0">
          <ProductFilterSidebar 
            onFilterChange={handleFilterChange} 
            onPriceChange={handlePriceChange}
            initialFilters={sidebarFilters} // Pass sidebar's current state as initial
            initialPrice={sidebarPriceRange} // Pass sidebar's current state as initial
            gender={gender}
          />
          
          <div className="mt-4 mb-6 space-y-2">
            <button
              className="bg-gray-800 text-white px-12 py-2 rounded hover:bg-gray-900 transition flex items-center justify-center gap-2 w-full"
              onClick={applyFilters}
            > <Filter size={16} /> Áp dụng bộ lọc </button>
            {isFiltersApplied && (
                 <button
                    onClick={clearFilters}
                    className="bg-red-600 text-white px-12 py-2 rounded hover:bg-red-700 transition flex items-center justify-center gap-2 w-full"
                > Xóa bộ lọc </button>
            )}
          </div>
        </div>
        
        <div className="flex-1 md:pl-6">
          <div className="flex flex-wrap justify-between items-center mb-6">
            <h1 className="text-2xl font-bold mb-2 md:mb-0">
              Nước hoa {gender === "Men" ? "Nam" : gender === "Women" ? "Nữ" : "Unisex"}
            </h1>
            
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm">Sắp xếp theo:</span>
              <div className="flex flex-wrap gap-2">
                {sortOptions.map((option) => (
                  <button key={option.label}
                    className={`px-3 py-1 border rounded text-sm ${ sortBy === option.sortBy && sortDir === option.sortDir ? "bg-gray-800 text-white" : "hover:bg-gray-100" }`}
                    onClick={() => { setSortBy(option.sortBy); setSortDir(option.sortDir); }}
                  > {option.label} </button>
                ))}
              </div>
            </div>
          </div>
          
          {error && <p className="text-center text-red-500 py-4">{error}</p>}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {loading ? (
              Array.from({ length: pageSize }).map((_, index) => (
                <div key={`skeleton-${index}`} className="bg-white rounded shadow overflow-hidden animate-pulse">
                  <div className="w-full h-48 bg-gray-200"></div>
                  <div className="p-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto mb-3"></div>
                    <div className="flex justify-center gap-2 mt-2"><div className="h-4 bg-gray-200 rounded w-1/4"></div></div>
                    <div className="mt-3 flex justify-between"><div className="h-8 bg-gray-200 rounded w-full"></div></div>
                  </div>
                </div>
              ))
            ) : products.length === 0 && !error ? (
                <div className="col-span-full text-center py-10">
                     <p className="text-gray-500">Không tìm thấy sản phẩm phù hợp với tiêu chí tìm kiếm.</p>
                </div>
            ) : (
              products.map((product) => {
                  const firstVariant = product.volumePrices?.[0];
                  const isWishlisted = firstVariant ? isInWishlist(firstVariant.productVariantId) : false; 
                  return (
                    <div key={product.productId} className="bg-white rounded shadow overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
                      <div className="relative cursor-pointer h-[200px] overflow-hidden" onClick={() => handleClickProduct(product.productId)}>
                        <img src={product.imageUrl || "/stamp.png"} alt={product.productName}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          onError={(e) => { e.target.src = "/stamp.png"; }}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <button className="bg-white text-gray-800 rounded-full p-2 transform hover:scale-110 transition-transform duration-300"
                            onClick={(e) => { e.stopPropagation(); handleQuickView(product); }}
                          > <Eye size={20} className="opacity-70" /> </button>
                        </div>
                      </div>
                      <div className="px-4 py-2 h-auto">
                        <h3 className="font-semibold text-center cursor-pointer hover:text-red-600 transition truncate"
                          onClick={() => handleClickProduct(product.productId)} title={product.productName}
                        > {product.productName} </h3>
                        <p className="text-sm text-center text-gray-500">
                          {product.volumePrices && product.volumePrices.length > 1
                            ? `${product.volumePrices[0]?.volume}ml - ${product.volumePrices[product.volumePrices.length - 1]?.volume}ml`
                            : `${product.volumePrices?.[0]?.volume || 'N/A'}ml`}
                        </p>
                        <div className="flex justify-center gap-2 flex-wrap">
                          <p className={`text-red-600 font-semibold ${ product.volumePrices && product.volumePrices.length > 1 ? "text-xs" : "text-sm"}`}>
                            {product.volumePrices && product.volumePrices.length > 1
                              ? `${product.volumePrices[0]?.price.toLocaleString()} - ${product.volumePrices[product.volumePrices.length - 1]?.price.toLocaleString()} VND`
                              : `${product.volumePrices?.[0]?.price.toLocaleString() || 'Liên hệ'} VND`}
                          </p>
                        </div>
                        <div className="flex gap-2 mt-1">
                          <button
                            className={`flex px-2 items-center justify-center gap-1 border rounded-lg transition ${
                              isWishlisted && product.volumePrices?.length === 1 // Simple indication for single variant
                                ? "bg-red-600 text-white border-red-600 hover:bg-red-700"
                                : "bg-white text-red-600 border-red-600 hover:bg-red-100"
                            }`}
                            onClick={(e) => handleWishlistClick(e, product)}
                            title={isWishlisted && product.volumePrices?.length === 1 ? "Bỏ thích" : "Thêm vào yêu thích"}
                          > <Heart size={16} fill={isWishlisted && product.volumePrices?.length === 1 ? "currentColor" : "none"} /> </button>
                          <button
                            className="flex-1 flex items-center justify-center gap-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
                            onClick={(e) => { e.stopPropagation(); handleQuickView(product); }}
                          > <Eye size={16} /> <span className="text-sm">Xem nhanh</span> </button>
                        </div>
                      </div>
                    </div>
                  );
                })
            )}
          </div>

          {!loading && products.length > 0 && totalPages > 1 && renderPagination()}
        </div>

        {showPopup && selectedProduct && (
          <QuickView selectedProduct={selectedProduct} handleClosePopup={handleClosePopup} />
        )}

        {showVolumePopup && popupTargetProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50" onClick={() => setShowVolumePopup(false)}>
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full relative" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-semibold mb-4 text-center">Chọn dung tích cho <br />"{popupTargetProduct.productName}"</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto scrollbar">
                {volumeOptions.map((vp) => (
                  <button key={vp.productVariantId}
                    onClick={() => { addToWishlist(vp.productVariantId); setShowVolumePopup(false); }}
                    className="w-full text-left px-4 py-2 border rounded hover:bg-gray-100 transition"
                  > {vp.volume}ml – {vp.price.toLocaleString("vi-VN")} VND </button>
                ))}
              </div>
              <button onClick={() => setShowVolumePopup(false)} className="absolute top-2 right-2 text-gray-500 hover:text-black">✕</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductListByGender;