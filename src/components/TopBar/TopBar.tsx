import {FC} from "react";
import css from "./TopBar.css";
import {useDispatch} from "react-redux";
import {resetBoard} from "@slices/board-slice";

export const TopBar: FC = () => {
  const dispatch = useDispatch();

  const handleNewGame = () => {
    dispatch(resetBoard);
  };

  return (
    <div className={css.container}>
      <button className={css.newGameBtn} onClick={handleNewGame}>New Game</button>
    </div>
  );
};
