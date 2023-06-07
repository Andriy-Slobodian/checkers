import { changeTurn, gameOver, moveChecker } from "@slices/board-slice";
import { useDispatch, useSelector } from "react-redux";
import { getCapturing, getMoveList } from "@utils/board-util";
import {
  selectBlackAmount,
  selectBoard,
  selectIsWhiteTurn,
  selectPlayingCellList,
  selectWhiteAmount
} from "@selectors/board-selectors";
import {useEffect} from "react";

export const useMove = () => {
  // Hooks
  const dispatch = useDispatch();
  const board = useSelector(selectBoard);
  const isWhiteTurn = useSelector(selectIsWhiteTurn);
  const playingCellList = useSelector(selectPlayingCellList);
  const blackCheckersAmount = useSelector(selectBlackAmount);
  const whiteCheckersAmount = useSelector(selectWhiteAmount);

  // Variables
  const captureList = getCapturing(board, isWhiteTurn);
  const isCapturing = captureList.length > 0;
  const moveList = getMoveList(playingCellList);
  const isMove = moveList.length > 0;

  const endGame = () => {
    dispatch(gameOver());
  };

  // Game over if no checkers of any colour
  useEffect(() => {
    if (blackCheckersAmount === 0 || whiteCheckersAmount === 0) {
      endGame();
    }
  }, [blackCheckersAmount, whiteCheckersAmount]);

  // Game over if no moves
  useEffect(() => {
    if (!isMove && !isCapturing) {
      endGame();
    }
  }, [isMove, isCapturing]);

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

  return { move, captureList, isCapturing, moveList, endGame }
};
