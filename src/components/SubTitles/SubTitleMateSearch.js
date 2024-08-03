import React from 'react';
import logo_white from '../../css/poci_img/logo_white.png';
import styles from '../../css/subtitles/subTitleWhite.module.css';

const SubTitleMateSearch = () => {
  return (
    <div className={styles.sub_title_container}>
      <h2 className={styles.sub_title}>산책친구 찾기</h2>
      <img src={logo_white} alt="logo_white" className={styles.logo_white} />
    </div>
  );
};

export default SubTitleMateSearch;
