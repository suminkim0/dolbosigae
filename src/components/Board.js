import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../css/board.module.css';
import ShowBoardNumberRing from './ShowBoardNumberRing';
import SubTitleBoard from './SubTitles/SubTitleBoard';

const Board = () => {
    const [showText, setShowText] = useState('');
    const [error, setError] = useState('');
    const [result, setResult] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [pagination, setPagination] = useState({ totalPages: 0, currentPage: 1 });
    const [user, setUser] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
        }
    }, []);

    const fetchBoardData = async () => {
        try {
            const response = await axios.get('http://13.124.183.147:59879/boards/list', {
                params: { showText, page, limit }
            });
            const contents = response.data.contents || [];
            setResult(contents);
            setPagination({
                totalPages: response.data.pagination?.totalPages || 0,
                currentPage: page,
            });
        } catch (error) {
            console.log('데이터 가져오기 오류:', error);
            setError('데이터를 가져오는 중 오류가 발생했습니다.');
        }
    };

    useEffect(() => {
        fetchBoardData();
    }, [page, limit, showText]);

    const searchBoardClick = () => {
        setPage(1);
        fetchBoardData();
    };

    const onNumberRing = (number) => {
        setPage(Number(number));
    };

    const deleteBoard = async (showId) => {
        try {
            const response = await axios.delete(`http://13.124.183.147:59879/boards/delete/${showId}`, {
                headers: {
                    'userRole': user && user.boardMemberGradeNo === 0 ? 'ADMIN' : ''
                }
            });
            if (response.data.status === 'success') {
                fetchBoardData();
            } else {
                setError(response.data.message || '게시글 삭제 오류');
            }
        } catch (error) {
            console.log('게시글 삭제 오류:', error);
            setError('게시글을 삭제하는 중 오류가 발생했습니다.');
        }
    };

    const renderTable = useCallback(() => (
        <div className={styles.tableContainer}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th style={{ width: '40%' }}>제목</th>
                        <th>닉네임</th>
                        <th>작성일</th>
                        {user && user.boardMemberGradeNo === 0 && <th>삭제</th>}
                    </tr>
                </thead>
                <tbody>
                    {result.map((item) => (
                        <tr key={item.showNo}>
                            <td>
                                <Link to={`/boarddetail/${item.showNo}`} className={styles.link}>
                                    {item.showTitle}
                                </Link>
                            </td>
                            <td>{item.pNick}</td>
                            <td>{new Date(item.showDate).toLocaleDateString()}</td>
                            {user && user.boardMemberGradeNo === 0 && (
                                <td>
                                    <button className={styles.DeleteBtn}
                                        onClick={() => deleteBoard(item.showNo)}>삭제</button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    ), [result, user]);

    return (
        <>
            <SubTitleBoard />
            <div className={styles.container}>
                <div className={styles.mainContent}>
                    <div className={styles.searchAndTableContainer}>
                        <div className={styles.searchContainer}>
                            <input
                                type="text"
                                value={showText}
                                placeholder="찾으실 제목을 입력하세요."
                                onChange={(e) => setShowText(e.target.value)}
                                className={styles.searchInput}
                            />
                            <button onClick={searchBoardClick} className={styles.searchButton}>조회</button>
                        </div>
                        
                            {error && <div className={styles.error}>{error}</div>}
                            {result.length > 0 ? (
                                <>
                                    {renderTable()}
                                    <div className={styles.paginationContainer}>
                                        <ShowBoardNumberRing onNumberRing={onNumberRing} pagination={pagination} />
                                    </div>
                                </>
                            ) : (
                                <div>검색 결과가 없습니다.</div>
                            )}

                        <div className={styles.addButtonContainer}>
                            <button 
                                className={styles.linkButton}
                                onClick={() => navigate('/board/write')}
                            >
                                + 글쓰기
                            </button>
                        </div>
                        
                    </div>
                </div>
            </div>
        </>
    );
};

export default Board;