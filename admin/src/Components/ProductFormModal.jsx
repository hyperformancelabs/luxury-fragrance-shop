import React from 'react';
import { XCircle } from 'lucide-react';
import AutocompleteInput from './AutocompleteInput';

const ProductFormModal = ({ isOpen, onClose, formData, onChange, onSubmit, productToEdit, onCreateBrand }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md md:max-w-lg shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="text-lg font-medium text-gray-900">
            {productToEdit ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500 focus:outline-none">
            <XCircle size={20} />
          </button>
        </div>
        <form onSubmit={onSubmit} className="mt-4">
          <div className="mb-4">
            <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">
              Tên sản phẩm
            </label>
            <input
              id="productName"
              name="productName"
              type="text"
              value={formData.productName || ''}
              onChange={onChange}
              placeholder="Nhập tên sản phẩm..."
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <AutocompleteInput
              label="Thương hiệu"
              name="brandId"
              value={formData.brandId}
              onChange={onChange}
              placeholder="Chọn hoặc nhập tên thương hiệu..."
              searchUrl="http://localhost:8080/api/v1/emp/brands/search"
              displayField="brandName"
              valueField="brandId"
              required={true}
              onCreateNew={onCreateBrand}
              createNewText="Chưa có trong CSDL, tạo thương hiệu"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={onChange}
              rows="3"
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
              URL Hình ảnh
            </label>
            <input
              id="imageUrl"
              name="imageUrl"
              type="text"
              value={formData.imageUrl}
              onChange={onChange}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end space-x-3 mt-6">
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
              {productToEdit ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;
