import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { mergeGuestCartWithUserCart } = useCart();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    

    if (formData.email && formData.password) {
      const userData = {
        id: '1',
        name: 'Người dùng',
        email: formData.email
      };
      
      login(userData);
      mergeGuestCartWithUserCart(userData.id);
      navigate('/');
    } else {
      setError('Vui lòng nhập email và mật khẩu');
    }
  };

  return (
    <div className="login-container">
      <h2>Đăng nhập</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Mật khẩu</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn-primary">Đăng nhập</button>
      </form>
    </div>
  );
};

export default Login;