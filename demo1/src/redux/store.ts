import { configureStore } from '@reduxjs/toolkit';
import { swAppUpdaterSlice } from './swAppUpdaterSlice';

export const store = configureStore({
  reducer: {
    [swAppUpdaterSlice.name]: swAppUpdaterSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
