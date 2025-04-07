import {
  ChevronLeft,
  ChevronLeftSquare,
  ChevronRight,
  ChevronRightSquare,
} from "lucide-react";
import React, { useEffect, useState } from "react";

const FlashDeal = () => {
      const [selectedSize, setSelectedSize] = useState('75ml');
    const sizes = [
        { value: '50ml', label: '50ml' },
        { value: '75ml', label: '75ml' },
        { value: '100ml', label: '100ml' },
        { value: '120ml', label: '120ml' },
        { value: '200ml', label: '200ml' }
      ];

  const [showPopup, setShowPopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleQuickView = (product) => {
    console.log("Product clicked:", product); // Kiểm tra log ở đây
    setSelectedProduct(product); // Cập nhật sản phẩm đã chọn
    setShowPopup(true); // Hiển thị popup
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedProduct(null);
  };

  const [timeLeft, setTimeLeft] = useState({
    hours: 5,
    minutes: 30,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (time) => {
    return time < 10 ? `0${time}` : time;
  };

  const products = [
    {
      name: "Versace Eros Flame Eau De Toilette",
      price: "1.200.000 - 1.500.000 VND",
      brand: "VERSACE",
      img: "sp2.jpg",
    },
    {
      name: "Versace Eros Eau De Toilette",
      price: "1.000.000 - 1.200.000 VND",
      brand: "VERSACE",
      img: "sp2.jpg",
    },
    {
      name: "Versace Bright Crystal",
      price: "1.100.000 - 1.400.000 VND",
      brand: "VERSACE",
      img: "sp2.jpg",
    },
    {
      name: "Versace Pour Homme",
      price: "1.300.000 - 1.600.000 VND",
      brand: "VERSACE",
      img: "sp2.jpg",
    },
    {
      name: "Versace Crystal Noir",
      price: "1.400.000 - 1.700.000 VND",
      brand: "VERSACE",
      img: "sp2.jpg",
    },
    {
      name: "Versace Dylan Blue",
      price: "1.500.000 - 1.800.000 VND",
      brand: "VERSACE",
      img: "sp2.jpg",
    },
  ];

  return (
    <div className="flex m-12 relative">
      <div className="flex absolute -translate-y-4 translate-x-12 items-center bg-gradient-to-r from-red-500 to-red-700 text-white py-2 px-4 rounded-lg shadow-lg">
        <svg
          width="18"
          height="24"
          className="fill-yellow-300 animate-pulse"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M14.394 11.6854C14.349 11.5226 14.2702 11.371 14.1626 11.2407C14.0551 11.1104 13.9212 11.0043 13.7698 10.9293L9.70106 8.91289L10.7933 1.36344C10.8292 1.10179 10.7778 0.835614 10.6471 0.606141C10.5164 0.376669 10.3136 0.196718 10.0702 0.094173C9.82685 -0.00837155 9.55645 -0.0277836 9.30093 0.0389447C9.0454 0.105673 8.81902 0.254816 8.65686 0.463262L0.255241 11.2653C0.141203 11.411 0.0623685 11.581 0.0248924 11.7621C-0.0125837 11.9433 -0.00768753 12.1306 0.0391991 12.3095C0.0921791 12.4886 0.184268 12.6536 0.30881 12.7926C0.433351 12.9317 0.587235 13.0414 0.759338 13.1137L5.88433 15.1661L4.79212 22.6315C4.75499 22.8995 4.80946 23.1721 4.94672 23.4052C5.08397 23.6383 5.29594 23.8183 5.54826 23.9158C5.68891 23.9741 5.84011 24.0027 5.99235 23.9998C6.19003 23.9988 6.38441 23.9489 6.5582 23.8547C6.73199 23.7605 6.87981 23.6248 6.98854 23.4597L14.1899 12.6576C14.2914 12.5195 14.3621 12.3613 14.3972 12.1936C14.4324 12.0259 14.4313 11.8526 14.394 11.6854Z" />
        </svg>
        <h2 className="text-white font-bold text-xl ml-2">Flash Deal</h2>
      </div>
      <div className="flex absolute space-x-4 right-0 mr-8 bg-white px-4 -translate-y-4 items-center">
        <div className="text-black font-semibold">Kết thúc sau:</div>
        <div className="flex space-x-2">
          <div className="bg-red-600 text-white rounded-md py-1 px-2 flex items-center justify-center min-w-12">
            <span className="font-bold text-xl">
              {formatTime(timeLeft.hours)}
            </span>
          </div>
          <span className="font-bold text-xl">:</span>
          <div className="bg-red-600 text-white rounded-md py-1 px-2 flex items-center justify-center min-w-12">
            <span className="font-bold text-xl">
              {formatTime(timeLeft.minutes)}
            </span>
          </div>
          <span className="font-bold text-xl">:</span>
          <div className="bg-red-600 text-white rounded-md py-1 px-2 flex items-center justify-center min-w-12">
            <span className="font-bold text-xl">
              {formatTime(timeLeft.seconds)}
            </span>
          </div>
        </div>
      </div>
      <div className="w-full items-center top-1/2 absolute">
        <div className="absolute w-12 h-12 left-0 bg-white rounded-full flex items-center justify-center shadow-lg">
          <button className="absolute">
            <ChevronLeft className="w-12 h-12 text-red-600" />
          </button>
        </div>
        <button className="absolute right-0 ">
          <ChevronRight className="w-12 h-12" />
        </button>
      </div>
      <div className="p-8 border-2 rounded-lg mx-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {products.map((product, index) => (
            <div
              key={index}
              className="flex flex-col items-center border-2 border-gray-300 rounded-lg p-4"
            >
              <img
                src={product.img}
                alt={product.name}
                className="h-40 w-auto"
              />
              <div className="flex flex-col items-center mt-4">
                <h3 className="font-bold">{product.brand}</h3>
                <p className="font-medium text-sm">{product.name}</p>
                <div className="font-extrabold text-xs text-red-600">
                  {product.price}
                </div>
                <div className="flex justify-between w-full mt-2">
                  <button className="p-2 text-white text-xs rounded-md bg-red-600">
                    Yêu thích
                  </button>
                  <button
                    className="p-2 text-white text-xs rounded-md bg-black"
                    onClick={() => {
                      console.log("Bấm nút"), handleQuickView(product);
                    }}
                  >
                    Xem nhanh
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          className="cursor-pointer"
          onClick={() => {
            console.log("Bấm nút"), handleQuickView(product);
          }}
        >
          heheeheheh
        </button>
      </div>
      {showPopup && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50  flex items-center justify-center z-50">
         
          <div className="bg-white p-6 rounded w-full max-w-4xl relative flex"> 
          <button
            className="absolute top-0 right-2 text-red-600 text-4xl font-bold"
            onClick={handleClosePopup}
          >
            &times;
          </button>
          <div className="w-1/2">
          <div className="flex-shrink-0 w-full">
            <div className="mb-4 flex justify-center items-center border">
              <img 
                src="/sp2.jpg"
                alt="Versace Bright Crystal" 
                className="w-64 h-64" 
              />
            </div>
            
            <div className="flex gap-2">
              <img src="/sp2.jpg" alt="Thumbnail 1" className="w-24 h-24 border" />
              <img src="/sp2.jpg" alt="Thumbnail 2" className="w-24 h-24 border" />
            </div>
          </div>
          </div>
          <div className="p-4 w-1/2 flex flex-col justify-start items-start">
            <p className="text-start text-xl font-bold mb-4">{selectedProduct.name}</p>
           <div className="flex justify-between items-center w-full">
           <p className="text-base">Thương hiệu: <span className="text-red-600 font-semibold">{selectedProduct.brand}</span></p>
           <p>Quốc gia: <span className="text-red-600 font-semibold">Pháp</span></p>
           </div>
            <p className="text-start text-red-600 font-bold my-2">{selectedProduct.price}</p>
            <div className="mb-4">
              <div className="flex gap-2 w-full justify-between">
                {sizes.map((size) => (
                  <button
                    key={size.value}
                    className={`border px-4 rounded-md ${
                      selectedSize === size.value 
                        ? size.value === '200ml' ? 'bg-black text-white' : 'border-black bg-black text-white' 
                        : 'border-gray-300'
                    }`}
                    onClick={() => handleSizeSelect(size.value)}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 mb-4 w-full">
                <p>Số lượng: </p>
                <div className="flex items-center gap-2">
                  <button className="border font-bold  border-gray-300 px-4 py-2 rounded-md">-</button>
                  <div className=" font-bold text-xl px-4 py-1 ">1</div>
                  <button className="border font-bold  border-gray-300 px-4 py-2 rounded-md">+</button>
                  </div>
            </div>
            <div className="flex gap-2 w-full justify-between">
                <button className="bg-gray-200 text-black px-4 py-2 rounded-md hover:bg-gray-300 transition duration-300">
                     Yêu thích
                </button>
              <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-300">
                Thêm vào giỏ hàng
              </button>
              <button className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition duration-300">
                Mua ngay
              </button>     
              </div>
          </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashDeal;
