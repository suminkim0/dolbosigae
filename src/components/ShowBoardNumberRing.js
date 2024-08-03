import React from 'react';
import styles from '../css/board.module.css';

const ShowBoardNumberRing = ({ onNumberRing, pagination }) => {
    const totalPages = pagination.totalPages;
    const currentPage = pagination.currentPage;
    const pageGroupSize = 10; // 페이지 그룹의 사이즈
    
    const currentPageGroup = Math.ceil(currentPage / pageGroupSize); // 현재 페이지 그룹 계산
    const startPage = (currentPageGroup - 1) * pageGroupSize + 1; // 현재 페이지 그룹의 시작 페이지
    const endPage = Math.min(currentPageGroup * pageGroupSize, totalPages); // 현재 페이지 그룹의 끝 페이지

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
        pages.push(i); // 페이지 배열에 페이지 번호 추가
    }

    console.log("ShowBoardNumberRing pages: ", pages); // 페이지 배열을 로그에 출력

    return (
        <div className={styles.paginationContainer}>
            {currentPageGroup > 1 && (
                <>
                    <button onClick={() => onNumberRing(1)}>&lt;&lt;</button>
                    <button onClick={() => onNumberRing(startPage - 1)}>&lt;</button>
                </>
            )}
            {pages.map((number) => (
                <button
                    key={number}
                    onClick={() => onNumberRing(number)}
                    className={number === currentPage ? styles.activePage : ''}
                >
                    {number}
                </button>
            ))}
            {currentPageGroup < Math.ceil(totalPages / pageGroupSize) && (
                <>
                    <button onClick={() => onNumberRing(endPage + 1)}>&gt;</button>
                    <button onClick={() => onNumberRing(totalPages)}>&gt;&gt;</button>
                </>
            )}
        </div>
    );
};

export default ShowBoardNumberRing;
