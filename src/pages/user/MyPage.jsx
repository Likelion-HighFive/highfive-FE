import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MyPage.module.css';
import MenuBar from '../../components/common/MenuBar';
import profileImage from '../../assets/profile.svg';
import RightArrowIcon from '../../assets/icons/arrow_right.svg';
import HomeIcon from '../../assets/icons/home_icon.svg';
import BackgroundIcon from '../../assets/icons/background_icon.svg';
import LikeIcon from '../../assets/icons/like_icon.svg';
import UserIcon from '../../assets/icons/my_icon.svg';
import { userApi } from '../../api/api';
import { toast } from 'react-toastify';

const MyPage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    nickname: '로딩 중...',
    email: '로딩 중...',
    profile_image: '',
    total_steps: 0,
    total_distance: 0,
    carbon_saved: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await userApi.getProfile();
        console.log('API Response:', response); // 응답 확인용 로그
        // response 자체가 data 객체를 포함하고 있으므로 response.data로 접근
        if (response.isSuccess) {
          setUserData({
            nickname: response.data.nickname || '사용자',
            email: response.data.email || '',
            profile_image: response.data.profile_image || '',
            total_steps: response.data.total_steps || 0,
            total_distance: response.data.total_distance || 0,
            carbon_saved: response.data.carbon_saved || 0
          });
        } else {
          toast.error('프로필 정보를 불러오는데 실패했습니다.');
        }
      } catch (error) {
        console.error('프로필 조회 중 오류 발생:', error);
        toast.error('프로필 정보를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    // 로그아웃 로직 구현
    localStorage.removeItem('accessToken');
    navigate('/login');
    toast.success('로그아웃 되었습니다.');
  };

  const handleEditProfile = () => {
    // 프로필 수정 페이지로 이동
    navigate('/edit-profile');
  };

  const handleChangeName = () => {
    // 이름 변경 페이지로 이동
    navigate('/change-name');
  };

  const navigateToMemberInfo = () => {
    // 회원정보 변경 페이지로 이동
    navigate('/member-info');
  };

  const navigateToCarbonInfo = () => {
    // 탄소정보 페이지로 이동
    navigate('/footprint');
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>마이페이지</h1>
          <button className={styles.editButton} onClick={handleEditProfile}>
            회원정보수정
          </button>
        </header>

        <section className={styles.profileSection}>
          <div className={styles.profileImageContainer}>
            <img 
              src={userData.profile_image || profileImage} 
              alt="프로필" 
              className={styles.profileImage} 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = profileImage;
              }}
            />
          </div>
          <div className={styles.userInfo}>
            <div className={styles.nameContainer}>
              <span className={styles.userName}>
                {isLoading ? '로딩 중...' : `${userData.nickname} 님`}
              </span>
              <button className={styles.logoutButton} onClick={handleLogout}>
                로그아웃
              </button>
            </div>
            <p className={styles.userEmail}>
              {isLoading ? '로딩 중...' : userData.email}
            </p>
          </div>
        </section>

        <div className={styles.buttonGroup}>
          <button className={styles.actionButton} onClick={handleChangeName}>
            이름 변경
          </button>
        </div>

        <div className={styles.menuContainer}>
          <div className={`${styles.menuItem} ${styles.infoItem}`} onClick={navigateToMemberInfo}>
            <div>
              <h3 className={styles.menuTitle}>회원정보 변경</h3>
              <p className={styles.menuDescription}>이름 생년월일 휴대폰번호 이메일</p>
            </div>
            <img src={RightArrowIcon} alt="" className={styles.arrowIcon} />
          </div>

          <div className={`${styles.menuItem} ${styles.infoItem}`} onClick={navigateToCarbonInfo}>
            <div>
              <h3 className={styles.menuTitle}>나의 탄소정보</h3>
              <p className={styles.menuDescription}>탄소 절감량: {userData.carbon_saved.toFixed(1)}g</p>
            </div>
            <img src={RightArrowIcon} alt="" className={styles.arrowIcon} />
          </div>
        </div>
      </div>

      {/* 공통 메뉴 바 */}
      <MenuBar />
    </div>
  );
};

export default MyPage;