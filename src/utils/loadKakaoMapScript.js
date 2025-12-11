const KAKAO_MAP_APP_KEY = import.meta.env.VITE_KAKAO_APP_KEY;

let isKakaoMapLoaded = false;
let loadPromise = null;

// 카카오맵 SDK를 로드
export const loadKakaoMapScript = () => {
  // 이미 로드되었으면 바로 resolve
  if (isKakaoMapLoaded && window.kakao && window.kakao.maps) {
    return Promise.resolve();
  }

  // 로딩 중이면 기존 Promise 반환
  if (loadPromise) {
    return loadPromise;
  }

  // 새로운 로딩 시작
  loadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_APP_KEY}&autoload=false`;

    script.onload = () => {
      // autoload=false이므로 명시적으로 로드
      window.kakao.maps.load(() => {
        isKakaoMapLoaded = true;
        console.log('Kakao Maps SDK 로드 완료');
        resolve();
      });
    };

    script.onerror = () => {
      console.error('Kakao Maps SDK 로드 실패');
      loadPromise = null;
      reject(new Error('Kakao Maps SDK 로드 실패'));
    };

    document.head.appendChild(script);
  });

  return loadPromise;
};
