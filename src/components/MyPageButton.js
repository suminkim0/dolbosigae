import { Link } from 'react-router-dom';
import styles from '../css/myPageButton.module.css';

export default function MyPageButton({ onUpdateClick, isPasswordMatched }) {

  const handleClick = () => {
    if (!isPasswordMatched) {
      alert('비밀번호를 확인해주세요.');
      return;
    }
    onUpdateClick();
  };

  return (
    <div className={styles.Container}>
      <button 
        className={styles.Update} 
        onClick={handleClick}
      >
        수정
      </button>
      <Link to="/">
        <button className={styles.cancel}>취소</button>
      </Link>
    </div>
  );
}
