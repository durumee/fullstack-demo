import { useNavigate, Link } from "react-router-dom";

const Logout = ({ className, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const token = sessionStorage.getItem("accessToken");

    if (token) {
      try {
        const response = await fetch("http://localhost:8080/invalidate-token", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.ok) {
          sessionStorage.removeItem("accessToken");
          onLogout(); // 로그아웃 상태로 전환
          navigate("/login");
        } else {
          console.error("Failed to logout");
        }
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }
  };

  return (
    <Link to="#" onClick={handleLogout} className={className}>
      Logout
    </Link>
  );
};

export default Logout;
