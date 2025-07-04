import React from 'react';
import { XCircle } from 'lucide-react';

/**
 * Modal for creating or updating a material
 *
 * Props:
 * - isOpen           : boolean   – show/hide modal
 * - onClose          : function  – callback when closing
 * - formData         : object    – { materialName, unit, description, price, reorderLevel }
 * - onChange         : function  – input change handler
 * - onSubmit         : function  – submit handler
 * - materialToEdit   : object|null – if provided, modal is in edit mode
 */
const MaterialFormModal = ({ isOpen, onClose, formData, onChange, onSubmit, materialToEdit }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md md:max-w-lg shadow-lg rounded-md bg-white">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="text-lg font-medium text-gray-900">
            {materialToEdit ? 'Cập nhật vật tư' : 'Thêm vật tư mới'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500 focus:outline-none">
            <XCircle size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="mt-4 space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="materialName" className="block text-sm font-medium text-gray-700 mb-1">
              Tên vật tư <span className="text-red-500">*</span>
            </label>
            <input
              id="materialName"
              name="materialName"
              type="text"
              value={formData.materialName || ''}
              onChange={onChange}
              required
              placeholder="Nhập tên vật tư..."
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Unit */}
          <div>
            <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
              Đơn vị tính <span className="text-red-500">*</span>
            </label>
            <input
              id="unit"
              name="unit"
              type="text"
              value={formData.unit || ''}
              onChange={onChange}
              required
              placeholder="Ví dụ: pcs, ml, kg..."
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Giá (VNĐ/{formData.unit || 'đơn vị'}) <span className="text-red-500">*</span>
              </label>
              <input
                id="price"
                name="price"
                type="number"
                min="0"
                step="any"
                value={formData.price || ''}
                onChange={onChange}
                required
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Reorder Level */}
            <div>
              <label htmlFor="reorderLevel" className="block text-sm font-medium text-gray-700 mb-1">
                Mức cảnh báo (reorder level)
              </label>
              <input
                id="reorderLevel"
                name="reorderLevel"
                type="number"
                min="0"
                step="1"
                value={formData.reorderLevel || ''}
                onChange={onChange}
                placeholder="Số lượng tối thiểu"
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả
            </label>
            <textarea
              id="description"
              name="description"
              rows="3"
              value={formData.description || ''}
              onChange={onChange}
              placeholder="Mô tả chi tiết về vật tư..."
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
            >
              {materialToEdit ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MaterialFormModal; 