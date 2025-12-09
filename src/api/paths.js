import apiClient from "./client";

const PATH_API_URL = "/paths";

export const pathsService = {
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
};
