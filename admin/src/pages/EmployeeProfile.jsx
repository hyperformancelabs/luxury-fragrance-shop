import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import employeeService from '../services/employeeService';
import { Camera, Loader2, Save, Eye, EyeOff } from 'lucide-react';

const EmployeeProfile = () => {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    address: '',
    dateOfBirth: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    profilePictureUrl: ''
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Hiển thị thông tin từ AuthContext trước để đảm bảo luôn có dữ liệu
        if (user) {
          console.log('User from AuthContext:', user);
          
          // Đảm bảo dữ liệu được hiển thị đúng
          const userData = user;
          
          // Set profile data
          setProfile(userData);
          
          // Format date if needed
          let dateOfBirth = '';
          if (userData.dateOfBirth) {
            if (Array.isArray(userData.dateOfBirth)) {
              // Trường hợp API trả về [yyyy, mm, dd]
              const [y, m, d] = userData.dateOfBirth;
              dateOfBirth = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            } else if (typeof userData.dateOfBirth === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(userData.dateOfBirth)) {
              dateOfBirth = userData.dateOfBirth;
            } else if (typeof userData.dateOfBirth === 'string') {
              // Nếu là chuỗi nhưng không đúng định dạng, cố gắng chuyển đổi
              const date = new Date(userData.dateOfBirth);
              if (!isNaN(date.getTime())) {
                dateOfBirth = date.toISOString().slice(0, 10);
              }
            }
          }
          // Set form data
          setFormData({
            fullName: userData.fullName || '',
            phoneNumber: userData.phoneNumber || '',
            email: userData.email || '',
            address: userData.address || '',
            dateOfBirth: dateOfBirth,
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
            profilePictureUrl: userData.profilePictureUrl || ''
          });
          
          console.log('Profile data set from user:', userData);
        }
        
        // Vẫn gọi API để lấy thông tin mới nhất
        try {
          const response = await employeeService.getProfile();
          console.log('API Response:', response);
          
          if (response.data) {
            const apiData = response.data;
            setProfile(apiData);
            
            // Format date if needed
            let dateOfBirth = '';
            if (apiData.dateOfBirth) {
              if (Array.isArray(apiData.dateOfBirth)) {
                const [y, m, d] = apiData.dateOfBirth;
                dateOfBirth = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
              } else if (typeof apiData.dateOfBirth === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(apiData.dateOfBirth)) {
                dateOfBirth = apiData.dateOfBirth;
              } else if (typeof apiData.dateOfBirth === 'string') {
                const date = new Date(apiData.dateOfBirth);
                if (!isNaN(date.getTime())) {
                  dateOfBirth = date.toISOString().slice(0, 10);
                }
              }
            }
            setFormData({
              fullName: apiData.fullName || '',
              phoneNumber: apiData.phoneNumber || '',
              email: apiData.email || '',
              address: apiData.address || '',
              dateOfBirth: dateOfBirth,
              currentPassword: '',
              newPassword: '',
              confirmPassword: '',
              profilePictureUrl: apiData.profilePictureUrl || ''
            });
            
            console.log('Profile data updated from API:', apiData);
          }
        } catch (apiError) {
          console.error('API Error:', apiError);
          // Sử dụng thông tin từ AuthContext nếu API gặp lỗi
          // Không hiển thị toast vì đã có dữ liệu từ AuthContext
        }
      } catch (error) {
        console.error('Error in profile loading:', error);
        toast.error('Không thể tải thông tin nhân viên');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Họ tên không được để trống';
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Số điện thoại không được để trống';
    } else if (!/^[0-9 ()+-]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Số điện thoại không hợp lệ';
    }
    
    if (formData.email && !/^[A-Za-z0-9+_.-]+@(.+)$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Địa chỉ không được để trống';
    }
    
    // Password validation
    if (formData.newPassword || formData.currentPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Vui lòng nhập mật khẩu hiện tại';
      }
      
      if (!formData.newPassword) {
        newErrors.newPassword = 'Vui lòng nhập mật khẩu mới';
      } else if (formData.newPassword.length < 6) {
        newErrors.newPassword = 'Mật khẩu phải có ít nhất 6 ký tự';
      }
      
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [updateData, setUpdateData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Prepare data for API - đảm bảo tất cả các trường đều có giá trị hợp lệ
    const data = {
      fullName: formData.fullName.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      email: formData.email.trim(),
      address: formData.address.trim()
    };
    
    // Xử lý ngày tháng đúng định dạng ISO (yyyy-MM-dd)
    if (formData.dateOfBirth) {
      try {
        // Nếu là chuỗi ngày tháng, đảm bảo đúng định dạng
        const date = new Date(formData.dateOfBirth);
        if (!isNaN(date.getTime())) {
          // Định dạng lại ngày tháng theo chuẩn ISO
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          data.dateOfBirth = `${year}-${month}-${day}`;
        }
      } catch (error) {
        console.error('Invalid date format:', error);
        data.dateOfBirth = null;
      }
    } else {
      data.dateOfBirth = null;
    }
    
    // Xử lý URL ảnh đại diện đặc biệt
    // Nếu là null hoặc chuỗi rỗng thì gửi null lên backend để xoá ảnh
    if (formData.profilePictureUrl === null || (typeof formData.profilePictureUrl === 'string' && formData.profilePictureUrl.trim() === '')) {
      data.profilePictureUrl = null;
    } else if (typeof formData.profilePictureUrl === 'string') {
      data.profilePictureUrl = formData.profilePictureUrl.trim();
    }
    
    // Add password fields if provided
    if (formData.currentPassword && formData.newPassword) {
      data.currentPassword = formData.currentPassword;
      data.newPassword = formData.newPassword;
    }
    
    // Log URL ảnh để debug
    console.log('Profile picture URL before update:', data.profilePictureUrl);
    
    // Store update data and show confirmation modal
    setUpdateData(data);
    setShowConfirmModal(true);
  };
  
  const [updateSuccessModal, setUpdateSuccessModal] = useState(false);
  const [updateErrorModal, setUpdateErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const confirmUpdate = async () => {
    setSaving(true);
    
    try {
      // Kiểm tra lại dữ liệu trước khi gửi
      if (!updateData.fullName || !updateData.phoneNumber || !updateData.email || !updateData.address) {
        throw new Error('Vui lòng điền đầy đủ thông tin bắt buộc');
      }
      
      // Tạo một bản sao sạch của dữ liệu để gửi đi
      const dataToSend = JSON.parse(JSON.stringify(updateData));
      
      console.log('Sending profile update with data:', dataToSend);
      
      // Gọi API cập nhật thông tin
      const response = await employeeService.updateProfile(dataToSend);
      console.log('Profile update response:', response);
      
      // Cập nhật profile trong state
      setProfile(response.data);

      // Cập nhật context AuthContext để header và các nơi khác tự động update
      if (setUser) setUser(response.data);

      // Cập nhật formData với dữ liệu mới từ server
      setFormData(prev => ({
        ...prev,
        fullName: response.data.fullName || prev.fullName,
        phoneNumber: response.data.phoneNumber || prev.phoneNumber,
        email: response.data.email || prev.email,
        address: response.data.address || prev.address,
        dateOfBirth: response.data.dateOfBirth || prev.dateOfBirth,
        profilePictureUrl: response.data.profilePictureUrl || prev.profilePictureUrl,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      
      // Đóng modal xác nhận và hiển thị modal thành công
      setShowConfirmModal(false);
      setUpdateSuccessModal(true);
    } catch (error) {
      console.error('Error updating profile:', error);
      
      // Xử lý lỗi mật khẩu hiện tại không khớp
      if (error.message && error.message.includes('Current password is incorrect')) {
        setErrors(prev => ({
          ...prev,
          currentPassword: 'Mật khẩu hiện tại không chính xác'
        }));
        setErrorMessage('Mật khẩu hiện tại không chính xác');
      } else {
        const errCode = error.code || '';
        const errMsg = error.message || 'Cập nhật thông tin thất bại';
        setErrorMessage(`${errCode ? '[' + errCode + '] ' : ''}${errMsg}`);
      }
      
      // Đóng modal xác nhận và hiển thị modal lỗi
      setShowConfirmModal(false);
      setUpdateErrorModal(true);
    } finally {
      setSaving(false);
    }
  };
  
  const closeSuccessModal = () => {
    setUpdateSuccessModal(false);
  };
  
  const closeErrorModal = () => {
    setUpdateErrorModal(false);
  };

  const [showImageUrlInput, setShowImageUrlInput] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageUrlError, setImageUrlError] = useState('');
  
  const validateImageUrl = (url) => {
    if (!url || url.trim() === '') {
      return 'URL ảnh không được để trống';
    }
    
    // Kiểm tra định dạng URL hợp lệ
    try {
      new URL(url);
    } catch (e) {
      return 'URL không hợp lệ';
    }
    
    // Kiểm tra đuôi file ảnh phổ biến
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const hasValidExtension = validExtensions.some(ext => url.toLowerCase().endsWith(ext));
    
    // Kiểm tra URL có chứa domain ảnh phổ biến
    const commonImageDomains = ['imgur.com', 'cloudinary.com', 'unsplash.com', 'picsum.photos', 'images.', 'photos.', 'img.'];
    const hasImageDomain = commonImageDomains.some(domain => url.toLowerCase().includes(domain));
    
    if (!hasValidExtension && !hasImageDomain) {
      return 'URL không phải là đường dẫn đến ảnh hợp lệ';
    }
    
    return '';
  };

  const handleImageUrlSubmit = () => {
    // Nếu người dùng để trống URL, cho phép xóa ảnh (set null)
    if (!imageUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        profilePictureUrl: null
      }));
      toast.success('Đã xoá ảnh đại diện. Nhấn Lưu thay đổi để hoàn tất.');
      setShowImageUrlInput(false);
      setImageUrl('');
      setImageUrlError('');
      return;
    }
    const error = validateImageUrl(imageUrl);
    setImageUrlError(error);
    
    if (!error) {
      // Xử lý URL trước khi cập nhật vào formData
      const trimmedUrl = imageUrl.trim();
      
      // Cập nhật URL ảnh trong formData
      setFormData(prev => ({
        ...prev,
        profilePictureUrl: trimmedUrl
      }));
      
      // Hiển thị thông báo đã cập nhật URL ảnh
      toast.success('URL ảnh đã được cập nhật. Nhấn Lưu thay đổi để hoàn tất.');
      
      // Đóng modal và xóa dữ liệu tạm
      setShowImageUrlInput(false);
      setImageUrl('');
      
      // Hiển thị thông báo và hướng dẫn người dùng lưu thay đổi
      toast.success('Đã cập nhật URL ảnh đại diện. Nhấn "Lưu thay đổi" để lưu vào hệ thống.');
    }
  };

  const handleImageUrlCancel = () => {
    setShowImageUrlInput(false);
    setImageUrl('');
    setImageUrlError('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-gray-700" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Xác nhận cập nhật</h3>
            <p className="text-gray-500 mb-6">Bạn có chắc chắn muốn cập nhật thông tin cá nhân?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                disabled={saving}
              >
                Huỷ
              </button>
              <button
                onClick={confirmUpdate}
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 flex items-center"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    Đang lưu...
                  </>
                ) : (
                  'Xác nhận'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Success Modal */}
      {updateSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-center text-green-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2 text-center">Cập nhật thành công</h3>
            <p className="text-gray-500 mb-6 text-center">Thông tin cá nhân của bạn đã được cập nhật thành công.</p>
            <div className="flex justify-center">
              <button
                onClick={closeSuccessModal}
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Error Modal */}
      {updateErrorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-center text-red-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2 text-center">Cập nhật thất bại</h3>
            <p className="text-gray-500 mb-6 text-center">{errorMessage}</p>
            <div className="flex justify-center">
              <button
                onClick={closeErrorModal}
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Thông tin cá nhân</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Profile Image Section */}
          <div className="w-full md:w-1/3 flex flex-col items-center">
            <div className="relative mb-4">
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-gray-200">
                <img 
                  src={formData.profilePictureUrl || "/empavt.jpg"} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-2 right-2">
                <button 
                  type="button" 
                  className="bg-black text-white p-2 rounded-full cursor-pointer hover:bg-gray-800 flex items-center gap-2"
                  onClick={() => setShowImageUrlInput(true)}
                  title="Nhập URL ảnh đại diện"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                  </svg>
                  <span className="hidden sm:inline-block">Thay đổi ảnh</span>
                </button>
              </div>
            </div>
            
            {/* Modal nhập URL ảnh */}
            {showImageUrlInput && (
              <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Nhập URL ảnh đại diện mới</h3>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">URL ảnh đại diện</label>
                    <input
                      type="text"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className={`w-full p-2 border ${imageUrlError ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                      autoFocus
                    />
                    {imageUrlError && <p className="text-red-500 text-xs mt-1">{imageUrlError}</p>}
                    <p className="text-xs text-gray-500 mt-1">Nhập URL đến ảnh từ internet (jpg, png, gif...)</p>
                    <p className="text-xs text-gray-500 mt-1">Lưu ý: Sau khi nhập URL, bạn cần nhấn "Lưu thay đổi" để cập nhật vào hệ thống</p>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={handleImageUrlCancel}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                    >
                      Huỷ
                    </button>
                    <button
                      onClick={handleImageUrlSubmit}
                      className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
                    >
                      Xác nhận
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold">{profile?.fullName || 'Không xác định'}</h2>
              <div className="text-sm text-gray-500 mt-1">@{profile?.username}</div>
              <div className="text-sm text-gray-500 mt-1">{profile?.roles?.length > 0 ? profile.roles.join(', ') : 'Không có vai trò'}</div>
            </div>
            
            <div className="w-full bg-gray-100 rounded-lg p-4">
              <div className="mb-3">
                <div className="text-sm text-gray-500">Ngày bắt đầu</div>
                <div>
                  {profile?.startDate ? (
                    Array.isArray(profile.startDate) ? 
                      `${profile.startDate[2]}/${profile.startDate[1]}/${profile.startDate[0]}` : 
                      new Date(profile.startDate).toLocaleDateString('vi-VN')
                  ) : 'N/A'}
                </div>
              </div>
              <div className="mb-3">
                <div className="text-sm text-gray-500">Trạng thái</div>
                <div className="flex items-center">
                  <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                    profile?.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                  }`}></span>
                  {profile?.status === 'active' ? 'Đang hoạt động' : 'Không hoạt động'}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Đăng nhập cuối</div>
                <div>
                  {profile?.lastLogin ? (
                    Array.isArray(profile.lastLogin) ? 
                      `${profile.lastLogin[2]}/${profile.lastLogin[1]}/${profile.lastLogin[0]} ${profile.lastLogin[3]}:${profile.lastLogin[4]}` : 
                      new Date(profile.lastLogin).toLocaleString('vi-VN')
                  ) : 'N/A'}
                </div>
              </div>
            </div>
          </div>
          
          {/* Profile Form Section */}
          <div className="w-full md:w-2/3">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Họ tên
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Nhập họ tên đầy đủ"
                    autoComplete="name"
                    className={`w-full p-2 border rounded-md ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Nhập số điện thoại"
                    autoComplete="tel"
                    className={`w-full p-2 border rounded-md ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Nhập địa chỉ email"
                    autoComplete="email"
                    className={`w-full p-2 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày sinh
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    autoComplete="bday"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Địa chỉ
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Nhập địa chỉ đầy đủ"
                    autoComplete="street-address"
                    className={`w-full p-2 border rounded-md ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                  ></textarea>
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6 mb-6">
                <h3 className="text-lg font-medium mb-4">Đổi mật khẩu</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mật khẩu hiện tại
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        autoComplete="off"
                        className={`w-full p-2 border rounded-md pr-10 ${errors.currentPassword ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      <button 
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {errors.currentPassword && <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mật khẩu mới
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        autoComplete="new-password"
                        className={`w-full p-2 border rounded-md pr-10 ${errors.newPassword ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      <button 
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>}
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Xác nhận mật khẩu mới
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      autoComplete="new-password"
                      className={`w-full p-2 border rounded-md pr-10 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 focus:outline-none disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Lưu thay đổi
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
