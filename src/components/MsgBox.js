import React, { useState } from 'react';
import styles from '../css/msgBox.module.css';
import MsgBoxReceive from './MsgBoxReceive';
import MsgBoxSend from './MsgBoxSend';
import SubTitleMsgBox from './SubTitles/SubTitleMsgBox';

function MsgBox() {
  const [activeTab, setActiveTab] = useState('received'); // 'received' or 'sent'

  const sendMsgClick = () => {
    const url = '/mate/sendMsg'; 
    const windowFeatures = 'width=500,height=650,left=100,top=100,toolbar=no'; // 창의 크기와 위치 지정 및 UI 요소 숨김
    window.open(url, '_blank', windowFeatures); // 특정 크기와 위치로 새로운 창 열기
  };

  return (
    <div>
      <SubTitleMsgBox />
      <div className={styles.msgBoxContainer}>
        <div className={styles.buttonContainer}>
          <div className={styles.leftButtons}>
            <button
              className={`${styles.tabButton} ${activeTab === 'received' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('received')}
            >
              받은 쪽지함
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'sent' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('sent')}
            >
              보낸 쪽지함
            </button>
          </div>
        </div>
        {activeTab === 'received' ? <MsgBoxReceive /> : <MsgBoxSend />}
        <button className={styles.msgBoxsendPagebtn} onClick={sendMsgClick}>쪽지 보내기</button>
      </div>
    </div>
  );
}

export default MsgBox;