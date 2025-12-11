import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUpload, FiImage, FiMapPin, FiTag, FiInfo, FiX, FiCheck } from 'react-icons/fi';
import ArrowRightIcon from '../../assets/icons/arrow_right.svg';
import styles from './CreatePathPage.module.css';

const CreatePathPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    start_location: '',
    end_location: '',
    introduction: '',
    tags: '',
    images: [],
    representative_image_index: 0
  });
  const [previewImages, setPreviewImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [activeField, setActiveField] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFocus = (fieldName) => {
    setActiveField(fieldName);
  };

  const handleBlur = () => {
    setActiveField(null);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    // 파일 유형과 크기 검증
    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (!validTypes.includes(file.type)) {
        setError('지원하는 파일 형식은 JPG, PNG, WEBP 입니다.');
        return false;
      }
      
      if (file.size > maxSize) {
        setError('이미지 파일 크기는 5MB를 초과할 수 없습니다.');
        return false;
      }
      
      return true;
    });
    
    if (validFiles.length === 0) return;
    
    // 미리보기 URL 생성
    const newPreviewImages = validFiles.map(file => ({
      url: URL.createObjectURL(file),
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + 'MB'
    }));
    
    setPreviewImages(prev => [...prev, ...newPreviewImages]);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...validFiles]
    }));
    
    // 동일한 파일을 다시 선택할 수 있도록 파일 입력 초기화
    e.target.value = null;
  };
  
  const removeImage = (index) => {
    const newPreviewImages = [...previewImages];
    const newImages = [...formData.images];
    
    // 메모리 누수를 방지하기 위해 객체 URL 해제
    URL.revokeObjectURL(newPreviewImages[index].url);
    
    newPreviewImages.splice(index, 1);
    newImages.splice(index, 1);
    
    setPreviewImages(newPreviewImages);
    setFormData(prev => ({
      ...prev,
      images: newImages,
      representative_image_index: index === formData.representative_image_index ? 0 : 
        (index < formData.representative_image_index ? formData.representative_image_index - 1 : formData.representative_image_index)
    }));
  };

  const handleSetRepresentative = (index) => {
    setFormData(prev => ({
      ...prev,
      representative_image_index: index
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // 필수 필드 검증
    if (!formData.name || !formData.start_location || !formData.end_location || !formData.tags || formData.images.length === 0) {
      setError('필수 항목을 모두 입력해주세요.');
      setIsSubmitting(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      
      // 텍스트 필드 추가
      formDataToSend.append('name', formData.name);
      formDataToSend.append('start_location', formData.start_location);
      formDataToSend.append('end_location', formData.end_location);
      formDataToSend.append('introduction', formData.introduction || '');
      
      // 태그 처리
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      formDataToSend.append('tags', JSON.stringify(tagsArray));
      
      // 대표 이미지 인덱스
      formDataToSend.append('representative_image_index', formData.representative_image_index || 0);
      
      // 이미지 파일 추가
      formData.images.forEach((image) => {
        formDataToSend.append('images', image);
      });

      // 환경 변수 사용하여 API 호출
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('로그인이 필요합니다. 로그인 후 다시 시도해주세요.');
      }

      // Ensure there's no double slash in the URL
      const baseUrl = import.meta.env.VITE_API_BASE_URL.endsWith('/') 
        ? import.meta.env.VITE_API_BASE_URL.slice(0, -1) 
        : import.meta.env.VITE_API_BASE_URL;
      
      const response = await fetch(`${baseUrl}/paths`, {
        method: 'POST',
        body: formDataToSend,
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      let responseData;
      try {
        const text = await response.text();
        responseData = text ? JSON.parse(text) : {};
      } catch (e) {
        console.error('응답 파싱 실패:', e);
        throw new Error('서버 응답을 처리하는 중 오류가 발생했습니다.');
      }

      if (!response.ok) {
        // 422 Validation Error 처리
        if (response.status === 422 && responseData.detail) {
          const validationErrors = responseData.detail
            .map(error => `${error.loc[1] || error.loc[0]}: ${error.msg}`)
            .join('\n');
          throw new Error(`유효성 검사 오류:\n${validationErrors}`);
        }
        throw new Error(responseData.message || `산책로 등록에 실패했습니다. (${response.status})`);
      }

      // 성공 시 응답 처리
      if (responseData.isSuccess && responseData.data) {
        navigate(`/paths/${responseData.data.id}`);
      } else {
        throw new Error('서버에서 예상치 못한 응답을 받았습니다.');
      }
    } catch (err) {
      setError(err.message || '산책로 등록 중 오류가 발생했습니다.');
      console.error('Error creating path:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button 
          className={styles.backButton} 
          onClick={() => navigate(-1)}
          aria-label="뒤로 가기"
        >
          <img src={ArrowRightIcon} alt="뒤로가기" style={{ transform: 'scaleX(-1)' }} />
        </button>
        <h1>새로운 산책 코스</h1>
      </header>
      
      <main className={styles.mainContent}>
        {error && (
          <div className={styles.error}>
            <FiInfo className={styles.errorIcon} />
            <span>{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={`${styles.formGroup} ${activeField === 'name' ? styles.active : ''}`}>
            <label htmlFor="name">
              <FiTag className={styles.icon} />
              코스 이름
              <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onFocus={() => handleFocus('name')}
              onBlur={handleBlur}
              required
              placeholder="예) 한강공원 나들이 코스"
              maxLength={50}
            />
            <div className={styles.characterCount}>
              {formData.name.length}/50
            </div>
          </div>

          <div className={`${styles.formGroup} ${activeField === 'start_location' ? styles.active : ''}`}>
            <label htmlFor="start_location">
              <FiMapPin className={styles.icon} />
              출발지
              <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="start_location"
              name="start_location"
              value={formData.start_location}
              onChange={handleChange}
              onFocus={() => handleFocus('start_location')}
              onBlur={handleBlur}
              required
              placeholder="예) 서울시 강남구 역삼역 1번 출구"
            />
          </div>

          <div className={`${styles.formGroup} ${activeField === 'end_location' ? styles.active : ''}`}>
            <label htmlFor="end_location">
              <FiMapPin className={styles.icon} />
              도착지
              <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="end_location"
              name="end_location"
              value={formData.end_location}
              onChange={handleChange}
              onFocus={() => handleFocus('end_location')}
              onBlur={handleBlur}
              required
              placeholder="예) 서울시 강남구 테헤란로 212"
            />
          </div>

          <div className={`${styles.formGroup} ${activeField === 'introduction' ? styles.active : ''}`}>
            <label htmlFor="introduction">
              <FiInfo className={styles.icon} />
              코스 소개
            </label>
            <div className={styles.textareaContainer}>
              <textarea
                id="introduction"
                name="introduction"
                value={formData.introduction}
                onChange={handleChange}
                onFocus={() => handleFocus('introduction')}
                onBlur={handleBlur}
                rows="4"
                placeholder="이 코스에 대한 간단한 소개를 작성해주세요."
                maxLength={500}
              />
              <div className={styles.characterCount}>
                {formData.introduction.length}/500
              </div>
            </div>
          </div>

          <div className={`${styles.formGroup} ${activeField === 'tags' ? styles.active : ''}`}>
            <label htmlFor="tags">
              <FiTag className={styles.icon} />
              태그 (쉼표로 구분)
              <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              onFocus={() => handleFocus('tags')}
              onBlur={handleBlur}
              required
              placeholder="예) 한강, 공원, 데이트코스, 가족코스"
            />
            <div className={styles.tagExample}>
              추천 태그: <span>한강</span> <span>공원</span> <span>데이트코스</span> <span>가족코스</span>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>
              <FiImage className={styles.icon} />
              이미지 업로드
              <span className={styles.required}>*</span>
            </label>
            <div className={styles.imageUploadContainer}>
              <div className={styles.uploadArea}>
                <label 
                  htmlFor="image-upload" 
                  className={styles.uploadButton}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.add(styles.dragOver);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove(styles.dragOver);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove(styles.dragOver);
                    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                      handleImageUpload({ target: { files: e.dataTransfer.files } });
                    }
                  }}
                >
                  <FiUpload className={styles.uploadIcon} />
                  <span>이미지를 드래그하거나 클릭하세요</span>
                  <span className={styles.uploadHint}>(최대 10장, JPG/PNG/WEBP, 각 5MB 이하)</span>
                  <input
                    id="image-upload"
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg, image/png, image/webp"
                    multiple
                    onChange={handleImageUpload}
                    className={styles.hiddenInput}
                  />
                </label>
              </div>
              
              {previewImages.length > 0 && (
                <div className={styles.imagePreviews}>
                  {previewImages.map((preview, index) => (
                    <div 
                      key={index} 
                      className={`${styles.imagePreview} ${
                        formData.representative_image_index === index ? styles.representative : ''
                      }`}
                    >
                      <div className={styles.imageWrapper}>
                        <img 
                          src={preview.url} 
                          alt={`미리보기 ${index + 1}`} 
                          onClick={() => handleSetRepresentative(index)}
                        />
                        <button 
                          type="button"
                          className={styles.removeImage}
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage(index);
                          }}
                          aria-label="이미지 삭제"
                        >
                          <FiX />
                        </button>
                      </div>
                      <div className={styles.imageInfo}>
                        <div className={styles.imageName} title={preview.name}>
                          {preview.name.length > 15 
                            ? `${preview.name.substring(0, 10)}...${preview.name.split('.').pop()}` 
                            : preview.name}
                        </div>
                        <div className={styles.imageSize}>{preview.size}</div>
                      </div>
                      {formData.representative_image_index === index && (
                        <div className={styles.repBadge}>
                          <FiCheck size={12} />
                          <span>대표 이미지</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              <p className={styles.helpText}>
                이미지를 클릭하여 대표 이미지로 설정하세요. (첫 번째 이미지가 기본 대표 이미지로 설정됩니다)
              </p>
            </div>
          </div>

          <div className={styles.buttonGroup}>
            <button 
              type="button" 
              className={styles.cancelButton}
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
            >
              취소
            </button>
            <button 
              type="submit" 
              className={`${styles.submitButton} ${
                !formData.name || !formData.start_location || !formData.end_location || !formData.tags || previewImages.length === 0
                  ? styles.disabled
                  : ''
              }`}
              disabled={
                isSubmitting || 
                !formData.name || 
                !formData.start_location || 
                !formData.end_location || 
                !formData.tags || 
                previewImages.length === 0
              }
            >
              {isSubmitting ? (
                <span className={styles.buttonLoading}>
                  <span className={styles.spinner}></span>
                  등록 중...
                </span>
              ) : '산책 코스 등록하기'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreatePathPage;
