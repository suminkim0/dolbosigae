import { useRef, useState } from "react";
import SubTitleLoginPasswd from "./SubTitles/SubTitleLoginPasswd";
import axios from 'axios';
import styles from '../css/loginPasswd.module.css';

export default function LoginPasswd() {
  const txtId = useRef();
  const txtName = useRef();
  const newPassword = useRef();
  const confirmPassword = useRef();
  const [idCheck, setIdCheck] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const checkId = async () => {
    const idValue = txtId.current.value;
    const nameValue = txtName.current.value;
    try {
      const response = await axios.post(`http://13.124.183.147:59879/member/check/id`, {
        idValue: idValue,
        nameValue: nameValue
      });
      console.log(response.data);
      if (response.data === 0) {
        alert('해당 아이디가 없거나 이름이 일치하지 않습니다.\n회원가입 페이지로 이동합니다.');
        window.location.href = '/member/register';
      } else {
        console.log('아이디가 존재합니다.');
        setIdCheck(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChangePassword = async () => {
    const newPass = newPassword.current.value;
    const confirmPass = confirmPassword.current.value;

    if (newPass !== confirmPass) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const idValue = txtId.current.value;
      const response = await axios.post(`http://13.124.183.147:59879/find/passwd`, {
        id: idValue,
        passwd: newPass
      });

      if (response.status === 200) {
        alert("비밀번호가 성공적으로 변경되었습니다.\n로그인 페이지로 이동합니다.");
        window.location.href = '/login';
      }
    } catch (error) {
      console.error("비밀번호 변경 에러 발생", error);
      alert("비밀번호 변경 중 오류가 발생했습니다.");
    }
  };

  return(
    <div>
      <SubTitleLoginPasswd />
      <div className={styles.bodyContainer}>
        <div className={styles.container}>
          <input type="text" name="boardMemberId" ref={txtId} required placeholder="아이디 입력"/>
          <input type="text" name="boardMemberName" ref={txtName} required placeholder="회원 이름 입력" />
          <button type="button" onClick={checkId}>아이디 확인</button>
          {errorMessage && <p style={{color: 'red'}}>{errorMessage}</p>}
          {idCheck && (
            <>
              <br/>
              <p>새로 설정할 비밀번호를 입력해주세요</p>
              <input type="password" name="newPassword" ref={newPassword} required />
              <p>비밀번호를 한번 더 입력해주세요</p>
              <input type="password" name="confirmPassword" ref={confirmPassword} required /><br/>
              <button type="button" onClick={handleChangePassword}>비밀번호 변경하기</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}