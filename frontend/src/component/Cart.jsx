import { useEffect, useState } from "react";
import fetchWithAuth from "../util/fetchWithAuth"; // fetchWithAuth 함수를 별도 파일로 분리하여 사용

const Cart = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchWithAuth("http://localhost:8080/api/product");
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          setError("조회 중 오류가 발생했습니다.");
        }
      } catch (error) {
        setError("조회 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Info 페이지</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p>가격: {product.price}원</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Cart;
