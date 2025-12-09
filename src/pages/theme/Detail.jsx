import React from "react";
import "./Detail.css";

import MenuBar from "../../components/common/MenuBar";
import FloatingActionButtons from "../../components/common/FloatingActionButtons";

import topImage from "../../assets/detail_top.svg"; 
import thumbImage from "../../assets/detail_thumb.svg"; 

export default function Detail() {
  return (
    <div className="detail-screen">
      <main className="detail-body">

        <div className="detail-top-image-wrap">
          <img src={topImage} alt="배경 이미지" className="detail-top-image" />
          <img src={thumbImage} alt="썸네일" className="detail-thumb-image" />
        </div>

        <section className="detail-info-section">
          <h2 className="detail-title">매일매일 산책</h2>

          <div className="detail-info-grid">
            <div className="detail-info-row">
              <span className="label">종류</span>
              <span className="value">감성길</span>
            </div>

            <div className="detail-info-row">
              <span className="label">등록일</span>
              <span className="value">2025.11.21</span>
            </div>

            <div className="detail-info-row">
              <span className="label">소개글</span>
              <span className="value">한걸음이라도 여유있게</span>
            </div>

            <div className="detail-like-wrap">
              <button className="detail-like-btn">❤️</button>
              <span className="detail-like-count">347</span>
            </div>
          </div>


          <button className="detail-start-button">걷기 시작</button>
        </section>


        <section className="detail-map-section">
          <div className="detail-map-placeholder">
            {/* 나중에 지도 API*/}
          </div>

          <FloatingActionButtons stepCount={2014} position="inline" />
        </section>

        <p className="detail-route">
          루트: 한성대입구역 <span className="route-dashed">····</span> 혜화역
        </p>

      </main>

      <MenuBar />
    </div>
  );
}
