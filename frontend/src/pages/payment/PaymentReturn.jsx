import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { toast } from 'sonner';
import { useCart } from '../../context/CartContext';
import ErrorMessages from '../../constants/ErrorMessages';
import SuccessMessages from '../../constants/SuccessMessages';

const PaymentReturn = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, calculateTotal } = useCart();

  const query = new URLSearchParams(location.search);
  const status = query.get('status');
  const method = query.get('method');

  const customer = JSON.parse(localStorage.getItem('checkoutCustomer')); // đã lưu trước đó

  useEffect(() => {
    if (status === 'success' && customer && cart.length > 0) {
      const orderData = {
        customer,
        paymentMethod: method,
        items: cart,
        totalAmount: calculateTotal()
      };

      fetch('https://api-perfume-alpha.vercel.app/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      })
        .then(res => res.json())
        .then(data => {
          toast.success(SuccessMessages.CHECKOUT_SUCCESS || "Đặt hàng thành công!");
          navigate('/ordersuccess');
        })
        .catch(err => {
          toast.error(ErrorMessages.CHECKOUT_FAIL || "Lỗi khi lưu đơn hàng!");
        });
    }
  }, [status]);

  return (
    <div className="text-center py-10 text-xl">Đang xử lý thanh toán...</div>
  );
};

export default PaymentReturn;
