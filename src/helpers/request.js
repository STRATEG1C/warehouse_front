import axios from 'axios';
import { api } from '../constants/api';

export const request = axios.create({
  baseURL: api,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  }
});

request.interceptors.request.use(
  async (config) => {
    try {
      const state = JSON.parse(localStorage.getItem('state'));
      if (state && state.auth) {
        config.headers.Authorization = `Bearer ${state.auth.authData.access_token}`;
      }
      return Promise.resolve(config);
    } catch (error) {
      return Promise.resolve(config);
    }
  },
  async (error) => Promise.reject(error)
);
