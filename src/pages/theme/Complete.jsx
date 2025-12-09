import React from "react";
import { useLocation } from "react-router-dom";
import "./Complete.css";
import MenuBar from "../../components/common/MenuBar";
import FloatingActionButtons from "../../components/common/FloatingActionButtons";

function formatDuration(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}분${s.toString().padStart(2, "0")}초`;
}

export default function Complete() {

  const { state } = useLocation();
  const result = state?.walkingResult;

  const steps = result?.steps ?? 244;
  const duration = result?.duration ?? 20 * 60 + 58;
  const totalDistance = result?.distance ?? 1200;
  const pathName = result?.path_name ?? "매일매일 산책";
  const walkedAt = result?.walked_at
    ? new Date(result.walked_at).toISOString().slice(0, 10).replace(/-/g, ".")
    : "2025.11.21";

  return (
    <div className="complete-screen">
      <main className="complete-body">
        <header className="complete-header">
          <p className="complete-subtitle">{pathName}</p>

          <h1 className="complete-steps">
            <span className="complete-steps-number">{steps}</span>
            <span className="complete-steps-unit"> 걸음</span>
          </h1>

          <div className="complete-meta-row">
            <span className="complete-meta-label">현재 걸음 수</span>
            <span className="complete-meta-value">
              총 소요시간 <strong>{formatDuration(duration)}</strong>
            </span>
          </div>
        </header>

        <section className="complete-info">
          <div className="complete-info-left">
            <div className="complete-info-row">
              <span className="info-label">종류</span>
              <span className="info-value">감성길</span>
            </div>
            <div className="complete-info-row">
              <span className="info-label">날짜</span>
              <span className="info-value">{walkedAt}</span>
            </div>
            <div className="complete-info-row">
              <span className="info-label">이동 거리</span>
              <span className="info-value">
                {totalDistance}m
              </span>
            </div>
          </div>

          <div className="complete-like">
            <button type="button" className="complete-like-btn">
              ♡
            </button>
            <span className="complete-like-count">347</span>
          </div>
        </section>


        <section className="complete-map-section">
          {/* 나중에 지도 이미지 / API  */}
          <div className="complete-map-placeholder"></div>

          <div className="complete-fab-wrap">
            <FloatingActionButtons />
          </div>
        </section>
        <p className="complete-route">
          루트: 한성대입구역 <span className="route-dashed">····</span> 혜화역
        </p>
      </main>

      <MenuBar />
    </div>
  );
}
