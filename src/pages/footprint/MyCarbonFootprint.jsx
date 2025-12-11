import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MyCarbonFootprint.module.css';
import footprintIcon from '../../assets/product/footprint_icon.svg';

// API_BASE_URL에서 마지막에 슬래시(/)가 있다면 제거
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL.replace(/\/+$/, '');

const MyCarbonFootprint = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [walkingData, setWalkingData] = useState({
    total_walks: 0,
    completed_walks: 0,
    total_steps: 0,
    total_distance_km: 0,
    total_carbon_saved_kg: 0
  });

  useEffect(() => {
    const fetchWalkingSummary = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          throw new Error('로그인이 필요합니다.');
        }
        const response = await fetch(`${API_BASE_URL}/walking/summary`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch walking summary');
        }

        const data = await response.json();
        if (data.isSuccess && data.data) {
          setWalkingData(data.data);
        }
      } catch (err) {
        console.error('Error fetching walking summary:', err);
        setError('산책 통계를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchWalkingSummary();
  }, []);

  const handleEnd = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>나의 탄소발자국</h1>
      </header>

      <main className={styles.content}>
        {loading ? (
          <div className={styles.loading}>로딩 중...</div>
        ) : error ? (
          <div className={styles.error}>{error}</div>
        ) : (
          <div className={styles.metricContainer}>
            <div className={styles.metricItem}>
              <div className={styles.metricSubLabel}>총 산책 횟수</div>
              <div className={`${styles.metricValue} ${styles.mediumMetric}`}>
                {walkingData.total_walks.toLocaleString()}<span className={styles.metricLabel}>회</span>
              </div>
            </div>
            
            <div className={styles.metricItem}>
              <div className={styles.metricSubLabel}>완료한 산책</div>
              <div className={`${styles.metricValue} ${styles.mediumMetric}`}>
                {walkingData.completed_walks.toLocaleString()}<span className={styles.metricLabel}>회</span>
              </div>
            </div>
            
            <div className={styles.metricItem}>
              <div className={styles.metricSubLabel}>누적 걸음 수</div>
              <div className={`${styles.metricValue} ${styles.largeMetric}`}>
                {walkingData.total_steps.toLocaleString()}<span className={styles.metricLabel}>걸음</span>
              </div>
            </div>
            
            <div className={styles.metricItem}>
              <div className={styles.metricSubLabel}>총 거리</div>
              <div className={`${styles.metricValue} ${styles.mediumMetric}`}>
                {walkingData.total_distance_km.toFixed(1)}<span className={styles.metricLabel}>km</span>
              </div>
            </div>
            
            <div className={styles.metricItem}>
              <div className={styles.metricSubLabel}>절감 탄소량</div>
              <div className={`${styles.metricValue} ${styles.mediumMetric}`}>
                {walkingData.total_carbon_saved_kg.toFixed(1)}<span className={styles.metricLabel}>kg</span>
              </div>
            </div>
          </div>
        )}

        <div className={styles.footprintContainer}>
          <img src={footprintIcon} alt="" className={styles.footprintIcon} />
        </div>

        <button className={styles.endButton} onClick={handleEnd}>
          종료하기
        </button>
      </main>
    </div>
  );
};

export default MyCarbonFootprint;
