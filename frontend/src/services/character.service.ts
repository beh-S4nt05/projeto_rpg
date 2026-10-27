import api from './api';
import { Avatar, Attributes, Race, CharacterClass, ApiResponse } from '../types';

export const characterService = {
  getMyAvatar: async (): Promise<{
    avatar: Avatar;
    attributes: Attributes;
    inventory: any;
  }> => {
    try {
      const response = await api.get<ApiResponse<{
        avatar: Avatar;
        attributes: Attributes;
        inventory: any;
      }>>('/characters/me');
      return response.data.data || response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || error.message);
    }
  },

  getAvatarById: async (id: string): Promise<Avatar> => {
    try {
      const response = await api.get<ApiResponse<Avatar>>(`/characters/${id}`);
      return response.data.data || response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || error.message);
    }
  },

  updateAvatar: async (id: string, data: Partial<Avatar>): Promise<Avatar> => {
    try {
      const response = await api.put<ApiResponse<Avatar>>(`/characters/${id}`, data);
      return response.data.data || response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || error.message);
    }
  },

  levelUp: async (id: string): Promise<Avatar> => {
    try {
      const response = await api.put<ApiResponse<Avatar>>(`/characters/${id}/level-up`);
      return response.data.data || response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || error.message);
    }
  },

  gainExperience: async (id: string, amount: number): Promise<{ avatar: Avatar; leveledUp: boolean; levelsGained: number }> => {
    try {
      const response = await api.put<ApiResponse<{ avatar: Avatar; leveledUp: boolean; levelsGained: number }>>
        (`/characters/${id}/experience`, { amount });
      return response.data.data || response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || error.message);
    }
  },

  updateAttributes: async (id: string, data: Partial<Attributes>): Promise<Attributes> => {
    try {
      const response = await api.put<ApiResponse<Attributes>>(`/characters/${id}/attributes`, data);
      return response.data.data || response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || error.message);
    }
  },

  getAllRaces: async (): Promise<Race[]> => {
    try {
      const response = await api.get<ApiResponse<Race[]>>('/characters/races');
      return response.data.data || response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || error.message);
    }
  },

  getAllClasses: async (): Promise<CharacterClass[]> => {
    try {
      const response = await api.get<ApiResponse<CharacterClass[]>>('/characters/classes');
      return response.data.data || response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || error.message);
    }
  },
};
