import React from 'react';
import { X, Save, User, Phone, Mail, MapPin, Edit, Type, Lock, Star, BarChart2, Tag, Info } from 'lucide-react';

const InputField = ({ icon, label, name, value, onChange, placeholder, type = 'text', required = false, disabled = false }) => (
  <div className="relative mb-4">
    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
      {icon}
    </div>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
    />
  </div>
);

const CustomerFormModal = ({
  show,
  onClose,
  onSubmit,
  formData,
  onFormChange,
  customerToEdit
}) => {
  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            {customerToEdit ? <Edit size={20} className="mr-2 text-indigo-600" /> : <User size={20} className="mr-2 text-indigo-600" />}
            {customerToEdit ? 'Chỉnh sửa thông tin khách hàng' : 'Thêm khách hàng mới'}
          </h2>
          <button onClick={onClose} className="p-2 text-gray-500 rounded-full hover:bg-gray-200 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <X size={24} />
          </button>
        </div>

        <div className="flex-grow p-6 overflow-y-auto">
          <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {/* Left Column */}
            <div className="flex flex-col">
              <h3 className="font-semibold text-lg mb-3 text-gray-700 border-b pb-2">Thông tin cá nhân</h3>
              <InputField
                icon={<User size={16} className="text-gray-400" />}
                label="Họ và tên"
                name="name"
                value={formData.name}
                onChange={onFormChange}
                placeholder="Nhập họ và tên khách hàng"
                required
              />
              <InputField
                icon={<Phone size={16} className="text-gray-400" />}
                label="Số điện thoại"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={onFormChange}
                placeholder="Nhập số điện thoại"
                required
              />
              <InputField
                icon={<Mail size={16} className="text-gray-400" />}
                label="Email"
                name="email"
                value={formData.email}
                onChange={onFormChange}
                placeholder="Nhập địa chỉ email"
                type="email"
                required
              />
              
              <h3 className="font-semibold text-lg mt-4 mb-3 text-gray-700 border-b pb-2">Thông tin tài khoản</h3>
              <InputField
                icon={<Type size={16} className="text-gray-400" />}
                label="Tên đăng nhập"
                name="username"
                value={formData.username}
                onChange={onFormChange}
                placeholder="Nhập tên đăng nhập"
                required
                disabled={!!customerToEdit}
              />
              {!customerToEdit && (
                <InputField
                  icon={<Lock size={16} className="text-gray-400" />}
                  label="Mật khẩu"
                  name="password"
                  value={formData.password}
                  onChange={onFormChange}
                  placeholder="Nhập mật khẩu (tối thiểu 8 ký tự)"
                  type="password"
                  required
                />
              )}
            </div>

            {/* Right Column */}
            <div className="flex flex-col">
              <h3 className="font-semibold text-lg mb-3 text-gray-700 border-b pb-2">Thông tin địa chỉ</h3>
              <InputField
                icon={<MapPin size={16} className="text-gray-400" />}
                label="Đường"
                name="street"
                value={formData.street}
                onChange={onFormChange}
                placeholder="Số nhà, tên đường"
              />
              <InputField
                icon={<MapPin size={16} className="text-gray-400" />}
                label="Phường/Xã"
                name="ward"
                value={formData.ward}
                onChange={onFormChange}
                placeholder="Phường / Xã"
              />
              <InputField
                icon={<MapPin size={16} className="text-gray-400" />}
                label="Quận/Huyện"
                name="district"
                value={formData.district}
                onChange={onFormChange}
                placeholder="Quận / Huyện"
              />
              <InputField
                icon={<MapPin size={16} className="text-gray-400" />}
                label="Tỉnh/Thành phố"
                name="city"
                value={formData.city}
                onChange={onFormChange}
                placeholder="Tỉnh / Thành phố"
              />
              
              <h3 className="font-semibold text-lg mt-4 mb-3 text-gray-700 border-b pb-2">Thông tin bổ sung</h3>
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  icon={<Star size={16} className="text-gray-400" />}
                  label="Đánh giá"
                  name="rating"
                  value={formData.rating}
                  onChange={onFormChange}
                  placeholder="1-10"
                  type="number"
                />
                <InputField
                  icon={<BarChart2 size={16} className="text-gray-400" />}
                  label="Điểm thân thiết"
                  name="loyaltyPoints"
                  value={formData.loyaltyPoints}
                  onChange={onFormChange}
                  placeholder="0"
                  type="number"
                />
              </div>
              <div className="relative mb-4">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Tag size={16} className="text-gray-400" />
                  </div>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={onFormChange}
                    className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Không hoạt động</option>
                    <option value="banned">Bị cấm</option>
                  </select>
              </div>
              <InputField
                icon={<Info size={16} className="text-gray-400" />}
                label="Ghi chú vận chuyển"
                name="shippingNote"
                value={formData.shippingNote}
                onChange={onFormChange}
                placeholder="Thêm ghi chú..."
              />
              <InputField
                icon={<Info size={16} className="text-gray-400" />}
                label="Ghi chú nội bộ"
                name="note"
                value={formData.note}
                onChange={onFormChange}
                placeholder="Thêm ghi chú..."
              t/>
            </div>
          </form>
        </div>

        <div className="flex justify-end items-center p-4 border-t bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 mr-3 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Hủy
          </button>
          <button
            type="submit"
            onClick={onSubmit}
            className="px-6 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center"
          >
            <Save size={18} className="mr-2" />
            {customerToEdit ? 'Lưu thay đổi' : 'Tạo khách hàng'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerFormModal; 