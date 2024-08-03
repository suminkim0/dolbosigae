import styles from '../css/memberView.module.css';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import default_img from '../img/default_img.png';
import SubTitleMemberView from './SubTitles/SubTitleMemberView';

export default function MemberView() {
  const [memberList, setMemberList] = useState([]); // 빈 배열로 초기화
  const [pagination, setPagination] = useState(null);
  const [searchCategory, setSearchCategory] = useState('회원ID'); // 검색 기준 상태 변수
  const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태 변수

  let txtName = useRef();
  let txtRegion = useRef();
  let txtGradeName = useRef();
  let txtPetWith = useRef();
  let txtNick = useRef();
  let txtPetBirth = useRef();
  let txtPetGender = useRef();
  let txtPetSize = useRef();
  let txtPetWeight = useRef();
  let txtPetWalkProfile = useRef();
  let txtPetInfo = useRef();

  useEffect(() => {
    const readData = async () => {
      try {
        const response = await axios.get('http://localhost:9999/member/list');
        console.log('Pagination Data:', response.data.pagination);
        setMemberList(response.data.members);
        setPagination(response.data.pagination);
      } catch (error) {
        console.error("There was an error fetching the member list!", error);
      }
    }
    readData();
  }, []);

  const handleInputChange = (e, memberId, field) => {
    const updatedList = memberList.map(member => {
      if (member.boardMemberId === memberId) {
        return { ...member, [field]: e.target.value || '' }; // null일 경우 빈 문자열로 설정
      }
      return member;
    });
    setMemberList(updatedList);
  };

  const handlePetWithChange = (e, memberId) => {
    const updatedList = memberList.map(member => {
      if (member.boardMemberId === memberId) {
        return { ...member, boardMemberPetWith: e.target.value === '있음' ? true : false };
      }
      return member;
    });
    setMemberList(updatedList);
  };

  const handleGenderChange = (e, memberId) => {
    const updatedList = memberList.map(member => {
      if (member.boardMemberId === memberId) {
        return { ...member, petGender: e.target.value };
      }
      return member;
    });
    setMemberList(updatedList);
  };

  const handleWalkProfileChange = (e, memberId) => {
    const updatedList = memberList.map(member => {
      if (member.boardMemberId === memberId) {
        return { ...member, petWalkProfile: e.target.value === 'T' ? 'T' : 'F' };
      }
      return member;
    });
    setMemberList(updatedList);
  };

  const handlePageChange = (pageNo) => {
    const fetchPageData = async () => {
      try {
        const response = await axios.get(`http://localhost:9999/member/list?page=${pageNo}`);
        setMemberList(response.data.members);
        setPagination(response.data.pagination);
      } catch (error) {
        console.error("There was an error fetching the page data!", error);
      }
    }
    fetchPageData();
  };

  const deleteClick = async (memberId) => {
    try {
      const response = await axios.delete(`http://localhost:9999/member/delete/${memberId}`);
      alert(response.data); // 서버 응답 메시지를 알림으로 표시
      // 상태 업데이트: 삭제된 멤버를 목록에서 제거
      setMemberList(memberList.filter(member => member.boardMemberId !== memberId));
    } catch (error) {
      console.error("There was an error deleting the member!", error);
      alert("회원정보 삭제 중 오류가 발생했습니다.");
    }
  };

  const updateClick = async (member) => {
    try {
      const response = await axios.post(`http://localhost:9999/member/update`, member);
      console.log(response.data);
      alert("회원 정보가 업데이트되었습니다."); 
    } catch (error) {
      console.error("There was an error updating the member!", error); 
      alert("회원정보 업데이트 중 오류가 발생했습니다."); 
    }
  };

  const handleSearch = async () => {
    try {
      console.log('Search Category:', searchCategory);
      console.log('Search Term:', searchTerm);
      const response = await axios.get('http://localhost:9999/member/search', {
        params: {
          category: searchCategory,
          term: searchTerm
        }
      });
      console.log('Search response:', response.data); // 응답 데이터 로깅

      if (response.data && Array.isArray(response.data)) {
        setMemberList(response.data); // 데이터가 배열이면 설정
        console.log('Updated memberList:', response.data);
      } else {
        setMemberList([]); // 데이터가 배열이 아니면 빈 배열로 설정
      }

      if (response.data && response.data.pagination) {
        setPagination(response.data.pagination);
      } else {
        setPagination(null); // 페이지네이션 데이터가 없으면 null로 설정
      }
    } catch (error) {
      console.error("There was an error searching the members!", error);
      alert("회원 검색 중 오류가 발생했습니다.");
      setMemberList([]); // 오류 발생 시 멤버 리스트 초기화
      setPagination(null); // 오류 발생 시 페이지네이션 초기화
    }
  };
  
  return (
    <div>
      <SubTitleMemberView />
      <div className={styles.searchBox}>
        <select value={searchCategory} onChange={(e) => setSearchCategory(e.target.value)}>
          <option>회원ID</option>
          <option>회원이름</option>
          <option>지역</option>
          <option>등급</option>
        </select>
        <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <button onClick={handleSearch}>검색</button>
      </div>
      {memberList.length === 0 ? (
        <div>해당 데이터가 없습니다.</div>
      ) : (
        <div className={styles.manage_table_container}>
          <table className={styles.manage_table}>
            <thead>
              <tr>
                <th>프로필</th>
                <th>회원정보</th>
                <th colSpan={3}>반려동물 정보</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {memberList.map((member) => (
                <tr key={member.boardMemberId}>
                  <td>
                    {/* <input type='checkbox' /> */}
                    <img src={member.petImagePath || default_img} alt="Pet" className={styles.pet_image} /><br />
                    <span>{member.boardMemberId}</span>
                  </td>
                  <td>
                    <div className={styles.flex_container}>
                      <span className={styles.label}>이름</span>
                      <input value={member.boardMemberName || ''} ref={txtName} onChange={(e) => handleInputChange(e, member.boardMemberId, 'boardMemberName')} /><br />
                    </div>
                    <div className={styles.flex_container}>
                      <span className={styles.label}>지역</span>
                      <input value={member.boardMemberRegion || ''} ref={txtRegion} onChange={(e) => handleInputChange(e, member.boardMemberId, 'boardMemberRegion')} /><br />
                    </div>
                    <div className={styles.flex_container}>
                      <span className={styles.label}>등급</span>
                      <select className={styles.customSelect} value={member.boardMemberGradeName || ''} ref={txtGradeName} onChange={(e) => handleInputChange(e, member.boardMemberId, 'boardMemberGradeName')}>
                        <option value="애견인">애견인</option>
                        <option value="관리자">관리자</option>
                        <option value="관련기업">관련기업</option>
                      </select><br />
                    </div>
                  </td>
                  <td>
                    <div className={styles.flex_container}>
                      <span className={styles.label}>유무</span>
                      <select className={styles.customSelect} ref={txtPetWith} value={member.boardMemberPetWith ? '있음' : '없음'} onChange={(e) => handlePetWithChange(e, member.boardMemberId)}>
                        <option value="있음">있음</option>
                        <option value="없음">없음</option>
                      </select><br />
                    </div>
                    <div className={styles.flex_container}>
                      <span className={styles.label}>이름</span>
                      <input value={member.boardMemberNick || ''} ref={txtNick} onChange={(e) => handleInputChange(e, member.boardMemberId, 'boardMemberNick')} /><br />
                    </div>
                    <div className={styles.flex_container}>
                      <span className={styles.label}>출생년월</span>
                      <input value={member.petBirth || ''} ref={txtPetBirth} onChange={(e) => handleInputChange(e, member.boardMemberId, 'petBirth')} />
                    </div>
                  </td>
                  <td>
                    <div className={styles.flex_container}>
                      <span className={styles.label}>성별</span>
                      <select className={styles.customSelect} value={member.petGender || ''} ref={txtPetGender} onChange={(e) => handleGenderChange(e, member.boardMemberId)}>
                        <option value="F">F</option>
                        <option value="M">M</option>
                      </select><br />
                    </div>
                    <div className={styles.flex_container}>
                      <span className={styles.label}>무게분류</span>
                      <select className={styles.customSelect} value={member.petSize || ''} ref={txtPetSize} onChange={(e) => handleInputChange(e, member.boardMemberId, 'petSize')}>
                        <option value="대형견">대형견</option>
                        <option value="중형견">중형견</option>
                        <option value="소형견">소형견</option>
                      </select><br />
                    </div>
                    <div className={styles.flex_container}>
                      <span className={styles.label}>무게(kg)</span>
                      <input value={member.petWeight || ''} ref={txtPetWeight} onChange={(e) => handleInputChange(e, member.boardMemberId, 'petWeight')} />
                    </div>
                  </td>
                  <td>
                    <div className={styles.flex_container}>
                      <span className={styles.label}>산책프로필 노출 여부</span>
                      <select className={styles.customSelect} ref={txtPetWalkProfile} value={member.petWalkProfile} onChange={(e) => handleWalkProfileChange(e, member.boardMemberId)}>
                        <option value="T">예</option>
                        <option value="F">아니오</option>
                      </select><br />
                    </div>
                    <div className={styles.flex_container}>
                      <span className={styles.label}>소개글</span><br />
                      <input value={member.petInfo || ''} className={styles.petInfo} ref={txtPetInfo} onChange={(e) => handleInputChange(e, member.boardMemberId, 'petInfo')} />
                    </div>
                  </td>
                  <td>
                    <button className={styles.update} onClick={()=> updateClick(member)}>수정</button><br />
                    <button className={styles.delete} onClick={() => deleteClick(member.boardMemberId)}>삭제</button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="6" className={styles.pagination}>
                  {pagination && pagination.previousPageGroup && (
                    <button onClick={() => handlePageChange(pagination.startPageOfPageGroup - 1)}>◀</button>
                  )}
                  {pagination && Array.from({ length: pagination.endPageOfPageGroup - pagination.startPageOfPageGroup + 1 }, (_, i) => (
                    <button
                      key={i + pagination.startPageOfPageGroup}
                      onClick={() => handlePageChange(i + pagination.startPageOfPageGroup)}
                      className={pagination.currentPage === i + pagination.startPageOfPageGroup ? styles.activePage : ''}
                    >
                      {i + pagination.startPageOfPageGroup}
                    </button>
                  ))}
                  {pagination && pagination.nextPageGroup && (
                    <button onClick={() => handlePageChange(pagination.endPageOfPageGroup + 1)}>▶</button>
                  )}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}