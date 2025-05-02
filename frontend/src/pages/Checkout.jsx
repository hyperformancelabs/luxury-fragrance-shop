import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { useCart } from "../context/CartContext";

const Checkout = () => {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    street: "",
    city: "",
    district: "",
    ward: "",
    shippingFee: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
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
          shippingCost: 20000.0,
        });
      } else {
        setError(data.message || "Không thể tải hồ sơ");
      }
    } catch (err) {
      console.error(err);
      setError("Lỗi khi tải hồ sơ");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
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
  function extractOrderIdFromVnPayUrlOrBackend(url) {
    const match = url.match(/vnp_OrderInfo=Order:(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const sessionId = localStorage.getItem("sessionId");

    try {
      let response;
      let isTokenUser = !!token;
      let headers = { "Content-Type": "application/json" };
      let endpoint = "";
      let payload;

      if (isTokenUser) {
        payload = {
          shippingAddress: shippingAddress,
          shippingNote: formData.note || "",
          shippingCost: 20000.0,
          paymentMethodId: paymentMethod === "vnpay" ? 4 : 1,
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
          paymentMethodId: paymentMethod === "vnpay" ? 4 : 1,
          sessionId: sessionId,
        };
        endpoint = "http://localhost:8080/api/v1/orders/create-anonymous";
      } else {
        toast.error("Không tìm thấy thông tin phiên làm việc.");
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

      if (!response.ok) {
        throw new Error(
          typeof result === "string" ? result : result.message || "Lỗi đặt hàng"
        );
      }

      const resData = result?.data;

      if (resData?.url && resData?.orderId) {
        const vnpayUrl = resData.url;
        const orderId = resData.orderId;

        const paymentWindow = window.open(vnpayUrl, "_blank");

        const listener = (event) => {
          if (event.origin !== "http://localhost:5173") return;

          if (event.data?.status === "completed") {
            toast.success("Thanh toán thành công!");
            navigate(`/order-success?orderId=${event.data.orderId}`);
          } else {
            toast.error("Thanh toán thất bại.");
          }

          window.removeEventListener("message", listener);
          clearInterval(pollingInterval);
        };

        window.addEventListener("message", listener);

        const pollingInterval = setInterval(async () => {
          try {
            const res = await fetch(
              `http://localhost:8080/api/v1/orders/${orderId}/status`
            );
            const statusData = await res.json();

            if (statusData?.data?.paymentStatus === "completed") {
              clearInterval(pollingInterval);
              window.removeEventListener("message", listener);
              toast.success("Đơn hàng đã được thanh toán!");
              navigate(`/order-success?orderId=${orderId}`);
            }
          } catch (err) {
            console.error("Polling error:", err);
          }
        }, 5000);

        return;
      }

      const orderId = resData?.orderId;
      if (orderId) {
        toast.success("Đặt hàng thành công!");
        setTimeout(() => {
          navigate(`/order-success?orderId=${orderId}`);
        }, 1500);
      } else {
        toast.success("Đặt hàng thành công nhưng không lấy được mã đơn hàng.");
        navigate("/order-success");
      }
    } catch (err) {
      console.error("Order failed", err);
      toast.error(err.message || "Đặt hàng thất bại!");
    }
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
                  name="phoneNumber"
                  placeholder="Số điện thoại"
                  value={formData.phoneNumber}
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
                  name="street"
                  placeholder="Địa chỉ"
                  value={formData.street}
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
                <input
                  type="number"
                  name="shippingFee"
                  placeholder="Phí vận chuyển"
                  value={formData.shippingFee}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-3 rounded"
                  required
                />
              </div>
            </div>

            <div className="mx-2 w-1/2">
              <h2 className="text-xl font-bold mb-4">PHƯƠNG THỨC THANH TOÁN</h2>
              <div className="space-y-4">
                <label className="flex items-center p-3 border border-gray-300 rounded cursor-pointer">
                  <input
                    type="radio"
                    name="payment-method"
                    checked={paymentMethod === "vnpay"}
                    onChange={() => handlePaymentChange("vnpay")}
                    className="mr-3"
                  />
                  <span>VNPay</span>
                </label>

                <label className="flex items-center p-3 border border-gray-300 rounded cursor-pointer">
                  <input
                    type="radio"
                    name="payment-method"
                    checked={paymentMethod === "mb-bank"}
                    onChange={() => handlePaymentChange("mb-bank")}
                    className="mr-3"
                  />
                  <span>MB Bank</span>
                </label>

                <label className="flex items-center p-3 border border-gray-300 rounded cursor-pointer">
                  <input
                    type="radio"
                    name="payment-method"
                    checked={paymentMethod === "cod"}
                    onChange={() => handlePaymentChange("cod")}
                    className="mr-3"
                  />
                  <span>COD</span>
                </label>
              </div>
            </div>
          </div>
          <div className="lg:w-1/3">
            <div className="border border-gray-200 p-6">
              <h2 className="text-xl font-bold mb-6 text-center">
                TÓM TẮT ĐƠN HÀNG
              </h2>
              <div className="space-y-4">
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
              <div className="flex justify-between font-bold py-4 border-t border-gray-200 text-red-600 mt-4">
                <div>Tổng đơn hàng</div>
                <div>{formatPrice(cartTotal)}</div>
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
