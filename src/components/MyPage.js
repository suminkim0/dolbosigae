import React, { useState, useEffect } from 'react';
import SubTitleMyPage from './SubTitles/SubTitleMyPage';
import MyPageProfile from './MyPageProfile';
import MyPageTable from './MyPageTable';
import MyPageTablePet from './MyPageTablePet';
import MyPageButton from './MyPageButton';
import axios from 'axios';

export default function MyPage() {
  const [member, setMember] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isPasswordMatched, setIsPasswordMatched] = useState(true);
  const [hasPet, setHasPet] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserId(user.boardMemberId);
    } else {
      console.error('사용자 정보를 찾을 수 없습니다.');
    }
  }, []);

  useEffect(() => {
    const readData = async () => {
      if (userId) {
        try {
          const response = await axios.get(`https://dolbosigae.site/member/search/${userId}`);
          setMember(response.data);
          setHasPet(response.data.boardMemberPetWith === 'T');
        } catch (error) {
          console.error('정보를 불러오지 못했습니다.', error);
        }
      } else {
        console.error('사용자 ID를 찾을 수 없습니다.');
      }
    };
    readData();
  }, [userId]);

  const updateClick = async () => {
    if (!isPasswordMatched) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    try {
      const requestData = {
        ...member,
        passwordChanged: member.passwordChanged ? 1 : 0 // boolean을 숫자로 변환
      };
      const response = await axios.post(`https://dolbosigae.site/member/update`, requestData);
      console.log(response.data);
      alert("회원 정보가 업데이트되었습니다."); 
    } catch (error) {
      console.error("There was an error updating the member!", error); 
      alert("회원정보 업데이트 중 오류가 발생했습니다."); 
    }
  };

  const handleMemberChange = (updatedMember) => {
    setMember(updatedMember);
    setHasPet(updatedMember.boardMemberPetWith === 'T');
  };

  const handlePasswordMatchChange = (isMatched) => {
    setIsPasswordMatched(isMatched);
  };

  return (
    <div>
      <SubTitleMyPage />
      <MyPageProfile member={member} onMemberChange={handleMemberChange} />
      <MyPageTable member={member} onMemberChange={handleMemberChange} onPasswordMatchChange={handlePasswordMatchChange} hasPet={hasPet} />
      <MyPageTablePet member={member} onMemberChange={handleMemberChange} />
      <MyPageButton onUpdateClick={updateClick} isPasswordMatched={isPasswordMatched} />
    </div>
  );
}