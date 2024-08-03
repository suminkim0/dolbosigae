import styles from './../css/homeMainImg.module.css';
import React, { useState, useEffect } from "react";

import adopt from '../img/adopt.png';
import amenities from '../img/amenities.png';
import fun from '../img/fun.png';
import animal_shelter from '../img/animal_shelter.png';
import hospital from '../img/hospital.png';
import message from '../img/message.png';
import { Link } from 'react-router-dom';

export default function HomeMainImg() {
  
  const [slideIndex, setSlideIndex] = useState(0);
  const slides = [
    `${process.env.PUBLIC_URL}/img/main1.jpg`,
    `${process.env.PUBLIC_URL}/img/main2.jpg`,
    `${process.env.PUBLIC_URL}/img/main3.jpg`,
    `${process.env.PUBLIC_URL}/img/main4.jpg`,
    `${process.env.PUBLIC_URL}/img/main5.jpg`,
    `${process.env.PUBLIC_URL}/img/main6.jpg`,
    `${process.env.PUBLIC_URL}/img/main7.jpg`,
    `${process.env.PUBLIC_URL}/img/main8.jpg`,
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex(prevIndex => (prevIndex + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className={styles.container}>
      <div className={styles.whiteBox}></div>
      <div className={styles.imgContainer}>
        {slides.map((slide, index) => (
        <img
        key={index}
        className={`${styles.mySlides} ${index === slideIndex ? styles.active : ''}`}
        src={slide}
        alt={`Slide ${index + 1}`}
        />
        ))}
      </div>
      <div className={styles.btnContainer}>
        <Link to='/mate/msg' className={styles.miniBtn}>
          <div className={styles.circle}>
            <img src={message} alt="message" className={styles.icon} />
          </div>
          <label className={styles.btnName}>받은 쪽지함</label>
        </Link>
        <Link to='/animal-medical' className={styles.miniBtn}>
          <div className={styles.circle}>
            <img src={hospital} alt="hospital" className={styles.icon} />
          </div>
          <label className={styles.btnName}>동물병원 찾기</label>
        </Link>
        <Link to='/shelter' className={styles.miniBtn}>
          <div className={styles.circle}>
            <img src={animal_shelter} alt="animal_shelter" className={styles.icon} />
          </div>
          <label className={styles.btnName}>보호센터 찾기</label>
        </Link>
        <Link to='/ab' className={styles.miniBtn}>
          <div className={styles.circle}>
            <img src={adopt} alt="adopt" className={styles.icon} />
          </div>
          <label className={styles.btnName}>유기견 보호현황</label>
        </Link>
        <Link to='/pl' className={styles.miniBtn}>
          <div className={styles.circle}>
            <img src={fun} alt="fun" className={styles.icon} />
          </div>
          <label className={styles.btnName}>놀이시설 찾기</label>
        </Link>
        <Link to='/co' className={styles.miniBtn}>
          <div className={styles.circle}>
            <img src={amenities} alt="amenities" className={styles.icon} />
          </div>
          <label className={styles.btnName}>편의시설 찾기</label>
        </Link>
      </div>
    </div>
  );
}