import React from 'react';

type EmptyCellsProps = {
  from: number;
  to: number;
  className?: string;
};

const EmptyCells: React.FC<EmptyCellsProps> = ({ from, to, className }) => (
  <>
    {Array.from({ length: to - from + 1 }, (_, i) => (
      <td key={`empty-${from + i}`} className={`column${from + i} ${className}`} />
    ))}
  </>
);

EmptyCells.defaultProps = {
  className: 'style11 null',
};

export default EmptyCells;
