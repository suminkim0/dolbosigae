import SubTitleAdminContact from './SubTitles/SubTitleAdminContact';
import styles from '../css/adminContactNormalTableDetail.module.css';
import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminCommentWrite from './AdminCommentWrite';

export default function AdminContactNormalTableDetail() {
  const { adminNo } = useParams();
  const [detail, setDetail] = useState(null);
  const [comment, setComment] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
  }, []);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await axios.get(`https://dolbosigae.site/admin/contact/detail/${adminNo}`);
        console.log(response);
        setComment(response.data.commentDetails);
        setDetail(response.data);
      } catch (error) {
        console.error("There was an error fetching the detail!", error);
      }
    };
    fetchDetail();
  }, [adminNo]);

  useEffect(()=>{
    if(user && detail){
      if(!(user.boardMemberGradeNo === 0 || user.boardMemberId === detail.adminMemberId)){
        alert("접근 권한이 없습니다.");
        navigate('/admin/contact');
      }
    }
  })

    // 댓글 삭제 버튼
    const deleteCommentClick = async (adminCommentNo) => {
      try {
        const response = await axios.delete(`https://dolbosigae.site/admin/delete/${adminCommentNo}`);
        alert(response.data); // 서버 응답 메시지를 알림으로 표시
  
        // 상태 업데이트: 삭제된 게시글을 목록에서 제거한 후 최신 데이터 다시 불러오기
        const fetchData = async () => {
          try {
            const response = await axios.get(`https://dolbosigae.site/admin/contact/detail/${adminNo}`);
            console.log(response);
            setComment(response.data.commentDetails);
            setDetail(response.data);
          } catch (error) {
            console.error("There was an error fetching the detail!", error);
          }
        };
        fetchData();
      } catch (error) {
        console.error("댓글 삭제 오류", error);
        alert("댓글 삭제 중 오류가 발생했습니다.");
      }
    };

  // 게시글 삭제 버튼
  const deleteClick = async (adminNo, adminCommentCount) => {
    try {
      const response = await axios.delete(`https://dolbosigae.site/admin/delete/${adminNo}/${adminCommentCount}`);
      console.log(response.data); // 서버 응답 메시지
      alert('게시글을 삭제하였습니다.\n문의 화면으로 이동합니다.');
      navigate('/admin/contact');

    } catch (error) {
      console.error("문의글 삭제 오류", error);
      alert("문의글 삭제 중 오류가 발생했습니다.");
    }
  };


  if (!detail) return <div>페이지 로드 중입니다...</div>;

  return (
    <div>
      <SubTitleAdminContact />
      <div className={styles.detailContainer}>
        <table className={styles.detailTable}>
          <tbody>
            <tr className={styles.headerRow}>
              <th>글번호</th>
              <td>{detail.adminNo}</td>
              <th>작성일</th>
              <td>{detail.adminDate}</td>
            </tr>
            <tr>
              <th>작성자ID</th>
              <td>{detail.adminMemberId}</td>
              <th>작성자 닉네임</th>
              <td>{detail.adminNick}</td>
            </tr>
            <tr>
              <th>제목</th>
              <td colSpan={3}>{detail.adminTitle}</td>
            </tr>
            <tr className={styles.contentRow}>
              <th colSpan={4}>내용</th>
            </tr>
            <tr>
              <td className={styles.contentCell} colSpan="4">{detail.adminContent}</td>
            </tr>
            {comment.map((item, index) => (
              <React.Fragment key={index}>
                <tr>
                  <th>댓글번호</th>
                  <td>{item.adminCommentNo}</td>
                  <th>작성일</th>
                  <td>{item.adminCommentDate}</td>
                </tr>
                <tr>
                  <th>작성ID</th>
                  <td>{item.adminCommentMemberId}</td>
                  <th>작성자</th>
                  <td>{item.adminCommentNick}</td>
                </tr>
                <tr>
                  <th colSpan={4}>답변내용</th>
                </tr>
                <tr>
                  {user && user.boardMemberGradeNo === 0 && (
                    <td colSpan={4} className={styles.commentContent}>
                      <div>
                        {item.adminCommentContent}<button onClick={() => deleteCommentClick(item.adminCommentNo)}>댓글 삭제</button>
                      </div>
                    </td>
                  )}
                  {user && user.boardMemberGradeNo != 0 && (
                    <td colSpan={4} className={styles.commentContent}>{item.adminCommentContent}</td>
                  )}
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
        {user && user.boardMemberGradeNo === 0 && (
          <AdminCommentWrite adminNo={detail.adminNo} />
        )}
        <div className={styles.adminDetailBtnGroup}>
          <Link to='/admin/contact'>
            <button className={styles.commentBtn}>글 목록</button>
          </Link>
          {user && (user.boardMemberGradeNo === 0 || user.boardMemberId === detail.adminMemberId) &&(
              <button className={styles.deleteBigBtn} onClick={() => deleteClick(detail.adminNo, detail.adminCommentCount)}>게시글 삭제</button>
          )} 
        </div>
      </div>
    </div>
  );
}
