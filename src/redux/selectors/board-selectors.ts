import {createSelector, current} from "@reduxjs/toolkit";
import { store } from "../store";
import {getCellById, getNeighboursIdList, getPossibleCaptureIdList, getPossibleGoIdList} from "@utils/board-util";
import {TCell} from "@slices/board-slice";

// Primitive Selectors
export const selectBoard = () => store.getState().board.boardState;
export const selectTurnCounter = () => store.getState().board.turnCounter;
export const selectStopDnDId = () => store.getState().board.stopDnDId;
export const selectIsGameOver = () => store.getState().board.isGameOver;
export const selectMoveExtender = () => store.getState().board.moveExtender;

// Selectors
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

export const selectBlackAmount = createSelector(
  [selectPlayingCellList],
  (cellList) => cellList.filter(cell => cell.hasCellChecker && cell.isCheckerBlack).length
);

export const selectWhiteAmount = createSelector(
  [selectPlayingCellList],
  (cellList) => cellList.filter(cell => cell.hasCellChecker && !cell.isCheckerBlack).length
);

export const selectCellById = (id: string) => createSelector(
  [selectPlayingCellList],
  (cellList) => {
    return cellList.filter(cell => cell.id === id)[0];
  }
);

export const selectPossibleGoIdListForId = (id: string) => createSelector(
  [selectCellById(id)],
  (currentCell) => getPossibleGoIdList(id, currentCell.isCheckerBlack)
);

export const selectCellListByIdList = (idList: string[]) => createSelector(
  [selectPlayingCellList],
  (cellList) =>
    cellList.filter(cell => idList.includes(cell.id) && !cell.hasCellChecker)
);

export const selectIsCheckerMovable = (id: string, captureList: TCell[]) => createSelector(
  [selectPlayingCellList, selectPossibleGoIdListForId(id)],
  (cellList, possibleGoCellIdList) =>
    captureList.length === 0
      ? cellList
          .filter(cell => possibleGoCellIdList.includes(cell.id))
          .filter(cell => !cell.hasCellChecker).length > 0
      : captureList.map(cell => cell.id).includes(id)
);

export const selectIsQueen = (id) => createSelector(
  [selectPlayingCellList],
  (cellList) => Boolean(cellList.find(cell => cell.id === id)?.isQueen)
);
