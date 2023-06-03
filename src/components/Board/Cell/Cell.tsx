import React, { FC, useEffect, useRef } from "react";
import { Checker } from "./Checker/Checker";
import { updateCellCoordinatesById } from "@slices/board-slice";
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
  const dispatch = useDispatch();
  const cellRef = useRef(null);

  const cellClasses = [
    css.container,
    isPlayingCell ? css.painted : '',
    isHighlightedForCapturing
      ? css.capturing
      : isPossibleGoCell
        ? css.possibleGo
        : ''
  ].join(' ');

  // OnMount Cell define & store its coordinates
  useEffect(() => {
    dispatch(updateCellCoordinatesById({
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
