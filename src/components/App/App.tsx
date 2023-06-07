import React, { FC, SyntheticEvent } from "react";
import { resetCheckerShadow, resetPossibleGoList } from "@slices/board-slice";
import { useDispatch, useSelector } from "react-redux";
import { selectIsGameOver } from "@selectors/board-selectors";
import { Activities } from "@components/Activities/Activities";
import { Board } from "@components/Board/Board";
import { EndGame } from "@components/EndGame/EndGame";
import { Header } from "@shared/Header/Header";
import css from "./App.css";

export const App: FC = () => {
  // Hooks
  const dispatch = useDispatch();
  const isGameOver = useSelector(selectIsGameOver);

  const handleMouseUp = (e: SyntheticEvent) => {
    e.preventDefault();

    dispatch(resetCheckerShadow());
    dispatch(resetPossibleGoList());
  };

  return (
    <div onMouseUp={handleMouseUp} className={css.container}>
      <Header text="Checkers for Developex from Andriy Slobodian" />
      <div className={css.board}>
        <Board />
        <Activities/>
      </div>
      {isGameOver && <EndGame />}
    </div>
  );
};
