import React, { useState } from 'react';
import { toast } from 'sonner';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(username, password);
      toast.success("Đăng nhập thành công");
      // Redirect to the page they tried to visit or to dashboard
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (error) {
      let msg = error.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.";
      // Prefer backend message if available
      if (typeof error === 'object' && error?.message) {
        msg = error.message;
      }
      setError(msg);
      toast.error(msg);
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
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
                  className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
                  required
                />
                {error && (
                  <div className="mt-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2 flex items-center gap-2 animate-fade-in">
                    <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0Z"/></svg>
                    <span>{error}</span>
                  </div>
                )}
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Đang xử lý...
                    </>
                  ) : (
                    'Đăng nhập'
                  )}
                </button>
              </div>
            </form>
            <div className="mt-4 text-sm text-center">
              <Link to="/forgot" className="text-blue-600 hover:underline">Quên mật khẩu?</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;