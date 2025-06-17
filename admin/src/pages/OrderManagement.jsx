import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Filter, ChevronDown, ChevronUp, MoreHorizontal, Eye, Clock, Package, Check, AlertTriangle, RefreshCw, ChevronLeft, ChevronRight, Download, X } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import orderService from '../services/orderService';
import { PageHeader, PaginationFooter, TableToolbar } from '../Components/common';

// Helper function to get status configuration
const getStatusConfig = (status) => {
  const statusConfigs = {
    pending: { 
      color: 'bg-blue-100 text-blue-800', 
      label: 'Chờ xác nhận',
      icon: <Clock size={14} className="mr-1" />
    },
    processing: { 
      color: 'bg-purple-100 text-purple-800', 
      label: 'Đang xử lý',
      icon: <RefreshCw size={14} className="mr-1" />
    },
    shipping: { 
      color: 'bg-yellow-100 text-yellow-800', 
      label: 'Đang giao',
      icon: <Package size={14} className="mr-1" />
    },
    delivered: { 
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

  return statusConfigs[status] || statusConfigs.processing;
};

// AFTER getStatusConfig definition, add helper for allowed transitions
const getNextStatuses = (currentStatus) => {
  const transitions = {
    pending: ['processing', 'cancelled'],
    processing: ['shipping', 'cancelled'],
    shipping: ['delivered', 'cancelled'],
  };
  return transitions[currentStatus] || [];
};

// Status Badge component
const StatusBadge = ({ status }) => {
  const config = getStatusConfig(status);
  return (
    <span className={`px-3 py-1 inline-flex items-center text-xs font-medium rounded-full ${config.color}`}>
      {config.icon}
      {config.label}
    </span>
  );
};

const OrderManagement = () => {
  // State cho dữ liệu đơn hàng
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State cho pagination
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  
  // State cho sắp xếp và tìm kiếm
  const [sortField, setSortField] = useState('orderId');
  const [sortDirection, setSortDirection] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  
  // State cho filters
  const [showFilters, setShowFilters] = useState(false);
  const [orderFilters, setOrderFilters] = useState({
    status: '',
    dateFrom: '',
    dateTo: '',
    customerId: ''
  });
  
  // State cho selection và modal
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState(null);
  
  // State cho status management
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusToUpdate, setStatusToUpdate] = useState('');
  const [statusReason, setStatusReason] = useState('');
  
  // State cho edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSection, setEditingSection] = useState(''); // 'items', 'payment', 'shipment'
  const [editedQuantities, setEditedQuantities] = useState({});
  


  // Inline status dropdown state
  const [statusEditingOrderId, setStatusEditingOrderId] = useState(null);

  // Undo stack for status changes
  const [undoStack, setUndoStack] = useState([]);

  // New state for changed statuses
  const [changedStatuses, setChangedStatuses] = useState({});

  // New state for filter anchor
  const [filterAnchor, setFilterAnchor] = useState(null);

  // Fetch orders when dependencies change
  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, sortField, sortDirection, searchTerm, orderFilters]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+R or F5 - Refresh
      if ((e.ctrlKey && e.key === 'r') || e.key === 'F5') {
        e.preventDefault();
        fetchOrders();
        toast.success('Đã làm mới dữ liệu');
      }
      
      // Escape - Close modals
      if (e.key === 'Escape') {
        setShowDetailModal(false);
        setShowEditModal(false);
        setShowStatusModal(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filters = {
        ...orderFilters,
        keyword: searchTerm
      };
      
      const response = await orderService.getAllOrders(page, pageSize, sortField, sortDirection, filters);
      
      if (response.status === 'success') {
        const data = response.data;
        setOrders(data.orders || []);
        setTotalPages(data.totalPages || 0);
        setTotalItems(data.totalItems || 0);
      } else {
        setError(response.message || 'Failed to fetch orders');
        toast.error(response.message || 'Lỗi khi tải danh sách đơn hàng');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Có lỗi xảy ra khi tải dữ liệu');
      toast.error('Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };



  // Handle sorting
  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field) => {
    if (field !== sortField) return null;
    return sortDirection === 'asc' ? 
      <ChevronUp size={16} className="ml-1" /> : 
      <ChevronDown size={16} className="ml-1" />;
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(0);
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // Handle selection
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedOrders(orders.map(order => order.orderId));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (orderId) => {
    setSelectedOrders(prev =>
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  // Handle view order detail
  const handleViewOrder = async (order) => {
    try {
      setSelectedOrder(order);
      const response = await orderService.getOrderDetail(order.orderId);
      if (response.status === 'success') {
        setSelectedOrderDetail(response.data);
        setShowDetailModal(true);
      } else {
        toast.error('Không thể tải chi tiết đơn hàng');
      }
    } catch (error) {
      console.error('Error fetching order detail:', error);
      toast.error('Có lỗi xảy ra khi tải chi tiết đơn hàng');
    }
  };

  // Handle edit order
  const handleEditOrder = async (order) => {
    try {
      setSelectedOrder(order);
      const response = await orderService.getOrderDetail(order.orderId);
      if (response.status === 'success') {
        setSelectedOrderDetail(response.data);
        setEditingSection('items');
        setShowEditModal(true);
        setEditedQuantities({});
      } else {
        toast.error('Không thể tải chi tiết đơn hàng');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tải chi tiết đơn hàng');
    }
  };

  // Handle single order status update
  const handleSingleStatusUpdate = (order, newStatus) => {
    setSelectedOrder(order);
    setStatusToUpdate(newStatus);
    setShowStatusModal(true);
  };

  // Undo stack for status changes
  const handleUndoStatus = async (orderId, prevStatus, toastId) => {
    try {
      await orderService.updateOrderStatus(orderId, prevStatus);
      setChangedStatuses(prev => {
        const copy = { ...prev };
        delete copy[orderId];
        return copy;
      });
      toast.dismiss(toastId);
      toast.success(`Đã hoàn tác trạng thái đơn hàng #${orderId}`);
      fetchOrders();
    } catch (_e) {
      toast.error('Không thể hoàn tác');
    }
  };

  // Handle cancel order
  const handleCancelOrder = async (order) => {
    if (window.confirm(`Bạn có chắc chắn muốn hủy đơn hàng #${order.orderId}?`)) {
      try {
        await orderService.cancelOrder(order.orderId, 'Hủy bởi admin');
        toast.success(`Hủy đơn hàng #${order.orderId} thành công`);
        fetchOrders();
      } catch (error) {
        toast.error('Có lỗi xảy ra khi hủy đơn hàng');
      }
    }
  };

  // Delete single item in edit modal
  const handleDeleteItem = async (orderId, itemId) => {
    try {
      await orderService.deleteOrderItem(orderId, itemId);
      toast.success('Đã xoá sản phẩm');
      // Refresh detail
      const detail = await orderService.getOrderDetail(orderId);
      if (detail.status === 'success') {
        setSelectedOrderDetail(detail.data);
      }
      fetchOrders();
    } catch (_e) {
      toast.error('Không thể xoá sản phẩm');
    }
  };

  // Save changes in edit modal (currently items quantity only)
  const handleSaveChanges = async () => {
    if (!selectedOrder) return;
    try {
      const promises = [];
      selectedOrderDetail.items?.forEach((item) => {
        const newQty = editedQuantities[item.orderItemId] ?? item.quantity;
        if (newQty !== item.quantity) {
          promises.push(orderService.updateOrderItemQuantity(selectedOrder.orderId, item.orderItemId, newQty));
        }
      });

      if (promises.length > 0) {
        await Promise.all(promises);
        toast.success('Đã lưu thay đổi');
      } else {
        toast.info('Không có thay đổi để lưu');
      }

      // Refresh list & close modal
      fetchOrders();
      setShowEditModal(false);
    } catch (_e) {
      toast.error('Lỗi khi lưu thay đổi');
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Format date - handle array format from backend
  const formatDate = (dateInput) => {
    if (Array.isArray(dateInput)) {
      // Backend returns date as [year, month, day, hour, minute]
      const [year, month, day] = dateInput;
      return new Date(year, month - 1, day).toLocaleDateString('vi-VN');
    }
    return new Date(dateInput).toLocaleDateString('vi-VN');
  };

  // Handle filter toggle
  const handleFilterToggle = (e) => {
    setShowFilters(prev => !prev);
    if (e) {
      const rect = e.currentTarget.getBoundingClientRect();
      setFilterAnchor({top: rect.bottom + window.scrollY + 6, left: rect.left + window.scrollX});
    }
  };

  // Apply filters
  const applyFilters = () => {
    setPage(0);
    fetchOrders();
  };

  // Clear filters
  const clearFilters = () => {
    setOrderFilters({
      status: '',
      dateFrom: '',
      dateTo: '',
      customerId: ''
    });
    setSearchTerm('');
    setPage(0);
    fetchOrders();
  };

  // Quick filter by status
  const quickFilterByStatus = (status) => {
    setOrderFilters(prev => ({ ...prev, status }));
    setPage(0);
  };

  // Handle bulk status update
  const handleBulkStatusUpdate = async (newStatus) => {
    if (selectedOrders.length === 0) {
      toast.error('Vui lòng chọn ít nhất một đơn hàng');
      return;
    }

    try {
      const promises = selectedOrders.map(orderId => 
        orderService.updateOrderStatus(orderId, newStatus)
      );
      
      await Promise.all(promises);
      toast.success(`Cập nhật trạng thái cho ${selectedOrders.length} đơn hàng thành công`);
      setSelectedOrders([]);
      fetchOrders();
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật trạng thái');
    }
  };

  // Handle confirm status update
  const confirmStatusUpdate = async () => {
    try {
      if (!selectedOrder) return;
      const prevStatus = selectedOrder.orderStatus;
      await orderService.updateOrderStatus(selectedOrder.orderId, statusToUpdate, statusReason);
      setOrders(prev =>
        prev.map(o =>
          o.orderId === selectedOrder.orderId ? { ...o, orderStatus: statusToUpdate } : o
        )
      );

      // push to undo stack
      const toastId = toast.custom((t) => (
        <div className="bg-white shadow px-4 py-2 rounded flex items-center space-x-2">
          <span>Đã cập nhật trạng thái.</span>
          <button onClick={() => handleUndoStatus(selectedOrder.orderId, prevStatus, t.id)} className="text-blue-600 hover:underline">Hoàn tác</button>
        </div>
      ), { duration: 5000 });

      setUndoStack(stack => [...stack, { orderId: selectedOrder.orderId, prevStatus }]);

      setShowStatusModal(false);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Có lỗi khi cập nhật trạng thái');
    }
  };

  return (
    <div className="p-6">
      <Toaster position="top-right" />
      
      <PageHeader title="Quản lý đơn hàng" subtitle="Quản lý tất cả đơn hàng trong hệ thống" />

      {/* Bulk Actions */}
      {selectedOrders.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 mt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-blue-800 font-medium">
                Đã chọn {selectedOrders.length} đơn hàng
              </span>
              <div className="flex items-center space-x-2">
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      handleBulkStatusUpdate(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  className="text-sm border border-blue-300 rounded px-3 py-1"
                  defaultValue=""
                >
                  <option value="">Cập nhật trạng thái</option>
                  <option value="processing">Đang xử lý</option>
                  <option value="shipping">Đang giao</option>
                  <option value="delivered">Đã giao</option>
                  <option value="cancelled">Hủy đơn</option>
                </select>
              </div>
            </div>
            <button
              onClick={() => setSelectedOrders([])}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Bỏ chọn tất cả
            </button>
          </div>
        </div>
      )}

      {/* Toolbar wrapper */}
      <div className={`bg-white rounded-lg shadow mb-6 ${selectedOrders.length === 0 ? 'mt-6' : ''}`}>
        <TableToolbar
          searchValue={searchTerm}
          onSearchChange={(e) => setSearchTerm(e.target.value)}
          onSearchSubmit={(e)=>{e.preventDefault(); setPage(0); fetchOrders();}}
          onFilter={handleFilterToggle}
          addLabel={null}
          onAdd={null}
          placeholder="Tìm đơn hàng, khách hàng..."
        />
      </div>

      {/* Filter Popup */}
      {showFilters && (
        <div className="fixed z-50 bg-white border rounded-md shadow-lg p-4" style={{top: filterAnchor?.top, left: filterAnchor?.left, width: '300px'}}>
          <h4 className="font-medium mb-2 flex items-center"><Filter size={16} className="mr-2" /> Bộ lọc</h4>
          {/* Status checkboxes */}
          <div className="mb-3">
            <p className="text-sm font-semibold mb-1">Trạng thái</p>
            {['pending','processing','shipping','delivered','cancelled'].map(st=> (
              <label key={st} className="flex items-center text-sm space-x-2 mb-1">
                <input
                  type="checkbox"
                  checked={orderFilters.status===st}
                  onChange={()=> setOrderFilters(prev=> ({...prev, status: prev.status===st? '' : st}))}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span>{getStatusConfig(st).label}</span>
              </label>
            ))}
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <button
              onClick={()=>{clearFilters(); setShowFilters(false);}}
              className="px-3 py-1 text-sm border rounded"
            >Bỏ lọc</button>
            <button
              onClick={()=>{applyFilters(); setShowFilters(false);}}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded"
            >Áp dụng</button>
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Mobile Cards View */}
        <div className="block lg:hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <p className="text-gray-500">{error}</p>
                <button
                  onClick={fetchOrders}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Thử lại
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {orders.map((order) => (
                <div key={order.orderId} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-blue-600">#{order.orderId}</span>
                        <StatusBadge status={order.orderStatus} />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(order.orderDate)}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900">
                        {formatCurrency(order.totalAmount)}
                      </div>
                      <div className="text-xs text-gray-500">
                        KH #{order.customerId}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <div className="text-xs text-gray-500">
                      {order.items?.length || 'N/A'} SP • {order.shippingOption || 'N/A'}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewOrder(order)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-gray-500">{error}</p>
              <button
                onClick={fetchOrders}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Thử lại
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedOrders.length === orders.length && orders.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300"
                      />
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('orderId')}
                    >
                      <div className="flex items-center">
                        Mã đơn hàng
                        {getSortIcon('orderId')}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('customerName')}
                    >
                      <div className="flex items-center">
                        Khách hàng
                        {getSortIcon('customerName')}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('orderDate')}
                    >
                      <div className="flex items-center">
                        Ngày đặt
                        {getSortIcon('orderDate')}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('totalAmount')}
                    >
                      <div className="flex items-center">
                        Tổng tiền
                        {getSortIcon('totalAmount')}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sản phẩm
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.orderId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(order.orderId)}
                          onChange={() => handleSelectOrder(order.orderId)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer">
                          #{order.orderId}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-xs font-medium text-gray-600">
                                {order.customerId}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm text-gray-900">{order.customerName || `Khách hàng #${order.customerId}`}</div>
                            <div className="text-xs text-gray-500">ID: {order.customerId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(order.orderDate)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {Array.isArray(order.orderDate) && order.orderDate.length >= 5 
                            ? `${order.orderDate[3].toString().padStart(2, '0')}:${order.orderDate[4].toString().padStart(2, '0')}`
                            : ''
                          }
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {formatCurrency(order.totalAmount)}
                        </div>
                        {order.shippingFee > 0 && (
                          <div className="text-xs text-gray-500">
                            + {formatCurrency(order.shippingFee)} ship
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap relative">
                        <div onClick={() => setStatusEditingOrderId(statusEditingOrderId === order.orderId ? null : order.orderId)} className="cursor-pointer inline-flex items-center">
                          <StatusBadge status={order.orderStatus} />
                        </div>
                        {statusEditingOrderId === order.orderId && (
                          <div className="absolute z-20 mt-2 right-0 w-44 bg-white border border-gray-200 rounded shadow">
                            {getNextStatuses(order.orderStatus).map((st) => (
                              <button
                                key={st}
                                onClick={() => {
                                  handleSingleStatusUpdate(order, st);
                                  setStatusEditingOrderId(null);
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                {getStatusConfig(st).icon}
                                <span className="ml-2">{getStatusConfig(st).label}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {order.itemsCount ?? 0} SP
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.shippingOption || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-1">
                          <button
                            onClick={() => handleViewOrder(order)}
                            className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded transition-colors"
                            title="Xem chi tiết"
                          >
                            <Eye size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination (enhanced) */}
            {!loading && !error && orders.length > 0 && (
              <div className="px-4 py-3 flex flex-col md:flex-row md:justify-between border-t gap-3 bg-white">
                {/* Info & page size */}
                <div className="flex items-center text-sm text-gray-500 flex-wrap gap-2">
                  <span>Hiển thị</span>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setPage(0);
                    }}
                    className="px-1 py-1 text-sm border rounded"
                  >
                    {[10, 20, 50, 100, 200, 500].map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                    <option value={totalItems}>Tất cả</option>
                  </select>
                  <span>mỗi trang trong {totalItems} đơn hàng</span>
                </div>

                {/* Controls */}
                <div className="flex justify-between md:justify-end items-center space-x-2">
                  <div className="flex items-center">
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 0}
                      className={`px-2 py-1 border rounded ${page === 0 ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <div className="flex items-center mx-1">
                      {/* first page */}
                      <button
                        className={`px-3 py-1 border rounded ${page === 0 ? 'bg-blue-600 text-white' : 'hover:bg-gray-50'}`}
                        onClick={() => handlePageChange(0)}
                      >1</button>
                      {page > 2 && (<span className="px-1">...</span>)}
                      {Array.from({ length: totalPages }).map((_, i) => {
                        if (i !== 0 && i !== totalPages - 1) {
                          if ((page === i) || (page === i - 1) || (page === i + 1)) {
                            return (
                              <button key={i} className={`px-3 py-1 border rounded ${page === i ? 'bg-blue-600 text-white' : 'hover:bg-gray-50'}`} onClick={() => handlePageChange(i)}>{i + 1}</button>
                            );
                          }
                        }
                        return null;
                      })}
                      {page < totalPages - 3 && (<span className="px-1">...</span>)}
                      {totalPages > 1 && (
                        <button className={`px-3 py-1 border rounded ${page === totalPages - 1 ? 'bg-blue-600 text-white' : 'hover:bg-gray-50'}`} onClick={() => handlePageChange(totalPages - 1)}>{totalPages}</button>
                      )}
                    </div>
                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page >= totalPages - 1}
                      className={`px-2 py-1 border rounded ${page >= totalPages - 1 ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                  {/* Go to page */}
                  <div className="inline-flex items-center ml-2">
                    <span className="mr-1 text-sm whitespace-nowrap">Đến trang:</span>
                    <input
                      type="number"
                      min="1"
                      max={totalPages}
                      className="w-16 h-8 px-2 border rounded text-sm"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const pg = parseInt(e.target.value, 10);
                          if (!isNaN(pg) && pg >= 1 && pg <= totalPages) {
                            handlePageChange(pg - 1);
                            e.target.value = '';
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </>
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      {showDetailModal && selectedOrder && selectedOrderDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-5xl max-h-full overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold">Chi tiết đơn hàng #{selectedOrder.orderId}</h2>
                  <div className="flex items-center space-x-3 mt-2">
                    <StatusBadge status={selectedOrder.orderStatus} />
                    <span className="text-sm text-gray-500">
                      {formatDate(selectedOrder.orderDate)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Order Info */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Order Items */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-4">Sản phẩm đã đặt</h3>
                    <div className="space-y-3">
                      {selectedOrderDetail.items?.map((item, index) => (
                        <div key={index} className="flex items-center justify-between bg-white p-3 rounded">
                          <div className="flex-1">
                            <div className="font-medium">{item.productName}</div>
                            <div className="text-sm text-gray-500">
                              {item.brandName} • {item.volume}ml
                            </div>
                          </div>
                          <div className="text-right font-medium">{item.quantity}</div>
                        </div>
                      )) || <p className="text-gray-500">Không có sản phẩm</p>}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-4">Tổng kết đơn hàng</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Tổng tiền hàng:</span>
                        <span className="font-medium">
                          {formatCurrency(selectedOrderDetail.totalAmount)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Phí vận chuyển:</span>
                        <span className="font-medium">
                          {formatCurrency(selectedOrder.shippingFee || 0)}
                        </span>
                      </div>
                      <div className="border-t pt-2">
                        <div className="flex justify-between text-lg font-bold">
                          <span>Tổng cộng:</span>
                          <span>
                            {formatCurrency(selectedOrderDetail.totalAmount + (selectedOrder.shippingFee || 0))}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                  
                  {/* Customer Info */}
                  <div className="bg-white border rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-3">Thông tin khách hàng</h3>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-gray-500">Mã khách hàng:</span>
                        <div className="font-medium">#{selectedOrder.customerId}</div>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Info */}
                  <div className="bg-white border rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-3">Thông tin giao hàng</h3>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-gray-500">Địa chỉ:</span>
                        <div className="font-medium">{selectedOrder.shippingAddress}</div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Phương thức:</span>
                        <div className="font-medium">{selectedOrder.shippingOption}</div>
                      </div>
                      {selectedOrder.estimatedDeliveryDate && (
                        <div>
                          <span className="text-sm text-gray-500">Dự kiến giao:</span>
                          <div className="font-medium">
                            {formatDate(selectedOrder.estimatedDeliveryDate)}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Payment Info */}
                  {selectedOrderDetail.payment && (
                    <div className="bg-white border rounded-lg p-4">
                      <h3 className="text-lg font-semibold mb-3">Thông tin thanh toán</h3>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm text-gray-500">Trạng thái:</span>
                          <div className="font-medium">{selectedOrderDetail.payment.paymentStatus}</div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Số tiền:</span>
                          <div className="font-medium">
                            {formatCurrency(selectedOrderDetail.payment.amount)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Shipment Info */}
                  {selectedOrderDetail.shipment && (
                    <div className="bg-white border rounded-lg p-4">
                      <h3 className="text-lg font-semibold mb-3">Thông tin vận chuyển</h3>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm text-gray-500">Trạng thái:</span>
                          <div className="font-medium">{selectedOrderDetail.shipment.shipmentStatus}</div>
                        </div>
                        {selectedOrderDetail.shipment.trackingNumber && (
                          <div>
                            <span className="text-sm text-gray-500">Mã vận đơn:</span>
                            <div className="font-medium">{selectedOrderDetail.shipment.trackingNumber}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  {selectedOrder.note && (
                    <div className="bg-white border rounded-lg p-4">
                      <h3 className="text-lg font-semibold mb-3">Ghi chú</h3>
                      <div className="text-sm text-gray-700">{selectedOrder.note}</div>
                    </div>
                  )}

                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-end">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {showStatusModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold">
                Cập nhật trạng thái đơn hàng #{selectedOrder.orderId}
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trạng thái hiện tại
                  </label>
                  <StatusBadge status={selectedOrder.orderStatus} />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trạng thái mới
                  </label>
                  <StatusBadge status={statusToUpdate} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lý do (tùy chọn)
                  </label>
                  <textarea
                    value={statusReason}
                    onChange={(e) => setStatusReason(e.target.value)}
                    placeholder="Nhập lý do cập nhật trạng thái..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowStatusModal(false);
                    setStatusToUpdate('');
                    setStatusReason('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={confirmStatusUpdate}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Xác nhận cập nhật
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Order Modal */}
      {showEditModal && selectedOrder && selectedOrderDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-full overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Chỉnh sửa đơn hàng #{selectedOrder.orderId}</h2>
              </div>
              
              {/* Tabs */}
              <div className="flex space-x-4 mt-4">
                <button
                  onClick={() => setEditingSection('items')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    editingSection === 'items' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Sản phẩm
                </button>
                <button
                  onClick={() => setEditingSection('payment')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    editingSection === 'payment' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Thanh toán
                </button>
                <button
                  onClick={() => setEditingSection('shipment')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    editingSection === 'shipment' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Vận chuyển
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Items Tab */}
              {editingSection === 'items' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Quản lý sản phẩm</h3>
                  <div className="space-y-3">
                    {selectedOrderDetail.items?.map((item, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium">{item.productName}</div>
                          <div className="text-sm text-gray-500">{item.brandName} • {item.volume}ml</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">Đơn giá</div>
                          <div className="font-semibold">{formatCurrency(item.unitPrice)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors">
                    + Thêm sản phẩm
                  </button>
                </div>
              )}

              {/* Payment Tab */}
              {editingSection === 'payment' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Thông tin thanh toán</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Trạng thái thanh toán
                      </label>
                      <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                        <option value="pending">Chờ thanh toán</option>
                        <option value="completed">Đã thanh toán</option>
                        <option value="failed">Thất bại</option>
                        <option value="refunded">Đã hoàn tiền</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số tiền
                      </label>
                      <input
                        type="number"
                        defaultValue={selectedOrderDetail.totalAmount}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mã giao dịch
                      </label>
                      <input
                        type="text"
                        placeholder="Nhập mã giao dịch"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ghi chú thanh toán
                      </label>
                      <textarea
                        placeholder="Ghi chú về thanh toán"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Shipment Tab */}
              {editingSection === 'shipment' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Thông tin vận chuyển</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nhà vận chuyển
                      </label>
                      <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                        <option value="GHTK">GHTK</option>
                        <option value="GrabExpress">GrabExpress</option>
                        <option value="Be Delivery">Be Delivery</option>
                        <option value="Self-pickup">Tự lấy</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mã vận đơn
                      </label>
                      <input
                        type="text"
                        placeholder="Nhập mã vận đơn"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phí vận chuyển
                      </label>
                      <input
                        type="number"
                        defaultValue={selectedOrder.shippingFee}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ngày giao dự kiến
                      </label>
                      <input
                        type="date"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Địa chỉ giao hàng
                      </label>
                      <textarea
                        defaultValue={selectedOrder.shippingAddress}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSaveChanges}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Lưu thay đổi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement; 