import { createSelector } from "@reduxjs/toolkit";
import { store } from "../store";

export const selectBoard = () => store.getState().board.boardState;

export const selectTurnCounter = () => store.getState().board.turnCounter;

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
  (currentCell) => {
    const possibleGoIdList: string[] = [];

    const currentLineNumber = Number(id.charAt(0));
    const currentColumnNumber = Number(id.charAt(1));

    const possibleGoLineNumber = currentCell && currentCell.isCheckerBlack ? currentLineNumber + 1 : currentLineNumber - 1;
    const possibleGoLeftColumnNumber = currentColumnNumber + 1;
    const possibleGoRightColumnNumber = currentColumnNumber - 1;

    const possibleGoLeftCellId = `${possibleGoLineNumber}${possibleGoLeftColumnNumber}`;
    const possibleGoRightCellId = `${possibleGoLineNumber}${possibleGoRightColumnNumber}`;

    possibleGoIdList.push(possibleGoLeftCellId, possibleGoRightCellId);

    return possibleGoIdList;
  }
);

export const selectCellListByIdList = (idList: string[]) => createSelector(
  [selectPlayingCellList],
  (cellList) =>
    cellList.filter(cell => idList.includes(cell.id) && !cell.hasCellChecker)
);

export const selectIsCheckerMovable = (id: string) => createSelector(
  [selectPlayingCellList, selectPossibleGoCellIdListById(id)],
  (cellList, possibleGoCellIdList) =>
    cellList
      .filter(cell => possibleGoCellIdList.includes(cell.id))
      .filter(cell => !cell.hasCellChecker).length > 0
);


