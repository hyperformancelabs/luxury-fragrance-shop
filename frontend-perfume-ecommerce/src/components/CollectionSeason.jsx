import React from 'react'

const CollectionSeason = () => {
  return (
    <div className='w-full px-16 my-10'>
      <div className='w-full flex items-center justify-center center'>
      <h2 className='font-extrabold text-3xl'>Bộ sưu tập theo mùa</h2>

      </div>
      <div className='grid grid-cols-4 gap-4 mt-4'>
        <div className='bg-gray-200 h-64 rounded-lg flex items-center justify-center'>
          <img src='https://via.placeholder.com/150' alt='Season 1' className='rounded-lg' />
      </div>
      <div className='bg-gray-200 h-64 rounded-lg flex items-center justify-center'>
          <img src='https://via.placeholder.com/150' alt='Season 1' className='rounded-lg' />
      </div>
      <div className='bg-gray-200 h-64 rounded-lg flex items-center justify-center'>
          <img src='https://via.placeholder.com/150' alt='Season 1' className='rounded-lg' />
      </div>
      <div className='bg-gray-200 h-64 rounded-lg flex items-center justify-center'>
          <img src='https://via.placeholder.com/150' alt='Season 1' className='rounded-lg' />
      </div>
      
      
     
     </div>
    </div>
  )
}

export default CollectionSeason
