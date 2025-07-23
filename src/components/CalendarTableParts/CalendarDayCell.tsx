import React from 'react';

type CalendarDayCellProps = {
  day: number;
  col: number;
  freeDayMode: boolean;
  freeDays: Set<number>;
  onMarkFreeDay: (col: number) => void;
};

const CalendarDayCell: React.FC<CalendarDayCellProps> = ({
  day,
  col,
  freeDayMode,
  freeDays,
  onMarkFreeDay,
}) => {
  const isFree = freeDays.has(col);
  let title: string | undefined;
  if (isFree) {
    title = 'Día libre';
  } else if (freeDayMode) {
    title = 'Marcar como día libre';
  }

  return (
    <td
      className={`column${col} style11 n`}
      style={freeDayMode ? { cursor: 'pointer' } : undefined}
      onClick={freeDayMode && !isFree ? () => onMarkFreeDay(col) : undefined}
      onKeyDown={
        freeDayMode && !isFree
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onMarkFreeDay(col);
              }
            }
          : undefined
      }
      tabIndex={freeDayMode && !isFree ? 0 : undefined}
      title={title}
      aria-disabled={isFree ? 'true' : undefined}
    >
      {day}
    </td>
  );
};

export default CalendarDayCell;
