import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from '../css/hospital.module.css';
import HospitalNumberRing from './HospitalNumberRing';
import KakaoMap from './KakaoMap';
import SubTitleHospital from './SubTitles/SubTitleHospital';

const HO = () => {
    const [hoText, setHoText] = useState('');
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

    const fetchHospitalData = async () => {
        try {
            const response = await axios.get('http://13.124.183.147:59879/hospitals/list', {
                params: { hoText, page, limit }
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
        fetchHospitalData();
    }, [page, limit]);

    const searchHospitalClick = async () => {
        setPage(1);
        fetchHospitalData();
    };

    const onNumberRing = (number) => {
        setPage(Number(number));  // ensure the number is parsed as a number
    };

    const deleteHospital = async (hoId) => {
        try {
            const response = await axios.delete(`http://13.124.183.147:59879/hospitals/delete/${hoId}`, {
                headers: {
                    'userRole': user.boardMemberGradeNo === 0 ? 'ADMIN' : ''
                }
            });
            if (response.data.status === 'success') {
                fetchHospitalData();  // 삭제 후 목록 갱신
            } else {
                setError(response.data.message || 'Error deleting hospital');
            }
        } catch (error) {
            console.log('Error deleting hospital:', error);
            setError('Error deleting hospital');
        }
    };

    const renderTable = useCallback(() => (
        <div className={styles.tableContainer}>
            <table>
                <thead>
                    <tr>
                        <th></th>                     
                        <th>병원명</th>
                        <th>지역</th>
                        <th>전화번호</th>
                        <th>주소</th>
                        <th>우편번호</th>
                        <th></th>                     
                    </tr>
                </thead>
                <tbody>
                    {result.map((hospital, index) => (
                        <tr key={index}>
                            <td>
                                {user && user.boardMemberGradeNo === 0 && (
                                    <button className={styles.DeleteBtn}
                                        onClick={() => deleteHospital(hospital.hoId)}>삭제</button>
                                )}
                            </td>
                          
                            <td>{hospital.hoName}</td>
                            <td>{hospital.hoRegion}</td>
                            <td>{hospital.hoTel}</td>
                            <td>{hospital.hoAddress}</td>
                            <td>{hospital.hoPost}</td>
                            <td>
                                <Link
                                    to={`/hoinfo/${hospital.hoId}`}
                                    className={styles.linkButton} > 이동 </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    ), [result, user]);

    // 병원 위치 데이터를 KakaoMap에 전달할 형태로 변환합니다.
    const locations = result.map(hospital => ({
        name: hospital.hoName,
        lat: parseFloat(hospital.hoLat), // 위도
        lng: parseFloat(hospital.hoLng)  // 경도
    }));

    return (
        <div className={styles.allContainer}>
          
            <SubTitleHospital />
            <div className={styles.container}>
                <div className={styles.mainContent}>
                    <div className={styles.searchAndTableContainer}>
                        <div className={styles.searchContainer}>
                            <input
                                type="text"
                                value={hoText}
                                placeholder="주소를 입력해주세요. (예: 기흥, 성남)"
                                onChange={(e) => setHoText(e.target.value)}
                                className={styles.searchInput}
                            />
                            <button onClick={searchHospitalClick} className={styles.searchButton}>조회</button>
                        </div>
                        {user && user.boardMemberGradeNo === 0 && (
                            <div className={styles.addButtonContainer}>
                                <Link to={`/addHospital`} className={styles.linkButton}> + 병원 추가하기</Link>
                            </div>
                        )}
                        {error && <div className={styles.error}>{error}</div>}
                        {result.length > 0 && (
                            <>
                                {renderTable()}
                                <div className={styles.paginationContainer}>
                                    <HospitalNumberRing onNumberRing={onNumberRing} pagination={pagination} />
                                </div>
                            </>
                        )}
                    </div>
                    <div className={styles.mapContainer}>
                        <KakaoMap locations={locations} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HO;