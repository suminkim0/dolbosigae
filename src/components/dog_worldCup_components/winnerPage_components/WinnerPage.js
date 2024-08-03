import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './css/winnerPage.module.css';

//우승 횟수 추가시키는 함수
const WinnerPage = () => {
    const { dogId } = useParams();
    const [winnerDog, setWinnerDog] = useState(null);
    const [allRanking, setAllRanking] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchWinDogCount = async () => {
            try {
                const response = await axios.post(`http://localhost:9999/winCount?dogId=${dogId}`);
                console.log("우승횟수 백엔드로 전송:", response.data);

            } catch (error) {
                console.error('Error sending win count:', error);
            }
        }
        fetchWinDogCount();
    }, [dogId]);

    //우승한 강아지 사진 가져오는 함수
    useEffect(() => {
        const fetchWinnerDog = async () => {
            try {
                console.log(`${dogId}`)
                const response = await axios.get('http://localhost:9999/winnerDog', {
                    params: {
                        dogId: dogId
                    }
                });
                console.log(response.data);
                setWinnerDog(response.data);
            } catch (error) {
                console.error('Error fetching winner dog:', error);
            }
        };
        fetchWinnerDog();
    }, [dogId]);

    //전체 랭킹 가져오는 함수
    useEffect(() => {
        const AllRanking = async () => {
            try {
                const response = await axios.get('http://localhost:9999/AllRanking');
                setAllRanking(response.data);
                console.log(response.data);
            } catch (error) {
                console.log(error)
            }
        }
        AllRanking();
    }, []);

    const goToBack = () => {
        navigate('/dwc');
    }

    if (!winnerDog) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.winner_container}>
            <div className={styles.winner_main_container}>
                <div className={styles.winner_dog_container}>
                    <h2 className={styles.dwcp_title}>개상형 월드컵 우승</h2>
                    <img className={styles.winner_img} src={winnerDog.dogImg} alt={`dog-${winnerDog.dogId}`} />
                    <div className={styles.winner_info}>
                        <p className={styles.winner_pTag}>이름 : {winnerDog.dogTypeName}</p>
                        <p className={styles.winner_pTag}>내용 : {winnerDog.dogTypeInfo}</p>
                        <p className={styles.winner_pTag}>우승 횟수 : {winnerDog.dogRanking}</p>
                    </div>
                    <div className={styles.winner_button}>
                        <button className={styles.winner_back} onClick={goToBack}>돌아가기</button>
                    </div>
                </div>
            </div>
            <div className={styles.ranking_community_container}>
                <h2 className={styles.ranking_title}>Top 10 랭킹</h2>
                <table className={styles.ranking_topTen_table}>
                    <thead>
                        <tr className={styles.ranking_tr}>
                            <th className={styles.ranking_th_number}>순위</th>
                            <th className={styles.ranking_th_img}>이미지</th>
                            <th className={styles.ranking_th_name}>이름</th>
                            <th className={styles.ranking_th}>설명</th>
                            <th className={styles.ranking_th_rank}>우승 횟수</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allRanking.map((rank, index) => (
                            <tr key={index} className={styles.ranking_item}>
                                <td className={styles.ranking_number}>{index + 1}</td>
                                <td><img className={styles.ranking_img} src={rank.dogImg} alt={`dog-${rank.dogId}`} /></td>
                                <td className={styles.ranking_typeName}>{rank.dogTypeName}</td>
                                <td className={styles.ranking_typeInfo}>{rank.dogTypeInfo}</td>
                                <td className={styles.ranking_rank}>{rank.dogRanking}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div >
    );
};

export default WinnerPage;
