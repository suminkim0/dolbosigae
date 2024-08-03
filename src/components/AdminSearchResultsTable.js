import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../css/adminContactNormalTable.module.css';

export default function AdminSearchResultsTable({ adminBoardList, user, deleteClick }) {
  const [sortedAdminBoardList, setSortedAdminBoardList] = useState([]);

  useEffect(() => {
    // 날짜 내림차순, 날짜가 동일하면 글번호 내림차순으로 정렬
    const sortedList = [...adminBoardList].sort((a, b) => {
      const dateA = new Date(a.adminDate);
      const dateB = new Date(b.adminDate);

      if (dateA > dateB) return -1;
      if (dateA < dateB) return 1;
      return b.adminNo - a.adminNo; // 날짜가 동일하면 글번호 내림차순
    });
    setSortedAdminBoardList(sortedList);
  }, [adminBoardList]);

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <colgroup>
          <col style={{ width: '10%' }} />
          <col style={{ width: '10%' }} />
          <col style={{ width: '40%' }} />
          <col style={{ width: '10%' }} />
          <col style={{ width: '10%' }} />
          <col style={{ width: '10%' }} />
          <col style={{ width: '10%' }} />
        </colgroup>
        <thead>
          <tr>
            <th></th>
            <th>글번호</th>
            <th>제목</th>
            <th>작성자ID</th>
            <th>작성자 닉네임</th>
            <th>작성일</th>
            <th>답변 수</th>
          </tr>
        </thead>
        <tbody>
          {sortedAdminBoardList.map((item, index) => (
            <React.Fragment key={index}>
              <tr>
                <td>
                  {user && (user.boardMemberGradeNo === 0 || user.boardMemberId === item.adminMemberId) && (
                    <button className={styles.deleteButton} onClick={() => deleteClick(item.adminNo, item.adminCommentCount)}>삭제</button>
                  )}
                  {user && user.boardMemberGradeNo === 0 && (
                    <button
                      className={`${styles.unansweredButton} ${item.adminCommentCount > 0 ? styles.answered : styles.unanswered}`}
                    >
                      {item.adminCommentCount > 0 ? '답변완료' : '미답변'}
                    </button>
                  )}
                </td>
                <td>{item.adminNo}</td>
                <td>
                  <Link to={`/admin/contact/detail/${item.adminNo}`} className={styles.link}>
                    {item.adminTitle}
                  </Link>
                </td>
                <td>{item.adminMemberId}</td>
                <td>{item.adminNick}</td>
                <td>{item.adminDate}</td>
                <td>{item.adminCommentCount}</td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
