import React, { useState } from 'react';

const Wishlist = () => {
  // Sample wishlist data
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 1,
      name: 'Wireless Noise Cancelling Headphones',
      price: 2500000,
      image: '/sp2.jpg',
      inStock: true
    },
    {
      id: 2,
      name: 'Premium Leather Wallet',
      price: 850000,
      image: '/sp2.jpg',
      inStock: true
    },
    {
      id: 3,
      name: 'Smartphone Case Carbon Fiber',
      price: 350000,
      image: '/sp2.jpg',
      inStock: false
    },
    {
      id: 4,
      name: 'Limited Edition Watch',
      price: 4300000,
      image: '/sp2.jpg',
      inStock: true
    }
  ]);


  const removeFromWishlist = (itemId) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== itemId));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-black text-white p-4">
        <div className="container mx-24">
          <h1 className="text-sm font-light">TRANG CHỦ / DANH SÁCH YÊU THÍCH</h1>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-medium">Danh Sách Yêu Thích</h2>
            <span className="text-gray-500">{wishlistItems.length} sản phẩm</span>
          </div>

          {wishlistItems.length > 0 ? (
            <div className="space-y-6">
              {wishlistItems.map((item) => (
                <div key={item.id} className="flex flex-col md:flex-row border-b border-gray-200 pb-6 justify-between">
                  <div className="md:w-1/8 mb-4 md:mb-0">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-32 h-auto rounded-md"
                    />
                  </div>
                  <div className="md:w-3/6 md:pl-6 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-medium mb-2">{item.name}</h3>
                      <p className={`text-sm ${item.inStock ? 'text-green-600' : 'text-red-600'}`}>
                        {item.inStock ? 'Còn hàng' : 'Hết hàng'}
                      </p>
                    </div>
                    <div className="mt-4 flex items-center space-x-2">
                      <button 
                        onClick={() => removeFromWishlist(item.id)}
                        className="text-gray-500 hover:text-red-600 transition text-sm flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                        Xóa
                      </button>
                    </div>
                  </div>
                  <div className="md:w-2/6 flex flex-col items-start md:items-end justify-between mt-4 md:mt-0">
                    <p className="text-xl font-medium">{formatPrice(item.price)}</p>
                    <button 
                      className={`mt-4 px-6 py-2 rounded-md transition ${
                        item.inStock 
                          ? 'bg-red-600 text-white hover:bg-red-400' 
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                      disabled={!item.inStock}
                    >
                      Thêm vào giỏ hàng
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
          <div className="mt-8 flex justify-between">
            <button className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition">
              Xóa tất cả
            </button>
            <button className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-500 transition">
              Thêm tất cả vào giỏ hàng
            </button>
          </div>
        )}
      </main>

    </div>
  );
};

export default Wishlist;