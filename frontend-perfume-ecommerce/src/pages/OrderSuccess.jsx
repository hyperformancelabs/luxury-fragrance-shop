import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const [orderDetails, setOrderDetails] = useState({
    orderId: searchParams.get('orderId') || 'ORD' + Math.floor(100000 + Math.random() * 900000),
    customerName: searchParams.get('name') || '',
    totalAmount: searchParams.get('total') || '0',
    paymentMethod: searchParams.get('paymentMethod') || 'vnpay',
    items: []
  });

  // Mock loading order details - in a real app, you would fetch this from an API
  useEffect(() => {
    // Simulate API fetch with a timeout
    const timer = setTimeout(() => {
      // This would be replaced with actual API data
      setOrderDetails(prev => ({
        ...prev,
        items: [
          { name: 'Nước hoa nữ Versace Bright Crystal EDT', price: 5500000, quantity: 1 },
          { name: 'Nước hoa nam Dior Sauvage EDP', price: 3200000, quantity: 1 }
        ]
      }));
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const formatCurrency = (amount) => {
    return parseInt(amount).toLocaleString() + ' VND';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Success Header */}
      <div className="flex flex-col items-center justify-center mb-10 text-center">
        <CheckCircle className="text-green-500 h-16 w-16 mb-4" />
        <h1 className="text-3xl font-bold text-gray-800">Đặt hàng thành công!</h1>
        <p className="text-gray-600 mt-2">
          Cảm ơn bạn đã mua hàng. Chúng tôi đã nhận được đơn hàng của bạn.
        </p>
      </div>

      {/* Order Information Card */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Thông tin đơn hàng</h2>
        </div>
        
        <div className="p-6">
          {/* Order Details */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Mã đơn hàng</p>
              <p className="font-medium">{orderDetails.orderId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Ngày đặt hàng</p>
              <p className="font-medium">{new Date().toLocaleDateString('vi-VN')}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Phương thức thanh toán</p>
              <p className="font-medium">
                {orderDetails.paymentMethod === 'vnpay' && 'VNPay'}
                {orderDetails.paymentMethod === 'mb-bank' && 'MB Bank'}
                {orderDetails.paymentMethod === 'cod' && 'Thanh toán khi nhận hàng (COD)'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Trạng thái thanh toán</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Đã thanh toán
              </span>
            </div>
          </div>

          {/* Order Items */}
          <div className="border-t border-gray-200 pt-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Sản phẩm đã mua</h3>
            
            {orderDetails.items.length > 0 ? (
              <div className="space-y-4">
                {orderDetails.items.map((item, index) => (
                  <div key={index} className="flex justify-between pb-2">
                    <div className="flex-grow">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-gray-500 ml-2">x{item.quantity}</span>
                    </div>
                    <div>
                      {formatCurrency(item.price)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Đang tải thông tin sản phẩm...</p>
            )}
          </div>

          {/* Total */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center font-bold text-lg">
              <span>Tổng cộng</span>
              <span>{formatCurrency(orderDetails.items.reduce((sum, item) => sum + item.price * item.quantity, 0))}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Estimated Delivery */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
        <div className="flex items-start">
          <div className="mr-4 text-blue-500">📦</div>
          <div>
            <h3 className="font-semibold text-blue-800">Thông tin vận chuyển</h3>
            <p className="text-blue-700 mt-1">
              Đơn hàng của bạn dự kiến sẽ được giao trong vòng 3-5 ngày làm việc.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
        <Link 
          to="/account/orders" 
          className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded text-center font-medium hover:bg-gray-50 transition"
        >
          Xem đơn hàng của tôi
        </Link>
        <Link 
          to="/products" 
          className="bg-blue-500 text-white px-6 py-3 rounded text-center font-medium hover:bg-blue-600 transition"
        >
          Tiếp tục mua sắm
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;