import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true // send cookies in cross-origin requests
});

// Request interceptor to inject Authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 and request has not been retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Send refresh token request (cookies are sent automatically due to withCredentials: true)
        const response = await axios.post(`${API_URL}/auth/refresh-token`, {});
        const { accessToken } = response.data;

        // Save new token in Zustand store
        useAuthStore.getState().setAccessToken(accessToken);

        processQueue(null, accessToken);
        isRefreshing = false;

        // Retry the original request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        
        // Log user out if refresh token fails
        useAuthStore.getState().logoutUser();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
