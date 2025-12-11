import { useEffect, useRef, useState } from 'react';
import styles from './RouteMap.module.css';
import { loadKakaoMapScript } from '../utils/loadKakaoMapScript';
import { loadGoogleMapsScript } from '../utils/loadGoogleMapsScript';

// RouteMap 컴포넌트 - Kakao Maps 또는 Google Maps를 사용한 지도 표시
const RouteMap = ({
  startPoint = null,
  endPoint = null,
  routeCoordinates = [],
  currentLocation = null,
  instructions = [],
  useGoogle = false, // Google Maps 사용 여부
  navigationMode = false, // 네비게이션 모드 (현재 위치 중심, 자동 추적)
}) => {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const polylinesRef = useRef([]);
  const [isMapReady, setIsMapReady] = useState(false);

  // Maps SDK 로드 및 지도 초기화
  useEffect(() => {
    if (!mapContainer.current) return;

    const initMap = async () => {
      try {
        if (useGoogle) {
          // Google Maps 초기화
          await loadGoogleMapsScript();

          if (!window.google || !window.google.maps) {
            console.warn('Google Maps SDK 로드 실패');
            return;
          }

          const centerLat = startPoint?.lat || 37.56259379;
          const centerLng = startPoint?.lng || 126.99243652;

          const map = new window.google.maps.Map(mapContainer.current, {
            center: { lat: centerLat, lng: centerLng },
            zoom: navigationMode ? 17 : 15, // 네비 모드에서 더 확대
            disableDefaultUI: navigationMode, // 네비 모드에서 UI 숨김
            zoomControl: !navigationMode,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
          });

          mapRef.current = map;
          setIsMapReady(true);
          console.log('Google Maps 초기화 완료');
        } else {
          // Kakao Maps 초기화
          await loadKakaoMapScript();

          if (!window.kakao || !window.kakao.maps) {
            console.warn('Kakao Maps SDK 로드 실패');
            return;
          }

          const centerLat = startPoint?.lat || 37.56259379;
          const centerLng = startPoint?.lng || 126.99243652;

          const options = {
            center: new window.kakao.maps.LatLng(centerLat, centerLng),
            level: 3,
          };

          const map = new window.kakao.maps.Map(mapContainer.current, options);
          mapRef.current = map;
          setIsMapReady(true);
          console.log('Kakao Maps 초기화 완료');
        }
      } catch (error) {
        console.error('지도 초기화 실패:', error);
      }
    };

    initMap();

    return () => {
      // 정리: 마커와 폴리라인 제거
      markersRef.current.forEach((marker) => {
        if (marker) {
          if (useGoogle) {
            marker.setMap(null);
          } else {
            marker.setMap(null);
          }
        }
      });
      markersRef.current = [];

      polylinesRef.current.forEach((polyline) => {
        if (polyline) polyline.setMap(null);
      });
      polylinesRef.current = [];
      setIsMapReady(false);
    };
  }, [startPoint, useGoogle, navigationMode]);

  // 경로 폴리라인 그리기
  useEffect(() => {
    if (!isMapReady || !mapRef.current || routeCoordinates.length === 0) {
      console.log('경로 좌표 없음 또는 지도 준비 안됨');
      return;
    }

    console.log('경로 폴리라인 그리기 시작:', routeCoordinates.length);

    // 기존 폴리라인 제거
    polylinesRef.current.forEach((polyline) => {
      if (polyline) polyline.setMap(null);
    });
    polylinesRef.current = [];

    if (useGoogle && window.google) {
      // Google Maps 폴리라인
      const pathPoints = routeCoordinates.map((coord) => ({
        lat: coord.lat,
        lng: coord.lng,
      }));

      if (pathPoints.length > 1) {
        const polyline = new window.google.maps.Polyline({
          path: pathPoints,
          geodesic: true,
          strokeColor: '#4A90E2',
          strokeOpacity: 0.9,
          strokeWeight: 6,
        });
        polyline.setMap(mapRef.current);
        polylinesRef.current.push(polyline);

        console.log('Google 폴리라인 그리기 완료');

        // 지도 중심 조정
        const bounds = new window.google.maps.LatLngBounds();
        pathPoints.forEach((point) => {
          bounds.extend(point);
        });
        mapRef.current.fitBounds(bounds);
      }
    } else if (window.kakao) {
      // Kakao Maps 폴리라인
      const pathPoints = routeCoordinates.map(
        (coord) => new window.kakao.maps.LatLng(coord.lat, coord.lng)
      );

      if (pathPoints.length > 1) {
        // 흰색 배경 폴리라인
        const polyline1 = new window.kakao.maps.Polyline({
          path: pathPoints,
          strokeWeight: 10,
          strokeColor: '#FFFFFF',
          strokeOpacity: 0.8,
          strokeStyle: 'solid',
        });
        polyline1.setMap(mapRef.current);
        polylinesRef.current.push(polyline1);

        // 파란색 경로 폴리라인
        const polyline2 = new window.kakao.maps.Polyline({
          path: pathPoints,
          strokeWeight: 6,
          strokeColor: '#4A90E2',
          strokeOpacity: 0.9,
          strokeStyle: 'solid',
        });
        polyline2.setMap(mapRef.current);
        polylinesRef.current.push(polyline2);

        console.log('Kakao 폴리라인 그리기 완료');

        // 지도 중심 조정
        try {
          const bounds = new window.kakao.maps.LatLngBounds();
          pathPoints.forEach((point) => {
            bounds.extend(point);
          });
          mapRef.current.setBounds(bounds);
        } catch (error) {
          console.warn('setBounds 처리 중 에러:', error);
        }
      }
    }
  }, [isMapReady, routeCoordinates, useGoogle]);

  // 출발지/도착지 마커 표시
  useEffect(() => {
    if (!isMapReady || !mapRef.current || (!startPoint && !endPoint)) return;

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

    if (useGoogle && window.google) {
      // Google Maps 마커
      if (startPoint) {
        const startMarker = new window.google.maps.Marker({
          position: { lat: startPoint.lat, lng: startPoint.lng },
          map: mapRef.current,
          label: '출발',
          icon: {
            url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
          },
        });
        startMarker._userData = { type: 'start' };
        markersRef.current.push(startMarker);
      }

      if (endPoint) {
        const endMarker = new window.google.maps.Marker({
          position: { lat: endPoint.lat, lng: endPoint.lng },
          map: mapRef.current,
          label: '도착',
          icon: {
            url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
          },
        });
        endMarker._userData = { type: 'end' };
        markersRef.current.push(endMarker);
      }
    } else if (window.kakao) {
      // Kakao Maps 마커
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
      }

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
      }
    }

    console.log('마커 추가 완료');
  }, [isMapReady, startPoint, endPoint, useGoogle]);

  // 현재 위치 마커 표시 및 네비게이션 모드 지도 중심 이동
  useEffect(() => {
    if (!isMapReady || !mapRef.current || !currentLocation) return;

    console.log('현재 위치 마커 표시:', currentLocation);

    // 기존 현재위치 마커 제거
    const existingLocationMarker = markersRef.current.find((m) => m._userData?.type === 'current');
    if (existingLocationMarker) {
      existingLocationMarker.setMap(null);
      markersRef.current = markersRef.current.filter((m) => m._userData?.type !== 'current');
    }

    if (useGoogle && window.google) {
      // Google Maps 현재 위치 마커
      const locationMarker = new window.google.maps.Marker({
        position: { lat: currentLocation.lat, lng: currentLocation.lng },
        map: mapRef.current,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#4285F4',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 3,
        },
        zIndex: 1000, // 최상위 표시
      });
      locationMarker._userData = { type: 'current' };
      markersRef.current.push(locationMarker);

      // 네비게이션 모드에서 지도 중심을 현재 위치로 이동
      if (navigationMode) {
        mapRef.current.panTo({ lat: currentLocation.lat, lng: currentLocation.lng });
        mapRef.current.setZoom(18); // 더 확대
      }
    } else if (window.kakao) {
      // Kakao Maps 현재 위치 마커
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

      // 네비게이션 모드에서 지도 중심을 현재 위치로 이동
      if (navigationMode) {
        const moveLatLon = new window.kakao.maps.LatLng(currentLocation.lat, currentLocation.lng);
        mapRef.current.panTo(moveLatLon);
      }
    }
  }, [isMapReady, currentLocation, useGoogle, navigationMode]);

  // 안내 포인트 마커 표시
  useEffect(() => {
    if (!isMapReady || !mapRef.current || instructions.length === 0) return;

    console.log('안내 포인트 마커 표시:', instructions.length);

    // 기존 안내 포인트 제거
    const instructionMarkers = markersRef.current.filter((m) => m._userData?.type === 'instruction');
    instructionMarkers.forEach((marker) => {
      if (marker) marker.setMap(null);
    });
    markersRef.current = markersRef.current.filter((m) => m._userData?.type !== 'instruction');

    if (useGoogle && window.google) {
      // Google Maps 안내 포인트 마커
      instructions.forEach((instruction, index) => {
        if (instruction.coordinates) {
          const instructionMarker = new window.google.maps.Marker({
            position: { lat: instruction.coordinates.lat, lng: instruction.coordinates.lng },
            map: mapRef.current,
            label: String(index + 1),
          });
          instructionMarker._userData = { type: 'instruction', index };
          markersRef.current.push(instructionMarker);
        }
      });
    } else if (window.kakao) {
      // Kakao Maps 안내 포인트 마커
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
    }
  }, [isMapReady, instructions, useGoogle]);

  return (
    <div className={styles.mapContainer}>
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default RouteMap;
