import React, { useState } from 'react';
import { toast } from 'sonner';
import SuccessMessages from "../../frontend/src/constants/SuccessMessages";

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt with:', username);
    toast.success(SuccessMessages.LOGIN_SUCCESS || "Đăng nhập thành công");
    window.location.href = "/"
  };

  return (
    <div className="flex h-screen w-full relative">
      {/* Background Image */}
      <img src="/bg.jpg" alt="" className="absolute w-full h-full object-cover" />
      
      {/* Content Container */}
      <div className="w-full h-full flex absolute justify-center items-center">
        <div className="flex flex-col items-center">
          {/* Title */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-red-600">ĐĂNG NHẬP QUẢN TRỊ APH PERFUME</h1>
          </div>
          
          {/* Login Form */}
          <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-lg w-96">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none"
                >
                  Đăng nhập
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;