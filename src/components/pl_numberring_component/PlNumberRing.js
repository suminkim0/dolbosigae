import React from 'react';
import styles from './css/plNumberRing.module.css';

const PlNumberRing = ({ onNumberRing, pagination }) => {
    const totalPages = pagination.totalPages;
    const currentPage = pagination.currentPage;
    const pageGroupSize = 5;
    const currentPageGroup = Math.ceil(currentPage / pageGroupSize);
    const startPage = (currentPageGroup - 1) * pageGroupSize + 1;
    const endPage = Math.min(currentPageGroup * pageGroupSize, totalPages);

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    console.log(pages); // 로그 추가

    return (
        <div className={styles.numberRing_Container}>
            {currentPageGroup > 1 && (
                <>
                    <button onClick={() => onNumberRing(1)} className={styles.leftAllButton}>&lt;&lt;</button>
                    <button onClick={() => onNumberRing(startPage - 1)} className={styles.leftButton}>&lt;</button>
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
                    <button onClick={() => onNumberRing(endPage + 1)} className={styles.rightButton}>&gt;</button>
                    <button onClick={() => onNumberRing(totalPages)} className={styles.rightAllButton}>&gt;&gt;</button>
                </>
            )}
        </div>
    );
};

export default PlNumberRing;
