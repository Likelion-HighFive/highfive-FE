const KAKAO_REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;

export const kakaoApi = {
  // 카카오 모빌리티 API로 실제 도로 경로 가져오기
  getPedestrianRoute: async ({
    startX,
    startY,
    endX,
    endY,
    startName = '출발지',
    endName = '도착지',
  }) => {
    try {
      console.log('Kakao Mobility API 요청:', { startX, startY, endX, endY });

      const url = 'https://apis-navi.kakaomobility.com/v1/directions';

      // origin과 destination은 "경도,위도" 형식
      const params = new URLSearchParams({
        origin: `${startX},${startY}`,
        destination: `${endX},${endY}`,
        priority: 'RECOMMEND', // 추천 경로
        car_fuel: 'GASOLINE',
        car_hipass: false,
        alternatives: false,
        road_details: false,
      });

      const response = await fetch(`${url}?${params}`, {
        method: 'GET',
        headers: {
          Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Kakao API 에러:', response.status, errorData);
        throw new Error(`API 오류: ${response.status}`);
      }

      const data = await response.json();
      console.log('Kakao Mobility API 응답:', data);

      return {
        isSuccess: true,
        data: data,
      };
    } catch (error) {
      console.error('Kakao 경로 요청 실패:', error);
      throw error;
    }
  },

  // Kakao API 응답을 공통 포맷으로 변환
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

    // 전체 거리와 시간
    routeInfo.totalDistance = route.summary?.distance || 0;
    routeInfo.totalTime = route.summary?.duration || 0;

    // 경로 좌표 추출
    const coordinates = [];
    route.sections?.forEach((section) => {
      section.roads?.forEach((road) => {
        // vertexes는 [x, y, x, y, ...] 형식
        const vertexes = road.vertexes || [];
        for (let i = 0; i < vertexes.length; i += 2) {
          const lng = vertexes[i];
          const lat = vertexes[i + 1];
          if (lat && lng) {
            coordinates.push({ lat, lng });
          }
        }
      });
    });

    routeInfo.coordinates = coordinates;

    console.log('파싱된 경로 좌표 개수:', coordinates.length);

    // 안내 정보 추출
    route.sections?.forEach((section) => {
      section.guides?.forEach((guide, index) => {
        if (guide.guidance) {
          routeInfo.instructions.push({
            index: index,
            text: guide.guidance,
            coordinates: {
              lat: guide.y,
              lng: guide.x,
            },
            distance: guide.distance || 0,
            duration: guide.duration || 0,
          });
        }
      });
    });

    return routeInfo;
  },
};

export default kakaoApi;
