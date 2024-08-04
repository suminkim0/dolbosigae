import React, { useRef, useState } from 'react';
import styles from '../css/addPharmacy.module.css';
import logo_small from '../img/logo_small.png';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SubTitleAddPharmacy from './SubTitles/SubTitleAddPharmacy';

export default function AddPharmacy() {
  const formRef = useRef();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(formRef.current);
    const data = Object.fromEntries(formData.entries());

    const jsonData = {
      phId: data.phId,
      phRegion: data.phRegion,
      phAddress: data.phAddress,
      phName: data.phName,
      phTel: data.phTel,
      phHour: data.phHour,
      phLat: data.phLat,
      phLng: data.phLng
    };

    console.log("jsonData:", jsonData); // JSON 데이터가 올바른지 콘솔에 출력합니다.

    try {
      const response = await axios.post('https://dolbosigae.site/pharmacies', jsonData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        console.log(response.data);
        alert('약국 등록 성공');
        navigate('/'); // 추가 후 리디렉션
      } else {
        console.error('Unexpected response status:', response.status);
      }
    } catch (error) {
      console.error('약국 추가 중 에러 발생', error);
      alert('약국 추가 중 오류가 발생했습니다.');
    }
  };

  return (
    <div>
      <SubTitleAddPharmacy />
      <div className={styles.form_container}>
        <form ref={formRef} onSubmit={handleSubmit}>
        <table className={styles.form_table_00}>
            <tbody>
              <tr>
                <td><label>약국 ID *</label></td>
                <td><input type="text" name="phId" required /></td>
              </tr>
              <tr>
                <td><label>약국 지역 *</label></td>
                <td><input type="text" name="phRegion" required /></td>
              </tr>
              <tr>
                <td><label>약국 주소 *</label></td>
                <td><input type="text" name="phAddress" required /></td>
              </tr>
              <tr>
                <td><label>병원 이름 *</label></td>
                <td><input type="text" name="phName" required /></td>
              </tr>
              <tr>
                <td><label>전화번호 *</label></td>
                <td><input type="text" name="phTel" required /></td>
              </tr>
              <tr>
                <td><label>운영시간 *</label></td>
                <td><input type="text" name="phHour" required /></td>
              </tr>
              <tr>
                <td><label>위도 </label></td>
                <td><input type="number"  name="phLat"  /></td>
              </tr>
              <tr>
                <td><label>경도 </label></td>
                <td><input type="number"  name="phLng"  /></td>
              </tr>
            </tbody>
          </table>
          <div className={styles.checkbox_container_00}>
            <input type='checkbox' id='check' required />
            <label htmlFor='check'>정보 제공에 동의합니다.</label>
          </div>
          <div className={styles.form_buttons}>
            <button type="submit">약국 추가</button>
            <Link to="/">
              <button type="button">취소</button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
