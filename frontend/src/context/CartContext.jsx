import { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [sessionId, setSessionId] = useState('');
  const [localCart, setLocalCart] = useState([]);
  const [cartInfo, setCartInfo] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  const createSessionId = () => {
    const newSessionId = uuidv4();
    localStorage.setItem('sessionId', newSessionId);
    setSessionId(newSessionId);
  };

  useEffect(() => {
    if (user) {
      loadCart();
      const storedSession = localStorage.getItem('sessionId');
      if (storedSession) {
        localStorage.removeItem(`cart_session_${storedSession}`);
        localStorage.removeItem('sessionId');
      }
      setSessionId('');
      setLocalCart([]);
    } else {
      let stored = localStorage.getItem('sessionId');
      if (!stored) {
        createSessionId();
      } else {
        setSessionId(stored);
      }

      const guestCart = localStorage.getItem(`cart_session_${stored}`);
      if (guestCart) {
        setLocalCart(JSON.parse(guestCart));
      }
    }
  }, [user]);

  useEffect(() => {
    if (!user && sessionId) {
      localStorage.setItem(`cart_session_${sessionId}`, JSON.stringify(localCart));
    }
  }, [localCart, sessionId, user]);

  const addToLocalCart = (product) => {
    setLocalCart(prevCart => {
      const index = prevCart.findIndex(item => item.id === product.id && item.selectedSize === product.selectedSize);
      if (index >= 0) {
        const updatedCart = [...prevCart];
        updatedCart[index].quantity += product.quantity;
        return updatedCart;
      } else {
        return [...prevCart, product];
      }
    });
  };

  const removeFromLocalCart = (id, size) => {
    setLocalCart(prevCart => prevCart.filter(item => !(item.id === id && item.selectedSize === size)));
  };

  const updateLocalCartQuantity = (id, size, newQuantity) => {
    setLocalCart(prevCart =>
      prevCart.map(item =>
        (item.id === id && item.selectedSize === size)
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearLocalCart = () => {
    setLocalCart([]);
    if (sessionId) {
      localStorage.removeItem(`cart_session_${sessionId}`);
    }
  };

  const calculateLocalTotal = () => {
    return localCart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const loadCart = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/v1/carts', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const cartItems = response.data;
      const total = cartItems.reduce(
        (sum, item) => sum + item.unitPrice * item.quantity, 0
      );

      setCartItems(cartItems);
      setCartInfo({
        status: 'active',
        totalAmount: total
      });
    } catch (err) {
      console.error('Error loading cart:', err);
    }
  };

  const syncCartToServer = async () => {
    const token = localStorage.getItem('token');
    if (!token || localCart.length === 0) return;
  
    try {
      const payload = {
        cartItems: localCart.map(item => ({
          productVariantId: item.variantId,
          quantity: item.quantity,
          note: item.note || ''
        }))
      };
  
      await axios.post('http://localhost:8080/api/v1/carts/sync', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      clearLocalCart();
      loadCart();
    } catch (err) {
      console.error('Error syncing cart:', err);
    }
  };

  const addToCart = async (product) => {
    if (user) {
      try {
        const payload = {
          productVariantId: product.productVariantId,
          quantity: product.quantity,
          note: product.note || ""
        };

        const token = localStorage.getItem("token");
        await axios.post("http://localhost:8080/api/v1/carts/add", payload, {
          headers: { Authorization: `Bearer ${token}` }
        });

        loadCart();
      } catch (err) {
        console.error("Error adding to cart:", err.response?.data || err);
      }
    } else {
      addToLocalCart(product);
    }
  };

  const updateQuantityInCart = async (cartItemId, newQuantity, productVariantId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://localhost:8080/api/v1/carts/update",
        {
          cartItemId: cartItemId,
          newQuantity: newQuantity,
          productVariantId: productVariantId
        },
        {
          headers: { Authorization: `Bearer ${token}` }  
        }
      );
      loadCart();
    } catch (err) {
      console.error("Error updating quantity:", err.response?.data || err);
    }
  };

  return (
    <CartContext.Provider value={{
      sessionId,
      localCart,
      setLocalCart,
      addToLocalCart,
      removeFromLocalCart,
      updateLocalCartQuantity,
      calculateLocalTotal,
      clearLocalCart,
      cartInfo,
      cartItems,
      loadCart,
      addToCart,
      setCartInfo,
      setCartItems,
      updateQuantityInCart,
      syncCartToServer
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
