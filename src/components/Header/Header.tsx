import {FC} from "react";
import css from './Header.css';

interface Props {
  text: string;
}
export const Header: FC<Props> = ({ text }) => {
  return (
    <h1 className={css.container}>{text}</h1>
  );
};
