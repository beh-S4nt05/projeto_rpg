import api from './api/api';
import { User, Avatar, Atributos, ApiResponse } from '../types/domain';

export const userService = {
  getProfile: async (): Promise<{ user: User; avatar?: Avatar; atributos?: Atributos }> => {
    const response = await api.get<ApiResponse<{ user: User; avatar?: Avatar; atributos?: Atributos }>>('/users/me');
    return response.data.data || response.data;
  },

  getById: async (id: string): Promise<User> => {
    const response = await api.get<ApiResponse<User>>(`/users/${id}`);
    return response.data.data || response.data;
  },

  updateProfile: async (id: string, data: Partial<User>): Promise<User> => {
    const response = await api.put<ApiResponse<User>>(`/users/${id}`, data);
    return response.data.data || response.data;
  },

  getAvatar: async (userId: string): Promise<Avatar> => {
    // TODO: Implement when backend endpoint is ready
    const response = await api.get<ApiResponse<Avatar>>(`/avatars/user/${userId}`);
    return response.data.data || response.data;
  },

  getAtributos: async (avatarId: string): Promise<Atributos> => {
    // TODO: Implement when backend endpoint is ready
    const response = await api.get<ApiResponse<Atributos>>(`/atributos/${avatarId}`);
    return response.data.data || response.data;
  },

  updateAtributos: async (avatarId: string, data: Partial<Atributos>): Promise<Atributos> => {
    // TODO: Implement when backend endpoint is ready
    const response = await api.put<ApiResponse<Atributos>>(`/atributos/${avatarId}`, data);
    return response.data.data || response.data;
  },
};
