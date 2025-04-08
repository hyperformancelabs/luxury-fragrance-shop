import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import QuickView from "./QuickView";

const FlashDeal = () => {
  const [selectedSize, setSelectedSize] = useState('75ml');
  const [showPopup, setShowPopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [startIndex, setStartIndex] = useState(0);

  const sizes = [
    { value: '50ml', label: '50ml' },
    { value: '75ml', label: '75ml' },
    { value: '100ml', label: '100ml' },
    { value: '120ml', label: '120ml' },
    { value: '200ml', label: '200ml' }
  ];

  const products = [
    {
      name: "Versace Eros Flame Eau De Toilette",
      price: "1.200.000 - 1.500.000 VND",
      brand: "VERSACE",
      img: "sp2.jpg",
      country: "Pháp"
    },
    {
      name: "Versace Eros Eau De Toilette",
      price: "1.000.000 - 1.200.000 VND",
      brand: "VERSACE",
      img: "sp2.jpg",
      country: "Pháp"
    },
    {
      name: "Versace Bright Crystal",
      price: "1.100.000 - 1.400.000 VND",
      brand: "VERSACE",
      img: "sp2.jpg",
      country: "Pháp"
    },
    {
      name: "Versace Pour Homme",
      price: "1.300.000 - 1.600.000 VND",
      brand: "VERSACE",
      img: "sp2.jpg",
      country: "Pháp"
    },
    {
      name: "Versace Crystal Noir",
      price: "1.400.000 - 1.700.000 VND",
      brand: "VERSACE",
      img: "sp2.jpg",
      country: "Pháp"
    },
    {
      name: "Versace Dylan Blue",
      price: "1.500.000 - 1.800.000 VND",
      brand: "VERSACE",
      img: "sp2.jpg",
      country: "Pháp"
    },
  ];

  const handleQuickView = (product) => {
    setSelectedProduct(product);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedProduct(null);
    setQuantity(1);
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const [timeLeft, setTimeLeft] = useState({
    hours: 5,
    minutes: 30,
    seconds: 0,
  });

  const handleNextProducts = () => {
    if (startIndex + getProductsPerView() < products.length) {
      setStartIndex(startIndex + getProductsPerView());
    } else {
      setStartIndex(0);
    }
  };

  const handlePrevProducts = () => {
    if (startIndex - getProductsPerView() >= 0) {
      setStartIndex(startIndex - getProductsPerView());
    } else {
      setStartIndex(Math.max(0, products.length - getProductsPerView()));
    }
  };

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

  return (
    <div  id="flash-deal" className="flex flex-col mx-4 md:m-12 relative">
      <div  className="flex absolute translate-y-4 translate-x-2 md:translate-x-12 items-center bg-gradient-to-r from-red-500 to-red-700 text-white py-1 md:py-2 px-2 md:px-4 rounded-lg shadow-lg">
        <svg
          width="16"
          height="24"
          className="fill-yellow-300 animate-pulse"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M14.394 11.6854C14.349 11.5226 14.2702 11.371 14.1626 11.2407C14.0551 11.1104 13.9212 11.0043 13.7698 10.9293L9.70106 8.91289L10.7933 1.36344C10.8292 1.10179 10.7778 0.835614 10.6471 0.606141C10.5164 0.376669 10.3136 0.196718 10.0702 0.094173C9.82685 -0.00837155 9.55645 -0.0277836 9.30093 0.0389447C9.0454 0.105673 8.81902 0.254816 8.65686 0.463262L0.255241 11.2653C0.141203 11.411 0.0623685 11.581 0.0248924 11.7621C-0.0125837 11.9433 -0.00768753 12.1306 0.0391991 12.3095C0.0921791 12.4886 0.184268 12.6536 0.30881 12.7926C0.433351 12.9317 0.587235 13.0414 0.759338 13.1137L5.88433 15.1661L4.79212 22.6315C4.75499 22.8995 4.80946 23.1721 4.94672 23.4052C5.08397 23.6383 5.29594 23.8183 5.54826 23.9158C5.68891 23.9741 5.84011 24.0027 5.99235 23.9998C6.19003 23.9988 6.38441 23.9489 6.5582 23.8547C6.73199 23.7605 6.87981 23.6248 6.98854 23.4597L14.1899 12.6576C14.2914 12.5195 14.3621 12.3613 14.3972 12.1936C14.4324 12.0259 14.4313 11.8526 14.394 11.6854Z" />
        </svg>
        <h2 className="text-white  md:font-bold text-xs md:text-xl ml-1 md:ml-2">Flash Deals</h2>
      </div>

      <div className="flex absolute translate-y-4 right-0 mr-2 md:mr-8 bg-white px-2 md:px-4  items-center space-x-1 md:space-x-4">
        <div className="text-black font-semibold hidden md:block md:text-base">Kết thúc sau:</div>
        <div className="flex space-x-1 md:space-x-2">
          <div className="bg-red-600 text-white rounded-md py-1 px-1 md:px-2 flex items-center justify-center min-w-8 md:min-w-12">
            <span className="font-bold text-sm md:text-xl">
              {formatTime(timeLeft.hours)}
            </span>
          </div>
          <span className="font-bold text-sm md:text-xl">:</span>
          <div className="bg-red-600 text-white rounded-md py-1 px-1 md:px-2 flex items-center justify-center min-w-8 md:min-w-12">
            <span className="font-bold text-sm md:text-xl">
              {formatTime(timeLeft.minutes)}
            </span>
          </div>
          <span className="font-bold text-sm md:text-xl">:</span>
          <div className="bg-red-600 text-white rounded-md py-1 px-1 md:px-2 flex items-center justify-center min-w-8 md:min-w-12">
            <span className="font-bold text-sm md:text-xl">
              {formatTime(timeLeft.seconds)}
            </span>
          </div>
        </div>
      </div>

      <div className="w-full items-center top-1/2 absolute">
        <button
          className="absolute w-8 h-8 md:w-12 md:h-12 left-0 bg-white rounded-full flex items-center justify-center shadow-lg z-10"
          onClick={handlePrevProducts}
        >
          <ChevronLeft className="w-6 h-6 md:w-12 md:h-12 text-red-600" />
        </button>
        <button
          className="absolute w-8 h-8 md:w-12 md:h-12 right-0 bg-white rounded-full flex items-center justify-center shadow-lg z-10"
          onClick={handleNextProducts}
        >
          <ChevronRight className="w-6 h-6 md:w-12 md:h-12 text-red-600" />
        </button>
      </div>

      <div className="p-4 md:p-8 border-2 rounded-lg mt-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-4">
          {products.map((product, index) => (
            <div
              key={index}
              className="flex flex-col items-center border-2 border-gray-300 rounded-lg p-2 md:p-4"
            >
              <img
                src={product.img}
                alt={product.name}
                className="h-20 md:h-40 w-auto"
              />
              <div className="flex flex-col items-center mt-2 md:mt-4 w-full h-full">
                <h3 className="font-bold text-xs md:text-base">{product.brand}</h3>
                <div className="h-8 md:h-12 flex items-center justify-center">
                  <p className="font-medium text-xs md:text-sm text-center">{product.name}</p>
                </div>
                <div className="font-extrabold text-xs text-red-600 mb-2">
                  {product.price}
                </div>
                <div className="flex justify-center gap-4 w-full mt-auto">
                  <button className="p-1 md:p-2 text-white text-xs rounded-md bg-red-600">
                    Yêu thích
                  </button>
                  <button
                    className="p-1 md:p-2 text-white text-xs rounded-md bg-black"
                    onClick={() => handleQuickView(product)}
                  >
                    Xem nhanh
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>


      {showPopup && selectedProduct && (
        <QuickView
          selectedProduct={selectedProduct}
          handleClosePopup={handleClosePopup}
        />
      )}

    </div>
  );
};

export default FlashDeal;