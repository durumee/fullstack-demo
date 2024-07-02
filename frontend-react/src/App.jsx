import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import { Menu, Home, ShoppingBag, User, ClipboardList, Settings, LogIn, LogOut } from 'lucide-react';
import Login from "./component/Login";
import Logout from "./component/Logout";
import Products from "./component/Products";
import MemberInfo from "./component/MemberInfo";
import OrderHistory from './component/OrderHistory';
import AdminApp from "./AdminApp";

// 메인 컴포넌트
function Main() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">메인 페이지</h1>
      <p className="text-lg">환영합니다! 이 페이지는 메인 페이지입니다.</p>
    </div>
  );
}

const isAuthenticated = () => {
  const token = sessionStorage.getItem("accessToken");
  return !!token;
};

const PrivateRoute = ({ element: Element, ...rest }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      setIsAuth(authenticated);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  return isAuth ? (
    <Element {...rest} />
  ) : (
    <Navigate to="/pages/login" replace state={{ from: location }} />
  );
};

const NavItem = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <li className="my-2 md:my-0 md:mr-4">
      <Link
        to={to}
        className={`flex items-center px-3 py-2 rounded-md transition duration-300 ease-in-out ${isActive
          ? "bg-blue-500 text-white"
          : "text-blue-600 hover:bg-blue-100 hover:text-blue-800"
          }`}
      >
        {icon}
        <span className="ml-2">{label}</span>
      </Link>
    </li>
  );
};

const NavLinks = ({ isAuth, handleLogout }) => (
  <>
    <NavItem to="/" icon={<Home size={20} />} label="메인" />
    <NavItem to="/pages/products" icon={<ShoppingBag size={20} />} label="상품" />
    <NavItem to="/pages/member-info" icon={<User size={20} />} label="회원정보" />
    <NavItem to="/pages/order-history" icon={<ClipboardList size={20} />} label="주문내역" />
    <NavItem to="/pages/admin" icon={<Settings size={20} />} label="관리자" />
    {isAuth ? (
      <li className="my-2 md:my-0">
        <Logout className="flex items-center text-blue-600 hover:bg-blue-100 hover:text-blue-800 px-3 py-2 rounded-md transition duration-300 ease-in-out" onLogout={handleLogout}>
          <LogOut size={20} className="mr-2" />
          로그아웃
        </Logout>
      </li>
    ) : (
      <NavItem to="/pages/login" icon={<LogIn size={20} />} label="로그인" />
    )}
  </>
);

function App() {
  const [isAuth, setIsAuth] = useState(isAuthenticated());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleAuthChange = () => {
      setIsAuth(isAuthenticated());
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("storage", handleAuthChange);
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("storage", handleAuthChange);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleLogin = () => {
    setIsAuth(true);
  };

  const handleLogout = () => {
    setIsAuth(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {isMobile ? (
          <>
            <button
              onClick={toggleMenu}
              className="fixed top-4 right-4 z-50 p-2 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors"
            >
              <Menu size={24} />
            </button>
            {isMenuOpen && (
              <div className="fixed inset-0 bg-white z-40 p-4">
                <nav>
                  <ul className="flex flex-col items-start pt-16">
                    <NavLinks isAuth={isAuth} handleLogout={handleLogout} />
                  </ul>
                </nav>
              </div>
            )}
          </>
        ) : (
          <nav className="bg-white shadow-md">
            <div className="container mx-auto px-4">
              <ul className="flex justify-center items-center h-16">
                <NavLinks isAuth={isAuth} handleLogout={handleLogout} />
              </ul>
            </div>
          </nav>
        )}
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/pages/products" element={<Products />} />
            <Route path="/pages/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/pages/member-info" element={<PrivateRoute element={MemberInfo} />} />
            <Route path="/pages/order-history" element={<PrivateRoute element={OrderHistory} />} />
            <Route path="/pages/admin/*" element={<PrivateRoute element={AdminApp} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;