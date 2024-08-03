import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from '../css/matePetProfile.module.css';
import default_img from '../img/default_img.png';

export default function MatePetProfile() {
  const [petProfile, setPetProfile] = useState(null);
  const [userId, setUserId] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();

  // URL에서 userId 파라미터 추출
  const queryParams = new URLSearchParams(window.location.search);
  const profileUserId = queryParams.get('userId');

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
    const readData = async () => {
      if (profileUserId && userId) {
        try {
          const response = await axios.get(`http://localhost:9999/member/petprofile/${profileUserId}`);
          setPetProfile(response.data);

          // 즐겨찾기 상태 확인
          const favResponse = await axios.get('http://localhost:9999/mate/fav/status', {
            params: {
              loginId: userId,
              targetId: profileUserId
            }
          });
          setIsFavorite(favResponse.data.isFavorite);
        } catch (error) {
          console.error('정보를 불러오지 못했습니다.', error);
        }
      } else {
        console.error('사용자 ID를 찾을 수 없습니다.');
      }
    };
    readData();
  }, [profileUserId, userId]);

  const handleFavoriteClick = async () => {
    try {
      const response = await axios.post('http://localhost:9999/mate/fav', {
        loginId: userId,
        targetId: profileUserId
      });

      // 응답 확인
      console.log('즐겨찾기 상태 변경 응답:', response);
      setIsFavorite(prevState => !prevState); // 이전 상태를 기반으로 상태를 업데이트
      alert(response.data);
    } catch (error) {
      // 오류 메시지 더 자세히 출력
      if (error.response) {
        // 서버 응답이 있는 경우
        console.error('서버 응답 오류:', error.response.data);
        alert(`연결상태를 확인해주십시오: ${error.response.data}`);
      } else if (error.request) {
        // 요청이 전송되었으나 응답이 없는 경우
        console.error('응답 없음:', error.request);
        alert('즐겨찾기 상태 변경 중 오류가 발생했습니다: 서버 응답이 없습니다.');
      } else {
        // 기타 오류
        console.error('오류:', error.message);
        alert(`즐겨찾기 상태 변경 중 오류가 발생했습니다: ${error.message}`);
      }
    }
  };

  const handleSendMsg = () => {
    navigate('/mate/sendMsg', { state: { receiverId: profileUserId } });
  };

  return (
    <div>
      {!petProfile ? (
        <div>데이터 가져오는 중</div>
      ) : (
        <div className={styles.petContainer}>
          <div className={styles.petTable}>
            <img src={petProfile.petImagePath || default_img} alt="Pet" />
            <div>이름: {petProfile.boardMemberNick}</div>
            <div>나이: {petProfile.petBirth}</div>
            <div>성별: {petProfile.petGender}</div>
            <div>크기: {petProfile.petSize}</div>
            <div>몸무게: {petProfile.petWeight}</div>
            <div>소개: {petProfile.petInfo}</div>
          </div>
          <div className={styles.petActions}>
            <button onClick={handleFavoriteClick} className={styles.favoriteButton}>
              즐겨찾기 상태 변경
            </button>
            <button onClick={handleSendMsg} className={styles.messageButton}>
              쪽지보내기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
