import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';

const MBBankPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Set the page title for MB Bank payment
    document.title = "MB Bank Payment Gateway";
  }, []);

  const handleSuccess = () => {
    // Store payment method before closing the window
    localStorage.setItem('paymentMethod', 'vnpay'); // or 'mb-bank' for MBBankPage
    
    // Close this window and signal success to parent
    window.opener.postMessage({ status: 'success', method: 'vnpay' }, '*'); // or 'mb-bank' for MBBankPage
    window.close();
  };

  const handleCancel = () => {
    // Close this window and signal cancellation to parent
    window.opener.postMessage({ status: 'cancelled', method: 'mb-bank' }, '*');
    window.close();
  };
  const formatPrice = (price) => price.toLocaleString('vi-VN') + ' VND';


  return (
    <div className="max-w-md mx-auto p-6 mt-10 bg-white rounded-lg shadow-lg border border-blue-200">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-blue-800 mb-2">MB Bank Payment Gateway</h2>
        <p className="text-gray-600">Thanh toán an toàn với MB Bank</p>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg mb-6 text-left">
        <p className="text-sm font-medium text-blue-700 mb-1">Chi tiết thanh toán:</p>
        <p className="text-sm text-blue-600">Đơn hàng: #{Math.floor(100000 + Math.random() * 900000)}</p>
        <p className="text-sm text-blue-600">
        Số tiền: {formatPrice(JSON.parse(localStorage.getItem('checkoutTotal')))}
        </p>
      </div>

      <div className="flex flex-col space-y-4">
        <button
          onClick={handleSuccess}
          className="flex items-center justify-center bg-blue-500 text-white px-6 py-3 rounded font-medium hover:bg-blue-600 transition"
        >
          <CheckCircle className="w-5 h-5 mr-2" />
          Hoàn tất thanh toán
        </button>
        
        <button
          onClick={handleCancel}
          className="flex items-center justify-center bg-gray-100 text-gray-700 px-6 py-3 rounded font-medium hover:bg-gray-200 transition"
        >
          <XCircle className="w-5 h-5 mr-2" />
          Hủy thanh toán
        </button>
      </div>
      
      <div className="mt-8 pt-4 border-t border-gray-200">
        <div className="flex justify-center">
          <img src="/mbbank.jpg" alt="MB Bank" className="h-8" />
        </div>
      </div>
    </div>
  );
};

export default MBBankPage;