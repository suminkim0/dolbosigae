import styles from '../css/myPageTablePet.module.css';
import { useEffect, useState } from 'react';

export default function MyPageTablePet({ member, onMemberChange }) {
  const [hasPet, setHasPet] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    setHasPet(member?.boardMemberPetWith === 'T');
  }, [member]);

  const handleInputChange = (e, field) => {
    onMemberChange({
      ...member,
      [field]: e.target.value || '' // null일 경우 빈 문자열로 설정
    });
  };

  const handleRadioChange = (e) => {
    const value = e.target.value;
    onMemberChange({
      ...member,
      boardMemberPetWith: value
    });
    setHasPet(value === 'T');
  };

  const handleSelectChange = (e, field) => {
    onMemberChange({
      ...member,
      [field]: e.target.value
    });
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    setProfileImage(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className={styles.tableContainer}>
      {!member ? (
        <div>데이터가 로딩 중입니다...</div>
      ) : (
        <table>
          <tbody>
            <tr>
              <td>반려동물 유무</td>
              <td>
                <div className={styles.radio_set}>
                  <label>
                    <input
                      type="radio"
                      name="boardMemberPetWith"
                      value="T"
                      checked={member.boardMemberPetWith === 'T'}
                      onChange={handleRadioChange}
                    />
                    반려동물을 키우고 있음
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="boardMemberPetWith"
                      value="F"
                      checked={member.boardMemberPetWith === 'F'}
                      onChange={handleRadioChange}
                    />
                    반려동물을 키우고 있지 않음
                  </label>
                </div>
              </td>
            </tr>
            {hasPet && (
            <>
              <tr>
                <td>반려동물 이름</td>
                <td>
                  <input 
                    type="text" 
                    value={member.boardMemberNick || ''} 
                    onChange={(e) => handleInputChange(e, 'boardMemberNick')}
                  />
                </td>
              </tr>
              <tr>
                <td>반려동물 무게</td>
                <td>
                  <select 
                    name="petSize" 
                    value={member.petSize || ''} 
                    onChange={(e) => handleSelectChange(e, 'petSize')}
                  >
                    <option value="소형견">소형견</option>
                    <option value="중형견">중형견</option>
                    <option value="대형견">대형견</option>
                  </select>
                  <input 
                    type='number' 
                    step="0.1" 
                    name="petWeight" 
                    value={member.petWeight || ''} 
                    onChange={(e) => handleInputChange(e, 'petWeight')}
                  />
                </td>
              </tr>
              <tr>
                <td>반려동물 소개</td>
                <td>
                  <textarea 
                    type="text" 
                    value={member.petInfo || ''} 
                    onChange={(e) => handleInputChange(e, 'petInfo')}
                    className={styles.pet_info}
                  />
                </td>
              </tr>
              <tr>
                <td>반려동물 사진</td>
                <td>
                  <div
                    id="profile_img"
                    onDrop={handleFileDrop}
                    onDragOver={handleDragOver}
                    style={{
                      width: '100px',
                      height: '100px',
                      border: '1px solid #CCCCCC',
                      backgroundImage: profileImage ? `url(${URL.createObjectURL(profileImage)})` : 'none',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center',
                      backgroundSize: 'contain'
                    }}
                  ></div>
                  <input type="hidden" name="boardMemberProfile" />
                  <p className={styles.notice}>└ 상자 안에 변경하실 프로필 이미지를 드래그해주세요.</p>
                </td>
              </tr>
            </>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
