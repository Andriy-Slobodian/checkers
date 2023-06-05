import React, { FC, useEffect } from "react";
import { Cell } from "./Cell/Cell";
import { useDispatch, useSelector } from "react-redux";
import {
  selectBoard,
  selectIsBlackFirstMoveTurn,
  selectIsWhiteTurn,
  selectPlayingCellList,
} from "@selectors/board-selectors";
import {
  ACTIVITY_MESSAGES_LIMIT,
  DEFAULT_ACTIVITY_CAPTURING_TEXT,
  DEFAULT_ACTIVITY_TEXT_PLAYER_2,
  DEFAULT_TIME_INTERVAL,
  PLAYER_1_NAME,
  PLAYER_2_NAME
} from "@constants";
import { addActivity } from "@slices/activity-slice";
import {
  emptyCellById,
  highlightCaptureCellById, increaseTurnCounter,
  initCapturing, resetCapturing,
  resetPossibleGoCell,
  updateCell
} from "@slices/board-slice";
import { selectActivityList } from "@selectors/activity-selectors";
import { Player } from "@components/Board/Player/Player";
import { checkCapturing, getMoveList, isQueen } from "@utils/board-util";
import css from "./Board.css";

export const Board: FC = () => {
  const dispatch = useDispatch();
  const board = useSelector(selectBoard);
  const playingCellList = useSelector(selectPlayingCellList);
  const isBlackFirstMoveTurn = useSelector(selectIsBlackFirstMoveTurn);
  const activityList = useSelector(selectActivityList);
  const isWhiteTurn = useSelector(selectIsWhiteTurn);

  const captureList = checkCapturing(board, isWhiteTurn);
  const isCapturing = captureList.length > 0;
  const moveList = getMoveList(playingCellList);
  const currentCell = isCapturing ? captureList[0] : moveList[0];
  const newCell = isCapturing ? captureList[2] : moveList[1];

  const blackAutoMove = () => {
    setTimeout(() => {
      dispatch(updateCell({
        ...newCell,
        checkerCoordinates: {
          x: newCell.cellCoordinates.x + 11,
          y: newCell.cellCoordinates.y + 11
        },
        hasCellChecker: true,
        isCheckerBlack: currentCell.isCheckerBlack,
        isHighlightedForCapturing: false,
        hasCheckerShadow: true,
        isQueen: currentCell.isQueen || isQueen(newCell.id, currentCell.isCheckerBlack)
      }));
      dispatch(emptyCellById(currentCell.id));
      if (isCapturing) {
        dispatch(emptyCellById(captureList[1].id));
      }
      dispatch(resetPossibleGoCell());
      dispatch(resetCapturing());
      dispatch(increaseTurnCounter());
    }, DEFAULT_TIME_INTERVAL);
  };

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

    captureList.forEach((cell, index) => {
      if ((index + 1) % 3 === 0) {
        dispatch(highlightCaptureCellById(cell.id));
      }
    });
  }, [board, captureList]);

  useEffect(() => {
    if (!isWhiteTurn) {
      blackAutoMove();
    }
  }, [isWhiteTurn]);

  // console.log(board);
  // console.log(captureList);

  return (
    <div className={css.container}>
      {board.length > 0 && (
        <>
          <Player name={PLAYER_2_NAME} isAutoPlayer={true} />

          <div className={css.board}>
            {board.map((cell) => {
              return (
                <Cell key={cell.id} {...cell} />
              );
            })}
          </div>

          <Player name={PLAYER_1_NAME} />
        </>
      )}
    </div>
  );
};

