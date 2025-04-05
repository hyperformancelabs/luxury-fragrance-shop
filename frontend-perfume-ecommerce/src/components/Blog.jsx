import React from 'react'

const Blog = () => {
  return (
    <div className='w-full px-16 my-10'>
        <div className='w-full flex items-center justify-start'>
            <h2 className='font-extrabold text-2xl'>Blog & Tin tức</h2>
        </div>
      <div className='flex my-4'>
        
        <div className='w-1/2 border-2 border-gray-200'>
                <div>
                    <img src="brand/5.jpg" alt="" />
                </div>
                <div>
                    <h3>Tiêu đề</h3>
                    <div className='flex justify-between'>
                    <p>Viết bởi: Admin</p>
                    <p>Ngày: 20/10/2023</p>
                    </div>
                </div>
            </div>
        
        <div className='w-1/2 ml-4'>
        <div className='grid grid-cols-2 gap-4'>

                <div className='border-2 border-gray-200'>
                <div className='w-72 h-auto'>
                    <img src="brand/5.jpg" alt="" />
                </div>
                <div className=''>
                    <h3 className='font-bold'>Tiêu đề</h3>
                    <div className='flex justify-between'>
                    <p>Viết bởi: Admin</p>
                    <p>Ngày: 20/10/2023</p>
                    </div>
                </div>
                </div>
                <div className='border-2 border-gray-200'>
                <div className='w-72 h-auto'>
                    <img src="brand/5.jpg" alt="" />
                </div>
                <div className=''>
                    <h3 className='font-bold'>Tiêu đề</h3>
                    <div className='flex justify-between'>
                    <p>Viết bởi: Admin</p>
                    <p>Ngày: 20/10/2023</p>
                    </div>
                </div>
                </div>
                <div className='border-2 border-gray-200'>
                <div className='w-72 h-auto'>
                    <img src="brand/5.jpg" alt="" />
                </div>
                <div className=''>
                    <h3 className='font-bold'>Tiêu đề</h3>
                    <div className='flex justify-between'>
                    <p>Viết bởi: Admin</p>
                    <p>Ngày: 20/10/2023</p>
                    </div>
                </div>
                </div>
                <div className='border-2 border-gray-200'>
                <div className='w-72 h-auto'>
                    <img src="brand/5.jpg" alt="" />
                </div>
                <div className=''>
                    <h3 className='font-bold'>Tiêu đề</h3>
                    <div className='flex justify-between'>
                    <p>Viết bởi: Admin</p>
                    <p>Ngày: 20/10/2023</p>
                    </div>
                </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Blog
