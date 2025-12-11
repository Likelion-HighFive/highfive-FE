import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./NavigationStart.css";

import Foot1 from "../../assets/foot1.svg";
import Foot2 from "../../assets/foot2.svg";
import Foot3 from "../../assets/foot3.svg";
import { walkingService } from "../../api/walking";
import RouteMap from "../../components/RouteMap";
import { googleApi } from "../../api/google";

export default function NavigationStart() {
  const { pathId } = useParams();
  const navigate = useNavigate();

  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [currentSteps, setCurrentSteps] = useState(0);
  const [totalSteps] = useState(2014);
  const [durationSeconds] = useState(20 * 60 + 58);
  const [distance] = useState(1200);

  // 경로 데이터
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [mapLoading, setMapLoading] = useState(false);

  const startPoint = { lat: 37.562055, lng: 126.922765 };
  const endPoint = { lat: 37.566315, lng: 126.923821 };

  // Google Maps 경로 가져오기
  useEffect(() => {
    const fetchRoute = async () => {
      try {
        setMapLoading(true);
        const response = await googleApi.getWalkingRoute({
          startX: startPoint.lng,
          startY: startPoint.lat,
          endX: endPoint.lng,
          endY: endPoint.lat,
        });

        if (response.isSuccess && response.data) {
          const parsedRoute = googleApi.parseRouteResponse(response.data);
          setRouteCoordinates(parsedRoute.coordinates);
        }
      } catch (error) {
        console.error('경로 조회 실패:', error);
      } finally {
        setMapLoading(false);
      }
    };

    fetchRoute();
  }, []);

  // 실시간 위치 추적
  useEffect(() => {
    if (!navigator.geolocation) return;

    // 초기 위치 설정
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

    // 실시간 위치 추적 시작
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        console.log('위치 업데이트:', position.coords);
      },
      (error) => {
        console.log('위치 추적 오류:', error);
      },
      {
        enableHighAccuracy: true, // 높은 정확도
        maximumAge: 0, // 캐시 사용 안함
        timeout: 5000, // 5초 타임아웃
      }
    );

    // 정리: 위치 추적 중단
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  // 걸음 수 카운트 (타이머 + 디바이스 모션 모두 작동)
  useEffect(() => {
    let stepInterval = null;
    let lastAcceleration = { x: 0, y: 0, z: 0 };
    let stepThreshold = 1.5;

    // 타이머 기반 자동 증가 (항상 실행)
    stepInterval = setInterval(() => {
      setCurrentSteps((prev) => prev + Math.floor(Math.random() * 2 + 1)); // 1-2걸음씩 증가
    }, 1500); // 1.5초마다

    // DeviceMotion 이벤트 (추가로 흔들면 더 증가)
    const handleMotion = (event) => {
      if (event.accelerationIncludingGravity) {
        const { x, y, z } = event.accelerationIncludingGravity;

        const deltaX = Math.abs(x - lastAcceleration.x);
        const deltaY = Math.abs(y - lastAcceleration.y);
        const deltaZ = Math.abs(z - lastAcceleration.z);

        const totalDelta = deltaX + deltaY + deltaZ;

        // 흔들림 감지 시 추가 걸음
        if (totalDelta > stepThreshold) {
          setCurrentSteps((prev) => prev + 1);
        }

        lastAcceleration = { x, y, z };
      }
    };

    // DeviceMotion 권한 요청 (iOS)
    const requestMotionPermission = async () => {
      if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
        try {
          const permission = await DeviceMotionEvent.requestPermission();
          if (permission === 'granted') {
            window.addEventListener('devicemotion', handleMotion);
            console.log('DeviceMotion 권한 승인됨');
          }
        } catch (error) {
          console.log('DeviceMotion 권한 요청 실패');
        }
      } else if (window.DeviceMotionEvent) {
        window.addEventListener('devicemotion', handleMotion);
        console.log('DeviceMotion 이벤트 시작');
      }
    };

    requestMotionPermission();

    // 정리
    return () => {
      if (stepInterval) {
        clearInterval(stepInterval);
      }
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, []);

  useEffect(() => {
    const startWalking = async () => {
      if (!pathId) {
        setErrorMsg("코스 ID가 없습니다.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setErrorMsg("");

        const data = await walkingService.startSession(pathId);

        setSessionId(data.session_id);

        localStorage.setItem("walkingSessionId", data.session_id);
        localStorage.setItem("walkingPathId", data.path_id);
      } catch (error) {
        setErrorMsg(error.message || "산책 세션을 시작할 수 없습니다.");
      } finally {
        setLoading(false);
      }
    };

    startWalking();
  }, [pathId]);

  const handleEndClick = async () => {
    try {
      if (!sessionId) {
        throw new Error("세션 정보가 없습니다.");
      }

      const result = await walkingService.endSession({
        sessionId,
        pathId,
        steps: currentSteps, // 실제 걸음 수 사용
        duration: durationSeconds,
        distance,
        isCompleted: true,
      });

      navigate("/complete", { state: { walkingResult: result } });
    } catch (error) {
      alert(error.message || "산책 종료 중 오류가 발생했습니다.");
    }
  };

  if (loading) {
    return <p>산책 세션을 시작하는 중...</p>;
  }

  if (errorMsg) {
    return <p>{errorMsg}</p>;
  }

  return (
    <div className="nav-start-screen">
      <div className="nav-map-placeholder">
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
            useGoogle={true}
            navigationMode={true}
          />
        )}
      </div>

      <div className="nav-info-section">

      <img src={Foot1} className="foot-img foot1" alt="foot" />
        <img src={Foot2} className="foot-img foot2" alt="foot" />
        <img src={Foot3} className="foot-img foot3" alt="foot" />

        <h1 className="nav-current-step">{currentSteps} 걸음</h1>
        <p className="nav-label">현재 걸음 수</p>
        <p className="nav-total-steps">누적 걸음 수 {totalSteps.toLocaleString()}</p>

        <button
          className="nav-stop-button"
          onClick={handleEndClick}
        >
          걷기 종료하기
        </button>
      </div>

    </div>
  );
}
