import React, { useState } from 'react';

const ProductList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('mới nhất');
  

  const products = Array(15).fill().map((_, i) => ({
    id: i + 1,
    name: 'VERSACE',
    description: 'Nước hoa nữ Versace Bright Crystal EDT',
    capacity: '5ml - 30ml',
    originalPrice: 250000,
    salePrice: 2400000,
    imageUrl: 'sp2.jpg',
    rating: 4.5,
    reviewCount: 120
  }));


  const filterCategories = [
    {
      title: 'Thương hiệu',
      options: [
        { name: 'Louis Vuitton', count: 153, checked: true },
        { name: 'Gucci', count: 96, checked: false },
        { name: 'Channel', count: 109, checked: false },
        { name: 'Kaja', count: 255, checked: false },
        { name: 'Versace', count: 27, checked: false },
        { name: 'TomFord', count: 75, checked: false }
      ]
    },
    {
      title: 'Danh mục',
      options: [
        { name: 'Nước hoa', count: 265, checked: true },
        { name: 'Nước hoa nữ', count: 634, checked: false },
        { name: 'Nước hoa nước', count: 459, checked: false }
      ]
    },
    {
      title: 'Dung tích',
      options: [
        { name: '50ml', count: 218, checked: false },
        { name: '100ml', count: 1050, checked: false },
        { name: '200ml', count: 615, checked: false },
        { name: '250ml', count: 150, checked: false },
        { name: '500ml', count: 147, checked: false }
      ]
    },
    {
      title: 'Nhóm hương',
      options: [
        { name: 'Amber cay nồng', count: 151, checked: false },
        { name: 'Amber Vanilla', count: 21, checked: false },
        { name: 'Floral', count: 42, checked: false },
        { name: 'Oriental Floral', count: 18, checked: false },
        { name: 'Hương ngọt dịu', count: 327, checked: false },
        { name: 'Hương thơm mát lạnh', count: 265, checked: false }
      ]
    },
    {
      title: 'Theo mùa',
      options: [
        { name: 'Mùa xuân', count: 261, checked: false },
        { name: 'Mùa hạ', count: 211, checked: false },
        { name: 'Mùa thu', count: 123, checked: false },
        { name: 'Mùa đông', count: 186, checked: false }
      ]
    }
  ];

  // Rating options
  const ratingOptions = [
    { stars: 5, count: 1394 },
    { stars: 4, count: 90 },
    { stars: 3, count: 18 },
    { stars: 2, count: 5 },
    { stars: 1, count: 2 }
  ];


  const sortOptions = ['Mới nhất', 'Bán chạy', 'Giá thấp đến cao', 'Giá cao đến thấp'];


  const renderPagination = () => {
    return (
      <div className="flex justify-center items-center mt-4 gap-2">
        <button className="px-3 py-1 border rounded">{'<'}</button>
        <button className={`px-3 py-1 border rounded ${currentPage === 1 ? 'bg-gray-800 text-white' : ''}`} onClick={() => setCurrentPage(1)}>1</button>
        <button className={`px-3 py-1 border rounded ${currentPage === 2 ? 'bg-gray-800 text-white' : ''}`} onClick={() => setCurrentPage(2)}>2</button>
        <button className={`px-3 py-1 border rounded ${currentPage === 3 ? 'bg-gray-800 text-white' : ''}`} onClick={() => setCurrentPage(3)}>3</button>
        <button className="px-3 py-1 border rounded">...</button>
        <button className={`px-3 py-1 border rounded ${currentPage === 10 ? 'bg-gray-800 text-white' : ''}`} onClick={() => setCurrentPage(10)}>10</button>
        <button className="px-3 py-1 border rounded">{'>'}</button>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gray-900 text-white p-4">
        <div className="container px-16 mx-8">
          <div className="flex items-center text-sm">
            <a href="/" className="hover:underline">TRANG CHỦ</a>
            <span className="mx-2">/</span>
            <a href="/danh-muc" className="hover:underline">DANH MỤC</a>
            <span className="mx-2">/</span>
            <span>NƯỚC HOA NAM</span>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto p-4 flex">
        <div className="w-64 pr-6">
          <div className="mb-6">
            <button className="bg-gray-800 text-white px-4 py-2 rounded flex items-center text-sm">
              <span>Lọc sản phẩm theo</span>
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
          </div>

          {filterCategories.map((category, index) => (
            <div key={index} className="mb-6">
              <h3 className="font-semibold mb-2">{category.title}</h3>
              <ul>
                {category.options.map((option, idx) => (
                  <li key={idx} className="flex items-center mb-1">
                    <input
                      type="checkbox"
                      id={`${category.title}-${option.name}`}
                      checked={option.checked}
                      className="mr-2"
                    />
                    <label htmlFor={`${category.title}-${option.name}`} className="text-sm flex justify-between w-full">
                      <span>{option.name}</span>
                      <span className="text-gray-500">({option.count})</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))}


          <div className="mb-6">
            <h3 className="font-semibold mb-2">Khoảng giá</h3>
            <div className="flex justify-between text-sm mb-2">
              <span>150.000đ</span>
              <span>30.000.000đ</span>
            </div>
            <input type="range" className="w-full" />
          </div>


          <div className="mb-6">
            <h3 className="font-semibold mb-2">Đánh giá</h3>
            <ul>
              {ratingOptions.map((option, idx) => (
                <li key={idx} className="flex items-center mb-1">
                  <input
                    type="checkbox"
                    id={`rating-${option.stars}`}
                    className="mr-2"
                  />
                  <label htmlFor={`rating-${option.stars}`} className="text-sm flex items-center">
                    <div className="flex">
                      {Array(5).fill().map((_, i) => (
                        <svg key={i} className={`w-4 h-4 ${i < option.stars ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-gray-500">({option.count})</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </div>

    
        <div className="flex-1">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-4 text-center">NƯỚC HOA NAM</h1>
            
    
            <div className="flex mb-8 text-sm justify-center items-center">
              <span className="mr-2">Sắp xếp theo:</span>
              <div className="flex">
                {sortOptions.map((option, idx) => (
                  <button 
                    key={idx}
                    className={`px-3 py-1 border mx-1 rounded ${sortBy.toLowerCase() === option.toLowerCase() ? 'bg-gray-800 text-white' : ''}`}
                    onClick={() => setSortBy(option.toLowerCase())}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

      
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {products.map(product => (
                <div key={product.id} className="bg-white rounded shadow overflow-hidden">
                  <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover" />
                  <div className="p-3">
                    {/* <h3 className="font-semibold text-center">{product.name}</h3> */}
                    <p className="text-sm text-center">{product.description}</p>
                    <p className="text-xs text-center text-gray-500">{product.capacity}</p>
                    <div className="flex justify-center">
                      <p className="text-red-600 font-semibold text-sm">{product.originalPrice.toLocaleString()}</p>
                  <span className='mx-1 flex justify-center items-center'>-</span>
                      <p className="text-gray-800 font-semibold text-sm"> {product.salePrice.toLocaleString()}</p>
                    </div>
                    <div className="mt-2 flex justify-between">
                      <button className="bg-red-600 text-white text-xs px-3 py-1 rounded">Yêu thích</button>
                      <button className="bg-gray-800 text-white text-xs px-3 py-1 rounded">Xem thêm</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {renderPagination()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;