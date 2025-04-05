import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, calculateTotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="empty-cart">
        <h2>Giỏ hàng trống</h2>
        <p>Vui lòng thêm sản phẩm vào giỏ hàng</p>
        <Link to="/products" className="btn-primary">Tiếp tục mua sắm</Link>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>Giỏ hàng của bạn</h2>
      <div className="cart-items">
        {cart.map(item => (
          <div key={item.id} className="cart-item">
            <div className="item-info">
              <h3>{item.name}</h3>
              <p>{item.price.toLocaleString()} VND</p>
            </div>
            <div className="item-actions">
              <div className="quantity-control">
                <button 
                  onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                  +
                </button>
              </div>
              <button 
                className="remove-btn"
                onClick={() => removeFromCart(item.id)}
              >
                Xóa
              </button>
            </div>
            <div className="item-total">
              {(item.price * item.quantity).toLocaleString()} VND
            </div>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <div className="total">
          <span>Tổng cộng:</span>
          <span>{calculateTotal().toLocaleString()} VND</span>
        </div>
        <button className="checkout-btn">Thanh toán</button>
      </div>
    </div>
  );
};

export default Cart;
