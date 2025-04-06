// import { useState, useRef, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { useCart } from '../context/CartContext';

// const Navbar = () => {
//   const { user } = useAuth();
//   const { cart } = useCart();
//   const [searchQuery, setSearchQuery] = useState('');
//   const [showCartPopup, setShowCartPopup] = useState(false);
//   const cartPopupRef = useRef(null);
//   const cartIconRef = useRef(null);

//   const handleSearchChange = (e) => {
//     setSearchQuery(e.target.value);
//   };

//   const handleSearchSubmit = (e) => {
//     e.preventDefault();
//     // Xử lý tìm kiếm ở đây
//     console.log('Tìm kiếm:', searchQuery);
//   };

//   // Calculate total price of items in cart
//   const calculateTotal = () => {
//     if (!cart || cart.length === 0) return 0;
//     return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
//   };

//   // Handle clicks outside of the cart popup to close it
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         showCartPopup && 
//         cartPopupRef.current && 
//         cartIconRef.current &&
//         !cartPopupRef.current.contains(event.target) && 
//         !cartIconRef.current.contains(event.target)
//       ) {
//         setShowCartPopup(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [showCartPopup]);

//   return (
//     <>
//       {/* Thanh thông tin liên hệ */}
//       <div className="w-full bg-black text-white py-1">
//         <div className="container mx-auto px-4 flex justify-between items-center">
//           <div className="text-sm">
//             11 Nguyễn Đình Chiểu, Phường Đakao, Quận 1, TP Hồ Chí Minh
//           </div>
//           <div className="text-sm">
//             Hotline: 0862852822
//           </div>
//         </div>
//       </div>

//       {/* Thanh Navbar chính */}
//       <nav className="w-full bg-white shadow-md py-3">
//         <div className="container mx-auto px-4 flex items-center justify-between">
//           {/* Logo */}
//           <div className="flex items-center">
//             <Link to="/" className="text-4xl font-italic">
//               <span className="text-red-600 font-bold font-righteous italic">APH</span>
//               <span className="text-black italic font-righteous"> Perfume</span>
//             </Link>
//           </div>

//           {/* Thanh tìm kiếm */}
//           <div className="flex-grow max-w-xl mx-4">
//             <form onSubmit={handleSearchSubmit} className="relative">
//               <input
//                 type="text"
//                 placeholder="Tìm kiếm sản phẩm, thương hiệu bạn muốn..."
//                 value={searchQuery}
//                 onChange={handleSearchChange}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-gray-300"
//               />
//               <button 
//                 type="submit" 
//                 className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center"
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                 </svg>
//               </button>
//             </form>
//           </div>

//           {/* Các nút chức năng */}
//           <div className="flex items-center space-x-8">
//             {/* Nút Hỗ trợ */}
//             <Link to="/support" className="flex flex-col items-center text-gray-700">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
//               </svg>
//               <span className="text-xs mt-1">Hỗ trợ</span>
//             </Link>

//             {/* Nút Đăng nhập/Đăng ký */}
//             {user ? (
//               <Link to="/account" className="flex flex-col items-center text-gray-700">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                 </svg>
//                 <span className="text-xs mt-1">{user.name}</span>
//               </Link>
//             ) : (
//               <Link to="/login" className="flex flex-col items-center text-gray-700">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                 </svg>
//                 <span className="text-xs mt-1 text-center">Đăng nhập/<br />Đăng ký</span>
//               </Link>
//             )}

//             {/* Nút Yêu thích */}
//             <Link to="/wishlist" className="flex flex-col items-center text-gray-700 relative">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
//               </svg>
//               <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">0</span>
//             </Link>

//             {/* Nút Giỏ hàng với popup */}
//             <div 
//               className="flex flex-col items-center text-gray-700 relative"
//               onMouseEnter={() => setShowCartPopup(true)}
//               onMouseLeave={() => setShowCartPopup(false)}
//               ref={cartIconRef}
//             >
//               <Link to="/cart" className="flex flex-col items-center">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
//                 </svg>
//                 <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
//                   {cart ? cart.length : 0}
//                 </span>
//               </Link>
              
//               {/* Cart popup */}
//               {showCartPopup && (
//                 <div 
//                   className="absolute right-0 top-full bg-white border border-gray-200 shadow-lg z-50 w-80 rounded-md" 
//                   ref={cartPopupRef}
//                 >
//                   <div className="p-4">
//                     <h3 className="font-medium mb-2 border-b pb-2">Giỏ hàng của bạn</h3>
                    
//                     {/* Cart items */}
//                     <div className="max-h-60 overflow-y-auto">
//                       {cart && cart.length > 0 ? (
//                         cart.map((item, index) => (
//                           <div key={index} className="flex items-center py-2 border-b">
//                             <div className="w-16 h-16 bg-gray-100 rounded mr-3 flex-shrink-0">
//                               {item.image && (
//                                 <img 
//                                   src={item.image} 
//                                   alt={item.name} 
//                                   className="w-full h-full object-cover rounded"
//                                 />
//                               )}
//                             </div>
//                             <div className='flex items-center justify-between w-full'>
//                             <div className="flex-grow">
//                               <p className="text-sm font-medium">{item.name}</p>
//                               <p className="text-xs text-gray-500">
//                                 {item.quantity} x {item.price?.toLocaleString('vi-VN')}₫
//                               </p>
//                             </div>
//                             <div className=''>
//                               <button className='border-2 rounded font-bold border-black px-2'>-</button>
//                               <span className='font-bold mx-4'>{item.quantity}</span>
//                               <button className='border-2 rounded font-bold border-black px-2'>+</button>
//                             </div>
//                             </div>
//                           </div>
//                         ))
//                       ) : (
//                         <p className="text-center text-gray-500 py-4">Giỏ hàng trống</p>
//                       )}
//                     </div>
                    
//                     {/* Cart total */}
//                     {cart && cart.length > 0 && (
//                       <div className="mt-3 border-t pt-2">
//                         <div className="flex justify-between items-center mb-3">
//                           <span className="font-semibold">Tổng cộng:</span>
//                           <span className="font-semibold text-red-600">
//                             {calculateTotal().toLocaleString('vi-VN')}₫
//                           </span>
//                         </div>
                        
//                         {/* Buttons */}
//                         <div className="flex flex-col space-y-2">
//                           <Link 
//                             to="/cart" 
//                             className="w-full bg-gray-200 text-gray-800 py-2 rounded text-center text-sm hover:bg-gray-300 transition duration-200"
//                           >
//                             Xem giỏ hàng
//                           </Link>
//                           <Link 
//                             to="/checkout" 
//                             className="w-full bg-red-600 text-white py-2 rounded text-center text-sm hover:bg-red-700 transition duration-200"
//                           >
//                             Thanh toán
//                           </Link>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </nav>
//     </>
//   );
// };

// export default Navbar;


import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, login } = useAuth();
  const { cart, mergeGuestCartWithUserCart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [showCartPopup, setShowCartPopup] = useState(false);
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
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
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Xử lý tìm kiếm ở đây
    console.log('Tìm kiếm:', searchQuery);
  };

  // Calculate total price of items in cart
  const calculateTotal = () => {
    if (!cart || cart.length === 0) return 0;
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  // Handle login form changes
  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  // Handle register form changes
  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value
    });
  };

  // Handle login submission
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    // Simple validation
    if (!loginData.email || !loginData.password) {
      setError('Vui lòng nhập email và mật khẩu');
      return;
    }
    
    // Simulate successful login
    const userData = {
      id: '1',
      name: 'Người dùng',
      email: loginData.email
    };
    
    login(userData);
    mergeGuestCartWithUserCart(userData.id);
    setShowAuthPopup(false);
  };

  // Handle register submission
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    // Simple validation
    if (!registerData.name || !registerData.email || !registerData.password) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }
    
    if (registerData.password !== registerData.confirmPassword) {
      setError('Mật khẩu không khớp');
      return;
    }
    
    // Simulate successful registration and login
    const userData = {
      id: '2',
      name: registerData.name,
      email: registerData.email
    };
    
    login(userData);
    mergeGuestCartWithUserCart(userData.id);
    setShowAuthPopup(false);
  };

  // Toggle between login and register forms
  const toggleAuthMode = () => {
    setAuthMode(authMode === 'login' ? 'register' : 'login');
    setError('');
  };

  // Handle clicks outside of the popups to close them
  useEffect(() => {
    const handleClickOutside = (event) => {
      // For cart popup
      if (
        showCartPopup && 
        cartPopupRef.current && 
        cartIconRef.current &&
        !cartPopupRef.current.contains(event.target) && 
        !cartIconRef.current.contains(event.target)
      ) {
        setShowCartPopup(false);
      }
      
      // For auth popup
      if (
        showAuthPopup && 
        authPopupRef.current && 
        authIconRef.current &&
        !authPopupRef.current.contains(event.target) && 
        !authIconRef.current.contains(event.target)
      ) {
        setShowAuthPopup(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCartPopup, showAuthPopup]);

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

            {/* Nút Đăng nhập/Đăng ký hoặc Tài khoản */}
            <div className="relative" ref={authIconRef}>
              {user ? (
                <Link to="/account" className="flex flex-col items-center text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-xs mt-1">{user.name}</span>
                </Link>
              ) : (
                <div 
                  className="flex flex-col items-center text-gray-700 cursor-pointer"
                  onClick={() => setShowAuthPopup(true)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-xs mt-1 text-center">Đăng nhập/<br />Đăng ký</span>
                </div>
              )}

              {/* Auth Popup */}
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

                    {/* Login Form */}
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

                    {/* Register Form */}
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

            {/* Nút Yêu thích */}
            <Link to="/wishlist" className="flex flex-col items-center text-gray-700 relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">0</span>
            </Link>

            {/* Nút Giỏ hàng với popup */}
            <div 
              className="flex flex-col items-center text-gray-700 relative"
              onMouseEnter={() => setShowCartPopup(true)}
              onMouseLeave={() => setShowCartPopup(false)}
              ref={cartIconRef}
            >
              <Link to="/cart" className="flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cart ? cart.length : 0}
                </span>
              </Link>
              
              {/* Cart popup */}
              {showCartPopup && (
                <div 
                  className="absolute right-0 top-full bg-white border border-gray-200 shadow-lg z-50 w-80 rounded-md" 
                  ref={cartPopupRef}
                >
                  <div className="p-4">
                    <h3 className="font-medium mb-2 border-b pb-2">Giỏ hàng của bạn</h3>
                    
                    {/* Cart items */}
                    <div className="max-h-60 overflow-y-auto">
                      {cart && cart.length > 0 ? (
                        cart.map((item, index) => (
                          <div key={index} className="flex items-center py-2 border-b">
                            <div className="w-16 h-16 bg-gray-100 rounded mr-3 flex-shrink-0">
                              {item.image && (
                                <img 
                                  src={item.image} 
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
                            <div className=''>
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
                    
                    {/* Cart total */}
                    {cart && cart.length > 0 && (
                      <div className="mt-3 border-t pt-2">
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-semibold">Tổng cộng:</span>
                          <span className="font-semibold text-red-600">
                            {calculateTotal().toLocaleString('vi-VN')}₫
                          </span>
                        </div>
                        
                        {/* Buttons */}
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
      </nav>
    </>
  );
};

export default Navbar;