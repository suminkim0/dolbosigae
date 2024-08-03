import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './css/CoInfoView.module.css';
import SubTitleCO from '../SubTitles/SubTitleCO';
import KakaoMap from '../KakaoMap';

const CoInfoView = () => {
    const { coId } = useParams();
    const [convenInfo, setConvenInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchConvenInfo = async () => {
            try {
                const response = await fetch(`http://13.124.183.147:59879/conven/info?coId=${coId}`);
                if (!response.ok) {
                    throw new Error('서버 에러');
                }
                const data = await response.json();
                console.log(data);
                setConvenInfo(data);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
                console.error('데이터를 가져오는데 실패하였습니다.', error);
            }
        };
        fetchConvenInfo();
    }, [coId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    const location = {
        name: convenInfo.coName,
        lat: parseFloat(convenInfo.coLati), // 위도
        lng: parseFloat(convenInfo.coLong)  // 경도
    };

    return (
        <div>
            <div className={styles.SubTitlePL_container}>
                <SubTitleCO />
            </div>
            <div className={styles.main_container}>
                <KakaoMap locations={[location]} />
                <table className={styles.co_table}>
                    <tbody>
                        <tr className={styles.tr}>
                            <td className={styles.name_td}><p className={styles.p_Tag}>업종명</p></td>
                            <td className={styles.data_Td}>{convenInfo.coName}</td>
                            <td className={styles.name_td}><p className={styles.p_Tag}>분류</p></td>
                            <td className={styles.data_Td}>{convenInfo.coDistinction}</td>
                        </tr>
                        <tr className={styles.tr}>
                            <td className={styles.name_td}><p className={styles.p_Tag}>전화번호</p></td>
                            <td className={styles.data_Td}>{convenInfo.coTel}</td>
                            <td className={styles.name_td}><p className={styles.p_Tag}>출입여부일</p></td>
                            <td className={styles.data_Td}>{convenInfo.coDay}</td>
                        </tr>
                        <tr className={styles.tr}>
                            <td className={styles.name_td}><p className={styles.p_Tag}>토요일 운영 시간</p></td>
                            <td className={styles.data_Td}>{convenInfo.coSatHour}</td>
                            <td className={styles.name_td}><p className={styles.p_Tag}>일요일 운영 시간</p></td>
                            <td className={styles.data_Td}>{convenInfo.coSunHour}</td>
                        </tr>
                        <tr className={styles.tr}>
                            <td className={styles.name_td}><p className={styles.p_Tag}>운영 시간</p></td>
                            <td className={styles.data_Td}>{convenInfo.coHour}</td>
                            <td className={styles.name_td}><p className={styles.p_Tag}>사이트 바로가기</p></td>
                            <td className={styles.data_Td}><a href={convenInfo.coWebsite}>바로가기</a></td>
                        </tr>
                        <tr className={styles.Address_Tr}>
                            <td className={styles.name_td}><p className={styles.p_Tag}>주소</p></td>
                            <td className={styles.data_Td} colSpan="3">{convenInfo.coAddress}</td>
                        </tr>
                    </tbody>
                </table>
                <div className={styles.buttonContainer}>
                    <Link to="/co" className={styles.linkButton}>목록</Link>
                </div>
            </div>
        </div>
    );
};

export default CoInfoView;
