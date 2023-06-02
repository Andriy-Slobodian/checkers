import { FC, useEffect } from "react";
import { Cell } from "./Cell/Cell";
import { useDispatch, useSelector } from "react-redux";
import {
  selectBoard,
  selectCalculatedCaptureList,
  selectIsBlackFirstMoveTurn,
  selectIsCapturing,
  selectIsWhiteTurn,
} from "@selectors/board-selectors";
import {
  ACTIVITY_MESSAGES_LIMIT,
  DEFAULT_ACTIVITY_CAPTURING_TEXT,
  DEFAULT_ACTIVITY_TEXT_PLAYER_2,
  PLAYER_1_NAME,
  PLAYER_2_NAME
} from "@constants";
import { addActivity } from "@slices/activity-slice";
import { highlightCaptureCellById, initCapturing } from "@slices/board-slice";
import { selectActivityList } from "@selectors/activity-selectors";
import css from "./Board.css";

export const Board: FC = () => {
  const dispatch = useDispatch();
  const board = useSelector(selectBoard);
  const isWhiteTurn = useSelector(selectIsWhiteTurn);
  const isBlackFirstMoveTurn = useSelector(selectIsBlackFirstMoveTurn);
  const activityList = useSelector(selectActivityList);

  const captureList = useSelector(selectCalculatedCaptureList);
  const isCapturing = useSelector(selectIsCapturing);

  const whiteClasses = [css.turn, isWhiteTurn ? css.turnOn : css.turnOff].join(' ');
  const blackClasses = [css.turn, !isWhiteTurn ? css.turnOn : css.turnOff].join(' ');

  useEffect(() => {
    if (isBlackFirstMoveTurn) {
      dispatch(addActivity(DEFAULT_ACTIVITY_TEXT_PLAYER_2));
    }
  }, [isBlackFirstMoveTurn]);

  useEffect(() => {
    if (isCapturing) {
      if (activityList.length < ACTIVITY_MESSAGES_LIMIT) {
        dispatch(addActivity(DEFAULT_ACTIVITY_CAPTURING_TEXT));
      }
    }
  }, [isCapturing]);

  useEffect(() => {
    dispatch(initCapturing(captureList));

    captureList.forEach((id, index) => {
      if ((index + 1) % 3 === 0) {
        dispatch(highlightCaptureCellById(id));
      }
    });
  }, [board, captureList]);

  // console.log(board);
  // console.log(captureList);

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

