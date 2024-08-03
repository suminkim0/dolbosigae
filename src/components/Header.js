import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link, useLocation } from "react-router-dom";
import styles from '../css/header.module.css';
import logo from '../img/logo.png';
import login from '../img/login.png';
import register from '../img/register.png';
import memberView from '../img/memberView.png';
import my_page from '../img/my_page.png';
import { useState, useEffect } from 'react';

export default function Header({ isLoggedIn, onLogout }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [visibleSubmenu, setVisibleSubmenu] = useState(null);
  let timeout;
  const location = useLocation();
  const [isPetInfo, setIsPetInfo] = useState(false);
  const [sendMsg, setSendMsg] = useState(false);
  const [chatIntro, setChatIntro] = useState(false);
  const [mateFav, setMateFav] = useState(false);

  useEffect(() => {
    setIsPetInfo(location.pathname === '/mate/petinfo'); // 특정 경로 설정해서 header 안보이게 하는 부분
    setSendMsg(location.pathname === '/mate/sendMsg');
    setChatIntro(location.pathname === '/mate/intro');
    setMateFav(location.pathname === '/mate/fav'); 

    if (isLoggedIn) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        console.log('저장된 사용자 정보:', parsedUser);
        setUser(parsedUser);
      }
    } else {
      setUser(null);
    }
  }, [location.pathname, isLoggedIn]);

  const handleLogout = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.get('http://localhost:9999/logout', { withCredentials: true });
      if (response.data === 'success') {
        localStorage.removeItem('user'); // 로컬 스토리지에서 사용자 정보 삭제
        onLogout(); // 상위 컴포넌트의 상태 업데이트
        navigate('/'); // 홈 페이지로 이동
      } else {
        alert('로그아웃에 실패하였습니다.');
      }
    } catch (error) {
      alert('로그아웃에 실패하였습니다.');
      console.error('Logout failed:', error);
    }
  }

  const handleMouseOver = (menu) => {
    clearTimeout(timeout);
    setVisibleSubmenu(menu);
  };

  const handleMouseOut = () => {
    timeout = setTimeout(() => {
      setVisibleSubmenu(null);
    }, 300); // 0.3초 후 서브메뉴 숨기기
  };

  // 특정 경로에서는 헤더를 렌더링하지 않음
  if (isPetInfo || sendMsg || chatIntro || mateFav) return null;  // 위에서 설정했던 특정 경로에서 헤더 숨기기

  return (
    <div className={styles.headerContainer}>
      <header className={styles.header}>
        <div className={styles.auth}>
          <ul>
            {isLoggedIn ? (
              <>
                <li className={styles.top_button}>
                  <Link to="/member/mypage" className={styles.authItem}>
                    <img src={my_page} alt="my_page" className={styles.my_page} />마이페이지
                  </Link>
                </li>
                {user && user.boardMemberGradeNo === 0 && (
                  <li className={styles.top_button}>
                    <Link to="/member/view" className={styles.authItem}>
                      <img src={memberView} alt="MemberView" className={styles.memberView} />회원관리
                    </Link>
                  </li>)}
                <li>
                  <button onClick={handleLogout} className={styles.authItem}>로그아웃</button>
                </li>
              </>
            ) : (
              <>
                <li className={styles.top_button}>
                  <Link to="/login" className={styles.authItem}>
                    <img src={login} alt="Login" className={styles.login} />로그인
                  </Link>
                </li>
                <li className={styles.top_button}>
                  <Link to="/member/register" className={styles.authItem}>
                    <img src={register} alt="Register" className={styles.register} />회원가입
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
        <nav className={styles.nav}>
          <ul className={styles.navList}>
            <li>
              <Link to="/">
                <img src={logo} alt="Logo" className={styles.logo} />
              </Link>
            </li>
            <li
              className={styles.navItem}
              onMouseOver={() => handleMouseOver('medical')}
              onMouseOut={handleMouseOut}>
              <Link className={styles.navLink}>동물 의료</Link>
              <ul className={`${styles.submenu} ${visibleSubmenu === 'medical' ? styles.visible : ''}`}>
                <li className={styles.navSublink}><Link to="/animal-medical">동물병원 찾기</Link></li>
                <li className={styles.navSublink}><Link to="/pharmacies">동물약국 찾기</Link></li>
              </ul>
            </li>
            <li
              className={styles.navItem}
              onMouseOver={() => handleMouseOver('play')}
              onMouseOut={handleMouseOut}>
              <Link className={styles.navLink}>놀이 · 편의</Link>
              <ul className={`${styles.submenu} ${visibleSubmenu === 'play' ? styles.visible : ''}`}>
                <li className={styles.navSublink}><Link to="/pl">놀이시설 찾기</Link></li>
                <li className={styles.navSublink}><Link to="/co">편의시설 찾기</Link></li>
              </ul>
            </li>

            <li
              className={styles.navItem}
              onMouseOver={() => handleMouseOver('community')}
              onMouseOut={handleMouseOut}>
              <Link className={styles.navLink}>커뮤니티</Link>
              <ul className={`${styles.submenu} ${visibleSubmenu === 'community' ? styles.visible : ''}`}>
                <li className={styles.navSublink}><Link to="/mate/msg">쪽지함</Link></li>
                <li className={styles.navSublink}><Link to="/mate/member">산책 친구 찾기</Link></li>
                <li className={styles.navSublink}><Link to="/dog/random/date">랜덤 댕개팅</Link></li>
                <li className={styles.navSublink}><Link to="/dwc">개상형 월드컵</Link></li>
                <li className={styles.navSublink}><Link to="/board">자랑 게시판</Link></li>
              </ul>
            </li>
            <li
              className={styles.navItem}
              onMouseOver={() => handleMouseOver('protection')}
              onMouseOut={handleMouseOut}>
              <Link className={styles.navLink}>동물보호</Link>
              <ul className={`${styles.submenu} ${visibleSubmenu === 'protection' ? styles.visible : ''}`}>
                <li className={styles.navSublink}><Link to="/shelter">동물보호센터 찾기</Link></li>
                <li className={styles.navSublink}><Link to="/ab">유기동물 보호현황</Link></li>
              </ul>
            </li>
            <li className={styles.navItem}><Link to="/admin/contact" className={styles.navLink}>관리자문의</Link></li>
          </ul>
        </nav>
      </header>
    </div>
  );
}