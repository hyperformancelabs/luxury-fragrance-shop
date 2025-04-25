import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Toaster, toast } from "sonner";

const Checkout = () => {
  const { cart, calculateTotal, clearCart } = useCart();
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
  const navigate = useNavigate();

  // Listen for messages from payment windows
  useEffect(() => {
    const handlePaymentMessage = (event) => {
      // Make sure the message is from our own domain for security
      // In production, you would check event.origin more strictly
      
      if (event.data && event.data.status) {
        if (event.data.status === 'success') {
          // Process successful payment
          processOrder(event.data.method);
        } else if (event.data.status === 'cancelled') {
          toast.error("Thanh toán đã bị hủy.");
        }
      }
    };

    window.addEventListener('message', handlePaymentMessage);
    
    return () => {
      window.removeEventListener('message', handlePaymentMessage);
    };
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePaymentChange = (method) => {
    setPaymentMethod(method);
  };

  const processOrder = async (paymentMethodUsed) => {
    const orderData = {
      customer: formData,
      paymentMethod: paymentMethodUsed,
      items: cart,
      totalAmount: calculateTotal()
    };
    // console.log(orderData)
  
    try {
      const response = await fetch('https://api-perfume-alpha.vercel.app/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
  
      const data = await response.json();
      toast.success("Đặt hàng thành công!");
      
      // Store payment method in localStorage before redirecting
      localStorage.setItem('paymentMethod', paymentMethodUsed);
      
      // Don't clear the cart yet - we need it on the success page
      navigate('/ordersuccess');
    } catch (error) {
      console.error("Order error:", error);
      toast.error("Đặt hàng thất bại!");
    }
  };

  const handleTest = async (e) => {
    e.preventDefault();
    const orderData = {
      customer: formData,

      items: cart,
      totalAmount: calculateTotal()
    };
    console.log(orderData)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Save customer info to localStorage for later use
    // localStorage.setItem('checkoutCustomer', JSON.stringify(formData));

    if (paymentMethod === 'vnpay') {
      // Open VNPay payment in a new tab
      window.open('/vnpay-payment', 'vnpay_window', 'width=600,height=600');
    } else if (paymentMethod === 'mb-bank') {
      // Open MB Bank payment in a new tab
      window.open('/mbbank-payment', 'mbbank_window', 'width=600,height=600');
    } else {
      // COD payment - process order directly
      processOrder('cod');
    }
    // Trong handleSubmit
localStorage.setItem('checkoutCustomer', JSON.stringify(formData));
localStorage.setItem('checkoutCart', JSON.stringify(cart));
localStorage.setItem('checkoutTotal', calculateTotal());

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
  const formatPrice = (price) => price.toLocaleString('vi-VN') + ' VND';




  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <Toaster position="top-center" />

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
          <div className="lg:w-2/3 flex gap-4">
            <div className="mb-8 w-1/2 mx-2">
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
                  placeholder="Phường/Xã"
                  value={formData.ward}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-3 rounded"
                  required
                />
              </div>
            </div>

            <div className='mx-2 w-1/2'>
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
              <Link to="/cart" className='mt-8 block'>
                <p className='hover:underline hover:text-red-600'>← Quay lại giỏ hàng</p>
              </Link>
            </div>
          </div>

          <div className="lg:w-1/3">
            <div className="border border-gray-200 p-6">
              <h2 className="text-xl font-bold mb-6 text-center">
                TÓM TẮT ĐƠN HÀNG
              </h2>
              
              <div className="space-y-4">
                {cart.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm pb-2">
                    <div className="flex-grow">
                      {item.name} ({item.selectedSize})
                    </div>
                    <p>{item.quantity}   <span>x</span></p>
                    <div className="pl-4">
                      {formatPrice(item.price)}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between font-bold py-4 border-t border-gray-200 text-red-600 mt-4">
                <div>Tổng đơn hàng</div>
                <div>{formatPrice(calculateTotal())}</div>
              </div>
              
              <button 
                type="submit"
                // onClick={handleTest} 
                className="w-full bg-blue-500 text-white py-3 rounded mt-4 font-bold hover:bg-blue-600 transition"
              >
                Tiến hành thanh toán
              </button>
            </div>
          </div>
        </div>
      </form>
      <button 
      onClick={ handleTest} 
      className='py-4 px-8 text-white bg-blue-500'>Test</button>

    </div>
  );
};

export default Checkout;