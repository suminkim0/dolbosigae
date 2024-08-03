// MsgDisplay.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import styles from '../css/msgDisplay.module.css';

function MsgDisplay() {
  const [message, setMessage] = useState(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const msgId = queryParams.get('msgId');

  console.log('URL에서 추출한 메시지 ID:', msgId);  // 로그로 msgId 확인

  useEffect(() => {
    if (msgId) {
      axios.get(`http://13.124.183.147:59879/msg/message/${msgId}`)
        .then(response => {
          setMessage(response.data);
          console.log('메시지 데이터 가져오기 성공:', response.data);  // 서버 응답 로그 출력
        })
        .catch(error => {
          console.error('메시지 데이터 가져오기 실패:', error);
        });
    }
  }, [msgId]);

  if (!message) return <div>Loading...</div>;

  return (
    <div className={styles.msgDisplayContainer}>
      <div className={styles.msgDisplayItem}>
        <span className={styles.msgDisplayLabel}>제목:</span>
        <span className={styles.msgDisplayContent}>{message.title}</span>
      </div>
      <div className={styles.msgDisplayItem}>
        <span className={styles.msgDisplayLabel}>내용:</span>
        <span className={styles.msgDisplayContent}>{message.content}</span>
      </div>
      <div className={styles.msgDisplayItem}>
        <span className={styles.msgDisplayLabel}>보낸 시간:</span>
        <span className={styles.msgDisplayContent}>
          {new Date(message.sentTime).toLocaleString()}
        </span>
      </div>
    </div>
  );
}

export default MsgDisplay;