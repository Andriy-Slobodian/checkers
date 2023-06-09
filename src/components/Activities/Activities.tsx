import React, { FC, memo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectActivityList } from "@selectors/activity-selectors";
import { addActivity, clearActivityList } from "@slices/activity-slice";
import { DEFAULT_ACTIVITY_TEXT_PLAYER_1 } from "@constants";
import { resetBoard, resetTurn } from "@slices/board-slice";
import { Header } from "@shared/Header/Header";
import css from './Activities.css';

export const Activities: FC = memo(() => {
  // Hooks
  const dispatch = useDispatch();
  const activityList = useSelector(selectActivityList);

  useEffect(() => {
    if (activityList.length === 0) {
      dispatch(addActivity(DEFAULT_ACTIVITY_TEXT_PLAYER_1));
    }
  }, [activityList.length]);

  const handleNewGame = () => {
    dispatch(resetBoard());
    dispatch(resetTurn());
    dispatch(clearActivityList());
  };

  return (
    <div className={css.container}>
      <Header align="left" text="Activities" type="h2" />
      <p className={css.text}>Welcome! This is a demo-commentator of the game activities.</p>
      <ol className={css.list}>
        {activityList.map((activity, index) => {
          return (
            <li key={`turn-${index}`}>{activity}</li>
          );
        })}
      </ol>
      <button className={css.newGameBtn} onClick={handleNewGame}>New Game</button>
    </div>
  );
});
