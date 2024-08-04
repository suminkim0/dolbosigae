import React, { useEffect, useState } from 'react';
import styles from '../css/homeAdmin.module.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import adminImg from '../img/admin_img.png';

export default function HomeAdmin() {
  const [adminBoardList, setAdminBoardList] = useState([]);

  useEffect(()=>{
    const fetchData = async() => {
      try{
        const response = await axios.get('https://dolbosigae.site/admin/contact');
        setAdminBoardList(response.data.admin);
      } catch(error){
        console.error("문의글 목록을 불러오는 중 에러 발생", error);
      }
    };
    fetchData();
  }, []);

  //최신 3개 글만 가져오도록 지정
  const latestAdminBoardList = adminBoardList.slice(0, 5);

  return(
    <div className={styles.homeAdminContainer}>
      <div className={styles.oftenAdmin}>
        <div className={styles.oftenAdminTitle}>
          <h3>자주 묻는 질문</h3>
          <Link to='/admin/contact'>
            <button>더보기</button>
          </Link>
        </div>
        <ul>
          <li><a href='/admin/contact'>비밀번호를 잊어버렸어요.</a></li>
          <li><a href='/admin/contact'>반려견이 없다면 이용할 수 없나요?</a></li>
          <li><a href='/admin/contact'>유기동물 게시글을 업로드하고 싶어요.</a></li>
        </ul>
      </div>
      <div className={styles.latestAdmin}>
        <div className={styles.latestAdminTitle}>
          <h3>최근 게시된 질문</h3>
          <Link to='/admin/contact'>
            <button>더보기</button>
          </Link>
        </div>
        {latestAdminBoardList.map((item, index) => (
          <React.Fragment key={index}>
            <ul>
              <li className={styles.ellipsis}>{item.adminTitle}</li>
              <li className={styles.ellipsis} style={{color:'#BEB4B4'}}>게시일 : {item.adminDate}</li>
            </ul>
          </React.Fragment>
        ))}
      </div>
      <div className={styles.imgBox}>
        <img src={adminImg} />
        <Link to='/admin/contact'>
          <button>바로가기</button>
        </Link>
      </div>
    </div>
  );
}