import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Simulate} from "react-dom/test-utils";
import change = Simulate.change;


const initialState = {
  activityList: [],
  isWhiteTurn: true
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
    },
    updateTurn(state, action: PayloadAction<boolean>) {
      state.isWhiteTurn = action.payload;
    }
  }
});

export const {
  addActivity,
  clearActivityList,
  updateTurn
} = activitySlice.actions
