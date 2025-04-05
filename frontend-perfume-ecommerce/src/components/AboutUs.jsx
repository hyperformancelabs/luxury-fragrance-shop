import React from 'react'

const AboutUs = () => {
  return (
    <div>
        <div className='w-full px-16 my-10'>
            <div className='w-full flex items-center justify-center center'>
            <h2 className='font-extrabold text-3xl'>Về chúng tôi</h2>
            </div>
            <div className='mt-4 flex'>
            <div className='w-1/2 flex flex-col items-center justify-center'>
                <div className='w-64 h-64 rounded-full overflow-hidden mb-4'>
                <img src="ceo.jpg" alt="" />
                </div>
                <div className='text-center'>
                    <h3 className='font-bold text-2xl'>Tran Phi Hung</h3>
                    <p className='text-gray-600'>CEO & Founder</p>
                </div>
            </div>
            <div className='w-1/2 flex items-center justify-center'>
                <p>
                    Chúng tôi là một công ty thương mại điện tử hàng đầu, chuyên cung cấp các sản phẩm chất lượng cao và dịch vụ khách hàng tuyệt vời. Với nhiều năm kinh nghiệm trong ngành, chúng tôi cam kết mang đến cho khách hàng những trải nghiệm mua sắm tốt nhất.
                </p>
            </div>
            </div>
        </div>
    </div>
  )
}

export default AboutUs
