import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from '../css/adminCommentWrite.module.css';

export default function AdminCommentWrite({ adminNo }) {
  const [user, setUser] = useState(null);
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
  }, []);

  const stripHtmlTags = (str) => {
    if (!str) return '';
    return str.replace(/<[^>]*>?/gm, '');
  };

  const writeComment = async () => {
    const strippedContent = stripHtmlTags(content);

    const jsonData = {
      adminNo: adminNo,
      adminCommentMemberId: user?.boardMemberId,
      adminCommentContent: strippedContent
    };
    console.log("jsonData:", jsonData);

    try {
      const response = await axios.post('http://13.124.183.147:59879/admin/comment/write', jsonData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        console.log(response.data);
        alert('답변 댓글을 작성하였습니다.');
        navigate('/admin/contact');
      } else {
        console.error('Unexpected response status:', response.status);
      }
    } catch (error) {
      console.error('답변 작성 에러 발생', error);
      alert('답변 작성 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className={styles.adminCommentWrite}>
      <textarea
        placeholder="답변 내용을 입력하세요."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button onClick={writeComment}>답변입력</button>
    </div>
  );
}
