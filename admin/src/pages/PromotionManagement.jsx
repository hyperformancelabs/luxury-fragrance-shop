import React, { useState, useEffect } from 'react';
import { Edit, Trash2, ChevronDown, ChevronUp, Check, TrendingUp, Users, ShoppingBag, Clock } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import promotionService from '../services/promotionService';
import { PageHeader, TableToolbar, DataTable, PaginationFooter } from '../Components/common';

// Helper function to get status badge styling
const getStatusBadge = (status) => {
  const statusConfig = {
    'active': { text: 'text-green-600', bg: 'bg-green-50', label: 'Đang hoạt động' },
    'inactive': { text: 'text-yellow-600', bg: 'bg-yellow-50', label: 'Tạm dừng' },
    'planned': { text: 'text-blue-600', bg: 'bg-blue-50', label: 'Dự kiến' },
    'completed': { text: 'text-gray-600', bg: 'bg-gray-50', label: 'Đã kết thúc' },
    'expired': { text: 'text-red-600', bg: 'bg-red-50', label: 'Hết hạn' }
  };
  
  const config = statusConfig[status] || statusConfig.inactive;
  return (
    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${config.text} ${config.bg}`}>
      {config.label}
    </span>
  );
};

// Helper function to format price
const formatPrice = (price) => {
  if (!price) return '0 VNĐ';
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND' 
  }).format(price);
};

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('vi-VN');
};

// Component chính
const PromotionManagement = () => {
  // State cho dữ liệu khuyến mãi
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State cho pagination
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  
  // State cho sắp xếp và lọc
  const [sortField, setSortField] = useState('promotionId');
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // State cho modal và các thao tác
  const [selectedPromotions, setSelectedPromotions] = useState([]);
  const [showPromotionForm, setShowPromotionForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [promotionToEdit, setPromotionToEdit] = useState(null);
  const [promotionToDelete, setPromotionToDelete] = useState(null);
  
  // State cho form
  const [formData, setFormData] = useState({
    promotionName: '',
    description: '',
    startDate: '',
    endDate: '',
    discountType: 'percentage',
    discountValue: '',
    status: 'planned',
    usageLimit: ''
  });

  // State cho thống kê
  const [statsData, setStatsData] = useState({
    totalPromotions: 0,
    activePromotions: 0,
    totalDiscount: 0,
    usageCount: 0
  });

  // Fetch promotions
  const fetchPromotions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filters = {};
      if (searchTerm) filters.promotionName = searchTerm;
      if (statusFilter) filters.status = statusFilter;
      
      const response = await promotionService.getAllPromotions(page, pageSize, sortField, sortDirection, filters);
      
      if (response && response.status === 'success' && response.data) {
        setPromotions(response.data.promotions || []);
        setTotalPages(response.data.totalPages || 0);
        setTotalItems(response.data.totalElements || 0);
      } else {
        setPromotions([]);
        toast.error('Không thể tải danh sách khuyến mãi');
      }
    } catch (error) {
      console.error('Error fetching promotions:', error);
      setError(error.message);
      toast.error('Lỗi khi tải danh sách khuyến mãi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch data on component mount and when dependencies change
  useEffect(() => {
    fetchPromotions();
  }, [page, pageSize, sortField, sortDirection, searchTerm, statusFilter]);

  // Update stats when promotions change
  useEffect(() => {
    updateStats();
  }, [promotions]);

  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setPage(0); // Reset to first page when sorting
  };

  // Get sort icon
  const getSortIcon = (field) => {
    if (sortField !== field) return <ChevronDown size={16} className="text-gray-400" />;
    return sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
  };

  // Handle select all
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedPromotions(promotions.map(p => p.promotionId));
    } else {
      setSelectedPromotions([]);
    }
  };

  // Handle select promotion
  const handleSelectPromotion = (id) => {
    setSelectedPromotions(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  // Handle search submit from TableToolbar
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    fetchPromotions();
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // Update stats
  const updateStats = () => {
    const stats = {
      totalPromotions: promotions.length,
      activePromotions: promotions.filter(p => p.status === 'active').length,
      totalDiscount: promotions.reduce((sum, p) => sum + (p.discountValue || 0), 0),
      usageCount: promotions.reduce((sum, p) => sum + (p.usageLimit || 0), 0)
    };
    setStatsData(stats);
  };

  // Handle add promotion
  const handleAddPromotion = () => {
    setPromotionToEdit(null);
    setFormData({
      promotionName: '',
      description: '',
      startDate: '',
      endDate: '',
      discountType: 'percentage',
      discountValue: '',
      status: 'planned',
      usageLimit: ''
    });
    setShowPromotionForm(true);
  };

  // Handle edit promotion
  const handleEditPromotion = (promotion) => {
    setPromotionToEdit(promotion);
    setFormData({
      promotionName: promotion.promotionName || '',
      description: promotion.description || '',
      startDate: promotion.startDate || '',
      endDate: promotion.endDate || '',
      discountType: promotion.discountType || 'percentage',
      discountValue: promotion.discountValue || '',
      status: promotion.status || 'planned',
      usageLimit: promotion.usageLimit || ''
    });
    setShowPromotionForm(true);
  };

  // Handle delete promotion
  const handleDeletePromotion = (promotion) => {
    setPromotionToDelete(promotion);
    setShowDeleteConfirm(true);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Toaster position="top-right" />
      
      <PageHeader title="Quản lý khuyến mãi">
        <button
          onClick={() => fetchPromotions()}
          className="text-blue-600 hover:text-blue-800 rounded-full p-1 hover:bg-blue-50 transition-colors"
          title="Làm mới dữ liệu"
        >
          <Clock size={20} />
        </button>
      </PageHeader>

      <div className="px-6 py-4 mt-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng khuyến mãi</p>
                <p className="text-2xl font-semibold text-gray-900">{statsData.totalPromotions}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Đang hoạt động</p>
                <p className="text-2xl font-semibold text-gray-900">{statsData.activePromotions}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <ShoppingBag className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng giá trị giảm</p>
                <p className="text-2xl font-semibold text-gray-900">{formatPrice(statsData.totalDiscount)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <Users className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Giới hạn sử dụng</p>
                <p className="text-2xl font-semibold text-gray-900">{statsData.usageCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Unified Table Toolbar */}
        <TableToolbar
          searchValue={searchTerm}
          onSearchChange={(e) => setSearchTerm(e.target.value)}
          onSearchSubmit={handleSearchSubmit}
          addLabel="Thêm khuyến mãi"
          onAdd={handleAddPromotion}
          extraActions={
            <>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(0);
                }}
                className="border border-gray-300 rounded px-3 py-2 text-sm"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="active">Đang hoạt động</option>
                <option value="inactive">Tạm dừng</option>
                <option value="planned">Dự kiến</option>
                <option value="completed">Đã kết thúc</option>
                <option value="expired">Hết hạn</option>
              </select>
              <button
                className={`border px-4 py-2 rounded-lg flex items-center ${selectedPromotions.length > 0 ? 'text-red-600 border-red-300' : 'text-gray-400 border-gray-200 cursor-not-allowed'}`}
                disabled={selectedPromotions.length === 0}
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 size={18} className="mr-1" />
                Xóa {selectedPromotions.length > 0 && `(${selectedPromotions.length})`}
              </button>
            </>
          }
        />

        {/* Promotions Table */}
        <DataTable
          footer={
            totalPages > 1 && (
              <PaginationFooter
                page={page + 1}
                pageSize={pageSize}
                totalItems={totalItems}
                onPageChange={(p) => handlePageChange(p - 1)}
              />
            )
          }
        >
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedPromotions.length === promotions.length && promotions.length > 0}
                  className="rounded border-gray-300"
                />
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('promotionName')}
              >
                <div className="flex items-center">
                  Tên khuyến mãi
                  {getSortIcon('promotionName')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('discountType')}
              >
                <div className="flex items-center">
                  Loại giảm giá
                  {getSortIcon('discountType')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('discountValue')}
              >
                <div className="flex items-center">
                  Giá trị
                  {getSortIcon('discountValue')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('startDate')}
              >
                <div className="flex items-center">
                  Thời gian
                  {getSortIcon('startDate')}
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2">Đang tải...</span>
                  </div>
                </td>
              </tr>
            ) : promotions.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                  Không có khuyến mãi nào
                </td>
              </tr>
            ) : (
              promotions.map((promotion) => (
                <tr key={promotion.promotionId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedPromotions.includes(promotion.promotionId)}
                      onChange={() => handleSelectPromotion(promotion.promotionId)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{promotion.promotionName}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">{promotion.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {promotion.discountType === 'percentage' ? 'Phần trăm' : 'Số tiền cố định'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {promotion.discountType === 'percentage' 
                      ? `${promotion.discountValue}%` 
                      : formatPrice(promotion.discountValue)
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{formatDate(promotion.startDate)} - {formatDate(promotion.endDate)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(promotion.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditPromotion(promotion)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeletePromotion(promotion)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </DataTable>
      </div>
    </div>
  );
};

export default PromotionManagement; 