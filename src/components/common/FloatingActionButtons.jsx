import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './FloatingActionButtons.module.css';
import plusButton from '../../assets/icons/plus_button.svg';
import walkButton from '../../assets/icons/walk_button.svg';

const FloatingActionButtons = ({ stepCount = 0, isHome = false }) => {
  const navigate = useNavigate();
  
  const handleShowSteps = () => {
    navigate('/footprint');
  };

  const handleAddPath = () => {
    navigate('/create-path');
  };

  return (
    <div className={styles.fabContainer}>
      <button 
        className={`${styles.fab} ${styles.primary}`} 
        onClick={handleAddPath}
      >
        <img src={plusButton} alt="경로 추가" />
      </button>
      <div className={styles.walkButtonContainer}>
        <button 
          className={`${styles.fab} ${styles.secondary}`} 
          onClick={handleShowSteps}
        >
          <img src={walkButton} alt="걸음수 보기" />
        </button>
        <div className={`${styles.stepCountContainer} ${isHome ? styles.homeStepCount : ''}`}>
          <span className={styles.stepCountText}>걸음 수</span>
          <span className={styles.stepCountNumber}>{stepCount}</span>
        </div>
      </div>
    </div>
  );
};

export default FloatingActionButtons;
