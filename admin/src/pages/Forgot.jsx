import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import authService from '../services/authService';

const API_URL = 'http://localhost:8080/api/v1';

const Forgot = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_URL}/emp/employees?search=${encodeURIComponent(email)}&page=0&size=1`,
        { headers: authService.getAuthHeader() }
      );
      const list = res.data.data.employees;
      if (!list || list.length === 0) {
        setError('Email không tồn tại');
        setLoading(false);
        return;
      }
      setUsername(list[0].username);
      await axios.post(
        `${API_URL}/verification/request-code?type=PASSWORD_RESET`,
        { email, userType: 'EMPLOYEE' },
        { headers: authService.getAuthHeader() }
      );
      toast.success('Mã xác thực đã được gửi đến email');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Lỗi hệ thống');
    } finally {
      setLoading(false);
    }
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post(
        `${API_URL}/verification/verify-code?type=PASSWORD_RESET`,
        { code, email },
        { headers: authService.getAuthHeader() }
      );
      if (res.data.data === true) {
        toast.success('Mã xác thực hợp lệ');
        setStep(3);
      } else {
        setError('Mã xác thực không hợp lệ');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Lỗi hệ thống');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }
    setLoading(true);
    try {
      await axios.post(
        `${API_URL}/auth/reset-password`,
        { email, code, newPassword, confirmPassword },
        { headers: authService.getAuthHeader() }
      );
      toast.success('Đặt lại mật khẩu thành công');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Lỗi hệ thống');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full relative">
      <img src="/bg.jpg" alt="" className="absolute w-full h-full object-cover" />
      <div className="w-full h-full flex absolute justify-center items-center">
        <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-lg w-96">
          <h1 className="text-xl font-bold mb-6 text-center">Quên Username/Password</h1>

          {step === 1 && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 bg-black text-white rounded-md hover:bg-gray-800 disabled:bg-gray-400"
              >
                {loading ? 'Gửi...' : 'Gửi mã xác thực'}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleCodeSubmit} className="space-y-4">
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                  Mã xác thực (6 chữ số)
                </label>
                <input
                  type="text"
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  maxLength={6}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 bg-black text-white rounded-md hover:bg-gray-800 disabled:bg-gray-400"
              >
                {loading ? 'Xác thực...' : 'Xác thực mã'}
              </button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleResetSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <div className="mt-1 relative">
                  <input
                    type="text"
                    value={username}
                    readOnly
                    className="block w-full border border-gray-300 rounded-md bg-gray-100 p-2"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  Mật khẩu mới
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Xác nhận mật khẩu
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 bg-black text-white rounded-md hover:bg-gray-800 disabled:bg-gray-400"
              >
                {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
              </button>
            </form>
          )}

          {error && <div className="mt-4 text-sm text-red-600 text-center">{error}</div>}
          <div className="mt-6 text-center">
            <Link to="/login" className="text-blue-600 hover:underline">
              Quay lại Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forgot;
