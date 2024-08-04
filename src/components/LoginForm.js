import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from '../css/loginForm.module.css';

export default function LoginForm({ onLoginSuccess }) {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('https://dolbosigae.site/login', { id, pass: password }, { withCredentials: true });
      console.log('로그인 응답:', response.data);

      if (response.data.success) {
        const userInfo = response.data.user; // 서버 응답에서 user 정보를 가져옴
        localStorage.setItem('user', JSON.stringify(userInfo)); // 로컬 스토리지에 사용자 정보 저장
        onLoginSuccess(userInfo); // 로그인 성공 시 상위 컴포넌트의 상태 업데이트
        navigate('/');
      } else {
        alert('로그인에 실패하였습니다.');
      }
    } catch (error) {
      alert('로그인에 실패하였습니다.');
      console.error('로그인 에러:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className={styles.container}>
        <h2>회원 로그인</h2>
        <div className={styles.inputs}>
          <input
            type="text"
            placeholder="아이디 입력"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="비밀번호 입력"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">로그인</button>
          <div className={styles.mini_menu}>
            <a onClick={() => navigate('/member/register')}>회원가입</a>
            <span> │ </span>
            <a onClick={() => navigate('/login/passwd')}>비밀번호 찾기</a>
          </div>
        </div>
      </form>
    </div>
  );
}