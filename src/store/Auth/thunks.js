import { createAsyncThunk } from '@reduxjs/toolkit';
import { request } from '../../helpers/request';
import {
  API_CURRENT_USER,
  API_LOGOUT,
  API_LOGIN
} from '../../constants/api';

export const login = createAsyncThunk('LOGIN', async ({ login, pincode }) => {
  const res = await request.post(API_LOGIN, {
    login,
    pincode
  });
  return res.data;
});

export const fetchCurrentUser = createAsyncThunk('FETCH_CURRENT_USER', async () => {
  const res = await request.get(API_CURRENT_USER);
  return res.data.user;
});

export const signOut = createAsyncThunk('SIGN_OUT', async () => {
  try {
    await request.post(API_LOGOUT);
  } catch (e) {
    console.log(e);
  }
});
