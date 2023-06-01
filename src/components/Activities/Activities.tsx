import React, {FC, useEffect} from "react";
import css from './Activities.css';
import { Header } from "@shared/Header/Header";
import { useDispatch, useSelector } from "react-redux";
import { selectActivityList } from "@selectors/activity-selectors";
import { addActivity } from "@slices/activity-slice";
import {DEFAULT_ACTIVITY_TEXT_PLAYER_1} from "@constants";
import { resetBoard } from "@slices/board-slice";

export const Activities: FC = () => {
  const dispatch = useDispatch();
  const activityList = useSelector(selectActivityList);

  useEffect(() => {
    dispatch(addActivity(DEFAULT_ACTIVITY_TEXT_PLAYER_1));
  }, []);

  const handleNewGame = () => {
    dispatch(resetBoard);
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
};
