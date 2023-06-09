import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type TInitialState = {
  activityList: string[]
}
const initialState: TInitialState = {
  activityList: []
}
export const activitySlice = createSlice({
  name: 'activity',
  initialState,
  reducers: {
    addActivity(state, action: PayloadAction<string>) {
      state.activityList = [
        ...state.activityList,
        action.payload
      ];
    },
    clearActivityList(state) {
      state.activityList = [];
    }
  }
});

export const {
  addActivity,
  clearActivityList
} = activitySlice.actions
