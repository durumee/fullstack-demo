import React, { useEffect, useState } from "react";
import styles from "./AdminProducts.module.css";
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
      const response = await fetchWithAuth("http://localhost:8080/admin/products/", {
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
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.adminContainer}>
      <h1>제품 관리</h1>
      {error && <p className={styles.errorMessage}>{error}</p>}
      <form onSubmit={handleAddProduct} className={styles.addProductForm}>
        <div className={styles.inputGroup}>
          <label htmlFor="name">제품명</label>
          <input
            id="name"
            type="text"
            name="name"
            value={newProduct.name}
            onChange={handleProductInputChange}
            className={styles.inputField}
            required
            autoComplete="off"
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="description">설명</label>
          <textarea
            id="description"
            name="description"
            value={newProduct.description}
            onChange={handleProductInputChange}
            className={styles.inputField}
            required
            autoComplete="off"
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="price">가격</label>
          <input
            id="price"
            type="number"
            name="price"
            value={newProduct.price}
            onChange={handleProductInputChange}
            className={styles.inputField}
            required
            autoComplete="off"
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="stockQuantity">재고 수량</label>
          <input
            id="stockQuantity"
            type="number"
            name="stockQuantity"
            value={newProduct.stockQuantity}
            onChange={handleProductInputChange}
            className={styles.inputField}
            required
            autoComplete="off"
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="categoryId">카테고리 ID</label>
          <input
            id="categoryId"
            type="number"
            name="categoryId"
            value={newProduct.categoryId}
            onChange={handleProductInputChange}
            className={styles.inputField}
            required
            autoComplete="off"
          />
        </div>
        <button type="submit" className={styles.submitButton}>제품 추가</button>
      </form>
      <ul className={styles.productList}>
        {products.map(product => (
          <li key={product.productId} className={styles.productItem}>
            {editProduct && editProduct.productId === product.productId ? (
              <form onSubmit={handleEditProductSubmit} className={styles.editProductForm}>
                <div className={styles.inputGroup}>
                  <label htmlFor="edit-name">제품명</label>
                  <input
                    id="edit-name"
                    type="text"
                    name="name"
                    value={editProduct.name}
                    onChange={handleEditProductChange}
                    className={styles.inputField}
                    required
                    autoComplete="off"
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="edit-description">설명</label>
                  <textarea
                    id="edit-description"
                    name="description"
                    value={editProduct.description}
                    onChange={handleEditProductChange}
                    className={styles.inputField}
                    required
                    autoComplete="off"
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="edit-price">가격</label>
                  <input
                    id="edit-price"
                    type="number"
                    name="price"
                    value={editProduct.price}
                    onChange={handleEditProductChange}
                    className={styles.inputField}
                    required
                    autoComplete="off"
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="edit-stockQuantity">재고 수량</label>
                  <input
                    id="edit-stockQuantity"
                    type="number"
                    name="stockQuantity"
                    value={editProduct.stockQuantity}
                    onChange={handleEditProductChange}
                    className={styles.inputField}
                    required
                    autoComplete="off"
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="edit-categoryId">카테고리 ID</label>
                  <input
                    id="edit-categoryId"
                    type="number"
                    name="categoryId"
                    value={editProduct.categoryId}
                    onChange={handleEditProductChange}
                    className={styles.inputField}
                    required
                    autoComplete="off"
                  />
                </div>
                <button type="submit" className={styles.submitButton}>저장</button>
                <button type="button" onClick={() => setEditProduct(null)} className={styles.cancelButton}>취소</button>
              </form>
            ) : (
              <>
                <div className={styles.productInfo}>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <p>가격: {product.price}</p>
                  <p>재고: {product.stockQuantity}</p>
                  <p>카테고리 ID: {product.categoryId}</p>
                </div>
                <div className={styles.productActions}>
                  <button onClick={() => setEditProduct(product)} className={styles.editButton}>수정</button>
                  <button onClick={() => handleDeleteProduct(product.productId)} className={styles.deleteButton}>삭제</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
      <div className={styles.pagination}>
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
          disabled={currentPage === 0}
        >
          이전
        </button>
        <span>{currentPage + 1} / {totalPages}</span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))}
          disabled={currentPage === totalPages - 1}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default AdminProducts;