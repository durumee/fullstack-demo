import { useState, useEffect } from 'react';
import fetchWithAuth from "../util/fetchWithAuth";

function MemberInfo() {
  const [memberInfo, setMemberInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMemberInfo = async () => {
      try {
        const response = await fetchWithAuth('/api/member');
        if (response.ok) {
          const data = await response.json();
          setMemberInfo(data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMemberInfo();
  }, []);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!memberInfo) return <div className="text-center py-10">회원정보를 조회할 수 없습니다.</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">회원 정보</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">이름</p>
            <p className="text-xl font-semibold">{memberInfo.username}</p>
          </div>
          <div>
            <p className="text-gray-600">이메일</p>
            <p className="text-xl font-semibold">{memberInfo.email}</p>
          </div>
          <div>
            <p className="text-gray-600">전화번호</p>
            <p className="text-xl font-semibold">{memberInfo.phoneNumber}</p>
          </div>
          <div>
            <p className="text-gray-600">주소</p>
            <p className="text-xl font-semibold">{memberInfo.address}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MemberInfo;