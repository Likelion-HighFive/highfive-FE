import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './BackgroundPage.module.css';
import MenuBar from '../../components/common/MenuBar';
import FloatingActionButtons from '../../components/common/FloatingActionButtons';
import axios from 'axios';

// 아이콘 및 이미지 임포트
import areaLogo from '../../assets/images/logo/area_logo.svg';
import searchIcon from '../../assets/icons/search.svg';
import heartIcon from '../../assets/icons/heart_icon.svg';
import heartFilledIcon from '../../assets/icons/heart_filled_icon.svg';
import commentIcon from '../../assets/icons/comment_icon.svg';
import nightCityBg from '../../assets/product/night city background.svg';

const BackgroundPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('background');
  const [likedCards, setLikedCards] = useState({});
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState(location.state?.selectedCategory || 'ALL');
  const [sortBy, setSortBy] = useState('LATEST'); // 'LATEST', 'RECOMMENDED', 'LIKES', 'DISTANCE'
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [pathCards, setPathCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 카드의 좋아요 상태를 전환합니다
  const toggleLike = async (cardId) => {
    try {
      const token = localStorage.getItem('accessToken');
      const tokenType = localStorage.getItem('tokenType') || 'Bearer';
      
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}paths/${cardId}/like-toggle`,
        {},
        {
          headers: {
            'Authorization': `${tokenType} ${token}`,
            'Content-Type': 'application/json',
          }/*,
          withCredentials: true*/
        }
      );

      if (response.data.isSuccess) {
        const { is_liked, likes_count } = response.data.data;
        
        // Update the specific card's like status and count
        setPathCards(prevCards => 
          prevCards.map(card => 
            card.id === cardId 
              ? { ...card, is_liked, likes_count }
              : card
          )
        );
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      // Optionally show an error message to the user
      if (error.response?.status === 401) {
        // Handle unauthorized error (e.g., redirect to login)
        console.log('토큰이 만료되었거나 유효하지 않습니다. 다시 로그인해주세요.');
      }
    }
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
    { id: 'ALL', name: '전체' },
    { id: 'EMOTIONAL', name: '감성길' },
    { id: 'CITY_VIEW', name: '씨티뷰길' },
    { id: 'NATURE', name: '자연길' },
    { id: 'NIGHT_VIEW', name: '야경길' },
    { id: 'SAFE', name: '안전길' }
  ];

  // 정렬 드롭다운
  const sortOptions = [
    { id: 'LATEST', name: '최신순' },
    { id: 'RECOMMENDED', name: '추천순' },
    { id: 'LIKES', name: '좋아요순' },
    { id: 'DISTANCE', name: '거리순' }
  ];

  // API에서 산책 코스 데이터 가져오기
  const fetchPaths = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const tokenType = localStorage.getItem('tokenType') || 'Bearer';
      
      console.log('Sending request to:', `${import.meta.env.VITE_API_BASE_URL}paths`);
      console.log('With token:', `${tokenType} ${token?.substring(0, 20)}...`);
      
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}paths`,
        {
          params: {
            filter: selectedCategory,
            sort: sortBy,
            // user_location: '37.5665,126.9780' // 현재 위치가 있다면 추가
          },
          headers: {
            'Authorization': `${tokenType} ${token}`,
            'Content-Type': 'application/json',
          }
          // withCredentials: true 제거
        }
      );

      console.log('Response:', response);
      
      if (response.data.isSuccess) {
        setPathCards(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching paths:', err);
      setError('산책 코스를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 카테고리나 정렬 기준이 변경될 때마다 데이터 다시 불러오기
  useEffect(() => {
    fetchPaths();
  }, [selectedCategory, sortBy]);

  // 로딩 중인 경우
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <p>산책 코스를 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }

  // 에러가 발생한 경우
  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={fetchPaths}>다시 시도하기</button>
        </div>
      </div>
    );
  }

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
            {sortBy === 'LATEST' && '최신순'}
            {sortBy === 'RECOMMENDED' && '추천순'}
            {sortBy === 'LIKES' && '좋아요순'}
            {sortBy === 'DISTANCE' && '거리순'}
            <span className={`${styles.arrow} ${isDropdownOpen ? styles.arrowUp : ''}`}>▼</span>
          </button>
          {isDropdownOpen && (
            <div className={styles.dropdownMenu}>
              {sortOptions.map(option => (
                <button 
                  key={option.id}
                  className={`${styles.dropdownItem} ${sortBy === option.id ? styles.active : ''}`}
                  onClick={() => {
                    setSortBy(option.id);
                    setIsDropdownOpen(false);
                  }}
                >
                  {option.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className={styles.content}>
        {/* 경로 카드 그리드 */}
        <div className={styles.pathGrid}>
          {pathCards.length === 0 ? (
            <div className={styles.noResults}>
              <p>표시할 산책 코스가 없습니다.</p>
            </div>
          ) : (
            pathCards.map(card => (
              <div key={card.id} className={styles.pathCard}>
                <div className={styles.imageContainer}>
                  <img 
                    src={card.representative_image || nightCityBg} 
                    alt={card.name} 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = nightCityBg;
                    }}
                  />
                  <div className={styles.cardCategory}>
                    {card.tags && card.tags.length > 0 ? card.tags[0] : '산책로'}
                  </div>
                </div>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{card.name}</h3>
                  <p className={styles.cardLocation}>산책로</p>
                  <div className={styles.cardMeta}>
                    <span>{card.distance}km · {Math.ceil(card.estimated_time / 60)}분</span>
                  </div>
                  <div className={styles.cardActions}>
                    <div 
                      className={`${styles.likeButton} ${card.is_liked ? styles.liked : ''}`} 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(card.id);
                      }}
                    >
                      <img 
                        src={card.is_liked ? heartFilledIcon : heartIcon} 
                        alt={card.is_liked ? '좋아요 취소' : '좋아요'} 
                      />
                      <span>{card.likes_count}</span>
                    </div>
                    <button className={styles.actionButton}>
                      <img src={commentIcon} alt="댓글" />
                      0
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
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
