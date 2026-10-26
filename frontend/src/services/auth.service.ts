import api from './api';
import { LoginCredentials, RegisterCredentials, AuthResponse, ApiResponse } from '../types';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || error.message);
    }
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/auth/register', {
        username: credentials.username,
        name: credentials.name,
        email: credentials.email,
        password: credentials.password,
        confirmPassword: credentials.confirmPassword,
        phone: credentials.phone,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || error.message);
    }
  },

  refreshToken: async (): Promise<{ accessToken: string }> => {
    try {
      const response = await api.post<{ accessToken: string }>('/auth/refresh');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || error.message);
    }
  },

  logout: async (): Promise<void> => {
    await AsyncStorage.removeItem('@rpg:token');
    await AsyncStorage.removeItem('@rpg:user');
  },
};
