import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import SubTitleShelter from "./SubTitles/SubTitleShelter";
import KakaoMap from "./KakaoMap";
import styles from '../css/shelterDetail.module.css';

export default function ShelterDetail() {
  const { shelterId } = useParams();
  const [shelterDetail, setShelterDetail] = useState([]);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await axios.get(`https://dolbosigae.site/shelter/detail/${shelterId}`);
        console.log(response);
        setShelterDetail(response.data);
      } catch (error) {
        console.error("There was an error fetching the detail!", error);
      }
    };
    fetchDetail();
  }, [shelterId]);

  const location = {
    name: shelterDetail.shelterName, // 센터명 사용
    lat: parseFloat(shelterDetail.shelterLatitude), // 위도
    lng: parseFloat(shelterDetail.shelterLongitude)  // 경도
  };

  return (
    <div>
      <SubTitleShelter />
      <div className={styles.container}>
        {shelterDetail.shelterLatitude === 0 ? (
          <div className={styles.noMapMessage}>지도가 제공되지 않습니다</div>
        ) : (
          <KakaoMap locations={[location]} />
        )}
        {shelterDetail ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>지역</th>
                <th>이름</th>
                <th>주소</th>
                <th>전화번호</th>
                <th>운영시간</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{shelterDetail.shelterRegion}</td>
                <td>{shelterDetail.shelterName}</td>
                <td>{shelterDetail.shelterAddress}</td>
                <td>{shelterDetail.shelterTel}</td>
                <td>{shelterDetail.shelterHour}</td>
              </tr>
            </tbody>
          </table>
        ) : (
          <div>해당 데이터가 없습니다.</div>
        )}
        <Link to='/shelter' className={styles.link}>글 목록</Link>
      </div>
    </div>
  );
}
