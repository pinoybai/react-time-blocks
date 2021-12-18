import { configureStore } from '@reduxjs/toolkit';
import taskReducer from '../slices/TaskSlice';
import totalTimeReducer from '../slices/TotalTimeSlice';

export const store = configureStore({
  reducer: {
    task: taskReducer,
    totalTime: totalTimeReducer
  }
});
