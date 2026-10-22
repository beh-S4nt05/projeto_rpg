import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from '../../types/domain';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  isLoading: true,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess(state, action: PayloadAction<{ user: User; token: string }>) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isLoading = false;
      state.error = null;
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.isLoading = false;
      state.error = action.payload;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.isLoading = false;
      state.error = null;
    },
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  setUser,
  clearError
} = authSlice.actions;

export default authSlice.reducer;

// Persist auth state
export const persistAuthState = async (state: AuthState) => {
  try {
    if (state.token) {
      await AsyncStorage.setItem('@rpg:token', state.token);
    } else {
      await AsyncStorage.removeItem('@rpg:token');
    }

    if (state.user) {
      await AsyncStorage.setItem('@rpg:user', JSON.stringify(state.user));
    } else {
      await AsyncStorage.removeItem('@rpg:user');
    }
  } catch (error) {
    console.error('Failed to persist auth state', error);
  }
};

// Load auth state
export const loadAuthState = async (): Promise<AuthState> => {
  try {
    const token = await AsyncStorage.getItem('@rpg:token');
    const userString = await AsyncStorage.getItem('@rpg:user');

    const user: User | null = userString ? JSON.parse(userString) : null;

    return {
      ...initialState,
      isAuthenticated: !!token && !!user,
      user,
      token,
      isLoading: false,
    };
  } catch (error) {
    return initialState;
  }
};
