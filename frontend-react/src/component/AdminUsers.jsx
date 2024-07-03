import { useEffect, useState } from "react";
import fetchWithAuth from "../util/fetchWithAuth";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newUser, setNewUser] = useState({ username: "", password: "", roles: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, rolesResponse] = await Promise.all([
          fetchWithAuth("/admin/users"),
          fetchWithAuth("/admin/roles")
        ]);

        if (usersResponse.ok && rolesResponse.ok) {
          const usersData = await usersResponse.json();
          const rolesData = await rolesResponse.json();
          setUsers(usersData);
          setRoles(rolesData);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetchWithAuth(`/admin/users/${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setUsers(users.filter(user => user.id !== userId));
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteRole = async (userId, roleId) => {
    try {
      const response = await fetchWithAuth(`/admin/users/${userId}/roles/${roleId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setUsers(users.map(user => {
          if (user.id === userId) {
            return {
              ...user,
              roles: user.roles.filter(role => role.id !== roleId)
            };
          }
          return user;
        }));
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "roles") {
      const selectedRoles = Array.from(e.target.selectedOptions, option => ({ id: option.value, name: option.text }));
      setNewUser({ ...newUser, roles: selectedRoles });
    } else {
      setNewUser({ ...newUser, [name]: value });
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetchWithAuth("/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        const createdUser = await response.json();
        setUsers([...users, createdUser]);
        setNewUser({ username: "", password: "", roles: [] });
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
      <h1 className="text-3xl font-bold mb-6">사용자 관리</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleAddUser} className="mb-8 bg-white shadow-md rounded px-8 pt-6 pb-8">
        <div className="mb-4">
          <input
            type="text"
            name="username"
            placeholder="아이디"
            value={newUser.username}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
            autoComplete="off"
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            name="password"
            placeholder="비밀번호"
            value={newUser.password}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
            autoComplete="new-password"
          />
        </div>
        <div className="mb-4">
          <select
            name="roles"
            value={newUser.roles.map(role => role.id)}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
            multiple
          >
            {roles.map(role => (
              <option key={role.id} value={role.id}>{role.name}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center justify-between">
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            사용자 추가
          </button>
        </div>
      </form>
      <ul className="bg-white shadow-md rounded px-8 pt-6 pb-8">
        {users.map(user => (
          <li key={user.id} className="mb-4 pb-4 border-b last:border-b-0">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-bold">{user.username}</span>
                <div className="mt-2">
                  {user.roles.map(role => (
                    <span key={role.id} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                      {role.name}
                      <button
                        onClick={() => handleDeleteRole(user.id, role.id)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        x
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => handleDeleteUser(user.id)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                삭제
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminUsers;