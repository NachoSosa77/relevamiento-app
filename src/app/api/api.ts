// api.ts o axiosConfig.ts
import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true, // si estás usando cookies
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname + window.location.search;
      window.location.href = `/login?returnTo=${encodeURIComponent(currentPath)}`;
    }
    return Promise.reject(error);
  }
);

export default api;
