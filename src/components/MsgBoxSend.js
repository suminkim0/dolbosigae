// MsgBoxSend.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../css/msgBox.module.css';
import MsgDisplay from './MsgDisplay'; // MsgDisplay 컴포넌트 가져오기

function MsgBoxSend() {
  const [sentMessages, setSentMessages] = useState([]);
  const [userId, setUserId] = useState('');
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser && parsedUser.boardMemberId) {
        setUserId(parsedUser.boardMemberId);
      }
    } else {
      console.error('로그인된 사용자가 없습니다.');
    }
  }, []);

  useEffect(() => {
    const fetchSentMessages = async () => {
      try {
        const response = await axios.get(`http://13.124.183.147:59879/msg/sent/${userId}`);
        setSentMessages(response.data);
      } catch (error) {
        console.error('보낸 메시지 목록을 가져오는 중 오류 발생:', error);
      }
    };

    if (userId) {
      fetchSentMessages();
    }
  }, [userId]);

  const handleDelete = async (msgId) => {
    try {
      await axios.delete(`http://13.124.183.147:59879/msg/delete/${msgId}`);
      setSentMessages(sentMessages.filter(message => message.msgId !== msgId));
    } catch (error) {
      console.error('메시지 삭제 중 오류 발생:', error);
    }
  };

  const handleSelectMessage = (msgId) => {
    setSelectedMessages((prevSelected) => {
      if (prevSelected.includes(msgId)) {
        return prevSelected.filter(id => id !== msgId);
      } else {
        return [...prevSelected, msgId];
      }
    });
  };

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(selectedMessages.map(msgId => axios.delete(`http://13.124.183.147:59879/msg/delete/${msgId}`)));
      setSentMessages(sentMessages.filter(message => !selectedMessages.includes(message.msgId)));
      setSelectedMessages([]);
    } catch (error) {
      console.error('선택한 메시지 삭제 중 오류 발생:', error);
    }
  };

  const handleSelectAllMessages = () => {
    if (isAllSelected) {
      setSelectedMessages([]);
    } else {
      setSelectedMessages(sentMessages.map((message) => message.msgId));
    }
    setIsAllSelected(!isAllSelected);
  };

  useEffect(() => {
    if (selectedMessages.length === sentMessages.length && sentMessages.length !== 0) {
      setIsAllSelected(true);
    } else {
      setIsAllSelected(false);
    }
  }, [selectedMessages, sentMessages]);

  const handleOpenMessage = (message) => {
    const url = `/mate/msgDp?msgId=${message.msgId}`; 
    const windowFeatures = 'width=600,height=260,left=100,top=100,toolbar=no';
    window.open(url, '_blank', windowFeatures);
};

  return (
    <div>
      <div className={styles.msgBoxContainer}>
        <h1 className={styles.msgBoxHeader}>보낸 쪽지함</h1>
        <div className={styles.buttonContainer}>
          <button
            className={styles.deleteSelectedButton}
            onClick={handleDeleteSelected}
            disabled={selectedMessages.length === 0}
          >
            선택 삭제
          </button>
        </div>
        <table className={styles.msgBoxTable}>
          <thead>
            <tr>
              <th className={styles.msgBoxTh}>
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleSelectAllMessages}
                />
              </th>
              {/* <th className={styles.msgBoxTh}>수신 확인 여부</th> */}
              <th className={styles.msgBoxTh}>받은이</th>
              <th className={styles.msgBoxTh}>제목</th>
              <th className={styles.msgBoxTh}>내용</th>
              <th className={styles.msgBoxTh}>보낸 시간</th>
              <th className={styles.msgBoxTh}>삭제</th>
            </tr>
          </thead>
          <tbody>
            {sentMessages.map(message => (
              <tr
                key={message.msgId}
                className={styles.msgBoxTr}
                onClick={() => handleOpenMessage(message)}
              >
                <td className={styles.msgBoxTd}>
                  <input
                    type="checkbox"
                    checked={selectedMessages.includes(message.msgId)}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleSelectMessage(message.msgId);
                    }}
                  />
                </td>
                {/* <td className={styles.msgBoxTd}>{message.isRead ? '읽음' : '읽지않음'}</td> */}
                <td className={styles.msgBoxTd}>{message.rId}</td>
                <td className={styles.msgBoxTd}>{message.title}</td>
                <td className={styles.msgBoxTd}>{message.content.slice(0, 20) + (message.content.length > 20 ? '...' : '')}</td>
                <td className={styles.msgBoxTd}>{new Date(message.sentTime).toLocaleString()}</td>
                <td className={styles.msgBoxTd}>
                  <button
                    className={`${styles.msgBoxButton} ${styles.msgBoxDeleteButton}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(message.msgId);
                    }}
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MsgBoxSend;