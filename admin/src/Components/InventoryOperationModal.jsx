import React, { useState, useEffect } from 'react';
import { XCircle } from 'lucide-react';
import inventoryTransactionService from '../services/inventoryTransactionService';
import toast from 'react-hot-toast';

const InventoryOperationModal = ({ 
  isOpen, 
  onClose, 
  operationType, // 'import' or 'export'
  productVariant,
  productName,
  onSuccess
}) => {
  const [quantity, setQuantity] = useState('1');
  const [costPrice, setCostPrice] = useState('');
  const [reason, setReason] = useState('');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [defaultReasons, setDefaultReasons] = useState([]);

  // Set default reason based on operation type
  useEffect(() => {
    if (operationType === 'import') {
      setDefaultReasons([
        'Nhập hàng từ nhà cung cấp',
        'Nhập hàng từ kho chính',
        'Điều chỉnh tồn kho sau kiểm kê',
        'Trả hàng từ khách hàng'
      ]);
      setReason('Nhập hàng từ nhà cung cấp');
    } else {
      setDefaultReasons([
        'Xuất hàng cho khách hàng',
        'Xuất hàng về kho chính',
        'Điều chỉnh tồn kho sau kiểm kê',
        'Hàng bị hỏng/lỗi',
        'Hàng hết hạn sử dụng'
      ]);
      setReason('Xuất hàng cho khách hàng');
    }
  }, [operationType]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setQuantity('1');
      setCostPrice('');
      setNote('');
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!productVariant) {
      toast.error('Không tìm thấy thông tin sản phẩm');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const quantityValue = parseInt(quantity);
      if (isNaN(quantityValue) || quantityValue <= 0) {
        toast.error('Số lượng phải là số dương');
        setIsSubmitting(false);
        return;
      }

      // For export operations, check if there's enough inventory
      if (operationType === 'export' && quantityValue > productVariant.quantityInStock) {
        toast.error('Số lượng xuất không thể lớn hơn tồn kho hiện tại');
        setIsSubmitting(false);
        return;
      }

      // Calculate before and after values
      const beforeValue = productVariant.quantityInStock;
      const afterValue = operationType === 'import' 
        ? beforeValue + quantityValue 
        : beforeValue - quantityValue;

      // Prepare transaction data
      const transactionData = {
        productVariantId: productVariant.productVariantId,
        transactionType: operationType,
        quantity: quantityValue,
        reason: reason,
        note: note,
        field: 'quantityInStock',
        beforeValue: beforeValue,
        afterValue: afterValue
      };

      // Add cost price if provided
      if (costPrice && !isNaN(parseFloat(costPrice)) && parseFloat(costPrice) > 0) {
        transactionData.costPrice = parseFloat(costPrice);
      }

      // Create the transaction
      const response = await inventoryTransactionService.createInventoryTransaction(transactionData);
      
      if (response && response.status === 'success') {
        toast.success(operationType === 'import' ? 'Nhập kho thành công!' : 'Xuất kho thành công!');
        onClose();
        if (onSuccess) onSuccess();
      } else {
        throw new Error(response?.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error in inventory operation:', error);
      toast.error(error.message || 'Có lỗi xảy ra khi thực hiện giao dịch');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !productVariant) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md md:max-w-lg shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="text-lg font-medium text-gray-900">
            {operationType === 'import' ? 'Nhập kho' : 'Xuất kho'}: {productName} ({productVariant.volume}ml)
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500 focus:outline-none">
            <XCircle size={20} />
          </button>
        </div>
        
        <div className="mt-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-600">Tồn kho hiện tại:</span>
            <span className="font-semibold">{productVariant.quantityInStock}</span>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số lượng {operationType === 'import' ? 'nhập' : 'xuất'} <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
                min="1"
                step="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {operationType === 'import' ? 'Giá nhập (VNĐ/sản phẩm)' : 'Giá xuất (VNĐ/sản phẩm)'} <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value)}
                required
                min="0"
                step="any"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="text-xs text-gray-500">Giá cho mỗi sản phẩm</span>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lý do <span className="text-red-500">*</span>
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {defaultReasons.map((r, index) => (
                  <option key={index} value={r}>{r}</option>
                ))}
                <option value="other">Khác...</option>
              </select>
              
              {reason === 'other' && (
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Nhập lý do khác"
                  required
                  className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              )}
            </div>
            
            {reason !== 'other' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ghi chú bổ sung
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}
            
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={onClose}
                className="mr-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  operationType === 'import' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-blue-600 hover:bg-blue-700'
                } focus:outline-none ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Đang xử lý...' : (operationType === 'import' ? 'Nhập kho' : 'Xuất kho')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InventoryOperationModal; 