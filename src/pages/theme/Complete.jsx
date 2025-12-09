import React from "react";
import "./Complete.css";
import MenuBar from "../../components/common/MenuBar";
import FloatingActionButtons from "../../components/common/FloatingActionButtons";

export default function Complete() {
  return (
    <div className="complete-screen">
      <main className="complete-body">
        <header className="complete-header">
          <p className="complete-subtitle">매일매일 산책</p>

          <h1 className="complete-steps">
            <span className="complete-steps-number">244</span>
            <span className="complete-steps-unit"> 걸음</span>
          </h1>

          <div className="complete-meta-row">
            <span className="complete-meta-label">현재 걸음 수</span>
            <span className="complete-meta-value">
              총 소요시간 <strong>20분58초</strong>
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
              <span className="info-label">등록일</span>
              <span className="info-value">2025.11.21</span>
            </div>
            <div className="complete-info-row">
              <span className="info-label">소개글</span>
              <span className="info-value">한걸음이라도 여유있게</span>
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
