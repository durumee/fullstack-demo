import { useEffect, useState } from "react";
import styles from "./AdminUsers.module.css";
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
          fetchWithAuth("http://localhost:8080/admin/users"),
          fetchWithAuth("http://localhost:8080/admin/roles")
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
      const response = await fetchWithAuth(`http://localhost:8080/admin/users/${userId}`, {
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
      const response = await fetchWithAuth(`http://localhost:8080/admin/users/${userId}/roles/${roleId}`, {
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
      const response = await fetchWithAuth("http://localhost:8080/admin/users", {
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
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.adminContainer}>
      <h1>사용자 관리</h1>
      {error && <p className={styles.errorMessage}>{error}</p>}
      <form onSubmit={handleAddUser} className={styles.addUserForm}>
        <input
          type="text"
          name="username"
          placeholder="아이디"
          value={newUser.username}
          onChange={handleChange}
          className={styles.inputField}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="비밀번호"
          value={newUser.password}
          onChange={handleChange}
          className={styles.inputField}
          required
        />
        <select
          name="roles"
          value={newUser.roles.map(role => role.id)}
          onChange={handleChange}
          className={styles.inputField}
          required
          multiple
        >
          {roles.map(role => (
            <option key={role.id} value={role.id}>{role.name}</option>
          ))}
        </select>
        <button type="submit" className={styles.submitButton}>사용자 추가</button>
      </form>
      <ul className={styles.userList}>
        {users.map(user => (
          <li key={user.id} className={styles.userItem}>
            {user.username}
            <div className={styles.roleList}>
              {user.roles.map(role => (
                <span key={role.id} className={styles.roleItem}>
                  {role.name}
                  <button
                    onClick={() => handleDeleteRole(user.id, role.id)}
                    className={styles.deleteRoleButton}
                  >
                    x
                  </button>
                </span>
              ))}
            </div>
            <button onClick={() => handleDeleteUser(user.id)} className={styles.deleteButton}>삭제</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminUsers;