import { createSelector } from "@reduxjs/toolkit";
import { store } from "../store";
import { getPossibleGoIdList } from "@utils/board-util";

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

export const selectIsCapturingInitialized = createSelector(
  [selectPlayingCellList],
  (selectPlayingCellList) =>
    selectPlayingCellList.filter(cell => cell.isHighlightedForCapturing).length > 0
);

export const selectHighlightedCellList = createSelector(
  [selectPlayingCellList],
  (selectPlayingCellList) =>
    selectPlayingCellList
      .filter(cell => cell.isHighlightedForCapturing)
);

export const selectIsCheckerMovable = (id: string) => createSelector(
  [selectPlayingCellList, selectPossibleGoCellIdListById(id), selectCaptureList],
  (cellList, possibleGoCellIdList, captureList) =>
    captureList.length === 0
      ? cellList
          .filter(cell => possibleGoCellIdList.includes(cell.id))
          .filter(cell => !cell.hasCellChecker).length > 0
      : captureList
          .filter(cell => cell.id === id).length > 0
);
