import React, { useState } from 'react';
import axios from 'axios';
import styles from '../css/adminContactSearch.module.css';

export default function AdminContactSearch({ onSearchResults, setSearchCategory, setSearchTerm, setNoAnswerOnly, noAnswerOnly, user }) {
  const [searchCategory, updateSearchCategory] = useState('문의글 제목');
  const [searchTerm, updateSearchTerm] = useState('');

  const handleSearch = async () => {
    console.log('Search Category:', searchCategory);
    console.log('Search Term:', searchTerm);

    setSearchCategory(searchCategory);
    setSearchTerm(searchTerm);

    try {
      const response = await axios.get('http://localhost:9999/admin/search', {
        params: {
          category: searchCategory,
          term: searchTerm
        }
      });
      console.log('Search response:', response.data); // 응답 데이터 로깅
      if (Array.isArray(response.data)) {
        onSearchResults(response.data, { currentPage: 1, totalItems: response.data.length }); // 임시 페이지네이션
      } else {
        console.error("Invalid response structure", response.data);
      }
    } catch (error) {
      console.error("문의글 카테고리 검색 중 오류!", error);
      alert("문의글 검색 중 오류가 발생했습니다.");
    }
  };

  const handleNoAnswer = async (e) => {
    const isChecked = e.target.checked;
    setNoAnswerOnly(isChecked); // 체크박스 상태 업데이트

    if (isChecked) {
      try {
        const response = await axios.get('http://localhost:9999/admin/no-answer');
        console.log('No answer response:', response.data); // 응답 데이터 로깅
        if (Array.isArray(response.data)) {
          onSearchResults(response.data, { currentPage: 1, totalItems: response.data.length }); // 임시 페이지네이션
        } else {
          console.error("Invalid response structure", response.data);
        }
      } catch (error) {
        console.error("미답변만 보기 검색 중 오류!", error);
        alert("미답변만 보기 검색 중 오류가 발생했습니다.");
      }
    } else {
      handleSearch();
    }
  };

  return (
    <div className={styles.searchBox}>
      <select value={searchCategory} onChange={(e) => {
        updateSearchCategory(e.target.value);
        setSearchCategory(e.target.value);
      }}>
        <option>문의글 제목</option>
        <option>문의글 내용</option>
        <option>작성자ID</option>
      </select>
      <input value={searchTerm} onChange={(e) => {
        updateSearchTerm(e.target.value);
        setSearchTerm(e.target.value);
      }} />
      <button onClick={handleSearch}>검색</button>
      {user && user.boardMemberGradeNo === 0 && (
        <div className={styles.checkbox}>
          <input type='checkbox' id='noAnswerOnlyCheckbox' onChange={handleNoAnswer} checked={noAnswerOnly} />
          <label htmlFor='noAnswerOnlyCheckbox'>미답변만 보기</label>
        </div>
      )}
    </div>
  );
}