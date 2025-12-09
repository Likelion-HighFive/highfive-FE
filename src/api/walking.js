import apiClient from "./client";

const WALKING_API_URL = "/walking";

export const walkingService = {
  startSession: async (pathId) => {
    try {
      const res = await apiClient.post(`${WALKING_API_URL}/start`, {
        path_id: Number(pathId),
      });

      return res.data.data;
    } catch (error) {
      console.error("산책 세션 시작 오류:", error);
      throw (
        error.response?.data || {
          message: "산책 세션을 시작하는 중 오류가 발생했습니다.",
        }
      );
    }
  },
};
