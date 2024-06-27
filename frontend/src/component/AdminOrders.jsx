import { useEffect, useState } from "react";
import styles from "./AdminOrders.module.css";
import fetchWithAuth from "../util/fetchWithAuth";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sort, setSort] = useState("orderDate,desc");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetchWithAuth(`http://localhost:8080/admin/orders?page=${currentPage}&size=5&sort=${sort}`);
        if (response.ok) {
          const data = await response.json();
          setOrders(data.content);
          setTotalPages(data.totalPages);
          setCurrentPage(data.number);
        } else {
          throw new Error("Failed to fetch orders");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentPage, sort]);

  const handleDeleteOrder = async (orderId) => {
    try {
      const response = await fetchWithAuth(`http://localhost:8080/admin/orders/${orderId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setOrders(orders.filter(order => order.id !== orderId));
      } else {
        throw new Error("Failed to delete order");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSortChange = (event) => {
    setSort(event.target.value);
    setCurrentPage(0);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.adminContainer}>
      <h1>주문 관리</h1>
      {error && <p className={styles.errorMessage}>{error}</p>}
      <div className={styles.sortContainer}>
        <label htmlFor="sort">정렬: </label>
        <select id="sort" value={sort} onChange={handleSortChange} className={styles.sortSelect}>
          <option value="orderDate,desc">날짜 (최신순)</option>
          <option value="orderDate,asc">날짜 (오래된순)</option>
          <option value="totalAmount,desc">금액 (높은순)</option>
          <option value="totalAmount,asc">금액 (낮은순)</option>
        </select>
      </div>
      <ul className={styles.orderList}>
        {orders.map(order => (
          <li key={order.id} className={styles.orderItem}>
            <div className={styles.orderInfo}>
              <h3>주문 ID: {order.id}</h3>
              <p>주문 번호: {order.orderNumber || "없음"}</p>
              <p>회원: {order.username}</p>
              <p>주문 일자: {new Date(order.orderDate).toLocaleString()}</p>
              <p>총 금액: {order.totalAmount.toLocaleString()} 원</p>
              <p>상태: {order.status || "미정"}</p>
              <h4>주문 항목:</h4>
              <ul>
                {order.orderItems.map(item => (
                  <li key={item.id}>
                    {item.productName} - {item.quantity}개, {item.price.toLocaleString()} 원
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.orderActions}>
              <button onClick={() => handleDeleteOrder(order.id)} className={styles.deleteButton}>삭제</button>
            </div>
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

export default AdminOrders;