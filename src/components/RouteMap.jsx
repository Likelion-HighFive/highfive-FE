import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './RouteMap.module.css';

/**
 * 경로 지도 표시 컴포넌트
 * Leaflet 기반 지도에 Tmap API로부터 받은 경로를 표시
 */
const RouteMap = ({
  startPoint = null, // { lat: number, lng: number }
  endPoint = null, // { lat: number, lng: number }
  routeCoordinates = [], // [{ lat, lng }, ...]
  currentLocation = null, // { lat: number, lng: number } - 사용자 현재 위치
  instructions = [], // turn-by-turn 안내 데이터
}) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const routeLayerGroup = useRef(null);
  const markerLayerGroup = useRef(null);
  const userLocationMarker = useRef(null);

  // 지도 초기화
  useEffect(() => {
    if (!mapContainer.current) return;

    // 기본 중심점 (서울)
    const defaultCenter = [37.5665, 126.978];
    
    map.current = L.map(mapContainer.current).setView(defaultCenter, 13);

    // OSM 타일 추가
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map.current);

    // 레이어 그룹 생성 (경로와 마커를 관리하기 위함)
    routeLayerGroup.current = L.layerGroup().addTo(map.current);
    markerLayerGroup.current = L.layerGroup().addTo(map.current);

    // cleanup
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // 경로 표시
  useEffect(() => {
    if (!map.current || !routeLayerGroup.current || routeCoordinates.length === 0) {
      return;
    }

    // 기존 경로 레이어 제거
    routeLayerGroup.current.clearLayers();

    // 경로 polyline 그리기
    const latLngs = routeCoordinates.map((coord) => [coord.lat, coord.lng]);
    const polyline = L.polyline(latLngs, {
      color: '#3388ff',
      weight: 5,
      opacity: 0.8,
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(routeLayerGroup.current);

    // 경로에 맞춰 지도 줌/팬 조정
    map.current.fitBounds(polyline.getBounds(), { padding: [50, 50] });
  }, [routeCoordinates]);

  // 출발지, 도착지 마커 표시
  useEffect(() => {
    if (!map.current || !markerLayerGroup.current) return;

    markerLayerGroup.current.clearLayers();

    // 출발지 마커 (초록색)
    if (startPoint) {
      L.marker([startPoint.lat, startPoint.lng], {
        icon: L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        }),
      })
        .bindPopup('출발지')
        .addTo(markerLayerGroup.current);
    }

    // 도착지 마커 (빨간색)
    if (endPoint) {
      L.marker([endPoint.lat, endPoint.lng], {
        icon: L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        }),
      })
        .bindPopup('도착지')
        .addTo(markerLayerGroup.current);
    }
  }, [startPoint, endPoint]);

  // 사용자 현재 위치 표시 (파란색 원형)
  useEffect(() => {
    if (!map.current) return;

    if (currentLocation) {
      // 기존 마커 제거
      if (userLocationMarker.current) {
        userLocationMarker.current.remove();
      }

      // 새로운 위치 마커 추가
      userLocationMarker.current = L.circleMarker([currentLocation.lat, currentLocation.lng], {
        radius: 8,
        fillColor: '#2196F3',
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8,
      })
        .addTo(map.current)
        .bindPopup('현재 위치');

      // 현재 위치로 이동
      map.current.panTo([currentLocation.lat, currentLocation.lng]);
    } else if (userLocationMarker.current) {
      userLocationMarker.current.remove();
      userLocationMarker.current = null;
    }
  }, [currentLocation]);

  // 안내 포인트 표시
  useEffect(() => {
    if (!map.current || !markerLayerGroup.current || instructions.length === 0) {
      return;
    }

    instructions.forEach((instruction) => {
      const { coordinates, text } = instruction;
      if (coordinates) {
        L.circleMarker([coordinates.lat, coordinates.lng], {
          radius: 5,
          fillColor: '#FFA500',
          color: '#fff',
          weight: 1,
          opacity: 1,
          fillOpacity: 0.7,
        })
          .bindPopup(text)
          .addTo(markerLayerGroup.current);
      }
    });
  }, [instructions]);

  return <div className={styles.mapContainer} ref={mapContainer} />;
};

export default RouteMap;
