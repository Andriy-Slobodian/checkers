import {TCell} from "@slices/board-slice";
import {DEFAULT_COLUMN_AMOUNT, DEFAULT_ROW_AMOUNT} from "@constants";

export const defineDefaultBoard = () => {
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
        isQueen: false
      });
    }
  }

  return board;
};
