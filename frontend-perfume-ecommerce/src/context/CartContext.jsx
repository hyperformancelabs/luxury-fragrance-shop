import { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import { v4 as uuidv4 } from 'uuid';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [guestId, setGuestId] = useState('');

  // Khởi tạo giỏ hàng khi component mount
  useEffect(() => {
    // Nếu người dùng đã đăng nhập
    if (user) {
      const userCart = localStorage.getItem(`cart_${user.id}`);
      if (userCart) {
        setCart(JSON.parse(userCart));
      }
    } else {
      // Nếu là khách
      let storedGuestId = localStorage.getItem('guestId');
      if (!storedGuestId) {
        storedGuestId = uuidv4();
        localStorage.setItem('guestId', storedGuestId);
      }
      setGuestId(storedGuestId);

      const guestCart = localStorage.getItem(`cart_guest_${storedGuestId}`);
      if (guestCart) {
        setCart(JSON.parse(guestCart));
      }
    }
  }, [user]);

  // Cập nhật giỏ hàng trong localStorage khi giỏ hàng thay đổi
  useEffect(() => {
    if (cart.length > 0) {
      if (user) {
        localStorage.setItem(`cart_${user.id}`, JSON.stringify(cart));
      } else if (guestId) {
        localStorage.setItem(`cart_guest_${guestId}`, JSON.stringify(cart));
      }
    }
  }, [cart, user, guestId]);

  // Hàm thêm sản phẩm vào giỏ hàng
  const addToCart = (product) => {
    setCart(prevCart => {
      // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
      const existingItem = prevCart.find(item => item.id === product.id);
      
      if (existingItem) {
        // Nếu đã có, tăng số lượng
        return prevCart.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        // Nếu chưa có, thêm mới với số lượng là 1
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  // Hàm xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  // Hàm cập nhật số lượng sản phẩm
  const updateQuantity = (productId, quantity) => {
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === productId 
          ? { ...item, quantity: quantity } 
          : item
      )
    );
  };

  // Hàm tính tổng tiền giỏ hàng
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Hàm xóa toàn bộ giỏ hàng
  const clearCart = () => {
    setCart([]);
    if (user) {
      localStorage.removeItem(`cart_${user.id}`);
    } else if (guestId) {
      localStorage.removeItem(`cart_guest_${guestId}`);
    }
  };

  // Hàm chuyển giỏ hàng từ khách sang người dùng khi đăng nhập
  const mergeGuestCartWithUserCart = (userId) => {
    const guestCart = localStorage.getItem(`cart_guest_${guestId}`);
    if (guestCart) {
      const guestCartItems = JSON.parse(guestCart);
      localStorage.setItem(`cart_${userId}`, JSON.stringify(guestCartItems));
      localStorage.removeItem(`cart_guest_${guestId}`);
      setCart(guestCartItems);
    }
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      calculateTotal,
      clearCart,
      mergeGuestCartWithUserCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);