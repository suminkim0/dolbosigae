import styles from '../css/myPageTable.module.css';
import { useEffect, useState } from 'react';

export default function MyPageTable({ member, onMemberChange, onPasswordMatchChange, hasPet }) {
  const [address, setAddress] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (address) {
      onMemberChange({
        ...member,
        boardMemberRegion: address
      });
    }
  }, [address]);

  const handleInputChange = (e, field) => {
    const value = e.target.value || '';
    onMemberChange({
      ...member,
      [field]: value
    });
    if (field === 'boardMemberPasswd') {
      onMemberChange({
        ...member,
        [field]: value,
        passwordChanged: true  // passwordChanged 값 설정
      });
      checkPasswordMatch(value, confirmPassword);
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    checkPasswordMatch(member.boardMemberPasswd, value);
  };

  const checkPasswordMatch = (password, confirmPassword) => {
    if (password !== confirmPassword) {
      setPasswordError('비밀번호가 일치하지 않습니다.');
      onPasswordMatchChange(false);
    } else {
      setPasswordError('');
      onPasswordMatchChange(true);
    }
  };

  const handleAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: function(data) {
        setAddress(data.address);
      }
    }).open();
  };

  return (
    <div className={styles.tableContainer}>
      {!member ? (
        <div>데이터가 로딩 중입니다...</div>
      ) : (
        <div>
          <table>
            <tbody>
              <tr>
                <td>회원이름</td>
                <td>
                  <input 
                    type="text" 
                    value={member.boardMemberName || ''} 
                    onChange={(e) => handleInputChange(e, 'boardMemberName')}
                  />
                </td>
              </tr>
              <tr>
                <td>아이디</td>
                <td>
                  <input 
                    type="text" 
                    value={member.boardMemberId || ''} 
                    readOnly
                  />
                </td>
              </tr>
                  {!hasPet && (
                    <tr>
                      <td>닉네임</td>
                      <td>
                        <input 
                          type="text" 
                          value={member.boardMemberNick || ''} 
                          onChange={(e) => handleInputChange(e, 'boardMemberNick')}
                        />
                      </td>
                    </tr>
                  )}
              <tr>
                <td>비밀번호</td>
                <td>
                  <input 
                    type="password" 
                    value={member.boardMemberPasswd || ''} 
                    onChange={(e) => handleInputChange(e, 'boardMemberPasswd')}
                  />
                </td>
              </tr>
              <tr>
                <td>비밀번호 확인</td>
                <td>
                  <input 
                    type="password" 
                    value={confirmPassword} 
                    onChange={handleConfirmPasswordChange}
                  />
                  {passwordError && <div style={{ color: 'red' }}>{passwordError}</div>}
                </td>
              </tr>
              <tr>
                <td>사는 지역</td>
                <td>
                  <input 
                    type="text" 
                    value={member.boardMemberRegion || ''} 
                    onChange={(e) => handleInputChange(e, 'boardMemberRegion')}
                  />
                  <button type="button" onClick={handleAddressSearch}>주소찾기</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}