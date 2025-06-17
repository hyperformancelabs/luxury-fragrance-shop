import React, { useEffect, useState } from "react";
import axios from "axios";
import { Eye, Heart } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import QuickView from "../components/QuickView";
import { useWishlist } from "../context/WishlistContext";
import ErrorMessages from "../constants/ErrorMessages";

const pageSize = 25;

const ProductListBySearch = ({ keyword: defaultKeyword = "" }) => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [searchKeyword, setSearchKeyword] = useState(defaultKeyword);

  const [showPopup, setShowPopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showVolumePopup, setShowVolumePopup] = useState(false);
  const [volumeOptions, setVolumeOptions] = useState([]);
  const [popupTargetProduct, setPopupTargetProduct] = useState(null);

  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  // Nếu muốn lấy keyword từ query string
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchKeyword(params.get("name") || defaultKeyword);
    setCurrentPage(0); // Reset trang khi thay đổi keyword
  }, [location.search, defaultKeyword]);

  // Fetch products
  useEffect(() => {
    fetchProducts(currentPage, sortBy, searchKeyword);
    // eslint-disable-next-line
  }, [currentPage, sortBy, searchKeyword]);

  const fetchProducts = async (page, currentSortBy, name) => {
    setLoading(true);
    setError("");
    const endpoint = "http://localhost:8080/api/v1/products/search";
    const params = { 
      name: name?.trim(),
      page,
      size: pageSize
    };

    if (currentSortBy === "Giá thấp đến cao") {
      params.sortBy = "price";
      params.sortDir = "asc";
    } else if (currentSortBy === "Giá cao đến thấp") {
      params.sortBy = "price";
      params.sortDir = "desc";
    } else if (currentSortBy === "A–Z") {
      params.sortBy = "name";
      params.sortDir = "asc";
    }

    try {
      const res = await axios.get(endpoint, { params });
      const { items, totalPages, currentPage } = res.data?.data || {};
      if (!Array.isArray(items)) throw new Error(ErrorMessages.INVALID_RESPONSE);

      setProducts(items);
      setTotalPages(totalPages || 1);
      setCurrentPage(currentPage || 0);
    } catch (err) {
      console.error("Lỗi khi tìm kiếm sản phẩm:", err);
      setError(ErrorMessages.PRODUCT_LOAD_FAIL);
    } finally {
      setTimeout(() => setLoading(false), 300);
    }
  };

  useEffect(() => {
    setCurrentPage(0);
  }, [sortBy]);

  // Handlers giống cũ
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

  const handleWishlistClick = (e, product) => {
    e.stopPropagation();
    const volumePrices = product.volumePrices || [];
    if (volumePrices.length === 0) return;

    if (volumePrices.length === 1) {
      const variantId = volumePrices[0].productVariantId;
      isInWishlist(variantId)
        ? removeFromWishlist(variantId)
        : addToWishlist(variantId);
    } else {
      setPopupTargetProduct(product);
      setVolumeOptions(volumePrices);
      setShowVolumePopup(true);
    }
  };

  const sortOptions = ["Giá thấp đến cao", "Giá cao đến thấp", "A–Z"];

  // Pagination giống code bạn
  const renderPagination = () => (
    <div className="flex justify-center items-center mt-8 mb-6 gap-2">
      <button
        className={`px-3 py-1 border rounded ${currentPage === 0 ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-100"}`}
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 0}
      > {"<"} </button>
      {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
        let pageNum;
        if (totalPages <= 5) pageNum = idx;
        else if (currentPage < 3) pageNum = idx;
        else if (currentPage > totalPages - 3) pageNum = totalPages - 5 + idx;
        else pageNum = currentPage - 2 + idx;
        if (pageNum < 0 || pageNum >= totalPages) return null;
        return (
          <button key={pageNum}
            className={`px-3 py-1 border rounded ${currentPage === pageNum ? "bg-gray-800 text-white" : "hover:bg-gray-100"}`}
            onClick={() => handlePageChange(pageNum)}
          > {pageNum + 1} </button>
        );
      })}
      <button
        className={`px-3 py-1 border rounded ${currentPage >= totalPages - 1 ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-100"}`}
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages - 1}
      > {">"} </button>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-gray-900 text-white p-4">
        <div className="container mx-auto px-4">
          <div className="text-sm flex items-center">
            <a href="/" className="hover:underline">TRANG CHỦ</a>
            <span className="mx-2">/</span>
            KẾT QUẢ TÌM KIẾM
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4">
        <div className="flex flex-wrap justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            Kết quả tìm kiếm: <span className="text-red-600">{searchKeyword}</span>
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-sm">Sắp xếp theo:</span>
            <div className="flex gap-2">
              {sortOptions.map((option) => (
                <button key={option}
                  className={`px-3 py-1 border rounded text-sm ${sortBy === option ? "bg-gray-800 text-white" : "hover:bg-gray-100"}`}
                  onClick={() => setSortBy(option)}
                > {option} </button>
              ))}
            </div>
          </div>
        </div>

        {error && <p className="text-center text-red-500 py-4">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {loading ? (
            Array.from({ length: pageSize }).map((_, i) => (
              <div key={i} className="bg-white rounded shadow animate-pulse h-[300px]"></div>
            ))
          ) : products.length === 0 ? (
            <p className="col-span-full text-center py-8 text-gray-500">Không có sản phẩm phù hợp.</p>
          ) : (
            products.map((product) => {
              const firstVariant = product.volumePrices?.[0];
              const isWishlisted = firstVariant && isInWishlist(firstVariant.productVariantId);
              return (
                <div key={product.productId} className="bg-white rounded shadow hover:shadow-lg transition group overflow-hidden">
                  <div className="relative h-[200px] cursor-pointer" onClick={() => handleClickProduct(product.productId)}>
                    <img src={product.imageUrl || "/stamp.png"} alt={product.productName}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      onError={(e) => { e.target.src = "/stamp.png"; }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 flex justify-center items-center transition-opacity opacity-0 group-hover:opacity-100">
                      <button className="bg-white p-2 rounded-full" onClick={(e) => { e.stopPropagation(); handleQuickView(product); }}>
                        <Eye size={20} />
                      </button>
                    </div>
                  </div>
                  <div className="px-4 py-2">
                    <h3 className="font-semibold text-center truncate hover:text-red-600 cursor-pointer"
                      onClick={() => handleClickProduct(product.productId)}
                    >{product.productName}</h3>
                    <p className="text-center text-sm text-gray-500">
                      {product.volumePrices.length > 1
                        ? `${product.volumePrices[0]?.volume}ml - ${product.volumePrices.at(-1)?.volume}ml`
                        : `${product.volumePrices?.[0]?.volume || "N/A"}ml`}
                    </p>
                    <div className="text-center text-red-600 font-semibold text-sm">
                      {product.volumePrices.length > 1
                        ? `${product.volumePrices[0]?.price.toLocaleString()} - ${product.volumePrices.at(-1)?.price.toLocaleString()} VND`
                        : `${product.volumePrices?.[0]?.price.toLocaleString() || "Liên hệ"} VND`}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button className={`flex items-center px-2 border rounded-lg transition ${isWishlisted ? "bg-red-600 text-white" : "text-red-600 border-red-600"}`}
                        onClick={(e) => handleWishlistClick(e, product)}
                      ><Heart size={16} fill={isWishlisted ? "currentColor" : "none"} /></button>
                      <button className="flex-1 flex items-center justify-center bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
                        onClick={(e) => { e.stopPropagation(); handleQuickView(product); }}
                      ><Eye size={16} /> <span className="text-sm ml-1">Xem nhanh</span></button>
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
  );
};

export default ProductListBySearch;
