import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

const TestProduct = () => {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();
  
  useEffect(() => {
    // Giả lập dữ liệu sản phẩm
    // Trong thực tế, bạn sẽ gọi API để lấy danh sách sản phẩm
    const dummyProducts = [
      { id: '1', name: 'Sản phẩm 1', price: 100000, description: 'Mô tả sản phẩm 1' },
      { id: '2', name: 'Sản phẩm 2', price: 200000, description: 'Mô tả sản phẩm 2' },
      { id: '3', name: 'Sản phẩm 3', price: 300000, description: 'Mô tả sản phẩm 3' },
      { id: '4', name: 'Sản phẩm 4', price: 400000, description: 'Mô tả sản phẩm 4' },
    ];
    
    setProducts(dummyProducts);
  }, []);

  return (
    <div className="product-list">
      <h2>Danh sách sản phẩm</h2>
      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <h3>{product.name}</h3>
            <p className="product-description">{product.description}</p>
            <p className="product-price">{product.price.toLocaleString()} VND</p>
            <button 
              className="add-to-cart-btn"
              onClick={() => addToCart(product)}
            >
              Thêm vào giỏ hàng
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestProduct;