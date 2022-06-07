import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const reloadApp = createAsyncThunk('swAppUpdater/reloadApp', async () => {
  const registration = await navigator.serviceWorker.register('/service-worker.js');
  return registration;
});

interface ServiceWorkerState {
  isUpdateAvailable: boolean;
}

const initialState: ServiceWorkerState = {
  isUpdateAvailable: false,
};

export const swAppUpdaterSlice = createSlice({
  name: 'swAppUpdater',
  initialState,
  reducers: {
    updateAvailable: (state) => {
      state.isUpdateAvailable = true;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(reloadApp.fulfilled, (state, action) => {
      state.isUpdateAvailable = false;
      const { payload: swRegistration } = action;
      const waitingWorker = swRegistration.waiting;
      // note-worthy bit: tell the new (waiting) service worker to stop waiting, and reload the page.
      waitingWorker?.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    });
  },
});
