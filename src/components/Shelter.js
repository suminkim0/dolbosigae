import axios from 'axios';
import { useEffect, useState } from 'react';
import SubTitleShelter from './SubTitles/SubTitleShelter';
import styles from '../css/shelter.module.css';
import { Link } from 'react-router-dom';

export default function Shelter() {
  const [shelterList, setShelterList] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [searchCategory, setSearchCategory] = useState('지역선택');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const readData = async () => {
      try {
        const response = await axios.get('http://13.124.183.147:59879/shelter/list');
        setShelterList(response.data.shelter);
        setPagination(response.data.pagination);
      } catch (error) {
        console.error("보호센터 조회 중 에러발생", error);
      }
    };
    readData();
  }, []);

  const handlePageChange = (pageNo) => {
    const fetchPageData = async () => {
      try {
        const response = await axios.get(`http://13.124.183.147:59879/shelter/list?page=${pageNo}`);
        setShelterList(response.data.shelter);
        setPagination(response.data.pagination);
      } catch (error) {
        console.error("보호센터 다른 페이지 조회 중 에러발생", error);
      }
    };
    fetchPageData();
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get('http://13.124.183.147:59879/shelter/search', {
        params: {
          category: searchCategory,
          term: searchTerm
        }
      });
      if (response.data && Array.isArray(response.data)) {
        setShelterList(response.data);
      } else {
        setShelterList([]);
      }
      if (response.data && response.data.pagination) {
        setPagination(response.data.pagination);
      } else {
        setPagination(null);
      }
    } catch (error) {
      console.error("지역 센터 검색 중 오류 발생!", error);
      alert("센터 검색 중 오류가 발생했습니다.");
      setShelterList([]);
      setPagination(null);
    }
  };

  return (
    <div>
      <SubTitleShelter />
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
        <input value={searchTerm} placeholder='센터명 입력' onChange={(e) => setSearchTerm(e.target.value)} />
        <button onClick={handleSearch}>검색</button>
      </div>
      {shelterList.length === 0 ? (
        <div>해당 데이터가 없습니다.</div>
      ) : (
        <table className={styles.table}>
            <tr>
              <th>지역</th>
              <th>이름</th>
              <th>주소</th>
              <th>전화번호</th>
              <th>운영시간</th>
            </tr>
            {shelterList.map((shelter) => (
              <tr key={shelter.shelterId}>
                <td>{shelter.shelterRegion}</td>
                <td>
                  <Link to={`/shelter/detail/${shelter.shelterId}`} className={styles.link}>{shelter.shelterName}</Link>
                </td>
                <td>{shelter.shelterAddress}</td>
                <td>{shelter.shelterTel}</td>
                <td>{shelter.shelterHour}</td>
              </tr>
            ))}
            <tr>
              <td className={styles.paginationGroup} colSpan={5} style={{ textAlign: 'center' }}>
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
              </td>
            </tr>
        </table>
      )}
    </div>
  );
}
