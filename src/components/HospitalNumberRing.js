import React from 'react';
import styles from '../css/hospitalNumberRing.module.css';

const HospitalNumberRing = ({ onNumberRing, pagination }) => {
    const totalPages = pagination.totalPages;
    const currentPage = pagination.currentPage;
    const pageGroupSize = 5; // 페이지 그룹의 사이즈
    
    const currentPageGroup = Math.ceil(currentPage / pageGroupSize); // 현재 페이지 그룹 계산
    const startPage = (currentPageGroup - 1) * pageGroupSize + 1; // 현재 페이지 그룹의 시작 페이지
    const endPage = Math.min(currentPageGroup * pageGroupSize, totalPages); // 현재 페이지 그룹의 끝 페이지

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
        pages.push(i); // 페이지 배열에 페이지 번호 추가
    }

    console.log("HospitalNumberRing pages: ", pages); // 페이지 배열을 로그에 출력

    return (
        <div className={styles.numberRing_Container}>
            {currentPageGroup > 1 && (
                <>
                    <button 
                        onClick={() => onNumberRing(1)} 
                        className={styles.leftAllButton}
                    >
                        &lt;&lt;
                    </button>
                    <button 
                        onClick={() => onNumberRing(startPage - 1)} 
                        className={styles.leftButton}
                    >
                        &lt;
                    </button>
                </>
            )}
            {pages.map((number) => (
                <button
                    key={number}
                    onClick={() => onNumberRing(number)}
                    className={`${styles.numberButton} ${number === currentPage ? styles.active : ''}`}
                >
                    {number}
                </button>
            ))}
            {currentPageGroup < Math.ceil(totalPages / pageGroupSize) && (
                <>
                    <button 
                        onClick={() => onNumberRing(endPage + 1)} 
                        className={styles.rightButton}
                    >
                        &gt;
                    </button>
                    <button 
                        onClick={() => onNumberRing(totalPages)} 
                        className={styles.rightAllButton}
                    >
                        &gt;&gt;
                    </button>
                </>
            )}
        </div>
    );
};

export default HospitalNumberRing;
