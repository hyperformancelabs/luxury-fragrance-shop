import React, { useState } from 'react';

const ProductDetail = () => {
  const [quantity, setQuantity] = useState(4);
  const [selectedSize, setSelectedSize] = useState('50ml');
  const [activeTab, setActiveTab] = useState('Hương');
  
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

  const seasonalColors = {
    'MÙA ĐÔNG': 'bg-blue-200',
    'MÙA XUÂN': 'bg-green-400',
    'MÙA HẠ': 'bg-yellow-400',
    'MÙA THU': 'bg-amber-600',
    'BAN NGÀY': 'bg-yellow-100',
    'BAN ĐÊM': 'bg-gray-600'
  };

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

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const renderSeasonalBar = (season, percentage) => {
    return (
      <div className="flex flex-col mb-4">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center">
            {season === 'MÙA ĐÔNG' && (
              <svg className="w-6 h-6 mr-2 text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3L13.4373 9.95151H20.5106L14.5367 14.0971L16.0147 21.0486L12 16.5L7.98532 21.0486L9.46335 14.0971L3.48944 9.95151H10.5627L12 3Z" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            )}
            {season === 'MÙA XUÂN' && (
              <svg className="w-6 h-6 mr-2 text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 6C12.7956 6 13.5587 6.31607 14.1213 6.87868C14.6839 7.44129 15 8.20435 15 9C15 9.79565 14.6839 10.5587 14.1213 11.1213C13.5587 11.6839 12.7956 12 12 12C11.2044 12 10.4413 11.6839 9.87868 11.1213C9.31607 10.5587 9 9.79565 9 9C9 8.20435 9.31607 7.44129 9.87868 6.87868C10.4413 6.31607 11.2044 6 12 6ZM12 7.5C11.6022 7.5 11.2206 7.65804 10.9393 7.93934C10.658 8.22064 10.5 8.60218 10.5 9C10.5 9.39782 10.658 9.77936 10.9393 10.0607C11.2206 10.342 11.6022 10.5 12 10.5C12.3978 10.5 12.7794 10.342 13.0607 10.0607C13.342 9.77936 13.5 9.39782 13.5 9C13.5 8.60218 13.342 8.22064 13.0607 7.93934C12.7794 7.65804 12.3978 7.5 12 7.5ZM4.5 9C4.5 8.60218 4.65804 8.22064 4.93934 7.93934C5.22064 7.65804 5.60218 7.5 6 7.5C6.39782 7.5 6.77936 7.65804 7.06066 7.93934C7.34196 8.22064 7.5 8.60218 7.5 9C7.5 9.39782 7.34196 9.77936 7.06066 10.0607C6.77936 10.342 6.39782 10.5 6 10.5C5.60218 10.5 5.22064 10.342 4.93934 10.0607C4.65804 9.77936 4.5 9.39782 4.5 9ZM16.5 9C16.5 8.60218 16.658 8.22064 16.9393 7.93934C17.2206 7.65804 17.6022 7.5 18 7.5C18.3978 7.5 18.7794 7.65804 19.0607 7.93934C19.342 8.22064 19.5 8.60218 19.5 9C19.5 9.39782 19.342 9.77936 19.0607 10.0607C18.7794 10.342 18.3978 10.5 18 10.5C17.6022 10.5 17.2206 10.342 16.9393 10.0607C16.658 9.77936 16.5 9.39782 16.5 9Z" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            )}
            {season === 'MÙA HẠ' && (
              <svg className="w-6 h-6 mr-2 text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4.5C12.4142 4.5 12.75 4.83579 12.75 5.25V6.75C12.75 7.16421 12.4142 7.5 12 7.5C11.5858 7.5 11.25 7.16421 11.25 6.75V5.25C11.25 4.83579 11.5858 4.5 12 4.5Z" fill="currentColor"/>
                <path d="M12 16.5C12.4142 16.5 12.75 16.8358 12.75 17.25V18.75C12.75 19.1642 12.4142 19.5 12 19.5C11.5858 19.5 11.25 19.1642 11.25 18.75V17.25C11.25 16.8358 11.5858 16.5 12 16.5Z" fill="currentColor"/>
                <path d="M18.75 12C18.75 12.4142 18.4142 12.75 18 12.75H16.5C16.0858 12.75 15.75 12.4142 15.75 12C15.75 11.5858 16.0858 11.25 16.5 11.25H18C18.4142 11.25 18.75 11.5858 18.75 12Z" fill="currentColor"/>
                <path d="M8.25 12C8.25 12.4142 7.91421 12.75 7.5 12.75H6C5.58579 12.75 5.25 12.4142 5.25 12C5.25 11.5858 5.58579 11.25 6 11.25H7.5C7.91421 11.25 8.25 11.5858 8.25 12Z" fill="currentColor"/>
                <path d="M16.2426 7.75736C16.5679 7.43211 17.0926 7.43211 17.4178 7.75736L18.4749 8.81447C18.8002 9.13971 18.8002 9.66438 18.4749 9.98963C18.1497 10.3149 17.625 10.3149 17.2998 9.98963L16.2426 8.93251C15.9174 8.60727 15.9174 8.0826 16.2426 7.75736Z" fill="currentColor"/>
                <path d="M7.75736 16.2426C8.0826 15.9174 8.60727 15.9174 8.93251 16.2426L9.98963 17.2998C10.3149 17.625 10.3149 18.1497 9.98963 18.4749C9.66438 18.8002 9.13971 18.8002 8.81447 18.4749L7.75736 17.4178C7.43211 17.0926 7.43211 16.5679 7.75736 16.2426Z" fill="currentColor"/>
                <path d="M7.75736 7.75736C8.0826 8.0826 8.0826 8.60727 7.75736 8.93251L6.70025 9.98963C6.375 10.3149 5.85033 10.3149 5.52508 9.98963C5.19984 9.66438 5.19984 9.13971 5.52508 8.81447L6.5822 7.75736C6.90744 7.43211 7.43211 7.43211 7.75736 7.75736Z" fill="currentColor"/>
                <path d="M16.2426 16.2426C16.5679 16.5679 16.5679 17.0926 16.2426 17.4178L15.1855 18.4749C14.8603 18.8002 14.3356 18.8002 14.0104 18.4749C13.6851 18.1497 13.6851 17.625 14.0104 17.2998L15.0675 16.2426C15.3927 15.9174 15.9174 15.9174 16.2426 16.2426Z" fill="currentColor"/>
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            )}
            {season === 'MÙA THU' && (
              <svg className="w-6 h-6 mr-2 text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.5 8C13.5 8.27614 13.2761 8.5 13 8.5C12.7239 8.5 12.5 8.27614 12.5 8C12.5 7.72386 12.7239 7.5 13 7.5C13.2761 7.5 13.5 7.72386 13.5 8Z" fill="currentColor"/>
                <path d="M13.5 12C13.5 12.2761 13.2761 12.5 13 12.5C12.7239 12.5 12.5 12.2761 12.5 12C12.5 11.7239 12.7239 11.5 13 11.5C13.2761 11.5 13.5 11.7239 13.5 12Z" fill="currentColor"/>
                <path d="M17 12.5C17.2761 12.5 17.5 12.2761 17.5 12C17.5 11.7239 17.2761 11.5 17 11.5C16.7239 11.5 16.5 11.7239 16.5 12C16.5 12.2761 16.7239 12.5 17 12.5Z" fill="currentColor"/>
                <path d="M9 12.5C9.27614 12.5 9.5 12.2761 9.5 12C9.5 11.7239 9.27614 11.5 9 11.5C8.72386 11.5 8.5 11.7239 8.5 12C8.5 12.2761 8.72386 12.5 9 12.5Z" fill="currentColor"/>
                <path d="M15.9393 15.9393C16.5251 15.3536 17.4749 15.3536 18.0607 15.9393C18.3761 16.2547 18.5 16.6247 18.5 16.9393C18.5 17.254 18.3761 17.624 18.0607 17.9393L16.9393 19.0607C16.3536 19.6464 15.4038 19.6464 14.818 19.0607C14.5026 18.7453 14.3787 18.3753 14.3787 18.0607C14.3787 17.746 14.5026 17.376 14.818 17.0607L15.9393 15.9393Z" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M15.9393 8.06066C16.5251 8.64645 16.5251 9.59621 15.9393 10.182L14.818 11.3033C14.2322 11.8891 13.2824 11.8891 12.6967 11.3033C12.3813 10.988 12.2573 10.618 12.2573 10.3033C12.2573 9.98869 12.3813 9.61866 12.6967 9.30332L13.818 8.18198C14.4038 7.59619 15.3536 7.59619 15.9393 8.06066Z" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M8.06066 15.9393C8.64645 15.3536 9.59621 15.3536 10.182 15.9393L11.3033 17.0607C11.8891 17.6464 11.8891 18.5962 11.3033 19.182C10.988 19.4973 10.618 19.6213 10.3033 19.6213C9.98869 19.6213 9.61866 19.4973 9.30332 19.182L8.18198 18.0607C7.59619 17.4749 7.59619 16.5251 8.06066 15.9393Z" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M8.06066 8.06066C7.47487 8.64645 7.47487 9.59621 8.06066 10.182L9.18198 11.3033C9.76777 11.8891 10.7176 11.8891 11.3033 11.3033C11.6187 10.988 11.7426 10.618 11.7426 10.3033C11.7426 9.98869 11.6187 9.61866 11.3033 9.30332L10.182 8.18198C9.59621 7.59619 8.64645 7.59619 8.06066 8.06066Z" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M12 5.75L13 3.75M16.2426 7.75736L18.5 5.5M18.25 12L20.25 11M16.2426 16.2426L18.5 18.5M12 18.25L11 20.25M7.75736 16.2426L5.5 18.5M5.75 12L3.75 13M7.75736 7.75736L5.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            )}
            {season === 'BAN NGÀY' && (
              <svg className="w-6 h-6 mr-2 text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M12 2V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M12 20V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M4 12L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M22 12L20 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M19.7778 4.22266L17.5558 6.25424" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M4.22217 4.22266L6.44418 6.25424" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M6.44434 17.5557L4.22211 19.7779" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M19.7778 19.7773L17.5558 17.5551" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            )}
            {season === 'BAN ĐÊM' && (
              <svg className="w-6 h-6 mr-2 text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.5 14.0784C20.3003 14.7189 18.9349 15.0821 17.4921 15.0821C12.8233 15.0821 9.03238 11.2912 9.03238 6.62236C9.03238 5.1796 9.39563 3.81418 10.0361 2.61453C6.58155 3.61603 4 6.83565 4 10.6462C4 15.315 7.79096 19.1059 12.4597 19.1059C16.2703 19.1059 19.4899 16.5244 20.4914 13.0698C20.8276 13.4098 21.1604 13.7511 21.5 14.0784Z" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            )}
            <span>{season}</span>
          </div>
          <span className="ml-auto">{percentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className={`${seasonalColors[season]} h-2.5 rounded-full`} 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    );
  };


  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="bg-black text-white p-4">
        <div className="container mx-auto">
          <div className="flex items-center text-sm">
            <a href="/" className="hover:underline">TRANG CHỦ</a>
            <span className="mx-1">/</span>
            <a href="/danh-muc" className="hover:underline">DANH MỤC</a>
            <span className="mx-1">/</span>
            <a href="/nuoc-hoa-nu" className="hover:underline">NƯỚC HOA NỮ</a>
            <span className="mx-1">/</span>
            <span>NƯỚC HOA NỮ VERSACE BRIGHT CRYSTAL EDT</span>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row mb-8">
          <div className="md:w-2/5 mb-4 md:mb-0">
            <div className="mb-4">
              <img src={product.images[0]} alt={product.name} className='w-full h-auto' />
            </div>
            <div className="flex gap-2">
              {product.images.slice(1).map((image, index) => (
                <div key={index} className="border border-gray-200 p-1 w-16 h-16">
                  <img src={image} alt={`Thumbnail ${index+1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
          
          <div className="md:w-3/5 md:pl-8">
            <h1 className="text-2xl font-medium mb-2">{product.name}</h1>
            
            <div className="flex items-center mb-2">
              <div className="flex mr-2">
                {Array(5).fill().map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                ))}
              </div>
              <span className="text-gray-500 text-sm">{product.reviewCount} đánh giá</span>
              <div className="ml-4 flex items-center text-sm">
                <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-1"></span>
                <span className="text-green-500">{product.availability}</span>
              </div>
            </div>
            
            <div className="mb-4 flex text-sm">
              <div className="mr-4">
                <span className="text-gray-500">Mã sản phẩm: </span>
                <span>{product.id}</span>
              </div>
              <div className="mr-4">
                <span className="text-gray-500">Thương hiệu: </span>
                <span>{product.brand}</span>
              </div>
              <div>
                <span className="text-gray-500">Quốc gia: </span>
                <span className="text-red-500">Pháp</span>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center mb-1">
                <span className="line-through text-gray-500 mr-2">{product.originalPrice.toLocaleString()} VND</span>
                <span className="text-red-600 font-semibold">{product.salePrice.toLocaleString()} VND</span>
              </div>
              <div className="text-red-600 font-bold">{product.finalPrice.toLocaleString()} VND</div>
            </div>
            
            <div className="mb-4">
              <div className="flex gap-2">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    className={`px-4 py-2 border rounded ${selectedSize === size ? 'border-black' : 'border-gray-300'}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <span className="text-sm mr-2">Số lượng:</span>
              <div className="inline-flex border border-gray-300">
                <button 
                  className="px-3 py-1 border-r border-gray-300"
                  onClick={decreaseQuantity}
                >
                  -
                </button>
                <span className="px-4 py-1">{quantity}</span>
                <button 
                  className="px-3 py-1 border-l border-gray-300"
                  onClick={increaseQuantity}
                >
                  +
                </button>
              </div>
            </div>
   
            <div className="mb-4 flex gap-2">
              <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded">
                Thêm vào yêu thích
              </button>
              <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded">
                Thêm vào giỏ hàng
              </button>
              <button className="bg-red-600 text-white px-8 py-2 rounded">
                Mua ngay
              </button>
            </div>
            
            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-800 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
              </svg>
              <div>
                <div className="text-sm text-gray-500">HOTLINE ĐẶT HÀNG</div>
                <div className="font-semibold">{product.hotline}</div>
              </div>
              
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Thời điểm phù hợp:</h3>
              {Object.entries(product.seasonalRecommendations).map(([season, percentage]) => (
                renderSeasonalBar(season, percentage)
              ))}
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">CHI TIẾT SẢN PHẨM</h2>
          
          <div className="border-b mb-4">
            <div className="flex">
              {Object.keys(tabContent).map(tab => (
                <button
                  key={tab}
                  className={`px-6 py-3 ${activeTab === tab ? 'border-t border-l border-r bg-white' : 'bg-gray-100'}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          
          <div className="border p-4">
            <ul>
              {tabContent[activeTab].map((item, index) => (
                <li key={index} className="mb-2">{item}</li>
              ))}
            </ul>
          </div>
        </div>

        
        
        <div className='flex flex-col my-10 w-full'>
        <div className='flex justify-between items-center my-5 '>
        <h2 className=' font-extrabold text-xl'>Mùi hương tương tự</h2>
        <button>
            <p className='underline hover:text-red-600'>Xem tất cả</p>
        </button>
        
        </div>
     
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4'>
            {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className='flex flex-col items-center border-2 border-gray-300 rounded-lg p-4'>
                <img src="/sp2.jpg" alt="" className='h-40 w-auto' />
                <div className='flex flex-col items-center mt-4'>
                    <h3 className='font-bold'>VERSACE</h3>
                    <p className='font-medium text-sm'>Versace Eros Flame Eau De Toilette</p>
                    <div className='font-extrabold text-xs text-red-600'>
                    <span>1.200.000</span> 
                    <span> - </span>
                    <span>1.500.000 VND</span>
                    </div>
                    <div className='flex justify-between w-full mt-2'>
                    <button className='p-2 text-white text-xs rounded-md bg-red-600'>Yêu thích</button>
                    <button className='p-2 text-white text-xs rounded-md bg-black'>Xem nhanh</button>
                    </div>
                </div>
                </div>
            ))}
            </div>
        
    </div>
      </div>
    </div>
  );
};

export default ProductDetail;