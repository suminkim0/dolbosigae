import React, { useState, useEffect } from 'react';
import { useParams, Link  } from 'react-router-dom';
import styles from '../css/pharmacyDetail.module.css'; // CSS 파일명도 변경했는지 확인
import KakaoMap from './KakaoMap'; // KakaoMap 컴포넌트 import
import SubTitlePharmacy from './SubTitles/SubTitlePharmacy';

const PharmacyDetail = () => {
    const { phId } = useParams(); // URL 파라미터에서 약국 ID를 가져옵니다
    const [pharmacyInfo, setPharmacyInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPharmacyInfo = async () => {
            try {
                const response = await fetch(`http://localhost:9999/phinfo?phId=${phId}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setPharmacyInfo(data);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
                console.error('Error fetching pharmacy info:', error);
            }
        };

        fetchPharmacyInfo();
    }, [phId]);

    if (loading) {
        return <div>Loading...</div>; // 데이터 로딩 중 표시
    }

    if (error) {
        return <div>Error: {error.message}</div>; // 에러 발생 시 메시지 표시
    }

    // 약국 정보에서 위치 정보를 추출
    const location = {
        name: pharmacyInfo.phName, // 약국명 사용
        lat: parseFloat(pharmacyInfo.phLat), // 위도
        lng: parseFloat(pharmacyInfo.phLng)  // 경도
    };

    return (
        <div>
            <SubTitlePharmacy />
            <div className={styles.main_container}>
                {/* KakaoMap 컴포넌트 추가 */}
                <KakaoMap locations={[location]} />
                <table>
                    <tbody>
                        <tr className={styles.tr}>
                            <td className={styles.name_td}><p className={styles.p_Tag}>약국명</p></td>
                            <td className={styles.data_Td}>{pharmacyInfo.phName}</td>
                            <td className={styles.name_td}><p className={styles.p_Tag}>연락처</p></td>
                            <td className={styles.data_Td}>{pharmacyInfo.phTel}</td>
                        </tr>
                        <tr className={styles.tr}>
                            <td className={styles.name_td}><p className={styles.p_Tag}>지역</p></td>
                            <td className={styles.data_Td}>{pharmacyInfo.phRegion}</td>
                            <td className={styles.name_td}><p className={styles.p_Tag}>운영시간</p></td>
                            <td className={styles.data_Td}>{pharmacyInfo.phHour}</td>
                        </tr>
                        <tr className={styles.Address_Tr}>
                            <td className={styles.name_td}><p className={styles.p_Tag}>주소</p></td>
                            <td className={styles.data_Td} colSpan="4">{pharmacyInfo.phAddress}</td>
                        </tr>
                    </tbody>
                </table>
                        {/* 글 목록으로 이동하는 버튼 추가 */}
                        <div className={styles.buttonContainer}>
                    <Link to={`/pharmacies`} className={styles.linkButton}>글 목록</Link>
                </div>
            </div>
        </div>
    );
};

export default PharmacyDetail;
