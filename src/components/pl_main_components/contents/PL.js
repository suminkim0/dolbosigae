import axios from 'axios';
import { Link } from 'react-router-dom';
import React, { useState, useEffect, useCallback } from 'react';
import styles from './css/pl.module.css';
import PlNumberRing from '../../pl_numberring_component/PlNumberRing';
import SubTitlePL from '../../SubTitles/SubTitlePL';

const PL = () => {
    const [plText, setPlText] = useState('');
    const [error, setError] = useState('');
    const [result, setResult] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [pagination, setPagination] = useState({ totalPages: 0, currentPage: 1 });

    const fetchCityData = async () => {
        try {
            const response = await axios.get('http://13.124.183.147:59879/city/list', {
                params: { plText, page, limit }
            });
            const contents = response.data.contents || [];
            setResult(contents);
            setPagination({
                totalPages: response.data.pagination.totalPages,
                currentPage: page,
            });
        } catch (error) {
            console.log('Error fetching city data:', error);
            setError('Error fetching city data');
        }
    };

    useEffect(() => {
        fetchCityData();
    }, [page, limit]);

    const searchClick = async () => {
        setPage(1);
        fetchCityData();
    };

    const onNumberRing = (number) => {
        setPage(number);
    };

    const renderTable = useCallback(() => (
        <table className={styles.specificTable}>
            <thead>
                <tr>
                    <th></th>
                    <th>번호</th>
                    <th>공원명</th>
                    <th>출입 허용 시간</th>
                    <th>전화번호</th>
                    <th>도로명 주소</th>
                    <th>상세정보</th>
                </tr>
            </thead>
            <tbody>
                {result.map((city, index) => (
                    <tr key={index}>
                        <td>
                            <button className={styles.DeleteBtn}>삭제</button>
                        </td>
                        <td>{city.plId}</td>
                        <td>{city.plName}</td>
                        <td>{city.plHour}</td>
                        <td>{city.plTel}</td>
                        <td>{city.plAddress}</td>
                        <td><Link to={`/plinfo/${city.plId}`}>이동</Link></td>
                    </tr>
                ))}
            </tbody>
        </table>
    ), [result]);

    return (
        <div className={styles.container}>
            <SubTitlePL />
            <div className={styles.main_Image}>
                <div className={styles.search_container}>
                    <input
                        type="text"
                        value={plText}
                        placeholder="지역 입력"
                        onChange={(e) => setPlText(e.target.value)}
                    />
                    <button onClick={searchClick}>조회</button>
                    {error && <div className={styles.error}>{error}</div>}
                </div>
                {result.length > 0 && renderTable()}
            </div>
            <div className={styles.info_container}>
                <PlNumberRing onNumberRing={onNumberRing} pagination={pagination} />
            </div>
            <footer className={styles.footer}>하단바</footer>
        </div>
    );
};

export default PL;