import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const pathApi = {
  /**
   * Toggle like status for a path
   * @param {number} pathId - The ID of the path to like/unlike
   * @returns {Promise<Object>} Response data with updated like status
   */
  toggleLike: async (pathId) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}paths/${pathId}/like-toggle`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            // Add authorization header if needed
            // 'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          withCredentials: true
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error toggling like:', error);
      throw error;
    }
  },
  
  // You can add more path-related API calls here
};

export default pathApi;
