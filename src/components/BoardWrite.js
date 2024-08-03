import React, { useState, useEffect, useRef } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import '@ckeditor/ckeditor5-build-classic/build/translations/ko';
import styles from '../css/adminContactWrite.module.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function BoardWrite() {
    const [myEditor, setMyEditor] = useState(null);
    const title = useRef();
    const [user, setUser] = useState(null);
    const [file, setFile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
        }
    }, []);

    // 커스텀 업로드 어댑터 클래스
    class MyUploadAdapter {
        constructor(loader) {
            this.loader = loader;
        }

        // 파일을 업로드하고 서버에서 이미지 URL을 반환받아 에디터에 반영
        upload() {
            return new Promise((resolve, reject) => {
                this.loader.file.then(async (file) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = async () => {
                    const base64Image = reader.result;

                    try {
                        const response = await axios.post('http://13.124.183.147:59879/upload', {
                            image: base64Image // Base64 인코딩된 이미지 데이터를 JSON 형식으로 보냄
                        }, {
                            headers: {
                                'Content-Type': 'application/json' // Content-Type을 JSON으로 설정
                            }
                        });

                        if (response.status === 200) {
                            resolve({ default: response.data.fileUrl });
                        } else {
                            reject(`Upload failed with status: ${response.status}`);
                        }
                    } catch (error) {
                        reject(`Upload failed: ${error.message}`);
                    }
                };
                reader.onerror = (error) => reject(error);
            });
        });
    }
    }

    // 커스텀 업로드 어댑터 설정
    function MyCustomUploadAdapterPlugin(editor) {
        editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
            return new MyUploadAdapter(loader);
        };
    }

    const editorConfig = {
        extraPlugins: [MyCustomUploadAdapterPlugin], // 커스텀 업로드 어댑터 추가
        toolbar: [
            'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', '|',
            'alignment', '|', 'imageUpload', '|', 'undo', 'redo'
        ],
        language: 'ko',
        image: {
            toolbar: ['imageTextAlternative', 'imageStyle:full', 'imageStyle:side']
        }
    };

    const writeClick = async () => {
        if (!title.current.value.trim()) {
            alert('제목을 입력하세요.');
            return;
        }

        if (!user) {
            alert('사용자 정보를 확인할 수 없습니다. 로그인 후 다시 시도해 주세요.');
            return;
        }

        try {
            // CKEditor에서 콘텐츠 가져오기
            const rawContent = myEditor.getData();

            // 게시글 작성 데이터
            const jsonData = {
                mId: user.boardMemberId,
                showTitle: title.current.value,
                showContent: rawContent,
                pNick: user.boardMemberNick,
            };

            const response = await axios.post('http://13.124.183.147:59879/shows', jsonData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                alert('자랑글을 업로드하였습니다.');
                navigate('/board');
            } else {
                alert('글 작성 중 예상치 못한 오류가 발생했습니다.');
            }
        } catch (error) {
            alert('글 작성 중 오류가 발생했습니다.');
        }
    };

    const handleEditorReady = (editor) => {
        setMyEditor(editor);
        const editableElement = editor.ui.view.editable.element;
        editableElement.style.height = '500px';
    };

    return (
        <div>
            <div className={styles.editor}>
                <input
                    className={styles.adminTitle}
                    placeholder='제목을 입력하세요.'
                    ref={title}
                />
                <CKEditor
                    editor={ClassicEditor}
                    config={editorConfig}
                    onReady={handleEditorReady}
                    data=""
                />
                <div className={styles.writeBtnGroup}>
                    <button className={styles.writeBtn} onClick={writeClick}>글쓰기</button>
                    <Link to='/board'>
                        <button className={styles.commentBtn}>글 목록</button>
                    </Link>
                </div>
            </div>
        </div>
    );
}