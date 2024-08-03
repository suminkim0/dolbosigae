import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import styles from '../css/msgSend.module.css';

function MsgSend() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const receiverIdFromParams = params.get('receiverId');
  const receiverIdFromState = location.state?.receiverId;

  const receiverId = receiverIdFromState || receiverIdFromParams || '';

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [userId, setUserId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(receiverId ? { boardMemberId: receiverId } : null);
  const [clickToggleActive, setClickToggleActive] = useState(receiverId || null);

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

  const handleSearch = async () => {
    try {
      const response = await axios.get('http://13.124.183.147:59879/member/search', {
        params: {
          category: '회원ID',
          term: searchTerm,
        },
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error('회원 검색 중 오류 발생:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedUser) {
      alert('메시지를 보낼 수신자를 선택하세요.');
      return;
    }

    const message = {
      sId: userId,
      rId: selectedUser.boardMemberId,
      title: title,
      content: content,
    };

    try {
      await axios.post('http://13.124.183.147:59879/msg/send', message, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      alert('쪽지가 성공적으로 전송되었습니다.');
      // 폼 초기화
      setTitle('');
      setContent('');
      setSearchTerm('');
      setSearchResults([]);
      setSelectedUser(null);
      setClickToggleActive(null);
    } catch (error) {
      console.error('쪽지 전송 중 오류 발생:', error);
      alert('쪽지 전송 중 오류가 발생했습니다.');
    }
  };

  const toggleActive = (userId) => {
    const user = searchResults.find(user => user.boardMemberId === userId);
    setSelectedUser(user);
    setClickToggleActive(userId === clickToggleActive ? null : userId);
  };

  return (
    <div className={styles.msgSendContainer}>
      <h1 className={styles.msgSendHeader}>쪽지 보내기</h1>
      <div className={styles.msgSendForm}>
        {!receiverId && (
          <>
            <label htmlFor="searchTerm">회원 검색</label>
            <input
              type="text"
              id="searchTerm"
              placeholder="수신자 ID 입력"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.msgSendInput}
            />
            <button onClick={handleSearch} className={styles.msgSendButton}>검색</button>
            <ul className={styles.searchResults}>
              {searchResults.map((user) => (
                <li
                  key={user.boardMemberId}
                  onClick={() => toggleActive(user.boardMemberId)}
                  className={`${styles.searchResultItem} ${clickToggleActive === user.boardMemberId ? styles.active : ''}`}
                >
                  {user.boardMemberNick} ({user.boardMemberId})
                </li>
              ))}
            </ul>
          </>
        )}
        <label htmlFor="title">제목</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.msgSendInput}
        />
        <label htmlFor="content">내용</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={styles.msgSendTextarea}
        ></textarea>
        <button onClick={handleSendMessage} className={styles.msgSendButton}>전송</button>
      </div>
    </div>
  );
}

export default MsgSend;
