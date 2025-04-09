import React from 'react';

const AboutUs = () => {
  return (
    <div className="bg-gradient-to-b from-white to-gray-50 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className=" md:text-2xl font-bold text-gray-900 relative inline-block">
            VỀ CHÚNG TÔI
            <span className="block h-1 w-24 bg-pink-500 mx-auto mt-3"></span>
          </h2>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-10 items-center">
          <div className="w-full lg:w-2/5 flex flex-col items-center text-center">
            <div className="relative mb-6">
              <div className="w-56 h-56 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <img 
                  src="/avt.webp" 
                  alt="CEO Portrait" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                CEO
              </div>
            </div>
            
            <div className="mt-4">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900">Vũ Hoàng Phát</h3>
              <p className="text-pink-600 font-medium">CEO & Founder</p>
              
              <div className="flex justify-center mt-4 space-x-3">
                <a href="https://www.facebook.com/phatbiigdoiten" className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700 transition">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path></svg>
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center text-white hover:bg-blue-500 transition">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path></svg>
                </a>
                <a href="https://www.instagram.com/phatbiigdoiten/" className="w-8 h-8 rounded-full bg-pink-600 flex items-center justify-center text-white hover:bg-pink-700 transition">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
              </div>
            </div>
          </div>
          
          {/* About Text Section */}
          <div className="w-full lg:w-3/5">
            <div className="bg-white rounded-lg shadow-md p-6 md:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 -mt-8 -mr-8 bg-pink-100 rounded-full opacity-70"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 -mb-6 -ml-6 bg-pink-100 rounded-full opacity-70"></div>
              
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Chào mừng đến với <span className="text-pink-600">APH Perfume</span></h3>
              
              <div className="space-y-4 text-gray-700 relative z-10">
                <p className="leading-relaxed">
                  Chào mừng bạn đến với APH Perfume, nơi hội tụ những hương thơm tinh tế và đẳng cấp!
                </p>
                
                <p className="leading-relaxed">
                  Tôi là Vũ Hoàng Phát, người sáng lập và điều hành APH Perfume. Với niềm đam mê mãnh liệt dành cho nước hoa, tôi đã xây dựng thương hiệu này với mong muốn mang đến cho bạn những trải nghiệm hương thơm độc đáo và chất lượng nhất.
                </p>
                
                <p className="leading-relaxed">
                  Chúng tôi tự hào cung cấp các dòng nước hoa chính hãng, từ những thương hiệu danh tiếng đến các dòng niche cao cấp, giúp bạn tìm thấy mùi hương thể hiện phong cách và cá tính riêng.
                </p>
                
                <blockquote className="pl-4 border-l-4 border-pink-500 italic font-medium">
                  Tại APH Perfume, chúng tôi không chỉ bán nước hoa – chúng tôi kể những câu chuyện bằng hương thơm! Hãy để chúng tôi đồng hành cùng bạn trên hành trình khám phá bản thân qua từng nốt hương.
                </blockquote>
                
                <p className="leading-relaxed">
                  Cảm ơn bạn đã tin tưởng và lựa chọn chúng tôi!
                </p>
                
                <div className="mt-6 text-right italic">
                  <p className="text-pink-600 font-medium">CEO & Founder - Vũ Hoàng Phát</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        
      </div>
      <div className="mt-16 mx-4 md:mx-16 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Chất Lượng</h3>
            <p className="text-gray-600">Chúng tôi cam kết mang đến những sản phẩm nước hoa chính hãng với chất lượng tốt nhất.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Trải Nghiệm</h3>
            <p className="text-gray-600">Chúng tôi tạo ra không gian để bạn khám phá và trải nghiệm những hương thơm đặc biệt.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Đa Dạng</h3>
            <p className="text-gray-600">Với bộ sưu tập đa dạng, chúng tôi đáp ứng mọi phong cách và sở thích của khách hàng.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Đa Dạng</h3>
            <p className="text-gray-600">Với bộ sưu tập đa dạng, chúng tôi đáp ứng mọi phong cách và sở thích của khách hàng.</p>
          </div>
        </div>
    </div>
  );
};

export default AboutUs;