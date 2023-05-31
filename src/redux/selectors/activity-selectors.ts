import { store } from "../store";
import {createSelector} from "@reduxjs/toolkit";

export const selectActivityList = () => store.getState().activity.activityList;

export const selectIsWhiteTurn = () => store.getState().activity.isWhiteTurn;
