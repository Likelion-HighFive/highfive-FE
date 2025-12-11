import { useEffect, useRef, useState } from 'react';
import styles from './RouteMap.module.css';
import { loadKakaoMapScript } from '../utils/loadKakaoMapScript';

// RouteMap 컴포넌트 - Kakao Maps를 사용한 지도 표시
const RouteMap = ({
  startPoint = null,
  endPoint = null,
  routeCoordinates = [],
  currentLocation = null,
  instructions = [],
}) => {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const polylinesRef = useRef([]);
  const [isMapReady, setIsMapReady] = useState(false);

  // Kakao Maps SDK 로드 및 지도 초기화
  useEffect(() => {
    if (!mapContainer.current) return;

    const initMap = async () => {
      try {
        // SDK 로드 대기
        await loadKakaoMapScript();

        if (!window.kakao || !window.kakao.maps) {
          console.warn('Kakao Maps SDK 로드 실패');
          return;
        }

        // 시작점 기본값
        const centerLat = startPoint?.lat || 37.56259379;
        const centerLng = startPoint?.lng || 126.99243652;

        // Kakao 지도 생성
        const options = {
          center: new window.kakao.maps.LatLng(centerLat, centerLng),
          level: 3,
        };

        const map = new window.kakao.maps.Map(mapContainer.current, options);
        mapRef.current = map;
        setIsMapReady(true);
        console.log('Kakao Maps 초기화 완료');
      } catch (error) {
        console.error('지도 초기화 실패:', error);
      }
    };

    initMap();

    return () => {
      // 정리: 마커와 폴리라인 제거
      markersRef.current.forEach((marker) => {
        if (marker) marker.setMap(null);
      });
      markersRef.current = [];

      polylinesRef.current.forEach((polyline) => {
        if (polyline) polyline.setMap(null);
      });
      polylinesRef.current = [];
      setIsMapReady(false);
    };
  }, [startPoint]);

  // 경로 폴리라인 그리기
  useEffect(() => {
    if (!isMapReady || !mapRef.current || !window.kakao || routeCoordinates.length === 0) {
      console.log('경로 좌표 없음 또는 지도 준비 안됨');
      return;
    }

    console.log('경로 폴리라인 그리기 시작:', routeCoordinates.length);

    // 기존 폴리라인 제거
    polylinesRef.current.forEach((polyline) => {
      if (polyline) polyline.setMap(null);
    });
    polylinesRef.current = [];

    // 좌표를 Kakao LatLng로 변환
    const pathPoints = routeCoordinates.map(
      (coord) => new window.kakao.maps.LatLng(coord.lat, coord.lng)
    );

    if (pathPoints.length > 1) {
      // 흰색 배경 폴리라인 (두께 10px)
      const polyline1 = new window.kakao.maps.Polyline({
        path: pathPoints,
        strokeWeight: 10,
        strokeColor: '#FFFFFF',
        strokeOpacity: 0.8,
        strokeStyle: 'solid',
      });
      polyline1.setMap(mapRef.current);
      polylinesRef.current.push(polyline1);

      // 파란색 경로 폴리라인 (두께 6px)
      const polyline2 = new window.kakao.maps.Polyline({
        path: pathPoints,
        strokeWeight: 6,
        strokeColor: '#4A90E2',
        strokeOpacity: 0.9,
        strokeStyle: 'solid',
      });
      polyline2.setMap(mapRef.current);
      polylinesRef.current.push(polyline2);

      console.log('폴리라인 그리기 완료');

      // 지도 중심을 경로에 맞게 조정
      try {
        const bounds = new window.kakao.maps.LatLngBounds();
        pathPoints.forEach((point) => {
          bounds.extend(point);
        });
        mapRef.current.setBounds(bounds);
        console.log('지도 중심 조정 완료');
      } catch (error) {
        console.warn('setBounds 처리 중 에러:', error);
      }
    }
  }, [isMapReady, routeCoordinates]);

  // 출발지/도착지 마커 표시
  useEffect(() => {
    if (!isMapReady || !mapRef.current || !window.kakao || (!startPoint && !endPoint)) return;

    console.log('출발/도착 마커 표시:', { startPoint, endPoint });

    // 기존 시작/종료 마커 제거
    markersRef.current
      .filter((m) => m._userData?.type !== 'current' && m._userData?.type !== 'instruction')
      .forEach((marker) => {
        if (marker) marker.setMap(null);
      });
    markersRef.current = markersRef.current.filter(
      (m) => m._userData?.type === 'current' || m._userData?.type === 'instruction'
    );

    // 출발지 마커
    if (startPoint) {
      const startMarkerImage = new window.kakao.maps.MarkerImage(
        'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/red_b.png',
        new window.kakao.maps.Size(50, 45),
        { offset: new window.kakao.maps.Point(15, 43) }
      );

      const startMarker = new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(startPoint.lat, startPoint.lng),
        image: startMarkerImage,
      });
      startMarker.setMap(mapRef.current);
      startMarker._userData = { type: 'start' };
      markersRef.current.push(startMarker);
      console.log('출발지 마커 추가:', startPoint);
    }

    // 도착지 마커
    if (endPoint) {
      const endMarkerImage = new window.kakao.maps.MarkerImage(
        'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/blue_b.png',
        new window.kakao.maps.Size(50, 45),
        { offset: new window.kakao.maps.Point(15, 43) }
      );

      const endMarker = new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(endPoint.lat, endPoint.lng),
        image: endMarkerImage,
      });
      endMarker.setMap(mapRef.current);
      endMarker._userData = { type: 'end' };
      markersRef.current.push(endMarker);
      console.log('도착지 마커 추가:', endPoint);
    }
  }, [isMapReady, startPoint, endPoint]);

  // 현재 위치 마커 표시
  useEffect(() => {
    if (!isMapReady || !mapRef.current || !window.kakao || !currentLocation) return;

    console.log('현재 위치 마커 표시:', currentLocation);

    // 기존 현재위치 마커 제거
    const existingLocationMarker = markersRef.current.find((m) => m._userData?.type === 'current');
    if (existingLocationMarker) {
      existingLocationMarker.setMap(null);
      markersRef.current = markersRef.current.filter((m) => m._userData?.type !== 'current');
    }

    // 현재 위치 마커 추가
    const locationMarker = new window.kakao.maps.Marker({
      position: new window.kakao.maps.LatLng(currentLocation.lat, currentLocation.lng),
      image: new window.kakao.maps.MarkerImage(
        'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png',
        new window.kakao.maps.Size(24, 35)
      ),
    });
    locationMarker.setMap(mapRef.current);
    locationMarker._userData = { type: 'current' };
    markersRef.current.push(locationMarker);
  }, [isMapReady, currentLocation]);

  // 안내 포인트 마커 표시
  useEffect(() => {
    if (!isMapReady || !mapRef.current || !window.kakao || instructions.length === 0) return;

    console.log('안내 포인트 마커 표시:', instructions.length);

    // 기존 안내 포인트 제거
    const instructionMarkers = markersRef.current.filter((m) => m._userData?.type === 'instruction');
    instructionMarkers.forEach((marker) => {
      if (marker) marker.setMap(null);
    });
    markersRef.current = markersRef.current.filter((m) => m._userData?.type !== 'instruction');

    // 각 안내 포인트 마커 추가
    instructions.forEach((instruction, index) => {
      if (instruction.coordinates) {
        const instructionMarker = new window.kakao.maps.Marker({
          position: new window.kakao.maps.LatLng(
            instruction.coordinates.lat,
            instruction.coordinates.lng
          ),
        });
        instructionMarker.setMap(mapRef.current);
        instructionMarker._userData = { type: 'instruction', index };
        markersRef.current.push(instructionMarker);
      }
    });
  }, [isMapReady, instructions]);

  return (
    <div className={styles.mapContainer}>
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default RouteMap;
