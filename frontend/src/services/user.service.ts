import api from './api';
import { User, Avatar, Attributes, Inventory, ApiResponse } from '../types';

export const userService = {
  getProfile: async (): Promise<{
    user: User;
    avatar?: Avatar;
    attributes?: Attributes;
    inventory?: Inventory;
  }> => {
    try {
      const response = await api.get<ApiResponse<{
        user: User;
        avatar?: Avatar;
        attributes?: Attributes;
        inventory?: Inventory;
      }>>('/users/me');
      return response.data.data || response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || error.message);
    }
  },

  getById: async (id: string): Promise<User> => {
    try {
      const response = await api.get<ApiResponse<User>>(`/users/${id}`);
      return response.data.data || response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || error.message);
    }
  },

  updateProfile: async (id: string, data: Partial<User>): Promise<User> => {
    try {
      const response = await api.put<ApiResponse<User>>(`/users/${id}`, data);
      return response.data.data || response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || error.message);
    }
  },
};
