import * as React from 'react';
import "../scss/highlight.scss";
export interface HighlightProps {
  text: string;
  highlight: string;
}

export const Highlight: React.FunctionComponent<HighlightProps> = ({ text, highlight }): JSX.Element => {
  // Split on highlight term and include term into parts, ignore case
  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
  return <span> { parts.map((part: string, i: number) => 
      <span key={i} className={part.toLowerCase() === highlight.toLowerCase() ? 'highlight' : ''}>
          { part }
      </span>)
  } </span>;
}