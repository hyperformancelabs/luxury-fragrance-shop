import React, { useState } from 'react';
import { User, ShoppingBag, Bell, LogOut } from 'lucide-react';
import SidebarItem from './SidebarItem';
import { Toaster, toast } from "sonner";

const Sidebar = ({ profileData, activeTab, setActiveTab }) => {
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);

  const handleLogoutConfirm = () => {
    localStorage.removeItem("guestId");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
        toast.success("Đăng xuất thành công!");
setTimeout(() => {
    window.location.href = "/";

}, 1000);
  };

  return (
    <div className="w-full md:w-1/3">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            <img src="/avt.jpg" alt="" className="rounded-full w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="font-bold">{profileData.name}</h2>
            <p className="text-sm text-gray-500">{profileData.phoneNumber}</p>
          </div>
        </div>

        <nav className="space-y-1">
          <SidebarItem icon={<User size={18} />} text="Tài khoản của tôi" active={activeTab === "profile"} onClick={() => setActiveTab('profile')} />
          <SidebarItem icon={<ShoppingBag size={18} />} text="Đơn mua" active={activeTab === "orders"} onClick={() => setActiveTab('orders')} />
          <SidebarItem icon={<LogOut size={18} />} text="Đăng xuất" active={false} onClick={() => setShowConfirmLogout(true)} />
        </nav>
      </div>


      {showConfirmLogout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center space-y-4">
            <h2 className="text-lg font-semibold">Bạn chắc chắn muốn đăng xuất?</h2>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleLogoutConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Đồng ý
              </button>
              <button
                onClick={() => setShowConfirmLogout(false)}
                className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
              >
                Huỷ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
