import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MyCarbonFootprint.module.css';
import footprintIcon from '../../assets/product/footprint_icon.svg';

const MyCarbonFootprint = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleEnd = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>나의 탄소발자국</h1>
      </header>

      <main className={styles.content}>
        <div className={styles.metricContainer}>
          <div className={styles.metricItem}>
            <div className={styles.metricSubLabel}>누적 걸음 수</div>
            <div className={`${styles.metricValue} ${styles.largeMetric}`}>24,421<span className={styles.metricLabel}>걸음</span></div>
          </div>
          
          <div className={styles.metricItem}>
            <div className={styles.metricSubLabel}>총 거리</div>
            <div className={`${styles.metricValue} ${styles.mediumMetric}`}>42<span className={styles.metricLabel}>km</span></div>
          </div>
          
          <div className={styles.metricItem}>
            <div className={styles.metricSubLabel}>절감 탄소량</div>
            <div className={`${styles.metricValue} ${styles.mediumMetric}`}>42<span className={styles.metricLabel}>kg</span></div>
          </div>
        </div>

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
