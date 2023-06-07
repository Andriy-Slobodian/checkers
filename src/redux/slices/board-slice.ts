import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit';
import { createDefaultBoard, isQueen } from "@utils/board-util";

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
  boardState: [],
  turnCounter: 0,
  stopDnDId: null,
  moveExtender: 0,
  isGameOver: false
}

export const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    createBoard(state, action: PayloadAction<TCoordinates>) {
      state.boardState = createDefaultBoard(action.payload);
      state.turnCounter = 0;
      state.stopDnDId = null;
      state.moveExtender = 0;
      state.isGameOver = false;
    },
    resetBoard(state){
      state.boardState = [];
    },
    updateCheckerShadow(state, action: PayloadAction<string>){
      state.boardState.map(cell => {
        cell.hasCheckerShadow = cell.id !== action.payload;
      })
    },
    resetCheckerShadow(state) {
      state.boardState.map(cell => {
        cell.hasCheckerShadow = true;
      })
    },
    updatePossibleGoList(state, action: PayloadAction<string[]>) {
      state.boardState.map(cell => {
        if (action.payload.includes(cell.id) && !cell.hasCellChecker) {
          cell.isPossibleGoCell = true;
        }
      })
    },
    resetPossibleGoList(state) {
      state.boardState.map(cell => {
        cell.isPossibleGoCell = false;
      })
    },
    changeTurn(state) {
      state.turnCounter += 1;
      state.stopDnDId = null;
      state.moveExtender = 0;
    },
    resetTurn(state) {
      state.turnCounter = 0;
      state.stopDnDId = null;
      state.moveExtender = 0;
    },
    highlightCapturing(state, action: PayloadAction<string>) {
      state.boardState.map(cell =>
        cell.id === action.payload
          ? cell.isHighlightedForCapturing = true
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
      state.stopDnDId = toId;
      state.moveExtender += 1;
    },
    gameOver(state) {
      state.isGameOver = true;
    }
  }
});

export const {
  createBoard,
  resetBoard,
  updateCheckerShadow,
  resetCheckerShadow,
  updatePossibleGoList,
  resetPossibleGoList,
  changeTurn,
  resetTurn,
  highlightCapturing,
  moveChecker,
  gameOver
} = boardSlice.actions;
