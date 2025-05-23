import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import QuickView from "../components/QuickView";
import ProductFilterSidebar from "../components/ProductFilterSidebar";
import { Eye, Heart, Filter } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import ErrorMessages from "../constants/ErrorMessages.js";

const DEFAULT_MAX_PRICE = 56531700; // Fallback if API doesn't provide one initially

const ProductListByBrand = () => {
  const { brandName: encodedBrandName } = useParams(); // Get potentially encoded brandName
  const navigate = useNavigate();

  // Decode brandName immediately
  const brandName = encodedBrandName ? decodeURIComponent(encodedBrandName) : null;

  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const [selectedMaxPrice, setSelectedMaxPrice] = useState(DEFAULT_MAX_PRICE); 
  const [apiMaxPrice, setApiMaxPrice] = useState(DEFAULT_MAX_PRICE);

  const [showVolumePopup, setShowVolumePopup] = useState(false);
  const [volumeOptions, setVolumeOptions] = useState([]);
  const [popupTargetProduct, setPopupTargetProduct] = useState(null);
  
  const [filters, setFilters] = useState({
    brands: [], 
    style: [],
    toneScent: [],
    suitableGender: []
  });

  const [isFiltersAppliedState, setIsFiltersAppliedState] = useState(false);
  const [shouldFetchFiltered, setShouldFetchFiltered] = useState(false);
  
  const [sortBy, setSortBy] = useState("");

  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const pageSize = 25;

  useEffect(() => {
    axios.get("http://localhost:8080/api/v1/products/filter-options")
      .then(response => {
        if (response.data && response.data.data && response.data.data.priceRange) {
          const apiMax = response.data.data.priceRange.max;
          setApiMaxPrice(apiMax || DEFAULT_MAX_PRICE);
          setSelectedMaxPrice(prev => (prev === DEFAULT_MAX_PRICE ? (apiMax || DEFAULT_MAX_PRICE) : prev) );
        }
      })
      .catch(err => {
        console.error("Error fetching initial max price:", err);
      });
  }, []);

  const fetchProductsCallback = useCallback(async (isFiltered, appliedFiltersState, currentMaxPrice, page, currentSortBy) => {
    if (!brandName && !isFiltered) { // If no brandName for initial load, don't fetch
        setLoading(false);
        setError("Thương hiệu không được chỉ định."); // Or handle as needed
        setProducts([]);
        setTotalPages(0);
        return;
    }

    setLoading(true);
    setError("");

    let method = 'get';
    let endpoint;
    let params = null;
    let payload = null;

    let apiSortByValue = "name";
    let apiSortDirValue = "asc";

    if (currentSortBy === "Giá thấp đến cao") {
      apiSortByValue = "price"; apiSortDirValue = "asc";
    } else if (currentSortBy === "Giá cao đến thấp") {
      apiSortByValue = "price"; apiSortDirValue = "desc";
    } else if (currentSortBy === "A–Z") {
      apiSortByValue = "name"; apiSortDirValue = "asc";
    }

    if (isFiltered) {
      method = 'post';
      endpoint = `http://localhost:8080/api/v1/products/filter?page=${page}&size=${pageSize}&sortBy=${apiSortByValue}&sortDir=${apiSortDirValue}`;
      
      const filterDataRequest = {
        // Use the decoded brandName for the filter request.
        brands: brandName ? [brandName] : (appliedFiltersState.brands?.length > 0 ? appliedFiltersState.brands : undefined),
        productDetails: {}
      };

      if (appliedFiltersState.style?.length > 0) filterDataRequest.productDetails.style = appliedFiltersState.style;
      if (appliedFiltersState.toneScent?.length > 0) filterDataRequest.productDetails.toneScent = appliedFiltersState.toneScent;
      if (appliedFiltersState.suitableGender?.length > 0) filterDataRequest.productDetails.suitableGender = appliedFiltersState.suitableGender;
      
      if (currentMaxPrice < apiMaxPrice) filterDataRequest.maxPrice = currentMaxPrice;
      payload = filterDataRequest;

    } else { 
      method = 'get';
      endpoint = `http://localhost:8080/api/v1/products/by-brand`; 
      params = { 
        brandName, // Use the decoded brandName
        page, 
        size: pageSize,
        // If your /by-brand endpoint supports sorting, add them to params:
        // sortBy: apiSortByValue,
        // sortDir: apiSortDirValue,
      };
    }

    try {
      // console.log("Fetching products:", { method, endpoint, params, payload }); // For debugging
      const response = await axios({ method, url: endpoint, params, data: payload });
      const { items, totalPages: newTotalPages } = response.data.data || {};

      if (!Array.isArray(items) || typeof newTotalPages !== "number") {
        throw new Error(ErrorMessages.INVALID_RESPONSE);
      }

      let processedItems = [...items];
      if (!isFiltered /* && !yourByBrandEndpointSupportsSorting */ ) { // Client-side sort for initial load IF backend doesn't sort
        if (currentSortBy === "Giá thấp đến cao") processedItems.sort((a, b) => (a.volumePrices?.[0]?.price || 0) - (b.volumePrices?.[0]?.price || 0));
        else if (currentSortBy === "Giá cao đến thấp") processedItems.sort((a, b) => (b.volumePrices?.[0]?.price || 0) - (a.volumePrices?.[0]?.price || 0));
        else if (currentSortBy === "A–Z") processedItems.sort((a, b) => a.productName.localeCompare(b.productName));
      }
      
      setProducts(processedItems);
      setTotalPages(newTotalPages);

    } catch (err) {
      console.error(`Lỗi khi tải sản phẩm (${isFiltered ? 'filtered' : 'by brand'}):`, err);
      const errorMsg = err.response?.data?.message || (err.message === ErrorMessages.INVALID_RESPONSE ? ErrorMessages.INVALID_RESPONSE : ErrorMessages.PRODUCT_LOAD_FAIL);
      setError(errorMsg);
      setProducts([]); // Clear products on error
      setTotalPages(0); // Reset total pages on error
    } finally {
      setTimeout(() => setLoading(false), 300);
    }
  }, [brandName, apiMaxPrice, pageSize]); // brandName is now decoded before being passed to useCallback

  useEffect(() => {
    if (brandName) {
        fetchProductsCallback(shouldFetchFiltered, filters, selectedMaxPrice, currentPage, sortBy);
    } else {
        // Handle case where brandName might not be available (e.g. invalid URL)
        setProducts([]);
        setTotalPages(0);
        setError("Thương hiệu không hợp lệ hoặc không tìm thấy.");
    }
  }, [brandName, currentPage, sortBy, shouldFetchFiltered, filters, selectedMaxPrice, fetchProductsCallback]);

  useEffect(() => {
    setCurrentPage(0);
  }, [filters, selectedMaxPrice, shouldFetchFiltered, brandName]); // brandName (decoded) change resets page
  
  useEffect(() => {
    const hasActiveSidebarFilters = 
      (filters.style?.length > 0) ||
      (filters.toneScent?.length > 0) ||
      (filters.suitableGender?.length > 0) ||
      // Check if sidebar brand filter is active AND different from the current page's brand.
      // This scenario is less likely if the sidebar's brand filter is hidden/disabled on brand pages.
      (filters.brands?.length > 0 && (!brandName || !filters.brands.includes(brandName)) ) || 
      selectedMaxPrice < apiMaxPrice;
    setIsFiltersAppliedState(hasActiveSidebarFilters);
  }, [filters, selectedMaxPrice, apiMaxPrice, brandName]); // brandName (decoded)

  const handleFilterChange = useCallback((newFiltersFromSidebar) => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFiltersFromSidebar }));
  }, []);
  
  const handlePriceChange = useCallback((price) => {
    setSelectedMaxPrice(price);
  }, []);
  
  const applyFilters = () => {
    setCurrentPage(0); 
    if (!shouldFetchFiltered) {
        setShouldFetchFiltered(true); 
    } else {
        // Explicitly refetch if already in filtered mode, as sort order might have changed
        // or user just wants to re-apply with same filters.
        fetchProductsCallback(true, filters, selectedMaxPrice, 0, sortBy);
    }
  };
  
  const clearFilters = () => {
    setFilters({ brands: [], style: [], toneScent: [], suitableGender: [] });
    setSelectedMaxPrice(apiMaxPrice);
    setSortBy("");
    setCurrentPage(0); 
    if (shouldFetchFiltered) {
      setShouldFetchFiltered(false); 
    } else {
      // Already in non-filtered mode, fetch again with defaults for the current brand.
      fetchProductsCallback(false, { brands: [], style: [], toneScent: [], suitableGender: [] }, apiMaxPrice, 0, "");
    }
  };

  const sortOptions = ["Giá thấp đến cao", "Giá cao đến thấp", "A–Z"];

  const renderPagination = () => (
    <div className="flex justify-center items-center mt-8 mb-6 gap-2">
      <button className={`px-3 py-1 border rounded ${ currentPage === 0 ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-100" }`} onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0}> {"<"} </button>
      {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
        let pageNum;
        if (totalPages <= 5) pageNum = idx;
        else if (currentPage < 3) pageNum = idx;
        else if (currentPage > totalPages - 3) pageNum = totalPages - 5 + idx;
        else pageNum = currentPage - 2 + idx;
        if (pageNum < 0 || pageNum >= totalPages) return null;
        return <button key={pageNum} className={`px-3 py-1 border rounded ${ currentPage === pageNum ? "bg-gray-800 text-white" : "hover:bg-gray-100"}`} onClick={() => handlePageChange(pageNum)}> {pageNum + 1} </button>;
      })}
      <button className={`px-3 py-1 border rounded ${ currentPage >= totalPages - 1 ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-100" }`} onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= totalPages - 1 || totalPages === 0} > {">"} </button>
    </div>
  );

  const handleQuickView = (product) => { setSelectedProduct(product); setShowPopup(true); };
  const handleClosePopup = () => { setShowPopup(false); setSelectedProduct(null); };
  const handleClickProduct = (id) => navigate(`/products/${id}`);
  const handleWishlistClick = (e, product) => {
    e.stopPropagation();
    const volumePrices = product.volumePrices || [];
    if (volumePrices.length === 0) { console.warn(ErrorMessages.WISHLIST_ERROR); return; }
    if (volumePrices.length === 1) {
      const variantId = volumePrices[0].productVariantId;
      if (isInWishlist(variantId)) removeFromWishlist(variantId); else addToWishlist(variantId);
    } else {
      setPopupTargetProduct(product); setVolumeOptions(volumePrices); setShowVolumePopup(true);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-gray-900 text-white p-4">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center text-sm">
            <a href="/" className="hover:underline">TRANG CHỦ</a> <span className="mx-2">/</span>
            <a href="/category" className="hover:underline">DANH MỤC</a> <span className="mx-2">/</span>
            <span className="uppercase">{brandName || "THƯƠNG HIỆU"}</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4 flex flex-col md:flex-row">
        <div className="md:w-64 flex-shrink-0">
          <ProductFilterSidebar 
            onFilterChange={handleFilterChange} 
            onPriceChange={handlePriceChange}
            initialFilters={filters}
            initialPrice={selectedMaxPrice}
            // Consider passing `currentBrandOnPage={brandName}` to ProductFilterSidebar
            // if you want the sidebar to hide its own "Thương hiệu" filter section.
          />
          <div className="mt-4 mb-6 space-y-2">
            <button className="bg-gray-800 text-white px-12 py-2 rounded hover:bg-gray-900 transition flex items-center justify-center gap-2 w-full" onClick={applyFilters}> <Filter size={16} /> Áp dụng bộ lọc </button>
            {isFiltersAppliedState && <button onClick={clearFilters} className="bg-red-600 text-white px-12 py-2 rounded hover:bg-red-700 transition flex items-center justify-center gap-2 w-full"> Xóa bộ lọc </button>}
          </div>
        </div>
        
        <div className="flex-1 md:pl-6">
          <div className="flex flex-wrap justify-between items-center mb-6">
            <h1 className="text-2xl font-bold mb-2 md:mb-0 uppercase">{brandName || "Tất cả sản phẩm"}</h1>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm">Sắp xếp theo:</span>
              <div className="flex flex-wrap gap-2">
                {sortOptions.map((option) => <button key={option} className={`px-3 py-1 border rounded text-sm ${ sortBy === option ? "bg-gray-800 text-white" : "hover:bg-gray-100" }`} onClick={() => setSortBy(option)}> {option} </button>)}
              </div>
            </div>
          </div>
          
          {error && <p className="text-center text-red-500 py-4">{error}</p>}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {loading ? (
              Array.from({ length: pageSize }).map((_, index) => ( <div key={`skeleton-${index}`} className="bg-white rounded shadow overflow-hidden animate-pulse"> <div className="w-full h-48 bg-gray-200"></div> <div className="p-3"> <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div> <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto mb-3"></div> <div className="flex justify-center gap-2 mt-2"><div className="h-4 bg-gray-200 rounded w-1/4"></div></div> <div className="mt-3 flex justify-between"><div className="h-8 bg-gray-200 rounded w-full"></div></div> </div> </div> ))
            ) : products.length === 0 && !error ? ( 
                <div className="col-span-full text-center py-10"> <p className="text-gray-500"> Không tìm thấy sản phẩm nào cho thương hiệu <span className="font-semibold">{brandName || ""}</span> {isFiltersAppliedState ? " với bộ lọc hiện tại" : ""}. </p> </div>
            ) : (
              products.map((product) => {
                  const firstVariant = product.volumePrices?.[0];
                  const isWishlisted = firstVariant ? isInWishlist(firstVariant.productVariantId) : false; 
                  return ( <div key={product.productId} className="bg-white rounded shadow overflow-hidden hover:shadow-lg transition-shadow duration-300 group"> <div className="relative cursor-pointer h-[200px] overflow-hidden" onClick={() => handleClickProduct(product.productId)}> <img src={product.imageUrl || "/stamp.png"} alt={product.productName} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" onError={(e) => { e.target.src = "/stamp.png"; }} /> <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100"> <button className="bg-white text-gray-800 rounded-full p-2 transform hover:scale-110 transition-transform duration-300" onClick={(e) => { e.stopPropagation(); handleQuickView(product); }} > <Eye size={20} className="opacity-70" /> </button> </div> </div> <div className="px-4 py-2 h-auto"> <h3 className="font-semibold text-center cursor-pointer hover:text-red-600 transition truncate" onClick={() => handleClickProduct(product.productId)} title={product.productName} > {product.productName} </h3> <p className="text-sm text-center text-gray-500"> {product.volumePrices && product.volumePrices.length > 1 ? `${product.volumePrices[0]?.volume}ml - ${product.volumePrices[product.volumePrices.length - 1]?.volume}ml` : `${product.volumePrices?.[0]?.volume || 'N/A'}ml`} </p> <div className="flex justify-center gap-2 flex-wrap"> <p className={`text-red-600 font-semibold ${ product.volumePrices && product.volumePrices.length > 1 ? "text-xs" : "text-sm"}`}> {product.volumePrices && product.volumePrices.length > 1 ? `${product.volumePrices[0]?.price.toLocaleString()} - ${product.volumePrices[product.volumePrices.length - 1]?.price.toLocaleString()} VND` : `${product.volumePrices?.[0]?.price.toLocaleString() || 'Liên hệ'} VND`} </p> </div> <div className="flex gap-2 mt-1"> <button className={`flex px-2 items-center justify-center gap-1 border rounded-lg transition ${ isWishlisted && product.volumePrices?.length === 1 ? "bg-red-600 text-white border-red-600 hover:bg-red-700" : "bg-white text-red-600 border-red-600 hover:bg-red-100" }`} onClick={(e) => handleWishlistClick(e, product)} title={isWishlisted && product.volumePrices?.length === 1 ? "Bỏ thích" : "Thêm vào yêu thích"} > <Heart size={16} fill={isWishlisted && product.volumePrices?.length === 1 ? "currentColor" : "none"} /> </button> <button className="flex-1 flex items-center justify-center gap-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition" onClick={(e) => { e.stopPropagation(); handleQuickView(product); }} > <Eye size={16} /> <span className="text-sm">Xem nhanh</span> </button> </div> </div> </div> );
                })
            )}
          </div>

          {!loading && products.length > 0 && totalPages > 1 && renderPagination()}
        </div>

        {showPopup && selectedProduct && ( <QuickView selectedProduct={selectedProduct} handleClosePopup={handleClosePopup} /> )}
        {showVolumePopup && popupTargetProduct && ( <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50" onClick={() => setShowVolumePopup(false)}> <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full relative" onClick={(e) => e.stopPropagation()}> <h3 className="text-lg font-semibold mb-4 text-center">Chọn dung tích cho <br />"{popupTargetProduct.productName}"</h3> <div className="space-y-2 max-h-60 overflow-y-auto scrollbar"> {volumeOptions.map((vp) => ( <button key={vp.productVariantId} onClick={() => { addToWishlist(vp.productVariantId); setShowVolumePopup(false); }} className="w-full text-left px-4 py-2 border rounded hover:bg-gray-100 transition" > {vp.volume}ml – {vp.price.toLocaleString("vi-VN")} VND </button> ))} </div> <button onClick={() => setShowVolumePopup(false)} className="absolute top-2 right-2 text-gray-500 hover:text-black">✕</button> </div> </div> )}
      </div>
    </div>
  );
};

export default ProductListByBrand;