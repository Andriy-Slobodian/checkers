import {FC} from "react";
import css from "./Board.css";
import {Cell} from "./Cell/Cell";
import {useSelector} from "react-redux";
import {selectBoard} from "@selectors/board-selectors";
import {selectIsWhiteTurn} from "@selectors/activity-selectors";

export const Board: FC = () => {
  const board = useSelector(selectBoard);
  const isWhiteTurn = useSelector(selectIsWhiteTurn);

  const whiteClasses = [css.turn, isWhiteTurn ? css.turnOn : css.turnOff].join(' ');
  const blackClasses = [css.turn, isWhiteTurn ? css.turnOff : css.turnOn].join(' ');

  // console.log(board);
  console.log('isWhiteTurn = ', isWhiteTurn);

  return (
    <div className={css.container}>
      {board.length > 0 && (
        <>
          <div className={css.player}>
            Mr.Black
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
            Mr.White
            <span className={whiteClasses} />
          </div>
        </>
      )}
    </div>
  );
};

