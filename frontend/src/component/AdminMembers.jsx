import { useEffect, useState } from "react";
import fetchWithAuth from "../util/fetchWithAuth";

const AdminMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newMember, setNewMember] = useState({
    username: "",
    password: "",
    email: "",
    phoneNumber: "",
    address: ""
  });
  const [editMember, setEditMember] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetchWithAuth(`http://localhost:8080/admin/members?page=${currentPage}&size=5`);
        if (response.ok) {
          const data = await response.json();
          setMembers(data.content);
          setTotalPages(data.totalPages);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [currentPage]);

  const handleDeleteMember = async (memberId) => {
    try {
      const response = await fetchWithAuth(`http://localhost:8080/admin/members/${memberId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMembers(members.filter(member => member.memberId !== memberId));
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleMemberInputChange = (e) => {
    const { name, value } = e.target;
    setNewMember({ ...newMember, [name]: value });
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      const response = await fetchWithAuth("http://localhost:8080/admin/members", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMember),
      });

      if (response.ok) {
        const createdMember = await response.json();
        setMembers([...members, createdMember]);
        setNewMember({
          username: "",
          password: "",
          email: "",
          phoneNumber: "",
          address: ""
        });
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEditMemberChange = (e) => {
    const { name, value } = e.target;
    setEditMember({ ...editMember, [name]: value });
  };

  const handleEditMemberSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetchWithAuth(`http://localhost:8080/admin/members/${editMember.memberId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editMember),
      });

      if (response.ok) {
        const updatedMember = await response.json();
        setMembers(members.map(member => (member.memberId === updatedMember.memberId ? updatedMember : member)));
        setEditMember(null);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">회원 관리</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleAddMember} className="mb-8 bg-white shadow-md rounded px-8 pt-6 pb-8">
        <div className="mb-4 flex flex-wrap -mx-2">
          <div className="w-full md:w-1/2 px-2 mb-4 md:mb-0">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              사용자명
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              name="username"
              value={newMember.username}
              onChange={handleMemberInputChange}
              required
              autoComplete="off"
            />
          </div>
          <div className="w-full md:w-1/2 px-2">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              비밀번호
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              name="password"
              value={newMember.password}
              onChange={handleMemberInputChange}
              required
              autoComplete="new-password"
            />
          </div>
        </div>
        <div className="mb-4 flex flex-wrap -mx-2">
          <div className="w-full md:w-1/2 px-2 mb-4 md:mb-0">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              이메일
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              name="email"
              value={newMember.email}
              onChange={handleMemberInputChange}
              required
              autoComplete="off"
            />
          </div>
          <div className="w-full md:w-1/2 px-2">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phoneNumber">
              전화번호
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="phoneNumber"
              type="tel"
              name="phoneNumber"
              value={newMember.phoneNumber}
              onChange={handleMemberInputChange}
              autoComplete="off"
            />
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
            주소
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="address"
            type="text"
            name="address"
            value={newMember.address}
            onChange={handleMemberInputChange}
            autoComplete="off"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            회원 추가
          </button>
        </div>
      </form>
      <div className="overflow-x-auto">
        <ul className="flex flex-nowrap gap-4 pb-4">
          {members.map(member => (
            <li key={member.memberId} className="flex-shrink-0 w-64 bg-white shadow-md rounded-lg p-4">
              {editMember && editMember.memberId === member.memberId ? (
                <form onSubmit={handleEditMemberSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="edit-username" className="block text-sm font-medium text-gray-700">사용자명</label>
                    <input
                      id="edit-username"
                      type="text"
                      name="username"
                      value={editMember.username}
                      onChange={handleEditMemberChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      required
                      autoComplete="off"
                    />
                  </div>
                  <div>
                    <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700">이메일</label>
                    <input
                      id="edit-email"
                      type="email"
                      name="email"
                      value={editMember.email}
                      onChange={handleEditMemberChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      required
                      autoComplete="off"
                    />
                  </div>
                  <div>
                    <label htmlFor="edit-phoneNumber" className="block text-sm font-medium text-gray-700">전화번호</label>
                    <input
                      id="edit-phoneNumber"
                      type="tel"
                      name="phoneNumber"
                      value={editMember.phoneNumber}
                      onChange={handleEditMemberChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      autoComplete="off"
                    />
                  </div>
                  <div>
                    <label htmlFor="edit-address" className="block text-sm font-medium text-gray-700">주소</label>
                    <input
                      id="edit-address"
                      type="text"
                      name="address"
                      value={editMember.address}
                      onChange={handleEditMemberChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      autoComplete="off"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                      저장
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditMember(null)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                    >
                      취소
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="mb-4">
                    <p className="font-bold">{member.username}</p>
                    <p className="text-sm text-gray-600">{member.email}</p>
                    <p className="text-sm text-gray-600">{member.phoneNumber}</p>
                    <p className="text-sm text-gray-600">{member.address}</p>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setEditMember(member)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-2 rounded text-sm"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDeleteMember(member.memberId)}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded text-sm"
                    >
                      삭제
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex justify-center items-center mt-6">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
          disabled={currentPage === 0}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l disabled:opacity-50"
        >
          이전
        </button>
        <span className="px-4">
          {currentPage + 1} / {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))}
          disabled={currentPage === totalPages - 1}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r disabled:opacity-50"
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default AdminMembers;