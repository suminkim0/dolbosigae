import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './css/dogWorldCupPage.module.css';

// 강아지 정보 띄워주는 함수
const DogCard = ({ dog, onClick }) => (
    <div className={styles.dwcp_choose_container}>
        <div className={styles.dwcp_choose_image}>
            <img className={styles.dwcp_choose_img} src={dog.dogImg} alt={`dog-${dog.dogId}`} />
        </div>
        <div className={styles.dwcp_choose_text}>
            <p className={styles.dwcp_choose_infoText}>{dog.dogTypeInfo}</p>
        </div>
        <div onClick={onClick} className={styles.dwcp_choose_btn}>
            <button className={styles.dwcp_choose_button}>선택</button>
        </div>
    </div>
);

const DogWorldCupPage = () => {
    const { round } = useParams();
    const [dogs, setDogs] = useState([]);
    const [displays, setDisplays] = useState([]);
    const [winners, setWinners] = useState([]);
    const [currentTurn, setCurrentTurn] = useState(1);
    const [displayRound, setDisplayRound] = useState(parseInt(round) / 2);
    const navigate = useNavigate();

    // 백엔드 호출해서 모든 데이터 중의 roundNumber 개의 데이터만 받아오는 함수
    useEffect(() => {
        const fetchRandomDog = async () => {
            try {
                const response = await axios.get('https://dolbosigae.site/RandomDog');
                const dogsResult = response.data;
                const shuffledDogs = dogsResult.sort(() => Math.random() - 0.5).slice(0, parseInt(round));
                setDogs(shuffledDogs);
                setDisplays([shuffledDogs[0], shuffledDogs[1]]);
                console.log('Dogs fetched and shuffled:', shuffledDogs);
            } catch (error) {
                console.error('Error fetching random dogs:', error);
            }
        };
        fetchRandomDog();
    }, [round]);

    // 선택 버튼 눌렀을 때 선택된 강아지 뽑아오는 함수
    const chooseDog = useCallback(selectedDog => {
        console.log('Dog chosen:', selectedDog);
        setWinners(prevWinners => [...prevWinners, selectedDog]);
        setDogs(prevDogs => prevDogs.slice(2));
        setCurrentTurn(prevTurn => prevTurn + 1);
    }, []);

    // 상태가 변경될 때마다 처리
    useEffect(() => {
        if (dogs.length === 0 && winners.length > 0) {
            if (winners.length === 1) {
                navigate(`/wp/${winners[0].dogId}`);
            } else {
                setDogs(winners);
                setWinners([]);
                setCurrentTurn(1);
                setDisplayRound(prev => prev / 2);
            }
        } else if (dogs.length > 0) {
            setDisplays([dogs[0], dogs[1]]);
        }
    }, [dogs, winners, navigate]);

    return (
        <div className={styles.dwcp_main_container}>
            <div className={styles.dwcp_info}>
                <p className={styles.dwcp_pTag}>마음에 드는 강아지를 선택해주세요!</p>
            </div>
            <div className={styles.dwcp_allInfo}>
                <div className={styles.dwcp_title_container}>
                    <h2 className={styles.dwcp_title}>[{round}강] 개상형 월드컵</h2>
                    <h2 className={styles.dwcp_Round}>현재 진행중인 <span className={styles.dwcp_RoundSpan}>라운드 {currentTurn} / {displayRound}</span></h2>
                </div>
                <div className={styles.dwcp_dogInfo}>
                    {displays.map((dog, index) => (
                        <DogCard key={index} dog={dog} onClick={() => chooseDog(dog)} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DogWorldCupPage;
