import axios from 'axios';

// Tmap API 클라이언트
const tmapApiClient = axios.create({
  baseURL: 'https://apis.openapi.sk.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const tmapApi = {
  // 도보 경로 찾기
  getPedestrianRoute: async ({
    startX,
    startY,
    endX,
    endY,
    startName = '출발지',
    endName = '도착지',
  }) => {
    try {
      const response = await tmapApiClient.post(
        '/tmap/routes/pedestrian',
        {
          startX,
          startY,
          endX,
          endY,
          startName,
          endName,
          reqCoordType: 'WGS84Geo',
          resCoordType: 'WGS84Geo',
          ticketId: import.meta.env.VITE_TMAP_API_KEY,
        }
      );

      if (response.data.features) {
        return {
          isSuccess: true,
          data: response.data,
        };
      } else {
        throw new Error('경로 데이터를 찾을 수 없습니다.');
      }
    } catch (error) {
      console.error('Tmap 도보 경로 API 오류:', error);
      return {
        isSuccess: false,
        message: error.response?.data?.message || '경로 찾기에 실패했습니다.',
        error,
      };
    }
  },

  // Polyline 문자열 좌표로 변환
  decodePolyline: (polyline) => {
    const points = [];
    let index = 0,
      lat = 0,
      lng = 0;

    while (index < polyline.length) {
      let result = 0,
        shift = 0;
      let byte;

      do {
        byte = polyline.charCodeAt(index++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);

      const dlat = result & 1 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      result = 0;
      shift = 0;
      do {
        byte = polyline.charCodeAt(index++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);

      const dlng = result & 1 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      points.push({
        lat: lat / 1e5,
        lng: lng / 1e5,
      });
    }

    return points;
  },


  parseRouteResponse: (apiResponse) => {
    const features = apiResponse.features || [];
    const routeInfo = {
      totalDistance: 0,
      totalTime: 0,
      polyline: null,
      instructions: [],
      coordinates: [],
    };

    features.forEach((feature) => {
      if (feature.geometry.type === 'LineString') {
        // 경로 좌표
        const coords = feature.geometry.coordinates;
        routeInfo.coordinates = coords.map(([lng, lat]) => ({
          lat,
          lng,
        }));
        routeInfo.polyline = feature.properties.polyline;
        routeInfo.totalDistance = feature.properties.distance || 0;
        routeInfo.totalTime = feature.properties.time || 0;
      } else if (feature.geometry.type === 'Point') {
        // 안내 지점
        const description = feature.properties.description || '';
        if (description) {
          routeInfo.instructions.push({
            index: routeInfo.instructions.length,
            text: description,
            coordinates: {
              lat: feature.geometry.coordinates[1],
              lng: feature.geometry.coordinates[0],
            },
            distance: feature.properties.distance || 0,
            time: feature.properties.time || 0,
          });
        }
      }
    });

    return routeInfo;
  },
};

export default tmapApi;
