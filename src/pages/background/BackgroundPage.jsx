import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './BackgroundPage.module.css';
import MenuBar from '../../components/common/MenuBar';
import FloatingActionButtons from '../../components/common/FloatingActionButtons';

// 아이콘 및 이미지 임포트
import areaLogo from '../../assets/images/logo/area_logo.svg';
import searchIcon from '../../assets/icons/search.svg';
import heartIcon from '../../assets/icons/heart_icon.svg';
import commentIcon from '../../assets/icons/comment_icon.svg';
import nightCityBg from '../../assets/product/night city background.svg';

const BackgroundPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('background');
  const [likedCards, setLikedCards] = useState({});
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState(location.state?.selectedCategory || 'all');
  const [sortBy, setSortBy] = useState('latest'); // 'latest', 'popular', 'distance'
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // 카드의 좋아요 상태를 전환합니다
  const toggleLike = (cardId) => {
    setLikedCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  // 탭 변경 핸들러
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    if (tabName === 'home') {
      navigate('/home');
    }
    // 다른 탭들에 대한 라우팅은 여기에 추가
  };

  // 검색 핸들러
  const handleSearch = (e) => {
    e.preventDefault();
    console.log('검색어:', searchQuery);
  };

  // 플로팅 액션 버튼 핸들러
  const handleAddPath = () => {
    console.log('경로 추가하기');
  };

  const handleShowSteps = () => {
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

  // 경로 카드 데이터
  const pathCards = [
    {
      id: 1,
      title: '야경이 아름다운 한강 산책로',
      location: '서울특별시 용산구',
      distance: '2.5km',
      time: '35분',
      likes: 128,
      comments: 24,
      image: nightCityBg,
      category: '야경길'
    },
    {
      id: 2,
      title: '봄꽃 가득한 여의도 공원',
      location: '서울특별시 영등포구',
      distance: '3.2km',
      time: '45분',
      likes: 98,
      comments: 15,
      image: nightCityBg,
      category: '자연길'
    },
    {
      id: 3,
      title: '낭만 가득한 남산타워 전망대',
      location: '서울특별시 중구',
      distance: '1.8km',
      time: '25분',
      likes: 156,
      comments: 32,
      image: nightCityBg,
      category: '감성길'
    },
    {
      id: 4,
      title: '서울숲에서의 여유로운 오후',
      location: '서울특별시 성동구',
      distance: '4.1km',
      time: '55분',
      likes: 87,
      comments: 12,
      image: nightCityBg,
      category: '자연길'
    },
    {
      id: 5,
      title: '경복궁 돌담길 산책',
      location: '서울특별시 종로구',
      distance: '2.0km',
      time: '30분',
      likes: 112,
      comments: 28,
      image: nightCityBg,
      category: '역사길'
    },
    {
      id: 6,
      title: '한강공원 자전거 코스',
      location: '서울특별시 서초구',
      distance: '5.5km',
      time: '40분',
      likes: 134,
      comments: 19,
      image: nightCityBg,
      category: '액티비티'
    }
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
            className={`${styles.categoryButton} ${selectedCategory === category.id ? styles.active : ''}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* 정렬 드롭다운 */}
      <div className={styles.sortContainer}>
        <div className={styles.sortDropdown}>
          <button 
            className={styles.sortButton}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {sortBy === 'latest' && '최신순'}
            {sortBy === 'popular' && '추천순'}
            {sortBy === 'distance' && '거리순'}
            <span className={`${styles.arrow} ${isDropdownOpen ? styles.arrowUp : ''}`}>▼</span>
          </button>
          {isDropdownOpen && (
            <div className={styles.dropdownMenu}>
              <button 
                className={`${styles.dropdownItem} ${sortBy === 'latest' ? styles.active : ''}`}
                onClick={() => {
                  setSortBy('latest');
                  setIsDropdownOpen(false);
                }}
              >
                최신순
              </button>
              <button 
                className={`${styles.dropdownItem} ${sortBy === 'popular' ? styles.active : ''}`}
                onClick={() => {
                  setSortBy('popular');
                  setIsDropdownOpen(false);
                }}
              >
                추천순
              </button>
              <button 
                className={`${styles.dropdownItem} ${sortBy === 'distance' ? styles.active : ''}`}
                onClick={() => {
                  setSortBy('distance');
                  setIsDropdownOpen(false);
                }}
              >
                거리순
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className={styles.content}>
        <div className={styles.pathGrid}>
          {pathCards.map((card) => (
            <div key={card.id} className={styles.pathCard}>
              <div className={styles.imageContainer}>
                <img 
                  src={card.image} 
                  alt={card.title}
                  className={styles.cardImage}
                />
                <span className={styles.cardCategory}>{card.category}</span>
                <div 
                  className={`${styles.heartContainer} ${likedCards[card.id] ? styles.active : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(card.id);
                  }}
                >
                  <img 
                    src={heartIcon} 
                    alt="좋아요" 
                    className={styles.heartIcon} 
                  />
                </div>
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <p className={styles.cardLocation}>{card.location}</p>
                <div className={styles.cardMeta}>
                  <span className={styles.distanceTime}>{card.distance} · {card.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 플로팅 액션 버튼 */}
      <FloatingActionButtons 
        onAddPath={handleAddPath}
        onShowSteps={handleShowSteps}
        stepCount={0}
      />

      {/* 공통 메뉴 바 */}
      <MenuBar />
    </div>
  );
};

export default BackgroundPage;
