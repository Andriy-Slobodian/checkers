import { FC, useEffect, useRef, useState } from "react";
import Draggable from 'react-draggable';
import { useDispatch, useSelector } from "react-redux";
import {
  selectCaptureList,
  selectCellById,
  selectCellListByIdList,
  selectHighlightedCellList,
  selectIsCheckerMovable,
  selectIsQueen,
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
  increaseTurnCounter,
  resetCapturing
} from "@slices/board-slice";
import { actualizeHighlightedCellList, isOverlapping, isQueen } from "@utils/board-util";
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
  const isCheckerQueen = useSelector(selectIsQueen(id));
  const [actualizedCaptureList, setActualizedCaptureList] = useState(highlightedForCapturingCellList);

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

  const handleStartDragging = () => {
    setActualizedCaptureList(actualizeHighlightedCellList(currentCell.id, highlightedForCapturingCellList));

    if (!isCapturing) {
      dispatch(updatePossibleGoCellListByCellIdList(possibleGoCellIdList));
    }

    dispatch(updateCheckerShadowByCellId(id));
  }

  const handleStopDragging = (e) => {
    const pointerCoordinates: TCoordinates = {x: e.clientX, y: e.clientY};
    const nextMoveCellList = isCapturing ? actualizedCaptureList : possibleGoCellList;
    const newCheckerCell = nextMoveCellList.find(cell => isOverlapping(pointerCoordinates, cell.cellCoordinates));

    // New move success
    if (newCheckerCell) {
      dispatch(updateCell({
        ...newCheckerCell,
        checkerCoordinates: {
          x: newCheckerCell.cellCoordinates.x + 11,
          y: newCheckerCell.cellCoordinates.y + 11
        },
        hasCellChecker: true,
        isCheckerBlack: currentCell.isCheckerBlack,
        isHighlightedForCapturing: false,
        hasCheckerShadow: true,
        isQueen: currentCell.isQueen || isQueen(newCheckerCell.id, currentCell.isCheckerBlack)
      }));
      dispatch(emptyCellById(currentCell.id));
      if (isCapturing) {
        dispatch(emptyCellById(captureList[1]));
      }
      dispatch(resetPossibleGoCell());
      dispatch(resetCapturing());

      dispatch(increaseTurnCounter());
    }

    setActualizedCaptureList(highlightedForCapturingCellList);
  }

  const $Checker = (
    <div ref={checkerRef} className={checkerShadowClass}>
      {isCheckerQueen && (
        <div className={css.queen} />
      )}
    </div>
  );

  return (
    <>
      {!isCheckerMovable && $Checker}
      {isCheckerMovable && (
        <Draggable
          onStart={
            isWhiteTurn !== currentCell.isCheckerBlack
              ? handleStartDragging
              : () => false
          }
          onStop={handleStopDragging}
          position={{ x: 0, y: 0 }}
        >
          {$Checker}
        </Draggable>
      )}
    </>
  );
};
