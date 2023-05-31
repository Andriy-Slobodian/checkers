import {FC, useEffect, useState} from "react";
import css from "./Board.css";
import {Cell} from "./Cell/Cell";
import {defineDefaultBoard} from "@utils/board-util";
import {useDispatch, useSelector} from "react-redux";
import {resetBoard} from "@slices/board-slice";
import {selectBoard} from "@selectors/board-selectors";

export const Board: FC = () => {
  const board = useSelector(selectBoard);

  console.log(board);

  return (
    <>
      {board.length > 0 && (
        <div className={css.container}>
          {board.map((cell) => {
            return (
              <Cell key={cell.id} {...cell} />
            );
          })}
        </div>
      )}
    </>
  );
};

