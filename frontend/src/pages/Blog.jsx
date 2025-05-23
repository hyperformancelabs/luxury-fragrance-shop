import React, { useState, useEffect } from 'react';

const Blog = () => {
  const [loading, setLoading] = useState(true);
  const [featuredPost, setFeaturedPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState(null);

  useEffect(() => {
    // Simulate API fetch for blog data
    const fetchBlogData = async () => {
      try {
        setLoading(true);
        // In a real app, these would be API calls
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
        
        // Simulate featured post data
        const mockFeaturedPost = {
          id: 1,
          title: "Khám phá bí mật của nước hoa phương Đông",
          excerpt: "Hành trình tìm hiểu về những hương thơm đặc trưng và lịch sử phong phú của nước hoa phương Đông qua các thời kỳ...",
          content: "Nước hoa phương Đông luôn mang trong mình những nét đặc trưng riêng biệt với hương thơm nồng nàn, đậm đà và kéo dài. Bài viết này sẽ đưa bạn đến với hành trình khám phá những bí mật đằng sau những chai nước hoa đầy mê hoặc từ các quốc gia như Ả Rập, Ấn Độ và nhiều nền văn hóa phương Đông khác.",
          image: "https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          author: "Hương Trần",
          date: "28/04/2025",
          category: "Kiến thức",
          readTime: "8 phút đọc",
          tags: ["nước hoa Á Đông", "hương liệu", "văn hóa"]
        };
        
        // Simulate recent posts data
        const mockRecentPosts = [
          {
            id: 2,
            title: "10 nước hoa nam được yêu thích nhất mùa hè 2025",
            excerpt: "Điểm qua những chai nước hoa nam đang làm mưa làm gió trong mùa hè năm nay...",
            image: "https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            author: "Minh Đức",
            date: "25/04/2025",
            category: "Gợi ý",
            readTime: "5 phút đọc"
          },
          {
            id: 3,
            title: "Cách chọn nước hoa phù hợp với từng dịp",
            excerpt: "Bí quyết lựa chọn nước hoa phù hợp với từng sự kiện, thời điểm và không gian...",
            image: "https://images.unsplash.com/photo-1563170351-be82bc888aa4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            author: "Thanh Mai",
            date: "22/04/2025",
            category: "Hướng dẫn",
            readTime: "6 phút đọc"
          },
          {
            id: 4,
            title: "Nước hoa và tâm lý học: Mối liên hệ giữa mùi hương và cảm xúc",
            excerpt: "Khám phá cách mùi hương ảnh hưởng đến tâm trạng, cảm xúc và kí ức của con người...",
            image: "https://images.unsplash.com/photo-1615526675741-91813d248dce?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            author: "Hà Linh",
            date: "18/04/2025",
            category: "Khoa học",
            readTime: "10 phút đọc"
          },
          {
            id: 5,
            title: "Những xu hướng nước hoa nổi bật trong năm 2025",
            excerpt: "Điểm lại những xu hướng nước hoa mới nhất đang thống trị thị trường...",
            image: "https://images.unsplash.com/photo-1598662957563-ee4965d4d72c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            author: "Tuấn Anh",
            date: "15/04/2025",
            category: "Xu hướng",
            readTime: "7 phút đọc"
          },
          {
            id: 6,
            title: "5 thương hiệu nước hoa Việt Nam đang làm mưa làm gió",
            excerpt: "Khám phá những thương hiệu nước hoa nội địa đang chiếm lĩnh thị trường trong nước...",
            image: "https://images.unsplash.com/photo-1595425970377-c9703cf48b63?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            author: "Hương Giang",
            date: "10/04/2025",
            category: "Thương hiệu",
            readTime: "8 phút đọc"
          },
          {
            id: 7,
            title: "Hướng dẫn bảo quản nước hoa đúng cách để giữ hương lâu",
            excerpt: "Những bí quyết giúp bạn bảo quản nước hoa tốt nhất và kéo dài tuổi thọ của sản phẩm...",
            image: "https://images.unsplash.com/photo-1619994403073-2cec844b8e63?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            author: "Thảo Nguyên",
            date: "05/04/2025",
            category: "Hướng dẫn",
            readTime: "6 phút đọc"
          }
        ];
        
        // Simulate categories data
        const mockCategories = [
          { id: 'all', name: 'Tất cả', count: mockRecentPosts.length + 1 },
          { id: 'knowledge', name: 'Kiến thức', count: 8 },
          { id: 'suggestions', name: 'Gợi ý', count: 12 },
          { id: 'guides', name: 'Hướng dẫn', count: 10 },
          { id: 'trends', name: 'Xu hướng', count: 7 },
          { id: 'brands', name: 'Thương hiệu', count: 9 },
          { id: 'science', name: 'Khoa học', count: 5 }
        ];
        
        setFeaturedPost(mockFeaturedPost);
        setRecentPosts(mockRecentPosts);
        setCategories(mockCategories);
      } catch (error) {
        console.error("Error fetching blog data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlogData();
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    
    // Simple email validation
    if (!email || !email.includes('@') || email.length < 5) {
      setSubscribeStatus({ success: false, message: 'Vui lòng nhập email hợp lệ' });
      return;
    }
    
    // Simulate API call to subscribe
    setSubscribeStatus({ loading: true });
    
    // Fake API delay
    setTimeout(() => {
      setSubscribeStatus({ 
        success: true, 
        message: 'Đăng ký nhận tin thành công!'
      });
      setEmail('');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSubscribeStatus(null);
      }, 3000);
    }, 1000);
  };
  
  const formatDate = (dateString) => {
    const parts = dateString.split('/');
    return `${parts[0]} Tháng ${parts[1]}, ${parts[2]}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header with navigation */}
      
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">Blog</h1>
          <p className="text-gray-600">Khám phá thế giới nước hoa qua những bài viết chuyên sâu</p>
        </div>
        
        {/* Featured Post */}
        {featuredPost && (
          <div className="mb-12">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <div className="h-64 md:h-full relative">
                    <img 
                      src={featuredPost.image} 
                      alt={featuredPost.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-red-600 text-white px-3 py-1 text-xs font-semibold rounded">
                        Bài nổi bật
                      </span>
                    </div>
                  </div>
                </div>
                <div className="md:w-1/2 p-6 md:p-8">
                  <div className="flex items-center mb-4">
                    <span className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full font-medium">
                      {featuredPost.category}
                    </span>
                    <span className="mx-2 text-xs text-gray-500">•</span>
                    <span className="text-xs text-gray-500">{formatDate(featuredPost.date)}</span>
                    <span className="mx-2 text-xs text-gray-500">•</span>
                    <span className="text-xs text-gray-500">{featuredPost.readTime}</span>
                  </div>
                  <h2 className="text-2xl font-bold mb-4">{featuredPost.title}</h2>
                  <p className="text-gray-600 mb-6">{featuredPost.content}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                        <span className="font-medium text-xs">{featuredPost.author.charAt(0)}</span>
                      </div>
                      <span className="text-sm font-medium">{featuredPost.author}</span>
                    </div>
                    <a 
                      href={`/blog/${featuredPost.id}`} 
                      className="text-red-600 hover:text-red-700 font-medium flex items-center transition-colors"
                    >
                      Đọc tiếp
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Categories and Posts */}
        <div className="flex flex-col lg:flex-row">
          {/* Left Sidebar - Categories */}
          <div className="lg:w-1/4 mb-8 lg:mb-0 lg:pr-8">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-bold mb-4">Danh mục</h3>
              <ul className="space-y-2">
                {categories.map(category => (
                  <li key={category.id}>
                    <button 
                      className={`flex items-center justify-between w-full py-2 px-3 rounded-md transition-colors ${
                        activeCategory === category.id 
                          ? 'bg-red-50 text-red-600' 
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setActiveCategory(category.id)}
                    >
                      <span>{category.name}</span>
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                        {category.count}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Newsletter signup */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg shadow-md p-6 text-white">
              <h3 className="text-lg font-bold mb-2">Đăng ký nhận tin</h3>
              <p className="text-gray-300 text-sm mb-4">
                Cập nhật những xu hướng nước hoa mới nhất và bài viết hấp dẫn
              </p>
              <form onSubmit={handleSubscribe}>
                <div className="mb-3">
                  <input 
                    type="email" 
                    placeholder="Email của bạn" 
                    className="w-full px-4 py-2 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                  disabled={subscribeStatus?.loading}
                >
                  {subscribeStatus?.loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Đang xử lý...
                    </span>
                  ) : "Đăng ký"}
                </button>
                {subscribeStatus && !subscribeStatus.loading && (
                  <div className={`mt-2 text-sm ${subscribeStatus.success ? 'text-green-400' : 'text-red-400'}`}>
                    {subscribeStatus.message}
                  </div>
                )}
              </form>
            </div>
          </div>
          
          {/* Right Content - Posts Grid */}
          <div className="lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Bài viết mới nhất</h2>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-3">Sắp xếp theo:</span>
                <select className="bg-white border border-gray-300 text-sm rounded-md px-3 py-1 focus:outline-none focus:ring-1 focus:ring-black">
                  <option>Mới nhất</option>
                  <option>Phổ biến nhất</option>
                  <option>Xem nhiều nhất</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentPosts.map(post => (
                <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-black bg-opacity-70 text-white px-2 py-1 text-xs rounded">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center text-xs text-gray-500 mb-3">
                      <span>{formatDate(post.date)}</span>
                      <span className="mx-2">•</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h3 className="font-bold text-lg mb-2 line-clamp-2 h-14">{post.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center mr-2">
                          <span className="font-medium text-xs">{post.author.charAt(0)}</span>
                        </div>
                        <span className="text-xs font-medium">{post.author}</span>
                      </div>
                      <a 
                        href={`/blog/${post.id}`} 
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Đọc tiếp
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Pagination */}
            <div className="mt-10 flex justify-center">
              <nav className="flex items-center space-x-1">
                <button className="px-3 py-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                  </svg>
                </button>
                <button className="px-4 py-2 rounded-md bg-red-600 text-white font-medium">1</button>
                <button className="px-4 py-2 rounded-md hover:bg-gray-50">2</button>
                <button className="px-4 py-2 rounded-md hover:bg-gray-50">3</button>
                <span className="px-4 py-2">...</span>
                <button className="px-4 py-2 rounded-md hover:bg-gray-50">10</button>
                <button className="px-3 py-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </main>
      </div>
    
  );
};
export default Blog;