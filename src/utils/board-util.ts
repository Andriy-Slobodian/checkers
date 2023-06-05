import { TCell } from "@slices/board-slice";
import {
  DEFAULT_CELL_HEIGHT,
  DEFAULT_CELL_WIDTH,
  DEFAULT_COLUMN_AMOUNT,
  DEFAULT_ROW_AMOUNT,
  LEFT_CAPTURE_DIFFERENCE,
  LEFT_GO_DIFFERENCE,
  RIGHT_CAPTURE_DIFFERENCE,
  RIGHT_GO_DIFFERENCE
} from "@constants";
import memoize from "lodash/memoize";

export const defaultCell = {
  id: ``,
  isPlayingCell: false,
  hasCellChecker: false,
  isCheckerBlack: false,
  checkerCoordinates: null,
  cellCoordinates: null,
  hasCheckerShadow: true,
  isPossibleGoCell: false,
  isQueen: false,
  isHighlightedForCapturing: false
};

export const createDefaultBoard = memoize(() => {
  const board: TCell[] = [];

  for (let i = 1; i <= DEFAULT_COLUMN_AMOUNT; i++) {
    for (let j = 1; j <= DEFAULT_ROW_AMOUNT; j++) {
      const isPlayingCell = i % 2 === 0 ? j % 2 !== 0 : j % 2 === 0;
      const hasChecker = isPlayingCell && i !== 4 && i !== 5;

      board.push({
        ...defaultCell,
        id: `${i}${j}`,
        isPlayingCell,
        hasCellChecker: hasChecker,
        isCheckerBlack: hasChecker && (i === 1 || i === 2 || i === 3),
      });
    }
  }

  return board;
});

export const excludeNonExistingIds = memoize((idList: string[]) => {
  const board = createDefaultBoard();
  const existingIdSet = new Set(board.map(cell => cell.id));

  return idList.filter(id => existingIdSet.has(id));
});

export const getPossibleGoIdList = (id: string, isGoForward: boolean) => {
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
};

export const getNeighboursIdList = (id: string) => {
  const leftTopId = String(Number(id) + LEFT_GO_DIFFERENCE);
  const leftBottomId = String(Number(id) - LEFT_GO_DIFFERENCE);
  const rightTopId = String(Number(id) + RIGHT_GO_DIFFERENCE);
  const rightBottomId = String(Number(id) - RIGHT_GO_DIFFERENCE);

  return [leftTopId, rightTopId, leftBottomId, rightBottomId];
};

export const getPossibleCaptureIdList = (id: string) => {
  const leftTopId = String( Number(id) + LEFT_CAPTURE_DIFFERENCE);
  const leftBottomId = String( Number(id) - LEFT_CAPTURE_DIFFERENCE);
  const rightTopId = String(Number(id) + RIGHT_CAPTURE_DIFFERENCE);
  const rightBottomId = String(Number(id) - RIGHT_CAPTURE_DIFFERENCE);

  return [leftTopId, rightTopId, leftBottomId, rightBottomId];
};

export const getCellById = (id: string, list: TCell[]) =>
    list.filter(item => item.id === id)[0];

export const actualizeHighlightedCellList = (id, list) => {
  return list
    .filter(cell => {
      const idDifference = Math.abs(Number(cell.id) - Number(id));

      return idDifference === LEFT_CAPTURE_DIFFERENCE || idDifference === RIGHT_CAPTURE_DIFFERENCE
    })
};

export const isOverlapping = (pointerCoordinates, cellCoordinates) => {
  if (!pointerCoordinates || !cellCoordinates) {
    return false;
  }

  const horizontalDifference = pointerCoordinates.x - cellCoordinates.x;
  const verticalDifference = pointerCoordinates.y - cellCoordinates.y;
  const isHorizontalOverlapping = horizontalDifference <= DEFAULT_CELL_WIDTH && horizontalDifference >= 0;
  const isVerticalOverlapping = verticalDifference <= DEFAULT_CELL_HEIGHT && verticalDifference >= 0;

  return isHorizontalOverlapping && isVerticalOverlapping;
};

export const isQueen = (id: string, isBlack: boolean) =>
  isBlack && id.startsWith('8') || !isBlack && id.startsWith('1');

export const checkCapturing = (board: TCell[], isWhiteTurn: boolean) => {
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
      capturingList.push(currentCell, neighbourLeftTop, captureLeftTop);
    }
    if (isWhiteTurn && !currentCell.isCheckerBlack && neighbourLeftTop && neighbourLeftTop.isCheckerBlack && captureLeftTop && !captureLeftTop.hasCellChecker) {
      console.log('CASE 2: ', currentCell.id, neighbourLeftTop.id, captureLeftTop.id);
      capturingList.push(currentCell, neighbourLeftTop, captureLeftTop);
    }
    if (!isWhiteTurn && currentCell.isCheckerBlack && neighbourRightTop && !neighbourRightTop.isCheckerBlack && captureRightTop && !captureRightTop.hasCellChecker) {
      console.log('CASE 3: ', currentCell.id, neighbourRightTop.id, captureRightTop.id);
      capturingList.push(currentCell, neighbourRightTop, captureRightTop);
    }
    if (isWhiteTurn && !currentCell.isCheckerBlack && neighbourRightTop && neighbourRightTop.isCheckerBlack && captureRightTop && !captureRightTop.hasCellChecker) {
      console.log('CASE 4: ', currentCell.id, neighbourRightTop.id, captureRightTop.id);
      capturingList.push(currentCell, neighbourRightTop, captureRightTop);
    }
    if (!isWhiteTurn && currentCell.isCheckerBlack && neighbourLeftBottom && !neighbourLeftBottom.isCheckerBlack && captureLeftBottom && !captureLeftBottom.hasCellChecker) {
      console.log('CASE 5: ', currentCell.id, neighbourLeftBottom.id, captureLeftBottom.id);
      capturingList.push(currentCell, neighbourLeftBottom, captureLeftBottom);
    }
    if (isWhiteTurn && !currentCell.isCheckerBlack && neighbourLeftBottom && neighbourLeftBottom.isCheckerBlack && captureLeftBottom && !captureLeftBottom.hasCellChecker) {
      console.log('CASE 6: ', currentCell.id, neighbourLeftBottom.id, captureLeftBottom.id);
      capturingList.push(currentCell, neighbourLeftBottom, captureLeftBottom);
    }
    if (!isWhiteTurn && currentCell.isCheckerBlack && neighbourRightBottom && !neighbourRightBottom.isCheckerBlack && captureRightBottom && !captureRightBottom.hasCellChecker) {
      console.log('CASE 7: ', currentCell.id, neighbourRightBottom.id, captureRightBottom.id);
      capturingList.push(currentCell, neighbourRightBottom, captureRightBottom);
    }
    if (isWhiteTurn && !currentCell.isCheckerBlack && neighbourRightBottom && neighbourRightBottom.isCheckerBlack && captureRightBottom && !captureRightBottom.hasCellChecker) {
      console.log('CASE 8: ', currentCell.id, neighbourRightBottom.id, captureRightBottom.id);
      capturingList.push(currentCell, neighbourRightBottom, captureRightBottom);
    }
  });

  return capturingList;
}

export const getMoveList = (playingIdList: TCell[]) => {
  const moveList = [];

  for (let i = 0; i < playingIdList.length; i++) {
    if (playingIdList[i].hasCellChecker && playingIdList[i].isCheckerBlack) {
      const possibleGoIdList = getPossibleGoIdList(playingIdList[i].id, true);
      const moveCell = playingIdList.find(
        cell => !cell.hasCellChecker && (cell.id === possibleGoIdList[0] || cell.id === possibleGoIdList[1])
      );

      if (moveCell) {
        moveList.push(playingIdList[i], moveCell);
        break;
      }
    }
  }

  return moveList;
};
