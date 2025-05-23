import React from 'react'
import { useNavigate } from 'react-router-dom';


const seasons = [
  { name: 'Mùa Xuân', value: 'spring', image: '/season/spring.jpg' },
  { name: 'Mùa Hạ', value: 'summer', image: '/season/summer.jpeg' },
  { name: 'Mùa Thu', value: 'autumn', image: '/season/autumn.jpeg' },
  { name: 'Mùa Đông', value: 'winter', image: '/season/winter.jpeg' }
]

const CollectionSeason = () => {
  const navigate = useNavigate()

  const handleClick = (season) => {
    navigate(`/products/season?season=${season}`)
  }

  return (
    <div className="w-full px-4 md:px-8 lg:px-16 my-6 md:my-10">
      <div className="w-full flex items-center justify-center mb-4 md:mb-6">
        <h2 className="font-bold text-xl md:text-2xl">BỘ SƯU TẬP THEO MÙA</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {seasons.map((season) => (
          <div
            key={season.value}
            onClick={() => handleClick(season.value)}
            className="relative bg-gray-200 h-48 md:h-56 lg:h-64 rounded-lg overflow-hidden group cursor-pointer"
          >
            <img
              src={season.image}
              alt={season.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="text-white font-bold text-xl md:text-2xl">{season.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CollectionSeason
