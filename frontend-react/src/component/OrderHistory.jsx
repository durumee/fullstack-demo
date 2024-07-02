import { useState, useEffect } from 'react';
import fetchWithAuth from "../util/fetchWithAuth";
import { ChevronLeft, ChevronRight, Calendar, CircleDollarSign, Truck } from 'lucide-react';

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetchWithAuth(`/api/orders?page=${currentPage}&size=10`);
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

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'processing': return 'text-yellow-600 bg-yellow-100';
      case 'shipped': return 'text-blue-600 bg-blue-100';
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
  </div>;

  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">주문 내역</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {orders.map(order => (
          <div key={order.id} className="bg-white rounded-lg shadow-lg overflow-hidden transition duration-300 ease-in-out transform hover:scale-105">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">주문 #{order.orderNumber}</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                  {order.statusKo}
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span>{new Date(order.orderDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-gray-800 font-bold">
                  <CircleDollarSign className="w-5 h-5 mr-2" />
                  <span>{order.totalAmount.toLocaleString()}원</span>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-700">주문 상품</h3>
                <ul className="space-y-2">
                  {order.orderItems.map(item => (
                    <li key={item.id} className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">{item.productName}</span>
                      <span className="text-gray-800 font-semibold">{item.quantity}개, {item.price.toLocaleString()}원</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center text-blue-600">
                  <Truck className="w-5 h-5 mr-2" />
                  <span className="text-sm font-semibold">배송 추적</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
            disabled={currentPage === 0}
            className="flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <span className="mx-4 flex items-center text-gray-700">
            {currentPage + 1} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))}
            disabled={currentPage === totalPages - 1}
            className="flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
}

export default OrderHistory;