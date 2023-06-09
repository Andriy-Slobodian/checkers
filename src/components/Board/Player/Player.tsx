import React, { FC, memo } from "react";
import { TurnIndicator } from "@components/Board/Player/TurnIndicator/TurnIndicator";
import css from "./Player.css";

interface Props {
  name: string;
  isAutoPlayer?: boolean;
}
export const Player: FC<Props> = memo(({
  name,
  isAutoPlayer = false
}) => {
  return (
    <div className={css.container}>
      {name}
      <TurnIndicator isActive={isAutoPlayer} />
    </div>
  );
});
