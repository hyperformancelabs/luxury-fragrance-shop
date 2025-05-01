import React, { useState } from 'react';
import { ShoppingBag, Package, RefreshCw, Check, X, Truck } from 'lucide-react';

const OrderHistory = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [orders] = useState([
    {
      id: 'ORD10015624',
      date: '23/04/2025',
      total: 1250000,
      status: 'delivered',
      items: [
        {
          id: 1,
          name: 'Chanel No.5 Eau de Parfum',
          image: '/products/perfume1.jpg',
          price: 750000,
          quantity: 1,
          variation: '50ml'
        },
        {
          id: 2,
          name: 'Dior Sauvage Eau de Toilette',
          image: '/products/perfume2.jpg',
          price: 500000,
          quantity: 1,
          variation: '100ml'
        }
      ]
    },
    {
      id: 'ORD10015590',
      date: '20/04/2025',
      total: 899000,
      status: 'processing',
      items: [
        {
          id: 3,
          name: 'Gucci Bloom Eau de Parfum',
          image: '/products/perfume3.jpg',
          price: 899000,
          quantity: 1,
          variation: '75ml'
        }
      ]
    },
    {
      id: 'ORD10015532',
      date: '15/04/2025',
      total: 1649000,
      status: 'cancelled',
      items: [
        {
          id: 4,
          name: 'Tom Ford Black Orchid',
          image: '/products/perfume4.jpg',
          price: 1649000,
          quantity: 1,
          variation: '100ml'
        }
      ]
    },
    {
      id: 'ORD10015498',
      date: '10/04/2025',
      total: 2150000,
      status: 'delivered',
      items: [
        {
          id: 5,
          name: 'Versace Eros Eau de Parfum',
          image: '/products/perfume5.jpg',
          price: 1350000,
          quantity: 1,
          variation: '100ml'
        },
        {
          id: 6,
          name: 'Jo Malone English Pear & Freesia',
          image: '/products/perfume6.jpg',
          price: 800000,
          quantity: 1,
          variation: '30ml'
        }
      ]
    }
  ]);

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
      'delivered': 'delivered',
      'cancelled': 'cancelled'
    };
    
    return orders.filter(order => order.status === statusMap[activeTab]);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'processing':
        return <RefreshCw size={16} className="text-blue-500" />;
      case 'shipping':
        return <Truck size={16} className="text-orange-500" />;
      case 'delivered':
        return <Check size={16} className="text-green-500" />;
      case 'cancelled':
        return <X size={16} className="text-red-500" />;
      default:
        return <RefreshCw size={16} className="text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'processing':
        return 'Đang xử lý';
      case 'shipping':
        return 'Đang giao hàng';
      case 'delivered':
        return 'Đã giao hàng';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return 'Không xác định';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'processing':
        return 'bg-blue-100 text-blue-700';
      case 'shipping':
        return 'bg-orange-100 text-orange-700';
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

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
              active={activeTab === 'delivered'} 
              onClick={() => setActiveTab('delivered')} 
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
                <div key={order.id} className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 p-4 border-b flex flex-wrap justify-between items-center">
                    <div>
                      <span className="font-medium">Đơn hàng #{order.id}</span>
                      <span className="text-gray-500 text-sm ml-4">Ngày đặt: {order.date}</span>
                    </div>
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1">{getStatusText(order.status)}</span>
                      </span>
                    </div>
                  </div>
                  
                  {/* Order Items */}
                  <div className="p-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex py-3 border-b last:border-0">
                        <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <Package size={24} className="text-gray-400" />
                          </div>
                        </div>
                        <div className="ml-4 flex-grow">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-gray-500">
                            {item.variation} x {item.quantity}
                          </p>
                          <p className="text-sm font-medium mt-1">
                            {formatCurrency(item.price)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Order Footer */}
                  <div className="bg-gray-50 p-4 border-t flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div className="mb-3 sm:mb-0">
                      <span className="text-gray-600">Tổng tiền:</span>
                      <span className="font-bold text-lg ml-2">{formatCurrency(order.total)}</span>
                    </div>
                    <div className="flex space-x-3">
                      <a 
                        href={`/orders/${order.id}`}
                        className="px-4 py-2 border border-black text-black rounded hover:bg-gray-50 transition duration-200"
                      >
                        Chi tiết
                      </a>
                      {order.status === 'delivered' && (
                        <button 
                          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition duration-200"
                        >
                          Mua lại
                        </button>
                      )}
                      {order.status === 'processing' && (
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