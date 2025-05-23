import React from 'react';
import { useNavigate } from 'react-router-dom';

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Tiêu đề bài viết nổi bật",
      author: "Admin",
      date: "20/10/2023",
      image: "/brand/5.jpg",
      excerpt: "Mô tả ngắn về bài viết nổi bật này sẽ xuất hiện ở đây để thu hút người đọc."
    },
    {
      id: 2,
      title: "Tiêu đề bài viết 1",
      author: "Admin",
      date: "18/10/2023",
      image: "/brand/5.jpg",
      excerpt: "Mô tả ngắn về bài viết."
    },
    {
      id: 3,
      title: "Tiêu đề bài viết 2",
      author: "Admin",
      date: "15/10/2023",
      image: "/brand/5.jpg",
      excerpt: "Mô tả ngắn về bài viết."
    },
    {
      id: 4,
      title: "Tiêu đề bài viết 3",
      author: "Admin",
      date: "12/10/2023",
      image: "/brand/5.jpg",
      excerpt: "Mô tả ngắn về bài viết."
    },
    {
      id: 5,
      title: "Tiêu đề bài viết 4",
      author: "Admin",
      date: "10/10/2023",
      image: "/brand/5.jpg",
      excerpt: "Mô tả ngắn về bài viết."
    }
  ];

  const navigate = useNavigate();

  const handleViewMore = () => {
    navigate('/blog');
  };

  const FeaturedPost = ({ post }) => (
    <div className="w-full lg:w-1/2 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white">
      <div className="relative pt-[60%]">
        <img 
          src={post.image} 
          alt={post.title}
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-medium px-3 py-1 rounded-full">
          Nổi bật
        </div>
      </div>
      <div className="p-6">
        <h3 className="font-bold text-2xl mb-3 text-gray-800 hover:text-red-600 transition-colors duration-200">{post.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium">A</span>
            </div>
            <span>{post.author}</span>
          </div>
          <div className="flex items-center">
            <span className="text-sm">{post.date}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const RegularPost = ({ post }) => (
    <div className="rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white flex flex-col h-full">
      <div className="relative pt-[60%]">
        <img 
          src={post.image} 
          alt={post.title} 
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-lg mb-2 text-gray-800 hover:text-red-600 transition-colors duration-200">{post.title}</h3>
        <p className="text-gray-500 text-sm mb-3 line-clamp-2 flex-grow">{post.excerpt}</p>
        <div className="flex items-center justify-between text-xs text-gray-500 mt-auto">
          <span>{post.author}</span>
          <span>{post.date}</span>
        </div>
      </div>
    </div>
  );

  return (
    <section id="blog" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <h2 className="font-extrabold text-3xl text-gray-800">Blog & Tin tức</h2>
          <div className="hidden md:block">
            <a href="#" className="text-red-600 hover:text-red-700 font-medium flex items-center">
              Tất cả bài viết
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <FeaturedPost post={blogPosts[0]} />
          
          <div className="w-full lg:w-1/2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {blogPosts.slice(1).map(post => (
                <RegularPost key={post.id} post={post} />
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <button
          onClick={() => handleViewMore()}
           className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-300 flex items-center mx-auto">
            Xem thêm bài viết
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Blog;