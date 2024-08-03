import React, { useEffect } from 'react';

// KakaoMap 컴포넌트에서 지도를 생성하고 마커를 추가하는 부분
const KakaoMap = ({ locations }) => {
    useEffect(() => {
        if (window.kakao && locations.length > 0) {
            const container = document.getElementById('map');
            const options = {
                center: new window.kakao.maps.LatLng(locations[0].lat, locations[0].lng), // 초기 위치를 첫 번째 병원으로 설정
                level: 3
            };

            const map = new window.kakao.maps.Map(container, options);

            locations.forEach(location => {
                const marker = new window.kakao.maps.Marker({
                    position: new window.kakao.maps.LatLng(location.lat, location.lng),
                    map: map,
                    title: location.name
                });
                
                // 마커를 클릭했을 때 지도 중심을 해당 마커 위치로 이동
                window.kakao.maps.event.addListener(marker, 'click', () => {
                    map.setCenter(marker.getPosition());
                });
            });
            
            // 지도 중심을 가장 첫 번째 병원 위치로 이동
            map.setCenter(new window.kakao.maps.LatLng(locations[0].lat, locations[0].lng));
        }
    }, [locations]);

    return <div id="map" style={{ width: '100%', height: '570px' }}></div>;
};

export default KakaoMap;
