import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MyPage.module.css';
import MenuBar from '../../components/common/MenuBar';
import profileImage from '../../assets/profile.svg';
import RightArrowIcon from '../../assets/icons/arrow_right.svg';
import HomeIcon from '../../assets/icons/home_icon.svg';
import BackgroundIcon from '../../assets/icons/background_icon.svg';
import LikeIcon from '../../assets/icons/like_icon.svg';
import UserIcon from '../../assets/icons/my_icon.svg';

const MyPage = () => {
  const navigate = useNavigate();
  
  const userData = {
    name: '최유성',
    email: 'cys990922@naver.com'
  };

  const handleLogout = () => {
    // 로그아웃 로직 구현
    console.log('Logout');
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
            <img src={profileImage} alt="프로필" className={styles.profileImage} />
          </div>
          <div className={styles.userInfo}>
            <div className={styles.nameContainer}>
              <span className={styles.userName}>{userData.name} 님</span>
              <button className={styles.logoutButton} onClick={handleLogout}>
                로그아웃
              </button>
            </div>
            <p className={styles.userEmail}>{userData.email}</p>
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