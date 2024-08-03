import axios from 'axios';
import styles from './css/plInsert.module.css';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SubTitlePlInsert from './../SubTitles/SubTitlePlInsert';

const PlInsert = () => {
    const formRef = useRef();
    const navigate = useNavigate();
    const [profileImage, setProfileImage] = useState(null);

    const plInsertClick = async (e) => {
        e.preventDefault();
        if (formRef.current) {
            const formData = new FormData(formRef.current);
            if (profileImage) {
                formData.append('plProfile', profileImage);
            }
            const data = Object.fromEntries(formData.entries());

            if (!data.plName.trim()) {
                alert('놀이시설 이름, 도로명 주소, 가격, 휴일은 필수 기재사항입니다.');
                return;
            }

            const plNewData = {
                plName: data.plName,
                plHour: data.plHour,
                plTel: data.plTel,
                plAddress: data.plAddress,
                plInfo: data.plInfo,
                plExpense: data.plExpense,
                plImg: data.plImg,
                plArea: data.plArea,
                plDay: data.plDay,
                plImgNo: 0,
                plImgPath: ''
            };

            console.log(plNewData);

            try {
                const response = await axios.post('http://localhost:9999/city/insert', plNewData);
                if (response.status === 200) {
                    console.log('등록 완료');
                    alert('등록 완료');
                    navigate('/pl');
                }
            } catch (error) {
                console.log(error);
            }
        } else {
            console.error("Form reference is null");
        }
    };

    const handleFileDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        setProfileImage(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const PlInsertBack = () => {
        navigate('/pl');
    }

    return (
        <div>
            <SubTitlePlInsert />
            <div className={styles.pl_insert_container}>
                <div className={styles.subContainer}>
                    <form ref={formRef}>
                        <div className={styles.pl_insert_image}>
                            <div
                                id="profile_img"
                                onDrop={handleFileDrop}
                                onDragOver={handleDragOver}
                                style={{
                                    width: '400px',
                                    height: '200px',
                                    border: '1px solid #CCCCCC',
                                    backgroundImage: profileImage ? `url(${URL.createObjectURL(profileImage)})` : 'none',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'center',
                                    backgroundSize: 'contain',
                                }}
                            ></div>
                            <input type="hidden" name="plProfile" />
                            <p className={styles.pl_insert_notice}>└ 상자 안에 프로필 이미지를 드래그해주세요.</p>
                        <div className={styles.pl_insert_table_container}>
                        </div>
                            <table className={styles.pl_insert_table}>
                                <tbody>
                                    <tr className={styles.pl_insert_tr}>
                                        <th className={styles.pl_insert_th}>놀이시설 이름</th>
                                        <td className={styles.pl_insert_td}><input type='text' name='plName' placeholder='놀이시설 이름을 입력해주세요.' className={styles.pl_insert_input} /></td>
                                    </tr>
                                    <tr className={styles.pl_insert_tr}>
                                        <th className={styles.pl_insert_th}>영업 시간</th>
                                        <td className={styles.pl_insert_td}><input type='text' name='plHour' placeholder='영업시간을 입력해주세요.' className={styles.pl_insert_input} /></td>
                                    </tr>
                                    <tr className={styles.pl_insert_tr}>
                                        <th className={styles.pl_insert_th}>전화번호</th>
                                        <td className={styles.pl_insert_td}><input type='text' name='plTel' placeholder='전화번호를 입력해주세요.' className={styles.pl_insert_input} /></td>
                                    </tr>
                                    <tr className={styles.pl_insert_tr}>
                                        <th className={styles.pl_insert_th}>도로명 주소</th>
                                        <td className={styles.pl_insert_td}><input type='text' name='plAddress' placeholder='도로명 주소를 입력해주세요.' className={styles.pl_insert_input} /></td>
                                    </tr>
                                    <tr className={styles.pl_insert_tr}>
                                        <th className={styles.pl_insert_th}>제한조건</th>
                                        <td className={styles.pl_insert_td}><input type='text' name='plInfo' placeholder='제한 조건을 입력해주세요.' className={styles.pl_insert_input} /></td>
                                    </tr>
                                    <tr className={styles.pl_insert_tr}>
                                        <th className={styles.pl_insert_th}>가격</th>
                                        <td className={styles.pl_insert_td}><input type='text' name='plExpense' placeholder='가격을 입력해주세요.' className={styles.pl_insert_input} /></td>
                                    </tr>
                                    <tr className={styles.pl_insert_tr}>
                                        <th className={styles.pl_insert_th}>면적</th>
                                        <td className={styles.pl_insert_td}><input type='text' name='plArea' placeholder='면적을 입력해주세요.' className={styles.pl_insert_input} /></td>
                                    </tr>
                                    <tr className={styles.pl_insert_tr}>
                                        <th className={styles.pl_insert_th}>휴일</th>
                                        <td className={styles.pl_insert_td}><input type='text' name='plDay' placeholder='휴일을 입력해주세요.' className={styles.pl_insert_input} /></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <p className={styles.pl_insert_conditions}>※놀이시설 이름, 도로명 주소, 가격, 휴일은 필수 기재사항입니다.※</p>
                        <div className={styles.pl_insert_footer}>
                            <button className={styles.pl_insertBtn} onClick={plInsertClick}>등록</button>
                            <p>　　　　　　</p>
                            <button className={styles.pl_insert_back} onClick={PlInsertBack}>뒤로가기</button>
                        </div>
                        
                    </form>
                </div>
            </div>
        </div >
    )
};

export default PlInsert;
