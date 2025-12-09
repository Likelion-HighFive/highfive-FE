import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});


apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  const tokenType = localStorage.getItem("tokenType") || "Bearer";

  if (token) {
    config.headers.Authorization = `${tokenType} ${token}`;
  }
  return config;
});

export default apiClient;
