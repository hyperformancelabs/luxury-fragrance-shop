import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ProfileDetails from '../components/ProfileDetails';
import OrderHistory from '../components/OrderHistory';

const Profile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    password: '**********',
    street: '',
    ward: '',
    district: '',
    city: '',
    birthday: '',
    gender: 'Nam'
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch('http://localhost:8080/api/v1/customers/me', {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      if (response.ok && data.status === 'success') {
        const userData = data.data;
        setProfileData({
          name: userData.name || '',
          phoneNumber: userData.phoneNumber || '',
          email: userData.email || '',
          password: '**********',
          street: userData.street || '',
          ward: userData.ward || '',
          district: userData.district || '',
          city: userData.city || '',
          birthday: '',
          gender: 'Nam'
        });
      } else {
        setError(data.message || 'Không thể tải hồ sơ');
      }
    } catch (err) {
      console.error(err);
      setError('Lỗi khi tải hồ sơ');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-black text-white p-4">
        <div className="max-w-6xl mx-24 flex justify-start items-center">
          <h1 className="text-sm font-medium">TRANG CHỦ / HỒ SƠ CÁ NHÂN</h1>
        </div>
      </header>

      <main className="flex-grow py-6 px-4 md:px-8">
        <div className="max-w-6xl mx-20 flex flex-col md:flex-row gap-6">
          <Sidebar profileData={profileData} activeTab={activeTab} setActiveTab={setActiveTab} />
          {/* <ProfileDetails profileData={profileData} setProfileData={setProfileData} error={error} /> */}
          <div className="w-full md:w-3/4">
  {error && (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {error}
    </div>
  )}

  {activeTab === "profile" && <ProfileDetails profileData={profileData} setProfileData={setProfileData} />}
  {activeTab === "orders" && <OrderHistory />}
  {/* {activeTab === "logout" && <Logout />} */}
</div>

        </div>
      </main>
    </div>
  );
};

export default Profile;


const Notifications = () => (
  <div className="bg-white rounded-lg shadow p-6">
    <h2 className="text-xl font-bold mb-4">Thông báo</h2>
    <p>Hiển thị thông báo mới nhất ở đây...</p>
  </div>
);

const Logout = () => {
  // Thực hiện logout và redirect
  return <div>Đang đăng xuất...</div>;
};
