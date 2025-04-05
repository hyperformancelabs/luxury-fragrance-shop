import React from 'react'

const NewProduct = () => {
  return (
    <div className='flex flex-col my-10 px-16 w-full'>
        <div className='flex justify-between items-center my-5 '>
        <h2 className=' font-extrabold text-xl'>Sản phẩm mới</h2>
        <button>
            <p className='underline hover:text-red-600'>Xem tất cả</p>
        </button>
        </div>
        
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4'>
            {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className='flex flex-col items-center border-2 border-gray-300 rounded-lg p-4'>
                <img src="sp2.jpg" alt="" className='h-40 w-auto' />
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
  )
}

export default NewProduct
