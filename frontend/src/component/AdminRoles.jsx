import { useEffect, useState } from "react";
import styles from "./AdminRoles.module.css";
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
      const response = await fetchWithAuth("http://localhost:8080/admin/roles/", {
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
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.adminContainer}>
      <h1>역할 관리</h1>
      {error && <p className={styles.errorMessage}>{error}</p>}
      <form onSubmit={handleAddRole} className={styles.addRoleForm}>
        <input
          type="text"
          placeholder="역할 이름"
          value={newRole}
          onChange={handleRoleInputChange}
          className={styles.inputField}
          required
        />
        <button type="submit" className={styles.submitButton}>역할 추가</button>
      </form>
      <ul className={styles.roleList}>
        {roles.map(role => (
          <li key={role.id} className={styles.roleItem}>
            {editRole && editRole.id === role.id ? (
              <form onSubmit={handleEditRoleSubmit} className={styles.editRoleForm}>
                <input
                  type="text"
                  name="name"
                  value={editRole.name}
                  onChange={handleEditRoleChange}
                  className={styles.inputField}
                  required
                />
                <button type="submit" className={styles.submitButton}>저장</button>
                <button type="button" onClick={() => setEditRole(null)} className={styles.cancelButton}>취소</button>
              </form>
            ) : (
              <>
                {role.name}
                <button onClick={() => setEditRole(role)} className={styles.editButton}>수정</button>
                <button onClick={() => handleDeleteRole(role.id)} className={styles.deleteButton}>삭제</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminRoles;
