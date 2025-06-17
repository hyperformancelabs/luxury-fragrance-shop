import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import ErrorMessages from "../constants/ErrorMessages";
import SuccessMessages from "../constants/SuccessMessages";
import { useCart } from "./CartContext";

const WishlistContext = createContext();
const LOCAL_WISHLIST_KEY = "guest_wishlist";

const getLocalWishlist = () => {
  return JSON.parse(localStorage.getItem(LOCAL_WISHLIST_KEY)) || [];
};

const saveLocalWishlist = (wishlist) => {
  localStorage.setItem(LOCAL_WISHLIST_KEY, JSON.stringify(wishlist));
};

const fetchVariantDetails = async (variantId) => {
  try {
    const res = await axios.get(`http://localhost:8080/api/v1/wishlist/variant/${variantId}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching variant details", error);
    return null;
  }
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  const { loadCart } = useCart();

  const fetchWishlist = async () => {
    setLoading(true);
    if (isLoggedIn) {
      try {
        const res = await axios.get("http://localhost:8080/api/v1/wishlist", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishlist(res.data);
      } catch (err) {
        toast.error(ErrorMessages.FETCH_WISHLIST_FAILED);
        console.error(err);
      } finally {
        setLoading(false);
      }
    } else {
      const local = getLocalWishlist();
      const detailed = await Promise.all(
        local.map(async (id) => await fetchVariantDetails(id))
      );
      setWishlist(detailed.filter(Boolean));
      setLoading(false);
    }
  };

  const addToWishlist = async (productVariantId) => {
    if (isLoggedIn) {
      try {
        await axios.post(
          "http://localhost:8080/api/v1/wishlist",
          { productVariantId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success(SuccessMessages.ADD_TO_WISHLIST_SUCCESS);
        fetchWishlist();
      } catch (err) {
        toast.error(ErrorMessages.WISHLIST_ERROR);
        console.error(err);
      }
    } else {
      const local = getLocalWishlist();
      if (!local.includes(productVariantId)) {
        local.push(productVariantId);
        saveLocalWishlist(local);
        const details = await fetchVariantDetails(productVariantId);
        if (details) {
          setWishlist((prev) => [...prev, details]);
          toast.success(SuccessMessages.ADD_TO_WISHLIST_SUCCESS);
        }
      }
    }
  };

  const removeFromWishlist = async (productVariantId) => {
    if (isLoggedIn) {
      try {
        await axios.delete(
          `http://localhost:8080/api/v1/wishlist/${productVariantId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success(SuccessMessages.REMOVE_FROM_WISHLIST_SUCCESS);
        fetchWishlist();
      } catch (err) {
        toast.error(ErrorMessages.WISHLIST_ERROR);
        console.error(err);
      }
    } else {
      const local = getLocalWishlist();
      const updated = local.filter(id => id !== productVariantId);
      saveLocalWishlist(updated);
      setWishlist((prev) => prev.filter(item => item.productVariantId !== productVariantId));
      toast.success(SuccessMessages.REMOVE_FROM_WISHLIST_SUCCESS);
    }
  };

  const moveAllToCart = async () => {
    if (!isLoggedIn) return toast.error("Bạn cần đăng nhập để thực hiện thao tác này.");
    try {
      await axios.post(
        "http://localhost:8080/api/v1/wishlist/move-to-cart",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(SuccessMessages.MOVE_TO_CART);
      fetchWishlist();
      loadCart();
    } catch (err) {
      toast.error(ErrorMessages.MOVE_TO_CART);
      console.error(err);
    }
  };

  const moveItemToCart = async (productVariantId) => {
    if (!isLoggedIn) return toast.error("Bạn cần đăng nhập để thực hiện thao tác này.");
    try {
      await axios.post(
        `http://localhost:8080/api/v1/wishlist/move-item-to-cart/${productVariantId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(SuccessMessages.MOVE_TO_CART);
      fetchWishlist();
      loadCart();
    } catch (err) {
      toast.error(ErrorMessages.MOVE_TO_CART);
      console.error(err);
    }
  };

  const isInWishlist = (productVariantId) => {
    return wishlist.some((item) => {
      if (isLoggedIn) return item.productVariantId === productVariantId;
      else return item.productVariantId === productVariantId || item === productVariantId;
    });
  };

  useEffect(() => {
    fetchWishlist();
  }, [token]);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        fetchWishlist,
        addToWishlist,
        removeFromWishlist,
        moveAllToCart,
        isInWishlist,
        moveItemToCart,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
