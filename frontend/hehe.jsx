import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Import icons from lucide-react
import { Heart, Eye, ChevronLeft, ChevronRight, Search, X, Star, Filter, SlidersHorizontal } from 'lucide-react';

const ProductListByGender = () => {
  const [searchParams] = useSearchParams();
  const gender = searchParams.get('gender') || 'Unisex';
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [priceRange, setPriceRange] = useState(30000000);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    categories: [],
    ratings: [],
  });
  const [sortBy, setSortBy] = useState("Bán chạy");

  const pageSize = 25;

  useEffect(() => {
    fetchProducts();
  }, [gender, currentPage, sortBy]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/v1/products/category', {
        params: {
          gender,
          page: currentPage,
          sort: sortBy,
        },
      });

      const { items, totalPages } = response.data.data;
      // Simulate loading delay for demonstration
      setTimeout(() => {
        setProducts(items);
        setTotalPages(totalPages);
        setLoading(false);
        setError('');
      }, 800);
    } catch (err) {
      console.error(err);
      setError('Không thể tải sản phẩm. Vui lòng thử lại sau.');
      setLoading(false);
    }
  };

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
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
      window.scrollTo(0, 0);
    }
  };

  const handleFilterChange = (category, option) => {
    setSelectedFilters((prev) => {
      const newFilters = { ...prev };
      if (newFilters[category].includes(option)) {
        newFilters[category] = newFilters[category].filter(
          (item) => item !== option
        );
      } else {
        newFilters[category] = [...newFilters[category], option];
      }
      return newFilters;
    });
  };

  const sortOptions = [
    "Mới nhất",
    "Bán chạy",
    "Giá thấp đến cao",
    "Giá cao đến thấp",
  ];
  
  const filterCategories = [
    {
      title: "Loại sản phẩm",
      options: [
        { name: "Nước hoa", count: 124, checked: false },
        { name: "Nước hoa mini", count: 45, checked: false },
        { name: "Gift set", count: 18, checked: false },
      ],
    },
    {
      title: "Nhóm hương",
      options: [
        { name: "Hương hoa", count: 78, checked: false },
        { name: "Hương gỗ", count: 56, checked: false },
        { name: "Hương trái cây", count: 34, checked: false },
        { name: "Hương biển", count: 22, checked: false },
      ],
    },
  ];

  // Rating options
  const ratingOptions = [
    { stars: 5, count: 124 },
    { stars: 4, count: 78 },
    { stars: 3, count: 45 },
    { stars: 2, count: 12 },
    { stars: 1, count: 5 },
  ];

  const renderStars = (count) => {
    return Array(5).fill(0).map((_, index) => (
      <Star 
        key={index} 
        size={16} 
        className={index < count ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} 
      />
    ));
  };

  const renderPagination = () => (
    <div className="flex justify-center items-center mt-8 mb-6 gap-2">
      <button
        className={`flex items-center justify-center w-10 h-10 rounded-full ${
          currentPage === 0 
            ? 'text-gray-400 cursor-not-allowed bg-gray-100' 
            : 'bg-white hover:bg-gray-100 shadow-sm'
        }`}
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 0}
      >
        <ChevronLeft size={18} />
      </button>
      
      {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
        let pageNum;
        if (totalPages <= 5) {
          pageNum = idx;
        } else if (currentPage < 3) {
          pageNum = idx;
        } else if (currentPage > totalPages - 3) {
          pageNum = totalPages - 5 + idx;
        } else {
          pageNum = currentPage - 2 + idx;
        }

        return (
          <button
            key={pageNum}
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              currentPage === pageNum 
                ? 'bg-purple-600 text-white shadow-md' 
                : 'bg-white hover:bg-gray-100 shadow-sm'
            }`}
            onClick={() => handlePageChange(pageNum)}
          >
            {pageNum + 1}
          </button>
        );
      })}
      
      <button
        className={`flex items-center justify-center w-10 h-10 rounded-full ${
          currentPage === totalPages - 1 
            ? 'text-gray-400 cursor-not-allowed bg-gray-100' 
            : 'bg-white hover:bg-gray-100 shadow-sm'
        }`}
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header with gradient background */}
      <header className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center">
            <h1 className="text-3xl font-bold mb-2">
              Nước hoa {gender === 'Men' ? 'Nam' : gender === 'Women' ? 'Nữ' : 'Unisex'}
            </h1>
            <div className="flex items-center text-sm mt-2">
              <a href="/" className="hover:underline">
                TRANG CHỦ
              </a>
              <span className="mx-2">/</span>
              <a href="/category" className="hover:underline">
                DANH MỤC
              </a>
              <span className="mx-2">/</span>
              <span>NƯỚC HOA {gender === 'Men' ? 'NAM' : gender === 'Women' ? 'NỮ' : 'UNISEX'}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter sidebar for desktop */}
          <div className="hidden lg:block w-64 bg-white rounded-lg shadow-md p-6 h-fit">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-lg">Bộ lọc</h3>
              <button className="text-purple-600 text-sm hover:underline">
                Xóa tất cả
              </button>
            </div>

            {/* Price Range Filter */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Khoảng giá</h4>
              <input
                type="range"
                min="0"
                max="30000000"
                step="100000"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between mt-2">
                <span className="text-sm text-gray-500">0đ</span>
                <span className="text-sm text-gray-500">{priceRange.toLocaleString()}đ</span>
              </div>
            </div>

            <hr className="my-4" />

            {/* Category filters */}
            {filterCategories.map((category, idx) => (
              <div key={idx} className="mb-6">
                <h4 className="font-medium mb-3">{category.title}</h4>
                <div className="space-y-2">
                  {category.options.map((option, optionIdx) => (
                    <div key={optionIdx} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`${category.title}-${option.name}`}
                        className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                        checked={selectedFilters.categories.includes(option.name)}
                        onChange={() => handleFilterChange('categories', option.name)}
                      />
                      <label 
                        htmlFor={`${category.title}-${option.name}`}
                        className="ml-2 text-sm text-gray-700 flex-1"
                      >
                        {option.name}
                      </label>
                      <span className="text-xs text-gray-500">({option.count})</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <hr className="my-4" />

            {/* Rating filter */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Đánh giá</h4>
              <div className="space-y-2">
                {ratingOptions.map((option, idx) => (
                  <div key={idx} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`rating-${option.stars}`}
                      className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                      checked={selectedFilters.ratings.includes(option.stars)}
                      onChange={() => handleFilterChange('ratings', option.stars)}
                    />
                    <label 
                      htmlFor={`rating-${option.stars}`}
                      className="ml-2 flex items-center gap-1"
                    >
                      {renderStars(option.stars)}
                    </label>
                    <span className="text-xs text-gray-500 ml-2">({option.count})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile filter button */}
          <div className="lg:hidden flex justify-between items-center mb-4">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm"
            >
              <Filter size={18} />
              <span>Bộ lọc</span>
            </button>
            
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white pl-4 pr-10 py-2 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {sortOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <SlidersHorizontal size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
          </div>

          {/* Mobile filter sidebar */}
          {showFilters && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden flex">
              <div className="bg-white w-4/5 max-w-md h-full overflow-y-auto p-6 ml-auto animate-slide-in-right">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-semibold text-lg">Bộ lọc</h3>
                  <button onClick={() => setShowFilters(false)}>
                    <X size={24} />
                  </button>
                </div>

                {/* Price Range Filter */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Khoảng giá</h4>
                  <input
                    type="range"
                    min="0"
                    max="30000000"
                    step="100000"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between mt-2">
                    <span className="text-sm text-gray-500">0đ</span>
                    <span className="text-sm text-gray-500">{priceRange.toLocaleString()}đ</span>
                  </div>
                </div>

                <hr className="my-4" />

                {/* Category filters */}
                {filterCategories.map((category, idx) => (
                  <div key={idx} className="mb-6">
                    <h4 className="font-medium mb-3">{category.title}</h4>
                    <div className="space-y-3">
                      {category.options.map((option, optionIdx) => (
                        <div key={optionIdx} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`mobile-${category.title}-${option.name}`}
                            className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                            checked={selectedFilters.categories.includes(option.name)}
                            onChange={() => handleFilterChange('categories', option.name)}
                          />
                          <label 
                            htmlFor={`mobile-${category.title}-${option.name}`}
                            className="ml-3 text-gray-700 flex-1"
                          >
                            {option.name}
                          </label>
                          <span className="text-xs text-gray-500">({option.count})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <hr className="my-4" />

                {/* Rating filter */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Đánh giá</h4>
                  <div className="space-y-3">
                    {ratingOptions.map((option, idx) => (
                      <div key={idx} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`mobile-rating-${option.stars}`}
                          className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                          checked={selectedFilters.ratings.includes(option.stars)}
                          onChange={() => handleFilterChange('ratings', option.stars)}
                        />
                        <label 
                          htmlFor={`mobile-rating-${option.stars}`}
                          className="ml-3 flex items-center gap-1"
                        >
                          {renderStars(option.stars)}
                        </label>
                        <span className="text-xs text-gray-500 ml-2">({option.count})</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-auto pt-6">
                  <button 
                    className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition"
                    onClick={() => setShowFilters(false)}
                  >
                    Áp dụng
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Products container */}
          <div className="flex-1">
            {/* Sort options - Desktop */}
            <div className="hidden lg:flex justify-between items-center mb-8">
              <div className="flex items-center">
                <span className="text-gray-600 mr-4">Sắp xếp theo:</span>
                <div className="flex gap-2">
                  {sortOptions.map((option) => (
                    <button
                      key={option}
                      className={`px-4 py-2 rounded-full text-sm transition-all ${
                        sortBy === option
                          ? "bg-purple-600 text-white shadow-md"
                          : "bg-white hover:bg-gray-100 shadow-sm"
                      }`}
                      onClick={() => setSortBy(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="text-sm text-gray-600">
                Hiển thị {products.length} sản phẩm
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-center">
                {error}
              </div>
            )}

            {/* Product grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {loading
                ? Array.from({ length: 10 }).map((_, index) => (
                    <div
                      key={`skeleton-${index}`}
                      className="bg-white rounded-lg shadow-md overflow-hidden h-[360px]"
                    >
                      <div className="w-full h-[200px] bg-gray-200 animate-pulse"></div>
                      <div className="p-4">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-3 animate-pulse"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto mb-4 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto mb-4 animate-pulse"></div>
                        <div className="flex gap-2 mt-4">
                          <div className="h-8 bg-gray-200 rounded flex-1 animate-pulse"></div>
                          <div className="h-8 bg-gray-200 rounded flex-1 animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  ))
                : products.length === 0
                ? <div className="col-span-full py-16 text-center">
                    <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
                      <div className="text-gray-400 mb-4 flex justify-center">
                        <Search size={48} />
                      </div>
                      <h3 className="text-xl font-medium text-gray-700 mb-2">Không tìm thấy sản phẩm</h3>
                      <p className="text-gray-500">
                        Không tìm thấy sản phẩm phù hợp với tiêu chí tìm kiếm của bạn.
                      </p>
                    </div>
                  </div>
                : products.map((product) => (
                    <div
                      key={product.productId}
                      className="bg-white rounded-lg shadow-md overflow-hidden h-[360px] transform hover:scale-[1.02] transition-all duration-300 hover:shadow-lg"
                    >
                      <div
                        className="relative cursor-pointer h-[200px] overflow-hidden"
                        onClick={() => handleClickProduct(product.productId)}
                      >
                        <img
                          src={product.imageUrl || "/stamp.png"}
                          alt={product.productName}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                          onError={(e) => {
                            e.target.src = "/stamp.png";
                          }}
                        />
                        
                        {/* Quick view button overlay */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
                          <button
                            className="bg-white text-gray-800 rounded-full p-2 transform translate-y-4 hover:translate-y-0 transition-transform duration-300"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuickView(product);
                            }}
                          >
                            <Eye size={20} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h3
                          className="font-medium text-center cursor-pointer hover:text-purple-600 transition-colors truncate mb-1"
                          onClick={() => handleClickProduct(product.productId)}
                          title={product.productName}
                        >
                          {product.productName}
                        </h3>
                        
                        <p className="text-sm text-center text-gray-500 mb-2">
                          {product.volumePrices && product.volumePrices.length > 1
                            ? `${product.volumePrices[0]?.volume}ml - ${
                                product.volumePrices[
                                  product.volumePrices.length - 1
                                ]?.volume
                              }ml`
                            : `${product.volumePrices[0]?.volume}ml`}
                        </p>
                        
                        <p className="text-purple-600 font-semibold text-center mb-3">
                          {product.volumePrices &&
                          product.volumePrices.length > 1
                            ? `${product.volumePrices[0]?.price.toLocaleString()} - ${product.volumePrices[
                                product.volumePrices.length - 1
                              ]?.price.toLocaleString()} VND`
                            : `${product.volumePrices[0]?.price.toLocaleString()} VND`}
                        </p>
                        
                        <div className="flex gap-2">
                          <button
                            className="flex-1 flex items-center justify-center gap-1 bg-white border border-purple-600 text-purple-600 py-2 rounded-lg hover:bg-purple-50 transition"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Add to favorites logic
                            }}
                          >
                            <Heart size={16} />
                            <span className="text-sm">Yêu thích</span>
                          </button>
                          
                          <button
                            className="flex-1 flex items-center justify-center gap-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuickView(product);
                            }}
                          >
                            <Eye size={16} />
                            <span className="text-sm">Xem nhanh</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
            </div>

            {/* Pagination */}
            {!loading && products.length > 0 && renderPagination()}
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {showPopup && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-fade-in">
            <div className="flex h-full">
              {/* Quick view left side (image) */}
              <div className="w-1/2 bg-gray-100 flex items-center justify-center p-8 hidden md:block">
                <img
                  src={selectedProduct.imageUrl || "/stamp.png"}
                  alt={selectedProduct.productName}
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    e.target.src = "/stamp.png";
                  }}
                />
              </div>
              
              {/* Quick view right side (details) */}
              <div className="md:w-1/2 w-full p-6 overflow-y-auto max-h-[90vh]">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold">{selectedProduct.productName}</h2>
                  <button 
                    onClick={handleClosePopup}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>
                
                {/* Mobile image */}
                <div className="md:hidden mb-4 bg-gray-100 rounded-lg p-4">
                  <img
                    src={selectedProduct.imageUrl || "/stamp.png"}
                    alt={selectedProduct.productName}
                    className="w-full object-contain h-64"
                    onError={(e) => {
                      e.target.src = "/stamp.png";
                    }}
                  />
                </div>
                
                <div className="flex gap-2 mb-4">
                  {renderStars(4)}
                  <span className="text-sm text-gray-500">(16 đánh giá)</span>
                </div>
                
                <p className="text-purple-600 font-semibold text-xl mb-4">
                  {selectedProduct.volumePrices && selectedProduct.volumePrices.length > 0
                    ? `${selectedProduct.volumePrices[0]?.price.toLocaleString()} VND`
                    : "Liên hệ"}
                </p>
                
                {/* Volume options */}
                {selectedProduct.volumePrices && selectedProduct.volumePrices.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium mb-2">Dung tích:</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.volumePrices.map((vp, idx) => (
                        <button
                          key={idx}
                          className="px-3 py-1 border rounded-full text-sm hover:border-purple-600 hover:text-purple-600 transition"
                        >
                          {vp.volume}ml
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-2">Mô tả:</h3>
                  <p className="text-gray-600 text-sm">
                    {selectedProduct.description || 
                      "Sản phẩm nước hoa cao cấp với hương thơm độc đáo, lưu hương dài lâu. Thiết kế sang trọng, phù hợp với cả nam và nữ."}
                  </p>
                </div>
                
                <div className="flex gap-4">
                  <button className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition flex items-center justify-center gap-2">
                    <span>Thêm vào giỏ hàng</span>
                  </button>
                  <button className="w-12 h-12 flex items-center justify-center border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition">
                    <Heart size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductListByGender;

// Add this CSS to your global styles or component for animations:
/*
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-in-right {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

.animate-slide-in-right {
  animation: slide-in-right 0.3s ease-out;
} */