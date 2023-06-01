import {TCell} from "@slices/board-slice";
import {
  DEFAULT_COLUMN_AMOUNT,
  DEFAULT_ROW_AMOUNT,
  LEFT_CAPTURE_DIFFERENCE,
  LEFT_GO_DIFFERENCE, RIGHT_CAPTURE_DIFFERENCE,
  RIGHT_GO_DIFFERENCE
} from "@constants";
import memoize from "lodash/memoize";

export const defineDefaultBoard = memoize(() => {
  const board: TCell[] = [];

  for (let i = 1; i <= DEFAULT_COLUMN_AMOUNT; i++) {
    for (let j = 1; j <= DEFAULT_ROW_AMOUNT; j++) {
      const isPlayingCell = i % 2 === 0 ? j % 2 !== 0 : j % 2 === 0;
      const hasChecker = isPlayingCell && i !== 4 && i !== 5;

      board.push({
        id: `${i}${j}`,
        isPlayingCell,
        hasCellChecker: hasChecker,
        isCheckerBlack: hasChecker && (i === 1 || i === 2 || i === 3),
        checkerCoordinates: null,
        cellCoordinates: null,
        hasCheckerShadow: true,
        isPossibleGoCell: false,
        isQueen: false,
        isHighlightedForCapturing: false
      });
    }
  }

  return board;
});

export const excludeNonExistingIds = memoize((idList: string[]) => {
  const board = defineDefaultBoard();
  const existingIdSet = new Set(board.map(cell => cell.id));

  return idList.filter(id => existingIdSet.has(id));
});

export const getPossibleGoIdList = memoize((id: string, isGoForward: boolean) => {
  const leftId = String(
    isGoForward
      ? Number(id) + LEFT_GO_DIFFERENCE
      : Number(id) - LEFT_GO_DIFFERENCE
  );
  const rightId = String(
    isGoForward
      ? Number(id) + RIGHT_GO_DIFFERENCE
      : Number(id) - RIGHT_GO_DIFFERENCE
  );

  return excludeNonExistingIds([leftId, rightId]);
});

export const getPossibleCaptureIdList = memoize((id: string, isGoForward: boolean) => {
  const leftId = String(
    isGoForward
      ? Number(id) + LEFT_CAPTURE_DIFFERENCE
      : Number(id) - LEFT_CAPTURE_DIFFERENCE
  );
  const rightId = String(
    isGoForward
      ? Number(id) + RIGHT_CAPTURE_DIFFERENCE
      : Number(id) - RIGHT_CAPTURE_DIFFERENCE
  );

  return excludeNonExistingIds([leftId, rightId]);
});

export const getCellById = (id: string, list: TCell[]) =>
    list.filter(item => item.id === id)[0];

export const checkCapturing = (board, isWhiteTurn) => {
  const capturingList = [];
  const cellList = board.filter(cell => cell.hasCellChecker);

  cellList.forEach(currentCell => {
    const possibleGoIdList = getPossibleGoIdList(currentCell.id, currentCell.isCheckerBlack);
    const possibleCaptureIdList = getPossibleCaptureIdList(currentCell.id, currentCell.isCheckerBlack);

    const possibleGoLeft = possibleGoIdList[0]
      ? getCellById(possibleGoIdList[0], cellList)
      : null;
    const possibleGoRight = possibleGoIdList[1]
      ? getCellById(possibleGoIdList[1], cellList)
      : null;
    const captureLeft = possibleCaptureIdList[0]
      ? getCellById(possibleCaptureIdList[0], board)
      : null;
    const captureRight = possibleCaptureIdList[1]
      ? getCellById(possibleCaptureIdList[1], board)
      : null;

    if (!isWhiteTurn && currentCell.isCheckerBlack && possibleGoLeft && !possibleGoLeft.isCheckerBlack && captureLeft && !captureLeft.hasCellChecker) {
      console.log(currentCell.id, possibleGoLeft.id, captureLeft.id);
      capturingList.push(currentCell, possibleGoLeft, captureLeft);
    }
    if (!isWhiteTurn && currentCell.isCheckerBlack && possibleGoRight && !possibleGoRight.isCheckerBlack && captureRight && !captureRight.hasCellChecker) {
      console.log(currentCell.id, possibleGoRight.id, captureRight.id);
      capturingList.push(currentCell, possibleGoRight, captureRight);
    }
    if (isWhiteTurn && !currentCell.isCheckerBlack && possibleGoLeft && possibleGoLeft.isCheckerBlack && captureLeft && !captureLeft.hasCellChecker) {
      console.log(currentCell.id, possibleGoLeft.id, captureLeft.id);
      capturingList.push(currentCell, possibleGoLeft, captureLeft);
    }
    if (isWhiteTurn && !currentCell.isCheckerBlack && possibleGoRight && possibleGoRight.isCheckerBlack && captureRight && !captureRight.hasCellChecker) {
      console.log(currentCell.id, possibleGoRight.id, captureRight.id);
      capturingList.push(currentCell, possibleGoRight, captureRight);
    }
  });

  return capturingList;
};
