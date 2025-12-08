import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LikesPage.module.css';
import MenuBar from '../../components/common/MenuBar';
import FloatingActionButtons from '../../components/common/FloatingActionButtons';

// 아이콘 및 이미지 임포트
import searchIcon from '../../assets/icons/search.svg';
import heartsIcon from '../../assets/icons/like_click_icon.svg';
import heartIcon from '../../assets/icons/heart_icon.svg';
import heartFilledIcon from '../../assets/icons/heart_filled_icon.svg';
import commentIcon from '../../assets/icons/comment_icon.svg';

const LikesPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('likes');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recommended'); // 'recommended', 'latest', 'popular'
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Mock data for paths with like status
  const [paths, setPaths] = useState([
    {
      id: 1,
      title: '매일매일 산책',
      description: '한걸음이라도 여유있게',
      tags: ['서울', '감성길', '자연길'],
      likes: 124,
      comments: 23,
      image: 'path/to/image1.jpg',
      isLiked: true  // Liked path - will show filled heart
    },
    {
      id: 2,
      title: '서울 야경 산책',
      description: '밤에 걷기 좋은 길',
      tags: ['서울', '야경길', '씨티뷰길'],
      likes: 89,
      comments: 15,
      image: 'path/to/image2.jpg',
      isLiked: false  // Not liked - will show empty heart
    },
    // Add more mock data as needed
  ]);

  const toggleLike = (pathId) => {
    setPaths(prevPaths => 
      prevPaths.map(path => 
        path.id === pathId 
          ? { 
              ...path, 
              isLiked: !path.isLiked, 
              likes: path.isLiked ? Math.max(0, path.likes - 1) : path.likes + 1 
            } 
          : path
      )
    );
  };

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    if (tabName === 'home') {
      navigate('/home');
    } else if (tabName === 'background') {
      navigate('/background');
    } else if (tabName === 'mypage') {
      navigate('/mypage');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('검색어:', searchQuery);
  };

  const categories = [
    { id: 'all', name: '전체' },
    { id: 'emotional', name: '감성길' },
    { id: 'cityview', name: '씨티뷰길' },
    { id: 'nature', name: '자연길' },
    { id: 'nightview', name: '야경길' },
  ];

  return (
    <div className={styles.container}>
      {/* 검색 바 */}
      <form onSubmit={handleSearch} className={styles.searchBar}>
        <img src={searchIcon} alt="검색" className={styles.searchIcon} />
        <input
          type="text"
          placeholder="길 검색하기"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
      </form>

      {/* 카테고리 필터 */}
      <div className={styles.categoryContainer}>
        {categories.map(category => (
          <button
            key={category.id}
            className={`${styles.categoryButton} ${selectedCategory === category.id ? styles.activeCategory : ''}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* 정렬 옵션 */}
      <div className={styles.sortContainer}>
        <div className={styles.sortDropdown} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
          <span>추천순</span>
          <span className={styles.dropdownArrow}>▼</span>
          {isDropdownOpen && (
            <div className={styles.dropdownMenu}>
              <div onClick={() => setSortBy('recommended')}>추천순</div>
              <div onClick={() => setSortBy('latest')}>최신순</div>
              <div onClick={() => setSortBy('popular')}>인기순</div>
            </div>
          )}
        </div>
      </div>

      {/* 경로 목록 */}
      <div className={styles.pathsGrid}>
        {paths.map(path => (
          <div key={path.id} className={styles.pathCard}>
            <div className={styles.pathImage}>
              {/* 이미지가 있다면 여기에 표시 */}
              <div className={styles.pathImagePlaceholder}></div>
              <button 
                className={styles.likeButton}
                onClick={() => toggleLike(path.id)}
              >
                <img 
                  src={path.isLiked ? heartFilledIcon : heartIcon} 
                  alt={path.isLiked ? '좋아요 취소' : '좋아요'} 
                />
              </button>
            </div>
            <div className={styles.pathInfo}>
              <h3>{path.title}</h3>
              <p className={styles.pathDescription}>{path.description}</p>
              <div className={styles.pathTags}>
                {path.tags.map((tag, index) => (
                  <span key={index} className={styles.tag}>{tag}</span>
                ))}
              </div>
              <div className={styles.pathStats}>
                <span><img src={heartsIcon} alt="좋아요" /> {path.likes}</span>
                <span><img src={commentIcon} alt="댓글" /> {path.comments}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 플로팅 액션 버튼 */}
      <FloatingActionButtons />
      
      {/* 하단 메뉴 바 */}
      <MenuBar activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
};

export default LikesPage;
