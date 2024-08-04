import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../css/mateFav.module.css'; 
import default_img from '../img/default_img.png';

export default function MateFav() {
  const [favorites, setFavorites] = useState([]);
  const [userId, setUserId] = useState('');

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
    const fetchFavorites = async () => {
      try {
        if (!userId) return;

        console.log('Fetching favorites for userId:', userId); // userId 확인용
        const response = await axios.get('https://dolbosigae.site/mate/fav/list', {
          params: { id: userId },
        });

        console.log('Favorites list response:', response.data); // 응답 데이터 확인용

        // Favorites list를 바로 화면에 뿌리기
        setFavorites(response.data); // Favorites list 데이터를 바로 사용

      } catch (error) {
        console.error('즐겨찾기 목록을 불러오지 못했습니다.', error);
      }
    };

    fetchFavorites();
  }, [userId]);

  const handleMateClick = (id) => {
    const url = `/mate/petinfo?userId=${id}`;
    const windowFeatures = 'width=500,height=650,left=100,top=100,toolbar=no';
    window.open(url, '_blank', windowFeatures);
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h2>내 즐겨찾기</h2>
        <p>이미지를 클릭하시면 상세 정보를 볼 수 있습니다.</p>
      </div>
      {favorites.length === 0 ? (
        <div>즐겨찾기한 회원이 없습니다.</div>
      ) : (
        <ul className={styles.favoriteList}>
          {favorites.map((favorite, index) => (
            <li key={index} className={styles.favoriteItem} onClick={() => handleMateClick(favorite)}>
              <img 
                src={default_img} 
                alt={`Pet of ${favorite}`} 
                className={styles.favoriteImage}
              />
              <div className={styles.favoriteInfo}>
                <span className={styles.favoriteName}>{favorite}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
