import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import SubTitleDogWorldCup from "../SubTitles/SubTitleDogWorldCup";
import styles from './css/dogWorldCup.module.css';

const DogWorldCup = () => {
    const [hiddenText, setHiddenText] = useState('');
    const [dogs, setDogs] = useState([]);
    const roundNumbers = [4, 16, 32, 64];

    useEffect(() => {
        const fetchRandomDog = async () => {
            try {
                const response = await axios.get('https://dolbosigae.site/RandomDog');
                const shuffledDogs = response.data.sort(() => Math.random() - 0.5).slice(0, 4);
                setDogs(shuffledDogs);
            } catch (error) {
                console.error(error);
            }
        };
        fetchRandomDog();
    }, []);

    const dwcExplanation = (round) => {
        let text;
        switch (round) {
            case 4:
                text = "등록된 강아지 중 4마리가 대결합니다.";
                break;
            case 16:
                text = "등록된 강아지 중 16마리가 대결합니다.";
                break;
            case 32:
                text = "등록된 강아지 중 32마리가 대결합니다.";
                break;
            case 64:
                text = "등록된 강아지 중 64마리가 대결합니다.";
                break;
            default:
                text = "";
        };
        setHiddenText(text);
    }

    const dwcMouseLeave = () => {
        setHiddenText('');
    };

    return (
        <div>
            <SubTitleDogWorldCup />
            <div className={styles.dwc_explanation_container}>
                <p className={styles.dwc_explanation}>※ 라운드를 선택해주세요!! ※</p>
            </div>
            <div className={styles.dwc_main_container}>
            <div className={styles.dwc_img_container}>
                {dogs.map((dog, index) => (
                    <div key={index} className={styles.dwc_img_button_container}>
                        <img src={dog.dogImg} alt={`dog-${dog.dogId}`} className={styles.dwc_image} />
                        <Link className={styles.dwc_link}
                            to={`/dwc/round/${roundNumbers[index]}`}
                            onMouseEnter={() => dwcExplanation(roundNumbers[index])}
                            onMouseLeave={dwcMouseLeave}
                        >
                            <label className={styles.dwc_label}>{roundNumbers[index]}강</label>
                        </Link>
                    </div>
                ))}
            </div>
            <div className={styles.dwc_info}>
                {hiddenText && <p className={styles.hiddenText}>{hiddenText}</p>}
            </div>
            <hr className={styles.dwc_hr} />
            </div>
        </div>
    )
}

export default DogWorldCup;
