import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Detail.css";

import MenuBar from "../../components/common/MenuBar";
import FloatingActionButtons from "../../components/common/FloatingActionButtons";
import RouteMap from "../../components/RouteMap";

import topImageFallback from "../../assets/detail_top.svg"; 
import thumbImageFallback from "../../assets/detail_thumb.svg"; 
import HeartDefault from "../../assets/Heart.svg";
import HeartFilled from "../../assets/HeartFilled.png";

import { pathsService } from "../../api/paths";
import { tmapApi } from "../../api/tmap";


export default function Detail() {

  const { pathId } = useParams(); 
  const navigate = useNavigate();
  const [detail, setDetail] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  
  // 지도 관련 상태
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [mapLoading, setMapLoading] = useState(false);

  // Tmap API를 통해 경로 정보 가져오기
  const fetchRoute = async (startX, startY, endX, endY, courseName) => {
    try {
      setMapLoading(true);
      const response = await tmapApi.getPedestrianRoute({
        startX,
        startY,
        endX,
        endY,
        startName: courseName || '출발지',
        endName: courseName || '도착지',
      });

      if (response.isSuccess && response.data.features) {
        const parsedRoute = tmapApi.parseRouteResponse(response.data);
        setRouteCoordinates(parsedRoute.coordinates);
      }
    } catch (error) {
      console.error('경로 정보 조회 실패:', error);
    } finally {
      setMapLoading(false);
    }
  };

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setErrorMsg("");

        const data = await pathsService.getPathDetail(pathId);

        setDetail(data);
        setLiked(!!data.is_liked);
        setLikeCount(data.likes_count ?? 0);

        // 경로 데이터에서 시작/끝 좌표 추출
        if (data.start_location && data.end_location) {
          const [startLat, startLng] = data.start_location.split(',').map(Number);
          const [endLat, endLng] = data.end_location.split(',').map(Number);
          
          setStartPoint({ lat: startLat, lng: startLng });
          setEndPoint({ lat: endLat, lng: endLng });

          // Tmap API 호출하여 경로 정보 가져오기
          await fetchRoute(startLng, startLat, endLng, endLat, data.name);
        }
      } catch (error) {
        setErrorMsg(error.message || "코스 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (pathId) fetchDetail();
  }, [pathId]);

  // 사용자 현재 위치 가져오기 (선택사항)
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.log('위치 정보를 가져올 수 없습니다:', error);
        }
      );
    }
  }, []);

  const handleLikeClick = () => {
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  if (loading) {
    return (
      <div className="detail-screen">
        <main className="detail-body">
          <p>로딩 중...</p>
        </main>
      </div>
    );
  }

  if (errorMsg || !detail) {
    return (
      <div className="detail-screen">
        <main className="detail-body">
          <p>{errorMsg || "코스 정보를 찾을 수 없습니다."}</p>
        </main>
      </div>
    );
  }

   // 이미지 처리
   const images = detail.images || [];
   const topImage = images[0]?.image_url || topImageFallback;
   const thumbImage =
     images.find((img) => img.is_representative)?.image_url ||
     thumbImageFallback;
 
   // 등록일
   const createdAt = detail.created_at
     ? new Date(detail.created_at)
         .toISOString()
         .slice(0, 10)
         .replace(/-/g, ".")
     : "";
 
   // 종류
   const pathTypes = Array.isArray(detail.path_types)
     ? detail.path_types.join(", ")
     : detail.path_types || "";


  return (
    <div className="detail-screen">
      <main className="detail-body">
        <div className="detail-top-image-wrap">
          <img src={topImage} alt="배경 이미지" className="detail-top-image" />
          <img src={thumbImage} alt="썸네일" className="detail-thumb-image" />
        </div>

        <section className="detail-info-section">
          <h2 className="detail-title">{detail.name}</h2>

          <div className="detail-info-grid">
            <div className="detail-info-row">
              <span className="label">종류</span>
              <span className="value">{pathTypes}</span>
            </div>

            <div className="detail-info-row">
              <span className="label">등록일</span>
              <span className="value">{createdAt}</span>
            </div>

            <div className="detail-info-row">
              <span className="label">소개글</span>
              <span className="value">{detail.introduction}</span>
            </div>

            <div className="detail-like-wrap">
              <button
                type="button"
                className="detail-like-btn"
                onClick={handleLikeClick}
              >
                <img
                  src={liked ? HeartFilled : HeartDefault}
                  alt="좋아요"
                  className="detail-like-icon"
                />
              </button>
              <span className="detail-like-count">{likeCount}</span>
            </div>
          </div>


          <button className="detail-start-button" onClick={() => navigate(`/navigation/${pathId}`)}>
            걷기 시작
          </button>
        </section>


        <section className="detail-map-section">
          <div className="detail-map-placeholder">
            {mapLoading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <p>지도를 로딩 중입니다...</p>
              </div>
            ) : (
              <RouteMap
                startPoint={startPoint}
                endPoint={endPoint}
                routeCoordinates={routeCoordinates}
                currentLocation={currentLocation}
              />
            )}
          </div>

          <FloatingActionButtons stepCount={2014} position="inline" />
        </section>``

        <p className="detail-route">
          루트: {detail.start_location}{" "}
          <span className="route-dashed">····</span> {detail.end_location}
        </p>

      </main>

      <MenuBar />
    </div>
  );
}
