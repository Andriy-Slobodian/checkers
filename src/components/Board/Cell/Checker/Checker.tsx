import { FC, useEffect, useRef } from "react";
import Draggable from 'react-draggable';
import { useDispatch, useSelector } from "react-redux";
import {
  selectCaptureList,
  selectCellById,
  selectCellListByIdList,
  selectHighlightedCellList,
  selectIsCheckerMovable,
  selectIsWhiteTurn,
  selectPossibleGoCellIdListById
} from "@selectors/board-selectors";
import {
  updateCell,
  emptyCellById,
  TCoordinates,
  updateCheckerCoordinatesById,
  updateCheckerShadowByCellId,
  updatePossibleGoCellListByCellIdList,
  resetPossibleGoCell,
  increaseTurnCounter, resetCapturing
} from "@slices/board-slice";
import {
  DEFAULT_CELL_HEIGHT,
  DEFAULT_CELL_WIDTH
} from "@constants";
import css from "./Checker.css";

interface Props {
  id: string;
}
export const Checker: FC<Props> = ({
  id
}) => {
  const dispatch = useDispatch();
  const checkerRef = useRef(null);
  const currentCell = useSelector(selectCellById(id));
  const possibleGoCellIdList = useSelector(selectPossibleGoCellIdListById(id));
  const possibleGoCellList = useSelector(selectCellListByIdList(possibleGoCellIdList));
  const isCheckerMovable = useSelector(selectIsCheckerMovable(id));
  const isWhiteTurn = useSelector(selectIsWhiteTurn);
  const highlightedForCapturingCellList = useSelector(selectHighlightedCellList);
  const captureList = useSelector(selectCaptureList);

  const isCapturing = captureList.length > 0;
  const checkerColourClass = currentCell.isCheckerBlack ? css.default + ' ' + css.black : css.default;
  const checkerShadowClass = currentCell.hasCheckerShadow ? checkerColourClass : checkerColourClass + ' ' + css.noShadow;

  // OnMount Checker define & store its coordinates
  useEffect(() => {
    dispatch(updateCheckerCoordinatesById({
      id,
      coordinates: {
        x: checkerRef.current.offsetLeft,
        y: checkerRef.current.offsetTop
      }
    }));
  }, []);

  const isOverlapping = (pointerCoordinates, cellCoordinates) => {
    if (!pointerCoordinates || !cellCoordinates) {
      return false;
    }

    const horizontalDifference = pointerCoordinates.x - cellCoordinates.x;
    const verticalDifference = pointerCoordinates.y - cellCoordinates.y;
    const isHorizontalOverlapping = horizontalDifference <= DEFAULT_CELL_WIDTH && horizontalDifference >= 0;
    const isVerticalOverlapping = verticalDifference <= DEFAULT_CELL_HEIGHT && verticalDifference >= 0;

    return isHorizontalOverlapping && isVerticalOverlapping;
  };

  const handleStartDragging = () => {
    if (!isCapturing) {
      dispatch(updatePossibleGoCellListByCellIdList(possibleGoCellIdList));
    }

    dispatch(updateCheckerShadowByCellId(id));
  }

  const handleStopDragging = (e) => {
    const pointerCoordinates: TCoordinates = {x: e.clientX, y: e.clientY};
    const nextMoveCellList = isCapturing ? highlightedForCapturingCellList : possibleGoCellList;
    const newCheckerCell = nextMoveCellList.find(cell => isOverlapping(pointerCoordinates, cell.cellCoordinates));

    // New move success
    if (newCheckerCell) {
      dispatch(increaseTurnCounter());
      dispatch(updateCell({
        ...newCheckerCell,
        checkerCoordinates: {
          x: newCheckerCell.cellCoordinates.x + 11,
          y: newCheckerCell.cellCoordinates.y + 11
        },
        hasCellChecker: true,
        isCheckerBlack: currentCell.isCheckerBlack,
        isHighlightedForCapturing: false,
        hasCheckerShadow: true
      }));
      dispatch(emptyCellById(currentCell.id));
      if (isCapturing) {
        dispatch(emptyCellById(captureList[1]));
      }
      dispatch(resetPossibleGoCell());
      dispatch(resetCapturing());
    }
  }

  return (
    <>
      {!isCheckerMovable && <div ref={checkerRef} className={checkerShadowClass} />}
      {isCheckerMovable && (
        <Draggable
          // bounds={currentCell.isCheckerBlack ? {top: 0} : {bottom: 0}}
          onStart={
            isWhiteTurn !== currentCell.isCheckerBlack
              ? handleStartDragging
              : () => false
          }
          onStop={handleStopDragging}
          position={{ x: 0, y: 0 }}
        >
          <div ref={checkerRef} className={checkerShadowClass} />
        </Draggable>
      )}
    </>
  );
};
