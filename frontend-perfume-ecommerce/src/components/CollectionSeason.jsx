import React from 'react'

const CollectionSeason = () => {
  return (
    <div className="w-full px-4 md:px-8 lg:px-16 my-6 md:my-10">
      <div className="w-full flex items-center justify-center mb-4 md:mb-6">
        <h2 className="font-bold text-xl md:text-2xl ">BỘ SƯU TẬP THEO MÙA</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="relative bg-gray-200 h-48 md:h-56 lg:h-64 rounded-lg overflow-hidden group cursor-pointer">
          <img
            src="/season/spring.jpg"
            alt="Spring Collection"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <span className="text-white font-bold text-xl md:text-2xl">Mùa Xuân</span>
          </div>
        </div>

        <div className="relative bg-gray-200 h-48 md:h-56 lg:h-64 rounded-lg overflow-hidden group cursor-pointer">
          <img
            src="/season/summer.jpeg"
            alt="Summer Collection"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <span className="text-white font-bold text-xl md:text-2xl">Mùa Hạ</span>
          </div>
        </div>

        <div className="relative bg-gray-200 h-48 md:h-56 lg:h-64 rounded-lg overflow-hidden group cursor-pointer">
          <img
            src="/season/autumn.jpeg"
            alt="Autumn Collection"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <span className="text-white font-bold text-xl md:text-2xl">Mùa Thu</span>
          </div>
        </div>

        <div className="relative bg-gray-200 h-48 md:h-56 lg:h-64 rounded-lg overflow-hidden group cursor-pointer">
          <img
            src="/season/winter.jpeg"
            alt="Winter Collection"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <span className="text-white font-bold text-xl md:text-2xl">Mùa Đông</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CollectionSeason