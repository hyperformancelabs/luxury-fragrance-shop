import React from 'react';
import { Trash2, AlertCircle } from 'lucide-react';

const DeleteVariantConfirmDialog = ({ 
  isOpen,
  onClose, 
  onConfirm, 
  variantToDelete,
  productName 
}) => {
  if (!isOpen) return null;
  
  // Check if variant has stock quantity that needs to be logged
  const hasStock = variantToDelete && variantToDelete.quantityInStock > 0;
  
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <Trash2 className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg leading-6 font-medium text-gray-900 mt-2">Xác nhận xóa</h3>
          <div className="mt-2 px-7 py-3">
            <p className="text-sm text-gray-500">
              Bạn có chắc chắn muốn xóa phiên bản {variantToDelete?.volume}ml của sản phẩm "{productName}"? 
              Hành động này không thể hoàn tác.
            </p>
            
            {hasStock && (
              <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-md">
                <div className="flex items-center text-amber-700 mb-1">
                  <AlertCircle size={16} className="mr-1" />
                  <span className="font-medium text-sm">Phiên bản này còn tồn kho</span>
                </div>
                <p className="text-xs text-amber-600 text-left">
                  Khi xóa phiên bản có tồn kho, hệ thống sẽ yêu cầu xác nhận loại giao dịch:
                </p>
                <ul className="text-xs text-amber-600 text-left list-disc list-inside mt-1">
                  <li><span className="font-medium">Bán hàng (sell)</span>: Cần điền giá bán</li>
                  <li><span className="font-medium">Xuất kho (export)</span>: Cần điền giá xuất</li>
                  <li><span className="font-medium">Điều chỉnh (adjust)</span>: Không cần điền giá</li>
                </ul>
              </div>
            )}
          </div>
          <div className="flex justify-center mt-4 gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 border border-transparent rounded-md font-medium text-white hover:bg-red-700 focus:outline-none"
            >
              Xóa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteVariantConfirmDialog; 