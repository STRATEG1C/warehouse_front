import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Auth';

const getSavedState = () => {
  return JSON.parse(localStorage.getItem('state')) || {};
}

export const combinedReducer = {
  auth: authReducer,
}

const store = configureStore({
  preloadedState: getSavedState(),
  reducer: combinedReducer
});

store.subscribe(() => {
  const state = store.getState();
  localStorage.setItem('state', JSON.stringify({
    auth: state.auth
  }));
});

export default store;
