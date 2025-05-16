import React from 'react';
import useCalendarDays from '../hooks/useCalendarDays';
import { phaseStyles, newAppPhaseStyles, daysInMonth, monthNames } from '../constants/phaseStyles';

// --- Celdas vacías ---
type EmptyCellsProps = {
  from: number;
  to: number;
  className?: string;
};
const EmptyCells: React.FC<EmptyCellsProps> = ({ from, to, className }) => {
  const cellClass = className;
  return (
    <>
      {Array.from({ length: to - from + 1 }, (_, i) => (
        <td key={`empty-${from + i}`} className={`column${from + i} ${cellClass}`} />
      ))}
    </>
  );
};

EmptyCells.defaultProps = {
  className: 'style11 null',
};

type PaintMap = { [key: string]: string };

type CalendarTableProps = {
  paintMap: PaintMap;
  paintMode: boolean;
  freeDayMode: boolean;
  freeDays: Set<number>;
  onPaintCell: (row: number, col: number) => void;
  onMarkFreeDay: (col: number) => void;
};

type PaintableDayCellProps = {
  row: number;
  col: number;
  className?: string;
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

PaintableDayCell.defaultProps = {
  className: 'style11 null',
};

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
  } else {
    title = undefined;
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

const CalendarTable: React.FC<CalendarTableProps> = ({
  paintMap,
  paintMode,
  freeDayMode,
  freeDays,
  onPaintCell,
  onMarkFreeDay,
}) => {
  const days = useCalendarDays();
  const colStart = 5;
  const colEnd = colStart + days.length - 1;

  const monthDayCols = days.map(({ col }) => <col key={`col-${col}`} className={`col${col}`} />);

  const monthColStart = (m: number) =>
    colStart + daysInMonth.slice(0, m).reduce((a, b) => a + b, 0);

  return (
    <table id="sheet0" className="sheet0 gridlines">
      <col className="col0" />
      <col className="col1" />
      <col className="col2" />
      <col className="col3" />
      <col className="col4" />
      {monthDayCols}
      <tbody>
        {/* Fila 0 */}
        <tr className="row0">
          <td className="column0 style1 s" colSpan={5}>
            SOMOSBELCORP ECOSYSTEM
          </td>
          {monthNames.map((month, m) => (
            <td
              key={`r0-m${month}`}
              className={`column${monthColStart(m)} style2 null`}
              colSpan={daysInMonth[m]}
            />
          ))}
        </tr>
        {/* Fila 1 */}
        <tr className="row1">
          <td className="column0 style3 s" colSpan={5}>
            IMPORTANT Commercial dates
          </td>
          {monthNames.map((month, m) => (
            <td
              key={`r1-m${month}`}
              className={`column${monthColStart(m)} style4 null`}
              colSpan={daysInMonth[m]}
            />
          ))}
        </tr>
        {/* Fila 2 */}
        <tr className="row2">
          <td className="column0 style5 s" colSpan={5} rowSpan={2}>
            Release Plan
          </td>
          {monthNames.map((month, m) => (
            <td
              key={`r2-m${month}`}
              className={`column${monthColStart(m)} style6 s`}
              colSpan={daysInMonth[m]}
            />
          ))}
          {days.map(({ day, col }) => (
            <CalendarDayCell
              key={`daycell-${col}`}
              day={day}
              col={col}
              freeDayMode={freeDayMode}
              freeDays={freeDays}
              onMarkFreeDay={onMarkFreeDay}
            />
          ))}
        </tr>
        {/* Fila 3 */}
        <tr className="row3">
          {monthNames.map((month, m) => (
            <td
              key={`r3-m${month}`}
              className={`column${monthColStart(m)} style8 null`}
              colSpan={daysInMonth[m]}
            />
          ))}
        </tr>
        {/* Fila 6 */}
        <tr className="row6">
          <td className="column0 style9 s" colSpan={3}>
            Scope
          </td>
          <td className="column3 style9 s">Phase</td>
          <td className="column4 style10 s">
            Release <br />
            Note
          </td>
          {days.map(({ day, col }) => (
            <CalendarDayCell
              key={`daycell-${col}`}
              day={day}
              col={col}
              freeDayMode={freeDayMode}
              freeDays={freeDays}
              onMarkFreeDay={onMarkFreeDay}
            />
          ))}
        </tr>
        {/* Fila 7 */}
        <tr className="row7">
          <td className="column0 style12 s">VERSION:</td>
          <td className="column1 style13 s">2.18.7</td>
          <td className="column2 style12 s">COMPONENTS:</td>
          <td className="column3 style13 s">WEB + BACKEND</td>
          <td className="column4 style14 s" /* INFO cell */ style={{ color: '#000' }}>
            INFO
          </td>
          <EmptyCells from={colStart} to={colEnd} className="style15 null" />
        </tr>
        {/* Fila 8 */}
        <tr className="row8">
          <td className="column0 style16 s" colSpan={3} rowSpan={15}>
            <span
              style={{
                fontWeight: 'bold',
                color: '#000',
                fontFamily: 'Calibri',
                fontSize: '14pt',
              }}
            >
              SBR Release Web
              <br />
            </span>
            <span
              style={{
                color: '#000',
                fontFamily: 'Calibri',
                fontSize: '14pt',
              }}
            >
              <br />
              BackEnd New App 1.1.0 (3 tickets)
              <br />
              PR - USA New Home Update - FF = OFF
              <br />
            </span>
            <span
              style={{
                fontWeight: 'bold',
                color: '#000',
                fontFamily: 'Calibri',
                fontSize: '14pt',
              }}
            >
              Features:
              <br />
            </span>
          </td>
          <td className="column3 style17 s">Sprint - Planning</td>
          <td className="column4 style4" rowSpan={15} />
          {days.map(({ col }) => (
            <PaintableDayCell
              key={`r8-c${col}`}
              row={8}
              col={col}
              className="style11 null"
              paintMap={paintMap}
              paintMode={paintMode}
              freeDayMode={freeDayMode}
              freeDays={freeDays}
              onPaintCell={onPaintCell}
            />
          ))}
        </tr>
        {/* Filas 9-22: phaseStyles */}
        {phaseStyles.map((phase, idx) => (
          <tr key={`phase-${9 + idx}`} className={`row${9 + idx}`}>
            <td className={`column3 ${phase.class} s`}>{phase.text}</td>
            {/* columna4 (rosa) se mantiene */}
            {days.map(({ col }) => (
              <PaintableDayCell
                key={`phase-${9 + idx}-col${col}`}
                row={9 + idx}
                col={col}
                className="style11 null"
                paintMap={paintMap}
                paintMode={paintMode}
                freeDayMode={freeDayMode}
                freeDays={freeDays}
                onPaintCell={onPaintCell}
              />
            ))}
          </tr>
        ))}
        {/* Fila 23 */}
        <tr className="row23">
          <td className="column0 style33 s">VERSION:</td>
          <td className="column1 style34 s">1.1.0</td>
          <td className="column2 style33 s">COMPONENTS:</td>
          <td className="column3 style34 s">NEW APP</td>
          <td className="column4 style35 s" /* INFO cell */ style={{ color: '#000' }}>
            INFO
          </td>
          <EmptyCells from={colStart} to={colEnd} className="style36 null" />
        </tr>
        {/* Fila 24 */}
        <tr className="row24">
          <td className="column0 style38 s" colSpan={3} rowSpan={14}>
            <span
              style={{
                fontFamily: 'Calibri',
                fontSize: '14pt',
              }}
            >
              Release Beta: 07/04/2025
              <br />
              Release Date: 14/04/2025
              <br />
              <br />
            </span>
            <span
              style={{
                fontWeight: 'bold',
                color: '#000',
                fontFamily: 'Calibri',
                fontSize: '14pt',
              }}
            >
              Features:
              <br />
            </span>
            <span
              style={{
                color: '#000',
                fontFamily: 'Calibri',
                fontSize: '14pt',
              }}
            >
              PR - USA New Home Update <br />
              New App 1.1.0 (3 tickets) Fixes
              <br />
              PR - USA New Home Update - FF = ON
            </span>
          </td>
          <td className="column3 style19 s">Development . JM</td>
          <td className="column4 style42 null" rowSpan={14} />
          {days.map(({ col }) => (
            <PaintableDayCell
              key={`r24-c${col}`}
              row={24}
              col={col}
              className="style11 null"
              paintMap={paintMap}
              paintMode={paintMode}
              freeDayMode={freeDayMode}
              freeDays={freeDays}
              onPaintCell={onPaintCell}
            />
          ))}
        </tr>
        {/* Filas NewAppPhaseRows */}
        {newAppPhaseStyles.map((phase, idx) => (
          <tr key={`newapp-${25 + idx}`} className={`row${25 + idx}`}>
            <td className={`column3 ${phase.class} s`}>{phase.text}</td>
            {/* columna4 eliminada */}
            {days.map(({ col }) => {
              const isLastRow = idx === newAppPhaseStyles.length - 1;
              // Cambia la lógica para que la celda especial tenga ambas clases
              const styleClass = isLastRow && col === 8 ? 'style44 style45' : 'style44';
              return (
                <PaintableDayCell
                  key={`newapp-${25 + idx}-col${col}`}
                  row={25 + idx}
                  col={col}
                  className={`${styleClass} null`}
                  paintMap={paintMap}
                  paintMode={paintMode}
                  freeDayMode={freeDayMode}
                  freeDays={freeDays}
                  onPaintCell={onPaintCell}
                />
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CalendarTable;
