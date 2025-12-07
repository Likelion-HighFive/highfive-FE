import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './MenuBar.module.css';

// Icons
import homeIcon from '../../assets/icons/home_icon.svg';
import homeActiveIcon from '../../assets/icons/home_click_icon.svg';
import backgroundIcon from '../../assets/icons/background_icon.svg';
import backgroundActiveIcon from '../../assets/icons/background_click_icon.svg';
import likeIcon from '../../assets/icons/like_icon.svg';
import likeActiveIcon from '../../assets/icons/like_click_icon.svg';
import myIcon from '../../assets/icons/my_icon.svg';
import myActiveIcon from '../../assets/icons/my_click_icon.svg';

const MenuBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleTabClick = (path) => {
    navigate(path);
  };


  return (
    <div className={styles.menuBar}>
      <div className={styles.menuItems}>
        <button 
          className={`${styles.menuItem} ${isActive('/home') ? styles.active : ''}`}
          onClick={() => handleTabClick('/home')}
        >
          <img 
            src={isActive('/home') ? homeActiveIcon : homeIcon} 
            alt="홈" 
            className={styles.menuIcon} 
          />
          <span>홈</span>
        </button>

        <button 
          className={`${styles.menuItem} ${isActive('/background') ? styles.active : ''}`}
          onClick={() => handleTabClick('/background')}
        >
          <img 
            src={isActive('/background') ? backgroundActiveIcon : backgroundIcon} 
            alt="배경길" 
            className={styles.menuIcon} 
          />
          <span>배경길</span>
        </button>

        {/* 플로팅 액션 버튼은 각 페이지에서 처리됩니다 */}

        <button 
          className={`${styles.menuItem} ${isActive('/likes') ? styles.active : ''}`}
          onClick={() => handleTabClick('/likes')}
        >
          <img 
            src={isActive('/likes') ? likeActiveIcon : likeIcon} 
            alt="찜한경로" 
            className={styles.menuIcon} 
          />
          <span>찜한경로</span>
        </button>

        <button 
          className={`${styles.menuItem} ${isActive('/mypage') ? styles.active : ''}`}
          onClick={() => handleTabClick('/mypage')}
        >
          <img 
            src={isActive('/mypage') ? myActiveIcon : myIcon} 
            alt="마이페이지" 
            className={styles.menuIcon} 
          />
          <span>마이페이지</span>
        </button>
      </div>
    </div>
  );
};

export default MenuBar;
