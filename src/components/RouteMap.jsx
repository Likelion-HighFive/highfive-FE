import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './RouteMap.module.css';

const RouteMap = ({
  startPoint = null,
  endPoint = null,
  routeCoordinates = [],
  currentLocation = null,
  instructions = [],
}) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const routeLayerGroup = useRef(null);
  const markerLayerGroup = useRef(null);
  const userLocationMarker = useRef(null);

  // 지도 초기화
  useEffect(() => {
    if (!mapContainer.current) return;

    // 시작 위치 필수
    if (!startPoint) {
      return;
    }
    
    map.current = L.map(mapContainer.current).setView([startPoint.lat, startPoint.lng], 13);

    // OSM 타일
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map.current);

    routeLayerGroup.current = L.layerGroup().addTo(map.current);
    markerLayerGroup.current = L.layerGroup().addTo(map.current);

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [startPoint]);

  // 경로 polyline 그리기
  useEffect(() => {
    if (!map.current || !routeLayerGroup.current || routeCoordinates.length === 0) {
      return;
    }

    routeLayerGroup.current.clearLayers();

    // polyline 그리기
    const latLngs = routeCoordinates.map((coord) => [coord.lat, coord.lng]);
    const polyline = L.polyline(latLngs, {
      color: '#3388ff',
      weight: 5,
      opacity: 0.8,
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(routeLayerGroup.current);

    // 시작/끝 위치에 포커싱
    map.current.fitBounds(polyline.getBounds(), { padding: [50, 50] });
  }, [routeCoordinates]);

  // 출발지/도착지 마커
  useEffect(() => {
    if (!map.current || !markerLayerGroup.current) return;

    markerLayerGroup.current.clearLayers();

    // 출발지 (초록색)
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

    // 도착지 (빨간색)
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

  // 현재 위치 표시
  useEffect(() => {
    if (!map.current) return;

    if (currentLocation) {
      if (userLocationMarker.current) {
        userLocationMarker.current.remove();
      }

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
