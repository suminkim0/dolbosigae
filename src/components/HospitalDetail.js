import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // Link 컴포넌트 추가
import styles from '../css/hospitalDetail.module.css';
import KakaoMap from './KakaoMap'; // KakaoMap 컴포넌트 import
import SubTitleHospital from './SubTitles/SubTitleHospital';

const HospitalDetail = () => {
    const { hoId } = useParams(); // URL 파라미터에서 병원 ID를 가져옵니다
    const [hospitalInfo, setHospitalInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHospitalInfo = async () => {
            try {
                const response = await fetch(`http://localhost:9999/hoinfo?hoId=${hoId}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setHospitalInfo(data);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
                console.error('Error fetching hospital info:', error);
            }
        };

        fetchHospitalInfo();
    }, [hoId]);

    if (loading) {
        return <div>Loading...</div>; // 데이터 로딩 중 표시
    }

    if (error) {
        return <div>Error: {error.message}</div>; // 에러 발생 시 메시지 표시
    }

    // 병원 정보에서 위치 정보를 추출
    const location = {
        name: hospitalInfo.hoName,
        lat: parseFloat(hospitalInfo.hoLat), // 위도
        lng: parseFloat(hospitalInfo.hoLng)  // 경도
    };

    return (
        <div>
            <SubTitleHospital />
            <div className={styles.main_container}>
                {/* KakaoMap 컴포넌트 추가 */}
                <KakaoMap locations={[location]} />
                <table>
                    <tbody>
                        <tr className={styles.tr}>
                            <td className={styles.name_td}><p className={styles.p_Tag}>병원명</p></td>
                            <td className={styles.data_Td}>{hospitalInfo.hoName}</td>
                            <td className={styles.name_td}><p className={styles.p_Tag}>연락처</p></td>
                            <td className={styles.data_Td}>{hospitalInfo.hoTel}</td>
                        </tr>
                        <tr className={styles.tr}>
                            <td className={styles.name_td}><p className={styles.p_Tag}>지역</p></td>
                            <td className={styles.data_Td}>{hospitalInfo.hoRegion}</td>
                            <td className={styles.name_td}><p className={styles.p_Tag}>우편번호</p></td>
                            <td className={styles.data_Td}>{hospitalInfo.hoPost}</td>
                        </tr>
                        <tr className={styles.Address_Tr}>
                            <td className={styles.name_td}><p className={styles.p_Tag}>주소</p></td>
                            <td className={styles.data_Td} colSpan="4">{hospitalInfo.hoAddress}</td>
                        </tr>
                    </tbody>
                </table>
                {/* 글 목록으로 이동하는 버튼 추가 */}
                <div className={styles.buttonContainer}>
                    <Link to={`/animal-medical`} className={styles.linkButton}>글 목록</Link>
                </div>
            </div>
        </div>
    );
};

export default HospitalDetail;