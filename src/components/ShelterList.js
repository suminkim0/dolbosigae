import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Link 컴포넌트 추가
import styles from '../css/ShelterList.module.css';
import ShelterFilter from './ShelterFilter';
import Pagination from './Pagination';

const ShelterList = () => {
    const [searchKeyword, setSearchKeyword] = useState('');
    const [error, setError] = useState('');
    const [shelters, setShelters] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [pagination, setPagination] = useState({ totalPages: 0, currentPage: 1 });
    const [selectedRegion, setSelectedRegion] = useState('선택');

    const fetchShelterData = async () => {
        try {
            const response = await axios.get('http://13.124.183.147:59879/shelters/list', {
                params: {
                    page,   // pageNo -> page로 수정
                    limit,  // pageContentEa -> limit로 수정
                    region: selectedRegion !== '선택' ? selectedRegion : null,
                    centerName: searchKeyword || null
                }
            });
            console.log('Response Data:', response.data);  // 응답 데이터 확인
            const contents = response.data.contents || [];
            setShelters(contents);
            const paginationData = response.data.pagination;
            setPagination({
                totalPages: paginationData.totalPages,
                currentPage: paginationData.currentPage
            });
        } catch (error) {
            console.log('Error fetching data:', error);
            setError('Error fetching data');
        }
    };

    useEffect(() => {
        fetchShelterData();
    }, [page, limit, selectedRegion, searchKeyword]);

    const searchShelterClick = () => {
        setPage(1);
        fetchShelterData();
    };

    const onPageChange = (number) => {
        setPage(number);
    };

    const renderTable = useCallback(() => (
        <div className={styles.tableContainer}>
            <table>
                <thead>
                    <tr>
                        <th>센터지역</th>
                        <th>센터명</th>
                        <th>센터번호</th>
                        <th>센터주소</th>
                    </tr>
                </thead>
                <tbody>
                    {shelters.length > 0 ? (
                        shelters.map((shelter, index) => (
                            <tr key={index}>
                                <td>{shelter.shRegion}</td>
                                <td>
                                    <Link to={`/shelterdetail/${shelter.shID}`}>{shelter.shName}</Link> {/* Link 추가 */}
                                </td>
                                <td>{shelter.shTel}</td>
                                <td>{shelter.shAddress}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">No shelters found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    ), [shelters]);

    return (
        <div className={styles.container}>
            <div className={styles.mainContent}>
                <div className={styles.searchAndTableContainer}>
                    <div className={styles.searchContainer}>
                        <input
                            type="text"
                            value={searchKeyword}
                            placeholder="보호소 이름을 입력해주세요."
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            className={styles.searchInput}
                        />
                        <button onClick={searchShelterClick} className={styles.searchButton}>조회</button>
                    </div>
                    <ShelterFilter onFilterChange={(region) => setSelectedRegion(region)} />
                    {error && <div className={styles.error}>{error}</div>}
                    {renderTable()}
                    <div className={styles.paginationContainer}>
                        <Pagination currentPage={page} totalPage={pagination.totalPages} onPageChange={onPageChange} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShelterList;