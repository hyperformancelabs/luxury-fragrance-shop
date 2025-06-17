import { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { toast } from 'sonner';
import ErrorMessages from '../constants/ErrorMessages';
import SuccessMessages from "../constants/SuccessMessages";

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
      const index = prevCart.findIndex(item => item.productVariantId === product.productVariantId);
      
      let itemToUpdate = null;
      let currentQuantityInCart = 0;
      let availableStock = product.quantityInStock || 0; // Default to 0 if not provided in the incoming product

      if (index >= 0) {
        itemToUpdate = prevCart[index];
        currentQuantityInCart = itemToUpdate.quantity;
        // Use the quantityInStock stored in the cart item if available, otherwise use the incoming product's stock
        availableStock = itemToUpdate.quantityInStock || product.quantityInStock || 0; 
      }

      const desiredQuantity = currentQuantityInCart + product.quantity;

      if (desiredQuantity > availableStock) {
        toast.error(`Số lượng sản phẩm trong kho không đủ cho yêu cầu của bạn. Còn lại: ${availableStock}`);
        return prevCart; // Do not update cart if quantity exceeds stock
      }

      if (index >= 0) {
        const updatedCart = [...prevCart];
        updatedCart[index].quantity = desiredQuantity;
        return updatedCart;
      } else {
        return [
          ...prevCart,
          {
            productVariantId: product.productVariantId,
            productName: product.productName || "Unknown Product", 
            volume: product.volume, 
            unitPrice: product.unitPrice, 
            quantity: desiredQuantity, // Use desiredQuantity for new item
            imageUrl: product.imageUrl || "", 
            brandName: product.brandName || "",
            note: product.note || "",
            quantityInStock: availableStock // Store the validated stock
          }
        ];
      }
    });
  };

  const removeFromLocalCart = (productVariantId) => {
    setLocalCart(prevCart => prevCart.filter(item => item.productVariantId !== productVariantId));
  };

  const updateLocalCartQuantity = (productVariantId, newQuantity) => {
    setLocalCart(prevCart => {
      const itemToUpdate = prevCart.find(item => item.productVariantId === productVariantId);

      if (!itemToUpdate) return prevCart; // Item not found in cart

      if (newQuantity < 1) {
        toast.error(ErrorMessages.INVALID_QUANTITY);
        return prevCart; // Prevent quantity from going below 1
      }

      if (newQuantity > itemToUpdate.quantityInStock) {
        toast.error(`Số lượng sản phẩm trong kho không đủ cho yêu cầu của bạn. Còn lại: ${itemToUpdate.quantityInStock}`);
        return prevCart; // Do not update if quantity exceeds stock
      }

      return prevCart.map(item =>
        (item.productVariantId === productVariantId)
          ? { ...item, quantity: newQuantity }
          : item
      );
    });
  };

  const clearLocalCart = () => {
    setLocalCart([]);
    if (sessionId) {
      localStorage.removeItem(`cart_session_${sessionId}`);
    }
  };

  const calculateLocalTotal = () => {
    return localCart.reduce((total, item) => total + (item.unitPrice * item.quantity), 0);
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
          productVariantId: item.productVariantId,
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
        toast.error(err.response?.data?.message || ErrorMessages.ADD_TO_CART_FAIL);
      }
    } else {
      addToLocalCart({
        productVariantId: product.productVariantId,
        productName: product.productName, 
        volume: product.volume, 
        unitPrice: product.unitPrice, 
        quantity: product.quantity,
        imageUrl: product.imageUrl,
        brandName: product.brandName,
        note: product.note
      });
    }
  };

  const updateQuantityInCart = async (cartItemId, newQuantity, productVariantId) => {
    if (newQuantity < 1) {
      toast.error(ErrorMessages.INVALID_QUANTITY);
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://localhost:8080/api/v1/carts/update",
        {
          cartItemId,
          newQuantity,
          productVariantId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      loadCart();
    } catch (err) {
      console.error("Error updating quantity:", err.response?.data || err);
      toast.error(err.response?.data?.message || "Không thể cập nhật số lượng sản phẩm");
    }
  };
  const deleteItemFromCart = async (productVariantId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8080/api/v1/carts/remove-item/${productVariantId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      loadCart();
      toast.success(SuccessMessages.REMOVE_FROM_CART_SUCCESS || "Đã xóa sản phẩm khỏi giỏ hàng");
    } catch (err) {
      console.error("Error deleting item from cart:", err.response?.data || err);
      toast.error(ErrorMessages.CART_ITEM_DELETE_FAIL || "Không thể xóa sản phẩm khỏi giỏ hàng");
    }
  }

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
      deleteItemFromCart,
      syncCartToServer
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
