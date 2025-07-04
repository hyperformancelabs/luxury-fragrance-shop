import React, { useState, useEffect } from 'react';
import { X, Calendar, Tag, Package, TrendingUp, Users, DollarSign } from 'lucide-react';
import { toast } from 'react-toastify';
import promotionService from '../services/promotionService';

const PromotionDetailModal = ({ isOpen, onClose, promotion }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    if (isOpen && promotion) {
      loadPromotionDetails();
    }
  }, [isOpen, promotion]);

  const loadPromotionDetails = async () => {
    if (!promotion?.id) return;

    setLoading(true);
    try {
      // Load associated products and analytics
      const [productsData, analyticsData] = await Promise.all([
        promotionService.getPromotionProducts(promotion.id),
        promotionService.getUsage(promotion.id)
      ]);
      
      setProducts(productsData || []);
      setAnalytics(analyticsData || null);
    } catch (error) {
      console.error('Error loading promotion details:', error);
      toast.error('Không thể tải chi tiết khuyến mãi');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !promotion) return null;

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{promotion.promotionName}</h2>
            <div className="mt-1 flex items-center space-x-2">
              {getStatusBadge(promotion.status)}
              <span className="text-sm text-gray-500">ID: {promotion.id}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Đang tải...</span>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <Tag size={20} className="mr-2 text-blue-600" />
                    Thông tin cơ bản
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Mô tả:</span>
                      <p className="text-sm text-gray-900 mt-1">
                        {promotion.description || 'Không có mô tả'}
                      </p>
                    </div>
                    
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-2 text-gray-400" />
                      <span className="text-sm text-gray-500">Thời gian:</span>
                      <span className="ml-2 text-sm text-gray-900">
                        {formatDate(promotion.startDate)} - {formatDate(promotion.endDate)}
                      </span>
                    </div>
                    
                    <div className="flex items-center">
                      <DollarSign size={16} className="mr-2 text-gray-400" />
                      <span className="text-sm text-gray-500">Giảm giá:</span>
                      <span className="ml-2 text-sm font-medium text-green-600">
                        {getDiscountDisplay(promotion.discountType, promotion.discountValue)}
                      </span>
                    </div>
                    
                    {promotion.usageLimit && (
                      <div className="flex items-center">
                        <Users size={16} className="mr-2 text-gray-400" />
                        <span className="text-sm text-gray-500">Giới hạn sử dụng:</span>
                        <span className="ml-2 text-sm text-gray-900">
                          {promotion.usageLimit} lần
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Analytics */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <TrendingUp size={20} className="mr-2 text-green-600" />
                    Thống kê sử dụng
                  </h3>
                  
                  {analytics ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {analytics.totalUsed || 0}
                        </div>
                        <div className="text-sm text-blue-600">Đã sử dụng</div>
                      </div>
                      
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {formatPrice(analytics.totalSaved || 0)}
                        </div>
                        <div className="text-sm text-green-600">Tiết kiệm</div>
                      </div>
                      
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          {analytics.conversionRate || 0}%
                        </div>
                        <div className="text-sm text-purple-600">Tỷ lệ chuyển đổi</div>
                      </div>
                      
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">
                          {analytics.uniqueUsers || 0}
                        </div>
                        <div className="text-sm text-orange-600">Người dùng</div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">
                      Chưa có dữ liệu thống kê
                    </div>
                  )}
                </div>
              </div>

              {/* Associated Products */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <Package size={20} className="mr-2 text-orange-600" />
                  Sản phẩm áp dụng ({products.length})
                </h3>
                
                {products.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((product, index) => (
                      <div key={product.id || index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          {product.image && (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {product.name || 'Không có tên'}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {product.brand || 'Không có thương hiệu'}
                            </p>
                            <div className="mt-1">
                              <span className="text-sm font-medium text-green-600">
                                {formatPrice(product.price)}
                              </span>
                              {product.originalPrice && product.originalPrice !== product.price && (
                                <span className="ml-2 text-sm text-gray-400 line-through">
                                  {formatPrice(product.originalPrice)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Package size={48} className="mx-auto text-gray-300 mb-2" />
                    <p>Chưa có sản phẩm nào được áp dụng</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromotionDetailModal; 