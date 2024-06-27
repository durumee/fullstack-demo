import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./Login.module.css"; // 스타일을 위한 CSS 모듈

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8080/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(formData).toString(),
      });

      if (response.ok) {
        const authHeader = response.headers.get("Authorization");
        if (authHeader && authHeader.startsWith("Bearer ")) {
          const jwtToken = authHeader.replace("Bearer ", "");
          sessionStorage.setItem("accessToken", jwtToken);
          onLogin(); // 로그인 상태로 전환
          navigate(from, { replace: true });
        } else {
          setError("Authorization 헤더가 없거나 형식이 잘못되었습니다.");
        }
      } else {
        setError("로그인 실패: 아이디나 비밀번호를 확인하세요.");
      }
    } catch (error) {
      setError("로그인 실패: 서버 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const setPreset = (username, password) => {
    setFormData({ username, password });
  };

  return (
    <div className={styles.loginContainer}>
      <h2>로그인</h2>
      <form onSubmit={handleLogin} className={styles.loginForm}>
        <input
          type="text"
          name="username"
          placeholder="아이디"
          value={formData.username}
          onChange={handleChange}
          className={styles.inputField}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="비밀번호"
          value={formData.password}
          onChange={handleChange}
          className={styles.inputField}
          required
        />
        <button type="submit" className={styles.submitButton} disabled={loading}>
          {loading ? "로그인 중..." : "로그인"}
        </button>
      </form>
      {error && <p className={styles.errorMessage}>{error}</p>}
      <div className={styles.presets}>
        <button onClick={() => setPreset("user", "qwaszx")} className={styles.presetButton}>
          사용자 로그인
        </button>
        <button onClick={() => setPreset("admin", "qwaszx")} className={styles.presetButton}>
          관리자 로그인
        </button>
      </div>
    </div>
  );
};

export default Login;
