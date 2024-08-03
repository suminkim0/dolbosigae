import React from "react";
import SubTitleLogin from "./SubTitles/SubTitleLogin";
import LoginForm from "./LoginForm";
import styles from '../css/login.module.css';

export default function Login({ onLoginSuccess }) {
  return (
    <div>
      <SubTitleLogin />
      <div className={styles.sub_container}>
        <LoginForm onLoginSuccess={onLoginSuccess} />
      </div>
    </div>
  );
}