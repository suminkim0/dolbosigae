import axios from 'axios';
import { useEffect, useState } from 'react';
import $ from 'jquery';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel';
import { Link } from 'react-router-dom';

import styles from '../css/homeAB.module.css';
import left from '../img/left.png';
import right from '../img/right.png';

export default function HomeAB() {
  const [ABList, setABList] = useState([]);

  useEffect(() => {
    const readData = async () => {
      try {
        const response = await axios.get('http://13.124.183.147:59879/ab/list');
        const latestABs = response.data.ab.slice(0, 6); // 최신 6마리만 가져오기
        setABList(latestABs);

        // 슬라이더 설정
        const $slider = $('#abListSlider > ul');

        $slider.slick({
          accessibility: false,
          infinite: true,
          slidesToShow: 3,  // 한번에 3개씩 보이도록 설정
          slidesToScroll: 1,
          autoplay: true,
          autoplaySpeed: 3000,
          speed: 500,
          dots: false,
          arrows: false,
          prevArrow: '<a class="slick-prev"><img src={left} alt="previous" /></a>',
          nextArrow: '<a class="slick-next"><img src={right} alt="next" /></a>',
        });

        $slider.on('setPosition', function () {
          $('#abListSlider li').css('width', '100%');
          $('#abListSlider img').css('width', '80%').css('margin', '0 auto')
            .css('display', 'block').css('border-radius', '50px')
            .css('box-shadow', '2px 10px 20px rgba(0, 0, 0, 0.2)');
        });

      } catch (error) {
        console.error("유기견 조회 중 에러발생", error);
      }
    };
    readData();
  }, []);

  return (
    <div>
      <div className={styles.container}>
        <div className={styles.title}>
          <h2>지금 구조되었어요</h2>
          <p>경기 보호센터에서 보호중인 강아지들을 만나보세요.</p>
          <Link to='/ab'>
            <button>더보기</button>
          </Link>
        </div>
        {ABList.length === 0 ? (
          <div>해당 데이터가 없습니다.</div>
        ) : (
          <div id="abListSlider" className={styles.listContainer}>
            <ul className={styles.list}>
              {ABList.map((ab) => (
                <Link key={ab.abid} className={styles.customLink} to={`/ab/detail/${ab.abid}`}>
                  <li className={styles.listItem}>
                    <img src={ab.abimg} alt="견종 이미지" />
                    <div className={styles.abbreed}>{ab.abbreed}</div>
                    <div>{ab.ablocation}</div>
                    <div>{ab.abcharacter}</div>
                  </li>
                </Link>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
