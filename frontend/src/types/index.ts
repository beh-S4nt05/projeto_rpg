// User Types
export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  phone?: string | null;
  createdAt: string;
  updatedAt: string;
}

// Avatar Types
export interface Avatar {
  id: string;
  name: string;
  userId: string;
  raceId: number;
  race: Race;
  classId?: number | null;
  characterClass?: CharacterClass | null;
  level: number;
  experience: number;
  experienceToNextLevel: number;
  createdAt: string;
  updatedAt: string;
}

export interface Race {
  id: number;
  name: string;
  description: string;
}

export interface CharacterClass {
  id: number;
  name: string;
  description: string;
}

// Attributes Types
export interface Attributes {
  id: string;
  avatarId: string;
  strength: number;
  agility: number;
  defence: number;
  resistance: number;
  intelligence: number;
  vitality: number;
  energyPoints: number;
  attributePoints: number;
  skillPoints: number;
  createdAt: string;
  updatedAt: string;
}

// Inventory Types
export interface Inventory {
  id: string;
  avatarId: string;
  maxWeight: number;
  currentWeight: number;
  maxSlots: number;
  usedSlots: number;
  createdAt: string;
  updatedAt: string;
}

// Auth Types
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  success?: boolean;
  error?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

// Navigation Types
export type RootStackParamList = {
  // Auth Stack
  Login: undefined;
  Register: undefined;

  // Main Stack
  Home: undefined;
  Profile: undefined;
  Attributes: undefined;
  Inventory: undefined;
  CharacterCreation: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
