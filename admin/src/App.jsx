import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './Components/Sidebar';
import Header from './Components/Header';
import Dashboard from './pages/Dashboard';
import Statistics from './pages/Statistics';
import Orders from './pages/Orders';
import Products from './pages/Products';
import DefaultContent from './Components/DeafaultContent';
import Customer from './pages/Customer';
import Materials from './pages/Materials';
import Marketing from './pages/Marketing';
import Staff from './pages/Staff';
import Login from './pages/Login';

const AppLayout = () => {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64 transition-all duration-300">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/products" element={<Products />} />
            <Route path="/customers" element={<Customer />} />
            <Route path="/materials" element={<Materials />} />
            <Route path="/marketings" element={<Marketing />} />
            <Route path="/staffs" element={<Staff />} />
            <Route path="*" element={<DefaultContent title="Trang không tồn tại" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/*" element={<AppLayout />} />
    </Routes>
  );
};

export default App;
