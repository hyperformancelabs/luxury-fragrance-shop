import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Plus, 
  Trash2, 
  Edit, 
  Eye,
  Filter,
  Download,
  TrendingUp,
  Target,
  DollarSign,
  Users,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { toast } from 'react-toastify';
import promotionService from '../services/promotionService';
import PromotionFormModal from '../Components/PromotionFormModal';
import PromotionDetailModal from '../Components/PromotionDetailModal';
import { PageHeader } from '../Components/common';

const Marketing = () => {
  // State management
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPromotions, setSelectedPromotions] = useState([]);
  const [sortBy, setSortBy] = useState('promotionName');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [promotionToEdit, setPromotionToEdit] = useState(null);
  const [promotionToView, setPromotionToView] = useState(null);
  
  // Lấy ngày hôm nay định dạng yyyy-mm-dd
  const today = new Date().toISOString().split('T')[0];

  // Form data
  const [formData, setFormData] = useState({
    promotionName: '',
    description: '',
    startDate: today,
    endDate: '',
    discountType: 'percentage',
    discountValue: '',
    status: 'inactive',
    usageLimit: ''
  });

  // Stats
  const [stats, setStats] = useState({
    totalPromotions: 0,
    activePromotions: 0,
    totalDiscountValue: 0,
    totalUsageLimit: 0
  });

  // Filter state
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef(null);
  const [filterDiscountTypes, setFilterDiscountTypes] = useState([]);
  const [filterStatuses, setFilterStatuses] = useState([]);

  // Load data on component mount
  useEffect(() => {
    loadPromotions();
  }, []);

  // Calculate stats when promotions change
  useEffect(() => {
    calculateStats();
  }, [promotions]);

  // Close filter popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const loadPromotions = async () => {
    try {
      setLoading(true);
      const data = await promotionService.getAllPromotions();
      console.log('Loaded promotions data:', data);
      setPromotions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading promotions:', error);
      toast.error('Không thể tải danh sách khuyến mãi. Vui lòng thử lại.');
      setPromotions([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const totalPromotions = promotions.length;
    const activePromotions = promotions.filter(p => p.status === 'active').length;
    const totalDiscountValue = promotions.reduce((sum, p) => {
      if (p.discountType === 'fixed_amount') {
        return sum + (p.discountValue || 0);
      }
      return sum;
    }, 0);
    const totalUsageLimit = promotions.reduce((sum, p) => sum + (p.usageLimit || 0), 0);

    setStats({
      totalPromotions,
      activePromotions,
      totalDiscountValue,
      totalUsageLimit
    });
  };

  // Form handlers
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Validate form
      if (!formData.promotionName?.trim()) {
        toast.error('Vui lòng nhập tên khuyến mãi');
        return;
      }
      
      // endDate và usageLimit đều không bắt buộc; cho phép đồng thời để trống

      if (formData.endDate) {
        if (new Date(formData.endDate) <= new Date(formData.startDate)) {
          toast.error('Ngày kết thúc phải sau ngày bắt đầu');
          return;
        }
      }

      // discount value validation
      if (formData.discountType !== 'free_shipping') {
        if (!formData.discountValue || formData.discountValue <= 0) {
          toast.error('Vui lòng nhập giá trị giảm giá hợp lệ');
          return;
        }
        if (formData.discountType === 'percentage' && formData.discountValue > 100) {
          toast.error('Giá trị giảm giá không được vượt quá 100%');
          return;
        }
      }

      // Prepare data for API
      const promotionData = {
        ...formData,
        // Nếu free ship, discountValue = null
        discountValue: formData.discountType === 'free_shipping' ? null : parseFloat(formData.discountValue),
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
      };

      if (promotionToEdit) {
        // Update existing promotion
        await promotionService.updatePromotion(promotionToEdit.id, promotionData);
        toast.success('Cập nhật khuyến mãi thành công!');
    } else {
        // Create new promotion
        await promotionService.createPromotion(promotionData);
        toast.success('Tạo khuyến mãi thành công!');
      }

      // Reset form and close modal
      resetForm();
      setIsFormModalOpen(false);
      await loadPromotions();
    } catch (error) {
      console.error('Error saving promotion:', error);
      toast.error(promotionToEdit ? 'Không thể cập nhật khuyến mãi' : 'Không thể tạo khuyến mãi');
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      promotionName: '',
      description: '',
      startDate: today,
      endDate: '',
      discountType: 'percentage',
      discountValue: '',
      status: 'inactive',
      usageLimit: ''
    });
    setPromotionToEdit(null);
  };

  // Modal handlers
  const handleAddPromotion = () => {
    resetForm();
    setIsFormModalOpen(true);
  };

  const handleEditPromotion = (promotion) => {
    setFormData({
      promotionName: promotion.promotionName || '',
      description: promotion.description || '',
      startDate: promotion.startDate ? promotion.startDate.split('T')[0] : '',
      endDate: promotion.endDate ? promotion.endDate.split('T')[0] : '',
      discountType: promotion.discountType || 'percentage',
      discountValue: promotion.discountValue || '',
      status: promotion.status || 'inactive',
      usageLimit: promotion.usageLimit || ''
    });
    setPromotionToEdit(promotion);
    setIsFormModalOpen(true);
  };

  const handleViewPromotion = (promotion) => {
    setPromotionToView(promotion);
    setIsDetailModalOpen(true);
  };

  const handleDeletePromotions = async () => {
    if (selectedPromotions.length === 0) {
      toast.warning('Vui lòng chọn khuyến mãi cần xóa');
      return;
    }

    if (!window.confirm(`Bạn có chắc muốn xóa ${selectedPromotions.length} khuyến mãi đã chọn?`)) {
      return;
    }

    try {
      await Promise.all(
        selectedPromotions.map(id => promotionService.deletePromotion(id))
      );
      toast.success(`Đã xóa ${selectedPromotions.length} khuyến mãi`);
      setSelectedPromotions([]);
      await loadPromotions();
    } catch (error) {
      console.error('Error deleting promotions:', error);
      toast.error('Không thể xóa khuyến mãi');
    }
  };

  // Table handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedPromotions(filteredPromotions.map(p => p.id));
    } else {
      setSelectedPromotions([]);
    }
  };

  const handleSelectPromotion = (promotionId) => {
    setSelectedPromotions(prev => {
      if (prev.includes(promotionId)) {
        return prev.filter(id => id !== promotionId);
      } else {
        return [...prev, promotionId];
      }
    });
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Filter and sort promotions
  const filteredPromotions = promotions.filter(promotion => {
    const matchesSearch = promotion.promotionName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         promotion.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatusSelect = statusFilter === 'all' || promotion.status === statusFilter;
    const matchesDiscountType = filterDiscountTypes.length === 0 || filterDiscountTypes.includes(promotion.discountType);
    const matchesStatusPopup = filterStatuses.length === 0 || filterStatuses.includes(promotion.status);
    return matchesSearch && matchesStatusSelect && matchesDiscountType && matchesStatusPopup;
  });

  const sortedPromotions = [...filteredPromotions].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    // Handle date fields
    if (sortBy === 'startDate' || sortBy === 'endDate') {
      aValue = aValue ? new Date(aValue).getTime() : 0;
      bValue = bValue ? new Date(bValue).getTime() : 0;
    } else if (typeof aValue === 'string' && typeof bValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedPromotions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPromotions = sortedPromotions.slice(startIndex, startIndex + itemsPerPage);

  // Helper functions
  const formatPrice = (price) => {
    if (!price && price !== 0) return '0 VNĐ';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Không xác định';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { bg: 'bg-green-100', text: 'text-green-800', label: 'Đang hoạt động' },
      inactive: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Tạm dừng' },
      expired: { bg: 'bg-red-100', text: 'text-red-800', label: 'Hết hạn' }
    };

    const config = statusConfig[status] || statusConfig.inactive;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getDiscountDisplay = (type, value) => {
    if (type === 'free_shipping') return 'Free ship';
    if (type === 'percentage') {
      return `${value}%`;
    }
    return formatPrice(value);
  };

  return (
    <div className="p-6">
      <PageHeader title="Quản lý khuyến mãi" subtitle="Tạo và quản lý các chiến dịch khuyến mãi cho cửa hàng" />
      
      {/* Stats Cards */}
      {/* Stats Cards removed as per new requirements */}
      
      {/* Action Bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 mt-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          {/* Left side - search & filter */}
          <div className="flex flex-1 items-center space-x-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Tìm kiếm khuyến mãi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter button */}
            <div className="relative" ref={filterRef}>
              <button
                type="button"
                onClick={() => setFilterOpen(!filterOpen)}
                className="p-2 border border-gray-300 rounded-md hover:bg-gray-100 bg-white"
                title="Bộ lọc"
              >
                <Filter size={18} />
              </button>

              {filterOpen && (
                <div
                  className="fixed mt-2 w-72 bg-white border rounded-md shadow-lg z-[999] p-4 space-y-4"
                  style={{
                    top: filterRef.current ? filterRef.current.getBoundingClientRect().bottom + 5 : 0,
                    left: filterRef.current ? filterRef.current.getBoundingClientRect().left : 0
                  }}
                >
                  {/* Discount Type Filter */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium">Loại giảm giá</h4>
                      <button
                        onClick={() => setFilterDiscountTypes([])}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Bỏ chọn tất cả
                      </button>
                    </div>
                    <div className="space-y-1">
                      {['percentage','fixed_amount','free_shipping'].map(t => (
                        <label key={t} className="flex items-center text-sm space-x-2">
                          <input
                            type="checkbox"
                            checked={filterDiscountTypes.includes(t)}
                            onChange={() => {
                              setFilterDiscountTypes(prev => prev.includes(t) ? prev.filter(x=>x!==t) : [...prev, t]);
                            }}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span>{t === 'percentage' ? '% Phần trăm' : t === 'fixed_amount' ? 'Số tiền' : 'Free ship'}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium">Trạng thái</h4>
                      <button
                        onClick={() => setFilterStatuses([])}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Bỏ chọn tất cả
                      </button>
                    </div>
                    <div className="space-y-1">
                      {[{value:'active',label:'Đang hoạt động'},{value:'inactive',label:'Tạm dừng'},{value:'expired',label:'Hết hạn'}].map(s=> (
                        <label key={s.value} className="flex items-center text-sm space-x-2">
                          <input
                            type="checkbox"
                            checked={filterStatuses.includes(s.value)}
                            onChange={() => {
                              setFilterStatuses(prev=> prev.includes(s.value)? prev.filter(x=>x!==s.value): [...prev, s.value]);
                            }}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span>{s.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Close button */}
                  <div className="text-right">
                    <button onClick={() => setFilterOpen(false)} className="text-sm text-blue-600 hover:text-blue-800">
                      Đóng
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right side - action buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={handleAddPromotion}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus size={16} className="mr-2" />
              Thêm khuyến mãi
            </button>
            {selectedPromotions.length > 0 && (
              <button
                onClick={handleDeletePromotions}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <Trash2 size={16} className="mr-2" />
                Xóa ({selectedPromotions.length})
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Promotions Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Đang tải...</span>
        </div>
        ) : paginatedPromotions.length === 0 ? (
          <div className="text-center py-12">
            <Target size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có khuyến mãi nào</h3>
            <p className="text-gray-500 mb-4">Bắt đầu bằng cách tạo khuyến mãi đầu tiên của bạn</p>
            <button
              onClick={handleAddPromotion}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
            >
              <Plus size={16} className="mr-2" />
              Thêm khuyến mãi
            </button>
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
                        checked={selectedPromotions.length === paginatedPromotions.length && paginatedPromotions.length > 0}
                        onChange={handleSelectAll}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
          </th>
          <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('promotionName')}
          >
                      Tên khuyến mãi
          </th>
          <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('discountValue')}
          >
                      Giảm giá
          </th>
          <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            onClick={() => handleSort('startDate')}
          >
                      Thời gian
          </th>
          <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('status')}
          >
                      Trạng thái
          </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Giới hạn
          </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Thao tác
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedPromotions.map((promotion) => (
                    <tr key={promotion.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedPromotions.includes(promotion.id)}
                          onChange={() => handleSelectPromotion(promotion.id)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
            </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {promotion.promotionName}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {promotion.description || 'Không có mô tả'}
                          </div>
                        </div>
            </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-green-600">
                          {getDiscountDisplay(promotion.discountType, promotion.discountValue)}
                        </span>
            </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div>
                          <div>{formatDate(promotion.startDate)}</div>
                          <div className="text-gray-500">đến {formatDate(promotion.endDate)}</div>
                        </div>
            </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(promotion.status)}
            </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {promotion.usageLimit ? `${promotion.usageLimit} lần` : 'Không giới hạn'}
            </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewPromotion(promotion)}
                            className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded"
                            title="Xem chi tiết"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleEditPromotion(promotion)}
                            className="text-yellow-600 hover:text-yellow-800 p-1 hover:bg-yellow-50 rounded"
                            title="Chỉnh sửa"
                          >
                  <Edit size={16} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  
            {/* Pagination */}
            {!loading && sortedPromotions.length > 0 && (
              <div className="px-4 py-3 flex flex-col md:flex-row md:justify-between border-t gap-3 bg-white">
                <div className="flex items-center text-sm text-gray-500 flex-wrap gap-2">
                  <span>Hiển thị</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="px-1 py-1 text-sm border rounded"
                  >
                    {[10,20,50,100,200,500].map(size=> (
                      <option key={size} value={size}>{size}</option>
                    ))}
                    <option value={sortedPromotions.length}>Tất cả</option>
                  </select>
                  <span>mỗi trang trong {sortedPromotions.length} khuyến mãi</span>
                </div>

                <div className="flex justify-between md:justify-end items-center space-x-2">
                  <div className="flex items-center">
                    <button
                      onClick={() => setCurrentPage(prev=> Math.max(1, prev-1))}
                      disabled={currentPage === 1}
                      className={`px-2 py-1 border rounded ${currentPage===1? 'text-gray-400 cursor-not-allowed':'hover:bg-gray-50'}`}
                    >
                      <ChevronLeft size={18} />
                    </button>

                    <div className="flex items-center mx-1">
                      <button className={`px-3 py-1 border rounded ${currentPage===1? 'bg-blue-600 text-white':'hover:bg-gray-50'}`} onClick={()=>setCurrentPage(1)}>1</button>
                      {currentPage > 3 && <span className="px-1">...</span>}
                      {Array.from({length: totalPages}).map((_,i)=>{
                        if(i!==0 && i!==totalPages-1){
                          if(Math.abs(currentPage-(i+1))<=1){
                            return <button key={i} className={`px-3 py-1 border rounded ${currentPage===i+1?'bg-blue-600 text-white':'hover:bg-gray-50'}`} onClick={()=>setCurrentPage(i+1)}>{i+1}</button>
                          }
                        }
                        return null;
                      })}
                      {currentPage < totalPages-2 && <span className="px-1">...</span>}
                      {totalPages>1 && <button className={`px-3 py-1 border rounded ${currentPage===totalPages? 'bg-blue-600 text-white':'hover:bg-gray-50'}`} onClick={()=>setCurrentPage(totalPages)}>{totalPages}</button>}
                    </div>

                    <button
                      onClick={() => setCurrentPage(prev=> Math.min(totalPages, prev+1))}
                      disabled={currentPage===totalPages}
                      className={`px-2 py-1 border rounded ${currentPage===totalPages? 'text-gray-400 cursor-not-allowed':'hover:bg-gray-50'}`}
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
                      onKeyDown={(e)=>{
                        if(e.key==='Enter'){
                          const num=parseInt(e.target.value,10);
                          if(!isNaN(num)&& num>=1 && num<=totalPages){
                            setCurrentPage(num);
                            e.target.value='';
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
      
      {/* Modals */}
      <PromotionFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          resetForm();
        }}
        onSubmit={handleFormSubmit}
        formData={formData}
        onChange={handleFormChange}
        promotionToEdit={promotionToEdit}
      />

      <PromotionDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setPromotionToView(null);
        }}
        promotion={promotionToView}
      />
    </div>
  );
};

export default Marketing;