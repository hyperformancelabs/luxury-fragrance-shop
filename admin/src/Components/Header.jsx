import React, { useState, useRef, useEffect } from 'react'
import { LogOut, Settings, ChevronDown, Menu } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const dropdownRef = useRef(null)
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [dropdownRef])
  
  const handleLogout = () => {
    setShowLogoutConfirm(false)
    logout()
    toast.success('Đăng xuất thành công')
    navigate('/login')
  }
  
  const handleProfileClick = () => {
    navigate('/profile')
    setDropdownOpen(false)
  }
  
  return (
  <header className="fixed top-0 left-0 right-0 h-16 bg-white shadow-sm z-20 flex justify-between items-center px-4">
    <div className="flex items-center space-x-4">
      <button 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <Menu size={20} className="text-gray-600" />
      </button>
      
      <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
        APH PERFUME
      </h1>
    </div>
    
    <div className="flex items-center">
      <div className="relative" ref={dropdownRef}>
        <button 
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <img 
            src={user?.profilePictureUrl || "/empavt.jpg"} 
            alt="Avatar" 
            className="w-8 h-8 rounded-full object-cover" 
          />
          <div className="hidden md:block text-left">
            <div className="font-medium">{user?.fullName || 'Không xác định'}</div>
            <div className="text-xs flex items-center space-x-1">
              {user?.roles?.length > 0 ? (
                <>
                  <span className="px-2 py-0.5 bg-gray-200 rounded text-xs">{user.roles[0]}</span>
                  {user.roles.length > 1 && (
                    <div className="relative group">
                      <span className="cursor-pointer text-xs text-gray-500">+{user.roles.length-1}</span>
                      <div className="absolute right-0 top-full mt-1 hidden group-hover:block bg-white border rounded shadow-lg p-2 text-sm z-50 w-max">
                        <div className="flex flex-col space-y-1">
                          {user.roles.slice(1).map((role, index) => (
                            <span key={index} className="whitespace-nowrap">{role}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : 'Không có vai trò'}
            </div>
          </div>
          <ChevronDown size={16} className={`text-gray-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100">
            <button 
              onClick={handleProfileClick}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Settings size={16} className="mr-2" />
              Cài đặt
            </button>
            <button 
              onClick={() => setShowLogoutConfirm(true)}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              <LogOut size={16} className="mr-2" />
              Đăng xuất
            </button>
          </div>
        )}
        
        {/* Logout Confirmation Modal */}
        {showLogoutConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Xác nhận đăng xuất</h3>
              <p className="text-gray-500 mb-6">Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?</p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  Huỷ
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  </header>
  )
}

export default Header
