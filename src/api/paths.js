import apiClient from "./client";

const PATH_API_URL = "/paths";

export const pathsService = {
  /**
   * 산책 코스 목록 조회
   * @param {Object} options
   * @param {string} options.filter - ALL | EMOTIONAL | CITY_VIEW | NATURE | NIGHT_VIEW | SAFE
   * @param {string} options.sort   - LATEST | RECOMMENDED | LIKES | DISTANCE
   * @returns {Promise<Array>}
   */
  getPaths: async ({ filter = "ALL", sort = "LATEST" } = {}) => {
    try {
      const res = await apiClient.get(PATH_API_URL, {
        params: { filter, sort },
      });
      return res.data.data; // APIResponse 구조에서 data 추출
    } catch (error) {
      console.error("산책 코스 목록 조회 오류:", error);
      throw (
        error.response?.data || {
          message: "산책 코스를 불러오는 중 오류가 발생했습니다.",
        }
      );
    }
  },

  /**
   * 산책 코스 상세 조회
   * @param {number} pathId
   * @returns {Promise<Object>}
   */
  getPathDetail: async (pathId) => {
    try {
      const res = await apiClient.get(`${PATH_API_URL}/${pathId}`);
      return res.data.data;
    } catch (error) {
      console.error(`산책 코스 상세 (ID: ${pathId}) 조회 오류:`, error);
      throw (
        error.response?.data || {
          message: "산책 코스 정보를 불러오는 중 오류가 발생했습니다.",
        }
      );
    }
  },

  /**
   * 산책 코스 좋아요 토글
   * @param {number} pathId
   * @returns {Promise<Object>}
   */
  toggleLike: async (pathId) => {
    try {
      const res = await apiClient.post(
        `${PATH_API_URL}/${pathId}/like-toggle`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            // Authorization 필요하면 apiClient에서 자동 처리 가능
          },
          withCredentials: true,
        }
      );
      return res.data;
    } catch (error) {
      console.error(`산책 코스 좋아요 토글 오류 (ID: ${pathId}):`, error);
      throw error.response?.data || { message: "좋아요 처리 중 오류 발생" };
    }
  },
};

export default pathsService;
