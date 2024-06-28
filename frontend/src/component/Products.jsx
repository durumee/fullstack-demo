import { useState, useEffect } from 'react';
import fetchWithAuth from "../util/fetchWithAuth";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetchWithAuth(`http://localhost:8080/api/products?page=${currentPage}&size=10`);
        if (response.ok) {
          const data = await response.json();
          setProducts(data.content);
          setTotalPages(data.totalPages);
        } else {
          throw new Error('Failed to fetch products');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">상품 목록</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <div key={product.productId} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img src={product.imageUrl || 'https://via.placeholder.com/300x200'} alt={product.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
              <p className="text-gray-600 mb-2">{product.description}</p>
              <p className="text-gray-800 font-bold">{product.price.toLocaleString()}원</p>
              <p className="text-sm text-gray-500">재고: {product.stockQuantity}</p>
            </div>
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
            disabled={currentPage === 0}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-l disabled:opacity-50"
          >
            이전
          </button>
          <span className="bg-gray-200 text-gray-800 font-bold py-2 px-4">
            {currentPage + 1} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))}
            disabled={currentPage === totalPages - 1}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r disabled:opacity-50"
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
}

export default Products;