const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * 인증 토큰을 포함한 API 요청을 보내는 유틸리티 함수
 * @param {string} url - 요청할 API 엔드포인트
 * @param {Object} options - fetch 옵션
 * @returns {Promise<Object>} API 응답 데이터
 */
async function fetchWithAuth(url, options = {}) {
  // 로컬 스토리지에서 액세스 토큰과 토큰 타입 가져오기
  const token = localStorage.getItem('accessToken');
  const tokenType = localStorage.getItem('tokenType') || 'Bearer';
  
  // 기본 헤더 설정
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...options.headers, // 기존 옵션의 헤더가 있다면 병합
  };

  // 토큰이 있으면 Authorization 헤더에 추가
  if (token) {
    headers['Authorization'] = `${tokenType} ${token}`;
  }

  // API 요청 보내기
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  // 응답을 JSON으로 파싱 (에러 발생 시 빈 객체 반환)
  const resJson = await response.json().catch(() => ({}));

  // 응답이 실패하거나 서버에서 오류를 반환한 경우
  if (!response.ok || !resJson?.isSuccess) {
    const error = new Error(resJson?.message || '요청을 처리하는 중 오류가 발생했습니다.');
    error.status = response.status;
    error.data = resJson;
    throw error; // 에러 던지기
  }

  // 성공 시 응답 데이터 반환
  return resJson;
}

// 사용자 관련 API 모음
export const userApi = {
  // 사용자 프로필 조회
  getProfile: () => fetchWithAuth('/mypage/profile'),
  
  // 닉네임 업데이트
  updateNickname: (nickname) => 
    fetchWithAuth('/mypage/nickname', {
      method: 'PATCH',
      body: JSON.stringify({ nickname })
    }),
  
  // 여기에 다른 사용자 관련 API를 추가할 수 있음.
};

// 기본 내보내기
export default {
  userApi,
};
