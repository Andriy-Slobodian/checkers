import React, { FC, useEffect, useRef } from "react";
import { Checker } from "./Checker/Checker";
import { updateCoordinatesById } from "@slices/board-slice";
import { useDispatch } from "react-redux";
import css from "./Cell.css";

interface Props {
  id: string;
  isPlayingCell: boolean;
  hasCellChecker: boolean;
  isPossibleGoCell: boolean;
  isHighlightedForCapturing: boolean;
}
export const Cell: FC<Props> = ({
  id,
  isPlayingCell,
  hasCellChecker,
  isPossibleGoCell,
  isHighlightedForCapturing
}) => {
  // Hooks
  const dispatch = useDispatch();
  const cellRef = useRef(null);

  // Variables
  const cellClasses = [
    css.container,
    isPlayingCell ? css.painted : '',
    isHighlightedForCapturing
      ? css.capturing
      : isPossibleGoCell
        ? css.possibleGo
        : ''
  ].join(' ');

  // Define & store Cell/Checker coordinates on cell mount
  useEffect(() => {
    dispatch(updateCoordinatesById({
      id,
      coordinates: {
        x: cellRef.current.offsetLeft,
        y: cellRef.current.offsetTop
      }
    }));
  }, []);

  return (
    <div className={cellClasses} ref={cellRef}>
      {hasCellChecker && (
        <Checker id={id} />
      )}
    </div>
  );
};
