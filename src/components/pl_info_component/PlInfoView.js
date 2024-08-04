import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './../pl_info_component/css/plInfoView.module.css';
import { Link } from 'react-router-dom';
import SubTitlePL from '../SubTitles/SubTitlePL';

const PlInfoView = () => {
    const { plId } = useParams();
    const [placeInfo, setPlaceInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPlaceInfo = async () => {
            try {
                const response = await fetch(`https://dolbosigae.site/city/info?plId=${plId}`);
                if (!response.ok) {
                    throw new Error('데이터를 가져오는데 실패하였습니다.');
                }
                const data = await response.json();
                setPlaceInfo(data); // 받은 데이터를 상태에 저장
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
                console.error('Error fetching place info:', error);
            }
        };

        fetchPlaceInfo();
    }, [plId]);

    if (loading) {
        return <div>Loading...</div>; // 데이터를 기다리는 동안 로딩 표시
    }

    if (error) {
        return <div>Error: {error.message}</div>; // 에러가 발생했을 때 에러 메시지 표시
    }

    return (
        <div>
            <div className={styles.SubTitlePL_container}>
                <SubTitlePL />
            </div>
            <div className={styles.main_container}>
                <div className={styles.pl_img_container}>
                    <img className={styles.info_Img} src={placeInfo.plImg} />
                </div>
                <table className={styles.pl_table}>
                    <tbody>
                        <tr className={styles.tr}>
                            <td className={styles.name_td}><p className={styles.p_Tag}>공원명</p></td>
                            <td className={styles.data_Td}>{placeInfo.plName}</td>
                            <td className={styles.name_td}><p className={styles.p_Tag}>대표 전화번호</p></td>
                            <td className={styles.data_Td}>{placeInfo.plTel}</td>
                        </tr>
                        <tr className={styles.tr}>
                            <td className={styles.name_td}><p className={styles.p_Tag}>위치</p></td>
                            <td className={styles.data_Td}>{placeInfo.plCity}</td>
                            <td className={styles.name_td}><p className={styles.p_Tag}>입장료</p></td>
                            <td className={styles.data_Td}>{placeInfo.plExpense}</td>
                        </tr>
                        <tr className={styles.Address_Tr}>
                            <td className={styles.name_td}><p className={styles.p_Tag}>주소</p></td>
                            <td className={styles.data_Td} colSpan="4">{placeInfo.plAddress}</td>
                        </tr>
                        <tr className={styles.tr}>
                            <td className={styles.name_td}><p className={styles.p_Tag}>운영 요일</p></td>
                            <td className={styles.data_Td}>{placeInfo.plDay}</td>
                            <td className={styles.name_td}><p className={styles.p_Tag}>운영 시간</p></td>
                            <td className={styles.data_Td}>{placeInfo.plHour}</td>
                        </tr>
                        <tr className={styles.tr}>
                            <td className={styles.name_td}><p className={styles.p_Tag}>면적</p></td>
                            <td className={styles.data_Td} colSpan="4">{placeInfo.plArea}</td>
                        </tr>
                    </tbody>
                </table>
                <div className={styles.buttonContainer}>
                    <Link to="/pl" className={styles.linkButton}>목록</Link>
                </div>
            </div>
        </div>
    );
};

export default PlInfoView;
