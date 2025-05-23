import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // giống router.back()
  };

  const handleGoHome = () => {
    navigate('/'); // giống router.push('/')
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-red-600">404</h1>
          <div className="h-2 w-24 bg-red-600 mx-auto my-4"></div>
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mb-4">Không tìm thấy trang</h2>
        <p className="text-gray-600 mb-8 text-lg">
          Trang bạn đang tìm kiếm có thể đã bị xóa, đổi tên hoặc tạm thời không khả dụng.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={handleGoBack}
            className="bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-100 font-medium px-6 py-3 rounded-lg transition-colors duration-300 flex items-center justify-center"
          >
            {/* Icon Quay lại */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Quay lại
          </button>

          <button
            onClick={handleGoHome}
            className="bg-red-600 text-white hover:bg-red-700 font-medium px-6 py-3 rounded-lg transition-colors duration-300 flex items-center justify-center"
          >
            {/* Icon Trang chủ */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            Về trang chủ
          </button>
        </div>

        <div className="mt-12">
          <h3 className="text-xl font-bold text-gray-700 mb-4">Bạn có thể quan tâm</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {['Blog', 'Sản phẩm', 'Liên hệ', 'Giới thiệu'].map((item, index) => (
              <a
                key={index}
                href={`/${item.toLowerCase()}`}
                className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 text-gray-800 hover:text-red-600"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
