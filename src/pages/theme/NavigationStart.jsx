import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./NavigationStart.css";

import Foot1 from "../../assets/foot1.svg";
import Foot2 from "../../assets/foot2.svg";
import Foot3 from "../../assets/foot3.svg";
import { walkingService } from "../../api/walking";

export default function NavigationStart() {
  const { pathId } = useParams();
  const navigate = useNavigate();

  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [currentSteps] = useState(244);
  const [totalSteps] = useState(2014);
  const [durationSeconds] = useState(20 * 60 + 58); 
  const [distance] = useState(1200);

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
        steps: totalSteps,
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
