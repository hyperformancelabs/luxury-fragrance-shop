import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import React, { useEffect, useState } from "react";

const NewProduct = () => {
  const [selectedSize, setSelectedSize] = useState('75ml');
  const [showPopup, setShowPopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [startIndex, setStartIndex] = useState(0);

  const sizes = [
    { value: '50ml', label: '50ml' },
    { value: '75ml', label: '75ml' },
    { value: '100ml', label: '100ml' },
    { value: '120ml', label: '120ml' },
    { value: '200ml', label: '200ml' }
  ];

  const products = [
    {
      name: "Versace Eros Flame Eau De Toilette",
      price: "1.200.000 - 1.500.000 VND",
      brand: "VERSACE",
      img: "sp2.jpg",
      country: "Pháp"
    },
    {
      name: "Versace Eros Eau De Toilette",
      price: "1.000.000 - 1.200.000 VND",
      brand: "VERSACE",
      img: "sp2.jpg",
      country: "Pháp"
    },
    {
      name: "Versace Bright Crystal",
      price: "1.100.000 - 1.400.000 VND",
      brand: "VERSACE",
      img: "sp2.jpg",
      country: "Pháp"
    },
    {
      name: "Versace Bright Crystal",
      price: "1.100.000 - 1.400.000 VND",
      brand: "VERSACE",
      img: "sp2.jpg",
      country: "Pháp"
    },
    {
      name: "Versace Bright Crystal",
      price: "1.100.000 - 1.400.000 VND",
      brand: "VERSACE",
      img: "sp2.jpg",
      country: "Pháp"
    },

  ];

  const handleQuickView = (product) => {
    setSelectedProduct(product);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedProduct(null);
    setQuantity(1);
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };


  const handleNextProducts = () => {
    if (startIndex + getProductsPerView() < products.length) {
      setStartIndex(startIndex + getProductsPerView());
    } else {
      setStartIndex(0);
    }
  };

  const handlePrevProducts = () => {
    if (startIndex - getProductsPerView() >= 0) {
      setStartIndex(startIndex - getProductsPerView());
    } else {
      setStartIndex(Math.max(0, products.length - getProductsPerView()));
    }
  };

  return (
    <div id="new-product" className="flex flex-col mb-12 mx-4 md:m-16 relative">
      <div className="w-full flex justify-between items-center md:mb-4">
        <h2 className="font-bold md:text-2xl">SẢN PHẨM MỚI</h2>
        <button className="hover:underline hover:text-red-600 font-semibold">
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
        {products.map((product, index) => (
          <div
            key={index}
            className="flex flex-col items-center border-2 border-gray-300 rounded-lg p-2 md:p-4"
          >
            <img
              src={product.img}
              alt={product.name}
              className="h-20 md:h-40 w-auto"
            />
            <div className="flex flex-col items-center mt-2 md:mt-4 w-full h-full">
              <h3 className="font-bold text-xs md:text-base">{product.brand}</h3>
              <div className="h-8 md:h-12 flex items-center justify-center">
                <p className="font-medium text-xs md:text-sm text-center">{product.name}</p>
              </div>
              <div className="font-extrabold text-xs text-red-600 mb-2">
                {product.price}
              </div>
              <div className="flex justify-center gap-4 w-full mt-auto">
                <button className="p-1 md:p-2 text-white text-xs rounded-md bg-red-600">
                  Yêu thích
                </button>
                <button
                  className="p-1 md:p-2 text-white text-xs rounded-md bg-black"
                  onClick={() => handleQuickView(product)}
                >
                  Xem nhanh
                </button>
              </div>
            </div>
          </div>
        ))}
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

export default NewProduct;