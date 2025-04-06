import React, { useState } from 'react';
import { User, ShoppingBag, Heart, Bell, LogOut, Settings, Edit, Save, Camera } from 'lucide-react';

const Profile = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Phạm Nguyễn Quốc Huy',
    phone: '0796592839',
    email: '',
    password: '**********',
    address: '11 Nguyễn Đình Chiểu',
    birthday: 'sắp 21 rồi',
    gender: 'Nam'
  });

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-black text-white p-4 shadow-md">
        <div className="max-w-6xl mx-24 flex justify-start items-center">
          <h1 className="text-sm font-medium">TRANG CHỦ / HỒ SƠ CÁ NHÂN</h1>
          <div className="flex items-center space-x-4">
           
           
          </div>
        </div>
      </header>

      <main className="flex-grow py-6 px-4 md:px-8">
        <div className="max-w-6xl mx-20 flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                  <img src="/avt.jpg" alt="" className='rounded-full' />
                  </div>
                
                  
                </div>
                <div>
                  <h2 className="font-bold">{profileData.name}</h2>
                  <p className="text-sm text-gray-500">{profileData.phone}</p>
                </div>
              </div>
              
              <nav className="space-y-1">
                <SidebarItem icon={<User size={18} />} text="Tài khoản của tôi" active />
                <SidebarItem icon={<ShoppingBag size={18} />} text="Đơn mua" />
                <SidebarItem icon={<Bell size={18} />} text="Thông báo" />
                <SidebarItem icon={<LogOut size={18} />} text="Đăng xuất" />
              </nav>
            </div>
          </div>
          
          {/* Profile Form */}
          <div className="w-full md:w-3/4">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold">Hồ sơ của tôi</h2>
                <p className="text-gray-600">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Left Column - Form Fields */}
                  <div className="md:col-span-2">
                    <ProfileField 
                      label="Tên" 
                      value={profileData.name} 
                      isEditMode={isEditMode}
                      onChange={(value) => handleInputChange('name', value)}
                      
                    />
                    
                    <ProfileField 
                      label="Số điện thoại" 
                      value={profileData.phone} 
                      isEditMode={isEditMode}
                      onChange={(value) => handleInputChange('phone', value)}
                    />
                    
                    <ProfileField 
                      label="Email" 
                      value={profileData.email} 
                      isEditMode={isEditMode}
                      onChange={(value) => handleInputChange('email', value)}
                      placeholder="Thêm email"
                    />
                    
                    <ProfileField 
                      label="Mật khẩu" 
                      value={profileData.password} 
                      type="password"
                      isEditMode={isEditMode}
                      onChange={(value) => handleInputChange('password', value)}
                    />
                    
                    <ProfileField 
                      label="Địa chỉ" 
                      value={profileData.address} 
                      isEditMode={isEditMode}
                      onChange={(value) => handleInputChange('address', value)}
                    />
                    
                    <ProfileField 
                      label="Ngày sinh" 
                      value={profileData.birthday} 
                      isEditMode={isEditMode}
                      onChange={(value) => handleInputChange('birthday', value)}
                    />
                    
                    <div className="flex flex-wrap items-center py-4 border-b">
                      <div className="w-full md:w-1/3 font-medium text-gray-700 mb-2 md:mb-0">Giới tính:</div>
                      <div className="w-full md:w-2/3">
                        {isEditMode ? (
                          <div className="flex space-x-4">
                            <label className="flex items-center">
                              <input 
                                type="radio" 
                                name="gender" 
                                value="Nam" 
                                checked={profileData.gender === 'Nam'} 
                                onChange={() => handleInputChange('gender', 'Nam')}
                                className="mr-2"
                              />
                              Nam
                            </label>
                            <label className="flex items-center">
                              <input 
                                type="radio" 
                                name="gender" 
                                value="Nữ" 
                                checked={profileData.gender === 'Nữ'} 
                                onChange={() => handleInputChange('gender', 'Nữ')}
                                className="mr-2"
                              />
                              Nữ
                            </label>
                            <label className="flex items-center">
                              <input 
                                type="radio" 
                                name="gender" 
                                value="Khác" 
                                checked={profileData.gender === 'Khác'} 
                                onChange={() => handleInputChange('gender', 'Khác')}
                                className="mr-2"
                              />
                              Khác
                            </label>
                          </div>
                        ) : (
                          <span>{profileData.gender}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Column - Avatar */}
                  <div className="md:col-span-1 flex flex-col items-center justify-start">
                    <div className="w-32 h-32 rounded-full bg-gray-200 mb-4 flex items-center justify-center">
                      <img src="/avt.jpg" alt="" className='rounded-full' />
                    </div>
                    <button className="text-blue-600 flex items-center space-x-1">
                      <Camera size={16} />
                      <span>Thay đổi ảnh</span>
                    </button>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      Dung lượng tối đa: 2MB<br />
                      Định dạng: .JPG, .PNG
                    </p>
                  </div>
                </div>
                
                {/* Edit Button */}
                <div className="mt-8 flex justify-center">
                  <button 
                    className={`flex items-center space-x-2 px-8 py-3 rounded font-medium ${
                      isEditMode ? 'bg-green-600 hover:bg-green-700' : 'bg-black hover:bg-gray-800'
                    } text-white transition duration-200`}
                    onClick={toggleEditMode}
                  >
                    {isEditMode ? (
                      <>
                        <Save size={18} />
                        <span>Lưu thông tin</span>
                      </>
                    ) : (
                      <>
                        <Edit size={18} />
                        <span>Chỉnh sửa thông tin</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow mt-6">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold">Hoạt động gần đây</h2>
              </div>
              <div className="p-6">
                <ActivityItem 
                  title="Đơn hàng #VN123456" 
                  description="Đơn hàng của bạn đã được giao thành công" 
                  time="2 giờ trước"
                />
                <ActivityItem 
                  title="Cập nhật tài khoản" 
                  description="Bạn đã thay đổi số điện thoại liên hệ" 
                  time="Hôm qua"
                />
                <ActivityItem 
                  title="Đơn hàng #VN123455" 
                  description="Đơn hàng của bạn đã được xác nhận" 
                  time="2 ngày trước"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};


const SidebarItem = ({ icon, text, active = false }) => {
  return (
    <a 
      href="#" 
      className={`flex items-center space-x-3 p-3 rounded-lg transition duration-200 ${
        active ? 'bg-black text-white font-medium' : 'hover:bg-gray-100'
      }`}
    >
      <span className={active ? 'text-white' : 'text-gray-500'}>{icon}</span>
      <span>{text}</span>
    </a>
  );
};

const ProfileField = ({ label, value, type = 'text', isEditMode, onChange, placeholder = '' }) => {
  return (
    <div className="flex flex-wrap items-center py-4 border-b">
      <div className="w-full md:w-1/3 font-medium text-gray-700 mb-2 md:mb-0">{label}:</div>
      <div className="w-full md:w-2/3">
        {isEditMode ? (
          <input 
            type={type} 
            value={value} 
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-black"
          />
        ) : (
          <span className='font-medium'>{value || placeholder}</span>
        )}
      </div>
    </div>
  );
};

const ActivityItem = ({ title, description, time }) => {
  return (
    <div className="flex items-start py-3 border-b last:border-0">
      <div className="flex-shrink-0 mr-4">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
          <Bell size={16} className="text-blue-600" />
        </div>
      </div>
      <div className="flex-grow">
        <h4 className="font-medium">{title}</h4>
        <p className="text-gray-600 text-sm">{description}</p>
        <span className="text-gray-400 text-xs">{time}</span>
      </div>
    </div>
  );
};

export default Profile;