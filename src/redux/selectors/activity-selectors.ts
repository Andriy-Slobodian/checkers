import { store } from "../store";

export const selectActivityList = () => store.getState().activity.activityList;
