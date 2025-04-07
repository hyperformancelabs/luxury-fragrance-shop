import React, { useState } from 'react';

const QuickView = () => {
  const [quantity, setQuantity] = useState(4);
  const [selectedSize, setSelectedSize] = useState('75ml');
  
  // Available sizes and their selection state
  const sizes = [
    { value: '50ml', label: '50ml' },
    { value: '75ml', label: '75ml' },
    { value: '100ml', label: '100ml' },
    { value: '120ml', label: '120ml' },
    { value: '200ml', label: '200ml' }
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
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded w-full max-w-3xl relative">
        {/* Close button */}
        <button className="absolute top-2 right-2 text-2xl font-bold">X</button>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Product Image */}
          <div className="flex-shrink-0 w-full md:w-1/3">
            <div className="mb-4">
              <img 
                src="/api/placeholder/300/300"
                alt="Versace Bright Crystal" 
                className="w-full" 
              />
            </div>
            
            {/* Thumbnail images */}
            <div className="flex gap-2">
              <img src="/api/placeholder/60/60" alt="Thumbnail 1" className="w-16 h-16 border" />
              <img src="/api/placeholder/60/60" alt="Thumbnail 2" className="w-16 h-16 border" />
            </div>
          </div>
          
          {/* Product Details */}
          <div className="flex-1">
            <h1 className="text-xl font-bold mb-2">Nước Hoa Nữ Versace Bright Crystal EDT</h1>
            
            {/* Rating */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center">
                <div className="bg-red-600 text-white px-2 py-1">
                  <span className="font-bold">5</span>★
                </div>
                <span className="text-gray-500 text-sm ml-2">(38 đánh giá)</span>
              </div>
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-1"></span>
                <span className="text-green-500">CÒN HÀNG</span>
              </div>
            </div>
            
            {/* Product Info */}
            <div className="flex gap-4 mb-4 text-sm">
              <div>
                <span>Mã sản phẩm: </span>
                <span className="font-bold">#1234567890</span>
              </div>
              <div>
                <span>Thương hiệu: </span>
                <span className="font-bold text-red-600">VERSACE</span>
              </div>
              <div>
                <span>Quốc gia: </span>
                <span className="font-bold">Pháp</span>
              </div>
            </div>
            
            {/* Price */}
            <div className="mb-4">
              <div className="text-gray-600">150.000 VND - 2.400.000 VND</div>
              <div className="text-xl font-bold text-red-600">2.400.000 VND</div>
            </div>
            
            {/* Size Selection */}
            <div className="mb-4">
              <div className="flex gap-2">
                {sizes.map((size) => (
                  <button
                    key={size.value}
                    className={`border px-6 py-2 ${
                      selectedSize === size.value 
                        ? size.value === '200ml' ? 'bg-black text-white' : 'border-black' 
                        : 'border-gray-300'
                    }`}
                    onClick={() => handleSizeSelect(size.value)}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Quantity */}
            <div className="mb-6">
              <div className="flex items-center gap-2">
                <span>Số lượng:</span>
                <div className="flex">
                  <button 
                    className="border border-gray-300 px-3 py-1"
                    onClick={handleDecrement}
                  >
                    -
                  </button>
                  <div className="border-t border-b border-gray-300 px-6 py-1">{quantity}</div>
                  <button 
                    className="border border-gray-300 px-3 py-1"
                    onClick={handleIncrement}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-2">
              <button className="border border-gray-300 px-6 py-2 flex-1">Yêu thích</button>
              <button className="border border-gray-300 px-6 py-2 flex-1">Thêm vào giỏ hàng</button>
              <button className="border border-gray-300 px-6 py-2 flex-1">Mua ngay</button>
            </div>
            
            {/* Hotline */}
            <div className="mt-6 flex items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <span className="text-lg">📞</span>
                </div>
                <div>
                  <span>HOTLINE ĐẶT HÀNG:</span>
                  <span className="text-red-600 font-bold ml-2">0123456790</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickView;