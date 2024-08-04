import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import KakaoMap from "./KakaoMap";

import styles from "../css/abDetail.module.css";
import SubTitleAB from "./SubTitles/SubTitleAB";

export default function ABDetail() {
  const { abid } = useParams();
  const [abDetail, setAbDetail] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await axios.get(`https://dolbosigae.site/ab/detail/${abid}`);
        console.log(response);
        setAbDetail(response.data);
      } catch (error) {
        console.error("There was an error fetching the detail!", error);
      }
    };
    fetchDetail();
  }, [abid]);

  const location = {
    name: abDetail.abstatus, // 지역명 사용
    lat: parseFloat(abDetail.ablati), // 위도
    lng: parseFloat(abDetail.ablong)  // 경도
  };

  return (
    <div>
      <SubTitleAB />
      <div className={styles.container}>
        <div className={styles.mediaRow}>
          <img src={abDetail.abimg} className={styles.image} />
          {SubTitleAB.ablati === 0 ? (
            <div className={styles.noMapMessage}>지도가 제공되지 않습니다</div>
          ) : (
            <KakaoMap locations={[location]} className={styles.map} />
          )}
        </div>
        {abDetail ? (
          <table className={styles.table}>
            <tbody>
              <tr>
                <th className={styles.th}>출생년</th>
                <td className={styles.td}>{abDetail.abage}</td>
                <th className={styles.th}>견종</th>
                <td className={styles.td}>{abDetail.abbreed}</td>
              </tr>
              <tr>
                <th className={styles.th}>특징</th>
                <td className={styles.td}>{abDetail.abcharacter}</td>
                <th className={styles.th}>색깔</th>
                <td className={styles.td}>{abDetail.abcolor}</td>
              </tr>
              <tr>
                <th className={styles.th}>성별</th>
                <td className={styles.td}>{abDetail.abgender}</td>
                <th className={styles.th}>구조시간</th>
                <td className={styles.td}>{abDetail.abdate}</td>
              </tr>
              <tr>
                <th className={styles.th}>구조장소</th>
                <td className={styles.td}>{abDetail.ablocation}</td>
                <th className={styles.th}>보호센터</th>
                <td className={styles.td}>
                  {abDetail.shname}
                  {abDetail.shid != null && (
                    <Link to={`/shelter/detail/${abDetail.shid}`} className={styles.link}>보호센터 바로가기</Link>
                  )}
                </td>
              </tr>
              <tr>
                <th className={styles.th}>보호센터 운영시간</th>
                <td className={styles.td}>{abDetail.shhour}</td>
                <th className={styles.th}>보호센터 연락처</th>
                <td className={styles.td}>{abDetail.shtel}</td>
              </tr>
              <tr>
                <th className={styles.th}>보호상태</th>
                <td className={styles.td}>{abDetail.abstatus}</td>
                <th className={styles.th}>몸무게</th>
                <td className={styles.td}>{abDetail.abweight}kg</td>
              </tr>
            </tbody>
          </table>
        ) : (
          <div className={styles.noDataMessage}>해당 데이터가 없습니다.</div>
        )}
        <button onClick={() => navigate(-1)} className={styles.button}>뒤로가기</button>
      </div>
    </div>
  );
}