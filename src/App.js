import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Home from './components/Home';
import Login from './components/Login';
import MemberView from './components/MemberView';
import MemberRegister from './components/MemberRegister';
import MyPage from './components/MyPage';
import LoginPasswd from './components/LoginPasswd';
import PL from './components/pl_main_components/PL';
import PlInfoView from './components/pl_info_component/PlInfoView';
import Hospital from './components/Hospital';
import HospitalDetail from './components/HospitalDetail';
import AdminContact from './components/AdminContact';
import AdminContactNormalTableDetail from './components/AdminContactNormalTableDetail';
import AdminContactWrite from './components/AdminContactWrite';
import Footer from './components/Footer';
import MateSearch from './components/MateSearch';
import MatePetProfile from './components/MatePetProfile';
import Pharmacy from './components/Pharmacy';
import PharmacyDetail from './components/PharmacyDetail';
import PlInsert from './components/pl_insert_component/PlInsert';
import CoInsert from './components/co_insert_component/CoInsert';
import DogWorldCup from './components/dog_worldCup_components/DogWorldCup';
import AddHospital from './components/AddHospital';
import AddPharmacy from './components/AddPharmacy';
import CO from './components/co_main_components/CO';
import CoInfoView from './components/co_info_components/CoInfoView';
import DogRandomDate from './components/DogRandomDate';
import Board from './components/Board';
import AB from './components/AB';
import Shelter from './components/Shelter';
import ShelterDetail from './components/ShelterDetail';
import ABDetail from './components/ABDetail';
import DogWorldCupPage from './components/dog_worldCup_components/dog_worldCup_Page.component/DogWorldCupPage';
import WinnerPage from './components/dog_worldCup_components/winnerPage_components/WinnerPage';
import BoardWrite from './components/BoardWrite';
import BoardDetail from './components/BoardDetail';
import MateFav from './components/MateFav';
import MsgBox from './components/MsgBox';
import MsgSend from './components/MsgSend';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div className="app-container">
        <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        <MainContent 
          handleLoginSuccess={handleLoginSuccess} 
          isLoggedIn={isLoggedIn}
        />
      </div>
    </Router>
  );
}

function MainContent({ handleLoginSuccess, isLoggedIn }) {
  const location = useLocation();

  // Footer를 숨길 경로를 배열로 정의합니다.
  const hiddenFooterPaths = ['/mate/fav', '/mate/petinfo', '/mate/sendMsg'];

  return (
    <main className="app-content">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/login/passwd" element={<LoginPasswd />} />
        <Route path="/member/view" element={<MemberView />} />
        <Route path="/member/register" element={<MemberRegister />} />
        <Route path="/member/mypage" element={<MyPage />} />
        {/* 놀이시설 이동경로 */}
        <Route path="/pl" element={<PL />} />
        <Route path='/plinfo/:plId' element={<PlInfoView />} />
        <Route path='/plInsert' element={<PlInsert />} />
        {/* 놀이시설 이동경로 */}

        {/* 편의시설 이동경로 */}
        <Route path='/co' element={<CO />} />
        <Route path='/coinfo/:coId' element={<CoInfoView />} />
        <Route path='/coInsert' element={<CoInsert />} />
        {/* 편의시설 이동경로 */}
        <Route path='/shelters/detail/:sh_id' element={<ShelterDetail />} />
        <Route path='/animal-medical' element={<Hospital />} />
        <Route path='/hoinfo/:hoId' element={<HospitalDetail />} />
        <Route path="/pharmacies" element={<Pharmacy />} />
        <Route path="/phinfo/:phId" element={<PharmacyDetail />} />
        <Route path='/hospitalDetail' element={<HospitalDetail />} />
        <Route path='/dwc' element={<DogWorldCup />} />
        <Route path="/addHospital" element={<AddHospital />} />
        <Route path="/addPharmacy" element={<AddPharmacy />} />
        <Route path='/shelter' element={<Shelter />} />
        <Route path='/shelter/detail/:shelterId' element={<ShelterDetail />} />
        <Route path='/ab' element={<AB />} />
        <Route path='/ab/detail/:abid' element={<ABDetail />} />
        <Route path="/board" element={<Board />} />
        <Route path="/board/write" element={<BoardWrite />} />
        <Route path="/boarddetail/:showNo" element={<BoardDetail />} />
        <Route path='/admin/contact' element={<AdminContact />} />
        <Route path='/admin/contact/detail/:adminNo' element={<AdminContactNormalTableDetail />} />
        <Route path='/admin/write' element={<AdminContactWrite />} />
        <Route path='/dog/random/date' element={<DogRandomDate />} />
        <Route path="/mate/member" element={<MateSearch />} />
        <Route path="/mate/petinfo" element={<MatePetProfile />} />
        <Route path="/mate/fav" element={<MateFav />} />
        <Route path="/mate/msg" element={<MsgBox/>} />
        <Route path="/mate/sendMsg" element={<MsgSend/>} />
        <Route path='/board' element={<Board />} />
        {/* 개상형 월드컵 이동경로 */}
        <Route path='/dwc' element={<DogWorldCup />} />
        <Route path="/dwc/round/:round" element={<DogWorldCupPage />} />
        <Route path="/wp/:dogId" element={<WinnerPage />} />
      </Routes>

      {/* Footer 컴포넌트를 conditionally 렌더링 */}
      {!hiddenFooterPaths.includes(location.pathname) && <Footer />}
    </main>
  );
}


export default App;