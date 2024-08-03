import React, { useEffect } from 'react';
import $ from 'jquery';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel';
import left from '../img/left.png'; 
import right from '../img/right.png'; 
import stop from '../img/stop.png'; 
import banner1 from '../img/banner1.png';
import banner2 from '../img/banner2.png';
import banner3 from '../img/banner3.png';
import banner4 from '../img/banner4.png';

import styles from '../css/homeCommunity.module.css';
import { Link } from 'react-router-dom';

const HomeCommunity = () => {
  useEffect(() => {
    const $bannerList = $('#bannerList > ul');

    $bannerList.slick({
      accessibility: false,
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000,
      speed: 500,
      dots: false,
      arrows: true,
      prevArrow: 'a.ctrl_prev',
      nextArrow: 'a.ctrl_next',
    });

    // 배너 이미지 css 마운팅시 설정함
    $bannerList.on('setPosition', function(){
      $('#bannerList li').css('width', '100%');
      $('#bannerList img').css('width', '80%').css('margin', '0 auto')
      .css('display', 'block').css('border-radius', '50px')
      .css('box-shadow', '2px 10px 20px rgba(0, 0, 0, 0.2)');
    });

    const handleStopClick = () => {
      $bannerList.slick('slickPause');
      $('.ctrl_stop').removeClass('ctrl_stop').addClass('ctrl_play');
    };

    const handlePlayClick = () => {
      $bannerList.slick('slickPlay');
      $('.ctrl_play').removeClass('ctrl_play').addClass('ctrl_stop');
    };

    $('body').on('click', `.${styles.ctrl_stop}`, handleStopClick);
    $('body').on('click', `.${styles.ctrl_play}`, handlePlayClick);

    return () => {
      $bannerList.slick('unslick');
      $('body').off('click', `.${styles.ctrl_stop}`, handleStopClick);
      $('body').off('click', `.${styles.ctrl_play}`, handlePlayClick);
    };
  }, []);

  return (
    <div className={styles.homeCommunity}>
      <div className={styles.ctrl_box}>
        <h2>돌보시개에서 함께 놀개🐾</h2>
        <dl>
          <dt className={styles.blind}></dt>
          <dd><a href="javascript:;" className={`ctrl_prev ${styles.ctrl_prev}`}><img src={left} alt="previous" /></a></dd>
          <dd><a href="javascript:;" className={`ctrl_stop ${styles.ctrl_stop}`}><img src={stop} alt="stop" /></a></dd>
          <dd style={{ display: 'none' }}><a href="javascript:;" className={`ctrl_play ${styles.ctrl_play}`}><span className={styles.blind}>재생</span></a></dd>
          <dd><a href="javascript:;" className={`ctrl_next ${styles.ctrl_next}`}><img src={right} alt="next" /></a></dd>
        </dl>
      </div>
      <div id="bannerList">
        <ul>
          <li><Link to='/mate/member'><img src={banner1} alt="default" /></Link></li>
          <li><Link to='/board'><img src={banner2} alt="admin" /></Link></li>
          <li><Link to='/dog/random/date'><img src={banner3} alt="admin" /></Link></li>
          <li><Link to='/dwc'><img src={banner4} alt="admin" /></Link></li>
        </ul>
      </div>
    </div>
  );
};

export default HomeCommunity;
