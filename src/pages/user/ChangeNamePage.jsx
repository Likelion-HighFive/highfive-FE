import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ChangeNamePage.module.css';
import HomeIcon from '../../assets/icons/home_icon.svg';

const Header = ({ onHomeClick }) => (
  <header className={styles.header}>
    <h1 className={styles.title}>이름 변경</h1>
    <button className={styles.homeButton} onClick={onHomeClick}>
      <img src={HomeIcon} alt="홈" />
    </button>
  </header>
);

const ChangeNamePage = () => {
  const navigate = useNavigate();
  const [newName, setNewName] = useState('');
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [remainingChanges, setRemainingChanges] = useState(4);
  const totalChanges = 4;
  const currentName = '최유성'; // 실제 사용자 데이터로 대체 필요

  useEffect(() => {
    // 입력값이 유효한지 확인 (1자 이상 8자 이하)
    const isValid = newName.length >= 1 && newName.length <= 8;
    setIsSubmitDisabled(!isValid || remainingChanges <= 0);
  }, [newName, remainingChanges]);

  const handleNameChange = (e) => {
    setNewName(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newName.trim() === '') return;
    
    // 이름 변경 로직 구현 (API 호출 등)
    console.log('이름 변경 요청:', newName);
    
    // 변경 횟수 차감 (실제로는 API 응답 후 처리)
    if (remainingChanges > 0) {
      setRemainingChanges(prev => prev - 1);
    }
    
    // 변경 완료 후 마이페이지로 이동
    // navigate('/mypage');
  };

  const handleHomeClick = () => {
    navigate('/mypage');
  };

  return (
    <div className={styles.container}>
      <Header onHomeClick={handleHomeClick} />

      <main className={styles.content}>
        <p className={styles.changeCount}>
          이번 달 수정 가능 횟수 ({remainingChanges}/{totalChanges}회)
        </p>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <input
              type="text"
              placeholder="닉네임 입력(최대 8자)"
              maxLength={8}
              value={newName}
              onChange={handleNameChange}
              className={styles.nameInput}
            />
            <p className={styles.currentName}>현재 닉네임: {currentName}</p>
          </div>
          
          <div className={styles.buttonContainer}>
            <button 
              type="submit" 
              className={`${styles.submitButton} ${isSubmitDisabled ? styles.disabled : ''}`}
              disabled={isSubmitDisabled}
            >
              변경하기
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default ChangeNamePage;
