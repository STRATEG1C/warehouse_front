import { createSlice } from '@reduxjs/toolkit';
import { fetchCurrentUser, login, signOut } from './thunks';

const initialState = {
  user: null,
  authData: {},
  isLoading: false,
  isError: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearUser: state => {
      state.user = null;
    },
    toggleLoading: state => {
      state.isLoading = !state.isLoading;
    }
  },
  extraReducers: {
    [login.pending]: (state, action) => {
      state.isLoading = true;
      state.isError = false;
    },
    [login.fulfilled]: (state, action) => {
      state.authData = action.payload;
      state.isLoading = false;
    },
    [login.rejected]: (state, action) => {
      state.isError = true;
      state.isLoading = false;
    },

    [fetchCurrentUser.pending]: (state, action) => {
      state.isLoading = true;
      state.isError = false;
    },
    [fetchCurrentUser.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
    },
    [fetchCurrentUser.rejected]: (state, action) => {
      state.isLoading = false;
      state.isError = true;
    },

    [signOut.pending]: (state, action) => {
    },
    [signOut.fulfilled]: (state, action) => {
      state.user = null;
      state.authData = {};
    },
    [signOut.rejected]: (state, action) => {
      state.user = null;
      state.authData = {};
    }
  }
});

export const { setUser, clearUser } = authSlice.actions;

export const selectCurrentUser = state => state.user;

export default authSlice.reducer;
