import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit';
import { createDefaultBoard, defaultPlayingCell, isQueen } from "@utils/board-util";

export type TCoordinates = {
  x: number;
  y: number;
}

export type TMove = {
  fromId: string;
  toId: string;
  captureId?: string;
}

export type TCell = {
  id: string;
  isPlayingCell: boolean;
  hasCellChecker: boolean;
  isCheckerBlack: boolean;
  cellCoordinates: TCoordinates | null;
  hasCheckerShadow: boolean;
  isPossibleGoCell: boolean;
  isQueen: boolean;
  isHighlightedForCapturing: boolean;
}

const initialState = {
  boardState: createDefaultBoard(),
  turnCounter: 0,
  captureList: []
}

export const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    resetBoard(state){
    },
    updateCheckerShadowByCellId(state, action: PayloadAction<string>){
      state.boardState.map(cell => {
        cell.hasCheckerShadow = cell.id !== action.payload;
      })
    },
    resetCheckerShadow(state) {
      state.boardState.map(cell => {
        cell.hasCheckerShadow = true;
      })
    },
    updatePossibleGoCellListByCellIdList(state, action: PayloadAction<string[]>) {
      state.boardState.map(cell => {
        if (action.payload.includes(cell.id) && !cell.hasCellChecker) {
          cell.isPossibleGoCell = true;
        }
      })
    },
    resetPossibleGoCell(state) {
      state.boardState.map(cell => {
        cell.isPossibleGoCell = false;
      })
    },
    updateCoordinatesById(state, action: PayloadAction<{id: string, coordinates: TCoordinates}>) {
      const { id, coordinates} = action.payload;

      state.boardState.map(cell => {
        if (cell.id === id) {
          cell.cellCoordinates = coordinates;
        }
      })
    },
    emptyCellById(state, action: PayloadAction<string>) {
      state.boardState.map(cell => {
          if (cell.id === action.payload) {
            cell.hasCellChecker = false;
          }
        })
    },
    updateCell(state, action: PayloadAction<TCell>) {
      state.boardState = state.boardState.map(cell =>
        cell.id === action.payload.id
          ? action.payload
          : cell
      )
    },
    increaseTurnCounter(state) {
      state.turnCounter += 1;
    },
    initCapturing(state, action: PayloadAction<TCell[]>) {
      state.captureList = [ ...action.payload ];
    },
    resetCapturing(state) {
      state.captureList = [];
      state.boardState.map(cell => {
        cell.isHighlightedForCapturing = false;
      })
    },
    highlightCaptureCellById(state, action: PayloadAction<string>) {
      state.boardState.map(cell =>
        cell.id === action.payload
          ? cell.isHighlightedForCapturing = true
          : cell
      )
    },
    setQueen(state, action: PayloadAction<string>) {
      state.boardState.map(cell =>
        cell.id === action.payload
          ? cell.isQueen = true
          : cell
      )
    },
    moveChecker(state, action: PayloadAction<TMove>) {
      const { fromId, toId, captureId} = action.payload;
      const fromCell = { ...state.boardState.find(cell => cell.id === fromId)};

      state.boardState.map(cell => {
        cell.isPossibleGoCell = false;
        cell.isHighlightedForCapturing = false;
        cell.hasCheckerShadow = true;

        if (cell.id === toId) {
          cell.hasCellChecker = true;
          cell.isCheckerBlack = fromCell.isCheckerBlack;
          cell.isQueen = fromCell.isQueen || isQueen(cell.id, fromCell.isCheckerBlack);
        }

        if (cell.id === fromId || cell.id === captureId) {
          cell.hasCellChecker = false;
        }
      });
      state.captureList = [];
    }
  }
});

export const {
  resetBoard,
  updateCheckerShadowByCellId,
  resetCheckerShadow,
  updatePossibleGoCellListByCellIdList,
  resetPossibleGoCell,
  updateCoordinatesById,
  emptyCellById,
  updateCell,
  increaseTurnCounter,
  initCapturing,
  resetCapturing,
  highlightCaptureCellById,
  moveChecker
} = boardSlice.actions;
