import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from './Components/Sidebar';
import Header from './Components/Header';
import Dashboard from './pages/Dashboard';
import OrderManagement from './pages/OrderManagement';
import Products from './pages/Products';
import DefaultContent from './Components/DeafaultContent';
import Customer from './pages/Customer';
import Materials from './pages/Materials';
import Marketing from './pages/Marketing';
import Staff from './pages/Staff';
import Login from './pages/Login';
import Forgot from './pages/Forgot';
import EmployeeProfile from './pages/EmployeeProfile';
import ProtectedRoute from './Components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import AiStatistics from './pages/AiStatistics';

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-5 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <div className={`flex-1 transition-all duration-300 pt-16 ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/statistics" element={<AiStatistics />} />
            <Route path="/orders" element={<OrderManagement />} />
            <Route path="/products" element={<Products />} />
            <Route path="/customers" element={<Customer />} />
            <Route path="/materials" element={<Materials />} />
            <Route path="/marketings" element={<Marketing />} />
            <Route path="/staffs" element={<Staff />} />
            <Route path="/profile" element={<EmployeeProfile />} />
            <Route path="*" element={<DefaultContent title="Trang không tồn tại" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/*" element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        } />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </AuthProvider>
  );
};

export default App;
