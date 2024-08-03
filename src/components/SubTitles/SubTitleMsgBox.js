import React from 'react';
import logo_white from '../../css/poci_img/logo_white.png';
import styles from '../../css/subtitles/subTitleWhite.module.css';

const SubTitleMsgBox = () => {
  return (
    <div className={styles.sub_title_container}>
      <h2 className={styles.sub_title}>쪽지함</h2>
      <img src={logo_white} alt="logo_white" className={styles.logo_white} />
    </div>
  );
};

export default SubTitleMsgBox;
