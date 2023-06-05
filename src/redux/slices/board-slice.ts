import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit';
import { createDefaultBoard } from "@utils/board-util";

export type TCoordinates = {
  x: number;
  y: number;
}

export type TCell = {
  id: string;
  isPlayingCell: boolean;
  hasCellChecker: boolean;
  isCheckerBlack: boolean;
  cellCoordinates: TCoordinates | null;
  checkerCoordinates: TCoordinates | null;
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
      createDefaultBoard().map(cell => {
        cell.checkerCoordinates = null
      })
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

          if (cell.hasCellChecker) {
            cell.checkerCoordinates = {
              x: coordinates.x + 11,
              y: coordinates.y + 11
            }
          }
        }
      })
    },
    emptyCellById(state, action: PayloadAction<string>) {
      state.boardState.map(cell => {
          if (cell.id === action.payload) {
            cell.hasCellChecker = false;
            cell.checkerCoordinates = null;
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
    move(state, action: PayloadAction<TCell[]>) {
      state.boardState.map(cell =>
        cell.id === action.payload[0].id
          ? action.payload[0]
          : cell.id === action.payload[1].id
            ? action.payload[1]
            : action.payload[2] && cell.id === action.payload[2].id
              ? action.payload[2]
              : cell
      )
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
  highlightCaptureCellById
} = boardSlice.actions;
