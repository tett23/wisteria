import React from 'react';
import css from './Preview.module.css';

export const Paragraph = React.memo(
  ({ text }: { text: string }) => {
    const content = text === '' ? <br /> : <>{text}</>;

    return <div className={css.paragraph}>{content}</div>;
  },
  (a, b) => a.text === b.text,
);
