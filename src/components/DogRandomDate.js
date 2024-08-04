import SubTitleDogRandomDate from "./SubTitles/SubTitleDogRandomDate";
import styles from '../css/dogRandomDate.module.css';
import logo_small from '../img/logo_small.png';
import speech_bubble from '../img/speech_bubble.png';
import { useRef, useState } from "react";
import axios from 'axios';
import defaultImgYellow from '../img/default_img_yellow.png';

export default function DogRandomDate() {
  const formRef = useRef();
  const [randomDog, setRandomDog] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(formRef.current);
    const data = Object.fromEntries(formData.entries());

    const jsonData = {
      petSize: data.petSize,
      petBirth: data.petBirth,
      petGender: data.petGender
    };

    try {
      const response = await axios.post('https://dolbosigae.site/dog/random/date', jsonData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.length === 0) {
        alert('해당하는 강아지가 없습니다.\n 다른 조건을 선택해주세요.');
      } else {
        const randomIndex = Math.floor(Math.random() * response.data.length);
        setRandomDog(response.data[randomIndex]);
      }

    } catch (error) {
      console.error('댕개팅 에러 발생', error);
      alert('정보 조회 중 오류가 발생했습니다.');
    }
  }

  const getPetGender = (gender) => {
    switch (gender) {
      case 'F':
        return '여아';
      case 'M':
        return '남아';
      case 'G':
        return '중성화';
      default:
        return '';
    }
  }

  // 팝업 창으로 쪽지 보내기 페이지를 여는 함수
  const handleSendMsg = () => {
    if (randomDog && randomDog.boardMemberId) {
      const popupUrl = `/mate/sendMsg?receiverId=${randomDog.boardMemberId}`;
      const popupFeatures = 'width=600,height=600,scrollbars=yes';
      window.open(popupUrl, '_blank', popupFeatures);
    }
  }

  return (
    <div className={styles.container}>
      <SubTitleDogRandomDate />
      <div className={styles.subContainer}>
        <div className={styles.sentence}>
          <img src={logo_small} alt="logo_small" className={styles.logo_small} />
          <div className={styles.sentenceSub}>
            <span style={{fontSize: '18px'}}>견주님의 강아지와 잘 어울릴 댕친구를 찾아보세요🐶</span>
            <span style={{fontSize: '14px', color: '#929292'}}>* 산책 프로필 노출을 선택한 강아지만 보실 수 있습니다.</span>
          </div>
        </div>
        <form ref={formRef} onSubmit={handleSubmit}>
          <table className={styles.table}>
            <tr>
              <th className={styles.tableHeader}>크기</th>
              <td className={styles.tableCell}>
                <select name="petSize" className={styles.select}>
                  <option value="n">==선택안함==</option>
                  <option value="소형견">소형견</option>
                  <option value="중형견">중형견</option>
                  <option value="대형견">대형견</option>
                </select>
              </td>
              <th className={styles.tableHeader}>나이</th>
              <td className={styles.tableCell}>
                <select name="petBirth" className={styles.select}>
                  <option value="n">==선택안함==</option>
                  <option value="1살이하">1살이하</option>
                  <option value="2~4살">2~4살</option>
                  <option value="5~7살">5~7살</option>
                  <option value="8~10살">8~10살</option>
                  <option value="11살이상">11살이상</option>
                </select>
              </td>
              <th className={styles.tableHeader}>성별</th>
              <td className={styles.tableCell}>
                <select name="petGender" className={styles.select}>
                  <option value="n">==선택안함==</option>
                  <option value="M">남아</option>
                  <option value="F">여아</option>
                  <option value="G">중성화</option>
                </select>
              </td>
              <td className={styles.tableCell}>
                <button type="submit" className={styles.submitButton}>강아지 찾기</button>
              </td>
            </tr>
          </table>
        </form>
        {randomDog && (
          <div className={styles.randomDogContainer}>
            <div className={styles.imgBox}>
              <div className={styles.speechBox}>
                <p>"저랑 산책 한 번 어때요?"</p>
                <img src={speech_bubble} />
              </div>
              <img src={randomDog.petImagePath || defaultImgYellow} className={styles.randomDogImage} />
            </div>
            <p className={styles.randomDogText}>{randomDog.boardMemberNick}</p>
            <p className={styles.randomDogText}>
              {randomDog.petBirth} / {getPetGender(randomDog.petGender)} / {randomDog.petSize} / {randomDog.petWeight}kg
            </p>
            <p className={styles.randomDogText}>{randomDog.petInfo}</p>
            <button className={styles.messageButton} onClick={handleSendMsg}>쪽지 보내기</button> {/* 수정된 부분 */}
          </div>
        )}
      </div>
    </div>
  );
}
