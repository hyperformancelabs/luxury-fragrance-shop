import React from 'react'

const Brand = () => {
  return (
    <div id='brand' className="flex flex-col lg:flex-row my-10 px-4 lg:px-16 gap-6">
      <div className="lg:w-1/2 w-full">
        <img src="brand/5.jpg" alt="Main brand" className="w-full h-auto rounded-md" />
      </div>

      <div className="w-full grid grid-cols-3 md:grid-cols-4 gap-2">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="border border-gray-300 rounded-md flex items-center justify-center overflow-hidden">
            <img
              src="brand/channel.jpg"
              alt={`Channel ${index}`}
              className="w-28 object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Brand
