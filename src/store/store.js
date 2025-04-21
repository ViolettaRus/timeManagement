import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import projectsReducer from './slices/projectsSlice';
import timeEntriesReducer from './slices/timeEntriesSlice';
import themeReducer from './slices/themeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectsReducer,
    timeEntries: timeEntriesReducer,
    theme: themeReducer,
  }
});

export default store;