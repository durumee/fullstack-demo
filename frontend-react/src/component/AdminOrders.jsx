import { useEffect, useState } from "react";
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
        const response = await fetchWithAuth(`/admin/orders?page=${currentPage}&size=5&sort=${sort}`);
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
      const response = await fetchWithAuth(`/admin/orders/${orderId}`, {
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
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">주문 관리</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="mb-4">
        <label htmlFor="sort" className="mr-2">정렬: </label>
        <select
          id="sort"
          value={sort}
          onChange={handleSortChange}
          className="border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="orderDate,desc">날짜 (최신순)</option>
          <option value="orderDate,asc">날짜 (오래된순)</option>
          <option value="totalAmount,desc">금액 (높은순)</option>
          <option value="totalAmount,asc">금액 (낮은순)</option>
        </select>
      </div>
      <ul className="space-y-4">
        {orders.map(order => (
          <li key={order.id} className="bg-white shadow-md rounded-lg p-6">
            <div className="mb-4">
              <h3 className="text-xl font-semibold mb-2">주문 ID: {order.id}</h3>
              <p className="text-gray-600">주문 번호: {order.orderNumber || "없음"}</p>
              <p className="text-gray-600">회원: {order.username}</p>
              <p className="text-gray-600">주문 일자: {new Date(order.orderDate).toLocaleString()}</p>
              <p className="text-gray-600">총 금액: {order.totalAmount.toLocaleString()} 원</p>
              <p className="text-gray-600">상태: {order.status || "미정"}</p>
              <h4 className="font-semibold mt-4 mb-2">주문 항목:</h4>
              <ul className="list-disc pl-5">
                {order.orderItems.map(item => (
                  <li key={item.id} className="text-gray-600">
                    {item.productName} - {item.quantity}개, {item.price.toLocaleString()} 원
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => handleDeleteOrder(order.id)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                삭제
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="flex justify-center items-center mt-6">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
          disabled={currentPage === 0}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-l focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
        >
          이전
        </button>
        <span className="px-4 py-2 bg-gray-200">
          {currentPage + 1} / {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))}
          disabled={currentPage === totalPages - 1}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default AdminOrders;