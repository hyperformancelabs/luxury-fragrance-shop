import React, { useState, useEffect } from 'react';
import { XCircle, AlertCircle } from 'lucide-react';
import materialTransactionService from '../services/MaterialTransactionService';
import toast from 'react-hot-toast';

/**
 * Modal to perform inventory operations (import/export) for a material
 *
 * Props:
 * - isOpen          : boolean
 * - onClose         : function
 * - operationType   : 'import' | 'export'
 * - material        : object (must include quantityInStock, materialId, materialName)
 * - onSuccess       : function – callback after successful operation
 */
const MaterialOperationModal = ({ isOpen, onClose, operationType = 'import', material, onSuccess }) => {
  const [quantity, setQuantity] = useState('1');
  const [costPrice, setCostPrice] = useState('');
  const [reason, setReason] = useState('');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [defaultReasons, setDefaultReasons] = useState([]);

  // Set default reasons whenever operationType changes
  useEffect(() => {
    if (operationType === 'import') {
      setDefaultReasons([
        'Nhập hàng từ nhà cung cấp',
        'Điều chuyển kho nội bộ',
        'Điều chỉnh tồn kho sau kiểm kê',
        'Trả hàng từ khách hàng'
      ]);
      setReason('Nhập hàng từ nhà cung cấp');
    } else {
      setDefaultReasons([
        'Xuất hàng cho sản xuất',
        'Xuất hàng trả về kho chính',
        'Điều chỉnh tồn kho sau kiểm kê',
        'Hàng hỏng / thất thoát'
      ]);
      setReason('Xuất hàng cho sản xuất');
    }
  }, [operationType]);

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setQuantity('1');
      setCostPrice('');
      setNote('');
    }
  }, [isOpen]);

  // Calculate new stock level
  const calculateNewStock = () => {
    if (!material) return 0;
    const currentStock = parseInt(material.quantityInStock) || 0;
    const changeAmount = parseInt(quantity) || 0;
    
    if (operationType === 'import') {
      return currentStock + changeAmount;
    } else {
      return Math.max(0, currentStock - changeAmount);
    }
  };

  // Validate export quantity
  const validateExportQuantity = () => {
    if (operationType !== 'export') return true;
    
    const currentStock = parseInt(material?.quantityInStock) || 0;
    const exportAmount = parseInt(quantity) || 0;
    
    return exportAmount <= currentStock;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate quantity
    const qtyNum = parseInt(quantity);
    if (!qtyNum || qtyNum <= 0) {
      toast.error('Số lượng phải là số dương');
      return;
    }

    // Validate export quantity
    if (!validateExportQuantity()) {
      toast.error('Số lượng xuất không thể lớn hơn tồn kho hiện tại');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Prepare transaction data
      const transactionData = {
        materialId: material.materialId,
        transactionType: operationType,
        quantity: parseInt(quantity),
        reason: reason === 'other' ? note : reason,
        note: reason === 'other' ? '' : note,
        costPrice: costPrice ? parseFloat(costPrice) : null
      };
      
      // Submit transaction
      const response = await materialTransactionService.createMaterialTransaction(transactionData);
      
      if (response.status === 'success') {
        toast.success(operationType === 'import' ? 'Nhập kho thành công' : 'Xuất kho thành công');
        onClose();
        if (onSuccess) onSuccess();
      } else {
        throw new Error(response.message || 'Có lỗi xảy ra');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Có lỗi xảy ra');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !material) return null;

  const newStockLevel = calculateNewStock();
  const isLowStock = material.reorderLevel && newStockLevel <= material.reorderLevel;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md md:max-w-lg shadow-lg rounded-md bg-white">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="text-lg font-medium text-gray-900">
            {operationType === 'import' ? 'Nhập kho' : 'Xuất kho'}: {material.materialName}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500 focus:outline-none">
            <XCircle size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="mt-4">
          <div className="bg-gray-50 p-3 rounded-md mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Tồn kho hiện tại:</span>
              <span className="font-semibold">{material.quantityInStock} {material.unit}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Sau thao tác:</span>
              <span className={`font-semibold ${isLowStock ? 'text-red-600' : ''}`}>
                {newStockLevel} {material.unit}
              </span>
            </div>
            
            {isLowStock && (
              <div className="mt-2 text-xs text-red-600 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                Tồn kho sẽ thấp hơn mức cảnh báo ({material.reorderLevel})
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số lượng {operationType === 'import' ? 'nhập' : 'xuất'} <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                  min="1"
                  step="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="ml-2 text-gray-600">{material.unit}</span>
              </div>
            </div>

            {/* Cost price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {operationType === 'import' ? 'Giá nhập (VNĐ)' : 'Giá xuất (VNĐ)'}
              </label>
              <input
                type="number"
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value)}
                min="0"
                step="any"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Reason */}
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
                {defaultReasons.map((r, idx) => (
                  <option key={idx} value={r}>{r}</option>
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
            
            {/* Note */}
            {reason !== 'other' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ghi chú
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ghi chú thêm (không bắt buộc)"
                />
              </div>
            )}

            {/* Submit button */}
            <div className="flex justify-end pt-2 border-t">
              <button
                type="button"
                onClick={onClose}
                className="mr-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none disabled:opacity-60"
              >
                {isSubmitting ? 'Đang xử lý...' : 'Xác nhận'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MaterialOperationModal; 