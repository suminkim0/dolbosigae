import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../css/adminContactNormalTable.module.css';

export default function AdminContactNormalTable({ adminBoardList, pagination, handlePageChange, user, deleteClick }) {
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
          {adminBoardList.map((item, index) => (
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
                  {user && (user.boardMemberGradeNo === 0 || user.boardMemberId === item.adminMemberId) ? (
                    <Link to={`/admin/contact/detail/${item.adminNo}`} className={styles.link}>
                      {item.adminTitle}
                    </Link>
                  ) : (
                    <span className={styles.tooltip}>
                      {item.adminTitle}
                      <span className={styles.tooltiptext}>
                        본인이 작성한 글만 확인할 수 있습니다
                      </span>
                    </span>
                  )}
                </td>
                <td>{item.adminMemberId}</td>
                <td>{item.adminNick}</td>
                <td>{item.adminDate}</td>
                <td>{item.adminCommentCount}</td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="7" className={styles.pagination}>
              <div className={styles.paginationGroup}>
                {pagination && pagination.previousPageGroup && (
                  <button onClick={() => handlePageChange(pagination.startPageOfPageGroup - 1)}>◀</button>
                )}
                {pagination && Array.from({ length: pagination.endPageOfPageGroup - pagination.startPageOfPageGroup + 1 }, (_, i) => (
                  <button
                    key={i + pagination.startPageOfPageGroup}
                    onClick={() => handlePageChange(i + pagination.startPageOfPageGroup)}
                    className={pagination.currentPage === i + pagination.startPageOfPageGroup ? styles.activePage : ''}
                  >
                    {i + pagination.startPageOfPageGroup}
                  </button>
                ))}
                {pagination && pagination.nextPageGroup && (
                  <button onClick={() => handlePageChange(pagination.endPageOfPageGroup + 1)}>▶</button>
                )}
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
