import styles from '../css/footer.module.css';

export default function Footer() {

  return(
    <div>
      <br/>
      <hr className={styles.footerBorder}/>
      <div className={styles.footerSubContainer}>
        <span className={styles.khFinal1}>KH Final Project</span>
        <div className={styles.khFinal2}>
          <span>작업기간</span>
          <span>2024.07-08 ~ 2024.08.04</span>
        </div>
      </div>
    </div>
  );
}