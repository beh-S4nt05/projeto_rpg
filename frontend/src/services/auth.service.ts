import api from './api/api';
import { LoginCredentials, RegisterCredentials, AuthResponse, ApiResponse, User } from '../types/domain';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  register: async (credentials: RegisterCredentials): Promise<ApiResponse<User>> => {
    const response = await api.post<ApiResponse<User>>('/users', credentials);
    return response.data;
  },

  refreshToken: async (): Promise<{ access_token: string }> => {
    const response = await api.post<{ access_token: string }>('/auth/refresh');
    return response.data;
  },

  logout: async (): Promise<void> => {
    // Just remove tokens from storage
    // The interceptor will handle the rest
    await AsyncStorage.removeItem('@rpg:token');
    await AsyncStorage.removeItem('@rpg:user');
  },
};

import AsyncStorage from '@react-native-async-storage/async-storage';
