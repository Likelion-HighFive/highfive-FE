const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

let isGoogleMapsLoaded = false;
let loadPromise = null;

/**
 * Google Maps JavaScript API를 동적으로 로드하는 함수
 * @returns {Promise<void>}
 */
export const loadGoogleMapsScript = () => {
  // 이미 로드되었으면 바로 resolve
  if (isGoogleMapsLoaded && window.google && window.google.maps) {
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
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;

    script.onload = () => {
      isGoogleMapsLoaded = true;
      console.log('Google Maps SDK 로드 완료');
      resolve();
    };

    script.onerror = () => {
      console.error('Google Maps SDK 로드 실패');
      loadPromise = null;
      reject(new Error('Google Maps SDK 로드 실패'));
    };

    document.head.appendChild(script);
  });

  return loadPromise;
};
