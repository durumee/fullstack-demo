import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import { Menu } from 'lucide-react';
import styles from "./App.module.css";
import Login from "./component/Login";
import Logout from "./component/Logout";
import Cart from "./component/Cart";
import AdminUsers from "./component/AdminUsers";
import AdminRoles from "./component/AdminRoles";
import AdminMembers from "./component/AdminMembers";
import AdminProducts from "./component/AdminProducts";
import AdminOrders from "./component/AdminOrders";
import AdminShoppingLogs from "./component/AdminShoppingLogs";

// 메인 컴포넌트
function Main() {
  return (
    <div>
      <h1>메인 페이지</h1>
      <p>환영합니다! 이 페이지는 메인 페이지입니다.</p>
    </div>
  );
}

// About 컴포넌트
function About() {
  return (
    <div>
      <h1>About 페이지</h1>
      <p>이 페이지는 About 페이지입니다.</p>
    </div>
  );
}

// Info 컴포넌트
function Info() {
  return (
    <div>
      <h1>Info 페이지</h1>
      <p>이 페이지는 Info 페이지입니다.</p>
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
    return <div>Loading...</div>;
  }
  return isAuth ? (
    <Element {...rest} />
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
};

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

  const NavLinks = () => (
    <>
      <li className={styles.navItem}>
        <Link to="/" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>
          메인
        </Link>
      </li>
      <li className={styles.navItem}>
        <Link to="/about" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>
          About
        </Link>
      </li>
      <li className={styles.navItem}>
        <Link to="/info" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>
          Info
        </Link>
      </li>
      <li className={styles.navItem}>
        <Link to="/cart" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>
          Cart
        </Link>
      </li>
      <li className={styles.navItem}>
        <Link to="/admin/members" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>
          Members
        </Link>
      </li>
      <li className={styles.navItem}>
        <Link to="/admin/products" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>
          Products
        </Link>
      </li>
      <li className={styles.navItem}>
        <Link to="/admin/orders" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>
          Orders
        </Link>
      </li>
      <li className={styles.navItem}>
        <Link to="/admin/shopping-logs" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>
          ShoppingLogs
        </Link>
      </li>
      <li className={styles.navItem}>
        <Link to="/admin/users" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>
          Users
        </Link>
      </li>
      <li className={styles.navItem}>
        <Link to="/admin/roles" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>
          Roles
        </Link>
      </li>
      {isAuth ? (
        <li className={styles.navItem}>
          <Logout className={styles.navLink} onLogout={handleLogout} />
        </li>
      ) : (
        <li className={styles.navItem}>
          <Link to="/login" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>
            Login
          </Link>
        </li>
      )}
    </>
  );

  return (
    <Router>
      <div>
        {isMobile ? (
          <>
            <button
              onClick={toggleMenu}
              className={`${styles.hamburgerButton} fixed top-4 right-4 z-50 p-2 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors`}
            >
              <Menu size={24} />
            </button>
            {isMenuOpen && (
              <div className={`${styles.mobileMenu} fixed inset-0 bg-white z-40`}>
                <nav>
                  <ul className={`${styles.mobileNavList} pt-16`}>
                    <NavLinks />
                  </ul>
                </nav>
              </div>
            )}
          </>
        ) : (
          <nav className={styles.navBar}>
            <ul className={styles.navList}>
              <NavLinks />
            </ul>
          </nav>
        )}
        <div className={styles.content}>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/info" element={<PrivateRoute element={Info} />} />
            <Route path="/admin/users" element={<PrivateRoute element={AdminUsers} />} />
            <Route path="/admin/roles" element={<PrivateRoute element={AdminRoles} />} />
            <Route path="/admin/members" element={<PrivateRoute element={AdminMembers} />} />
            <Route path="/admin/products" element={<PrivateRoute element={AdminProducts} />} />
            <Route path="/admin/orders" element={<PrivateRoute element={AdminOrders} />} />
            <Route path="/admin/shopping-logs" element={<PrivateRoute element={AdminShoppingLogs} />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;