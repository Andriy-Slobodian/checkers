import React, { FC } from "react";
import { useSelector } from "react-redux";
import { selectIsWhiteTurn } from "@selectors/board-selectors";
import css from "./TurnIndicator.css";

interface Props {
  isActive: boolean;
}
export const TurnIndicator: FC<Props> = ({
  isActive
}) => {
  const isWhiteTurn = useSelector(selectIsWhiteTurn);

  const blackActive = [css.turn, !isWhiteTurn ? css.turnOn : css.turnOff].join(' ');
  const whiteActive = [css.turn, isWhiteTurn ? css.turnOn : css.turnOff].join(' ');

  return (
    <span className={isActive ? blackActive : whiteActive} />
  );
};
