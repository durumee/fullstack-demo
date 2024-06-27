import React, { useEffect, useState } from "react";
import styles from "./AdminMembers.module.css";
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
      const response = await fetchWithAuth("http://localhost:8080/admin/members/", {
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
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.adminContainer}>
      <h1>회원 관리</h1>
      {error && <p className={styles.errorMessage}>{error}</p>}
      <form onSubmit={handleAddMember} className={styles.addMemberForm}>
        <div className={styles.inputGroup}>
          <label htmlFor="username">사용자명</label>
          <input
            id="username"
            type="text"
            name="username"
            value={newMember.username}
            onChange={handleMemberInputChange}
            className={styles.inputField}
            required
            autoComplete="off"
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="password">비밀번호</label>
          <input
            id="password"
            type="password"
            name="password"
            value={newMember.password}
            onChange={handleMemberInputChange}
            className={styles.inputField}
            required
            autoComplete="new-password"
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="email">이메일</label>
          <input
            id="email"
            type="email"
            name="email"
            value={newMember.email}
            onChange={handleMemberInputChange}
            className={styles.inputField}
            required
            autoComplete="off"
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="phoneNumber">전화번호</label>
          <input
            id="phoneNumber"
            type="tel"
            name="phoneNumber"
            value={newMember.phoneNumber}
            onChange={handleMemberInputChange}
            className={styles.inputField}
            autoComplete="off"
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="address">주소</label>
          <input
            id="address"
            type="text"
            name="address"
            value={newMember.address}
            onChange={handleMemberInputChange}
            className={styles.inputField}
            autoComplete="off"
          />
        </div>
        <button type="submit" className={styles.submitButton}>회원 추가</button>
      </form>
      <ul className={styles.memberList}>
        {members.map(member => (
          <li key={member.memberId} className={styles.memberItem}>
            {editMember && editMember.memberId === member.memberId ? (
              <form onSubmit={handleEditMemberSubmit} className={styles.editMemberForm}>
                <div className={styles.inputGroup}>
                  <label htmlFor="edit-username">사용자명</label>
                  <input
                    id="edit-username"
                    type="text"
                    name="username"
                    value={editMember.username}
                    onChange={handleEditMemberChange}
                    className={styles.inputField}
                    required
                    autoComplete="off"
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="edit-email">이메일</label>
                  <input
                    id="edit-email"
                    type="email"
                    name="email"
                    value={editMember.email}
                    onChange={handleEditMemberChange}
                    className={styles.inputField}
                    required
                    autoComplete="off"
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="edit-phoneNumber">전화번호</label>
                  <input
                    id="edit-phoneNumber"
                    type="tel"
                    name="phoneNumber"
                    value={editMember.phoneNumber}
                    onChange={handleEditMemberChange}
                    className={styles.inputField}
                    autoComplete="off"
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="edit-address">주소</label>
                  <input
                    id="edit-address"
                    type="text"
                    name="address"
                    value={editMember.address}
                    onChange={handleEditMemberChange}
                    className={styles.inputField}
                    autoComplete="off"
                  />
                </div>
                <button type="submit" className={styles.submitButton}>저장</button>
                <button type="button" onClick={() => setEditMember(null)} className={styles.cancelButton}>취소</button>
              </form>
            ) : (
              <>
                <div className={styles.memberInfo}>
                  <div>{member.username} ({member.email})</div>
                  <div>{member.phoneNumber} - {member.address}</div>
                </div>
                <div className={styles.memberActions}>
                  <button onClick={() => setEditMember(member)} className={styles.editButton}>수정</button>
                  <button onClick={() => handleDeleteMember(member.memberId)} className={styles.deleteButton}>삭제</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
      <div className={styles.pagination}>
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
          disabled={currentPage === 0}
        >
          이전
        </button>
        <span>{currentPage + 1} / {totalPages}</span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))}
          disabled={currentPage === totalPages - 1}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default AdminMembers;