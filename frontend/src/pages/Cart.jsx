import { Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";

const Cart = () => {
  const { user } = useAuth();
  const {
    cartItems,
    updateServerCartQuantity,
    removeFromServerCart,
    updateQuantityInCart,
    localCart,
    deleteItemFromCart,
  } = useCart();

  const currentCart = user ? cartItems : localCart;

  const cartTotal = currentCart.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  const [quantity, setQuantity] = useState(1);

  const formatPrice = (price, withVND = true) => {
    if (!price) return "0";
    const formatted = Number(price).toLocaleString("vi-VN");
    return withVND ? `${formatted} VND` : formatted;
  };

  const handleQuantityChange = (cartItemId, newQuantity, productVariantId) => {
    // console.log("Handle Quantity Change:");
    // console.log("Cart Item ID:", cartItemId);
    // console.log("New Quantity:", newQuantity);
    // console.log("Product Variant ID:", productVariantId);

    setQuantity(newQuantity);
    if (user) {
      toast.success("Cập nhật số lượng sản phẩm thành công");
      updateQuantityInCart(cartItemId, newQuantity, productVariantId);
    } else {
      toast.error("Không thể cập nhật số lượng sản phẩm trong giỏ hàng");
    }
  };

  if (currentCart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <h2 className="text-2xl font-semibold mb-2">Giỏ hàng trống</h2>
        <p className="text-gray-600 mb-6">
          Vui lòng thêm sản phẩm vào giỏ hàng
        </p>
        <Link
          to="/category?gender=Men"
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
        >
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center justify-center bg-gray-50 p-4 rounded mb-8">
        <div className="flex items-center font-bold">
          <span className="mr-1">🛒</span> Giỏ hàng
        </div>
        <div className="text-gray-300 mx-4">---------------</div>
        <div className="flex items-center text-gray-500">
          <span className="mr-1">💳</span> Thanh toán
        </div>
        <div className="text-gray-300 mx-4">---------------</div>
        <div className="flex items-center text-gray-500">
          <span className="mr-1">📦</span> Đơn hàng
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <div className="border-b pb-4 hidden md:grid md:grid-cols-12 font-medium text-sm">
            <div className="md:col-span-6">Sản phẩm</div>
            <div className="md:col-span-3 text-center">Số lượng</div>
            <div className="md:col-span-3 text-right">Tổng</div>
          </div>

          {currentCart.map((item, index) => (
            <div
              key={index}
              className="border-b py-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
            >
              <div className="md:col-span-6 flex items-center">
                <img
                  src={item.imageUrl || "/sp2.jpg"}
                  alt={item.name}
                  className="w-16 h-16 object-contain mr-4"
                />
                <div>
                  <h3 className="text-base font-medium">{item.productName}</h3>
                  <div className="flex gap-4">
                    <p className="text-sm text-gray-500">
                      Dung tích: {item.volume}ml
                    </p>
                    <p className="text-sm text-gray-500">
                      Brand: {item.brandName}
                    </p>
                  </div>

                  <p className="text-sm text-gray-500">Ghi chú: {item.note}</p>
                </div>
              </div>

              <div className="md:col-span-3 flex items-center justify-center">
                <div className="flex border border-gray-300">
                  <button
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition-colors"
                    onClick={() =>
                      handleQuantityChange(
                        item.cartItemId,
                        item.quantity - 1,
                        item.productVariantId
                      )
                    }
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M20 12H4"
                      ></path>
                    </svg>
                  </button>
                  <span className="flex items-center justify-center w-12 font-medium">
                    {item.quantity}
                  </span>
                  <button
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition-colors"
                    onClick={() =>
                      handleQuantityChange(
                        item.cartItemId,
                        item.quantity + 1,
                        item.productVariantId
                      )
                    }
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 4v16m8-8H4"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>

              <div className="md:col-span-3 flex justify-between items-center">
                <span className="text-red-600 font-bold md:ml-auto">
                  {formatPrice(item.unitPrice)}
                </span>
                <button
                  className="p-2 text-gray-500"
                  onClick={() =>
                    user
                      ? deleteItemFromCart(
                          // item.cartItemId,
                          item.productVariantId
                        )
                      : removeFromLocalCart(
                          item.cartItemId,
                          item.productVariantId
                        )
                  }
                >
                  <Trash2 />
                </button>
              </div>
            </div>
          ))}

          <div className="mt-6">
            <Link to="/category?gender=Men" className="text-gray-600 hover:text-gray-800">
              ← Tiếp tục mua sắm
            </Link>
          </div>
        </div>

        <div className="lg:w-1/3 bg-gray-50 p-6 h-fit">
          <h2 className="text-lg font-bold pb-4 border-b border-gray-200">
            TÓM TẮT ĐƠN HÀNG
          </h2>

          <div className="mt-4 space-y-3">
            {currentCart.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <div>
                  {item.productName} ({item.volume}ml)
                </div>
                <div>{formatPrice(item.unitPrice * item.quantity)}</div>
              </div>
            ))}
          </div>

          <div className="flex justify-between font-bold py-4 border-t text-red-600 border-gray-200 mt-4">
            <div>Tổng đơn hàng</div>
            <div>{formatPrice(cartTotal)}</div>
          </div>

          <Link to="/checkout">
            <button className="w-full bg-blue-500 text-white py-3 rounded mt-4 font-bold hover:bg-blue-600 transition">
              Tiếp tục
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
