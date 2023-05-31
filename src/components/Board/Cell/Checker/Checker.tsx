import {FC, useEffect, useRef, useState} from "react";
import css from "./Checker.css";
import Draggable from 'react-draggable';
import {useDispatch, useSelector} from "react-redux";
import {
  selectCellById,
  selectCellListByIdList,
  selectIsCheckerMovable,
  selectPossibleGoCellIdListById
} from "@selectors/board-selectors";
import {
  updateCell,
  emptyCellById,
  TCoordinates,
  updateCheckerCoordinatesById,
  updateCheckerShadowByCellId,
  updatePossibleGoCellListByCellIdList, resetPossibleGoCell
} from "@slices/board-slice";
import {DEFAULT_CELL_HEIGHT, DEFAULT_CELL_WIDTH} from "@constants";

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

  const handleStartDragging = (e) => {
    dispatch(updatePossibleGoCellListByCellIdList(possibleGoCellIdList));
    dispatch(updateCheckerShadowByCellId(id));
  }

  const handleStopDragging = (e) => {
    if (!e) {
      return;
    }

    const pointerCoordinates: TCoordinates = {x: e.clientX, y: e.clientY};
    const newCheckerCell = possibleGoCellList.find(cell => isOverlapping(pointerCoordinates, cell.cellCoordinates));

    console.log('CURRENT:', currentCell);
    console.log('NEW:', newCheckerCell);

    if (newCheckerCell) {
     dispatch(updateCell({
        ...newCheckerCell,
        checkerCoordinates: {
          x: newCheckerCell.cellCoordinates.x + 11,
          y: newCheckerCell.cellCoordinates.y + 11
        },
        hasCellChecker: true,
        isPossibleGoCell: false,
        isCheckerBlack: currentCell.isCheckerBlack,
        hasCheckerShadow: true,
      }));
      dispatch(emptyCellById(currentCell.id));
      dispatch(resetPossibleGoCell());
    }
  }

  return (
    <>
      {!isCheckerMovable && <div ref={checkerRef} className={checkerShadowClass} />}
      {isCheckerMovable && (
        <Draggable
          bounds={currentCell.isCheckerBlack ? {top: 0} : {bottom: 0}}
          onStart={handleStartDragging}
          onStop={handleStopDragging}
          position={{ x: 0, y: 0 }}
        >
          <div ref={checkerRef} className={checkerShadowClass} />
        </Draggable>
      )}
    </>
  );
};
