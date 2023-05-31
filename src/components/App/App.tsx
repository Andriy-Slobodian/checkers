import React, {FC, SyntheticEvent} from "react";
import {Header} from "@components/Header/Header";
import {Board} from "@components/Board/Board";
import {resetCheckerShadow, resetPossibleGoCell} from "@slices/board-slice";
import {useDispatch} from "react-redux";
import {TopBar} from "@components/TopBar/TopBar";

export const App: FC = () => {
  const dispatch = useDispatch();

  const handleMouseUp = (e: SyntheticEvent) => {
    e.preventDefault();

    dispatch(resetCheckerShadow());
    dispatch(resetPossibleGoCell());
  };

  return (
    <div onMouseUp={handleMouseUp}>
      <Header text="Checkers for Developex from Andriy Slobodian" />
      <TopBar />
      <Board />
    </div>
  );
};
