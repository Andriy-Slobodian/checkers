import React, { FC, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMove } from "@hooks/useMove";
import {
  selectBoard,
  selectIsBlackFirstMoveTurn,
  selectStopDnDId,
  selectIsWhiteTurn,
  selectMoveExtender
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
import { changeTurn, createBoard, highlightCapturing } from "@slices/board-slice";
import { selectActivityList } from "@selectors/activity-selectors";
import { Cell } from "./Cell/Cell";
import { Player } from "@components/Board/Player/Player";
import css from "./Board.css";

export const Board: FC = () => {
  // Hooks
  const dispatch = useDispatch();
  const board = useSelector(selectBoard);
  const isBlackFirstMoveTurn = useSelector(selectIsBlackFirstMoveTurn);
  const activityList = useSelector(selectActivityList);
  const isWhiteTurn = useSelector(selectIsWhiteTurn);
  const stopDnDId = useSelector(selectStopDnDId);
  const moveExtender = useSelector(selectMoveExtender);
  const { move, captureList, isCapturing, moveList } = useMove();
  const boardRef = useRef(null);

  // Variables
  const currentCell = isCapturing ? captureList[0] : moveList[0];
  const newCell = isCapturing ? captureList[2] : moveList[1];

  const blackAutoMove = () => {
    setTimeout(() => {
      move({
        fromId: currentCell?.id,
        toId: newCell?.id,
        captureId: captureList[1]?.id || null
      });
    }, DEFAULT_TIME_INTERVAL);
  };

  // Create Board with Start coordinates for DnD
  useEffect(() => {
    if (board.length === 0) {
      dispatch(createBoard({
        x: boardRef.current.offsetLeft,
        y: boardRef.current.offsetTop
      }));
    }
  }, [board.length]);

  // Initialize first Black Activity
  useEffect(() => {
    if (isBlackFirstMoveTurn) {
      dispatch(addActivity(DEFAULT_ACTIVITY_TEXT_PLAYER_2));
    }
  }, [isBlackFirstMoveTurn]);

  // Add Capturing Activity
  useEffect(() => {
    if (isCapturing) {
      if (activityList.length < ACTIVITY_MESSAGES_LIMIT) {
        dispatch(addActivity(DEFAULT_ACTIVITY_CAPTURING_TEXT));
      }
    }
  }, [isCapturing]);

  // Init Capturing/Highlighting
  useEffect(() => {
    captureList.forEach((cell, index) => {
      if ((index + 1) % 3 === 0) {
        dispatch(highlightCapturing(cell.id));
      }
    });
  }, [board, captureList]);

  // Init First Black Move
  useEffect(() => {
    if (!isWhiteTurn) {
      blackAutoMove();
    }
  }, [isWhiteTurn]);

  // Extend Black Move
  useEffect(() => {
    if (!isWhiteTurn && isCapturing && moveExtender) {
      blackAutoMove();
    }
  }, [isCapturing, moveExtender]);

  // Finish Move for both Players
  useEffect(() => {
    const isCapturingForActiveChecker = captureList.map(cell => cell.id).includes(stopDnDId);

    if (stopDnDId && !isCapturingForActiveChecker) {
      dispatch(changeTurn());
    }
  }, [stopDnDId, isCapturing]);

  // console.log(board);
  // console.log(captureList.map(cell => cell.id));

  return (
    <div className={css.container}>
      <Player name={PLAYER_2_NAME} isAutoPlayer={true} />

      <div ref={boardRef} className={css.board}>
        {board.map((cell) => {
          return (
            <Cell key={cell.id} {...cell} />
          );
        })}
      </div>

      <Player name={PLAYER_1_NAME} />
    </div>
  );
};

