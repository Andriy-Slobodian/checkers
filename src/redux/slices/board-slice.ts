import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit';
import { defineDefaultBoard } from "@utils/board-util";

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
}

const initialState = {
  boardState: defineDefaultBoard(),
}

export const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    resetBoard(state){
      defineDefaultBoard().map(cell => {
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
    updateCheckerCoordinatesById(state, action: PayloadAction<{id: string, coordinates: TCoordinates}>) {
      const { id, coordinates} = action.payload;

      state.boardState.map(cell => {
        if (cell.id === id) {
          cell.checkerCoordinates = coordinates;
        }
      })
    },
    updateCellCoordinatesById(state, action: PayloadAction<{id: string, coordinates: TCoordinates}>) {
      const { id, coordinates} = action.payload;

      state.boardState.map(cell => {
        if (cell.id === id) {
          cell.cellCoordinates = coordinates
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
    }
  }
});

export const {
  resetBoard,
  updateCheckerShadowByCellId,
  resetCheckerShadow,
  updatePossibleGoCellListByCellIdList,
  resetPossibleGoCell,
  updateCheckerCoordinatesById,
  updateCellCoordinatesById,
  emptyCellById,
  updateCell
} = boardSlice.actions;
