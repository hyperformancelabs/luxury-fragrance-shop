import { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import { v4 as uuidv4 } from 'uuid';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [guestId, setGuestId] = useState('');


  useEffect(() => {
    if (user) {
      const userCart = localStorage.getItem(`cart_${user.id}`);
      if (userCart) {
        setCart(JSON.parse(userCart));
      }
    } else {
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


  useEffect(() => {
    if (cart.length > 0) {
      if (user) {
        localStorage.setItem(`cart_${user.id}`, JSON.stringify(cart));
      } else if (guestId) {
        localStorage.setItem(`cart_guest_${guestId}`, JSON.stringify(cart));
      }
    }
  }, [cart, user, guestId]);

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      
      if (existingItem) {
        return prevCart.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );

      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
    console.log('Đã thêm sản phẩm vào giỏ')

  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === productId 
          ? { ...item, quantity: quantity } 
          : item
      )
    );
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };


  const clearCart = () => {
    setCart([]);
    if (user) {
      localStorage.removeItem(`cart_${user.id}`);
    } else if (guestId) {
      localStorage.removeItem(`cart_guest_${guestId}`);
    }
  };


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