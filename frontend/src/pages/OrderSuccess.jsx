import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle, Truck, Calendar, CreditCard } from "lucide-react";
import axios from "axios";
import { useCart } from "../context/CartContext";

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [orderDetails, setOrderDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const  { loadCart } = useCart();

  useEffect(() => {
    if (!orderId) {
      setIsLoading(false);
      setError("Không tìm thấy mã đơn hàng");
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/orders/${orderId}`
        );
        if (response.data.status === "success") {
          setOrderDetails(response.data.data);
          loadCart();
        } else {
          setError(response.data.message || "Có lỗi xảy ra khi lấy thông tin đơn hàng");
        }
      } catch (error) {
        setError("Không thể kết nối đến máy chủ. Vui lòng thử lại sau.");
        console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const formatPrice = (price) => {
    return price?.toLocaleString("vi-VN") + " VND";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const getOrderStatusBadge = (status) => {
    const statusMap = {
      pending: { text: "Đang xử lý", bgColor: "bg-yellow-100", textColor: "text-yellow-800" },
      processing: { text: "Đang xử lý", bgColor: "bg-blue-100", textColor: "text-blue-800" },
      shipped: { text: "Đã giao cho đơn vị vận chuyển", bgColor: "bg-indigo-100", textColor: "text-indigo-800" },
      delivered: { text: "Đã giao hàng", bgColor: "bg-green-100", textColor: "text-green-800" },
      cancelled: { text: "Đã hủy", bgColor: "bg-red-100", textColor: "text-red-800" },
    };

    const statusInfo = statusMap[status] || { text: "Đang xử lý", bgColor: "bg-gray-100", textColor: "text-gray-800" };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.textColor}`}>
        {statusInfo.text}
      </span>
    );
  };

  const getPaymentStatusBadge = (status) => {
    if (!status) return getOrderStatusBadge("pending");
    
    const statusMap = {
      pending: { text: "Chờ thanh toán", bgColor: "bg-yellow-100", textColor: "text-yellow-800" },
      completed: { text: "Đã thanh toán", bgColor: "bg-green-100", textColor: "text-green-800" },
      failed: { text: "Thanh toán thất bại", bgColor: "bg-red-100", textColor: "text-red-800" },
    };

    const statusInfo = statusMap[status] || { text: "Chờ thanh toán", bgColor: "bg-gray-100", textColor: "text-gray-800" };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.textColor}`}>
        {statusInfo.text}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="rounded-full bg-gray-200 h-16 w-16 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="h-4 bg-gray-200 rounded w-48"></div>
        </div>
      </div>
    );
  }

  if (error || !orderDetails) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Không thể tải thông tin đơn hàng
          </h1>
          <p className="text-gray-600 mb-6">{error || "Vui lòng thử lại sau hoặc liên hệ với chúng tôi nếu vấn đề vẫn tiếp tục."}</p>
          <Link
            to="/"
            className="bg-red-500 text-white px-6 py-3 rounded text-center font-medium hover:bg-red-600 transition"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  const { customer, items, totalAmount, orderDate, shipment, orderStatus, estimatedDeliveryDate, shippingFee } = orderDetails;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex flex-col items-center justify-center mb-10 text-center">
        <CheckCircle className="text-green-500 h-16 w-16 mb-4" />
        <h1 className="text-3xl font-bold text-gray-800">
          Đặt hàng thành công!
        </h1>
        <p className="text-gray-600 mt-2">
          Cảm ơn {customer?.name} đã mua hàng. Chúng tôi đã nhận được đơn hàng của bạn.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mb-6">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Thông tin đơn hàng
          </h2>
          {getOrderStatusBadge(orderStatus)}
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Mã đơn hàng</p>
              <p className="font-medium">#{orderDetails.orderId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Ngày đặt hàng</p>
              <p className="font-medium">{formatDate(orderDate)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Dự kiến giao hàng</p>
              <p className="font-medium">{formatDate(estimatedDeliveryDate)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Phương thức thanh toán</p>
              <p className="font-medium">{orderDetails.payment?.method || "Chưa xác định"}</p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Sản phẩm đã mua</h3>
            {items.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center">
                  {item.imageUrl && (
                    <div className="w-16 h-16 mr-4 flex-shrink-0">
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                  )}
                  <div className="flex-grow">
                    <span className="font-medium block">{item.productName}</span>
                    {item.volume && (
                      <span className="text-gray-500 text-sm block">{item.volume}</span>
                    )}
                    {item.note && (
                      <span className="text-gray-500 text-sm block">Ghi chú: {item.note}</span>
                    )}
                    <span className="text-gray-500 text-sm block">Số lượng: {item.quantity}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{formatPrice(item.unitPrice)}</div>
                  <div className="text-sm text-gray-500">
                    Tổng: {formatPrice(item.unitPrice * item.quantity)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tạm tính</span>
              <span>{formatPrice(totalAmount - shippingFee)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Phí vận chuyển</span>
              <span>{formatPrice(shippingFee)}</span>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="flex justify-between items-center font-bold text-lg">
              <span>Tổng cộng</span>
              <span className="text-red-600">{formatPrice(totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <div className="flex items-start">
          <div className="mr-4">
            <Truck className="text-green-500 h-6 w-6" />
          </div>
          <div>
            <h3 className="font-semibold text-green-800 text-lg mb-2">
              Thông tin vận chuyển
            </h3>

            <div className="text-sm text-gray-800 space-y-1">
              <p>
                <span className="font-medium">Họ tên:</span> {customer?.name}
              </p>
              <p>
                <span className="font-medium">Số điện thoại:</span>{" "}
                {customer?.phoneNumber}
              </p>
              <p>
                <span className="font-medium">Email:</span> {customer?.email}
              </p>
              <p>
                <span className="font-medium">Địa chỉ:</span>{" "}
                {customer?.address}
              </p>
              <p>
                <span className="font-medium">Đơn vị vận chuyển:</span>{" "}
                {shipment?.provider || "Chưa xác định"}
              </p>
              {shipment?.trackingNumber && (
                <p>
                  <span className="font-medium">Mã vận đơn:</span>{" "}
                  {shipment.trackingNumber}
                </p>
              )}
              <p>
                <span className="font-medium">Trạng thái:</span>{" "}
                {getOrderStatusBadge(shipment?.shipmentStatus || "pending")}
              </p>
            </div>

            <p className="text-green-700 mt-4">
              Đơn hàng của bạn dự kiến sẽ được giao vào ngày {formatDate(estimatedDeliveryDate)}.
            </p>
          </div>
        </div>
      </div>

      {orderDetails.payment && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6">
          <div className="flex items-start">
            <div className="mr-4">
              <CreditCard className="text-purple-500 h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-purple-800 text-lg mb-2">
                Thông tin thanh toán
              </h3>

              <div className="text-sm text-gray-800 space-y-1">
                <p>
                  <span className="font-medium">Phương thức:</span>{" "}
                  {orderDetails.payment.method || "Chưa xác định"}
                </p>
                <p>
                  <span className="font-medium">Trạng thái:</span>{" "}
                  {getPaymentStatusBadge(orderDetails.payment.status)}
                </p>
                {orderDetails.payment.transactionId && (
                  <p>
                    <span className="font-medium">Mã giao dịch:</span>{" "}
                    {orderDetails.payment.transactionId}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
        <Link
          to="/account/orders"
          className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded text-center font-medium hover:bg-gray-50 transition"
        >
          Xem đơn hàng của tôi
        </Link>
        <Link
          to="/"
          className="bg-red-500 text-white px-6 py-3 rounded text-center font-medium hover:bg-red-600 transition"
        >
          Tiếp tục mua sắm
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;