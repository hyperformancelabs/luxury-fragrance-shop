import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Edit, Trash2, Filter, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, MoreHorizontal, Upload, Download, XCircle, Check, X, FileEdit, Layers, PlusCircle, Clock, List, Settings, DollarSign, ArrowDown, ArrowUp, History, User, Phone, Mail, MapPin, Star, Award, CreditCard, ShoppingBag, MessageCircle, Heart } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { PageHeader, TableToolbar } from '../Components/common';

// Service cho customer management
const customerService = {
  getAllCustomers: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams(params);
      const response = await axios.get(`http://localhost:8080/api/v1/emp/customers?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  },

  searchCustomers: async (keyword, page = 0, size = 10) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/emp/customers/search?keyword=${keyword}&page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      console.error('Error searching customers:', error);
      throw error;
    }
  },

  getCustomerById: async (customerId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/emp/customers/${customerId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customer:', error);
      throw error;
    }
  },

  createCustomer: async (customerData) => {
    try {
      const response = await axios.post('http://localhost:8080/api/v1/emp/customers', customerData);
      return response.data;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  },

  updateCustomer: async (customerId, customerData) => {
    try {
      const response = await axios.put(`http://localhost:8080/api/v1/emp/customers/${customerId}`, customerData);
      return response.data;
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  },

  deleteCustomer: async (customerId) => {
    try {
      const response = await axios.delete(`http://localhost:8080/api/v1/emp/customers/${customerId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting customer:', error);
      throw error;
    }
  },

  updateCustomerStatus: async (customerId, status) => {
    try {
      const response = await axios.patch(`http://localhost:8080/api/v1/emp/customers/${customerId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating customer status:', error);
      throw error;
    }
  },

  updateCustomerRating: async (customerId, rating) => {
    try {
      const response = await axios.patch(`http://localhost:8080/api/v1/emp/customers/${customerId}/rating`, { rating });
      return response.data;
    } catch (error) {
      console.error('Error updating customer rating:', error);
      throw error;
    }
  },

  adjustLoyaltyPoints: async (customerId, delta) => {
    try {
      const response = await axios.patch(`http://localhost:8080/api/v1/emp/customers/${customerId}/loyalty-points`, { delta });
      return response.data;
    } catch (error) {
      console.error('Error adjusting loyalty points:', error);
      throw error;
    }
  },

  // Payment Methods APIs
  getPaymentMethods: async (customerId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/emp/customers/${customerId}/payment-methods`);
      return response.data;
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      throw error;
    }
  },

  addPaymentMethod: async (customerId, paymentData) => {
    try {
      const response = await axios.post(`http://localhost:8080/api/v1/emp/customers/${customerId}/payment-methods`, paymentData);
      return response.data;
    } catch (error) {
      console.error('Error adding payment method:', error);
      throw error;
    }
  },

  updatePaymentMethod: async (customerId, cpmId, paymentData) => {
    try {
      const response = await axios.put(`http://localhost:8080/api/v1/emp/customers/${customerId}/payment-methods/${cpmId}`, paymentData);
      return response.data;
    } catch (error) {
      console.error('Error updating payment method:', error);
      throw error;
    }
  },

  setDefaultPaymentMethod: async (customerId, cpmId) => {
    try {
      const response = await axios.patch(`http://localhost:8080/api/v1/emp/customers/${customerId}/payment-methods/${cpmId}/default`);
      return response.data;
    } catch (error) {
      console.error('Error setting default payment method:', error);
      throw error;
    }
  },

  deletePaymentMethod: async (customerId, cpmId) => {
    try {
      const response = await axios.delete(`http://localhost:8080/api/v1/emp/customers/${customerId}/payment-methods/${cpmId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting payment method:', error);
      throw error;
    }
  },

  // Order APIs
  getCustomerOrders: async (customerId, params = {}) => {
    try {
      const queryParams = new URLSearchParams({ customerId, ...params });
      const response = await axios.get(`http://localhost:8080/api/v1/emp/orders?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customer orders:', error);
      throw error;
    }
  },

  getOrderDetail: async (orderId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/emp/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order detail:', error);
      throw error;
    }
  },

  // Cart APIs
  getCustomerCarts: async (customerId, status = null, page = 0, size = 10) => {
    try {
      const params = new URLSearchParams({ page, size });
      if (status) params.append('status', status);
      const response = await axios.get(`http://localhost:8080/api/v1/emp/customers/${customerId}/carts?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customer carts:', error);
      throw error;
    }
  },

  getCartDetail: async (customerId, cartId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/emp/customers/${customerId}/carts/${cartId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching cart detail:', error);
      throw error;
    }
  },

  // Wishlist APIs
  getCustomerWishlist: async (customerId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/emp/customers/${customerId}/wishlist`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customer wishlist:', error);
      throw error;
    }
  },

  deleteWishlistItem: async (customerId, wishlistId) => {
    try {
      const response = await axios.delete(`http://localhost:8080/api/v1/emp/customers/${customerId}/wishlist/${wishlistId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting wishlist item:', error);
      throw error;
    }
  },

  // Conversation APIs
  getCustomerConversations: async (customerId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/emp/customers/${customerId}/conversations`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customer conversations:', error);
      throw error;
    }
  },

  getConversationDetail: async (customerId, convId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/emp/customers/${customerId}/conversations/${convId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching conversation detail:', error);
      throw error;
    }
  }
};

// Helper function to determine status color
const getStatusColor = (status) => {
  switch (status) {
    case 'active':
      return { text: 'text-green-600', bg: 'bg-green-50', weight: 'font-medium' };
    case 'inactive':
      return { text: 'text-gray-600', bg: 'bg-gray-50', weight: 'font-medium' };
    case 'banned':
      return { text: 'text-red-600', bg: 'bg-red-50', weight: 'font-medium' };
    default:
      return { text: 'text-gray-600', bg: 'bg-gray-50', weight: 'font-normal' };
  }
};

// Status Badge Component
const StatusBadge = ({ status }) => {
  const { text, bg, weight } = getStatusColor(status);
  
  const statusText = {
    active: 'Hoạt động',
    inactive: 'Không hoạt động',
    banned: 'Bị cấm'
  };
  
  return (
    <span className={`px-2 py-1 text-xs rounded-full ${text} ${bg} ${weight}`}>
      {statusText[status] || status}
    </span>
  );
};

// Rating Component
const RatingDisplay = ({ rating }) => {
  return (
    <div className="flex items-center">
      <Star className="w-4 h-4 text-yellow-400 fill-current" />
      <span className="ml-1 text-sm font-medium">{rating}/10</span>
    </div>
  );
};

// Helper function to get status configuration for filters
const getStatusConfig = (status) => {
  const statusConfigs = {
    active: { label: 'Hoạt động' },
    inactive: { label: 'Không hoạt động' },
    banned: { label: 'Bị cấm' }
  };
  return statusConfigs[status] || { label: status };
};

// Main Component
const Customer = () => {
  // State cho dữ liệu khách hàng
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State cho pagination
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  
  // State cho sắp xếp và lọc
  const [sortField, setSortField] = useState('createAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  
  // State cho modal và các thao tác
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState(null);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  
  // State cho form tạo/sửa khách hàng
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    username: '',
    password: '',
    street: '',
    ward: '',
    district: '',
    city: '',
    shippingNote: '',
    note: '',
    rating: 10,
    status: 'active',
    loyaltyPoints: 0
  });
  
  // State cho filters
  const [filters, setFilters] = useState({
    name: '',
    phone: '',
    email: '',
    status: ''
  });

  // Tính toán thống kê
  const [statsData, setStatsData] = useState({
    totalCustomers: 0,
    activeCustomers: 0,
    inactiveCustomers: 0,
    bannedCustomers: 0,
    totalLoyaltyPoints: 0
  });

  // State cho các tính năng nâng cao
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showPaymentMethodsModal, setShowPaymentMethodsModal] = useState(false);
  const [showOrderHistoryModal, setShowOrderHistoryModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [showWishlistModal, setShowWishlistModal] = useState(false);
  const [showConversationModal, setShowConversationModal] = useState(false);
  const [showQuickActionsModal, setShowQuickActionsModal] = useState(false);

  // Data cho các modal
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [customerCarts, setCustomerCarts] = useState([]);
  const [customerWishlist, setCustomerWishlist] = useState([]);
  const [customerConversations, setCustomerConversations] = useState([]);
  const [loadingModal, setLoadingModal] = useState(false);
  
  // Filter popup state
  const [showFilters, setShowFilters] = useState(false);
  const [filterAnchor, setFilterAnchor] = useState(null);

  // Load data functions
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        size: pageSize,
        sortBy: sortField,
        sortDir: sortDirection,
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v))
      };
      
      const response = await customerService.getAllCustomers(params);
      
      if (response.status === 'success' && response.data) {
        setCustomers(response.data.customers || []);
        setTotalPages(response.data.totalPages || 0);
        setTotalItems(response.data.totalElements || 0);
        updateStats(response.data.customers || []);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      setError('Không thể tải danh sách khách hàng');
      toast.error('Không thể tải danh sách khách hàng');
    } finally {
      setLoading(false);
    }
  };

  const updateStats = (customerList) => {
    const stats = {
      totalCustomers: customerList.length,
      activeCustomers: customerList.filter(c => c.status === 'active').length,
      inactiveCustomers: customerList.filter(c => c.status === 'inactive').length,
      bannedCustomers: customerList.filter(c => c.status === 'banned').length,
      totalLoyaltyPoints: customerList.reduce((sum, c) => sum + (c.loyaltyPoints || 0), 0)
    };
    setStatsData(stats);
  };

  // Event handlers
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setPage(0);
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ChevronUp size={16} className="ml-1" /> : 
      <ChevronDown size={16} className="ml-1" />;
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedCustomers(customers.map(c => c.customerId));
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

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      try {
        setLoading(true);
        const response = await customerService.searchCustomers(searchTerm, 0, pageSize);
        if (response.status === 'success' && response.data) {
          setCustomers(response.data.customers || []);
          setTotalPages(response.data.totalPages || 0);
          setTotalItems(response.data.totalElements || 0);
          updateStats(response.data.customers || []);
          setPage(0);
        }
      } catch (error) {
        console.error('Error searching customers:', error);
        toast.error('Lỗi khi tìm kiếm khách hàng');
      } finally {
        setLoading(false);
      }
    } else {
      fetchCustomers();
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // Filter handlers
  const handleFilterToggle = (e) => {
    setShowFilters(prev => !prev);
    const rect = e.target.getBoundingClientRect();
    setFilterAnchor({top: rect.bottom + window.scrollY + 6, left: rect.left + window.scrollX});
  };

  const applyFilters = () => {
    setPage(0);
    fetchCustomers();
  };

  const clearFilters = () => {
    setFilters({
      name: '',
      phone: '',
      email: '',
      status: ''
    });
    setPage(0);
    fetchCustomers();
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    
    // Xử lý array format từ backend [year, month, day, hour, minute, second, nano]
    if (Array.isArray(dateString)) {
      const [year, month, day, hour, minute] = dateString;
      return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year} ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    }
    
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatCurrency = (amount) => {
    if (!amount) return '0 VND';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getOrderStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-purple-100 text-purple-800';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCartStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'abandoned':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Effects
  useEffect(() => {
    fetchCustomers();
  }, [page, pageSize, sortField, sortDirection, filters]);

  // Form handlers
  const handleAddCustomer = () => {
    setCustomerToEdit(null);
    setFormData({
      name: '',
      phoneNumber: '',
      email: '',
      username: '',
      password: '',
      street: '',
      ward: '',
      district: '',
      city: '',
      shippingNote: '',
      note: '',
      rating: 10,
      status: 'active',
      loyaltyPoints: 0
    });
    setShowCustomerForm(true);
  };

  const handleEditCustomer = (customer) => {
    setCustomerToEdit(customer);
    setFormData({
      name: customer.name || '',
      phoneNumber: customer.phoneNumber || '',
      email: customer.email || '',
      username: customer.username || '',
      password: '',
      street: '',
      ward: '',
      district: '',
      city: '',
      shippingNote: '',
      note: '',
      rating: customer.rating || 10,
      status: customer.status || 'active',
      loyaltyPoints: customer.loyaltyPoints || 0
    });
    setShowCustomerForm(true);
  };

  const handleDeleteCustomer = (customer) => {
    setCustomerToDelete(customer);
    setShowDeleteConfirm(true);
  };

  const handleCloseForm = () => {
    setShowCustomerForm(false);
    setCustomerToEdit(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (customerToEdit) {
        // Update customer
        const response = await customerService.updateCustomer(customerToEdit.customerId, formData);
        if (response.status === 'success') {
          toast.success('Cập nhật khách hàng thành công');
          fetchCustomers();
          handleCloseForm();
        }
      } else {
        // Create customer
        const response = await customerService.createCustomer(formData);
        if (response.status === 'success') {
          toast.success('Tạo khách hàng thành công');
          fetchCustomers();
          handleCloseForm();
        }
      }
    } catch (error) {
      console.error('Error saving customer:', error);
      toast.error(customerToEdit ? 'Lỗi khi cập nhật khách hàng' : 'Lỗi khi tạo khách hàng');
    }
  };

  const confirmDelete = async () => {
    try {
      if (customerToDelete) {
        const response = await customerService.deleteCustomer(customerToDelete.customerId);
        if (response.status === 'success') {
          toast.success('Xóa khách hàng thành công');
          fetchCustomers();
          setShowDeleteConfirm(false);
          setCustomerToDelete(null);
        }
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast.error('Lỗi khi xóa khách hàng');
    }
  };

  const handleQuickStatusUpdate = async (customerId, newStatus) => {
    try {
      const response = await customerService.updateCustomerStatus(customerId, newStatus);
      if (response.status === 'success') {
        toast.success('Cập nhật trạng thái thành công');
        fetchCustomers();
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Lỗi khi cập nhật trạng thái');
    }
  };

  const handleQuickRatingUpdate = async (customerId, newRating) => {
    try {
      const response = await customerService.updateCustomerRating(customerId, newRating);
      if (response.status === 'success') {
        toast.success('Cập nhật đánh giá thành công');
        fetchCustomers();
      }
    } catch (error) {
      console.error('Error updating rating:', error);
      toast.error('Lỗi khi cập nhật đánh giá');
    }
  };

  const handleLoyaltyPointsAdjust = async (customerId, delta) => {
    try {
      const response = await customerService.adjustLoyaltyPoints(customerId, delta);
      if (response.status === 'success') {
        toast.success('Điều chỉnh điểm tích lũy thành công');
        fetchCustomers();
      }
    } catch (error) {
      console.error('Error adjusting loyalty points:', error);
      toast.error('Lỗi khi điều chỉnh điểm tích lũy');
    }
  };

  // Handlers cho các tính năng nâng cao
  const handleViewPaymentMethods = async (customer) => {
    setSelectedCustomer(customer);
    setLoadingModal(true);
    setShowPaymentMethodsModal(true);
    try {
      const response = await customerService.getPaymentMethods(customer.customerId);
      if (response.status === 'success') {
        setPaymentMethods(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      toast.error('Lỗi khi tải phương thức thanh toán');
    } finally {
      setLoadingModal(false);
    }
  };

  const handleViewOrderHistory = async (customer) => {
    setSelectedCustomer(customer);
    setLoadingModal(true);
    setShowOrderHistoryModal(true);
    try {
      const response = await customerService.getCustomerOrders(customer.customerId, { page: 0, size: 20 });
      if (response.status === 'success') {
        setCustomerOrders(response.data?.orders || []);
      }
    } catch (error) {
      console.error('Error fetching customer orders:', error);
      toast.error('Lỗi khi tải lịch sử đơn hàng');
    } finally {
      setLoadingModal(false);
    }
  };

  const handleViewCart = async (customer) => {
    setSelectedCustomer(customer);
    setLoadingModal(true);
    setShowCartModal(true);
    try {
      const response = await customerService.getCustomerCarts(customer.customerId);
      if (response.status === 'success') {
        setCustomerCarts(response.data?.carts || []);
      }
    } catch (error) {
      console.error('Error fetching customer carts:', error);
      toast.error('Lỗi khi tải giỏ hàng');
    } finally {
      setLoadingModal(false);
    }
  };

  const handleViewWishlist = async (customer) => {
    setSelectedCustomer(customer);
    setLoadingModal(true);
    setShowWishlistModal(true);
    try {
      const response = await customerService.getCustomerWishlist(customer.customerId);
      if (response.status === 'success') {
        setCustomerWishlist(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching customer wishlist:', error);
      toast.error('Lỗi khi tải wishlist');
    } finally {
      setLoadingModal(false);
    }
  };

  const handleViewConversations = async (customer) => {
    setSelectedCustomer(customer);
    setLoadingModal(true);
    setShowConversationModal(true);
    try {
      const response = await customerService.getCustomerConversations(customer.customerId);
      if (response.status === 'success') {
        setCustomerConversations(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching customer conversations:', error);
      toast.error('Lỗi khi tải cuộc trò chuyện');
    } finally {
      setLoadingModal(false);
    }
  };

  const handleQuickActions = (customer) => {
    setSelectedCustomer(customer);
    setShowQuickActionsModal(true);
  };

  // Customer Form Modal Component
  const CustomerFormModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {customerToEdit ? 'Chỉnh sửa khách hàng' : 'Thêm khách hàng mới'}
          </h2>
          <button
            onClick={handleCloseForm}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleFormSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên khách hàng *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số điện thoại *
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên tài khoản
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {!customerToEdit && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mật khẩu *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required={!customerToEdit}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trạng thái
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="active">Hoạt động</option>
                <option value="inactive">Không hoạt động</option>
                <option value="banned">Bị cấm</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Đánh giá (1-10)
              </label>
              <input
                type="number"
                name="rating"
                min="1"
                max="10"
                value={formData.rating}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Điểm tích lũy
              </label>
              <input
                type="number"
                name="loyaltyPoints"
                min="0"
                value={formData.loyaltyPoints}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Địa chỉ (Đường)
              </label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phường/Xã
              </label>
              <input
                type="text"
                name="ward"
                value={formData.ward}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quận/Huyện
              </label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tỉnh/Thành phố
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ghi chú giao hàng
              </label>
              <input
                type="text"
                name="shippingNote"
                value={formData.shippingNote}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ghi chú khác
              </label>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleFormChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={handleCloseForm}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {customerToEdit ? 'Cập nhật' : 'Tạo mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Delete Confirmation Modal
  const DeleteConfirmModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">Xác nhận xóa</h3>
            <p className="text-sm text-gray-500">
              Bạn có chắc chắn muốn xóa khách hàng "{customerToDelete?.name}"?
            </p>
          </div>
        </div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setShowDeleteConfirm(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            onClick={confirmDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );

  // Payment Methods Modal
  const PaymentMethodsModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            Phương thức thanh toán - {selectedCustomer?.name}
          </h2>
          <button
            onClick={() => setShowPaymentMethodsModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {loadingModal ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {paymentMethods.length === 0 ? (
              <div className="text-center py-8">
                <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có phương thức thanh toán</h3>
                <p className="mt-1 text-sm text-gray-500">Khách hàng chưa thêm phương thức thanh toán nào.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {paymentMethods.map((method) => (
                  <div key={method.cpmId} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <CreditCard className="h-8 w-8 text-blue-500 mr-3" />
                        <div>
                          <p className="font-medium">{method.cardType} **** {method.cardNumber?.slice(-4)}</p>
                          <p className="text-sm text-gray-500">
                            {method.cardHolderName} • Hết hạn: {method.expiryDate}
                          </p>
                          {method.isDefault && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Mặc định
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Edit size={16} />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // Order History Modal
  const OrderHistoryModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            Lịch sử đơn hàng - {selectedCustomer?.name}
          </h2>
          <button
            onClick={() => setShowOrderHistoryModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {loadingModal ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {customerOrders.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có đơn hàng</h3>
                <p className="mt-1 text-sm text-gray-500">Khách hàng chưa có đơn hàng nào.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã đơn</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày tạo</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tổng tiền</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {customerOrders.map((order) => (
                      <tr key={order.orderId}>
                        <td className="px-4 py-3 font-medium">#{order.orderId}</td>
                        <td className="px-4 py-3">{formatDate(order.orderDate)}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-xs rounded-full ${getOrderStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">{formatCurrency(order.totalAmount)}</td>
                        <td className="px-4 py-3">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Edit size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // Cart Modal
  const CartModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            Giỏ hàng - {selectedCustomer?.name}
          </h2>
          <button
            onClick={() => setShowCartModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {loadingModal ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {customerCarts.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Giỏ hàng trống</h3>
                <p className="mt-1 text-sm text-gray-500">Khách hàng chưa có sản phẩm nào trong giỏ hàng.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {customerCarts.map((cart) => (
                  <div key={cart.cartId} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Giỏ hàng #{cart.cartId}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${getCartStatusColor(cart.status)}`}>
                        {cart.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Tổng tiền: {formatCurrency(cart.totalAmount)}
                    </p>
                    <p className="text-sm text-gray-600">
                      Số sản phẩm: {cart.items?.length || 0}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // Wishlist Modal
  const WishlistModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            Danh sách yêu thích - {selectedCustomer?.name}
          </h2>
          <button
            onClick={() => setShowWishlistModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {loadingModal ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {customerWishlist.length === 0 ? (
              <div className="text-center py-8">
                <Heart className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Danh sách yêu thích trống</h3>
                <p className="mt-1 text-sm text-gray-500">Khách hàng chưa thêm sản phẩm nào vào danh sách yêu thích.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {customerWishlist.map((item) => (
                  <div key={item.wishlistId} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Heart className="h-8 w-8 text-pink-500 mr-3" />
                        <div>
                          <p className="font-medium">{item.productName}</p>
                          <p className="text-sm text-gray-500">
                            Thêm vào: {formatDate(item.addedDate)}
                          </p>
                        </div>
                      </div>
                      <button 
                        className="text-red-600 hover:text-red-900"
                        onClick={() => {
                          // Handle delete wishlist item
                          customerService.deleteWishlistItem(selectedCustomer.customerId, item.wishlistId)
                            .then(() => {
                              toast.success('Đã xóa khỏi danh sách yêu thích');
                              handleViewWishlist(selectedCustomer);
                            })
                            .catch(() => toast.error('Lỗi khi xóa'));
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // Conversation Modal
  const ConversationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            Cuộc trò chuyện - {selectedCustomer?.name}
          </h2>
          <button
            onClick={() => setShowConversationModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {loadingModal ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {customerConversations.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có cuộc trò chuyện</h3>
                <p className="mt-1 text-sm text-gray-500">Khách hàng chưa có cuộc trò chuyện nào.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {customerConversations.map((conversation) => (
                  <div key={conversation.conversationId} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <MessageCircle className="h-8 w-8 text-blue-500 mr-3" />
                        <div>
                          <p className="font-medium">{conversation.subject || 'Không có tiêu đề'}</p>
                          <p className="text-sm text-gray-500">
                            Bắt đầu: {formatDate(conversation.startDate)}
                          </p>
                          <p className="text-sm text-gray-500">
                            Trạng thái: {conversation.status}
                          </p>
                        </div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-900">
                        <Edit size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // Quick Actions Modal
  const QuickActionsModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            Thao tác nhanh - {selectedCustomer?.name}
          </h2>
          <button
            onClick={() => setShowQuickActionsModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-3">
          <div className="border-b pb-3">
            <h3 className="font-medium mb-2">Cập nhật trạng thái</h3>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  handleQuickStatusUpdate(selectedCustomer.customerId, 'active');
                  setShowQuickActionsModal(false);
                }}
                className="px-3 py-2 text-sm bg-green-100 text-green-800 rounded hover:bg-green-200"
              >
                Hoạt động
              </button>
              <button
                onClick={() => {
                  handleQuickStatusUpdate(selectedCustomer.customerId, 'inactive');
                  setShowQuickActionsModal(false);
                }}
                className="px-3 py-2 text-sm bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
              >
                Tạm ngưng
              </button>
              <button
                onClick={() => {
                  handleQuickStatusUpdate(selectedCustomer.customerId, 'banned');
                  setShowQuickActionsModal(false);
                }}
                className="px-3 py-2 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200"
              >
                Cấm
              </button>
            </div>
          </div>

          <div className="border-b pb-3">
            <h3 className="font-medium mb-2">Điều chỉnh đánh giá</h3>
            <div className="grid grid-cols-5 gap-1">
              {[...Array(10)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    handleQuickRatingUpdate(selectedCustomer.customerId, i + 1);
                    setShowQuickActionsModal(false);
                  }}
                  className="px-2 py-1 text-sm bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="border-b pb-3">
            <h3 className="font-medium mb-2">Điều chỉnh điểm tích lũy</h3>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  handleLoyaltyPointsAdjust(selectedCustomer.customerId, 50);
                  setShowQuickActionsModal(false);
                }}
                className="px-3 py-2 text-sm bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
              >
                +50
              </button>
              <button
                onClick={() => {
                  handleLoyaltyPointsAdjust(selectedCustomer.customerId, 100);
                  setShowQuickActionsModal(false);
                }}
                className="px-3 py-2 text-sm bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
              >
                +100
              </button>
              <button
                onClick={() => {
                  handleLoyaltyPointsAdjust(selectedCustomer.customerId, -50);
                  setShowQuickActionsModal(false);
                }}
                className="px-3 py-2 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200"
              >
                -50
              </button>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Thao tác khác</h3>
            <div className="space-y-2">
              <button
                onClick={() => {
                  setShowQuickActionsModal(false);
                  handleEditCustomer(selectedCustomer);
                }}
                className="w-full px-3 py-2 text-sm text-left bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
              >
                Chỉnh sửa thông tin
              </button>
              <button
                onClick={() => {
                  setShowQuickActionsModal(false);
                  handleViewPaymentMethods(selectedCustomer);
                }}
                className="w-full px-3 py-2 text-sm text-left bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
              >
                Xem phương thức thanh toán
              </button>
              <button
                onClick={() => {
                  setShowQuickActionsModal(false);
                  handleViewOrderHistory(selectedCustomer);
                }}
                className="w-full px-3 py-2 text-sm text-left bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
              >
                Xem lịch sử đơn hàng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <Toaster position="top-right" />
      
      {/* Header */}
      <PageHeader title="Quản lý khách hàng" subtitle="Quản lý hồ sơ và trạng thái khách hàng" />

      <div className="mt-6">
        {/* Toolbar wrapper */}
        <div className="bg-white rounded-lg shadow mb-6">
          <TableToolbar
            searchValue={searchTerm}
            onSearchChange={(e) => setSearchTerm(e.target.value)}
            onSearchSubmit={handleSearch}
            onFilter={handleFilterToggle}
            addLabel="Thêm khách hàng"
            onAdd={handleAddCustomer}
            placeholder="Tìm theo tên, SĐT, email..."
          />
        </div>

        {/* Filter Popup */}
        {showFilters && (
          <div className="fixed z-50 bg-white border rounded-md shadow-lg p-4" style={{top: filterAnchor?.top, left: filterAnchor?.left, width: '300px'}}>
            <h4 className="font-medium mb-2 flex items-center"><Filter size={16} className="mr-2" /> Bộ lọc</h4>
            
            {/* Status checkboxes */}
            <div className="mb-3">
              <p className="text-sm font-semibold mb-1">Trạng thái</p>
              {['active','inactive','banned'].map(st=> (
                <label key={st} className="flex items-center text-sm space-x-2 mb-1">
                  <input
                    type="checkbox"
                    checked={filters.status===st}
                    onChange={()=> setFilters(prev=> ({...prev, status: prev.status===st? '' : st}))}
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

        {/* Customer Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center py-8 text-red-600">
              {error}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          onChange={handleSelectAll}
                          checked={selectedCustomers.length === customers.length && customers.length > 0}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('name')}
                      >
                        <div className="flex items-center">
                          Khách hàng
                          {getSortIcon('name')}
                        </div>
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('phoneNumber')}
                      >
                        <div className="flex items-center">
                          Liên hệ
                          {getSortIcon('phoneNumber')}
                        </div>
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('rating')}
                      >
                        <div className="flex items-center">
                          Đánh giá
                          {getSortIcon('rating')}
                        </div>
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('loyaltyPoints')}
                      >
                        <div className="flex items-center">
                          Điểm tích lũy
                          {getSortIcon('loyaltyPoints')}
                        </div>
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('status')}
                      >
                        <div className="flex items-center">
                          Trạng thái
                          {getSortIcon('status')}
                        </div>
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('createAt')}
                      >
                        <div className="flex items-center">
                          Ngày tạo
                          {getSortIcon('createAt')}
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {customers.map((customer) => (
                      <tr key={customer.customerId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedCustomers.includes(customer.customerId)}
                            onChange={() => handleSelectCustomer(customer.customerId)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <User className="h-6 w-6 text-gray-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                              <div className="text-sm text-gray-500">@{customer.username || 'N/A'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 max-w-xs whitespace-normal break-words">
                          <div className="text-sm text-gray-900">
                            <div className="flex items-center mb-1">
                              <Phone className="h-4 w-4 text-gray-400 mr-2" />
                              {customer.phoneNumber}
                            </div>
                            <div className="flex items-center">
                              <Mail className="h-4 w-4 text-gray-400 mr-2" />
                              {customer.email}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <RatingDisplay rating={customer.rating} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Award className="h-4 w-4 text-purple-500 mr-2" />
                            <span className="text-sm font-medium text-gray-900">{customer.loyaltyPoints}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={customer.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(customer.createAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button 
                              className="text-green-600 hover:text-green-900"
                              onClick={() => handleViewPaymentMethods(customer)}
                              title="Phương thức thanh toán"
                            >
                              <CreditCard size={16} />
                            </button>
                            <button 
                              className="text-purple-600 hover:text-purple-900"
                              onClick={() => handleViewOrderHistory(customer)}
                              title="Lịch sử đơn hàng"
                            >
                              <ShoppingBag size={16} />
                            </button>
                            <button 
                              className="text-yellow-600 hover:text-yellow-900"
                              onClick={() => handleViewCart(customer)}
                              title="Giỏ hàng"
                            >
                              <ShoppingBag size={16} />
                            </button>
                            <button 
                              className="text-pink-600 hover:text-pink-900"
                              onClick={() => handleViewWishlist(customer)}
                              title="Wishlist"
                            >
                              <Heart size={16} />
                            </button>
                            <button 
                              className="text-orange-600 hover:text-orange-900"
                              onClick={() => handleViewConversations(customer)}
                              title="Cuộc trò chuyện"
                            >
                              <MessageCircle size={16} />
                            </button>
                            <button 
                              className="text-gray-600 hover:text-gray-900"
                              onClick={() => handleQuickActions(customer)}
                              title="Thao tác nhanh"
                            >
                              <MoreHorizontal size={16} />
                            </button>
                            {selectedCustomers.length > 0 && (
                              <>
                                <button 
                                  className="text-blue-600 hover:text-blue-900"
                                  onClick={() => handleEditCustomer(customer)}
                                  title="Chỉnh sửa"
                                >
                                  <Edit size={16} />
                                </button>
                                <button 
                                  className="text-red-600 hover:text-red-900"
                                  onClick={() => handleDeleteCustomer(customer)}
                                  title="Xóa"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {!loading && customers.length > 0 && (
                <div className="px-4 py-3 flex flex-col md:flex-row md:justify-between border-t gap-3 bg-white">
                  <div className="flex items-center text-sm text-gray-500 flex-wrap gap-2">
                    <span>Hiển thị</span>
                    <select
                      value={pageSize}
                      onChange={(e)=>{setPageSize(Number(e.target.value)); setPage(0);}}
                      className="px-1 py-1 text-sm border rounded"
                    >
                      {[10,20,50,100,200,500].map(size => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                      <option value={totalItems}>Tất cả</option>
                    </select>
                    <span>mỗi trang trong {totalItems} khách hàng</span>
                  </div>

                  <div className="flex justify-between md:justify-end items-center space-x-2">
                    <div className="flex items-center">
                      <button
                        onClick={()=>handlePageChange(page -1)}
                        disabled={page===0}
                        className={`px-2 py-1 border rounded ${page===0?'text-gray-400 cursor-not-allowed':'hover:bg-gray-50'}`}
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <div className="flex items-center mx-1">
                        <button className={`px-3 py-1 border rounded ${page===0?'bg-blue-600 text-white':'hover:bg-gray-50'}`} onClick={()=>handlePageChange(0)}>1</button>
                        {page+1 > 3 && <span className="px-1">...</span>}
                        {Array.from({length: totalPages}).map((_,i)=>{
                          if(i!==0 && i!== totalPages-1){
                            if(Math.abs((page+1)-(i+1))<=1){
                              return (
                                <button key={i} className={`px-3 py-1 border rounded ${(page)===i?'bg-blue-600 text-white':'hover:bg-gray-50'}`} onClick={()=>handlePageChange(i)}>{i+1}</button>
                              );
                            }
                          }
                          return null;
                        })}
                        {page+1 < totalPages-2 && <span className="px-1">...</span>}
                        {totalPages>1 && (
                          <button className={`px-3 py-1 border rounded ${(page)===totalPages-1?'bg-blue-600 text-white':'hover:bg-gray-50'}`} onClick={()=>handlePageChange(totalPages-1)}>{totalPages}</button>
                        )}
                      </div>
                      <button
                        onClick={()=>handlePageChange(page+1)}
                        disabled={page>=totalPages-1}
                        className={`px-2 py-1 border rounded ${page>=totalPages-1?'text-gray-400 cursor-not-allowed':'hover:bg-gray-50'}`}
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>
                    <div className="inline-flex items-center ml-1">
                      <span className="mr-1 text-sm whitespace-nowrap">Đến trang:</span>
                      <input
                        type="number"
                        min="1"
                        max={totalPages}
                        className="w-14 h-8 px-2 border rounded text-sm"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const num = parseInt(e.target.value, 10);
                            if (!isNaN(num) && num >= 1 && num <= totalPages) {
                              handlePageChange(num - 1);
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

      {/* Modals */}
      {showCustomerForm && <CustomerFormModal />}
      {showDeleteConfirm && <DeleteConfirmModal />}
      {showPaymentMethodsModal && <PaymentMethodsModal />}
      {showOrderHistoryModal && <OrderHistoryModal />}
      {showCartModal && <CartModal />}
      {showWishlistModal && <WishlistModal />}
      {showConversationModal && <ConversationModal />}
      {showQuickActionsModal && <QuickActionsModal />}
    </div>
  );
};

export default Customer;