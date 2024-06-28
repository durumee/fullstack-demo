import { useEffect, useState } from "react";
import fetchWithAuth from "../util/fetchWithAuth";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    stockQuantity: "",
    categoryId: ""
  });
  const [editProduct, setEditProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetchWithAuth(`http://localhost:8080/admin/products?page=${currentPage}&size=5`);
        if (response.ok) {
          const data = await response.json();
          setProducts(data.content);
          setTotalPages(data.totalPages);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage]);

  const handleDeleteProduct = async (productId) => {
    try {
      const response = await fetchWithAuth(`http://localhost:8080/admin/products/${productId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProducts(products.filter(product => product.productId !== productId));
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleProductInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await fetchWithAuth("http://localhost:8080/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      });

      if (response.ok) {
        const createdProduct = await response.json();
        setProducts([...products, createdProduct]);
        setNewProduct({
          name: "",
          description: "",
          price: "",
          stockQuantity: "",
          categoryId: ""
        });
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEditProductChange = (e) => {
    const { name, value } = e.target;
    setEditProduct({ ...editProduct, [name]: value });
  };

  const handleEditProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetchWithAuth(`http://localhost:8080/admin/products/${editProduct.productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editProduct),
      });

      if (response.ok) {
        const updatedProduct = await response.json();
        setProducts(products.map(product => (product.productId === updatedProduct.productId ? updatedProduct : product)));
        setEditProduct(null);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">제품 관리</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleAddProduct} className="mb-8 bg-white shadow-md rounded px-8 pt-6 pb-8">
        <div className="mb-4 flex flex-wrap -mx-2">
          <div className="w-full md:w-1/2 px-2 mb-4 md:mb-0">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              제품명
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              name="name"
              value={newProduct.name}
              onChange={handleProductInputChange}
              required
              autoComplete="off"
            />
          </div>
          <div className="w-full md:w-1/2 px-2">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
              가격
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="price"
              type="number"
              name="price"
              value={newProduct.price}
              onChange={handleProductInputChange}
              required
              autoComplete="off"
            />
          </div>
        </div>
        <div className="mb-4 flex flex-wrap -mx-2">
          <div className="w-full md:w-1/2 px-2 mb-4 md:mb-0">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="stockQuantity">
              재고 수량
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="stockQuantity"
              type="number"
              name="stockQuantity"
              value={newProduct.stockQuantity}
              onChange={handleProductInputChange}
              required
              autoComplete="off"
            />
          </div>
          <div className="w-full md:w-1/2 px-2">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="categoryId">
              카테고리 ID
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="categoryId"
              type="number"
              name="categoryId"
              value={newProduct.categoryId}
              onChange={handleProductInputChange}
              required
              autoComplete="off"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            설명
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="description"
            name="description"
            value={newProduct.description}
            onChange={handleProductInputChange}
            required
            autoComplete="off"
            rows="3"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            제품 추가
          </button>
        </div>
      </form>
      <div className="overflow-x-auto">
        <ul className="flex flex-nowrap gap-4 pb-4">
          {products.map(product => (
            <li key={product.productId} className="flex-shrink-0 w-80 bg-white shadow-md rounded-lg p-4">
              {editProduct && editProduct.productId === product.productId ? (
                <form onSubmit={handleEditProductSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700">제품명</label>
                    <input
                      id="edit-name"
                      type="text"
                      name="name"
                      value={editProduct.name}
                      onChange={handleEditProductChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      required
                      autoComplete="off"
                    />
                  </div>
                  <div>
                    <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700">설명</label>
                    <textarea
                      id="edit-description"
                      name="description"
                      value={editProduct.description}
                      onChange={handleEditProductChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      required
                      autoComplete="off"
                      rows="3"
                    />
                  </div>
                  <div>
                    <label htmlFor="edit-price" className="block text-sm font-medium text-gray-700">가격</label>
                    <input
                      id="edit-price"
                      type="number"
                      name="price"
                      value={editProduct.price}
                      onChange={handleEditProductChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      required
                      autoComplete="off"
                    />
                  </div>
                  <div>
                    <label htmlFor="edit-stockQuantity" className="block text-sm font-medium text-gray-700">재고 수량</label>
                    <input
                      id="edit-stockQuantity"
                      type="number"
                      name="stockQuantity"
                      value={editProduct.stockQuantity}
                      onChange={handleEditProductChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      required
                      autoComplete="off"
                    />
                  </div>
                  <div>
                    <label htmlFor="edit-categoryId" className="block text-sm font-medium text-gray-700">카테고리 ID</label>
                    <input
                      id="edit-categoryId"
                      type="number"
                      name="categoryId"
                      value={editProduct.categoryId}
                      onChange={handleEditProductChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      required
                      autoComplete="off"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                      저장
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditProduct(null)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                    >
                      취소
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="mb-4">
                    <h3 className="font-bold text-lg">{product.name}</h3>
                    <p className="text-sm text-gray-600">{product.description}</p>
                    <p className="text-sm text-gray-600">가격: {product.price}</p>
                    <p className="text-sm text-gray-600">재고: {product.stockQuantity}</p>
                    <p className="text-sm text-gray-600">카테고리 ID: {product.categoryId}</p>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setEditProduct(product)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-2 rounded text-sm"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.productId)}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded text-sm"
                    >
                      삭제
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex justify-center items-center mt-6">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
          disabled={currentPage === 0}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l disabled:opacity-50"
        >
          이전
        </button>
        <span className="px-4">
          {currentPage + 1} / {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))}
          disabled={currentPage === totalPages - 1}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r disabled:opacity-50"
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default AdminProducts;