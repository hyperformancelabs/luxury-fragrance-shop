import React, { useState } from 'react';

const Wishlist = () => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSizes, setSelectedSizes] = useState({});

  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 1,
      name: 'Wireless Noise Cancelling Headphones',
      image: '/sp2.jpg',
      inStock: true,
      sizes: [
        { value: '50ml', label: '50ml', price: 2700000 },
        { value: '75ml', label: '75ml', price: 3000000 }
      ]
    },
    {
      id: 2,
      name: 'Premium Leather Wallet',
      image: '/sp2.jpg',
      inStock: true,
      sizes: [
        { value: '50ml', label: '50ml', price: 2700000 },
        { value: '75ml', label: '75ml', price: 3000000 }
      ]
    },
    {
      id: 3,
      name: 'Smartphone Case Carbon Fiber',
      image: '/sp2.jpg',
      inStock: false,
      sizes: [
        { value: '50ml', label: '50ml', price: 2700000 },
        { value: '75ml', label: '75ml', price: 3000000 }
      ]
    },
    {
      id: 4,
      name: 'Limited Edition Watch',
      image: '/sp2.jpg',
      inStock: true,
      sizes: [
        { value: '50ml', label: '50ml', price: 2700000 },
        { value: '75ml', label: '75ml', price: 3000000 }
      ]
    }
  ]);

  const removeFromWishlist = (itemId) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== itemId));
  };

  const removeAllItems = () => {
    setWishlistItems([]);
  };

  const formatPrice = (price) => price.toLocaleString('vi-VN') + ' VND';
  
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleSizeSelect = (productId, size) => {
    setSelectedSizes(prev => ({
      ...prev,
      [productId]: size
    }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-black text-white p-4">
        <div className="container mx-16 px-4">
          <h1 className="text-sm font-light">TRANG CHỦ / DANH SÁCH YÊU THÍCH</h1>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <div className="flex justify-between items-center mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-medium">Danh Sách Yêu Thích</h2>
            <span className="text-gray-500">{wishlistItems.length} sản phẩm</span>
          </div>

          {wishlistItems.length > 0 ? (
            <div className="space-y-6">
              {wishlistItems.map((item) => {
                const selectedSize = selectedSizes[item.id];
                const selectedSizeObj = item.sizes.find(size => size.value === selectedSize);
                const priceDisplay = selectedSizeObj
                  ? formatPrice(selectedSizeObj.price)
                  : `${formatPrice(Math.min(...item.sizes.map(size => size.price)))} - ${formatPrice(Math.max(...item.sizes.map(size => size.price)))}`;
                
                return (
                  <div key={item.id} className="flex flex-col md:flex-row border-b border-gray-200 pb-6 justify-between">
                    <div className="md:w-1/6 mb-4 md:mb-0">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-24 md:w-32 h-auto rounded-md"
                      />
                    </div>
                    <div className="md:w-3/6 md:pl-4 lg:pl-6 flex flex-col justify-between">
                      <div>
                        <h3 className="text-base lg:text-lg font-medium mb-2">{item.name}</h3>
                        <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-start md:items-center mb-2">
                          <p className="w-24">Dung tích:</p>
                          <div className="w-full">
                            <div className="flex flex-wrap gap-2 w-full justify-start">
                              {item.sizes.map((size) => (
                                <button
                                  key={size.value}
                                  className={`border px-3 py-1 text-xs md:text-sm rounded-md ${
                                    selectedSize === size.value
                                      ? 'bg-black text-white'
                                      : 'border-gray-300'
                                  }`}
                                  onClick={() => handleSizeSelect(item.id, size.value)}
                                >
                                  {size.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
                            <label className="block mb-1 md:mb-0">Số lượng:</label>
                            <div className="inline-flex rounded-md border border-gray-300 overflow-hidden">
                              <button 
                                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors"
                                onClick={decreaseQuantity}
                                aria-label="Giảm số lượng"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path>
                                </svg>
                              </button>
                              <span className="flex items-center justify-center w-10 font-medium">{quantity}</span>
                              <button 
                                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors"
                                onClick={increaseQuantity}
                                aria-label="Tăng số lượng"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center space-x-2">
                        <button 
                          onClick={() => removeFromWishlist(item.id)}
                          className="text-gray-500 hover:text-red-600 transition text-sm flex items-center"
                          aria-label="Xóa sản phẩm"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                          </svg>
                          Xóa
                        </button>
                      </div>
                    </div>
                    <div className="md:w-2/6 flex flex-col items-start md:items-end justify-between mt-4 md:mt-0">
                      <p className="text-lg md:text-xl font-semibold text-red-700">{priceDisplay}</p>
                      <button 
                        className={`mt-3 md:mt-4 px-4 md:px-6 py-2 rounded-md transition ${
                          item.inStock 
                            ? 'bg-red-600 text-white hover:bg-red-500' 
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                        disabled={!item.inStock}
                      >
                        {item.inStock ? 'Thêm vào giỏ hàng' : 'Hết hàng'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 md:py-16">
              <svg className="w-12 h-12 md:w-16 md:h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
              <h3 className="mt-4 text-lg font-medium">Danh sách yêu thích trống</h3>
              <p className="mt-2 text-gray-500">Bạn chưa thêm sản phẩm nào vào danh sách yêu thích</p>
              <button className="mt-6 bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition">
                Tiếp tục mua sắm
              </button>
            </div>
          )}
        </div>

        {wishlistItems.length > 0 && (
          <div className="mt-6 md:mt-8 flex flex-col md:flex-row justify-between gap-4">
            <button 
              className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition order-2 md:order-1"
              onClick={removeAllItems}
            >
              Xóa tất cả
            </button>
            <button className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-500 transition order-1 md:order-2">
              Thêm tất cả vào giỏ hàng
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Wishlist;