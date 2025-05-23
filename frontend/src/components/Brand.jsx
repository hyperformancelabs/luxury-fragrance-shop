import React from 'react';
import { useNavigate } from 'react-router-dom';

const Brand = () => {
  const navigate = useNavigate();

  const brands = [
    "Dior", "Gucci", "Channel", "Kaja", "Versace", "TomFord",
    "Dior", "Hermès", "Givenchy", "YSL", "Armani", "Burberry"
  ];

  const handleBrandClick = (brandName) => {
    navigate(`/products/brand/${encodeURIComponent(brandName)}`);
  };

  return (
    <div id='brand' className="flex flex-col lg:flex-row my-10 px-4 lg:px-16 gap-6">
      <div className="lg:w-1/2 w-full">
        <img src="brand/5.jpg" alt="Main brand" className="w-full h-auto rounded-md" />
      </div>

      <div className="w-full grid grid-cols-3 md:grid-cols-4 gap-2">
        {brands.map((brand, index) => (
          <div
            key={index}
            className="border border-gray-300 rounded-md flex items-center justify-center overflow-hidden cursor-pointer hover:shadow-md transition"
            onClick={() => handleBrandClick(brand)}
          >
            {/* <img
              src="/stamp.png"
              alt={brand}
              className="w-28 object-cover"
            /> */}
            <span>{brand}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Brand;
