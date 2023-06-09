import React, { FC, memo } from "react";
import { Checker } from "./Checker/Checker";
import css from "./Cell.css";

interface Props {
  id: string;
  isPlayingCell: boolean;
  hasCellChecker: boolean;
  isPossibleGoCell: boolean;
  isHighlightedForCapturing: boolean;
}
export const Cell: FC<Props> = memo(({
  id,
  isPlayingCell,
  hasCellChecker,
  isPossibleGoCell,
  isHighlightedForCapturing
}) => {
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

  return (
    <div className={cellClasses}>
      {hasCellChecker && (
        <Checker id={id} />
      )}
    </div>
  );
});
