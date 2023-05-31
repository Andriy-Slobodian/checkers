import React, {FC, useEffect, useRef} from "react";
import css from "./Cell.css";
import { Checker } from "./Checker/Checker";
import {updateCellCoordinatesById, updateCheckerCoordinatesById} from "@slices/board-slice";
import {useDispatch} from "react-redux";

interface Props {
  id: string;
  isPlayingCell: boolean;
  hasCellChecker: boolean;
  isPossibleGoCell: boolean;
}
export const Cell: FC<Props> = ({
  id,
  isPlayingCell,
  hasCellChecker,
  isPossibleGoCell
}) => {
  const dispatch = useDispatch();
  const cellRef = useRef(null);

  const cellBackground = css.container + (isPlayingCell ? ' ' + css.painted : '');
  const cellClasses = isPossibleGoCell ? cellBackground + ' ' + css.possibleGo : cellBackground;

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