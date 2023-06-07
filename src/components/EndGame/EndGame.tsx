import { FC } from "react";
import { Header } from "@shared/Header/Header";
import css from "./EndGame.css";

export const EndGame: FC = () => {
  return (
    <>
      <div className={css.bg} />
      <div className={css.container}>
        <Header text={'Game Over'} />
        <Header text={'No one should know what happens here'} type={'h2'} />
      </div>
    </>
  );
};
