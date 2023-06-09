import { FC, memo } from "react";
import css from './Header.css';

interface Props {
  align?: 'left' | 'center' | 'right';
  text: string;
  type?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}
export const Header: FC<Props> = memo(({
  text,
  type = 'h1',
  align = 'center'
}) => {
  const HeadingTag = type;
  const cssClasses =
    align === 'center'
      ? css.container
      : align === 'left'
        ? css.container + ' ' + css.textAlignLeft
        : css.container + ' ' + css.textAlignRight;

  return (
    <HeadingTag className={cssClasses}>{text}</HeadingTag>
  );
});
