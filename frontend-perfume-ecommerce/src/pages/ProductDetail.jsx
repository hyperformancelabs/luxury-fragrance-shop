import React, { useState } from 'react';

const ProductDetail = () => {
  const [quantity, setQuantity] = useState(4);
  const [selectedSize, setSelectedSize] = useState('50ml');
  const [activeTab, setActiveTab] = useState('Hương');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  const product = {
    id: 1,
    name: 'Nước Hoa Nữ Versace Bright Crystal EDT',
    brand: 'VERSACE',
    rating: 5,
    reviewCount: 125,
    availability: 'Còn hàng',
    originalPrice: 150000,
    salePrice: 2400000,
    finalPrice: 2400000,
    sizes: ['50ml', '75ml', '100ml', '125ml', '200ml'],
    images: [
      '/sp2.jpg',
      '/sp2.jpg',
      '/sp1.jpg'
    ],
    hotline: '0123456789',
    seasonalRecommendations: {
      'MÙA ĐÔNG': 30,
      'MÙA XUÂN': 70,
      'MÙA HẠ': 90,
      'MÙA THU': 60,
      'BAN NGÀY': 80,
      'BAN ĐÊM': 50
    }
  };

  const similarProducts = [
    {
      id: 1,
      name: 'VERSACE',
      description: 'Nước hoa nữ Versace Bright Crystal EDT',
      price: 2000000,
      image: '/sp2.jpg'
    },
    {
      id: 2,
      name: 'DKCE',
      description: 'Nước hoa nữ DKCE Dark Signature',
      price: 1200000,
      originalPrice: 1800000,
      image: '/sp2.jpg'
    },
    {
      id: 3,
      name: 'KUCCI',
      description: 'Nước hoa nữ KUCCI Intense Bloom',
      price: 1300000,
      originalPrice: 1900000,
      image: '/sp2.jpg'
    },
    {
      id: 4,
      name: 'EL DARIO',
      description: 'Nước hoa nữ EL DARIO La Petite Fleur',
      price: 1300000,
      originalPrice: 1600000,
      image: '/sp2.jpg'
    },
    {
      id: 5,
      name: 'LATNIA',
      description: 'Nước hoa nữ LATNIA Midnight Fantasy',
      price: 1300000,
      originalPrice: 1950000,
      image: '/sp2.jpg'
    },
    {
      id: 6,
      name: 'LATNIA',
      description: 'Nước hoa nữ LATNIA Ocean Breeze',
      price: 1300000,
      originalPrice: 1950000,
      image: '/sp2.jpg'
    }
  ];

  const tabContent = {
    'Hương': [
      'Hương đầu: Jừa, Hạt Yuzu, Đào, Thuốc lá',
      'Hương giữa: Cà phê, Cây hoắc hương, Hoa oải hương',
      'Hương cuối: Benzoin, Gỗ trầm, Hương Labdanum, Hương Noni'
    ],
    'Đặc điểm': [
      'Nước hoa nữ Versace Bright Crystal EDT có mùi hương nhẹ nhàng, nữ tính',
      'Thuộc nhóm hương hoa cỏ tươi mát',
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

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
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

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <header className="bg-black text-white py-3">
        <div className="container mx-auto px-4">
          <nav className="flex items-center text-sm">
            <a href="/" className="hover:text-gray-300 transition-colors">TRANG CHỦ</a>
            <span className="mx-2">/</span>
            <a href="/danh-muc" className="hover:text-gray-300 transition-colors">DANH MỤC</a>
            <span className="mx-2">/</span>
            <a href="/nuoc-hoa-nu" className="hover:text-gray-300 transition-colors">NƯỚC HOA NỮ</a>
            <span className="mx-2">/</span>
            <span className="text-gray-300 truncate">NƯỚC HOA NỮ VERSACE BRIGHT CRYSTAL EDT</span>
          </nav>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Product Main Section */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="flex flex-col md:flex-row">
            {/* Product Images */}
            <div className="md:w-2/5 p-6 bg-gray-50">
              <div className="relative mb-4 aspect-square overflow-hidden rounded-lg border border-gray-200">
                <img 
                  src={product.images[activeImageIndex]} 
                  alt={product.name} 
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="flex gap-2 justify-center">
                {product.images.map((image, index) => (
                  <button 
                    key={index} 
                    className={`border ${activeImageIndex === index ? 'border-black' : 'border-gray-200'} p-1 w-16 h-16 rounded-md overflow-hidden transition-all`}
                    onClick={() => setActiveImageIndex(index)}
                  >
                    <img src={image} alt={`Thumbnail ${index+1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
            
            {/* Product Info */}
            <div className="md:w-3/5 p-6">
              <div className="flex flex-col h-full">
                {/* Brand & Title */}
                <div className="mb-4">
                  <div className="text-sm font-bold text-gray-500 mb-1">{product.brand}</div>
                  <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                  
                  <div className="flex items-center mb-2">
                    {/* <div className="flex mr-3">
                      {Array(5).fill().map((_, i) => (
                        <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                      ))}
                    </div> */}
                    {/* <span className="text-gray-500 text-sm">{product.reviewCount} đánh giá</span>
                    <div className="ml-4 flex items-center">
                      <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                      <span className="text-green-500 text-sm font-medium">{product.availability}</span>
                    </div> */}
                  </div>
                </div>
                
                {/* Metadata */}
                <div className="flex flex-wrap gap-x-6 gap-y-2 mb-4 text-sm">
                  {/* <div>
                    <span className="text-gray-500">Mã sản phẩm: </span>
                    <span className="font-medium">{product.id}</span>
                  </div> */}
                  <div>
                    <span className="text-gray-500">Thương hiệu: </span>
                    <span className="font-medium">{product.brand}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Quốc gia: </span>
                    <span className="font-medium text-red-500">Pháp</span>
                  </div>
                </div>
                
                {/* Price */}
                <div className="mb-6">
                  {/* <div className="flex items-center gap-3 mb-1">
                    <span className="line-through text-gray-400">{product.originalPrice.toLocaleString()} VND</span>
                    <span className="text-red-600 font-medium">{product.salePrice.toLocaleString()} VND</span>
                  </div> */}
                  <div className="text-red-600 text-2xl font-bold">{product.finalPrice.toLocaleString()} VND</div>
                </div>
                
                {/* Options */}
                <div className="mb-6">
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Kích thước:</label>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map(size => (
                        <button
                          key={size}
                          className={`px-4 py-2 rounded-md transition-all ${
                            selectedSize === size 
                            ? 'bg-black text-white' 
                            : 'bg-white border border-gray-300 hover:border-gray-500'
                          }`}
                          onClick={() => setSelectedSize(size)}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
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
                
                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <button className="flex items-center justify-center px-4 py-3 rounded-md bg-red-600 text-white font-medium hover:bg-red-700 transition-colors flex-grow md:flex-grow-0 md:w-40">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                    </svg>
                    Thêm vào giỏ
                  </button>
                  <button className="flex items-center justify-center px-4 py-3 rounded-md bg-black text-white font-medium hover:bg-gray-800 transition-colors flex-grow md:flex-grow-0 md:w-40">
                    Mua ngay
                  </button>
                  <button className="flex items-center justify-center px-4 py-3 rounded-md border border-gray-300 hover:border-gray-400 transition-colors">
                    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path>
                    </svg>
                  </button>
                </div>
                
                {/* Hotline */}
                <div className="flex items-center p-4 rounded-lg bg-gray-50 mb-6">
                  <svg className="w-8 h-8 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  <div>
                    <div className="text-sm text-gray-500">HOTLINE ĐẶT HÀNG</div>
                    <div className="font-bold text-lg">{product.hotline}</div>
                  </div>
                </div>
                
                {/* Seasonal Recommendations */}
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
        
        {/* Product Details Tab */}
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
        
        {/* Similar Products */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">MÙI HƯƠNG TƯƠNG TỰ</h2>
            <a href="#" className="text-sm font-medium hover:text-red-600 transition-colors underline">
              Xem tất cả
            </a>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {similarProducts.map((product, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative pt-[100%]">
                  <img 
                    src={product.image} 
                    alt={product.description} 
                    className="absolute top-0 left-0 w-full h-full object-cover"
                  />
                  {product.originalPrice && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-md">
                      SALE
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-center mb-1">{product.name}</h3>
                  <p className="text-sm text-center text-gray-600 mb-2 truncate">{product.description}</p>
                  <div className="flex items-center justify-center gap-2 mb-3">
                    {product.originalPrice && (
                      <span className="text-xs text-gray-400 line-through">{product.originalPrice.toLocaleString()}</span>
                    )}
                    <span className="text-sm font-bold text-red-600">{product.price.toLocaleString()} VND</span>
                  </div>
                  <div className="flex gap-1">
                    <button className="flex-1 text-xs bg-red-600 hover:bg-red-700 text-white py-2 rounded transition-colors">
                      Thêm giỏ
                    </button>
                    <button className="flex-1 text-xs bg-black hover:bg-gray-800 text-white py-2 rounded transition-colors">
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      
    </div>
  );
};

export default ProductDetail;