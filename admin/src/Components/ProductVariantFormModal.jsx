import React, { useEffect, useState } from 'react';
import { XCircle } from 'lucide-react';

const ProductVariantFormModal = ({ 
  isOpen,
  onClose, 
  formData, 
  onChange, 
  onSubmit, 
  variantToEdit 
}) => {
  const [lastUsedPrice, setLastUsedPrice] = useState('');
  
  // Load last used price from localStorage when component mounts
  useEffect(() => {
    const savedPrice = localStorage.getItem('last_used_price');
    if (savedPrice) {
      setLastUsedPrice(savedPrice);
    }
  }, []);
  
  // Auto-fill price when form is opened for a new variant
  useEffect(() => {
    if (isOpen && !variantToEdit && lastUsedPrice && formData.price === '') {
      // Only auto-fill if this is a new variant and price is not already set
      onChange({
        target: {
          name: 'price',
          value: lastUsedPrice
        }
      });
    }
  }, [isOpen, variantToEdit, lastUsedPrice, formData.price, onChange]);
  
  // Save price to localStorage when it changes
  const handlePriceChange = (e) => {
    const { value } = e.target;
    if (value) {
      localStorage.setItem('last_used_price', value);
    }
    onChange(e);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md md:max-w-lg shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="text-lg font-medium text-gray-900">
            {variantToEdit ? 'Cập nhật phiên bản sản phẩm' : 'Thêm phiên bản sản phẩm mới'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500 focus:outline-none">
            <XCircle size={20} />
          </button>
        </div>
        
        <form onSubmit={onSubmit} className="mt-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dung tích (ml) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="volume"
                value={formData.volume}
                onChange={onChange}
                required
                min="0.1"
                step="any"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giá gốc <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handlePriceChange}
                required
                min="0"
                step="any"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder={lastUsedPrice ? `Giá gần nhất: ${lastUsedPrice}` : ''}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giá khuyến mãi
              </label>
              <input
                type="number"
                name="discountPrice"
                value={formData.discountPrice}
                onChange={onChange}
                min="0"
                step="any"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="text-xs text-gray-500">Để trống nếu không có khuyến mãi</span>
            </div>
            
            {/* Remove the quantity input field for new variants, and make it read-only for existing variants */}
            {variantToEdit && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số lượng tồn kho
                </label>
                <input
                  type="number"
                  name="quantityInStock"
                  value={formData.quantityInStock}
                  disabled={true}
                  className="w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-md focus:outline-none text-gray-600 cursor-not-allowed"
                />
                <span className="text-xs text-gray-500">Sử dụng chức năng nhập/xuất kho để thay đổi tồn kho</span>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mức cảnh báo sắp hết hàng <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="reorderLevel"
                value={formData.reorderLevel}
                onChange={onChange}
                required
                min="0"
                step="any"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="text-xs text-gray-500">Khi tồn kho bằng với số này, hệ thống sẽ hiển thị cảnh báo</span>
            </div>
          </div>
          
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
            >
              {variantToEdit ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductVariantFormModal; 