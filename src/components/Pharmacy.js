import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from '../css/pharmacy.module.css';
import PharmacyNumberRing from './PharmacyNumberRing';
import KakaoMap from './KakaoMap';
import SubTitlePharmacy from './SubTitles/SubTitlePharmacy';

const PH = () => {
    const [phText, setPhText] = useState('');
    const [error, setError] = useState('');
    const [result, setResult] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [pagination, setPagination] = useState({ totalPages: 0, currentPage: 1 });
    const [user, setUser] = useState(null);

    // 로컬 스토리지에서 user 정보를 가져와 노출 여부를 설정함
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
        }
    }, []);

    const fetchPharmacyData = async () => {
        try {
            const response = await axios.get('http://13.124.183.147:59879/pharmacies/list', {
                params: { phText, page, limit }
            });
            const contents = response.data.contents || [];
            setResult(contents);
            setPagination({
                totalPages: response.data.pagination.totalPages,
                currentPage: page,
            });
        } catch (error) {
            console.log('Error fetching data:', error);
            setError('Error fetching data');
        }
    };

    useEffect(() => {
        fetchPharmacyData();
    }, [page, limit]);

    const searchPharmacyClick = async () => {
        setPage(1);
        fetchPharmacyData();
    };

    const onNumberRing = (number) => {
        setPage(Number(number));  // ensure the number is parsed as a number
    };

    const deletePharmacy = async (phId) => {
        try {
            const response = await axios.delete(`http://13.124.183.147:59879/pharmacies/delete/${phId}`, {
                headers: {
                    'userRole': user.boardMemberGradeNo === 0 ? 'ADMIN' : ''
                }
            });
            if (response.data.status === 'success') {
                fetchPharmacyData();  // 삭제 후 목록 갱신
            } else {
                setError(response.data.message || 'Error deleting pharmacy');
            }
        } catch (error) {
            console.log('Error deleting pharmacy:', error);
            setError('Error deleting pharmacy');
        }
    };

    const renderTable = useCallback(() => (
        <div className={styles.tableContainer}>
            <table>
                <thead>
                    <tr>
                        <th></th>                 
                        <th>약국명</th>
                        <th>지역</th>
                        <th>전화번호</th>
                        <th>도로명 주소</th>
                        <th>운영시간</th>
                        <th></th>                 
                    </tr>
                </thead>
                <tbody>
                    {result.map((pharmacy, index) => (
                        <tr key={index}>
                            <td>
                                {user && user.boardMemberGradeNo === 0 && (
                                    <button
                                        className={styles.DeleteBtn}
                                        onClick={() => deletePharmacy(pharmacy.phId)}>삭제</button>
                                )}
                            </td>
                          
                            <td>{pharmacy.phName}</td>
                            <td>{pharmacy.phRegion}</td>
                            <td>{pharmacy.phTel}</td>
                            <td>{pharmacy.phAddress}</td>
                            <td>{pharmacy.phHour}</td>
                            <td>
                                <Link
                                    to={`/phinfo/${pharmacy.phId}`}
                                    className={styles.linkButton}>이동</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    ), [result, user]);

    // 약국 위치 데이터를 KakaoMap에 전달할 형태로 변환합니다.
    const locations = result.map(pharmacy => ({
        name: pharmacy.phName,
        lat: parseFloat(pharmacy.phLat), // 위도
        lng: parseFloat(pharmacy.phLng)  // 경도
    }));

    return (
        <>
            <SubTitlePharmacy />
            <div className={styles.container}>
                <div className={styles.mainContent}>
                    <div className={styles.searchAndTableContainer}>
                        <div className={styles.searchContainer}>
                            <input
                                type="text"
                                value={phText}
                                placeholder="주소를 입력해주세요. (예: 기흥, 성남)"
                                onChange={(e) => setPhText(e.target.value)}
                                className={styles.searchInput}
                            />
                            <button onClick={searchPharmacyClick} className={styles.searchButton}>조회</button>
                        </div>
                        {user && user.boardMemberGradeNo === 0 && (
                            <div className={styles.addButtonContainer}>
                                <Link to={`/addPharmacy`} className={styles.linkButton}>+ 약국 추가하기</Link>
                            </div>
                        )}
                        {error && <div className={styles.error}>{error}</div>}
                        {result.length > 0 && (
                            <>
                                {renderTable()}
                                <div className={styles.paginationContainer}>
                                    <PharmacyNumberRing onNumberRing={onNumberRing} pagination={pagination} />
                                </div>
                            </>
                        )}
                    </div>
                    <div className={styles.mapContainer}>
                        <KakaoMap locations={locations} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default PH;
