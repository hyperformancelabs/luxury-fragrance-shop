import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Filter, ChevronDown, ChevronUp, MoreHorizontal, Mail, Phone, Download, Eye, UserPlus, Heart } from 'lucide-react';

const Customer = () => {
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeTab, setActiveTab] = useState('all');
  
  const customers = [
    {
      id: 1,
      name: 'Nguyễn Văn A',
      email: 'nguyenvana@email.com',
      phone: '0901234567',
      totalOrders: 8,
      totalSpent: '12,560,000',
      lastOrder: '10/04/2025',
      status: 'active',
      segment: 'vip',
      address: '123 Đường Lê Lợi, Quận 1, TP.HCM',
      joinDate: '15/05/2023'
    },
    {
      id: 2,
      name: 'Trần Thị B',
      email: 'tranthib@email.com',
      phone: '0912345678',
      totalOrders: 5,
      totalSpent: '6,850,000',
      lastOrder: '05/04/2025',
      status: 'active',
      segment: 'loyal',
      address: '456 Đường Nguyễn Huệ, Quận 1, TP.HCM',
      joinDate: '22/08/2023'
    },
    {
      id: 3,
      name: 'Phạm Văn C',
      email: 'phamvanc@email.com',
      phone: '0923456789',
      totalOrders: 2,
      totalSpent: '1,950,000',
      lastOrder: '02/03/2025',
      status: 'inactive',
      segment: 'regular',
      address: '789 Đường Lý Tự Trọng, Quận 3, TP.HCM',
      joinDate: '10/11/2023'
    },
    {
      id: 4,
      name: 'Lê Thị D',
      email: 'lethid@email.com',
      phone: '0934567890',
      totalOrders: 12,
      totalSpent: '28,350,000',
      lastOrder: '12/04/2025',
      status: 'active',
      segment: 'vip',
      address: '101 Đường Võ Văn Tần, Quận 3, TP.HCM',
      joinDate: '05/02/2023'
    },
    {
      id: 5,
      name: 'Hoàng Văn E',
      email: 'hoangvane@email.com',
      phone: '0945678901',
      totalOrders: 0,
      totalSpent: '0',
      lastOrder: '-',
      status: 'new',
      segment: 'new',
      address: '202 Đường Cách Mạng Tháng 8, Quận 10, TP.HCM',
      joinDate: '08/04/2025'
    },
    {
      id: 6,
      name: 'Võ Thị F',
      email: 'vothif@email.com',
      phone: '0956789012',
      totalOrders: 4,
      totalSpent: '5,480,000',
      lastOrder: '25/03/2025',
      status: 'active',
      segment: 'loyal',
      address: '303 Đường Điện Biên Phủ, Quận Bình Thạnh, TP.HCM',
      joinDate: '17/09/2023'
    }
  ];

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedCustomers(customers.map(c => c.id));
    } else {
      setSelectedCustomers([]);
    }
  };

  const handleSelectCustomer = (id) => {
    if (selectedCustomers.includes(id)) {
      setSelectedCustomers(selectedCustomers.filter(c => c !== id));
    } else {
      setSelectedCustomers([...selectedCustomers, id]);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return null;
    
    return sortDirection === 'asc' ? 
      <ChevronUp size={16} className="ml-1" /> : 
      <ChevronDown size={16} className="ml-1" />;
  };

  const getSegmentBadge = (segment) => {
    switch (segment) {
      case 'vip':
        return <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">VIP</span>;
      case 'loyal':
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Trung thành</span>;
      case 'regular':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Thường xuyên</span>;
      case 'new':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Mới</span>;
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Hoạt động</span>;
      case 'inactive':
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Không hoạt động</span>;
      case 'new':
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Mới</span>;
      default:
        return null;
    }
  };

  const filterCustomers = () => {
    let filtered = customers;
    
    if (activeTab !== 'all') {
      filtered = filtered.filter(c => c.segment === activeTab);
    }
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(c => c.status === filterStatus);
    }
    
    return filtered;
  };

  const filteredCustomers = filterCustomers();

  const customerStats = {
    all: customers.length,
    active: customers.filter(c => c.status === 'active').length,
    vip: customers.filter(c => c.segment === 'vip').length,
    loyal: customers.filter(c => c.segment === 'loyal').length,
    new: customers.filter(c => c.status === 'new').length
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-6 py-3">
          <h1 className="text-xl font-bold text-gray-800">Quản lý khách hàng</h1>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Action Bar */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center">
                <UserPlus size={18} className="mr-1" />
                Thêm khách hàng
              </button>
              
              <button className="text-gray-600 border border-gray-300 px-4 py-2 rounded-lg flex items-center" disabled={selectedCustomers.length === 0}>
                <Edit size={18} className="mr-1" />
                Sửa
              </button>
              
              <button className="text-red-600 border border-red-300 px-4 py-2 rounded-lg flex items-center" disabled={selectedCustomers.length === 0}>
                <Trash2 size={18} className="mr-1" />
                Xóa
              </button>
            </div>
            
            <div className="flex space-x-2">
              <button className="text-gray-600 border border-gray-300 px-4 py-2 rounded-lg flex items-center">
                <Mail size={18} className="mr-1" />
                Email
              </button>
              
              <button className="text-gray-600 border border-gray-300 px-4 py-2 rounded-lg flex items-center">
                <Download size={18} className="mr-1" />
                Xuất
              </button>
            </div>
          </div>
          
          <div className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0">
            <div className="w-full md:w-1/3 flex items-center bg-gray-100 rounded-lg px-3 py-2">
              <Search size={18} className="text-gray-400" />
              <input 
                type="text" 
                placeholder="Tìm theo tên, email, số điện thoại..." 
                className="ml-2 w-full bg-transparent outline-none"
              />
            </div>
            
            <div className="flex flex-wrap items-center space-x-2">
              <div className="flex items-center">
                <select 
                  className="bg-gray-100 rounded px-3 py-2 text-sm border-0"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
                  <option value="new">Mới</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <select className="bg-gray-100 rounded px-3 py-2 text-sm border-0">
                  <option>Tất cả khu vực</option>
                  <option>TP.HCM</option>
                  <option>Hà Nội</option>
                  <option>Đà Nẵng</option>
                  <option>Khác</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
          <div 
            className={`bg-white rounded-lg shadow p-4 border-t-4 cursor-pointer ${activeTab === 'all' ? 'border-blue-500' : 'border-transparent'}`}
            onClick={() => setActiveTab('all')}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500">Tất cả</p>
                <h3 className="text-2xl font-bold">{customerStats.all}</h3>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
            </div>
          </div>
          
          <div 
            className={`bg-white rounded-lg shadow p-4 border-t-4 cursor-pointer ${activeTab === 'vip' ? 'border-purple-500' : 'border-transparent'}`}
            onClick={() => setActiveTab('vip')}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500">VIP</p>
                <h3 className="text-2xl font-bold">{customerStats.vip}</h3>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9333ea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </div>
            </div>
          </div>
          
          <div 
            className={`bg-white rounded-lg shadow p-4 border-t-4 cursor-pointer ${activeTab === 'loyal' ? 'border-blue-500' : 'border-transparent'}`}
            onClick={() => setActiveTab('loyal')}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500">Trung thành</p>
                <h3 className="text-2xl font-bold">{customerStats.loyal}</h3>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Heart size={24} className="text-blue-600" />
              </div>
            </div>
          </div>
          
          <div 
            className={`bg-white rounded-lg shadow p-4 border-t-4 cursor-pointer ${activeTab === 'new' ? 'border-yellow-500' : 'border-transparent'}`}
            onClick={() => setActiveTab('new')}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500">Mới</p>
                <h3 className="text-2xl font-bold">{customerStats.new}</h3>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
            </div>
          </div>
          
          <div 
            className={`bg-white rounded-lg shadow p-4 border-t-4 cursor-pointer ${activeTab === 'active' ? 'border-green-500' : 'border-transparent'}`}
            onClick={() => setActiveTab('active')}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500">Hoạt động</p>
                <h3 className="text-2xl font-bold">{customerStats.active}</h3>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        {/* Customers Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="w-12 px-4 py-3">
                    <input 
                      type="checkbox" 
                      className="rounded"
                      onChange={handleSelectAll}
                      checked={selectedCustomers.length === filteredCustomers.length && filteredCustomers.length > 0}
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('name')}>
                    <div className="flex items-center">
                      Khách hàng
                      {getSortIcon('name')}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Liên hệ
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('totalOrders')}>
                    <div className="flex items-center">
                      Đơn hàng
                      {getSortIcon('totalOrders')}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('totalSpent')}>
                    <div className="flex items-center">
                      Tổng chi tiêu
                      {getSortIcon('totalSpent')}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phân loại
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('lastOrder')}>
                    <div className="flex items-center">
                      Đơn hàng gần nhất
                      {getSortIcon('lastOrder')}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCustomers.map(customer => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <input 
                        type="checkbox" 
                        className="rounded"
                        checked={selectedCustomers.includes(customer.id)}
                        onChange={() => handleSelectCustomer(customer.id)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-medium">
                            {customer.name.charAt(0)}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">{customer.name}</div>
                          <div className="text-sm text-gray-500">Tham gia: {customer.joinDate}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <div className="text-sm flex items-center">
                          <Mail size={14} className="mr-1 text-gray-400" />
                          <span>{customer.email}</span>
                        </div>
                        <div className="text-sm flex items-center mt-1">
                          <Phone size={14} className="mr-1 text-gray-400" />
                          <span>{customer.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                      {customer.totalOrders}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                      {customer.totalSpent === '0' ? '-' : `₫${customer.totalSpent}`}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {getSegmentBadge(customer.segment)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {getStatusBadge(customer.status)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {customer.lastOrder}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button className="text-blue-600 hover:text-blue-800">
                          <Eye size={18} />
                        </button>
                        <button className="text-gray-600 hover:text-gray-800">
                          <Edit size={18} />
                        </button>
                        <button className="text-red-600 hover:text-red-800">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredCustomers.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Không tìm thấy khách hàng</h3>
              <p className="mt-1 text-sm text-gray-500">Không có khách hàng nào phù hợp với điều kiện tìm kiếm.</p>
              <div className="mt-6">
                <button type="button" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
                  <UserPlus className="-ml-1 mr-2 h-5 w-5" />
                  Thêm khách hàng
                </button>
              </div>
            </div>
          )}
          
          <div className="px-4 py-3 flex items-center justify-between border-t">
            <div className="flex items-center text-sm text-gray-500">
              <span>Hiển thị 1-{filteredCustomers.length} trong {filteredCustomers.length} khách hàng</span>
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 border rounded bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50" disabled>
                Trước
              </button>
              <span className="px-3 py-1 border rounded bg-blue-600 text-white">1</span>
              <button className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50" disabled={filteredCustomers.length <= 6}>2</button>
              <button className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50" disabled={filteredCustomers.length <= 12}>3</button>
              <button className="px-3 py-1 border rounded bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50" disabled={filteredCustomers.length <= 6}>
                Sau
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Hoạt động gần đây</h3>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">Khách hàng <span className="font-semibold">Lê Thị D</span> đã đặt một đơn hàng mới</p>
                    <p className="text-xs text-gray-500">20 phút trước</p>
                  </div>
                </div>
                <button className="text-blue-600 text-sm">Xem</button>
              </div>
            </div>
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">Khách hàng <span className="font-semibold">Hoàng Văn E</span> đã đăng ký tài khoản mới</p>
                    <p className="text-xs text-gray-500">1 giờ trước</p>
                  </div>
                </div>
                <button className="text-blue-600 text-sm">Xem</button>
              </div>
            </div>
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">Khách hàng <span className="font-semibold">Trần Thị B</span> đã gửi yêu cầu hỗ trợ</p>
                    <p className="text-xs text-gray-500">3 giờ trước</p>
                  </div>
                </div>
                <button className="text-blue-600 text-sm">Phản hồi</button>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9333ea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                      <line x1="9" y1="9" x2="9.01" y2="9"></line>
                      <line x1="15" y1="9" x2="15.01" y2="9"></line>
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">Khách hàng <span className="font-semibold">Nguyễn Văn A</span> đã được nâng cấp lên VIP</p>
                    <p className="text-xs text-gray-500">5 giờ trước</p>
                  </div>
                </div>
                <button className="text-blue-600 text-sm">Xem</button>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-4">
            <button className="text-blue-600 text-sm font-medium">Xem tất cả hoạt động →</button>
          </div>
        </div>
      </div>
      
      
    </div>
  );
};

export default Customer;