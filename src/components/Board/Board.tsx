import {FC} from "react";
import { Cell } from "./Cell/Cell";
import { useSelector } from "react-redux";
import { selectBoard, selectIsWhiteTurn } from "@selectors/board-selectors";
import { PLAYER_1_NAME, PLAYER_2_NAME } from "@constants";
import css from "./Board.css";

export const Board: FC = () => {
  const board = useSelector(selectBoard);
  const isWhiteTurn = useSelector(selectIsWhiteTurn);

  const whiteClasses = [css.turn, isWhiteTurn ? css.turnOn : css.turnOff].join(' ');
  const blackClasses = [css.turn, !isWhiteTurn ? css.turnOn : css.turnOff].join(' ');

  // console.log(board);

  return (
    <div className={css.container}>
      {board.length > 0 && (
        <>
          <div className={css.player}>
            {PLAYER_2_NAME}
            <span className={blackClasses} />
          </div>

          <div className={css.board}>
            {board.map((cell) => {
              return (
                <Cell key={cell.id} {...cell} />
              );
            })}
          </div>

          <div className={css.player}>
            {PLAYER_1_NAME}
            <span className={whiteClasses} />
          </div>
        </>
      )}
    </div>
  );
};

