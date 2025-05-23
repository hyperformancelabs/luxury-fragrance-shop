import React, { useState, useEffect } from 'react';
import { ShoppingBag, Package, RefreshCw, Check, X, Truck, Clock } from 'lucide-react';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
  
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8080/api/v1/orders/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
  
        const result = await response.json();
  
        if (result.status === 'success') {
          setOrders(result.data);
        } else {
          setError('Failed to load orders');
        }
      } catch (err) {
        setError('Error connecting to server');
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchOrders();
  }, []);
  

  const TabItem = ({ label, active, onClick }) => (
    <button
      className={`px-6 py-3 font-medium text-sm ${
        active 
          ? 'text-black border-b-2 border-black' 
          : 'text-gray-500 hover:text-black'
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );

  const filteredOrders = () => {
    if (activeTab === 'all') return orders;
    
    const statusMap = {
      'processing': 'processing',
      'shipping': 'shipping',
      'completed': 'completed',
      'pending': 'pending',
      'cancelled': 'cancelled'
    };
    
    return orders.filter(order => order.orderStatus === statusMap[activeTab]);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} className="text-yellow-500" />;
      case 'processing':
        return <RefreshCw size={16} className="text-blue-500" />;
      case 'shipping':
        return <Truck size={16} className="text-orange-500" />;
      case 'completed':
        return <Check size={16} className="text-green-500" />;
      case 'cancelled':
        return <X size={16} className="text-red-500" />;
      default:
        return <RefreshCw size={16} className="text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Chờ thanh toán';
      case 'processing':
        return 'Đang xử lý';
      case 'shipping':
        return 'Đang giao hàng';
      case 'completed':
        return 'Đã giao hàng';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return 'Không xác định';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'processing':
        return 'bg-blue-100 text-blue-700';
      case 'shipping':
        return 'bg-orange-100 text-orange-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPaymentStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Đã thanh toán';
      case 'pending':
        return 'Chờ thanh toán';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return 'Không xác định';
    }
  };

  const getPaymentStatusClass = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="max-w-screen-lg mx-auto p-4 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-screen-lg mx-auto p-4">
        <div className="bg-red-50 p-4 rounded-lg text-red-700">
          <p>{error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-200"
            onClick={() => window.location.reload()}
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-lg mx-auto p-4">
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">Đơn mua của tôi</h2>
          <p className="text-gray-600">Quản lý và theo dõi tất cả đơn hàng của bạn</p>
        </div>
        
        {/* Order Tabs */}
        <div className="border-b">
          <div className="flex overflow-x-auto">
            <TabItem 
              label="Tất cả" 
              active={activeTab === 'all'} 
              onClick={() => setActiveTab('all')} 
            />
            <TabItem 
              label="Chờ thanh toán" 
              active={activeTab === 'pending'} 
              onClick={() => setActiveTab('pending')} 
            />
            <TabItem 
              label="Đang xử lý" 
              active={activeTab === 'processing'} 
              onClick={() => setActiveTab('processing')} 
            />
            <TabItem 
              label="Đang giao" 
              active={activeTab === 'shipping'} 
              onClick={() => setActiveTab('shipping')} 
            />
            <TabItem 
              label="Đã giao" 
              active={activeTab === 'completed'} 
              onClick={() => setActiveTab('completed')} 
            />
            <TabItem 
              label="Đã hủy" 
              active={activeTab === 'cancelled'} 
              onClick={() => setActiveTab('cancelled')} 
            />
          </div>
        </div>
        
        {/* Order List */}
        <div className="p-6">
          {filteredOrders().length === 0 ? (
            <div className="text-center py-10">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">Không có đơn hàng nào</h3>
              <p className="text-gray-500">Bạn chưa có đơn hàng nào trong mục này</p>
              <a href="/shop" className="mt-4 inline-block px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition duration-200">
                Mua sắm ngay
              </a>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOrders().map((order) => (
                <div key={order.orderId} className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 p-4 border-b flex flex-wrap justify-between items-center">
                    <div>
                      <span className="font-medium">Đơn hàng #{order.orderId}</span>
                      <span className="text-gray-500 text-sm ml-4">Ngày đặt: {formatDate(order.orderDate)}</span>
                    </div>
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(order.orderStatus)}`}>
                        {getStatusIcon(order.orderStatus)}
                        <span className="ml-1">{getStatusText(order.orderStatus)}</span>
                      </span>
                      
                      {order.payment && (
                        <span className={`ml-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusClass(order.payment.status)}`}>
                          {order.payment.status === 'completed' ? <Check size={16} /> : <Clock size={16} />}
                          <span className="ml-1">{getPaymentStatusText(order.payment.status)}</span>
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Order Items */}
                  <div className="p-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex py-3 border-b last:border-0">
                        <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                          {item.imageUrl && item.imageUrl !== 'none' ? (
                            <img 
                              src={item.imageUrl} 
                              alt={item.productName} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.parentNode.innerHTML = `<div class="w-full h-full bg-gray-200 flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2.0066446 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.29 7 12 12 20.71 7"></polyline><line x1="12" y1="22" x2="12" y2="12"></line></svg></div>`;
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <Package size={24} className="text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4 flex-grow">
                          <h4 className="font-medium">{item.productName}</h4>
                          <p className="text-sm text-gray-500">
                            {item.volume} x {item.quantity}
                          </p>
                          {item.note && <p className="text-xs text-gray-500 mt-1">{item.note}</p>}
                          <p className="text-sm font-medium mt-1">
                            {formatCurrency(item.unitPrice)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-gray-50 p-4 border-t flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div className="mb-3 sm:mb-0">
                      <div>
                        <span className="text-gray-600">Tổng tiền hàng:</span>
                        <span className="font-medium ml-2">{formatCurrency(order.totalAmount - order.shippingFee)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Phí vận chuyển:</span>
                        <span className="font-medium ml-2">{formatCurrency(order.shippingFee)}</span>
                      </div>
                      <div className="mt-1">
                        <span className="text-gray-600">Tổng thanh toán:</span>
                        <span className="font-bold text-lg ml-2">{formatCurrency(order.totalAmount)}</span>
                      </div>
                      {order.payment && (
                        <div className="text-sm text-gray-500 mt-1">
                          Thanh toán qua: {order.payment.method}
                          {order.payment.transactionId && ` (Mã giao dịch: ${order.payment.transactionId})`}
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-3">
                      <a 
                        href={`/orders/${order.orderId}`}
                        className="px-4 py-2 border border-black text-black rounded hover:bg-gray-50 transition duration-200"
                      >
                        Chi tiết
                      </a>
                      {order.orderStatus === 'completed' && (
                        <button 
                          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition duration-200"
                        >
                          Mua lại
                        </button>
                      )}
                      {(order.orderStatus === 'processing' || order.orderStatus === 'pending') && (
                        <button 
                          className="px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-50 transition duration-200"
                        >
                          Hủy đơn
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;