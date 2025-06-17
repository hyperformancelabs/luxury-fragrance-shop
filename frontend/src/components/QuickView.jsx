import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { Toaster, toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import ErrorMessages from "../constants/ErrorMessages.js";
import SuccessMessages from "../constants/SuccessMessages.js";
import { useWishlist } from "../context/WishlistContext.jsx";
import { useNavigate } from "react-router-dom";

const QuickView = ({ selectedProduct, handleClosePopup }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [error, setError] = useState("");
  const { addToCart, localCart, setLocalCart } = useCart();
  const { user } = useAuth();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();

  const sizes = selectedProduct.volumePrices.map((item) => ({
    value: `${item.volume}ml`,
    label: `${item.volume}ml`,
    price: item.price,
  }));

  useEffect(() => {
    if (sizes.length === 1) {
      setSelectedSize(sizes[0].value);
    }
  }, [sizes]);

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    setError("");
  };

  const formatPrice = (price, withVND = true) => {
    if (!price) return "0";
    const formatted = Number(price).toLocaleString("vi-VN");
    return withVND ? `${formatted} VND` : formatted;
  };

  const selectedSizeObj = sizes.find((size) => size.value === selectedSize);

  const priceDisplay = (() => {
    if (!sizes || sizes.length === 0) return "Chưa có giá";

    if (selectedSizeObj) {
      return formatPrice(selectedSizeObj.price);
    }

    if (sizes.length === 1) {
      return formatPrice(sizes[0].price);
    } else {
      const sortedPrices = sizes
        .map((size) => size.price)
        .sort((a, b) => a - b);
      return `${formatPrice(sortedPrices[0], false)} - ${formatPrice(
        sortedPrices[sortedPrices.length - 1]
      )}`;
    }
  })();

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error(ErrorMessages.SIZE_REQUIRED);
      return;
    }

    const variant = selectedProduct.volumePrices.find(
      (v) => `${v.volume}ml` === selectedSize
    );

    const variantId =
      variant?.variantId || variant?.productVariantId || variant?.id;

    if (!variant || !variantId) {
      toast.error(ErrorMessages.VARIANT_NOT_FOUND);
      return;
    }

    const item = {
      productVariantId: variantId,
      productName: selectedProduct.productName,
      unitPrice: variant.price,
      quantity: quantity,
      imageUrl: selectedProduct.imageUrl,
      volume: variant.volume,
      note: `Size ${variant.volume}ml`,
      selectedSize: selectedSize,
      quantityInStock: variant.quantityInStock,
    };

    if (user) {
      addToCart(item);
      // toast.success(SuccessMessages.ADD_TO_CART_SUCCESS);
      handleClosePopup();
    } else {
      const isProductInCart = localCart.some(
        (product) =>
          product.productVariantId === item.productVariantId &&
          product.selectedSize === item.selectedSize
      );

      if (isProductInCart) {
        setLocalCart((prevCart) =>
          prevCart.map((product) =>
            product.productVariantId === item.productVariantId &&
            product.selectedSize === item.selectedSize
              ? { ...product, quantity: product.quantity + quantity }
              : product
          )
        );
        // toast.success(SuccessMessages.UPDATE_CART_SUCCESS);
      } else {
        setLocalCart((prevCart) => [...prevCart, item]);
        toast.success(SuccessMessages.ADD_TO_CART_LOCAL_SUCCESS);
      }

      handleClosePopup();
    }
  };

  const handleAddToWishlist = () => {
    try {
      if (!selectedSize) {
        toast.error(ErrorMessages.SIZE_REQUIRED);
        return;
      }

      const variant = selectedProduct.volumePrices.find(
        (v) => `${v.volume}ml` === selectedSize
      );

      const variantId =
        variant?.productVariantId || variant?.variantId || variant?.id;

      if (!variantId) {
        toast.error(ErrorMessages.VARIANT_NOT_FOUND);
        return;
      }

      if (isInWishlist(variantId)) {
        removeFromWishlist(variantId);
        toast.success(SuccessMessages.REMOVE_FROM_WISHLIST_SUCCESS);
      } else {
        addToWishlist(variantId);
        toast.success(SuccessMessages.ADD_TO_WISHLIST_SUCCESS);
      }
    } catch (error) {
      console.error(error);
      toast.error(ErrorMessages.ADD_TO_WISHLIST_FAIL);
    }
  };

  const navigate = useNavigate()
  const handleClickBuy = () => {
    handleAddToCart()
    setTimeout(() => {
      toast.success('Đang chuyển đến trang thanh toán')
      navigate('/checkout')
    }, 1000)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-4 md:p-6 rounded w-full max-w-4xl relative flex flex-col md:flex-row">
        <button
          className="absolute top-0 right-2 text-red-600 text-2xl md:text-4xl font-bold"
          onClick={handleClosePopup}
        >
          &times;
        </button>

        <div className="w-full md:w-1/2 mb-4 md:mb-0">
          <div className="mb-4 flex justify-center items-center border">
            <img
              src={selectedProduct.imageUrl}
              alt={selectedProduct.productName}
              className="w-32 h-32 md:w-64 md:h-64"
            />
          </div>

          <div className="flex gap-2 justify-start items-start">
            <img
              src={selectedProduct.imageUrl}
              alt={selectedProduct.productName}
              className="w-12 h-12 md:w-24 md:h-24 border"
            />
            <img
              src={selectedProduct.imageUrl}
              alt={selectedProduct.productName}
              className="w-12 h-12 md:w-24 md:h-24 border"
            />
          </div>
        </div>

        <div className="p-2 md:p-4 w-full md:w-1/2 flex flex-col justify-start items-start">
          <p className="text-start text-base md:text-xl font-bold mb-2 md:mb-4">
            {selectedProduct.productName}
          </p>
          <div className="flex flex-row justify-between items-start md:items-center w-full">
            <p className="text-sm md:text-base">
              Thương hiệu: {selectedProduct.brandName}
              <span className="text-red-600 font-semibold"></span>
            </p>
            <p className="text-sm md:text-base">
              Quốc gia: {selectedProduct.countryOfOrigin}
              <span className="text-red-600 font-semibold"></span>
            </p>
          </div>
          <p className="text-start text-red-600 font-bold my-2 text-xl md:text-2xl">
            {priceDisplay}
          </p>

          {error && <p className="text-red-600 text-sm w-full mb-2">{error}</p>}

          <div className="mb-2 w-full">
            <p className="text-sm md:text-base font-medium mb-2">Dung tích:</p>
            <div className="flex flex-wrap gap-2 w-full justify-between">
              {sizes.map((size) => (
                <button
                  key={size.value}
                  className={`border px-4 py-1 text-xs md:text-sm rounded-md ${
                    selectedSize === size.value
                      ? "bg-black text-white"
                      : "border-gray-300"
                  }`}
                  onClick={() => handleSizeSelect(size.value)}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>

          <div className="my-2 flex gap-4 items-center">
            <label className="block text-base font-medium">Số lượng:</label>
            <div className="inline-flex rounded-md border border-gray-300 overflow-hidden">
              <button
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition-colors"
                onClick={handleDecrement}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20 12H4"
                  ></path>
                </svg>
              </button>
              <span className="flex items-center justify-center w-12 font-medium">
                {quantity}
              </span>
              <button
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition-colors"
                onClick={handleIncrement}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  ></path>
                </svg>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 w-full my-2 justify-between">
            <button
              className={`px-4 py-2 text-xs md:text-sm rounded-md transition duration-300 ${
                selectedSize &&
                selectedProduct.volumePrices.some(
                  (v) =>
                    `${v.volume}ml` === selectedSize &&
                    isInWishlist(v.productVariantId)
                )
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-gray-200 text-black hover:bg-gray-300"
              }`}
              onClick={handleAddToWishlist}
            >
              {selectedSize &&
              selectedProduct.volumePrices.some(
                (v) =>
                  `${v.volume}ml` === selectedSize &&
                  isInWishlist(v.productVariantId)
              )
                ? "Bỏ yêu thích"
                : "Yêu thích ❤️"}
            </button>

            <button
              className="bg-red-600 text-white px-4 py-2 text-xs md:text-sm rounded-md hover:bg-red-700 transition duration-300"
              onClick={handleAddToCart}
            >
              Thêm vào giỏ hàng
            </button>
            <button className="bg-black text-white px-4 py-2 text-xs md:text-sm rounded-md hover:bg-gray-800 transition duration-300" onClick={handleClickBuy}>
              Mua ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickView;
