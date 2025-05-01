import React, { useState } from 'react';
import { Edit, Save, Camera } from 'lucide-react';
import ProfileField from './ProfileField';

const ProfileDetails = ({ profileData, setProfileData, error }) => {
  const [isEditMode, setIsEditMode] = useState(false);

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const toggleEditMode = () => {
    if (isEditMode) {
      // Save logic here...
    }
    setIsEditMode(!isEditMode);
  };

  const getFullAddress = () => {
    const parts = [profileData.street, profileData.ward, profileData.district, profileData.city].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : 'Chưa cập nhật địa chỉ';
  };

  return (
    <div className="w-full md:w-3/4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">Hồ sơ của tôi</h2>
          <p className="text-gray-600">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
        </div>

        <div className="p-6">
          <ProfileField label="Tên" value={profileData.name} isEditMode={isEditMode} onChange={(v) => handleInputChange('name', v)} />
          <ProfileField label="Số điện thoại" value={profileData.phoneNumber} isEditMode={isEditMode} onChange={(v) => handleInputChange('phoneNumber', v)} />
          <ProfileField label="Email" value={profileData.email} isEditMode={isEditMode} onChange={(v) => handleInputChange('email', v)} />
            <ProfileField label="Mật khẩu" value={profileData.password} isEditMode={isEditMode} onChange={(v) => handleInputChange('password', v)} />
            <ProfileField label="Địa chỉ" value={getFullAddress()} isEditMode={isEditMode} onChange={(v) => handleInputChange('address', v)} />
            <ProfileField label="Ngày sinh" value={profileData.birthday} isEditMode={isEditMode} onChange={(v) => handleInputChange('birthday', v)} />
                

          <div className="mt-8 flex justify-center">
            <button onClick={toggleEditMode} className={`flex items-center space-x-2 px-8 py-3 rounded font-medium ${isEditMode ? 'bg-green-600' : 'bg-black'} text-white`}>
              {isEditMode ? <><Save size={18} /><span>Lưu</span></> : <><Edit size={18} /><span>Chỉnh sửa</span></>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
