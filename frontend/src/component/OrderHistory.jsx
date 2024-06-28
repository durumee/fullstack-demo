import { useState, useEffect } from 'react';
import fetchWithAuth from "../util/fetchWithAuth";

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetchWithAuth(`http://localhost:8080/api/orders?page=${currentPage}&size=10`);
        if (response.ok) {
          const data = await response.json();
          setOrders(data.content);
          setTotalPages(data.totalPages);
        } else {
          throw new Error('Failed to fetch orders');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentPage]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">주문 내역</h1>
      <div className="space-y-6">
        {orders.map(order => (
          <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">주문 번호: {order.orderNumber}</h2>
              <p className="text-gray-600 mb-2">주문 날짜: {new Date(order.orderDate).toLocaleDateString()}</p>
              <p className="text-gray-800 font-bold mb-4">총 금액: {order.totalAmount.toLocaleString()}원</p>
              <h3 className="text-lg font-semibold mb-2">주문 상품:</h3>
              <ul className="list-disc pl-5">
                {order.orderItems.map(item => (
                  <li key={item.id} className="text-gray-600">
                    {item.productName} - {item.quantity}개, {item.price.toLocaleString()}원
                  </li>
                ))}
              </ul>
              <p className="text-gray-600 mt-4">상태: {order.status}</p>
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

export default OrderHistory;