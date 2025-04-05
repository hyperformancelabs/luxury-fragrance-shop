import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user } = useAuth();
  const { cart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Xử lý tìm kiếm ở đây
    console.log('Tìm kiếm:', searchQuery);
  };

  return (
    <>
      {/* Thanh thông tin liên hệ */}
      <div className="w-full bg-black text-white py-1">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="text-sm">
            11 Nguyễn Đình Chiểu, Phường Đakao, Quận 1, TP Hồ Chí Minh
          </div>
          <div className="text-sm">
            Hotline: 0862852822
          </div>
        </div>
      </div>

      {/* Thanh Navbar chính */}
      <nav className="w-full bg-white shadow-md py-3">
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-4xl font-italic">
              <span className="text-red-600 font-bold font-righteous italic">APH</span>
              <span className="text-black italic font-righteous"> Perfume</span>
            </Link>
          </div>

          {/* Thanh tìm kiếm */}
          <div className="flex-grow max-w-xl mx-4">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm, thương hiệu bạn muốn..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-gray-300"
              />
              <button 
                type="submit" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>

          {/* Các nút chức năng */}
          <div className="flex items-center space-x-8">
            {/* Nút Hỗ trợ */}
            <Link to="/support" className="flex flex-col items-center text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="text-xs mt-1">Hỗ trợ</span>
            </Link>

            {/* Nút Đăng nhập/Đăng ký */}
            {user ? (
              <Link to="/account" className="flex flex-col items-center text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-xs mt-1">{user.name}</span>
              </Link>
            ) : (
              <Link to="/login" className="flex flex-col items-center text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-xs mt-1 text-center">Đăng nhập/<br />Đăng ký</span>
              </Link>
            )}

            {/* Nút Yêu thích */}
            <Link to="/wishlist" className="flex flex-col items-center text-gray-700 relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">0</span>
            </Link>

            {/* Nút Giỏ hàng */}
            <Link to="/cart" className="flex flex-col items-center text-gray-700 relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cart ? cart.length : 0}
              </span>
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;