import { useEffect, useState } from "react";
import fetchWithAuth from "../util/fetchWithAuth";

const AdminRoles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newRole, setNewRole] = useState("");
  const [editRole, setEditRole] = useState(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetchWithAuth("http://localhost:8080/admin/roles");

        if (response.ok) {
          const data = await response.json();
          setRoles(data);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  const handleDeleteRole = async (roleId) => {
    try {
      const response = await fetchWithAuth(`http://localhost:8080/admin/roles/${roleId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setRoles(roles.filter(role => role.id !== roleId));
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleRoleInputChange = (e) => {
    setNewRole(e.target.value);
  };

  const handleAddRole = async (e) => {
    e.preventDefault();
    try {
      const response = await fetchWithAuth("http://localhost:8080/admin/roles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newRole }),
      });

      if (response.ok) {
        const createdRole = await response.json();
        setRoles([...roles, createdRole]);
        setNewRole("");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEditRoleChange = (e) => {
    const { name, value } = e.target;
    setEditRole({ ...editRole, [name]: value });
  };

  const handleEditRoleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetchWithAuth(`http://localhost:8080/admin/roles/${editRole.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editRole),
      });

      if (response.ok) {
        const updatedRole = await response.json();
        setRoles(roles.map(role => (role.id === updatedRole.id ? updatedRole : role)));
        setEditRole(null);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">역할 관리</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleAddRole} className="mb-8 bg-white shadow-md rounded px-8 pt-6 pb-8">
        <div className="mb-4">
          <input
            type="text"
            placeholder="역할 이름"
            value={newRole}
            onChange={handleRoleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            역할 추가
          </button>
        </div>
      </form>
      <ul className="bg-white shadow-md rounded px-8 pt-6 pb-8">
        {roles.map(role => (
          <li key={role.id} className="mb-4 pb-4 border-b last:border-b-0">
            {editRole && editRole.id === role.id ? (
              <form onSubmit={handleEditRoleSubmit} className="flex items-center">
                <input
                  type="text"
                  name="name"
                  value={editRole.name}
                  onChange={handleEditRoleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
                  required
                />
                <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2">
                  저장
                </button>
                <button type="button" onClick={() => setEditRole(null)} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                  취소
                </button>
              </form>
            ) : (
              <div className="flex justify-between items-center">
                <span>{role.name}</span>
                <div>
                  <button onClick={() => setEditRole(role)} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2">
                    수정
                  </button>
                  <button onClick={() => handleDeleteRole(role.id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    삭제
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminRoles;