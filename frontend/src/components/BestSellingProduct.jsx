import { ChevronLeft, ChevronRight, Eye, Heart } from "lucide-react";
import React, { useEffect, useState } from "react";
import QuickView from "./QuickView";
import axios from "axios";
import { useWishlist } from "../context/WishlistContext";
import { useNavigate } from "react-router-dom";

const BestSellingProduct = () => {
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [startIndex, setStartIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState({
    hours: 5,
    minutes: 30,
    seconds: 0,
  });


  const handleWishlistClick = (e, product) => {
    e.stopPropagation();
    const volumePrices = product.volumePrices || [];
    if (volumePrices.length === 0) {
      console.warn(ErrorMessages.WISHLIST_ERROR);
      return;
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
  useEffect(() => {
    setIsLoading(true);

    fetch("http://localhost:8080/api/v1/products/random-10-cards")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setProduct(data.data);
        console.log(data.data);
      })
      .catch((err) => console.error("Error Fetching Data", err))
      .finally(() => setIsLoading(false));
  }, []);

  const handleQuickView = (product) => {
    setSelectedProduct(product);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedProduct(null);
    setQuantity(1);
  };

  const getProductsPerView = () => {
    if (window.innerWidth >= 1280) return 6;
    if (window.innerWidth >= 1024) return 5;
    if (window.innerWidth >= 768) return 4;
    if (window.innerWidth >= 640) return 3;
    return 2;
  };

  const handleNextProducts = () => {
    const perView = getProductsPerView();
    setStartIndex((prev) =>
      prev + perView < product.length ? prev + perView : 0
    );
  };

  const handlePrevProducts = () => {
    const perView = getProductsPerView();
    setStartIndex((prev) =>
      prev - perView >= 0
        ? prev - perView
        : Math.max(0, product.length - perView)
    );
  };

  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/products/best-seller')
  }
  const handleClickProduct = (id) => {
    navigate(`/products/${id}`);
  };


  const skeletonItems = new Array(getProductsPerView()).fill(null);

  const formatPrice = (price, withVND = true) => {
    if (!price) return "0";
    const formatted = Number(price).toLocaleString("vi-VN");
    return withVND ? `${formatted} VND` : formatted;
  };

  const renderPriceRange = (volumePrices) => {
    if (!volumePrices || volumePrices.length === 0) return "Chưa có giá";

    const sortedPrices = volumePrices
      .map((vp) => vp.price)
      .sort((a, b) => a - b);

    if (sortedPrices.length === 1) {
      return formatPrice(sortedPrices[0]);
    } else {
      return `${formatPrice(sortedPrices[0], false)} - ${formatPrice(
        sortedPrices[sortedPrices.length - 1]
      )}`;
    }
  };

  const renderVolumeRange = (volumePrices) => {
    if (!volumePrices || volumePrices.length === 0) return "";

    const sortedVolumes = volumePrices
      .map((vp) => vp.volume)
      .sort((a, b) => a - b);

    if (sortedVolumes.length === 1) {
      return `${sortedVolumes[0]}ml`;
    } else {
      return `${sortedVolumes[0]}ml - ${
        sortedVolumes[sortedVolumes.length - 1]
      }ml`;
    }
  };

  return (
    <div id="new-product" className="flex flex-col mb-12 mx-4 md:m-16 relative">
      <div className="w-full flex justify-between items-center md:mb-4">
        <h2 className="font-bold md:text-2xl">SẢN PHẨM MỚI</h2>
        <button className="hover:underline hover:text-red-600 font-semibold" onClick={handleClick}>
          Xem thêm
        </button>
      </div>
      <div className="w-full items-center top-1/2 absolute">
        <button
          className="absolute w-8 h-8 md:w-12 md:h-12 left-0 bg-white rounded-full flex items-center justify-center shadow-lg z-10 md:-translate-x-12"
          onClick={handlePrevProducts}
        >
          <ChevronLeft className="w-6 h-6 md:w-12 md:h-12 text-red-600" />
        </button>
        <button
          className="absolute w-8 h-8 md:w-12 md:h-12 right-0 bg-white rounded-full flex items-center justify-center shadow-lg z-10 md:translate-x-12"
          onClick={handleNextProducts}
        >
          <ChevronRight className="w-6 h-6 md:w-12 md:h-12 text-red-600" />
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-4">
        {isLoading
          ? skeletonItems.map((_, index) => (
              <div
                key={index}
                className="flex flex-col animate-pulse items-center border-2 border-gray-300 rounded-lg p-2 md:p-4"
              >
                <div className="bg-gray-200 h-20 md:h-40 w-full mb-2 rounded"></div>
                <div className="bg-gray-200 h-4 w-3/4 rounded mb-1"></div>
                <div className="bg-gray-200 h-4 w-1/2 rounded mb-1"></div>
                <div className="bg-gray-200 h-4 w-2/3 rounded mb-4"></div>
                <div className="flex gap-2 w-full justify-center">
                  <div className="bg-gray-300 h-6 w-16 rounded"></div>
                  <div className="bg-gray-300 h-6 w-16 rounded"></div>
                </div>
              </div>
            ))
          : product
              .slice(startIndex, startIndex + getProductsPerView())
              .map((product) => {
              const firstVariant = product.volumePrices?.[0];
              const isWishlisted = firstVariant
                ? isInWishlist(firstVariant.productVariantId)
                : false;
              return (
                <div
                  key={product.productId}
                  className="bg-white rounded shadow overflow-hidden hover:shadow-lg transition-shadow duration-300 group"
                >
                  <div
                    className="relative cursor-pointer h-[200px] overflow-hidden"
                    onClick={() => handleClickProduct(product.productId)}
                  >
                    <img
                      src={product.imageUrl || "/stamp.png"}
                      alt={product.productName}
                      className="w-20 h-auto md:w-48 object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        e.target.src = "/stamp.png";
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <button
                        className="bg-white text-gray-800 rounded-full p-2 transform hover:scale-110 transition-transform duration-300"
                        onClick={(e) => {
                          handleQuickView(product);
                        }}
                      >
                        {" "}
                        <Eye size={20} className="opacity-70" />{" "}
                      </button>
                    </div>
                  </div>
                  <div className="px-4 py-2 h-auto">
                    <h3
                      className="font-semibold text-center cursor-pointer hover:text-red-600 transition truncate"
                      onClick={() => handleClickProduct(product.productId)}
                      title={product.productName}
                    >
                      {" "}
                      {product.productName}{" "}
                    </h3>
                    <p className="text-sm text-center text-gray-500">
                      {product.volumePrices &&
                      product.volumePrices.length > 1
                        ? `${product.volumePrices[0]?.volume}ml - ${
                            product.volumePrices[
                              product.volumePrices.length - 1
                            ]?.volume
                          }ml`
                        : `${product.volumePrices?.[0]?.volume || "N/A"}ml`}
                    </p>
                    <div className="flex justify-center gap-2 flex-wrap">
                      <p
                        className={`text-red-600 font-semibold ${
                          product.volumePrices &&
                          product.volumePrices.length > 1
                            ? "text-xs"
                            : "text-sm"
                        }`}
                      >
                        {product.volumePrices &&
                        product.volumePrices.length > 1
                          ? `${product.volumePrices[0]?.price.toLocaleString()} - ${product.volumePrices[
                              product.volumePrices.length - 1
                            ]?.price.toLocaleString()} VND`
                          : `${
                              product.volumePrices?.[0]?.price.toLocaleString() ||
                              "Liên hệ"
                            } VND`}
                      </p>
                    </div>
                    <div className="flex gap-2 mt-1">
                      <button
                        className={`flex px-2 items-center justify-center gap-1 border rounded-lg transition ${
                          isWishlisted && product.volumePrices?.length === 1 
                            ? "bg-red-600 text-white border-red-600 hover:bg-red-700"
                            : "bg-white text-red-600 border-red-600 hover:bg-red-100"
                        }`}
                        onClick={(e) => handleWishlistClick(e, product)}
                        title={
                          isWishlisted && product.volumePrices?.length === 1
                            ? "Bỏ thích"
                            : "Thêm vào yêu thích"
                        }
                      >
                        {" "}
                        <Heart
                          size={16}
                          fill={
                            isWishlisted &&
                            product.volumePrices?.length === 1
                              ? "currentColor"
                              : "none"
                          }
                        />{" "}
                      </button>
                      <button
                        className="flex-1 flex items-center justify-center gap-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
                        onClick={() => {
                          handleQuickView(product);
                        }}
                      >
                        {" "}
                        <Eye size={16} />{" "}
                        <span className="text-sm">Xem nhanh</span>{" "}
                      </button>
                    </div>
                  </div>
                </div>
              );
              })}
      </div>

      {showPopup && selectedProduct && (
        <QuickView
          selectedProduct={selectedProduct}
          handleClosePopup={handleClosePopup}
        />
      )}
    </div>
  );
};

export default BestSellingProduct;
