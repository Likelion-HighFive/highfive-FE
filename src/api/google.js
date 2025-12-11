export const googleApi = {
  // Google Directions API로 보행자 경로 가져오기
  getPedestrianRoute: async ({
    startX,
    startY,
    endX,
    endY,
    startName = '출발지',
    endName = '도착지',
  }) => {
    try {
      console.log('Google Directions API 요청:', { startX, startY, endX, endY });

      // Google Maps Directions Service 사용
      if (!window.google || !window.google.maps) {
        throw new Error('Google Maps SDK가 로드되지 않았습니다.');
      }

      const directionsService = new window.google.maps.DirectionsService();

      const request = {
        origin: { lat: startY, lng: startX },
        destination: { lat: endY, lng: endX },
        travelMode: window.google.maps.TravelMode.WALKING, // 보행자 모드
      };

      console.log('Google Directions 요청 파라미터:', {
        origin: request.origin,
        destination: request.destination,
        travelMode: 'WALKING',
      });

      return new Promise((resolve, reject) => {
        directionsService.route(request, (result, status) => {
          if (status === 'OK') {
            console.log('Google Directions API 응답:', result);
            resolve({
              isSuccess: true,
              data: result,
            });
          } else {
            console.error('Google Directions API 에러:', status);
            console.error('요청 정보:', request);
            reject(new Error(`API 오류: ${status}`));
          }
        });
      });
    } catch (error) {
      console.error('Google 경로 요청 실패:', error);
      throw error;
    }
  },

  // Google Directions API 응답을 공통 포맷으로 변환
  parseRouteResponse: (apiResponse) => {
    const routeInfo = {
      totalDistance: 0,
      totalTime: 0,
      coordinates: [],
      instructions: [],
    };

    if (!apiResponse.routes || apiResponse.routes.length === 0) {
      console.warn('경로 데이터가 없습니다.');
      return routeInfo;
    }

    const route = apiResponse.routes[0];
    const leg = route.legs[0];

    // 전체 거리와 시간
    routeInfo.totalDistance = leg.distance?.value || 0;
    routeInfo.totalTime = leg.duration?.value || 0;

    // 경로 좌표 추출 (overview_path에서)
    if (route.overview_path) {
      routeInfo.coordinates = route.overview_path.map((point) => ({
        lat: point.lat(),
        lng: point.lng(),
      }));
    }

    console.log('파싱된 경로 좌표 개수:', routeInfo.coordinates.length);

    // 안내 정보 추출
    leg.steps?.forEach((step, index) => {
      routeInfo.instructions.push({
        index: index,
        text: step.instructions,
        coordinates: {
          lat: step.start_location.lat(),
          lng: step.start_location.lng(),
        },
        distance: step.distance?.value || 0,
        duration: step.duration?.value || 0,
      });
    });

    return routeInfo;
  },
};

export default googleApi;
