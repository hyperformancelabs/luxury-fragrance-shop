import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

const QuickView = ({ selectedProduct, handleClosePopup }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
    const { addToCart } = useCart();

  const sizes = [
    { value: '50ml', label: '50ml', price: 350000 },
    { value: '75ml', label: '75ml', price: 420000 },
    { value: '100ml', label: '100ml', price: 520000 },
    { value: '120ml', label: '120ml', price: 610000 },
    { value: '200ml', label: '200ml', price: 700000 }
  ];


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
  };

  const formatPrice = (price) => price.toLocaleString('vi-VN') + ' VND';

  const selectedSizeObj = sizes.find(size => size.value === selectedSize);

  const priceDisplay = selectedSizeObj
    ? formatPrice(selectedSizeObj.price)
    : `${formatPrice(Math.min(...sizes.map(size => size.price)))} - ${formatPrice(Math.max(...sizes.map(size => size.price)))}`


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
              src={selectedProduct.img}
              alt={selectedProduct.name}
              className="w-32 h-32 md:w-64 md:h-64"
            />
          </div>

          <div className="flex gap-2 justify-center">
            <img src={selectedProduct.img} alt="Thumbnail 1" className="w-12 h-12 md:w-24 md:h-24 border" />
            <img src={selectedProduct.img} alt="Thumbnail 2" className="w-12 h-12 md:w-24 md:h-24 border" />
          </div>
        </div>

        <div className="p-2 md:p-4 w-full md:w-1/2 flex flex-col justify-start items-start">
          <p className="text-start text-base md:text-xl font-bold mb-2 md:mb-4">{selectedProduct.name}</p>
          <div className="flex flex-row justify-between items-start md:items-center w-full">
            <p className="text-sm md:text-base">Thương hiệu: <span className="text-red-600 font-semibold">{selectedProduct.brand}</span></p>
            <p className="text-sm md:text-base">Quốc gia: <span className="text-red-600 font-semibold">{selectedProduct.country}</span></p>
          </div>
          <p className="text-start text-red-600 font-bold my-2 text-xl md:text-2xl">{priceDisplay}</p>

          <div className="mb-4 w-full">
            <div className="flex flex-wrap gap-2 w-full justify-between">
              {sizes.map((size) => (
                <button
                  key={size.value}
                  className={`border px-4 py-1 text-xs md:text-sm rounded-md ${selectedSize === size.value
                    ? 'bg-black text-white'
                    : 'border-gray-300'
                    }`}
                  onClick={() => handleSizeSelect(size.value)}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4 w-full">
            <p className="text-sm md:text-base">Số lượng: </p>
            <div className="flex items-center gap-2">
              <button
                className="border font-bold border-gray-300 px-2 md:px-4 py-1 md:py-2 rounded-md"
                onClick={handleDecrement}
              >
                -
              </button>
              <div className="font-bold text-base md:text-xl px-2 md:px-4 py-1">{quantity}</div>
              <button
                className="border font-bold border-gray-300 px-2 md:px-4 py-1 md:py-2 rounded-md"
                onClick={handleIncrement}
              >
                +
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 w-full justify-between">
            <button className="bg-gray-200 text-black px-4 py-2 text-xs md:text-sm rounded-md hover:bg-gray-300 transition duration-300">
              Yêu thích
            </button>
            <button className="bg-red-600 text-white px-4  py-2 text-xs md:text-sm rounded-md hover:bg-red-700 transition duration-300"               onClick={() => addToCart(selectedProduct)}
            >
              Thêm vào giỏ hàng
            </button>
            <button className="bg-black text-white px-4  py-2 text-xs md:text-sm rounded-md hover:bg-gray-800 transition duration-300">
              Mua ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickView;