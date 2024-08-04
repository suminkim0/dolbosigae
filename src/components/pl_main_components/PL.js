import axios from 'axios';
import { Link } from 'react-router-dom';
import React, { useState, useEffect, useCallback } from 'react';
import styles from './css/pl.module.css';
import SubTitlePL from './../SubTitles/SubTitlePL';
import PlNumberRing from '../pl_numberring_component/PlNumberRing';
import PlInsert from '../pl_insert_component/PlInsert';

const PL = () => {
    const [plText, setPlText] = useState('');
    const [result, setResult] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [pagination, setPagination] = useState({ totalPages: 0, currentPage: 1 });
    const [user, setUser] = useState(null);

    //유저 정보 받아옴(관리자 유저 색출)
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
        }
    }, []);

    //기본적으로 뜨는 리스트
    const cityList = async () => {
        try {
            const response = await axios.get('https://dolbosigae.site/city/list', {
                params: { plText, page, limit, isDescending: true }
            });
            const contents = response.data.contents || [];
            setResult(contents);
            setPagination({
                totalPages: response.data.pagination.totalPages,
                currentPage: page,
            })
        } catch (error) {
            console.log('서버에러:', error);
        }
    };

    useEffect(() => {
        cityList();
    }, [page, limit]);

    //검색어 없이 조회버튼 눌렀을 때 뜨는 경고창
    const searchClick = async () => {
        if (!plText.trim()) {
            alert("지역을 입력해주세요");
            return;
        }
        setPage(1);
        cityList();
    };

    const onNumberRing = (number) => {
        setPage(number);
    };

    //삭제 버튼 기능
    const deleteClick = async (id) => {
        try {
            const response = await axios.delete(`https://dolbosigae.site/city/delete/${id}`)
            if (response.status === 200) {
                alert("삭제되었습니다.");
                cityList();
            } else {
                alert("작성자만 삭제할 수 있습니다.");
            }
        } catch (error) {
            alert("삭제 요청 오류 : ", error);
            console.log(error)
        }
    }

    //검색 후 검색어에 맞는 데이터 값 리턴
    const renderTable = useCallback(() => (
        <table className={styles.list_container}>
            <thead>
                <tr className={styles.list_thead}>
                    <th className={styles.list_th}></th>
                    <th className={styles.list_th}>번호</th>
                    <th className={styles.list_th}>공원명</th>
                    <th className={styles.list_th}>출입 허용 시간</th>
                    <th className={styles.list_th}>전화번호</th>
                    <th className={styles.list_th}>도로명 주소</th>
                    <th className={styles.list_th}>상세정보</th>
                </tr>
            </thead>
            <tbody>
                {result.map((city, index) => (
                    <tr key={index} className={styles.list_tdAll}>
                        <td className={styles.list_td}>
                            {user && user.boardMemberGradeNo === 0 ? (
                                <button className={styles.DeleteBtn} onClick={() => deleteClick(city.plId)}>삭제</button>
                            ) : null}
                        </td>
                        <td className={styles.list_td}>{city.plId}</td>
                        <td className={styles.list_td}>{city.plName}</td>
                        <td className={styles.list_td}>{city.plHour}</td>
                        <td className={styles.list_td}>{city.plTel}</td>
                        <td className={styles.list_td}>{city.plAddress}</td>
                        <td className={styles.list_td}><Link to={`/plinfo/${city.plId}`} className={styles.list_Link}>이동</Link></td>
                    </tr>
                ))}
            </tbody>
        </table>
    ), [result, user]);

    return (
        <div>
            <SubTitlePL />
                <div className={styles.pl_main_container}>
                <div className={styles.search_and_result_container}>
                    <div className={styles.search_container}>
                        <input
                            className={styles.search_input}
                            type="text"
                            value={plText}
                            placeholder="지역 입력"
                            onChange={(e) => setPlText(e.target.value)}
                        />
                        <button onClick={searchClick} className={styles.searchBtn}>조회</button>

                    </div>
                    <div className={styles.searchResult_container}>
                        {result.length > 0 && renderTable()}
                    </div>
                    {user && user.boardMemberGradeNo === 0 ? (
                        <div className={styles.pl_insert_container}>
                            <Link to="/plInsert" className={styles.pl_insert_link}>놀이시설 등록</Link>
                        </div>
                    ) : null}
                </div>
                <div>
                    <PlNumberRing onNumberRing={onNumberRing} pagination={pagination} />
                </div>
            </div>
        </div>
    );
};

export default PL;
