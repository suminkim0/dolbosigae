import React from 'react';
import logo_white from '../../img/logo_white.png';
import styles from '../../css/subtitles/subTitleWhite.module.css';

const SubTitleBoard = () => {
  return (
    <div className={styles.sub_title_container}>
      <h2 className={styles.sub_title}>자랑 게시판</h2>
      <img src={logo_white} alt="logo_white" className={styles.logo_white} />
    </div>
  );
};

export default SubTitleBoard;
