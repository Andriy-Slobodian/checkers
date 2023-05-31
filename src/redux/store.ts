import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { boardSlice } from '@slices/board-slice';
import { activitySlice } from "@slices/activity-slice";

export const rootReducer = combineReducers({
  board: boardSlice.reducer,
  activity: activitySlice.reducer
});

export const store = configureStore({
  reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
