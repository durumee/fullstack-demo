// src/utils/fetchWithAuth.js

const fetchWithAuth = async (url, options = {}) => {
  let token = sessionStorage.getItem("accessToken");

  // 토큰이 없으면 로그인 페이지로 리디렉션
  if (!token) {
    window.location.href = "/login";
    return;
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  // 응답 헤더에서 새로운 토큰 확인
  const newToken = response.headers.get('Authorization');
  if (newToken) {
    // 'Bearer ' 접두사 제거 후 새로 저장
    const cleanToken = newToken.replace('Bearer ', '');
    sessionStorage.setItem("accessToken", cleanToken);
  }

  if (!response.ok) {
    // 토큰이 유효하지 않은 경우 로그인 페이지로 리디렉션
    if (response.status === 401) {
      sessionStorage.removeItem("accessToken");
      window.location.href = "/login";
    }

    // 400 ~ 599 상태 코드에 대해 에러 객체를 throw
    const errorData = await response.json();
    console.log(errorData);
    throw new Error(errorData.message);
  }

  return response;
};

export default fetchWithAuth;
