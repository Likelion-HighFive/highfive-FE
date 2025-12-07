import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './HomePage.module.css';
import MenuBar from '../../components/common/MenuBar';

// 아이콘 및 이미지 임포트
import areaLogo from '../../assets/images/logo/area_logo.svg';
import searchIcon from '../../assets/icons/search.svg';
import homeIcon from '../../assets/icons/home_click_icon.svg';
import backgroundIcon from '../../assets/icons/background_icon.svg';
import likeIcon from '../../assets/icons/like_icon.svg';
import myIcon from '../../assets/icons/my_icon.svg';
import plusButton from '../../assets/icons/plus_button.svg';
import walkButton from '../../assets/icons/walk_button.svg';

const HomePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');

  // 검색 핸들러
  const handleSearch = (e) => {
    e.preventDefault();
    console.log('검색어:', searchQuery);
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
            onClick={() => navigate('/background', { state: { selectedCategory: category.id } })}
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
        <button className={`${styles.fab} ${styles.primary}`} onClick={() => console.log('경로 추가하기')}>
          <img src={plusButton} alt="경로 추가" />
        </button>
        <button className={`${styles.fab} ${styles.secondary}`} onClick={() => console.log('걸음수 보기')}>
          <img src={walkButton} alt="걸음수 보기" />
          <span className={styles.stepCount}>0</span>
        </button>
      </div>

      {/* 공통 메뉴 바 */}
      <MenuBar />
    </div>
  );
};

export default HomePage;