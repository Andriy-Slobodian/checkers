import {createSelector, current} from "@reduxjs/toolkit";
import { store } from "../store";
import {getCellById, getNeighboursIdList, getPossibleCaptureIdList, getPossibleGoIdList} from "@utils/board-util";

export const selectBoard = () => store.getState().board.boardState;

export const selectTurnCounter = () => store.getState().board.turnCounter;

export const selectCaptureList = () => store.getState().board.captureList;

export const selectIsWhiteTurn = createSelector(
  [selectTurnCounter],
  (turnCounter) => !Boolean(turnCounter % 2)
);

export const selectIsBlackFirstMoveTurn = createSelector(
  [selectTurnCounter],
  (turnCounter) => turnCounter === 1
);

export const selectPlayingCellList = createSelector(
  [selectBoard],
  (board) => board.filter(cell => cell.isPlayingCell)
);

export const selectCellById = (id: string) => createSelector(
  [selectPlayingCellList],
  (cellList) => {
    return cellList.filter(cell => cell.id === id)[0];
  }
);

export const selectPossibleGoCellIdListById = (id: string) => createSelector(
  [selectCellById(id)],
  (currentCell) => getPossibleGoIdList(id, currentCell.isCheckerBlack)
);

export const selectCellListByIdList = (idList: string[]) => createSelector(
  [selectPlayingCellList],
  (cellList) =>
    cellList.filter(cell => idList.includes(cell.id) && !cell.hasCellChecker)
);

export const selectHighlightedCellList = createSelector(
  [selectPlayingCellList],
  (selectPlayingCellList) =>
    selectPlayingCellList
      .filter(cell => cell.isHighlightedForCapturing)
);

export const selectIsCapturing = createSelector(
  [selectHighlightedCellList],
  (highlightedCellList) => highlightedCellList.length > 0
);

export const selectIsCheckerMovable = (id: string) => createSelector(
  [selectPlayingCellList, selectPossibleGoCellIdListById(id), selectCaptureList],
  (cellList, possibleGoCellIdList, captureList) =>
    captureList.length === 0
      ? cellList
          .filter(cell => possibleGoCellIdList.includes(cell.id))
          .filter(cell => !cell.hasCellChecker).length > 0
      : captureList.includes(id)
);

export const selectCheckCapturing = createSelector(
  [selectBoard, selectIsWhiteTurn],
  (board, isWhiteTurn) => {
    const capturingList = [];
    const cellList = board.filter(cell => cell.hasCellChecker);

    cellList.forEach(currentCell => {
      const neighbourList = getNeighboursIdList(currentCell.id);
      const possibleCaptureIdList = getPossibleCaptureIdList(currentCell.id);

      const neighbourLeftTop = neighbourList[0]
        ? getCellById(neighbourList[0], cellList)
        : null;
      const neighbourRightTop = neighbourList[1]
        ? getCellById(neighbourList[1], cellList)
        : null;
      const neighbourLeftBottom = neighbourList[2]
        ? getCellById(neighbourList[2], cellList)
        : null;
      const neighbourRightBottom = neighbourList[3]
        ? getCellById(neighbourList[3], cellList)
        : null;

      const captureLeftTop = possibleCaptureIdList[0]
        ? getCellById(possibleCaptureIdList[0], board)
        : null;
      const captureRightTop = possibleCaptureIdList[1]
        ? getCellById(possibleCaptureIdList[1], board)
        : null;
      const captureLeftBottom = possibleCaptureIdList[2]
        ? getCellById(possibleCaptureIdList[2], board)
        : null;
      const captureRightBottom = possibleCaptureIdList[3]
        ? getCellById(possibleCaptureIdList[3], board)
        : null;

      if (!isWhiteTurn && currentCell.isCheckerBlack && neighbourLeftTop && !neighbourLeftTop.isCheckerBlack && captureLeftTop && !captureLeftTop.hasCellChecker) {
        console.log('CASE 1: ', currentCell.id, neighbourLeftTop.id, captureLeftTop.id);
        capturingList.push(currentCell.id, neighbourLeftTop.id, captureLeftTop.id);
      }
      if (isWhiteTurn && !currentCell.isCheckerBlack && neighbourLeftTop && neighbourLeftTop.isCheckerBlack && captureLeftTop && !captureLeftTop.hasCellChecker) {
        console.log('CASE 2: ', currentCell.id, neighbourLeftTop.id, captureLeftTop.id);
        capturingList.push(currentCell.id, neighbourLeftTop.id, captureLeftTop.id);
      }
      if (!isWhiteTurn && currentCell.isCheckerBlack && neighbourRightTop && !neighbourRightTop.isCheckerBlack && captureRightTop && !captureRightTop.hasCellChecker) {
        console.log('CASE 3: ', currentCell.id, neighbourRightTop.id, captureRightTop.id);
        capturingList.push(currentCell.id, neighbourRightTop.id, captureRightTop.id);
      }
      if (isWhiteTurn && !currentCell.isCheckerBlack && neighbourRightTop && neighbourRightTop.isCheckerBlack && captureRightTop && !captureRightTop.hasCellChecker) {
        console.log('CASE 2: ', currentCell.id, neighbourRightTop.id, captureRightTop.id);
        capturingList.push(currentCell.id, neighbourRightTop.id, captureRightTop.id);
      }
      if (!isWhiteTurn && currentCell.isCheckerBlack && neighbourLeftBottom && !neighbourLeftBottom.isCheckerBlack && captureLeftBottom && !captureLeftBottom.hasCellChecker) {
        console.log('CASE 5: ', currentCell.id, neighbourLeftBottom.id, captureLeftBottom.id);
        capturingList.push(currentCell.id, neighbourLeftBottom.id, captureLeftBottom.id);
      }
      if (isWhiteTurn && !currentCell.isCheckerBlack && neighbourLeftBottom && neighbourLeftBottom.isCheckerBlack && captureLeftBottom && !captureLeftBottom.hasCellChecker) {
        console.log('CASE 6: ', currentCell.id, neighbourLeftBottom.id, captureLeftBottom.id);
        capturingList.push(currentCell.id, neighbourLeftBottom.id, captureLeftBottom.id);
      }
      if (!isWhiteTurn && currentCell.isCheckerBlack && neighbourRightBottom && !neighbourRightBottom.isCheckerBlack && captureRightBottom && !captureRightBottom.hasCellChecker) {
        console.log('CASE 7: ', currentCell.id, neighbourRightBottom.id, captureRightBottom.id);
        capturingList.push(currentCell.id, neighbourRightBottom.id, captureRightBottom.id);
      }
      if (isWhiteTurn && !currentCell.isCheckerBlack && neighbourRightBottom && neighbourRightBottom.isCheckerBlack && captureRightBottom && !captureRightBottom.hasCellChecker) {
        console.log('CASE 8: ', currentCell.id, neighbourRightBottom.id, captureRightBottom.id);
        capturingList.push(currentCell.id, neighbourRightBottom.id, captureRightBottom.id);
      }
    });

    return capturingList;
  }
);
