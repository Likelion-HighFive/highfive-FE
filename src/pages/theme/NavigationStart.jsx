import React from "react";
import "./NavigationStart.css";

import Foot1 from "../../assets/foot1.svg";
import Foot2 from "../../assets/foot2.svg";
import Foot3 from "../../assets/foot3.svg";

export default function NavigationStart() {
  return (
    <div className="nav-start-screen">

      {/* 지도 자리 (현재는 빈 박스) */}
      <div className="nav-map-placeholder">
        {/* 이 안에 나중에 지도 API 넣을 예정 */}
      </div>

      {/* 아래 보라색 영역 */}
      <div className="nav-info-section">

      <img src={Foot1} className="foot-img foot1" alt="foot" />
        <img src={Foot2} className="foot-img foot2" alt="foot" />
        <img src={Foot3} className="foot-img foot3" alt="foot" />
        
        <h1 className="nav-current-step">244 걸음</h1>
        <p className="nav-label">현재 걸음 수</p>
        <p className="nav-total-steps">누적 걸음 수 2,014</p>

        <button className="nav-stop-button">걷기 종료하기</button>
      </div>

    </div>
  );
}
