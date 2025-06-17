import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { Toaster, toast } from "sonner";
import { useAuth } from '../context/AuthContext';
import ErrorMessages from "../constants/ErrorMessages";
import SuccessMessages from "../constants/SuccessMessages";


const ProductDetail = () => {
  const { id: productId } = useParams(); 
  const { user } = useAuth();
  const { sessionId,
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
    updateQuantityInCart} = useCart();
    const [selectedProduct, setSelectedProduct] = useState(null);

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [activeTab, setActiveTab] = useState('Hương');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8080/api/v1/products/${productId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch product data');
        }

        const result = await response.json();

        if (result.status === 'success' && result.data) {
          const transformedProduct = transformApiData(result.data);
          setProduct(transformedProduct);
console.log(transformedProduct);
setSelectedProduct(transformedProduct);
          if (transformedProduct.sizes.length > 0) {
            setSelectedSize(transformedProduct.sizes[0].value);
          }
        } else {
          throw new Error('Invalid data format');
        }
      } catch (err) {
        console.error('Error fetching product data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
    
  }, [productId]); 


  const transformApiData = (apiData) => {
    const notes = {
      top: apiData.productDetails.filter(d => d.detailName === 'top_note').map(d => d.detailValue),
      middle: apiData.productDetails.filter(d => d.detailName === 'middle_note').map(d => d.detailValue),
      base: apiData.productDetails.filter(d => d.detailName === 'base_note').map(d => d.detailValue)
    };
    
    const style = apiData.productDetails.find(d => d.detailName === 'style')?.detailValue || 'Unknown';
    const tone = apiData.productDetails.find(d => d.detailName === 'tone_scent')?.detailValue || 'Unknown';
    const gender = apiData.productDetails.find(d => d.detailName === 'suitable_gender')?.detailValue || 'Unknown';
    // console.log("nam", gender);
    const sizes = apiData.volumePrices.map(vp => ({
      value: `${vp.volume}ml`,
      label: `${vp.volume}ml`,
      price: vp.price,
      productVariantId: vp.productVariantId,
      quantityInStock: vp.quantityInStock
    }));
    
    const images = new Array(3).fill(apiData.imageUrl);
    
    const seasonalRecommendations = {
      'MÙA ĐÔNG': style === 'Romantic' ? 50 : 80,
      'MÙA XUÂN': tone === 'Floral' ? 90 : 60,
      'MÙA HẠ': tone === 'Fresh' ? 90 : 70,
      'MÙA THU': 60,
      'BAN NGÀY': 80,
      'BAN ĐÊM': style === 'Romantic' ? 90 : 50
    };
    
    return {
      id: apiData.productId,
      // gender: transformApiData.gender,
    //  gender : ,
      name: apiData.productName,
      brand: apiData.brandName,
      country: apiData.country !== 'Unknown' ? apiData.country : 'Italy',
      rating: 5,
      reviewCount: 125,
      availability: 'Còn hàng',
      sizes,
      images,
      hotline: '0796592839',
      seasonalRecommendations,
      notes,
      productDetails: apiData.productDetails,
      description: apiData.description,
    };
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const formatPrice = (price) => {
    return price.toLocaleString() + ' VND';
  };


  const navigate = useNavigate()
  const handleClickBuy = () => {
    handleAddToCart()
    setTimeout(() => {
      toast.success(SuccessMessages.NAVIGATE_TO_CHECKOUT || 'Đang chuyển đến trang thanh toán')
      navigate('/checkout')
    }, 1000)
  }

  
  const getTabContent = (product) => {
    if (!product) return {};
    
    return {
      'Hương': [
        `Hương đầu: ${product.notes.top.join(', ')}`,
        `Hương giữa: ${product.notes.middle.join(', ')}`,
        `Hương cuối: ${product.notes.base.join(', ')}`
      ],
      'Đặc điểm': [
        `Nước hoa ${product.name} có phong cách ${product.productDetails?.find(d => d.detailName === 'style')?.detailValue || 'đặc trưng'}`,
        `Thuộc nhóm hương ${product.productDetails?.find(d => d.detailName === 'tone_scent')?.detailValue || 'hoa cỏ tươi mát'}`,
        'Thời gian lưu hương: 4-6 giờ',
        'Độ tỏa hương: Gần - trong vòng 1 cánh tay'
      ],
      'Khuyến dùng': [
        'Phù hợp sử dụng vào mùa xuân/hè',
        'Thích hợp khi đi làm, đi chơi, hẹn hò',
        'Tuổi phù hợp: 18-35'
      ],
      'Bảo quản': [
        'Để nơi khô ráo, thoáng mát',
        'Tránh ánh nắng trực tiếp',
        'Đậy nắp sau khi sử dụng',
        'Tránh làm rơi, vỡ chai'
      ]
    };
  };

  const seasonalColors = {
    'MÙA ĐÔNG': 'bg-blue-400',
    'MÙA XUÂN': 'bg-green-400',
    'MÙA HẠ': 'bg-yellow-400',
    'MÙA THU': 'bg-amber-500',
    'BAN NGÀY': 'bg-yellow-300',
    'BAN ĐÊM': 'bg-indigo-400'
  };

  const seasonalIcons = {
    'MÙA ĐÔNG': (
      <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 3L13.4373 9.95151H20.5106L14.5367 14.0971L16.0147 21.0486L12 16.5L7.98532 21.0486L9.46335 14.0971L3.48944 9.95151H10.5627L12 3Z" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    'MÙA XUÂN': (
      <svg className="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 6C12.7956 6 13.5587 6.31607 14.1213 6.87868C14.6839 7.44129 15 8.20435 15 9C15 9.79565 14.6839 10.5587 14.1213 11.1213C13.5587 11.6839 12.7956 12 12 12C11.2044 12 10.4413 11.6839 9.87868 11.1213C9.31607 10.5587 9 9.79565 9 9C9 8.20435 9.31607 7.44129 9.87868 6.87868C10.4413 6.31607 11.2044 6 12 6Z" fill="currentColor"/>
      </svg>
    ),
    'MÙA HẠ': (
      <svg className="w-5 h-5 text-yellow-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" fill="currentColor"/>
        <path d="M12 2V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M12 20V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M4 12L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M22 12L20 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M19.7778 4.22266L17.5558 6.25424" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M4.22217 4.22266L6.44418 6.25424" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M6.44434 17.5557L4.22211 19.7779" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M19.7778 19.7773L17.5558 17.5551" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    'MÙA THU': (
      <svg className="w-5 h-5 text-amber-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 16L12 20L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 4V20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4 8L8 4L12 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M20 8L16 4L12 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    'BAN NGÀY': (
      <svg className="w-5 h-5 text-yellow-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" fill="currentColor"/>
        <path d="M12 2V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M12 20V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M4 12L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M22 12L20 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    'BAN ĐÊM': (
      <svg className="w-5 h-5 text-indigo-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21.5 14.0784C20.3003 14.7189 18.9349 15.0821 17.4921 15.0821C12.8233 15.0821 9.03238 11.2912 9.03238 6.62236C9.03238 5.1796 9.39563 3.81418 10.0361 2.61453C6.58155 3.61603 4 6.83565 4 10.6462C4 15.315 7.79096 19.1059 12.4597 19.1059C16.2703 19.1059 19.4899 16.5244 20.4914 13.0698C20.8276 13.4098 21.1604 13.7511 21.5 14.0784Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    )
  };

  const getSimilarProducts = () => {
    return [
      {
        id: 1,
        name: "DOLCE & GABBANA",
        description: "L'imperatrice 3 Pour Femme",
        price: 1373100,
        image: "https://assets.goldenscent.com/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/3/4/3423473020615-dolce-_-gabbana-l_imperatrice-01_1_.png"
      },
      {
        id: 2,
        name: "DKCE",
        description: "Nước hoa nữ DKCE Dark Signature",
        price: 1200000,
        originalPrice: 1800000,
        image: "/sp2.jpg"
      },
      {
        id: 3,
        name: "KUCCI",
        description: "Nước hoa nữ KUCCI Intense Bloom",
        price: 1300000,
        originalPrice: 1900000,
        image: "/sp2.jpg"
      },
      {
        id: 4,
        name: "EL DARIO",
        description: "Nước hoa nữ EL DARIO La Petite Fleur",
        price: 1300000,
        originalPrice: 1600000,
        image: "/sp2.jpg"
      },
      {
        id: 5,
        name: "LATNIA",
        description: "Nước hoa nữ LATNIA Midnight Fantasy",
        price: 1300000,
        originalPrice: 1950000,
        image: "/sp2.jpg"
      },
      {
        id: 6,
        name: "LATNIA",
        description: "Nước hoa nữ LATNIA Ocean Breeze",
        price: 1300000,
        originalPrice: 1950000,
        image: "/sp2.jpg"
      }
    ];
  };

  const renderSeasonalBar = (season, percentage) => {
    return (
      <div className="mb-3 last:mb-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center">
            <span className="mr-2">{seasonalIcons[season]}</span>
            <span className="font-medium text-sm">{season}</span>
          </div>
          <span className="text-sm font-semibold">{percentage}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div 
            className={`${seasonalColors[season]} h-2 rounded-full transition-all duration-300`} 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    );
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }


  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-red-600 mb-2">Lỗi</h2>
          <p className="text-gray-700">{error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
            onClick={() => window.location.reload()}
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-2">Không tìm thấy sản phẩm</h2>
          <p className="text-gray-700">Sản phẩm này không tồn tại hoặc đã bị xóa.</p>
          <a 
            href="/" 
            className="mt-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 inline-block"
          >
            Về trang chủ
          </a>
        </div>
      </div>
    );
  }

  const tabContent = getTabContent(product);
  const similarProducts = getSimilarProducts();
  const selectedSizeData = product.sizes.find(size => size.value === selectedSize);
  const genderHeader = (gender) => {
    if(gender == 'Women') return 'NƯỚC HOA NỮ';
    if(gender =='Men') return 'NƯỚC HOA NAM';
    return 'NƯỚC HOA UNISEX';
  };
  
  

  const handleAddToCart = () => {
    console.log('handleAddToCart called');
  
    if (!selectedProduct) {
      toast.error(ErrorMessages.INVALID_PRODUCT || "Sản phẩm không hợp lệ");
      return;
    }
  
    console.log( selectedProduct);
  
    if (!selectedSize) {
      toast.error(ErrorMessages.SIZE_REQUIRED);
      return;
    }
  
    console.log(selectedSize);
  
    if (!selectedProduct.sizes || selectedProduct.sizes.length === 0) {
      toast.error(ErrorMessages.VARIANT_NOT_FOUND || "Thông tin dung tích không có sẵn");
      return;
    }
  

    // console.log(selectedProduct.sizes);
  
   
    const variant = selectedProduct.sizes.find(
      (size) => size.label === selectedSize
    );
  
    console.log('Variant selected:', variant);
  
    const variantId = variant?.productVariantId;
  
    if (!variant || !variantId) {
      console.log("No matching variant found");
      toast.error(ErrorMessages.VARIANT_NOT_FOUND || "Không tìm thấy dung tích phù hợp!");
      return;
    }

    const item = {
      productVariantId: selectedVariant.productVariantId,
      productName: product.name,
      volume: parseFloat(selectedSize),
      unitPrice: selectedVariant.price,
      quantity: quantity,
      imageUrl: product.images[0],
      brandName: product.brand,
      note: "",
      quantityInStock: selectedVariant.quantityInStock
    };
  
    console.log(item);
  
    if (user) {
      addToCart(item);
      toast.success(SuccessMessages.ADD_TO_CART_SUCCESS || "Sản phẩm đã được thêm vào giỏ hàng");
    } else {
      // console.log(localCart);
  
      const isProductInCart = localCart.some(
        (product) => product.productVariantId === item.productVariantId && product.selectedSize === item.selectedSize
      );
  
      // console.log(isProductInCart);
  
      if (isProductInCart) {
        setLocalCart((prevCart) =>
          prevCart.map((product) =>
            product.productVariantId === item.productVariantId && product.selectedSize === item.selectedSize
              ? { ...product, quantity: product.quantity + quantity }
              : product
          )
        );
        toast.success(SuccessMessages.UPDATE_CART_SUCCESS || "Cập nhật số lượng giỏ hàng");
      } else {
        setLocalCart((prevCart) => [...prevCart, item]);
        toast.success(SuccessMessages.ADD_TO_CART_LOCAL_SUCCESS || "Đã thêm vào giỏ hàng");
      }
    }
  
  };
  
  
  

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-black text-white py-3">
        <div className="container mx-auto px-4">
          <nav className="flex items-center text-sm">
            <a href="/" className="hover:underline transition-colors">TRANG CHỦ</a>
            <span className="mx-2">/</span>
            <a href="/category" className="hover:underline transition-colors">DANH MỤC</a>
            <span className="mx-2">/</span>
            <a
  href={`/category?gender=${product.productDetails?.find(d => d.detailName === 'suitable_gender')?.detailValue || 'Unknown'}`}
  className="hover:underline transition-colors"
>
  {genderHeader(product.productDetails?.find(d => d.detailName === 'suitable_gender')?.detailValue || 'Unknown')}
</a>

            <span className="mx-2">/</span>
            <span className="text-gray-300 truncate">{product.name.toUpperCase()}</span>
          </nav>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="flex flex-col md:flex-row">

            <div className="md:w-2/5 p-6 bg-gray-50">
              <div className="relative mb-4 aspect-square overflow-hidden rounded-lg border border-gray-200">
                <img 
                  src={product.images[activeImageIndex]} 
                  alt={product.name} 
                  className="w-full h-full object-contain object-center"
                />
              </div>
              <div className="flex gap-2 justify-center">
                {product.images.map((image, index) => (
                  <button 
                    key={index} 
                    className={`border ${activeImageIndex === index ? 'border-black' : 'border-gray-200'} p-1 w-16 h-16 rounded-md overflow-hidden transition-all`}
                    onClick={() => setActiveImageIndex(index)}
                  >
                    <img src={image} alt={`Thumbnail ${index+1}`} className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            </div>
            

            <div className="md:w-3/5 p-6">
              <div className="flex flex-col h-full">
    
                <div className="mb-4">
                  <div className="text-sm font-bold text-gray-500 mb-1">{genderHeader(product.productDetails?.find(d => d.detailName === 'suitable_gender')?.detailValue || 'Unknown')}</div>
                  <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                </div>
                
                <div className="flex flex-wrap gap-x-6 gap-y-2 mb-4 text-sm">
                  <div>
                    <span className="text-gray-500">Thương hiệu: </span>
                    <span className="font-medium">{product.brand}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Quốc gia: </span>
                    <span className="font-medium text-red-500">{product.country}</span>
                  </div>
                </div>              
                <div className="mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Dung tích:</label>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map(size => (
                        <button
                          key={size.value}
                          className={`px-4 py-1 rounded-md transition-all ${
                            selectedSize === size.value 
                            ? 'bg-black text-white' 
                            : 'bg-white border border-gray-300 hover:border-gray-500'
                          }`}
                          onClick={() => handleSizeSelect(size.value)}
                        >
                          {size.label}
                        </button>
                      ))}
                    </div>
                    <p className="mt-2 text-xl text-red-700 font-bold">
                      {selectedSizeData 
                        ? formatPrice(selectedSizeData.price)
                        : `${formatPrice(Math.min(...product.sizes.map(size => size.price)))} - ${formatPrice(Math.max(...product.sizes.map(size => size.price)))}`}
                    </p>
                  </div>
                  
                  <div className="mt-2">
                    <label className="block text-sm font-medium mb-2">Số lượng:</label>
                    <div className="inline-flex rounded-md border border-gray-300 overflow-hidden">
                      <button 
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition-colors"
                        onClick={decreaseQuantity}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path>
                        </svg>
                      </button>
                      <span className="flex items-center justify-center w-12 font-medium">{quantity}</span>
                      <button 
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition-colors"
                        onClick={increaseQuantity}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
 
                <div className="flex flex-wrap gap-2 mb-6">
                  <button 
                  onClick={handleAddToCart}
                  className="flex items-center justify-center px-4 py-3 rounded-md bg-red-600 text-white font-medium hover:bg-red-700 transition-colors flex-grow md:flex-grow-0 md:w-40">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                    </svg>
                    Thêm vào giỏ
                  </button>
                  <button className="flex items-center justify-center px-4 py-3 rounded-md bg-black text-white font-medium hover:bg-gray-800 transition-colors flex-grow md:flex-grow-0 md:w-40" onClick={handleClickBuy}>
                    Mua ngay
                  </button>
                  <button className="flex items-center justify-center px-4 py-3 rounded-md border border-gray-300 hover:border-gray-400 transition-colors">
                    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path>
                    </svg>
                  </button>
                </div>
                
                <div className="flex items-center p-4 rounded-lg bg-gray-50 mb-6">
                  <svg className="w-8 h-8 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  <div>
                    <div className="text-sm text-gray-500">HOTLINE ĐẶT HÀNG</div>
                    <div className="font-bold text-lg">{product.hotline}</div>
                  </div>
                </div>
                
                <div className="mt-auto pt-4 border-t">
                  <h3 className="text-base font-medium mb-3">Thời điểm phù hợp:</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                    {Object.entries(product.seasonalRecommendations).map(([season, percentage]) => (
                      <div key={season} className="mb-3">
                        {renderSeasonalBar(season, percentage)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="border-b">
            <div className="flex overflow-x-auto">
              {Object.keys(tabContent).map(tab => (
                <button
                  key={tab}
                  className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${
                    activeTab === tab 
                    ? 'text-black border-b-2 border-black' 
                    : 'text-gray-500 hover:text-black'
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          
          <div className="p-6">
            <ul className="space-y-2">
              {tabContent[activeTab].map((item, index) => (
                <li key={index} className="flex items-start">
                  <svg className="w-5 h-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">MÙI HƯƠNG TƯƠNG TỰ</h2>
            <a href="#" className="text-sm font-medium hover:text-red-600 transition-colors underline">
              Xem tất cả
            </a>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {similarProducts.map(product => (
              <div key={product.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative pb-[100%]">
                  <img 
                    src={product.image} 
                    alt={product.description} 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-bold text-sm mb-1">{product.name}</h3>
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2 h-8">{product.description}</p>
                  <div className="flex items-baseline">
                    <span className="text-red-600 font-medium text-sm">{formatPrice(product.price)}</span>
                    {product.originalPrice && (
                      <span className="text-gray-400 text-xs line-through ml-2">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      <footer className="bg-black text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-4">VỀ CHÚNG TÔI</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Giới thiệu</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cửa hàng</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tuyển dụng</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Liên hệ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">HỖ TRỢ KHÁCH HÀNG</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Hướng dẫn mua hàng</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Phương thức thanh toán</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Phương thức vận chuyển</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Chính sách đổi trả</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">CHÍNH SÁCH</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Chính sách bảo mật</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Điều khoản sử dụng</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Chính sách cookie</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Quy định chung</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">KẾT NỐI VỚI CHÚNG TÔI</h3>
              <div className="flex space-x-4 mb-4">
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
                  </svg>
                </a>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-300 mb-2">Đăng ký nhận tin:</p>
                <div className="flex">
                  <input 
                    type="email" 
                    placeholder="Email của bạn" 
                    className="px-4 py-2 text-sm flex-grow rounded-l-md focus:outline-none focus:ring-1 focus:ring-black"
                  />
                  <button className="bg-red-600 text-white px-4 py-2 rounded-r-md hover:bg-red-700 transition-colors">
                    Đăng ký
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-sm text-gray-400 text-center">
            © 2025 Fragrance Store. Tất cả các quyền được bảo lưu.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProductDetail;