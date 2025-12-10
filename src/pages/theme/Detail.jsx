import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Detail.css";

import MenuBar from "../../components/common/MenuBar";
import FloatingActionButtons from "../../components/common/FloatingActionButtons";

import topImageFallback from "../../assets/detail_top.svg"; 
import thumbImageFallback from "../../assets/detail_thumb.svg"; 
import HeartDefault from "../../assets/Heart.svg";
import HeartFilled from "../../assets/HeartFilled.png";
import MapImage from "../../assets/detail_map.svg";

import { pathsService } from "../../api/paths";


export default function Detail() {

  const { pathId } = useParams(); 
  const navigate = useNavigate();
  const [detail, setDetail] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setErrorMsg("");

        const data = await pathsService.getPathDetail(pathId);

        setDetail(data);
        setLiked(!!data.is_liked);
        setLikeCount(data.likes_count ?? 0);
      } catch (error) {
        setErrorMsg(error.message || "코스 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (pathId) fetchDetail();
  }, [pathId]);

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
                onClick={() => setLiked((prev) => !prev)}
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
            <img
              src={MapImage}
              alt="산책 코스 지도"
              className="detail-map-image"
            />
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
