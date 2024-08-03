import axios from 'axios';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SubTitleCOInsert from './../SubTitles/SubTitleCoInsert';
import styles from './css/coInsert.module.css';

const CoInsert = () => {
    const formRef = useRef();
    const navigate = useNavigate();
    const [profileImage, setProfileImage] = useState(null);

    const CoInsertClick = async (e) => {
        e.preventDefault();
        if (formRef.current) {
            const formData = new FormData(formRef.current);
            if (profileImage) {
                formData.append('coProfile', profileImage);
            }
            const data = Object.fromEntries(formData.entries());

            if (!data.coName.trim()) {
                alert('놀이시설 이름, 도로명 주소, 가격, 휴일은 필수 기재사항입니다.');
                return;
            }

            const coNewData = {
                coDistinction: data.coDistinction,
                coName: data.coName,
                coHour: data.coHour,
                coTel: data.coTel,
                coAddress: data.coAddress,
                coSatHour: data.coSatHour,
                coSunHour: data.coSunHour,
                coDay: data.coDay,
                coImg: data.coImg,
                coImgNo: 0,
                coImgPath: ''
            };

            console.log(coNewData);

            try {
                const response = await axios.post('http://localhost:9999/conven/insert', coNewData);
                if (response.status === 200) {
                    console.log('등록 완료');
                    alert('등록 완료');
                    navigate('/co');
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

    const coInsertBack = () => {
        navigate('/co');
    };

    return (
        <div>
            <SubTitleCOInsert />
            <div className={styles.co_insert_contanier}>
                <div className={styles.subContainer}>
                    <form ref={formRef}>
                        <div className={styles.co_insert_image}>
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
                            <p className={styles.co_insert_notice}>└ 상자 안에 프로필 이미지를 드래그해주세요.</p>
                        </div>
                        <div className={styles.co_insert_table_container}>
                            <table className={styles.co_insert_table}>
                                <tr className={styles.co_insert_tr}>
                                    <th className={styles.co_insert_th}>놀이시설 이름</th>
                                    <td className={styles.co_insert_td}><input type='text' name='coDistinction' placeholder='놀이시설 이름을 입력해주세요.' className={styles.co_insert_input} /></td>
                                </tr>
                                <tr className={styles.co_insert_tr}>
                                    <th className={styles.co_insert_th}>영업 시간</th>
                                    <td className={styles.co_insert_td}><input type='text' name='coName' placeholder='영업시간을 입력해주세요.' className={styles.co_insert_input} /></td>
                                </tr>
                                <tr className={styles.co_insert_tr}>
                                    <th className={styles.co_insert_th}>전화번호</th>
                                    <td className={styles.co_insert_td}><input type='text' name='coHour' placeholder='전화번호를 입력해주세요.' className={styles.co_insert_input} /></td>
                                </tr>
                                <tr className={styles.co_insert_tr}>
                                    <th className={styles.co_insert_th}>도로명 주소</th>
                                    <td className={styles.co_insert_td}><input type='text' name='coTel' placeholder='도로명 주소를 입력해주세요.' className={styles.co_insert_input} /></td>
                                </tr>
                                <tr className={styles.co_insert_tr}>
                                    <th className={styles.co_insert_th}>가격</th>
                                    <td className={styles.co_insert_td}><input type='text' name='coAddress' placeholder='가격을 입력해주세요.' className={styles.co_insert_input} /></td>
                                </tr>
                                <tr className={styles.co_insert_tr}>
                                    <th className={styles.co_insert_th}>토요일</th>
                                    <td className={styles.co_insert_td}><input type='text' name='coSatHour' placeholder='토요일날 영업시간을 입력해주세요.' className={styles.co_insert_input} /></td>
                                </tr>
                                <tr className={styles.co_insert_tr}>
                                    <th className={styles.co_insert_th}>일요일</th>
                                    <td className={styles.co_insert_td}><input type='text' name='coSunHour' placeholder='일요일날 영업시간을 입력해주세요.' className={styles.co_insert_input} /></td>
                                </tr>
                                <tr className={styles.co_insert_tr}>
                                    <th className={styles.co_insert_th}>휴일</th>
                                    <td className={styles.co_insert_td}><input type='text' name='coDay' placeholder='휴일을 입력해주세요.' className={styles.co_insert_input} /></td>
                                </tr>
                            </table>
                        </div>
                        <p className={styles.co_insert_conditions}>※놀이시설 이름, 도로명 주소, 가격, 휴일은 필수 기재사항입니다.※</p>
                        <div className={styles.co_insert_footer}>
                            <button className={styles.co_insertBtn} onClick={CoInsertClick}>등록</button>
                            <p>　　　　　　</p>
                            <button className={styles.co_insert_back} onClick={coInsertBack}>뒤로가기</button>
                        </div>
                    </form>
                </div>
            </div>
        </div >
    )
};
export default CoInsert;