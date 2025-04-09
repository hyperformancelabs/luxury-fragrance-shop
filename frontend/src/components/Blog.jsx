import React from 'react'

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Tiêu đề bài viết nổi bật",
      author: "Admin",
      date: "20/10/2023",
      image: "/brand/5.jpg"
    },
    {
      id: 2,
      title: "Tiêu đề bài viết 1",
      author: "Admin",
      date: "18/10/2023",
      image: "/brand/5.jpg"
    },
    {
      id: 3,
      title: "Tiêu đề bài viết 2",
      author: "Admin",
      date: "15/10/2023",
      image: "/brand/5.jpg"
    },
    {
      id: 4,
      title: "Tiêu đề bài viết 3",
      author: "Admin",
      date: "12/10/2023",
      image: "/brand/5.jpg"
    },
    {
      id: 5,
      title: "Tiêu đề bài viết 4",
      author: "Admin",
      date: "10/10/2023",
      image: "/brand/5.jpg"
    }
  ];

  const FeaturedPost = ({ post }) => (
    <div id='blog' className="w-full lg:w-1/2 border-2 border-gray-200 rounded-lg overflow-hidden transition-transform duration-300 hover:shadow-lg hover:scale-[1.01]">
      <div className="relative pt-[60%] md:pt-[55%] lg:pt-[60%]">
        <img 
          src={post.image} 
          alt={post.title}
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-bold text-xl mb-2">{post.title}</h3>
        <div className="flex flex-col sm:flex-row justify-between text-sm text-gray-600">
          <p>Viết bởi: {post.author}</p>
          <p>Ngày: {post.date}</p>
        </div>
      </div>
    </div>
  );

  const RegularPost = ({ post }) => (
    <div className="border-2 border-gray-200 rounded-lg overflow-hidden transition-transform duration-300 hover:shadow-lg hover:scale-[1.02]">
      <div className="relative pt-[70%]">
        <img 
          src={post.image} 
          alt={post.title} 
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
      </div>
      <div className="p-3">
        <h3 className="font-bold text-base mb-1">{post.title}</h3>
        <div className="flex flex-col sm:flex-row justify-between text-xs text-gray-600">
          <p>Viết bởi: {post.author}</p>
          <p>Ngày: {post.date}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-16 my-10">
      <div className="w-full flex items-center justify-start mb-6">
        <h2 className="font-extrabold text-xl sm:text-2xl">Blog & Tin tức</h2>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        <FeaturedPost post={blogPosts[0]} />
        
        <div className="w-full lg:w-1/2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {blogPosts.slice(1).map(post => (
              <RegularPost key={post.id} post={post} />
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <button className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg">
          Xem thêm bài viết
        </button>
      </div>
    </div>
  )
}

export default Blog