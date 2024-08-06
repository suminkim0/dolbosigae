import { Link } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import CoNumberRing from "./../co_numberring_components/CoNumberRing";
import SubTitleCO from "../SubTitles/SubTitleCO";
import styles from "./css/co.module.css";
import axios from "axios";

export default function Co() {
    const [coText, setCoText] = useState('');
    const [result, setResult] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [pagination, setPagination] = useState({ totalPages: 0, currentPage: 1 });
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
        }
    }, []);

    const convenienceList = async () => {
        try {
            const response = await axios.get('https://dolbosigae.site/conven/list', {
                params: { coText, page, limit, isDescending: true }
            });
            const contents = response.data.contents || [];
            setResult(contents);
            setPagination({
                totalPages: response.data.pagination.totalPages,
                currentPage: page,
            });
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        convenienceList();
    }, [page, limit]);

    const CoSearchClick = () => {
        if (!coText.trim()) {
            alert('검색어를 입력해주세요.');
            return;
        }
        setPage(1);
        convenienceList();
    };

    const handlePageChange = (number) => {
        setPage(number);
    };

    const coDeleteClick = async (id) => {
        try {
            const response = await axios.delete(`https://dolbosigae.site/conven/delete/${id}`)
            if (response.status === 200) {
                alert("삭제되었습니다.");
                convenienceList();
            } else {
                alert("작성자만 삭제할 수 있습니다.");
            }
        } catch (error) {
            alert("삭제 요청 오류 : ", error);
            console.log(error)
        }
    }

    const renderTable = useCallback(() => {
        return (
            <table className={styles.co_list_container}>
                <thead>
                    <tr className={styles.co_list_thead}>
                        <th className={styles.co_list_th}></th>
                        <th className={styles.co_list_th}>번호</th>
                        <th className={styles.co_list_th}>분류명</th>
                        <th className={styles.co_list_th}>업종명</th>
                        <th className={styles.co_list_th}>업종운영시간</th>
                        <th className={styles.co_list_th}>전화번호</th>
                        <th className={styles.co_list_th}>주소</th>
                        <th className={styles.co_list_th}>상세정보</th>
                    </tr>
                </thead>
                <tbody>
                    {result.map((conven, index) => (
                        <tr key={index} className={styles.co_list_tr}>
                            <td className={styles.co_list_td}>
                                {user && user.boardMemberGradeNo === 0 ? (
                                    <button className={styles.co_deleteBtn} onClick={() => coDeleteClick(conven.coId)}>삭제</button>
                                ) : null}
                            </td>
                            <td className={styles.co_list_td}>{conven.coId}</td>
                            <td className={styles.co_list_td}>{conven.coDistinction}</td>
                            <td className={styles.co_list_td}>{conven.coName}</td>
                            <td className={styles.co_list_td}>{conven.coHour}</td>
                            <td className={styles.co_list_td}>{conven.coTel}</td>
                            <td className={styles.co_list_td}>{conven.coAddress}</td>
                            <td className={styles.co_list_td}><Link to={`/coinfo/${conven.coId}`} className={styles.co_list_link}>이동</Link></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }, [result, user]);

    return (
        <div>
            <SubTitleCO />
                <div className={styles.co_main_container}>
                <div className={styles.co_search_and_result_container}>
                    <div className={styles.co_search_container}>
                        <input
                            className={styles.search_input_co}
                            type="text"
                            value={coText}
                            placeholder="지역 입력"
                            onChange={(e) => setCoText(e.target.value)}
                        />
                        <button className={styles.searchBtn_co} onClick={CoSearchClick}>조회</button>
                    </div>
                    <div className={styles.co_searchResult_container}>
                        {result.length > 0 && renderTable()}
                    </div>
                </div>
                {user && user.boardMemberGradeNo === 0 ? (
                    <div className={styles.co_insert_container}>
                        <Link to="/coInsert" className={styles.co_insert_link}>편의시설 등록</Link>
                    </div>
                ) : null}
                <div>
                    <CoNumberRing onNumberRing={handlePageChange} pagination={pagination} />
                </div>
            </div>
        </div>
    );
};
