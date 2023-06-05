import {createSelector, current} from "@reduxjs/toolkit";
import { store } from "../store";
import {getCellById, getNeighboursIdList, getPossibleCaptureIdList, getPossibleGoIdList} from "@utils/board-util";

export const selectBoard = () => store.getState().board.boardState;

export const selectTurnCounter = () => store.getState().board.turnCounter;

export const selectCaptureList = () => store.getState().board.captureList;

export const selectIsDnDStopped = () => store.getState().board.isDnDStopped;

export const selectMoveExtender = () => store.getState().board.moveExtender;

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

export const selectBlackPlayingCellList = createSelector(
  [selectPlayingCellList],
  (playingCellList) => playingCellList.filter(cell => cell.isCheckerBlack)
);

export const selectWhitePlayingCellList = createSelector(
  [selectPlayingCellList],
  (playingCellList) => playingCellList.filter(cell => !cell.isCheckerBlack)
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
      : captureList.map(cell => cell.id).includes(id)
);

export const selectIsQueen = (id) => createSelector(
  [selectPlayingCellList],
  (cellList) => Boolean(cellList.find(cell => cell.id === id)?.isQueen)
);
