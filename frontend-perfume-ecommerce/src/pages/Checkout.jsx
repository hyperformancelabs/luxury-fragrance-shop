import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Checkout = () => {
  const { cart, calculateTotal } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('vnpay');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    district: '',
    ward: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePaymentChange = (method) => {
    setPaymentMethod(method);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Process checkout logic here
    console.log('Form data:', formData);
    console.log('Payment method:', paymentMethod);
    console.log('Order items:', cart);
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <h2 className="text-2xl font-semibold mb-2">Giỏ hàng trống</h2>
        <p className="text-gray-600 mb-6">Vui lòng thêm sản phẩm vào giỏ hàng</p>
        <Link to="/products" className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition">
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Checkout Navigation Steps */}
      <div className="flex items-center justify-center bg-gray-50 p-4 rounded mb-8">
        <div className="flex items-center text-gray-500">
          <span className="mr-1">🛒</span> Giỏ hàng
        </div>
        <div className="text-gray-300 mx-4">---------------</div>
        <div className="flex items-center font-bold">
          <span className="mr-1">💳</span> Thanh toán
        </div>
        <div className="text-gray-300 mx-4">---------------</div>
        <div className="flex items-center text-gray-500">
          <span className="mr-1">📦</span> Đơn hàng
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">THÔNG TIN MUA HÀNG</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Họ và tên"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-3 rounded"
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Số điện thoại"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-3 rounded"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-3 rounded"
                  required
                />
                <input
                  type="text"
                  name="address"
                  placeholder="Địa chỉ"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-3 rounded"
                  required
                />
                <input
                  type="text"
                  name="city"
                  placeholder="Tỉnh/Thành phố"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-3 rounded"
                  required
                />
                <input
                  type="text"
                  name="district"
                  placeholder="Quận/Huyện"
                  value={formData.district}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-3 rounded"
                  required
                />
                <input
                  type="text"
                  name="ward"
                  placeholder="Quận/Huyện"
                  value={formData.ward}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-3 rounded"
                  required
                />
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">PHƯƠNG THỨC THANH TOÁN</h2>
              <div className="space-y-4">
                <label className="flex items-center p-3 border border-gray-300 rounded cursor-pointer">
                  <input
                    type="radio"
                    name="payment-method"
                    checked={paymentMethod === 'vnpay'}
                    onChange={() => handlePaymentChange('vnpay')}
                    className="mr-3"
                  />
                  <span>VNPay</span>
                </label>
                
                <label className="flex items-center p-3 border border-gray-300 rounded cursor-pointer">
                  <input
                    type="radio"
                    name="payment-method"
                    checked={paymentMethod === 'mb-bank'}
                    onChange={() => handlePaymentChange('mb-bank')}
                    className="mr-3"
                  />
                  <span>MB Bank</span>
                </label>
                
                <label className="flex items-center p-3 border border-gray-300 rounded cursor-pointer">
                  <input
                    type="radio"
                    name="payment-method"
                    checked={paymentMethod === 'cod'}
                    onChange={() => handlePaymentChange('cod')}
                    className="mr-3"
                  />
                  <span>COD</span>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="border border-gray-200 p-6">
              <h2 className="text-xl font-bold mb-6 text-center">
                TÓM TẮT ĐƠN HÀNG
              </h2>
              
              <div className="space-y-4">
                {cart.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm pb-2">
                    <div className="flex-grow">
                      {item.name || "Nước hoa nữ Versace Bright Crystal EDT"}
                    </div>
                    <div className="pl-4">
                      {(item.price || 5500000).toLocaleString()} VND
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between font-bold py-4 border-t border-gray-200 mt-4">
                <div>Tổng đơn hàng</div>
                <div>{calculateTotal().toLocaleString()} VND</div>
              </div>
              
              <button 
                type="submit" 
                className="w-full bg-blue-500 text-white py-3 rounded mt-4 font-bold hover:bg-blue-600 transition"
              >
                Tiến hành thanh toán
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;