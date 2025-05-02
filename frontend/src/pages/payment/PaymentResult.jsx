import React, { useEffect, useState } from 'react';

const PaymentResult = () => {
  const [status, setStatus] = useState(null);
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const statusParam = params.get('status');
    const orderIdParam = params.get('orderId');

    setStatus(statusParam);
    setOrderId(orderIdParam);

    if (window.opener) {
      window.opener.postMessage(
        { orderId: orderIdParam, status: statusParam },
        'http://localhost:5173' 
      );
    }

    const timer = setTimeout(() => {
      window.close();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center px-4">
      {status === 'completed' ? (
        <>
          <h1 className="text-2xl font-bold text-green-600 mb-2"> Thanh toán thành công!</h1>
          <p className="text-gray-700 mb-4">
            Cảm ơn bạn đã thanh toán. Mã đơn hàng: <strong>{orderId}</strong>
          </p>
          <p className="text-sm text-gray-500">Cửa sổ này sẽ tự động đóng trong giây lát...</p>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold text-red-600 mb-2"> Thanh toán thất bại</h1>
          <p className="text-gray-700 mb-4">Vui lòng thử lại hoặc chọn phương thức khác.</p>
          <p className="text-sm text-gray-500">Cửa sổ này sẽ tự động đóng trong giây lát...</p>
        </>
      )}
    </div>
  );
};

export default PaymentResult;
