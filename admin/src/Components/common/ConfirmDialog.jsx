import React from 'react';

const ConfirmDialog = ({
  isOpen,
  title = 'Xác nhận',
  message,
  confirmText = 'Xóa',
  cancelText = 'Hủy',
  extraActionText,
  onConfirm,
  onCancel,
  onExtraAction,
  confirmButtonClass = 'bg-red-600 hover:bg-red-700',
  extraButtonClass = 'bg-gray-200 hover:bg-gray-300',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[70]">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-medium mb-4">{title}</h3>
        {message && <p className="mb-6 whitespace-pre-line">{message}</p>}
        <div className="flex justify-end space-x-3">
          {onExtraAction && (
            <button
              onClick={onExtraAction}
              className={`px-4 py-2 text-sm rounded-md ${extraButtonClass}`}
            >
              {extraActionText}
            </button>
          )}
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-white rounded-md ${confirmButtonClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog; 