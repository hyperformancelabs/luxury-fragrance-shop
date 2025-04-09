import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { 
  ChartBarIcon, 
  Heart, 
  HeartCrackIcon, 
  PhoneCallIcon, 
  ShoppingCartIcon, 
  User, 
  Menu, 
  X,
  Search
} from 'lucide-react';

const Navbar = () => {
  const { user, login } = useAuth();
  const { cart, mergeGuestCartWithUserCart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [showCartPopup, setShowCartPopup] = useState(false);
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  
  const cartPopupRef = useRef(null);
  const cartIconRef = useRef(null);
  const authPopupRef = useRef(null);
  const authIconRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const mobileButtonRef = useRef(null);
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log('Tìm kiếm:', searchQuery);
    setShowMobileSearch(false);
  };

  const calculateTotal = () => {
    if (!cart || cart.length === 0) return 0;
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value
    });
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!loginData.email || !loginData.password) {
      setError('Vui lòng nhập email và mật khẩu');
      return;
    }
    
    const userData = {
      id: '1',
      name: 'Người dùng',
      email: loginData.email
    };
    
    login(userData);
    mergeGuestCartWithUserCart(userData.id);
    setShowAuthPopup(false);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!registerData.name || !registerData.email || !registerData.password) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }
    
    if (registerData.password !== registerData.confirmPassword) {
      setError('Mật khẩu không khớp');
      return;
    }
    
    const userData = {
      id: '2',
      name: registerData.name,
      email: registerData.email
    };
    
    login(userData);
    mergeGuestCartWithUserCart(userData.id);
    setShowAuthPopup(false);
  };

  const toggleAuthMode = () => {
    setAuthMode(authMode === 'login' ? 'register' : 'login');
    setError('');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showCartPopup && 
        cartPopupRef.current && 
        cartIconRef.current &&
        !cartPopupRef.current.contains(event.target) && 
        !cartIconRef.current.contains(event.target)
      ) {
        setShowCartPopup(false);
      }
      
      if (
        showAuthPopup && 
        authPopupRef.current && 
        authIconRef.current &&
        !authPopupRef.current.contains(event.target) && 
        !authIconRef.current.contains(event.target)
      ) {
        setShowAuthPopup(false);
      }

      if (
        showMobileMenu && 
        mobileMenuRef.current && 
        mobileButtonRef.current &&
        !mobileMenuRef.current.contains(event.target) && 
        !mobileButtonRef.current.contains(event.target)
      ) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCartPopup, showAuthPopup, showMobileMenu]);

  // Close mobile menu on window resize (if moving to desktop size)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setShowMobileMenu(false);
        setShowMobileSearch(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <div className="w-full bg-black text-white py-1 hidden sm:block">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center">
          <div className="text-xs sm:text-sm text-center sm:text-left">
            11 Nguyễn Đình Chiểu, Phường Đakao, Quận 1, TP Hồ Chí Minh
          </div>
          <div className="text-xs sm:text-sm mt-1 sm:mt-0">
            Hotline: 0862852822
          </div>
        </div>
      </div>

      <nav className="w-full bg-white shadow-md py-3">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="lg:hidden flex items-center" ref={mobileButtonRef}>
              <button 
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="text-gray-600 focus:outline-none"
              >
                {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            <div className="flex items-center">
              <Link to="/" className="text-2xl sm:text-3xl md:text-4xl font-italic">
                <span className="text-red-600 font-bold font-righteous italic">APH</span>
                <span className="text-black italic font-righteous"> Perfume</span>
              </Link>
            </div>

            <div className="hidden lg:block flex-grow max-w-xl mx-4">
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

            <div className="lg:hidden flex items-center ml-2">
              <button 
                onClick={() => setShowMobileSearch(!showMobileSearch)}
                className="text-gray-600 focus:outline-none"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center space-x-4 md:space-x-8">
              <Link to="/support" className="hidden md:flex flex-col items-center text-gray-700">
                <PhoneCallIcon className="w-5 h-5 md:w-6 md:h-6" />
                <span className="text-xs mt-1">Liên hệ</span>
              </Link>

              <div className="relative" ref={authIconRef}>
                {user ? (
                  <Link to="/profile" className="flex flex-col items-center text-gray-700">
                    <div className="w-8 h-8 md:w-10 md:h-10">
                      <img src="/avt.jpg" alt="" className="rounded-full" />
                    </div>
                  </Link>
                ) : (
                  <div 
                    className="flex flex-col items-center text-gray-700 cursor-pointer"
                    onClick={() => setShowAuthPopup(true)}
                  >
                    <User className="w-5 h-5 md:w-6 md:h-6" />
                    <span className="text-xs mt-1 text-center hidden sm:block">Tài khoản</span>
                  </div>
                )}

                {showAuthPopup && !user && (
                  <div 
                    className="absolute right-0 top-full mt-2 bg-white border border-gray-200 shadow-lg rounded-md z-50 w-80"
                    ref={authPopupRef}
                  >
                    <div className="p-5">
                      <div className="flex justify-between mb-4">
                        <button 
                          className={`px-3 py-1 font-medium ${authMode === 'login' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500'}`}
                          onClick={() => setAuthMode('login')}
                        >
                          Đăng nhập
                        </button>
                        <button 
                          className={`px-3 py-1 font-medium ${authMode === 'register' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500'}`}
                          onClick={() => setAuthMode('register')}
                        >
                          Đăng ký
                        </button>
                      </div>

                      {error && (
                        <div className="mb-4 p-2 bg-red-100 text-red-700 text-sm rounded">
                          {error}
                        </div>
                      )}

                      {authMode === 'login' && (
                        <form onSubmit={handleLoginSubmit}>
                          <div className="mb-3">
                            <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-1">
                              Email
                            </label>
                            <input
                              type="email"
                              id="email"
                              name="email"
                              value={loginData.email}
                              onChange={handleLoginChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
                              placeholder="Nhập email của bạn"
                            />
                          </div>
                          <div className="mb-4">
                            <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-1">
                              Mật khẩu
                            </label>
                            <input
                              type="password"
                              id="password"
                              name="password"
                              value={loginData.password}
                              onChange={handleLoginChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
                              placeholder="Nhập mật khẩu"
                            />
                          </div>
                          <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center">
                              <input type="checkbox" id="remember" className="mr-2" />
                              <label htmlFor="remember" className="text-sm text-gray-600">Ghi nhớ</label>
                            </div>
                            <a href="#" className="text-sm text-red-600 hover:text-red-700">Quên mật khẩu?</a>
                          </div>
                          <button
                            type="submit"
                            className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition duration-200"
                          >
                            Đăng nhập
                          </button>
                        </form>
                      )}

                      {authMode === 'register' && (
                        <form onSubmit={handleRegisterSubmit}>
                          <div className="mb-3">
                            <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-1">
                              Họ và tên
                            </label>
                            <input
                              type="text"
                              id="name"
                              name="name"
                              value={registerData.name}
                              onChange={handleRegisterChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
                              placeholder="Nhập họ và tên"
                            />
                          </div>
                          <div className="mb-3">
                            <label htmlFor="register-email" className="block text-gray-700 text-sm font-medium mb-1">
                              Email
                            </label>
                            <input
                              type="email"
                              id="register-email"
                              name="email"
                              value={registerData.email}
                              onChange={handleRegisterChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
                              placeholder="Nhập email của bạn"
                            />
                          </div>
                          <div className="mb-3">
                            <label htmlFor="register-password" className="block text-gray-700 text-sm font-medium mb-1">
                              Mật khẩu
                            </label>
                            <input
                              type="password"
                              id="register-password"
                              name="password"
                              value={registerData.password}
                              onChange={handleRegisterChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
                              placeholder="Nhập mật khẩu"
                            />
                          </div>
                          <div className="mb-4">
                            <label htmlFor="confirm-password" className="block text-gray-700 text-sm font-medium mb-1">
                              Xác nhận mật khẩu
                            </label>
                            <input
                              type="password"
                              id="confirm-password"
                              name="confirmPassword"
                              value={registerData.confirmPassword}
                              onChange={handleRegisterChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
                              placeholder="Nhập lại mật khẩu"
                            />
                          </div>
                          <button
                            type="submit"
                            className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition duration-200"
                          >
                            Đăng ký
                          </button>
                        </form>
                      )}

                      <div className="mt-4 text-center text-sm text-gray-600">
                        {authMode === 'login' ? (
                          <p>Chưa có tài khoản? <button onClick={toggleAuthMode} className="text-red-600 hover:text-red-700">Đăng ký ngay</button></p>
                        ) : (
                          <p>Đã có tài khoản? <button onClick={toggleAuthMode} className="text-red-600 hover:text-red-700">Đăng nhập</button></p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Link to="/wishlist" className="flex flex-col items-center text-gray-700 relative">
                <Heart className="w-5 h-5 md:w-6 md:h-6" />
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">0</span>
                <span className="text-xs mt-1 hidden sm:block">Yêu thích</span>
              </Link>

              <div 
                className="flex flex-col items-center text-gray-700 relative"
                onMouseEnter={() => setShowCartPopup(true)}
                onMouseLeave={() => setShowCartPopup(false)}
                ref={cartIconRef}
              >
                <Link to="/cart" className="flex flex-col items-center">
                  <ShoppingCartIcon className="w-5 h-5 md:w-6 md:h-6" />
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cart ? cart.length : 0}
                  </span>
                  <span className="text-xs mt-1 hidden sm:block">Giỏ hàng</span>
                </Link>
                
                {showCartPopup && (
                  <div 
                    className="absolute right-0 top-full bg-white border border-gray-200 shadow-lg z-50 w-80 rounded-md" 
                    ref={cartPopupRef}
                  >
                    <div className="p-4">
                      <h3 className="font-medium mb-2 border-b pb-2">Giỏ hàng của bạn</h3>
                      
                      <div className="max-h-60 overflow-y-auto">
                        {cart && cart.length > 0 ? (
                          cart.map((item, index) => (
                            <div key={index} className="flex items-center py-2 border-b">
                              <div className="w-16 h-16 bg-gray-100 rounded mr-3 flex-shrink-0">
                                {item.image && (
                                  <img 
                                    src='/sp2.jpg'
                                    alt={item.name} 
                                    className="w-full h-full object-cover rounded"
                                  />
                                )}
                              </div>
                              
                              <div className='flex items-center justify-between w-full'>
                                <div className="flex-grow">
                                  <p className="text-sm font-medium">{item.name}</p>
                                  <p className="text-xs text-gray-500">
                                    {item.quantity} x {item.price?.toLocaleString('vi-VN')}₫
                                  </p>
                                </div>
                                <div>
                                  <button className='border-2 rounded font-bold border-black px-2'>-</button>
                                  <span className='font-bold mx-4'>{item.quantity}</span>
                                  <button className='border-2 rounded font-bold border-black px-2'>+</button>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-center text-gray-500 py-4">Giỏ hàng trống</p>
                        )}
                      </div>
                      
                      {cart && cart.length > 0 && (
                        <div className="mt-3 border-t pt-2">
                          <div className="flex justify-between items-center mb-3">
                            <span className="font-semibold">Tổng cộng:</span>
                            <span className="font-semibold text-red-600">
                              {calculateTotal().toLocaleString('vi-VN')}₫
                            </span>
                          </div>
                          
                          <div className="flex flex-col space-y-2">
                            <Link 
                              to="/cart" 
                              className="w-full bg-gray-200 text-gray-800 py-2 rounded text-center text-sm hover:bg-gray-300 transition duration-200"
                            >
                              Xem giỏ hàng
                            </Link>
                            <Link 
                              to="/checkout" 
                              className="w-full bg-red-600 text-white py-2 rounded text-center text-sm hover:bg-red-700 transition duration-200"
                            >
                              Thanh toán
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {showMobileSearch && (
            <div className="lg:hidden mt-3 relative">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
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
          )}

          {showMobileMenu && (
            <div 
              className="fixed inset-0 z-50 lg:hidden"
              ref={mobileMenuRef}
            >
              <div className="fixed inset-0 bg-black bg-opacity-50"></div>
              <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-xl z-50 overflow-y-auto">
                <div className="p-5">
                  <div className="flex justify-between items-center mb-6">
                    <Link to="/" className="text-2xl font-italic">
                      <span className="text-red-600 font-bold font-righteous italic">APH</span>
                      <span className="text-black italic font-righteous"> Perfume</span>
                    </Link>
                    <button 
                      onClick={() => setShowMobileMenu(false)}
                      className="text-gray-500"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="border-b pb-2">
                      <Link to="/" className="block py-2 text-gray-800 hover:text-red-600">Trang chủ</Link>
                    </div>
                    <div className="border-b pb-2">
                      <Link to="/" className="block py-2 text-gray-800 hover:text-red-600">Danh mục</Link>
                    </div>
                    <div className="border-b pb-2">
                      <Link to="/products" className="block py-2 text-gray-800 hover:text-red-600">Sản phẩm</Link>
                    </div>
                    <div className="border-b pb-2">
                      <Link to="/brands" className="block py-2 text-gray-800 hover:text-red-600">Thương hiệu</Link>
                    </div>
                    <div className="border-b pb-2">
                      <Link to="/about" className="block py-2 text-gray-800 hover:text-red-600">Về chúng tôi</Link>
                    </div>
                    <div className="border-b pb-2">
                      <Link to="/support" className="block py-2 text-gray-800 hover:text-red-600">Liên hệ</Link>
                    </div>
                    <div className="border-b pb-2">
                      <Link to="/cart" className="block py-2 text-gray-800 hover:text-red-600">Giỏ hàng</Link>
                    </div>
                    <div className="border-b pb-2">
                      <Link to="/wishlist" className="block py-2 text-gray-800 hover:text-red-600">Danh sách yêu thích</Link>
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <div className="text-xs sm:text-sm">
                        Hotline: 0862852822
                      </div>
                      <div className="text-xs sm:text-sm mt-2">
                        11 Nguyễn Đình Chiểu, Phường Đakao, Quận 1, TP Hồ Chí Minh
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;