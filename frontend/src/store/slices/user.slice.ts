import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, Avatar, Atributos } from '../../types/domain';

interface UserState {
  user: User | null;
  avatar: Avatar | null;
  atributos: Atributos | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  avatar: null,
  atributos: null,
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
      atributos?: Atributos;
    }>) {
      state.user = action.payload.user;
      state.avatar = action.payload.avatar || null;
      state.atributos = action.payload.atributos || null;
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
    updateAtributos(state, action: PayloadAction<Partial<Atributos>>) {
      if (state.atributos) {
        state.atributos = { ...state.atributos, ...action.payload };
      }
    },
    clearUser(state) {
      state.user = null;
      state.avatar = null;
      state.atributos = null;
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
  updateAtributos,
  clearUser
} = userSlice.actions;

export default userSlice.reducer;
