import { FC, memo } from "react";
import Draggable from 'react-draggable';
import { useDispatch, useSelector } from "react-redux";
import {
  selectCellById,
  selectCellListByIdList,
  selectIsCheckerMovable,
  selectIsQueen,
  selectIsWhiteTurn,
  selectPossibleGoIdListForId
} from "@selectors/board-selectors";
import {
  TCoordinates,
  updateCheckerShadow,
  updatePossibleGoList
} from "@slices/board-slice";
import { getCapturedId, isCorrectCaptureMove, isOverlapping } from "@utils/board-util";
import { useMove } from "@hooks/useMove";
import css from "./Checker.css";

interface Props {
  id: string;
}
export const Checker: FC<Props> = memo(({
  id
}) => {
  // Hooks
  const dispatch = useDispatch();
  const currentCell = useSelector(selectCellById(id));
  const possibleGoCellIdList = useSelector(selectPossibleGoIdListForId(id));
  const possibleGoCellList = useSelector(selectCellListByIdList(possibleGoCellIdList));
  const isWhiteTurn = useSelector(selectIsWhiteTurn);
  const isCheckerQueen = useSelector(selectIsQueen(id));
  const { move, captureList, isCapturing} = useMove();
  const isCheckerMovable = useSelector(selectIsCheckerMovable(id, captureList));

  // Variables
  const checkerClass = [
    css.default,
    currentCell.isCheckerBlack ? css.black : '',
    !currentCell.hasCheckerShadow ? css.noShadow : ''
  ].join(' ');

  const handleStartDragging = () => {
    if (!isCapturing) {
      dispatch(updatePossibleGoList(possibleGoCellIdList));
    }

    dispatch(updateCheckerShadow(id));
  }

  const handleStopDragging = (e) => {
    const pointerCoordinates: TCoordinates = {x: e.clientX, y: e.clientY};
    const nextMoveCellList = isCapturing ? captureList : possibleGoCellList;
    const newCell = nextMoveCellList.find(cell => cell && isOverlapping(pointerCoordinates, cell.cellCoordinates));

    // New move
    if (newCell && !isCapturing || newCell && isCorrectCaptureMove(id, newCell.id)) {
      move({
        fromId: currentCell.id,
        toId: newCell.id,
        captureId: isCapturing ? getCapturedId(id, newCell.id) : null
      });
    }
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
});
