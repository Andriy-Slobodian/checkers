import {FC} from "react";
import css from "./Board.css";
import {Cell} from "./Cell/Cell";
import {useSelector} from "react-redux";
import {selectBoard} from "@selectors/board-selectors";

export const Board: FC = () => {
  const board = useSelector(selectBoard);

  console.log(board);

  return (
    <>
      {board.length > 0 && (
        <div className={css.container}>
          {board.map((cell) => {
            return (
              <Cell key={cell.id} {...cell} />
            );
          })}
        </div>
      )}
    </>
  );
};

