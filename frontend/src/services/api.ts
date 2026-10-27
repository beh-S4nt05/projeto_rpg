import axios, { AxiosInstance, AxiosError } from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Determine API URL based on platform
const API_URL =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:3000' // Android emulator
    : 'http://localhost:3000'; // iOS simulator / physical device

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('@rpg:token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired, try to refresh
      const originalRequest = error.config;
      const token = await AsyncStorage.getItem('@rpg:token');

      if (token && originalRequest) {
        try {
          const response = await axios.post(`${API_URL}/auth/refresh`, {}, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const newToken = response.data.accessToken;
          await AsyncStorage.setItem('@rpg:token', newToken);

          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axios(originalRequest);
        } catch (refreshError) {
          // Refresh failed, logout
          await AsyncStorage.removeItem('@rpg:token');
          await AsyncStorage.removeItem('@rpg:user');
        }
      }
    }

    return Promise.reject(error);
  },
);

export default api;
