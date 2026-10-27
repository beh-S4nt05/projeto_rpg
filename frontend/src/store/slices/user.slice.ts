import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, Avatar, Attributes, Inventory } from '../../types';

interface UserState {
  user: User | null;
  avatar: Avatar | null;
  attributes: Attributes | null;
  inventory: Inventory | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  avatar: null,
  attributes: null,
  inventory: null,
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    fetchUserStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    fetchUserSuccess(state, action: PayloadAction<{
      user: User;
      avatar?: Avatar;
      attributes?: Attributes;
      inventory?: Inventory;
    }>) {
      state.user = action.payload.user;
      state.avatar = action.payload.avatar || null;
      state.attributes = action.payload.attributes || null;
      state.inventory = action.payload.inventory || null;
      state.isLoading = false;
      state.error = null;
    },
    fetchUserFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateUser(state, action: PayloadAction<Partial<User>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    updateAvatar(state, action: PayloadAction<Partial<Avatar>>) {
      if (state.avatar) {
        state.avatar = { ...state.avatar, ...action.payload };
      }
    },
    updateAttributes(state, action: PayloadAction<Partial<Attributes>>) {
      if (state.attributes) {
        state.attributes = { ...state.attributes, ...action.payload };
      }
    },
    updateInventory(state, action: PayloadAction<Partial<Inventory>>) {
      if (state.inventory) {
        state.inventory = { ...state.inventory, ...action.payload };
      }
    },
    clearUser(state) {
      state.user = null;
      state.avatar = null;
      state.attributes = null;
      state.inventory = null;
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const {
  fetchUserStart,
  fetchUserSuccess,
  fetchUserFailure,
  updateUser,
  updateAvatar,
  updateAttributes,
  updateInventory,
  clearUser
} = userSlice.actions;

export default userSlice.reducer;
