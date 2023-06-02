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

  // return excludeNonExistingIds([leftTopId, rightTopId, leftBottomId, rightBottomId]);
  return [leftTopId, rightTopId, leftBottomId, rightBottomId];
};

export const getPossibleCaptureIdList = (id: string) => {
  const leftTopId = String( Number(id) + LEFT_CAPTURE_DIFFERENCE);
  const leftBottomId = String( Number(id) - LEFT_CAPTURE_DIFFERENCE);
  const rightTopId = String(Number(id) + RIGHT_CAPTURE_DIFFERENCE);
  const rightBottomId = String(Number(id) - RIGHT_CAPTURE_DIFFERENCE);

  // return excludeNonExistingIds([leftTopId, rightTopId, leftBottomId, rightBottomId]);
  return [leftTopId, rightTopId, leftBottomId, rightBottomId];
};

export const getCellById = (id: string, list: TCell[]) =>
    list.filter(item => item.id === id)[0];
