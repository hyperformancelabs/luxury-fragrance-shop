import React from 'react'
import { Bell, Search, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const Header = ({ sidebarOpen }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  
  const handleLogout = () => {
    logout()
    toast.success('Đăng xuất thành công')
    navigate('/login')
  }
  
  return (
  <header className={`fixed top-0 ${sidebarOpen ? 'left-64' : 'left-20'} right-0 h-16 bg-white shadow-sm z-20 flex justify-between items-center px-4`}>
    <h1 className="text-xl font-semibold text-gray-800">Bảng điều khiển</h1>
    
    <div className="flex items-center space-x-4">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="pl-10 pr-4 py-2 rounded-full bg-gray-100 border-none focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
        />
      </div>
      
      <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 relative">
        <Bell size={20} className="text-gray-600" />
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
      </button>
      
      <div className="flex items-center space-x-3">
        <img 
          src={user?.profilePictureUrl || "/empavt.jpg"} 
          alt="Avatar" 
          className="w-8 h-8 rounded-full object-cover" 
        />
        <div className="hidden md:block">
          <div className="font-medium">{user?.username || 'Không xác định'}</div>
          <div className="text-xs text-gray-500">{user?.roles?.join(', ') || 'Không có vai trò'}</div>
        </div>
        <button 
          onClick={handleLogout}
          className="p-2 rounded-full hover:bg-gray-200 text-gray-600"
          title="Đăng xuất"
        >
          <LogOut size={18} />
        </button>
      </div>
    </div>
  </header>
  )
}

export default Header
