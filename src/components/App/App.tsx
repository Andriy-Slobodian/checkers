import { FC, SyntheticEvent } from "react";
import { Header } from "@shared/Header/Header";
import { Board } from "@components/Board/Board";
import { resetCheckerShadow, resetPossibleGoCell } from "@slices/board-slice";
import { useDispatch } from "react-redux";
import { Activities } from "@components/Activities/Activities";
import css from "./App.css";

export const App: FC = () => {
  // Hooks
  const dispatch = useDispatch();

  const handleMouseUp = (e: SyntheticEvent) => {
    e.preventDefault();

    dispatch(resetCheckerShadow());
    dispatch(resetPossibleGoCell());
  };

  return (
    <div onMouseUp={handleMouseUp}>
      <Header text="Checkers for Developex from Andriy Slobodian" />
      <div className={css.container}>
        <Board />
        <Activities />
      </div>
    </div>
  );
};
