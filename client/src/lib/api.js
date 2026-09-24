import axios from "axios";


const API_URL = (import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://127.0.0.1:8000" : ""))
  .replace(/\/+$/, "");

const api = axios.create({
  baseURL: `${API_URL}/api/`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await axios.post(
          `${API_URL}/api/auth/token/refresh/`,
          {},
          { withCredentials: true }
        );
        return api(originalRequest);
      } catch {
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
