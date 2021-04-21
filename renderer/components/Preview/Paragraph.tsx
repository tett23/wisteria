import React from 'react';
import css from '../VerticalEditor/VerticalEditor.module.css';

export function Paragraph({ text }: { text: string }) {
  const content = text === '' ? <br /> : <>{text}</>;

  return <div className={css.paragraph}>{content}</div>;
}
