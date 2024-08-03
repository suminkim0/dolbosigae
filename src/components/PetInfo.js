// PetInfo.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../css/petInfo.module.css'; // 적절한 CSS 모듈을 추가하세요
import default_img from '../img/default_img.png';
import { useLocation } from 'react-router-dom';

export default function PetInfo() {
  const [petInfo, setPetInfo] = useState(null);
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const userId = query.get('userId');

  useEffect(() => {
    const fetchPetInfo = async () => {
      try {
        const response = await axios.get(`http://13.124.183.147:59879/member/walkmate/${userId}`);
        setPetInfo(response.data);
      } catch (error) {
        console.error('펫 정보 불러오기 실패', error);
      }
    };

    if (userId) {
      fetchPetInfo();
    }
  }, [userId]);

  return (
    <div className={styles.petInfoContainer}>
      {petInfo ? (
        <div className={styles.petInfo}>
          <img src={petInfo.petImagePath || default_img} alt="Pet" className={styles.petImage} />
          <h2>{petInfo.boardMemberNick}</h2>
          <p>{petInfo.petInfo}</p>
        </div>
      ) : (
        <div>정보를 불러오는 중입니다...</div>
      )}
    </div>
  );
}
