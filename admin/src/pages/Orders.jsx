import React, { useState } from 'react';
import { Search, Filter, Download, ChevronLeft, ChevronRight, Eye, Edit, Trash2, MoreHorizontal, Clock, ShoppingBag, Package, Check, AlertTriangle, TrendingUp } from 'lucide-react';

// Sample order data
const sampleOrders = [
  {
    id: '#ORD-12345',
    customer: 'Nguyễn Văn A',
    email: 'nguyenvana@email.com',
    phone: '0912345678',
    amount: '₫850,000',
    status: 'completed',
    date: '12/04/2025',
    items: 3,
    paymentMethod: 'COD',
    address: '123 Đường Lê Lợi, Quận 1, TP.HCM'
  },
  {
    id: '#ORD-12346',
    customer: 'Trần Thị B',
    email: 'tranthib@email.com',
    phone: '0923456789',
    amount: '₫1,200,000',
    status: 'shipping',
    date: '11/04/2025',
    items: 2,
    paymentMethod: 'Banking',
    address: '456 Đường Nguyễn Huệ, Quận 1, TP.HCM'
  },
  {
    id: '#ORD-12347',
    customer: 'Lê Văn C',
    email: 'levanc@email.com',
    phone: '0934567890',
    amount: '₫650,000',
    status: 'processing',
    date: '10/04/2025',
    items: 1,
    paymentMethod: 'Momo',
    address: '789 Đường Phạm Ngũ Lão, Quận 1, TP.HCM'
  },
  {
    id: '#ORD-12348',
    customer: 'Phạm Thị D',
    email: 'phamthid@email.com',
    phone: '0945678901',
    amount: '₫2,500,000',
    status: 'cancelled',
    date: '09/04/2025',
    items: 5,
    paymentMethod: 'Credit Card',
    address: '101 Đường Đồng Khởi, Quận 1, TP.HCM'
  },
  {
    id: '#ORD-12349',
    customer: 'Hoàng Văn E',
    email: 'hoangvane@email.com',
    phone: '0956789012',
    amount: '₫1,800,000',
    status: 'pending',
    date: '08/04/2025',
    items: 4,
    paymentMethod: 'Banking',
    address: '202 Đường Hai Bà Trưng, Quận 1, TP.HCM'
  },
  {
    id: '#ORD-12350',
    customer: 'Vũ Thị F',
    email: 'vuthif@email.com',
    phone: '0967890123',
    amount: '₫920,000',
    status: 'completed',
    date: '07/04/2025',
    items: 2,
    paymentMethod: 'COD',
    address: '303 Đường Nguyễn Du, Quận 1, TP.HCM'
  },
  {
    id: '#ORD-12351',
    customer: 'Đặng Văn G',
    email: 'dangvang@email.com',
    phone: '0978901234',
    amount: '₫1,350,000',
    status: 'shipping',
    date: '06/04/2025',
    items: 3,
    paymentMethod: 'Banking',
    address: '404 Đường Lý Tự Trọng, Quận 1, TP.HCM'
  }
];

// Status Badge component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: { 
      color: 'bg-blue-100 text-blue-800', 
      label: 'Chờ xác nhận',
      icon: <Clock size={14} className="mr-1" />
    },
    processing: { 
      color: 'bg-purple-100 text-purple-800', 
      label: 'Đang xử lý',
      icon: <ShoppingBag size={14} className="mr-1" />
    },
    shipping: { 
      color: 'bg-yellow-100 text-yellow-800', 
      label: 'Đang giao',
      icon: <Package size={14} className="mr-1" />
    },
    completed: { 
      color: 'bg-green-100 text-green-800', 
      label: 'Đã giao',
      icon: <Check size={14} className="mr-1" />
    },
    cancelled: { 
      color: 'bg-red-100 text-red-800', 
      label: 'Đã hủy',
      icon: <AlertTriangle size={14} className="mr-1" />
    }
  };

  const config = statusConfig[status] || statusConfig.processing;

  return (
    <span className={`px-3 py-1 inline-flex items-center text-xs font-medium rounded-full ${config.color}`}>
      {config.icon}
      {config.label}
    </span>
  );
};

// Order Card component for mobile view
const OrderCard = ({ order, onSelect }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <span className="text-sm font-medium">{order.id}</span>
          <p className="text-gray-500 text-xs">{order.date}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>
      
      <div className="mb-3">
        <h3 className="font-medium">{order.customer}</h3>
        <p className="text-gray-500 text-sm">{order.items} sản phẩm • {order.amount}</p>
      </div>
      
      <div className="flex justify-between items-center pt-2 border-t border-gray-100">
        <span className="text-gray-500 text-xs">Thanh toán: {order.paymentMethod}</span>
        <button 
          onClick={() => onSelect(order)} 
          className="text-blue-600 text-sm font-medium flex items-center"
        >
          Chi tiết
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

// Stats Card component
const StatsCard = ({ title, value, icon, bgColor }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center">
        <div className={`p-3 rounded-full mr-4 ${bgColor}`}>
          {icon}
        </div>
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <h3 className="text-xl font-bold">{value}</h3>
        </div>
      </div>
    </div>
  );
};

// Order Detail Modal
const OrderDetailModal = ({ order, onClose }) => {
  if (!order) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-full overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Chi tiết đơn hàng {order.id}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-medium mb-2">Thông tin khách hàng</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="mb-2"><span className="font-medium">Tên:</span> {order.customer}</p>
                <p className="mb-2"><span className="font-medium">Email:</span> {order.email}</p>
                <p><span className="font-medium">SĐT:</span> {order.phone}</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Thông tin đơn hàng</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="mb-2"><span className="font-medium">Ngày tạo:</span> {order.date}</p>
                <p className="mb-2"><span className="font-medium">Trạng thái:</span> <StatusBadge status={order.status} /></p>
                <p><span className="font-medium">Thanh toán:</span> {order.paymentMethod}</p>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="font-medium mb-2">Địa chỉ giao hàng</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p>{order.address}</p>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="font-medium mb-2">Sản phẩm</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-2">Sản phẩm</th>
                    <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider pb-2">SL</th>
                    <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider pb-2">Giá</th>
                    <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider pb-2">Tổng</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2">Sản phẩm mẫu A</td>
                    <td className="text-right py-2">1</td>
                    <td className="text-right py-2">₫250,000</td>
                    <td className="text-right py-2">₫250,000</td>
                  </tr>
                  <tr>
                    <td className="py-2">Sản phẩm mẫu B</td>
                    <td className="text-right py-2">2</td>
                    <td className="text-right py-2">₫300,000</td>
                    <td className="text-right py-2">₫600,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center mb-2">
              <span>Tạm tính</span>
              <span>₫850,000</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span>Phí vận chuyển</span>
              <span>₫30,000</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span>Giảm giá</span>
              <span>-₫30,000</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
              <span className="font-bold">Tổng cộng</span>
              <span className="font-bold">{order.amount}</span>
            </div>
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
          <button 
            onClick={onClose} 
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700"
          >
            Đóng
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center">
            <Download size={16} className="mr-2" />
            Xuất hóa đơn
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Orders component
const Orders = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [dateFilter, setDateFilter] = useState('all');
  const ordersPerPage = 5;
  
  // Filter orders based on search, status and date
  const filteredOrders = sampleOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          order.customer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    // Add date filtering logic here if needed
    const matchesDate = true; // Placeholder
    
    return matchesSearch && matchesStatus && matchesDate;
  });
  
  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  const handleOrderSelect = (order) => {
    setSelectedOrder(order);
  };
  
  const closeModal = () => {
    setSelectedOrder(null);
  };
  
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1); // Reset to first page when filter changes
  };
  
  const handleDateFilterChange = (e) => {
    setDateFilter(e.target.value);
    setCurrentPage(1); // Reset to first page when filter changes
  };
  
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h1>
        </div>
      </div>
      
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatsCard 
            title="Tổng đơn hàng" 
            value="256" 
            icon={<ShoppingBag size={20} className="text-white" />}
            bgColor="bg-blue-500"
          />
          <StatsCard 
            title="Đơn chờ xử lý" 
            value="18" 
            icon={<Clock size={20} className="text-white" />}
            bgColor="bg-yellow-500"
          />
          <StatsCard 
            title="Đơn đã hoàn thành" 
            value="198" 
            icon={<Check size={20} className="text-white" />}
            bgColor="bg-green-500"
          />
          <StatsCard 
            title="Tỷ lệ chuyển đổi" 
            value="78%" 
            icon={<TrendingUp size={20} className="text-white" />}
            bgColor="bg-purple-500"
          />
        </div>
        
        {/* Filters and search */}
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm theo ID, tên khách hàng..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter size={18} className="text-gray-400" />
                </div>
                <select
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={statusFilter}
                  onChange={handleStatusFilterChange}
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="pending">Chờ xác nhận</option>
                  <option value="processing">Đang xử lý</option>
                  <option value="shipping">Đang giao</option>
                  <option value="completed">Đã giao</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronDown size={18} className="text-gray-400" />
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar size={18} className="text-gray-400" />
                </div>
                <select
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={dateFilter}
                  onChange={handleDateFilterChange}
                >
                  <option value="all">Tất cả thời gian</option>
                  <option value="today">Hôm nay</option>
                  <option value="yesterday">Hôm qua</option>
                  <option value="week">Tuần này</option>
                  <option value="month">Tháng này</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronDown size={18} className="text-gray-400" />
                </div>
              </div>
              
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center">
                <Download size={16} className="mr-2" />
                Xuất
              </button>
            </div>
          </div>
        </div>
        
        {/* Orders list - Desktop view */}
        <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden mb-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SL</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng tiền</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thanh toán</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày đặt</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentOrders.map((order, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{order.customer}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{order.items}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{order.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{order.paymentMethod}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{order.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => handleOrderSelect(order)}
                        className="p-1 text-blue-600 hover:text-blue-800"
                        title="Xem chi tiết"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        className="p-1 text-green-600 hover:text-green-800"
                        title="Chỉnh sửa"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        className="p-1 text-red-600 hover:text-red-800"
                        title="Xóa"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {currentOrders.length === 0 && (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                    Không tìm thấy đơn hàng nào phù hợp với điều kiện tìm kiếm
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Orders list - Mobile view */}
        <div className="md:hidden">
          {currentOrders.map((order, index) => (
            <OrderCard key={index} order={order} onSelect={handleOrderSelect} />
          ))}
          
          {currentOrders.length === 0 && (
            <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
              Không tìm thấy đơn hàng nào phù hợp với điều kiện tìm kiếm
            </div>
          )}
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-500">
              Hiển thị {indexOfFirstOrder + 1}-{Math.min(indexOfLastOrder, filteredOrders.length)} của {filteredOrders.length} đơn hàng
            </div>
            <div className="flex space-x-1">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-200'}`}
              >
                <ChevronLeft size={16} />
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded-lg ${page === currentPage ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-200'}`}
                >
                  {page}
                </button>
              ))}
              
              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-200'}`}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Order detail modal */}
      {selectedOrder && <OrderDetailModal order={selectedOrder} onClose={closeModal} />}
    </div>
  );
};

// Calendar icon component
const ChevronDown = ({ size, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

// Calendar icon component
const Calendar = ({ size, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

export default Orders;