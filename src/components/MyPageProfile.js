import styles from '../css/myPageProfile.module.css';
import { useEffect, useState } from 'react';
import default_img from '../img/default_img.png';

export default function MyPageProfile({ member, onMemberChange }) {
  const [userId, setUserId] = useState(null); // 사용자 ID 상태 추가

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserId(user.boardMemberId); // 사용자 ID 설정
    } else {
      console.error('사용자 정보를 찾을 수 없습니다.');
    }
  }, []);

  const toggleProfileVisibility = () => {
    if (member) {
      const updatedMember = {
        ...member,
        petWalkProfile: member.petWalkProfile === 'T' ? 'F' : 'T'
      };
      onMemberChange(updatedMember); // 상태값 변경을 부모 컴포넌트로 전달
    }
  };

  return (
    <div className={styles.Container}>
      {!member ? (
        <div>데이터가 로딩 중입니다...</div>
      ) : (
        <ul>
          <li>
            <img src={member.petImagePath || default_img} alt="Pet" className={styles.pet_image} />
          </li>
          <li className={styles.toggleWrapper}>
            <div 
              className={`${styles.toggleSwitch} ${member.petWalkProfile === 'T' ? styles.on : styles.off}`} 
              onClick={toggleProfileVisibility}
            >
              <div className={styles.switchHandle}></div>
            </div>
            <span className={styles.toggleLabel}>
              산책 프로필을 {member.petWalkProfile === 'T' ? <span><span className={styles.bold}>노출</span>합니다</span> : <span><span className={styles.bold}>노출하지 않</span>습니다</span>}
            </span>
          </li>
        </ul>
      )}
    </div>
  );
}
