import React from 'react';
import { X, Calendar, Percent, DollarSign, AlertTriangle } from 'lucide-react';

const PromotionFormModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  formData, 
  onChange, 
  promotionToEdit 
}) => {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange(e);
  };

  const isEditing = !!promotionToEdit;

  // Check if both endDate and usageLimit are empty
  const isUnlimitedPromotion = !formData.endDate && !formData.usageLimit;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Chỉnh sửa khuyến mãi' : 'Thêm khuyến mãi mới'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Tên khuyến mãi */}
          <div>
            <label htmlFor="promotionName" className="block text-sm font-medium text-gray-700 mb-2">
              Tên khuyến mãi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="promotionName"
              name="promotionName"
              value={formData.promotionName || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập tên khuyến mãi"
              required
            />
          </div>

          {/* Mô tả */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập mô tả khuyến mãi"
            />
          </div>

          {/* Thời gian */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar size={16} className="inline mr-1" />
                Ngày bắt đầu <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar size={16} className="inline mr-1" />
                Ngày kết thúc
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Loại giảm giá và Giá trị */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="discountType" className="block text-sm font-medium text-gray-700 mb-2">
                Loại giảm giá <span className="text-red-500">*</span>
              </label>
              <select
                id="discountType"
                name="discountType"
                value={formData.discountType || 'percentage'}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="percentage">Phần trăm (%)</option>
                <option value="fixed_amount">Số tiền cố định (VNĐ)</option>
                <option value="free_shipping">Free ship</option>
              </select>
            </div>
            {formData.discountType !== 'free_shipping' && (
              <div>
                <label htmlFor="discountValue" className="block text-sm font-medium text-gray-700 mb-2">
                  {formData.discountType === 'percentage' ? (
                    <>
                      <Percent size={16} className="inline mr-1" />
                      Giá trị giảm (%) <span className="text-red-500">*</span>
                    </>
                  ) : (
                    <>
                      <DollarSign size={16} className="inline mr-1" />
                      Số tiền giảm (VNĐ) <span className="text-red-500">*</span>
                    </>
                  )}
                </label>
                <input
                  type="number"
                  id="discountValue"
                  name="discountValue"
                  value={formData.discountValue || ''}
                  onChange={handleChange}
                  min="0"
                  max={formData.discountType === 'percentage' ? '100' : undefined}
                  step={formData.discountType === 'percentage' ? '0.1' : '1000'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={formData.discountType === 'percentage' ? 'Nhập phần trăm (VD: 20)' : 'Nhập số tiền (VD: 100000)'}
                  required
                />
              </div>
            )}
          </div>

          {/* Trạng thái và Giới hạn sử dụng */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái <span className="text-red-500">*</span>
              </label>
              <select
                id="status"
                name="status"
                value={formData.status || 'active'}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="inactive">Tạm dừng</option>
                <option value="active">Đang hoạt động</option>
                <option value="expired">Hết hạn</option>
              </select>
            </div>
            <div>
              <label htmlFor="usageLimit" className="block text-sm font-medium text-gray-700 mb-2">
                Giới hạn sử dụng
              </label>
              <input
                type="number"
                id="usageLimit"
                name="usageLimit"
                value={formData.usageLimit || ''}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập giới hạn (để trống = không giới hạn)"
              />
            </div>
          </div>

          {/* Warning for unlimited promotion */}
          {isUnlimitedPromotion && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    <strong>Cảnh báo:</strong> Bạn đang tạo khuyến mãi không giới hạn thời gian và số lần sử dụng.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Notes/Tips */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
            <div className="text-sm text-blue-700">
              <strong>Lưu ý:</strong>
              <ul className="mt-1 list-disc list-inside space-y-1">
                <li>Tên khuyến mãi phải là duy nhất trong hệ thống</li>
                <li>Ngày kết thúc phải sau ngày bắt đầu</li>
                <li>Giá trị giảm phần trăm không được vượt quá 100%</li>
                <li>Để trống giới hạn sử dụng nếu muốn không giới hạn</li>
              </ul>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isEditing ? 'Cập nhật' : 'Tạo mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PromotionFormModal; 