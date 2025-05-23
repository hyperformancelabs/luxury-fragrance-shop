import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CategoryPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const gender = searchParams.get('gender') || 'Unisex';
  const page = parseInt(searchParams.get('page') || '0');

  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`/api/v1/products/category?gender=${gender}&page=${page}`)
      .then((res) => {
        const { items, totalPages } = res.data.data;
        setProducts(items);
        setTotalPages(totalPages);
      })
      .catch((err) => {
        console.error('Error fetching products:', err);
      });
  }, [gender, page]);

  const handlePageChange = (newPage) => {
    setSearchParams({ gender, page: newPage });
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <h2 className="text-xl font-bold mb-4">Nước hoa: {gender}</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <div key={product.productId} className="border rounded-md p-2">
            <img
              src={product.imageUrl}
              alt={product.productName}
              className="w-full h-40 object-cover rounded"
            />
            <div className="mt-2 font-semibold text-sm">{product.productName}</div>
            <ul className="text-xs text-gray-600 mt-1">
              {product.volumePrices.map((vp) => (
                <li key={vp.productVariantId}>
                  {vp.volume}ml – {Number(vp.price).toLocaleString()}₫
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-4">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 0}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Trang trước
          </button>
          <span className="px-4 py-2">Trang {page + 1} / {totalPages}</span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages - 1}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Trang sau
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
