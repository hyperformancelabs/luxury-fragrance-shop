import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { useCart } from "../context/CartContext";
import SuccessMessages from "../constants/SuccessMessages";
import ErrorMessages from "../constants/ErrorMessages";

const Checkout = () => {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    street: "",
    city: "",
    district: "",
    ward: "",
    shippingFee: 20000,
    note: ""
  });
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { localCart, cartItems } = useCart();
  const currentCart = cartItems.length ? cartItems : localCart;
  const cartTotal = currentCart.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );
  const navigate = useNavigate();
  const paymentMethodDefault = "vnpay";
  const [paymentMethod, setPaymentMethod] = useState(paymentMethodDefault);
  const shippingAddress = `${formData.street}, ${formData.ward}, ${formData.district}, ${formData.city}`;

  const fetchUserProfile = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoading(false);
        return;
      }
      
      const response = await fetch(
        "http://localhost:8080/api/v1/customers/me",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();

      if (response.ok && data.status === "success") {
        const userData = data.data;
        setFormData({
          name: userData.name || "",
          phoneNumber: userData.phoneNumber || "",
          email: userData.email || "",
          street: userData.street || "",
          city: userData.city || "",
          district: userData.district || "",
          ward: userData.ward || "",
          shippingFee: 20000,
          note: ""
        });
        toast.success(SuccessMessages.FETCH_PROFILE_SUCCESS);
      } else {
        // setError(data.message || "Không thể tải hồ sơ");
        toast.error(ErrorMessages.FETCH_PROFILE_FAIL);
      }
    } catch (err) {
      // console.error(err);
      setError(ErrorMessages.NETWORK_ERROR);
      // toast.error("Lỗi khi tải hồ sơ");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ""
      });
    }
    
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePaymentChange = (method) => {
    setPaymentMethod(method);
  };

  const formatPrice = (price, withVND = true) => {
    if (!price) return "0";
    const formatted = Number(price).toLocaleString("vi-VN");
    return withVND ? `${formatted} VND` : formatted;
  };
  
  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;

    if (!formData.name.trim()) errors.name = ErrorMessages.REQUIRED_FIELD;
    
    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = ErrorMessages.REQUIRED_FIELD;
    } else if (!phoneRegex.test(formData.phoneNumber)) {
      errors.phoneNumber = ErrorMessages.INVALID_PHONE;
    }
    
    if (!formData.email.trim()) {
      errors.email = ErrorMessages.REQUIRED_FIELD;
    } else if (!emailRegex.test(formData.email)) {
      errors.email = ErrorMessages.INVALID_EMAIL;
    }
    
    if (!formData.street.trim()) errors.street = ErrorMessages.REQUIRED_FIELD;
    if (!formData.city.trim()) errors.city = ErrorMessages.REQUIRED_FIELD;
    if (!formData.district.trim()) errors.district = ErrorMessages.REQUIRED_FIELD;
    if (!formData.ward.trim()) errors.ward = ErrorMessages.REQUIRED_FIELD;
    
    if (formData.shippingFee < 0) {
      errors.shippingFee = ErrorMessages.INVALID_SHIPPING_FEE;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProceedToConfirm = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setShowConfirmation(true);
    } else {
      toast.error(ErrorMessages.REQUIRED_FIELD);
    }
  };

  const handleCheckout = async () => {
    const token = localStorage.getItem("token");
    const sessionId = localStorage.getItem("sessionId");
  
    setIsLoading(true);
    try {
      let response;
      let isTokenUser = !!token;
      let headers = { "Content-Type": "application/json" };
      let endpoint = "";
      let payload;
  
      // Map payment method string to backend ID
      let paymentMethodId = 1; // default COD
      if (paymentMethod === "vnpay") paymentMethodId = 4;
      else if (paymentMethod === "mb-bank") paymentMethodId = 3;
  
      if (isTokenUser) {
        payload = {
          shippingAddress: shippingAddress,
          shippingNote: formData.note || "",
          shippingCost: parseFloat(formData.shippingFee),
          paymentMethodId,
        };
        headers.Authorization = `Bearer ${token}`;
        endpoint = "http://localhost:8080/api/v1/orders/create";
      } else if (sessionId) {
        payload = {
          ...formData,
          orderItems: currentCart.map((item) => ({
            productVariantId: item.productVariantId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            note: item.note || "",
          })),
          shippingNote: formData.note || "",
          shippingOption: "Giao hàng nhanh",
          paymentMethodId,
          sessionId: sessionId,
        };
        endpoint = "http://localhost:8080/api/v1/orders/create-anonymous";
      } else {
        toast.error(ErrorMessages.SESSION_NOT_FOUND);
        setIsLoading(false);
        return;
      }
  
      response = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });
  
      const contentType = response.headers.get("content-type");
      const isJson = contentType && contentType.includes("application/json");
      const result = isJson ? await response.json() : await response.text();
  
      const resData = result?.data;
      const orderId = resData?.orderId;
  
      // VNPay flow
      if (resData?.url && orderId) {
        const vnpayUrl = resData.url;
        window.open(vnpayUrl, "_blank");
  
        const pollingInterval = setInterval(async () => {
          try {
            const statusRes = await fetch(`http://localhost:8080/api/v1/orders/${orderId}/status`);
            const statusData = await statusRes.json();
  
            if (statusData?.data?.paymentStatus === "completed") {
              clearInterval(pollingInterval);
              toast.success(SuccessMessages.PAYMENT_COMPLETED);
              setTimeout(() => {
                navigate(`/order-success?orderId=${orderId}`);
              }, 3000);
            }
          } catch (err) {
            console.error(ErrorMessages.NETWORK_ERROR);
          }
        }, 5000);
  
        setIsLoading(false);
        return;
      }
  
      // COD or MB Bank: just show success and redirect
      if (orderId) {
        toast.success(SuccessMessages.CHECKOUT_SUCCESS);
        setTimeout(() => {
          localStorage.removeItem("sessionId");
          navigate(`/order-success?orderId=${orderId}`);
        }, 1500);
      }
    } catch (err) {
      console.error("Order failed", err);
      toast.error(ErrorMessages.CHECKOUT_FAIL);
    } finally {
      setIsLoading(false);
      setShowConfirmation(false);
    }
  };
  
  const ConfirmationModal = () => {
    if (!showConfirmation) return null;
    
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
          <h2 className="text-xl font-bold mb-4 text-center">Xác nhận đơn hàng</h2>
          
          <div className="border-b pb-4 mb-4">
            <h3 className="font-semibold text-lg mb-2">Thông tin khách hàng</h3>
            <p><span className="font-medium">Họ tên:</span> {formData.name}</p>
            <p><span className="font-medium">Số điện thoại:</span> {formData.phoneNumber}</p>
            <p><span className="font-medium">Email:</span> {formData.email}</p>
            <p><span className="font-medium">Địa chỉ nhận hàng:</span> {shippingAddress}</p>
          </div>
          
          <div className="border-b pb-4 mb-4">
            <h3 className="font-semibold text-lg mb-2">Thông tin đơn hàng</h3>
            <div className="max-h-40 overflow-y-auto">
              {currentCart.map((item, index) => (
                <div key={index} className="flex justify-between text-sm py-1">
                  <span>{item.productName} {item.volume}ml</span>
                  <span>{item.quantity} x {formatPrice(item.unitPrice)}</span>
                </div>
              ))}
            </div>
            <div className="mt-2">
              <p><span className="font-medium">Phí vận chuyển:</span> {formatPrice(formData.shippingFee)}</p>
              <p className="font-bold text-red-600 mt-2">
                <span>Tổng thanh toán:</span> {formatPrice(cartTotal + parseFloat(formData.shippingFee))}
              </p>
            </div>
          </div>
          
          <div className="border-b pb-4 mb-4">
            <h3 className="font-semibold text-lg mb-2">Phương thức thanh toán</h3>
            <p>{paymentMethod === "vnpay" ? "VNPay" : paymentMethod === "mb-bank" ? "MB Bank" : "Thanh toán khi nhận hàng (COD)"}</p>
          </div>
          
          <div className="flex justify-end space-x-4 mt-4">
            <button 
              onClick={() => setShowConfirmation(false)} 
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
            >
              Quay lại
            </button>
            <button 
              onClick={handleCheckout} 
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              disabled={isLoading}
            >
              {isLoading ? "Đang xử lý..." : "Xác nhận đặt hàng"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (currentCart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <h2 className="text-2xl font-semibold mb-2">Giỏ hàng trống</h2>
        <p className="text-gray-600 mb-6">
          Vui lòng thêm sản phẩm vào giỏ hàng
        </p>
        <Link
          to="/products"
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
        >
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <Toaster position="top-center" />
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-center">Đang tải...</p>
          </div>
        </div>
      )}
      
      <form onSubmit={handleProceedToConfirm}>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3 flex flex-col md:flex-row gap-4">
            <div className="md:w-1/2 mx-2">
              <h2 className="text-xl font-bold mb-4">THÔNG TIN MUA HÀNG</h2>
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Họ và tên *"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} p-3 rounded`}
                  />
                  {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
                </div>
                
                <div>
                  <input
                    type="tel"
                    name="phoneNumber"
                    placeholder="Số điện thoại *"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className={`w-full border ${formErrors.phoneNumber ? 'border-red-500' : 'border-gray-300'} p-3 rounded`}
                  />
                  {formErrors.phoneNumber && <p className="text-red-500 text-sm mt-1">{formErrors.phoneNumber}</p>}
                </div>
                
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email *"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} p-3 rounded`}
                  />
                  {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
                </div>
                
                <div>
                  <input
                    type="text"
                    name="street"
                    placeholder="Địa chỉ *"
                    value={formData.street}
                    onChange={handleInputChange}
                    className={`w-full border ${formErrors.street ? 'border-red-500' : 'border-gray-300'} p-3 rounded`}
                  />
                  {formErrors.street && <p className="text-red-500 text-sm mt-1">{formErrors.street}</p>}
                </div>
                
                <div>
                  <input
                    type="text"
                    name="city"
                    placeholder="Tỉnh/Thành phố *"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`w-full border ${formErrors.city ? 'border-red-500' : 'border-gray-300'} p-3 rounded`}
                  />
                  {formErrors.city && <p className="text-red-500 text-sm mt-1">{formErrors.city}</p>}
                </div>
                
                <div>
                  <input
                    type="text"
                    name="district"
                    placeholder="Quận/Huyện *"
                    value={formData.district}
                    onChange={handleInputChange}
                    className={`w-full border ${formErrors.district ? 'border-red-500' : 'border-gray-300'} p-3 rounded`}
                  />
                  {formErrors.district && <p className="text-red-500 text-sm mt-1">{formErrors.district}</p>}
                </div>
                
                <div>
                  <input
                    type="text"
                    name="ward"
                    placeholder="Phường/Xã *"
                    value={formData.ward}
                    onChange={handleInputChange}
                    className={`w-full border ${formErrors.ward ? 'border-red-500' : 'border-gray-300'} p-3 rounded`}
                  />
                  {formErrors.ward && <p className="text-red-500 text-sm mt-1">{formErrors.ward}</p>}
                </div>
                
                <div>
                  <input
                    type="number"
                    name="shippingFee"
                    placeholder="Phí vận chuyển"
                    value={formData.shippingFee}
                    onChange={handleInputChange}
                    className={`w-full border ${formErrors.shippingFee ? 'border-red-500' : 'border-gray-300'} p-3 rounded`}
                  />
                  {formErrors.shippingFee && <p className="text-red-500 text-sm mt-1">{formErrors.shippingFee}</p>}
                </div>
                
                <div>
                  <textarea
                    name="note"
                    placeholder="Ghi chú đơn hàng (không bắt buộc)"
                    value={formData.note}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 p-3 rounded"
                    rows="3"
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="md:w-1/2 mx-2 mt-6 md:mt-0">
              <h2 className="text-xl font-bold mb-4">PHƯƠNG THỨC THANH TOÁN</h2>
              <div className="space-y-4">
                <label className="flex items-center p-3 border border-gray-300 rounded cursor-pointer bg-white hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment-method"
                    checked={paymentMethod === "vnpay"}
                    onChange={() => handlePaymentChange("vnpay")}
                    className="mr-3"
                  />
                  <span>VNPay</span>
                </label>

                <label className="flex items-center p-3 border border-gray-300 rounded cursor-pointer bg-white hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment-method"
                    checked={paymentMethod === "mb-bank"}
                    onChange={() => handlePaymentChange("mb-bank")}
                    className="mr-3"
                  />
                  <span>MB Bank</span>
                </label>

                <label className="flex items-center p-3 border border-gray-300 rounded cursor-pointer bg-white hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment-method"
                    checked={paymentMethod === "cod"}
                    onChange={() => handlePaymentChange("cod")}
                    className="mr-3"
                  />
                  <span>Thanh toán khi nhận hàng (COD)</span>
                </label>
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/3 mt-6 lg:mt-0">
            <div className="border border-gray-200 p-6 bg-white shadow-sm rounded">
              <h2 className="text-xl font-bold mb-6 text-center">
                TÓM TẮT ĐƠN HÀNG
              </h2>
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {currentCart.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between text-sm pb-2"
                  >
                    <div className="flex-grow">
                      {item.productName} {item.volume}ml
                    </div>
                    <p>{item.quantity} x</p>
                    <div className="pl-2">{formatPrice(item.unitPrice)}</div>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-gray-200 mt-4">
                <div className="flex justify-between">
                  <div>Phí vận chuyển</div>
                  <div>{formatPrice(formData.shippingFee)}</div>
                </div>
                <div className="flex justify-between font-bold py-4 text-red-600 mt-4">
                  <div>Tổng thanh toán</div>
                  <div>{formatPrice(cartTotal + parseFloat(formData.shippingFee))}</div>
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-3 rounded mt-4 font-bold hover:bg-blue-600 transition"
                disabled={isLoading}
              >
                {isLoading ? "Đang xử lý..." : "Tiến hành thanh toán"}
              </button>
            </div>
          </div>
        </div>
      </form>
      
      <ConfirmationModal />
    </div>
  );
};

export default Checkout;