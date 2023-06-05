import { FC, useState } from "react";
import Draggable from 'react-draggable';
import { useDispatch, useSelector } from "react-redux";
import {
  selectCaptureList,
  selectCellById,
  selectCellListByIdList,
  selectIsCheckerMovable,
  selectIsQueen,
  selectIsWhiteTurn,
  selectPossibleGoCellIdListById
} from "@selectors/board-selectors";
import {
  TCoordinates,
  updateCheckerShadowByCellId,
  updatePossibleGoCellListByCellIdList,
  increaseTurnCounter,
  moveChecker
} from "@slices/board-slice";
import { getActiveCaptureList, isOverlapping } from "@utils/board-util";
import css from "./Checker.css";

interface Props {
  id: string;
}
export const Checker: FC<Props> = ({
  id
}) => {
  const dispatch = useDispatch();
  const currentCell = useSelector(selectCellById(id));
  const possibleGoCellIdList = useSelector(selectPossibleGoCellIdListById(id));
  const possibleGoCellList = useSelector(selectCellListByIdList(possibleGoCellIdList));
  const isCheckerMovable = useSelector(selectIsCheckerMovable(id));
  const isWhiteTurn = useSelector(selectIsWhiteTurn);
  const captureList = useSelector(selectCaptureList);
  const isCheckerQueen = useSelector(selectIsQueen(id));
  const [activeCaptureList, setActiveCaptureList] = useState(captureList);

  const isCapturing = captureList.length > 0;
  const checkerClass = [
    css.default,
    currentCell.isCheckerBlack ? css.black : '',
    !currentCell.hasCheckerShadow ? css.noShadow : ''
  ].join(' ');

  const handleStartDragging = () => {
    setActiveCaptureList(getActiveCaptureList(currentCell.id, captureList));

    if (!isCapturing) {
      dispatch(updatePossibleGoCellListByCellIdList(possibleGoCellIdList));
    }

    dispatch(updateCheckerShadowByCellId(id));
  }

  const handleStopDragging = (e) => {
    const pointerCoordinates: TCoordinates = {x: e.clientX, y: e.clientY};
    const nextMoveCellList = isCapturing ? [activeCaptureList[2]] : possibleGoCellList;
    const newCheckerCell = nextMoveCellList.find(cell => isOverlapping(pointerCoordinates, cell.cellCoordinates));

    // New move
    if (newCheckerCell) {
      dispatch(moveChecker({
        fromId: currentCell.id,
        toId: newCheckerCell.id,
        captureId: captureList[1]?.id || null
      }));
      dispatch(increaseTurnCounter());
    }

    setActiveCaptureList(captureList);
  }

  const $Checker = (
    <div className={checkerClass}>
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
