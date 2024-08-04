import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Link 컴포넌트 추가
import Pagination from './Pagination';
import ABFilter from './ABFilter';
import styles from '../css/ABList.module.css'; // 스타일 파일

const ABList = () => {
    const [abList, setAbList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageContentCount, setPageContentCount] = useState(6); // 한 페이지에 6개 항목 표시
    const [totalPage, setTotalPage] = useState(1);
    const [filter, setFilter] = useState({
        region: '',
        centerName: '',
        startDate: '',
        endDate: '',
        breed: ''
    });

    const fetchABList = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get('https://dolbosigae.site/abs/list', {
                params: {
                    page: currentPage,
                    limit: pageContentCount,
                    ...filter
                }
            });

            console.log('응답 데이터:', response.data); // 확인

            if (response.data && response.data.contents) {
                setAbList(response.data.contents); // `contents` 배열을 상태로 설정
                setTotalPage(Math.ceil(response.data.pagination.count / pageContentCount)); // 전체 페이지 수 계산
            } else {
                setAbList([]);
                setTotalPage(1);
            }
        } catch (error) {
            console.error('데이터를 가져오는 중 오류 발생:', error);
            setError(error);
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageContentCount, filter]);

    useEffect(() => {
        fetchABList();
    }, [fetchABList]);

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        setCurrentPage(1); // 필터 변경 시 페이지를 1로 리셋
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className={styles.container}>
            <h2>보호 중인 동물 목록</h2>
            <ABFilter onFilterChange={handleFilterChange} />
            <div className={styles.ab_list}>
                {abList.length > 0 ? (
                    <div className={styles.ab_card_list}>
                        {abList.map((ab) => (
                            <div key={ab.abID} className={styles.ab_card}>
                                <Link to={`/ab/detail/${ab.abID}`} className={styles.ab_card_link}>
                                    <div className={styles.ab_image}>
                                        <img src={ab.abImg} alt={ab.abBreed} />
                                    </div>
                                    <div className={styles.ab_info}>
                                        <p>보호종: {ab.abBreed}</p>
                                        <p>발견 장소: {ab.abLocation}</p>
                                        <p>특징: {ab.abCharacter}</p>
                                        {/* 예를 들어, 1주일 이상된 경우 입양 가능 표시 */}
                                        {isOverAWeek(ab.abDate) && (
                                            <p className={styles.adoptable}>입양가능</p>
                                        )}
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div>No animals found</div>
                )}
            </div>
            <div className={styles.paginationContainer}>
                <Pagination
                    currentPage={currentPage}
                    totalPage={totalPage}
                    onPageChange={setCurrentPage}
                />
            </div>
        </div>
    );
};

// 날짜가 1주일 이상 되었는지 확인하는 유틸리티 함수
const isOverAWeek = (dateString) => {
    const abDate = new Date(dateString);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate - abDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 7;
};

export default ABList;