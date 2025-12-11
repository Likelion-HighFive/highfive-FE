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

  endSession: async ({
    sessionId,
    pathId,
    steps,
    duration,
    distance,
    isCompleted,
  }) => {
    try {
      const res = await apiClient.post(
        `${WALKING_API_URL}/${sessionId}/end`,
        {
          path_id: Number(pathId),
          steps: Number(steps),
          duration: Number(duration),
          distance: Number(distance),
          is_completed: !!isCompleted,
        }
      );

      return res.data.data;
    } catch (error) {
      console.error("산책 세션 종료 오류:", error);
      throw (
        error.response?.data || {
          message: "산책 세션을 종료하는 중 오류가 발생했습니다.",
        }
      );
    }
  },

  getWalkingSummary: async () => {
    try {
      const response = await apiClient.get(`${WALKING_API_URL}/summary`);
      return response.data;
    } catch (error) {
      console.error("산책 통계 조회 오류:", error);
      throw (
        error.response?.data || {
          message: "산책 통계를 불러오는 중 오류가 발생했습니다.",
        }
      );
    }
  },
};
