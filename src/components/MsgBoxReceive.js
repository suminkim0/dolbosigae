// MsgBoxReceive.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import styles from '../css/msgBox.module.css';
import { useNavigate } from 'react-router-dom';

function MsgBoxReceive() {
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [userId, setUserId] = useState('');
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false); // 모든 체크박스 선택 상태
  const [expandedMessageId, setExpandedMessageId] = useState(null); // 상태: 확장된 메시지 ID

  const navigate = useNavigate();

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
    const fetchReceivedMessages = async () => {
      try {
        const response = await axios.get(`https://dolbosigae.site/msg/received/${userId}`);
        setReceivedMessages(response.data);
      } catch (error) {
        console.error('받은 메시지 목록을 가져오는 중 오류 발생:', error);
      }
    };

    if (userId) {
      fetchReceivedMessages();
    }
  }, [userId]);

  useEffect(() => {
    const socket = new SockJS('https://dolbosigae.site/ws');
    const stompClient = new Client({
      webSocketFactory: () => socket,
      debug: function (str) {
        console.log('연결 디버그: ' + str);
      },
      onConnect: (frame) => {
        console.log('연결됨: ' + frame);
        stompClient.subscribe('/user/queue/notifications', (message) => {
          const notification = JSON.parse(message.body);
          if (notification.rId === userId) {
            setReceivedMessages((prevMessages) => [notification, ...prevMessages]);
          }
        });
      },
      onStompError: (frame) => {
        console.error('에러: ' + frame.headers['message']);
        console.error('상세 내용: ' + frame.body);
      },
    });

    stompClient.activate();

    return () => {
      if (stompClient) {
        stompClient.deactivate();
      }
    };
  }, [userId]);

  const handleReply = (message) => {
    // 메시지 보내기 페이지로 이동하며 보낸이 ID 전달
    navigate(`/msg/send/${message.sId}`);
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

  const handleDelete = async (msgId) => {
    try {
      await axios.delete(`https://dolbosigae.site/msg/delete/${msgId}`);
      setReceivedMessages(receivedMessages.filter(message => message.msgId !== msgId));
    } catch (error) {
      console.error('메시지 삭제 중 오류 발생:', error);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(selectedMessages.map(msgId => axios.delete(`https://dolbosigae.site/msg/delete/${msgId}`)));
      setReceivedMessages(receivedMessages.filter(message => !selectedMessages.includes(message.msgId)));
      setSelectedMessages([]);
    } catch (error) {
      console.error('선택한 메시지 삭제 중 오류 발생:', error);
    }
  };

  // 모든 메시지 선택 또는 선택 해제
  const handleSelectAllMessages = () => {
    if (isAllSelected) {
      // 모든 메시지의 선택 해제
      setSelectedMessages([]);
    } else {
      // 모든 메시지 선택
      setSelectedMessages(receivedMessages.map((message) => message.msgId));
    }
    setIsAllSelected(!isAllSelected);
  };

  // 개별 메시지 선택 상태를 상위 체크박스와 동기화
  useEffect(() => {
    if (selectedMessages.length === receivedMessages.length && receivedMessages.length !== 0) {
      setIsAllSelected(true);
    } else {
      setIsAllSelected(false);
    }
  }, [selectedMessages, receivedMessages]);

  // 메시지 클릭 시 새 창 열기
  const handleOpenMessage = (message) => {
    const url = `/mate/msgDp?msgId=${message.msgId}`;
    const windowFeatures = 'width=600,height=260,left=100,top=100,toolbar=no';
    window.open(url, '_blank', windowFeatures);
  };

  return (
    <div>
      <div className={styles.msgBoxContainer}>
        <h1 className={styles.msgBoxHeader}>받은 쪽지함</h1>
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
              {/* <th className={styles.msgBoxTh}>확인 여부</th> */}
              <th className={styles.msgBoxTh}>보낸이</th>
              <th className={styles.msgBoxTh}>제목</th>
              <th className={styles.msgBoxTh}>내용</th>
              <th className={styles.msgBoxTh}>받은 시간</th>
              <th className={styles.msgBoxTh}>삭제</th>
            </tr>
          </thead>
          <tbody>
            {receivedMessages.map(message => (
              <React.Fragment key={message.msgId}>
                <tr
                  className={`${styles.msgBoxTr} ${expandedMessageId === message.msgId ? styles.expanded : ''}`}
                  onClick={(e) => {
                    // 체크박스 또는 삭제 버튼 클릭 시 메시지 열림 방지
                    if (e.target.type !== 'checkbox' && e.target.tagName !== 'BUTTON') {
                      handleOpenMessage(message);
                    }
                  }}
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
                  <td className={styles.msgBoxTd}>{message.sId}</td>
                  <td className={styles.msgBoxTd}>{message.title}</td>
                  <td className={styles.msgBoxTd}>
                    {expandedMessageId === message.msgId ? (
                      <div className={styles.expandedContent}>
                        {message.content}
                      </div>
                    ) : (
                      message.content.slice(0, 20) + (message.content.length > 20 ? '...' : '')
                    )}
                  </td>
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
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MsgBoxReceive;