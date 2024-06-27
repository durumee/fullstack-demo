import { useEffect, useState } from "react";
import styles from "./AdminShoppingLogs.module.css";
import fetchWithAuth from "../util/fetchWithAuth";

const AdminShoppingLogs = () => {
  const [shoppingLogs, setShoppingLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newLog, setNewLog] = useState({ memberId: "", action: "", details: "" });
  const [editLog, setEditLog] = useState(null);

  useEffect(() => {
    const fetchShoppingLogs = async () => {
      try {
        const response = await fetchWithAuth("http://localhost:8080/admin/shopping-logs");
        if (response.ok) {
          const data = await response.json();
          setShoppingLogs(data);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchShoppingLogs();
  }, []);

  const handleDeleteLog = async (logId) => {
    try {
      const response = await fetchWithAuth(`http://localhost:8080/admin/shopping-logs/${logId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setShoppingLogs(shoppingLogs.filter(log => log.id !== logId));
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleLogInputChange = (e) => {
    const { name, value } = e.target;
    setNewLog({ ...newLog, [name]: value });
  };

  const handleAddLog = async (e) => {
    e.preventDefault();
    try {
      const response = await fetchWithAuth("http://localhost:8080/admin/shopping-logs/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newLog),
      });

      if (response.ok) {
        const createdLog = await response.json();
        setShoppingLogs([...shoppingLogs, createdLog]);
        setNewLog({ memberId: "", action: "", details: "" });
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEditLogChange = (e) => {
    const { name, value } = e.target;
    setEditLog({ ...editLog, [name]: value });
  };

  const handleEditLogSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetchWithAuth(`http://localhost:8080/admin/shopping-logs/${editLog.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editLog),
      });

      if (response.ok) {
        const updatedLog = await response.json();
        setShoppingLogs(shoppingLogs.map(log => (log.id === updatedLog.id ? updatedLog : log)));
        setEditLog(null);
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
      <h1>쇼핑 로그 관리</h1>
      {error && <p className={styles.errorMessage}>{error}</p>}
      <form onSubmit={handleAddLog} className={styles.addLogForm}>
        <input
          type="number"
          name="memberId"
          placeholder="회원 ID"
          value={newLog.memberId}
          onChange={handleLogInputChange}
          className={styles.inputField}
          required
        />
        <input
          type="text"
          name="action"
          placeholder="액션"
          value={newLog.action}
          onChange={handleLogInputChange}
          className={styles.inputField}
          required
        />
        <input
          type="text"
          name="details"
          placeholder="상세 내용"
          value={newLog.details}
          onChange={handleLogInputChange}
          className={styles.inputField}
          required
        />
        <button type="submit" className={styles.submitButton}>로그 추가</button>
      </form>
      <ul className={styles.logList}>
        {shoppingLogs.map(log => (
          <li key={log.id} className={styles.logItem}>
            {editLog && editLog.id === log.id ? (
              <form onSubmit={handleEditLogSubmit} className={styles.editLogForm}>
                <input
                  type="number"
                  name="memberId"
                  value={editLog.memberId}
                  onChange={handleEditLogChange}
                  className={styles.inputField}
                  required
                />
                <input
                  type="text"
                  name="action"
                  value={editLog.action}
                  onChange={handleEditLogChange}
                  className={styles.inputField}
                  required
                />
                <input
                  type="text"
                  name="details"
                  value={editLog.details}
                  onChange={handleEditLogChange}
                  className={styles.inputField}
                  required
                />
                <button type="submit" className={styles.submitButton}>저장</button>
                <button type="button" onClick={() => setEditLog(null)} className={styles.cancelButton}>취소</button>
              </form>
            ) : (
              <>
                로그 ID: {log.id}, 회원 ID: {log.memberId}, 액션: {log.action}, 상세 내용: {log.details}
                <button onClick={() => setEditLog(log)} className={styles.editButton}>수정</button>
                <button onClick={() => handleDeleteLog(log.id)} className={styles.deleteButton}>삭제</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminShoppingLogs;