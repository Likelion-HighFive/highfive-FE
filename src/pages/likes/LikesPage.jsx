import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './LikesPage.module.css';
import MenuBar from '../../components/common/MenuBar';
import FloatingActionButtons from '../../components/common/FloatingActionButtons';
import { walkingService } from '../../api/walking';

// 아이콘 및 이미지 임포트
import searchIcon from '../../assets/icons/search.svg';
import heartFilledIcon from '../../assets/icons/heart_filled_icon.svg';
import commentIcon from '../../assets/icons/comment_icon.svg';
import nightCityBg from '../../assets/product/night city background.svg';

const LikesPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('likes');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [sortBy, setSortBy] = useState('recommended');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stepCount, setStepCount] = useState(0); // 걸음수 상태 추가

  // 카테고리 목록
  const categories = [
    { id: 'ALL', name: '전체' },
    { id: 'EMOTIONAL', name: '감성길' },
    { id: 'CITY_VIEW', name: '씨티뷰길' },
    { id: 'NATURE', name: '자연길' },
    { id: 'NIGHT_VIEW', name: '야경길' },
    { id: 'SAFE', name: '안전길' }
  ];

  // 카테고리 필터와 함께 좋아요한 경로를 API에서 가져오기
  const fetchLikedPaths = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const tokenType = localStorage.getItem('tokenType') || 'Bearer';

      // Add category filter to the API request
      const params = new URLSearchParams();
      if (selectedCategory !== 'ALL') {
        params.append('category', selectedCategory);
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/paths/likes?${params.toString()}`,
        {
          headers: {
            'Authorization': `${tokenType} ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );

      if (response.data.isSuccess) {
        setPaths(response.data.data || []);
      } else {
        setError(response.data.message || '데이터를 불러오는 데 실패했습니다.');
      }
    } catch (err) {
      console.error('Error fetching liked paths:', err);
      setError('좋아요한 산책 코스를 불러오는 중 오류가 발생했습니다.');
      if (err.response?.status === 401) {
        // Handle unauthorized
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  // 경로의 좋아요 상태 토글
  const toggleLike = async (pathId, e) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem('accessToken');
      const tokenType = localStorage.getItem('tokenType') || 'Bearer';
      
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}paths/${pathId}/like-toggle`,
        {},
        {
          headers: {
            'Authorization': `${tokenType} ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );

      // Update the local state to remove the unliked path
      setPaths(prevPaths => prevPaths.filter(path => path.id !== pathId));
      
    } catch (error) {
      console.error('Error toggling like:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      } else {
        alert('좋아요 취소 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  };

  // 분 단위 시간을 시간과 분으로 포맷팅
  const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes}분`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}시간 ${mins}분` : `${hours}시간`;
  };

  // 카드 클릭 시 상세 페이지로 이동
  const handleCardClick = (pathId) => {
    navigate(`/detail/${pathId}`);
  };

  // 컴포넌트 마운트 시 또는 카테고리 변경 시 좋아요한 경로 가져오기
  useEffect(() => {
    fetchLikedPaths();
    
    // Fetch step count
    const fetchStepCount = async () => {
      try {
        const response = await walkingService.getWalkingSummary();
        if (response.isSuccess && response.data) {
          setStepCount(response.data.total_steps || 0);
        }
      } catch (error) {
        console.error('걸음수 조회 중 오류:', error);
      }
    };

    fetchStepCount();
  }, [selectedCategory]);

  // 검색 핸들러
  const handleSearch = (e) => {
    e.preventDefault();
    console.log('검색어:', searchQuery);
    // 여기에 검색 로직 추가
  };

  // 플로팅 액션 버튼 핸들러
  const handleAddPath = () => {
    navigate('/create-path');
  };

  const handleShowSteps = () => {
    navigate('/footprint');
  };

  // 카테고리 선택 핸들러
  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    // useEffect가 새 카테고리로 다시 가져오기를 트리거함
  };

  // 정렬 옵션 선택 핸들러
  const handleSortSelect = (sortOption) => {
    setSortBy(sortOption);
    setIsDropdownOpen(false);
    // 여기에 정렬 로직 추가
    console.log('정렬 기준:', sortOption);
  };

  // 로딩 상태
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner}></div>
          <p>좋아요한 산책로를 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>좋아요한 산책로</h1>
          <div className={styles.searchContainer}>
            <form onSubmit={handleSearch} className={styles.searchForm}>
              <input
                type="text"
                placeholder="길 검색하기"
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

        {/* 카테고리 필터 */}
        <div className={styles.categoryContainer}>
          {categories.map((category) => (
            <button
              key={category.id}
              className={`${styles.categoryButton} ${
                selectedCategory === category.id ? styles.activeCategory : ''
              }`}
              onClick={() => handleCategorySelect(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* 정렬 옵션 */}
        <div className={styles.sortContainer}>
          <div 
            className={styles.sortDropdown}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {sortBy === 'recommended' ? '추천순' : '최신순'}
            <span className={styles.dropdownArrow}>▼</span>
            {isDropdownOpen && (
              <div className={styles.dropdownMenu}>
                <div onClick={() => handleSortSelect('recommended')}>추천순</div>
                <div onClick={() => handleSortSelect('latest')}>최신순</div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.content}>
        {error ? (
          <div className={styles.errorState}>
            <p>{error}</p>
            <button 
              className={styles.retryButton}
              onClick={fetchLikedPaths}
            >
              다시 시도하기
            </button>
          </div>
        ) : paths.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>❤️</div>
            <h3>아직 좋아요한 산책로가 없어요</h3>
            <p>마음에 드는 산책로에 좋아요를 눌러보세요!</p>
          </div>
        ) : (
          <div className={styles.pathsGrid}>
            {paths.map((path) => (
              <div 
                key={path.id} 
                className={styles.pathCard}
                onClick={() => handleCardClick(path.id)}
              >
                <div className={styles.pathImage}>
                  <img 
                    src={path.representative_image || nightCityBg} 
                    alt={path.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = nightCityBg;
                    }}
                    className={styles.pathImage}
                  />
                  {path.tags && path.tags.length > 0 && (
                    <div className={styles.tag}>
                      {path.tags[0]}
                    </div>
                  )}
                  <button 
                    className={`${styles.likeButton} ${styles.liked}`}
                    onClick={(e) => toggleLike(path.id, e)}
                  >
                    <img src={heartFilledIcon} alt="좋아요 취소" />
                  </button>
                </div>
                <div className={styles.pathInfo}>
                  <h3>{path.name}</h3>
                  <div className={styles.metaInfo}>
                    <span>{path.distance}km</span>
                    <span>•</span>
                    <span>{formatTime(Math.ceil(path.estimated_time / 60))}</span>
                  </div>
                  <div className={styles.likesCount}>
                    <img src={heartFilledIcon} alt="좋아요" />
                    <span>{path.likes_count || 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 플로팅 버튼 */}
      <FloatingActionButtons 
        onAddPath={handleAddPath}
        onShowSteps={handleShowSteps}
        stepCount={stepCount}
        isHome={false}
      />
      
      {/* Navigation */}
      <MenuBar active="likes" />
    </div>
  );
};

export default LikesPage;