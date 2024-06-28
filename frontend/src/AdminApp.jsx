import { Routes, Route, Link } from "react-router-dom";
import AdminUsers from "./component/AdminUsers";
import AdminRoles from "./component/AdminRoles";
import AdminMembers from "./component/AdminMembers";
import AdminProducts from "./component/AdminProducts";
import AdminOrders from "./component/AdminOrders";
import AdminShoppingLogs from "./component/AdminShoppingLogs";

function AdminApp() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">관리자 페이지</h1>
      <nav className="mb-8">
        <ul className="flex flex-wrap gap-4">
          <li>
            <Link to="/admin/members" className="text-blue-600 hover:text-blue-800">회원 관리</Link>
          </li>
          <li>
            <Link to="/admin/products" className="text-blue-600 hover:text-blue-800">상품 관리</Link>
          </li>
          <li>
            <Link to="/admin/orders" className="text-blue-600 hover:text-blue-800">주문 관리</Link>
          </li>
          <li>
            <Link to="/admin/shopping-logs" className="text-blue-600 hover:text-blue-800">쇼핑 로그</Link>
          </li>
          <li>
            <Link to="/admin/users" className="text-blue-600 hover:text-blue-800">시스템 사용자 관리</Link>
          </li>
          <li>
            <Link to="/admin/roles" className="text-blue-600 hover:text-blue-800">역할 관리</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="members" element={<AdminMembers />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="shopping-logs" element={<AdminShoppingLogs />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="roles" element={<AdminRoles />} />
      </Routes>
    </div>
  );
}

export default AdminApp;