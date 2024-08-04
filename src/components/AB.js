import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import SubTitleAB from './SubTitles/SubTitleAB';
import styles from '../css/ab.module.css';

export default function AB() {
  const [ABList, setABList] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [searchCategory, setSearchCategory] = useState('지역선택');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const readData = async () => {
      try {
        const response = await axios.get('https://dolbosigae.site/ab/list');
        setABList(response.data.ab);
        setPagination(response.data.pagination);
        console.log(response.data);
      } catch (error) {
        console.error("유기견 조회 중 에러발생", error);
      }
    };
    readData();
  }, []);

  const handlePageChange = (pageNo) => {
    const fetchPageData = async () => {
      try {
        const response = await axios.get(`https://dolbosigae.site/ab/list?page=${pageNo}`);
        setABList(response.data.ab);
        setPagination(response.data.pagination);
      } catch (error) {
        console.error("보호센터 다른 페이지 조회 중 에러발생", error);
      }
    };
    fetchPageData();
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get('https://dolbosigae.site/ab/search', {
        params: {
          category: searchCategory,
          term: searchTerm
        }
      });
      if (response.data && Array.isArray(response.data)) {
        setABList(response.data);
      } else {
        setABList([]);
      }
      if (response.data && response.data.pagination) {
        setPagination(response.data.pagination);
      } else {
        setPagination(null);
      }
    } catch (error) {
      console.error("지역 유기견 검색 중 오류 발생!", error);
      alert("센터 검색 중 오류가 발생했습니다.");
      setABList([]);
      setPagination(null);
    }
  };


  return(
    <div>
      <SubTitleAB />
      <div className={styles.searchBox}>
        <select value={searchCategory} onChange={(e) => setSearchCategory(e.target.value)}>
          <option>지역선택</option>
          <option>경기도 가평군</option>
          <option>경기도 고양시</option>
          <option>경기도 과천시</option>
          <option>경기도 광명시</option>
          <option>경기도 광주시</option>
          <option>경기도 구리시</option>
          <option>경기도 남양주시</option>
          <option>경기도 동두천시</option>
          <option>경기도 부천시</option>
          <option>경기도 성남시</option>
          <option>경기도 수원시</option>
          <option>경기도 시흥시</option>
          <option>경기도 안산시</option>
          <option>경기도 양주시</option>
          <option>경기도 양평군</option>
          <option>경기도 연천군</option>
          <option>경기도 용인시</option>
          <option>경기도 의왕시</option>
          <option>경기도 의정부시</option>
          <option>경기도 평택시</option>
          <option>경기도 하남시</option>
          <option>경기도 화성시</option>
        </select>
        <input value={searchTerm} placeholder='견종 입력' onChange={(e) => setSearchTerm(e.target.value)} />
        <button onClick={handleSearch}>검색</button>
      </div>
      {ABList.length === 0 ? (
        <div>해당 데이터가 없습니다.</div>
      ) : (
        <div className={styles.listContainer}>
          <ul className={styles.list}>
            {ABList.map((ab) => (
              <Link style={{ textDecoration: 'none', color: 'inherit' }} to={`/ab/detail/${ab.abid}`}>
                <li key={ab.shelterId} className={styles.listItem}>
                  <img src={ab.abimg} alt="견종 이미지"/>
                  <div className={styles.abbreed}>{ab.abbreed}</div>
                  <div>{ab.ablocation}</div>
                  <div>{ab.abcharacter}</div>
                </li>
              </Link>
            ))}
          </ul>
        </div>
      )}
      <div className={styles.paginationGroup}>
        {pagination && pagination.previousPageGroup && (
          <button onClick={() => handlePageChange(pagination.startPageOfPageGroup - 1)}>◀</button>
        )}
        {pagination && Array.from({ length: pagination.endPageOfPageGroup - pagination.startPageOfPageGroup + 1 }, (_, i) => (
          <button
            key={i + pagination.startPageOfPageGroup}
            onClick={() => handlePageChange(i + pagination.startPageOfPageGroup)}
            className={pagination.currentPage === i + pagination.startPageOfPageGroup ? styles.activePage : ''}
          >
            {i + pagination.startPageOfPageGroup}
          </button>
        ))}
        {pagination && pagination.nextPageGroup && (
          <button onClick={() => handlePageChange(pagination.endPageOfPageGroup + 1)}>▶</button>
        )}
      </div>
    </div>
  );
}