import React, { useState, useEffect } from 'react';
import { useWishlist } from '../context/WishlistContext';
import { Delete, Recycle, Trash } from 'lucide-react';

const Wishlist = () => {
  const {
    wishlist,
    removeFromWishlist,
    moveAllToCart,
    isInWishlist,
    loading,
  } = useWishlist();

  const [selectedSizes, setSelectedSizes] = useState({});
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    // Initialize quantity to 1 for all items
    const initialQuantities = {};
    wishlist.forEach(item => {
      initialQuantities[item.productVariantId] = 1;
    });
    console.log(initialQuantities)
    setQuantities(initialQuantities);
  }, [wishlist]);

  const formatPrice = (price) => price + ' VND';

  const handleSizeSelect = (productVariantId, size) => {
    setSelectedSizes(prev => ({ ...prev, [productVariantId]: size }));
  };

  const increaseQuantity = (productVariantId) => {
    setQuantities(prev => ({
      ...prev,
      [productVariantId]: (prev[productVariantId] || 1) + 1,
    }));
  };

  const decreaseQuantity = (productVariantId) => {
    setQuantities(prev => ({
      ...prev,
      [productVariantId]: Math.max(1, (prev[productVariantId] || 1) - 1),
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
            <span className="text-gray-500">{wishlist.length} sản phẩm</span>
          </div>

          {loading ? (
            <p>Đang tải...</p>
          ) : wishlist.length > 0 ? (
            <div className="space-y-6">
              {wishlist.map((item) => (
                <div
                  key={item.productVariantId}
                  className="flex flex-col md:flex-row border-b border-gray-200 pb-6 justify-between"
                >
                  <div className="md:w-1/6 mb-4 md:mb-0">
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      className="w-24 md:w-32 h-auto rounded-md"
                    />
                  </div>
                  <div className="md:w-3/6 md:pl-4 lg:pl-6 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base lg:text-lg font-medium">
                        {item.productName} - {item.volume}ml
                      </h3>
                      <div className='mb-2 flex gap-8'>
                        <span className="text-sm text-gray-500">
                          Thương hiệu: {item.brandName}
                        </span>
                        <span className="text-sm text-gray-500 ml-2">
                          Quốc gia: {item.countryOfOrigin}
                        </span>
                      </div>
                      <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
                        <label className="block mb-1 md:mb-0">Số lượng:</label>
                        <div className="inline-flex rounded-md border border-gray-300 overflow-hidden">
                          <button
                            className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
                            onClick={() => decreaseQuantity(item.productVariantId)}
                          >
                            -
                          </button>
                          <span className="flex items-center justify-center w-10 font-medium">
                            {quantities[item.productVariantId] || 1}
                          </span>
                          <button
                            className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
                            onClick={() => increaseQuantity(item.productVariantId)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center space-x-2">
                      <button
                        onClick={() => removeFromWishlist(item.productVariantId)}
                        className="text-gray-500 hover:text-red-600 hover:underline transition text-sm flex items-center"
                      >
                        Xóa khỏi danh sách yêu thích
                        
                       <Trash className="ml-1" size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="md:w-2/6 flex flex-col items-start md:items-end justify-between mt-4 md:mt-0">
                    <p className="text-lg md:text-xl font-semibold text-red-700">
                      {formatPrice(item.price)}
                    </p>
                    <button
                      className={`mt-3 md:mt-4 px-4 md:px-6 py-2 rounded-md transition bg-red-600 text-white hover:bg-red-500`}
                    >
                      Thêm vào giỏ hàng
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 md:py-16">
              <svg className="w-12 h-12 md:w-16 md:h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

        {wishlist.length > 0 && (
          <div className="mt-6 md:mt-8 flex flex-col md:flex-row justify-between gap-4">
            <button
              className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition order-2 md:order-1"
              onClick={() => wishlist.forEach(item => removeFromWishlist(item.productVariantId))}
            >
              Xóa tất cả
            </button>
            <button
              className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-500 transition order-1 md:order-2"
              onClick={moveAllToCart}
            >
              Thêm tất cả vào giỏ hàng
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Wishlist;
