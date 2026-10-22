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
export enum RaceType {
  HUMAN = 'Humano',
  DWARF = 'Anão',
  ELF = 'Elfo',
  HALF_ELF = 'Meio-Elfo',
  DWARF_HALF = 'Meio-Anão',
  HALFLING = 'Halfling',
  GNOME = 'Gnomo',
  ORC_HALF = 'Meio-Orc',
  TIEFLING = 'Tiefling',
  USAGI = 'Usagi',
  TORA = 'Tora',
  KARASU = 'Karasu',
  KITSUNE = 'Kitsune',
  INU = 'Inu',
  NEKO = 'Neko',
  HALF_GENIE = 'Meio-Gênio',
  SATYR = 'Sátiro',
  CUSTOM = 'Customizado',
}

export interface Avatar {
  id: string;
  name: string;
  race: RaceType;
  level: number;
  tier: number;
  experience: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// Atributos Types
export interface Atributos {
  id: string;
  strength: number;
  agility: number;
  defence: number;
  resistance: number;
  intelligence: number;
  vitality: number;
  energyPoints: number;
  attributePoints: number;
  skillPoints: number;
  avatarId: string;
  createdAt: string;
  updatedAt: string;
  maxHealth?: number;
  maxEnergy?: number;
  attackPower?: number;
  defensePower?: number;
  magicPower?: number;
}

// Inventory Types
export interface Inventory {
  id: string;
  pesoMax: number;
  pesoActual: number;
  avatarId: string;
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
  co_password: string;
  phone?: string;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  success: boolean;
  error?: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
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
  Classes: undefined;
  Skills: undefined;
  Quests: undefined;
  Friends: undefined;
  Forge: undefined;

  // Modal Screens
  CharacterCreation: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
