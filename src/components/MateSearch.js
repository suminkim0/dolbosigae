import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from '../css/mateSearch.module.css';
import default_img from '../img/default_img.png';
import starIcon from '../img/star_icon.png'; // 별 이미지 추가
import SubTitleMateSearch from './SubTitles/SubTitleMateSearch';

export default function MateSearch() {
  const [mateList, setMateList] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [searchAddress, setSearchAddress] = useState('');
  const [userId, setUserId] = useState('');
  const [user, setUser] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]); // 즐겨찾기 ID 목록 상태 추가

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser && parsedUser.boardMemberId) {
        setUserId(parsedUser.boardMemberId);
        setUser(parsedUser);
      }
    } else {
      console.error('로그인된 사용자가 없습니다.');
    }

    if (!isSearching) {
      readData();
    }
  }, [currentPage, isSearching]);

  useEffect(() => {
    if (userId) {
      console.log('Fetching favorite IDs for userId:', userId); // 로그 추가
      fetchFavoriteIds(); // 즐겨찾기 ID 목록 가져오기
    }
  }, [userId]);

  const fetchFavoriteIds = async () => {
    try {
      const response = await axios.get('http://localhost:9999/mate/fav/list', {
        params: { id: userId },
      });
      console.log('Fetched favorite IDs:', response.data); // 로그 추가
      setFavoriteIds(response.data); // 서버에서 받은 즐겨찾기 ID 목록 설정
    } catch (error) {
      console.error('즐겨찾기 목록을 불러오지 못했습니다.', error);
    }
  };

  const readData = async () => {
    try {
      const response = await axios.get('http://localhost:9999/member/walkmates', {
        params: {
          page: currentPage,
        },
      });
      setMateList(response.data.members);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('T인 회원들 불러오는데 실패한거임', error);
    }
  };

  const handlePageChange = (pageNo) => {
    if (!isSearching) {
      setCurrentPage(pageNo);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get('http://localhost:9999/member/walkmate/search', {
        params: {
          addressText: searchAddress,
        },
      });
      setMateList(response.data.members || []);
      setPagination(null);
      setIsSearching(true);
      setCurrentPage(1);
    } catch (error) {
      console.error('여기서 주소로 검색하는건데 오류났음', error);
      alert('매이트 검색 중 오류가 발생했습니다.');
      setMateList([]);
      setPagination(null);
      setIsSearching(false);
    }
  };

  const handleMateClick = (id) => {
    const url = `/mate/petinfo?userId=${id}`;
    const windowFeatures = 'width=500,height=650,left=100,top=100,toolbar=no';
    window.open(url, '_blank', windowFeatures);
  };

  const handleMsgClick = () => {
    const url = '/mate/msg';
    window.open(url, '_blank');
  };

  const openMateFavInNewWindow = () => {
    const url = `/mate/fav`;
    const windowFeatures = 'width=600,height=700,left=200,top=150,toolbar=no';
    window.open(url, '_blank', windowFeatures);
  };

  const handleChangeWalkProfile = async () => {
    try {
      await axios.post(`http://localhost:9999/walkmate/changeTF`, { Wid: selectedIds });
      readData();
      setSelectedIds([]);
    } catch (error) {
      console.error('T -> F 변경 중 오류', error);
      alert('T에서 F로 변경 중 오류가 발생했습니다.');
    }
  };

  const handleCheckboxChange = (memberId) => {
    setSelectedIds((prevSelectedIds) =>
      prevSelectedIds.includes(memberId) ? prevSelectedIds.filter((id) => id !== memberId) : [...prevSelectedIds, memberId],
    );
  };

  return (
    <div>
      <SubTitleMateSearch />
      <div className={styles.mateSearchBox}>
        <input value={searchAddress} onChange={(e) => setSearchAddress(e.target.value)} placeholder="지역으로 검색" />
        <button className={styles.searchBtn} onClick={handleSearch}>검색</button>
        <div className={styles.subBtnSet}>
          <button className={styles.msgBtn} onClick={handleMsgClick}>쪽지함</button>
          <button className={styles.favBtn} onClick={openMateFavInNewWindow} style={{ marginLeft: '10px' }}>
            즐겨찾기 목록
          </button>
        </div>
        {user && user.boardMemberGradeNo === 0 && (
          <button onClick={handleChangeWalkProfile} disabled={selectedIds.length === 0} style={{ marginLeft: '10px' }}>
            T to F
          </button>
        )}
      </div>
      {mateList.length === 0 ? (
        <div>해당 데이터가 없습니다.</div>
      ) : (
        <div className={styles.mateTableContainer}>
          <div className={styles.mateTable}>
            {mateList.map((mate) => (
              <div key={mate.boardMemberId} className={styles.mateCard} onClick={() => handleMateClick(mate.boardMemberId)}>
                {user && user.boardMemberGradeNo === 0 && (
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(mate.boardMemberId)}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleCheckboxChange(mate.boardMemberId);
                    }}
                  />
                )}
                <img src={mate.petImagePath || default_img} alt="Pet" className={styles.mateImage} />
                {favoriteIds.includes(mate.boardMemberId) && (
                  <img src={starIcon} alt="Favorite Icon" className={styles.favoriteIcon} />
                )}
                <span>{mate.boardMemberNick}</span>
                <div className={styles.mateFlexContainer}>
                  <input value={mate.petInfo || ''} className={`${styles.mateInput} ${styles.matePetInfo}`} readOnly />
                </div>
              </div>
            ))}
          </div>
          {!isSearching && pagination && (
            <div className={styles.matePagination}>
              {pagination.previousPageGroup && (
                <button onClick={() => handlePageChange(pagination.startPageOfPageGroup - 1)}>◀</button>
              )}
              {Array.from({ length: pagination.endPageOfPageGroup - pagination.startPageOfPageGroup + 1 }, (_, i) => (
                <button
                  key={i + pagination.startPageOfPageGroup}
                  onClick={() => handlePageChange(i + pagination.startPageOfPageGroup)}
                  className={pagination.currentPage === i + pagination.startPageOfPageGroup ? styles.mateActivePage : ''}
                >
                  {i + pagination.startPageOfPageGroup}
                </button>
              ))}
              {pagination.nextPageGroup && (
                <button onClick={() => handlePageChange(pagination.endPageOfPageGroup + 1)}>▶</button>
              )}
            </div>
          )}
        </div>
      )}
      <div className={styles.mateMypageButtonContainer}>
        <Link to="/member/mypage" className={styles.mateMypageButton}>
          프로필 수정
        </Link>
      </div>
    </div>
  );
}
