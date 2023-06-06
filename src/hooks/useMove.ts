import { changeTurn, moveChecker } from "@slices/board-slice";
import { useDispatch, useSelector } from "react-redux";
import { checkCapturing } from "@utils/board-util";
import { selectBoard, selectIsWhiteTurn } from "@selectors/board-selectors";

export const useMove = () => {
  // Hooks
  const dispatch = useDispatch();
  const board = useSelector(selectBoard);
  const isWhiteTurn = useSelector(selectIsWhiteTurn);

  // Variables
  const captureList = checkCapturing(board, isWhiteTurn);
  const isCapturing = captureList.length > 0;

  const move = ({ fromId, toId, captureId }) => {
    dispatch(moveChecker({
      fromId,
      toId,
      captureId
    }));
    if (!isCapturing) {
      dispatch(changeTurn());
    }
  }

  return { move, captureList, isCapturing }
};
