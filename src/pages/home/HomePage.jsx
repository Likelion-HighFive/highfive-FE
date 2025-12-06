import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './HomePage.module.css';

// 아이콘 및 이미지 임포트
import areaLogo from '../../assets/images/logo/area_logo.svg';
import searchIcon from '../../assets/icons/search.svg';
import homeIcon from '../../assets/icons/home_icon.svg';
import backgroundIcon from '../../assets/icons/background_icon.svg';
import likeIcon from '../../assets/icons/like_icon.svg';
import myIcon from '../../assets/icons/my_icon.svg';
import plusButton from '../../assets/icons/plus_button.svg';
import walkButton from '../../assets/icons/walk_button.svg';

const HomePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');

  // 탭 변경 핸들러
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    // 여기에 각 탭에 따른 라우팅 로직을 추가
  };

  // 검색 핸들러
  const handleSearch = (e) => {
    e.preventDefault();
    // 검색 로직 구현
    console.log('검색어:', searchQuery);
  };

  // 플로팅 액션 버튼 핸들러
  const handleAddPath = () => {
    // 경로 추가 로직
    console.log('경로 추가하기');  
  };

  const handleShowSteps = () => {
    // 걸음수 보기 로직
    console.log('걸음수 보기');
  };

  // 카테고리 버튼 데이터
  const categories = [
    { id: 'all', name: '전체' },
    { id: 'emotional', name: '감성길' },
    { id: 'cityview', name: '씨티뷰길' },
    { id: 'nature', name: '자연길' },
    { id: 'nightview', name: '야경길' },
    { id: 'safe', name: '안전길' }
  ];

  return (
    <div className={styles.container}>
      {/* 헤더 영역 */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <img src={areaLogo} alt="ALÉA 로고" className={styles.logo} />
          <div className={styles.searchContainer}>
            <form onSubmit={handleSearch} className={styles.searchForm}>
              <input
                type="text"
                placeholder="장소, 경로, 해시태그 검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
              <button type="submit" className={styles.searchButton}>
                <img src={searchIcon} alt="검색" />
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* 카테고리 필터 */}
      <div className={styles.categoryContainer}>
        {categories.map(category => (
          <button 
            key={category.id}
            className={`${styles.categoryButton} ${category.id === 'all' ? styles.active : ''}`}
            onClick={() => navigate('/background-road')}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* 메인 컨텐츠 */}
      <main className={styles.content}>
        {/* 여기에 메인 콘텐츠를 추가 */}
        <div style={{ flex: 1 }}>
          {/* 메인 콘텐츠 영역 */}
        </div>
      </main>

      {/* 플로팅 액션 버튼 */}
      <div className={styles.fabContainer}>
        <button className={`${styles.fab} ${styles.primary}`} onClick={handleAddPath}>
          <img src={plusButton} alt="경로 추가" />
        </button>
        <button className={`${styles.fab} ${styles.secondary}`} onClick={handleShowSteps}>
          <img src={walkButton} alt="걸음수 보기" />
          <span className={styles.stepCount}>0</span>
        </button>
      </div>

      {/* 하단 네비게이션 바 */}
      <nav className={styles.navBar}>
        <button 
          className={`${styles.navItem} ${activeTab === 'home' ? styles.active : ''}`}
          onClick={() => handleTabChange('home')}
        >
          <img src={homeIcon} alt="홈" className={styles.navIcon} />
          <span>홈</span>
        </button>
        <button 
          className={`${styles.navItem} ${activeTab === 'background' ? styles.active : ''}`}
          onClick={() => handleTabChange('background')}
        >
          <img src={backgroundIcon} alt="배경길" className={styles.navIcon} />
          <span>배경길</span>
        </button>
        <button 
          className={`${styles.navItem} ${activeTab === 'likes' ? styles.active : ''}`}
          onClick={() => handleTabChange('likes')}
        >
          <img src={likeIcon} alt="좋아요" className={styles.navIcon} />
          <span>좋아요</span>
        </button>
        <button 
          className={`${styles.navItem} ${activeTab === 'my' ? styles.active : ''}`}
          onClick={() => handleTabChange('my')}
        >
          <img src={myIcon} alt="마이페이지" className={styles.navIcon} />
          <span>마이</span>
        </button>
      </nav>
    </div>
  );
};

export default HomePage;