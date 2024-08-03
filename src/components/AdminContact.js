import React, { useEffect, useState } from 'react';
import AdminContactDefaultTable from './AdminContactDefaultTable';
import AdminContactNormalTable from './AdminContactNormalTable';
import AdminSearchResultsTable from './AdminSearchResultsTable';
import SubTitleAdminContact from './SubTitles/SubTitleAdminContact';
import { Link } from 'react-router-dom';
import AdminContactSearch from './AdminContactSearch';
import axios from 'axios';

export default function AdminContact() {
  const [searchResults, setSearchResults] = useState(null);
  const [searchPagination, setSearchPagination] = useState(null);
  const [adminBoardList, setAdminBoardList] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [user, setUser] = useState(null);
  const [searchCategory, setSearchCategory] = useState('문의글 제목');
  const [searchTerm, setSearchTerm] = useState('');
  const [noAnswerOnly, setNoAnswerOnly] = useState(false); // 미답변만 보기 상태 추가

  // 로컬 스토리지에서 user 정보를 가져와 설정
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
  }, []);

  // 초기 데이터 로드
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:9999/admin/contact');
        setAdminBoardList(response.data.admin);
        setPagination(response.data.pagination);
      } catch (error) {
        console.error("문의글 목록을 불러오는 중 에러 발생", error);
      }
    };
    fetchData();
  }, []);

  // 검색 결과를 설정하는 함수
  const handleSearchResults = (results, pagination) => {
    console.log('Search Results:', results);
    console.log('Search Pagination:', pagination);
    if (results && pagination) {
      setSearchResults(results);
      setSearchPagination({
        ...pagination,
        totalPages: Math.ceil(pagination.totalItems / 10), // 페이지당 10개의 항목이 있다고 가정
      });
    } else {
      console.error("Invalid search results or pagination:", results, pagination);
    }
  };

  const handlePageChange = (pageNo) => {
    console.log("페이지내용 : " + pageNo);
    if (searchResults) {
      // 검색 결과의 페이지 변경 로직
      const fetchPageData = async () => {
        try {
          const response = await axios.get(`http://localhost:9999/admin/search`, {
            params: {
              page: pageNo,
              category: searchCategory,
              term: searchTerm,
              noAnswerOnly: noAnswerOnly // 추가
            }
          });
          console.log('Page change search response:', response.data);
          setSearchResults(response.data.admin);
          setSearchPagination({
            ...response.data.pagination,
            totalPages: Math.ceil(response.data.pagination.totalItems / 10),
          });
        } catch (error) {
          console.error("There was an error fetching the search page data!", error);
        }
      };
      fetchPageData();
    } else {
      // 일반 데이터의 페이지 변경 로직
      const fetchPageData = async () => {
        try {
          const response = await axios.get(`http://localhost:9999/admin/contact?page=${pageNo}`);
          setAdminBoardList(response.data.admin);
          setPagination(response.data.pagination);
        } catch (error) {
          console.error("There was an error fetching the page data!", error);
        }
      };
      fetchPageData();
    }
  };

  const deleteClick = async (adminNo, adminCommentCount) => {
    try {
      const response = await axios.delete(`http://localhost:9999/admin/delete/${adminNo}/${adminCommentCount}`);
      alert(response.data);

      // 상태 업데이트: 삭제된 게시글을 목록에서 제거한 후 최신 데이터 다시 불러오기
      if (searchResults) {
        const fetchData = async () => {
          try {
            const response = await axios.get(`http://localhost:9999/admin/search`, {
              params: {
                page: searchPagination.currentPage,
                category: searchCategory,
                term: searchTerm,
                noAnswerOnly: noAnswerOnly // 추가
              }
            });
            setSearchResults(response.data.admin);
            setSearchPagination({
              ...response.data.pagination,
              totalPages: Math.ceil(response.data.pagination.totalItems / 10),
            });
          } catch (error) {
            console.error("There was an error fetching the search data!", error);
          }
        };
        fetchData();
      } else {
        const fetchData = async () => {
          try {
            const response = await axios.get(`http://localhost:9999/admin/contact?page=${pagination.currentPage}`);
            setAdminBoardList(response.data.admin);
            setPagination(response.data.pagination);
          } catch (error) {
            console.error("There was an error fetching the page data!", error);
          }
        };
        fetchData();
      }
    } catch (error) {
      console.error("문의글 삭제 오류", error);
      alert("문의글 삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <div>
      <SubTitleAdminContact />
      <AdminContactDefaultTable />
      <AdminContactSearch 
        onSearchResults={handleSearchResults} 
        setSearchCategory={setSearchCategory} 
        setSearchTerm={setSearchTerm} 
        setNoAnswerOnly={setNoAnswerOnly} 
        noAnswerOnly={noAnswerOnly} 
        user={user}
      />
      {searchResults ? (
        <AdminSearchResultsTable
          adminBoardList={searchResults}
          pagination={searchPagination}
          handlePageChange={handlePageChange}
          user={user}
          deleteClick={deleteClick}
        />
      ) : (
        <AdminContactNormalTable
          adminBoardList={adminBoardList}
          pagination={pagination}
          handlePageChange={handlePageChange}
          user={user}
          deleteClick={deleteClick}
        />
      )}
      <Link to='/admin/write' style={{ display: 'flex', justifyContent: 'center', textDecoration: 'none' }}>
        <button
          style={{
            width: '200px', height: '40px', backgroundColor: '#595959',
            color: 'white', marginBottom: '100px', border: 'none', borderRadius: '5px'
          }}
          onMouseOver={(e) => e.currentTarget.style.opacity = '0.8'}
          onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
        >
          글쓰기
        </button>
      </Link>
    </div>
  );
}
