import React from 'react';

type PaintMap = { [key: string]: string };

type PaintableDayCellProps = {
  row: number;
  col: number;
  className: string;
  paintMap: PaintMap;
  paintMode: boolean;
  freeDayMode: boolean;
  freeDays: Set<number>;
  onPaintCell: (row: number, col: number) => void;
};

const PaintableDayCell: React.FC<PaintableDayCellProps> = ({
  row,
  col,
  className = 'style11 null',
  paintMap,
  paintMode,
  freeDayMode,
  freeDays,
  onPaintCell,
}) => {
  const paintKey = `${row}|${col}`;
  const paintedColor = paintMap[paintKey];
  const isFree = freeDays.has(col);

  let style: React.CSSProperties | undefined;
  if (isFree) {
    style = {
      background: '#e0e0e0',
      color: '#888',
      cursor: 'not-allowed',
      pointerEvents: 'none',
      opacity: 0.7,
    };
  } else if (paintedColor) {
    style = {
      background: paintedColor,
      cursor: paintMode ? 'pointer' : undefined,
    };
  } else if (paintMode) {
    style = { cursor: 'pointer' };
  }

  return (
    <td
      className={`column${col} ${className}`}
      style={style}
      onClick={!isFree && paintMode && !freeDayMode ? () => onPaintCell(row, col) : undefined}
      onKeyDown={
        !isFree && paintMode && !freeDayMode
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onPaintCell(row, col);
              }
            }
          : undefined
      }
      tabIndex={!isFree && paintMode && !freeDayMode ? 0 : undefined}
      title={(() => {
        if (isFree) return 'Día libre';
        if (paintMode && !freeDayMode) return 'Pintar celda';
        return undefined;
      })()}
      aria-disabled={isFree ? 'true' : undefined}
    />
  );
};

export default PaintableDayCell;
