import { ChevronLeft, ChevronRight, Eye, Heart } from "lucide-react";
import React, { useEffect, useState } from "react";
import QuickView from "./QuickView";
import axios from "axios";
import { useWishlist } from "../context/WishlistContext";
import { useNavigate } from "react-router-dom";

const FlashDeal = () => {
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

  const navigate = useNavigate()

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

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        else if (prev.minutes > 0)
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        else if (prev.hours > 0)
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (time) => (time < 10 ? `0${time}` : time);
  // const formatPrice = (price) => price.toLocaleString("vi-VN") + " VND";

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
  const handleClickProduct = (id) => {
    navigate(`/products/${id}`);
  };

  return (
    <div id="flash-deal" className="flex flex-col mx-4 md:m-12 relative">
      <div className="flex absolute translate-y-4 translate-x-2 md:translate-x-12 items-center bg-gradient-to-r from-red-500 to-red-700 text-white py-1 md:py-2 px-2 md:px-4 rounded-lg shadow-lg">
        <svg
          width="16"
          height="24"
          className="fill-yellow-300 animate-pulse"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M14.394 11.6854C14.349 11.5226 14.2702 11.371 14.1626 11.2407C14.0551 11.1104 13.9212 11.0043 13.7698 10.9293L9.70106 8.91289L10.7933 1.36344C10.8292 1.10179 10.7778 0.835614 10.6471 0.606141C10.5164 0.376669 10.3136 0.196718 10.0702 0.094173C9.82685 -0.00837155 9.55645 -0.0277836 9.30093 0.0389447C9.0454 0.105673 8.81902 0.254816 8.65686 0.463262L0.255241 11.2653C0.141203 11.411 0.0623685 11.581 0.0248924 11.7621C-0.0125837 11.9433 -0.00768753 12.1306 0.0391991 12.3095C0.0921791 12.4886 0.184268 12.6536 0.30881 12.7926C0.433351 12.9317 0.587235 13.0414 0.759338 13.1137L5.88433 15.1661L4.79212 22.6315C4.75499 22.8995 4.80946 23.1721 4.94672 23.4052C5.08397 23.6383 5.29594 23.8183 5.54826 23.9158C5.68891 23.9741 5.84011 24.0027 5.99235 23.9998C6.19003 23.9988 6.38441 23.9489 6.5582 23.8547C6.73199 23.7605 6.87981 23.6248 6.98854 23.4597L14.1899 12.6576C14.2914 12.5195 14.3621 12.3613 14.3972 12.1936C14.4324 12.0259 14.4313 11.8526 14.394 11.6854Z" />
        </svg>
        <h2 className="text-white md:font-bold text-xs md:text-xl ml-1 md:ml-2">
          Flash Deals
        </h2>
      </div>

      <div className="flex absolute translate-y-4 right-0 mr-2 md:mr-8 bg-white px-2 md:px-4 items-center space-x-1 md:space-x-4">
        <div className="text-black font-semibold hidden md:block md:text-base">
          Kết thúc sau:
        </div>
        <div className="flex space-x-1 md:space-x-2">
          {["hours", "minutes", "seconds"].map((unit, idx) => (
            <React.Fragment key={unit}>
              <div className="bg-red-600 text-white rounded-md py-1 px-1 md:px-2 flex items-center justify-center min-w-8 md:min-w-12">
                <span className="font-bold text-sm md:text-xl">
                  {formatTime(timeLeft[unit])}
                </span>
              </div>
              {idx < 2 && (
                <span className="font-bold text-sm md:text-xl">:</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="w-full items-center top-1/2 absolute">
        <button
          className="absolute w-8 h-8 md:w-12 md:h-12 left-0 bg-white rounded-full flex items-center justify-center shadow-lg z-10"
          onClick={handlePrevProducts}
        >
          <ChevronLeft className="w-6 h-6 md:w-12 md:h-12 text-red-600" />
        </button>
        <button
          className="absolute w-8 h-8 md:w-12 md:h-12 right-0 bg-white rounded-full flex items-center justify-center shadow-lg z-10"
          onClick={handleNextProducts}
        >
          <ChevronRight className="w-6 h-6 md:w-12 md:h-12 text-red-600" />
        </button>
      </div>

      <div className="p-4 md:p-8 border-2 rounded-lg mt-8">
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
                          {/* <p
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
                          </p> */}
                          <div className="flex flex-col items-center text-sm">
  {product.volumePrices && product.volumePrices.length > 0 && (
    <>
      <span className="text-gray-500 line-through">
        {product.volumePrices.length > 1
          ? `${Math.round(product.volumePrices[0].price * 1.1).toLocaleString()} - ${Math.round(
              product.volumePrices[product.volumePrices.length - 1].price * 1.1
            ).toLocaleString()} VND`
          : `${Math.round(product.volumePrices[0].price * 1.1).toLocaleString()} VND`}
      </span>
      <span
        className={`text-red-600 font-semibold ${
          product.volumePrices.length > 1 ? "text-xs" : "text-sm"
        }`}
      >
        {product.volumePrices.length > 1
          ? `${product.volumePrices[0].price.toLocaleString()} - ${product.volumePrices[
              product.volumePrices.length - 1
            ].price.toLocaleString()} VND`
          : `${product.volumePrices[0].price.toLocaleString()} VND`}
      </span>
    </>
  )}
</div>

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

export default FlashDeal;
