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
import Modal from 'react-modal';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newNickname, setNewNickname] = useState('');

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
    setNewNickname(userData.nickname);
    setIsModalOpen(true);
  };

  const handleUpdateNickname = async () => {
    if (!newNickname.trim()) {
      toast.error('닉네임을 입력해주세요.');
      return;
    }

    try {
      setIsLoading(true);
      const response = await userApi.updateNickname(newNickname);
      
      if (response.isSuccess) {
        setUserData(prev => ({
          ...prev,
          nickname: response.data.nickname
        }));
        toast.success('닉네임이 성공적으로 변경되었습니다.');
        setIsModalOpen(false);
      } else {
        toast.error(response.message || '닉네임 변경에 실패했습니다.');
      }
    } catch (error) {
      console.error('닉네임 변경 중 오류 발생:', error);
      toast.error(error.message || '닉네임 변경 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 파일 크기 검증 (5MB 제한)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('이미지 크기는 5MB를 초과할 수 없습니다.');
      return;
    }

    // 파일 타입 검증
    if (!file.type.match('image/.*')) {
      toast.error('이미지 파일만 업로드 가능합니다.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      setIsLoading(true);
      const response = await fetchWithAuth('/mypage/profile-image', {
        method: 'PATCH',
        headers: {
          // Content-Type은 설정하지 않아야 브라우저가 자동으로 설정하고 boundary를 추가합니다.
        },
        body: formData,
      });

      if (response.isSuccess) {
        setUserData(prev => ({
          ...prev,
          profile_image: response.data.profile_image
        }));
        toast.success('프로필 이미지가 업데이트되었습니다.');
      } else {
        toast.error(response.message || '프로필 이미지 업데이트에 실패했습니다.');
      }
    } catch (error) {
      console.error('프로필 이미지 업데이트 중 오류 발생:', error);
      toast.error(error.message || '프로필 이미지 업데이트 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
      e.target.value = ''; // 파일 선택을 초기화
    }
  };

  const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem('accessToken');
    const tokenType = localStorage.getItem('tokenType') || 'Bearer';
    
    const headers = {
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `${tokenType} ${token}`;
    }

    // Content-Type은 FormData인 경우 자동으로 설정되도록 함
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${url}`, {
      ...options,
      headers,
    });

    const resJson = await response.json().catch(() => ({}));

    if (!response.ok || !resJson?.isSuccess) {
      const error = new Error(resJson?.message || '요청을 처리하는 중 오류가 발생했습니다.');
      error.status = response.status;
      error.data = resJson;
      throw error;
    }

    return resJson;
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewNickname('');
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
        </header>

        <section className={styles.profileSection}>
          <div className={styles.profileImageContainer}>
            <label htmlFor="profileImageInput" className={styles.profileImageLabel}>
              <img 
                src={userData.profile_image ? userData.profile_image : profileImage} 
                alt="프로필" 
                className={styles.profileImage}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = profileImage;
                }}
              />
              <div className={styles.profileImageOverlay}>
                <span>사진 변경</span>
              </div>
            </label>
            <input
              id="profileImageInput"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
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
          <button 
            className={`${styles.actionButton} ${styles.imageButton}`}
            onClick={() => document.getElementById('profileImageInput').click()}
          >
            프로필 사진 변경
          </button>
        </div>

        <div className={styles.menuContainer}>
          <div className={`${styles.menuItem} ${styles.infoItem}`} onClick={navigateToCarbonInfo}>
            <div>
              <h3 className={styles.menuTitle}>나의 탄소정보</h3>
              <p className={styles.menuDescription}>탄소 절감량: {userData.carbon_saved.toFixed(1)}g</p>
            </div>
            <img src={RightArrowIcon} alt="" className={styles.arrowIcon} />
          </div>
        </div>
      </div>

      {/* 닉네임 변경 모달 */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className={styles.modalContent}
        overlayClassName={styles.modalOverlay}
        contentLabel="닉네임 변경"
        ariaHideApp={false}
      >
        <h2 className={styles.modalTitle}>닉네임 변경</h2>
        <input
          type="text"
          value={newNickname}
          onChange={(e) => setNewNickname(e.target.value)}
          placeholder="새로운 닉네임을 입력하세요"
          className={styles.modalInput}
        />
        <div className={styles.modalButtonGroup}>
          <button 
            onClick={closeModal}
            className={styles.modalButton}
          >
            취소
          </button>
          <button 
            onClick={handleUpdateNickname}
            disabled={isLoading}
            className={`${styles.modalButton} ${styles.primary}`}
          >
            {isLoading ? '변경 중...' : '변경하기'}
          </button>
        </div>
      </Modal>

      {/* 공통 메뉴 바 */}
      <MenuBar />
    </div>
  );
};

export default MyPage;