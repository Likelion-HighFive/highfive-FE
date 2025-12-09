import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./NavigationStart.css";

import Foot1 from "../../assets/foot1.svg";
import Foot2 from "../../assets/foot2.svg";
import Foot3 from "../../assets/foot3.svg";
import { walkingService } from "../../api/walking";

export default function NavigationStart() {
  const { pathId } = useParams();

  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

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
        
        <h1 className="nav-current-step">244 걸음</h1>
        <p className="nav-label">현재 걸음 수</p>
        <p className="nav-total-steps">누적 걸음 수 2,014</p>

        <button
          className="nav-stop-button"
          onClick={() => {
            console.log("세션 종료 (sessionId):", sessionId);
          }}
        >
          걷기 종료하기
        </button>
      </div>

    </div>
  );
}
