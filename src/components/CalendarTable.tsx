// Perfecto, debajo de Release Note, quiero que haya una columna que rellene todo
// exceptuando la fila negra, el color rellenado debe ser #f3d9f7, pero antes de eso...
// Debes mover la columna de abajo de Release Note a la derecha, creando una nueva debajo
// de release note con todo lo que te dije antes, de relleno ese color.

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
  cellTexts: { [key: string]: string };
  setCellTexts: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
  editTextsMode: boolean;
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

  // Depuración: muestra el color que debería tener cada celda
  if (paintedColor) {
    // Solo loguea las celdas que deberían estar pintadas
    // eslint-disable-next-line no-console
    console.log(`Celda ${paintKey} color: ${paintedColor}`);
  }

  let style: React.CSSProperties = {};
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
  } else {
    style = {
      background: '#fff', // fuerza blanco si no hay color
      cursor: paintMode ? 'pointer' : undefined,
    };
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

// Editable cell component
const EditableCell: React.FC<{
  row: number;
  col: number;
  className?: string;
  cellTexts: { [key: string]: string };
  setCellTexts: (t: { [key: string]: string }) => void;
  editTextsMode: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  colSpan?: number;
  rowSpan?: number;
}> = ({
  row,
  col,
  className,
  cellTexts,
  setCellTexts,
  editTextsMode,
  children,
  style,
  colSpan,
  rowSpan,
}) => {
  const key = `${row}|${col}`;
  const [editing, setEditing] = React.useState(false);
  const [value, setValue] = React.useState(
    cellTexts[key] ?? (typeof children === 'string' ? children : ''),
  );

  React.useEffect(() => {
    setValue(cellTexts[key] ?? (typeof children === 'string' ? children : ''));
    // eslint-disable-next-line
  }, [cellTexts[key]]);

  const commitValue = (val: string) => {
    setEditing(false);
    setCellTexts((prev) => {
      if (val.trim() === '') {
        const { [key]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [key]: val };
    });
  };

  if (!editTextsMode) {
    return (
      <td className={className} style={style} colSpan={colSpan} rowSpan={rowSpan}>
        {cellTexts[key] ?? children}
      </td>
    );
  }

  return (
    <td
      className={className}
      style={style}
      colSpan={colSpan}
      rowSpan={rowSpan}
      onClick={() => setEditing(true)}
    >
      {editing ? (
        <input
          type="text"
          autoFocus
          value={value}
          style={{ width: '100%', fontSize: 'inherit', fontFamily: 'inherit' }}
          onChange={(e) => setValue(e.target.value)}
          onBlur={() => commitValue(value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === 'Tab') {
              commitValue(value);
            }
          }}
        />
      ) : (
        cellTexts[key] ?? children
      )}
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
  cellTexts,
  setCellTexts,
  editTextsMode,
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
          <EditableCell
            row={0}
            col={0}
            className="column0 style1 s"
            cellTexts={cellTexts}
            setCellTexts={setCellTexts}
            editTextsMode={editTextsMode}
            colSpan={5}
          >
            SOMOSBELCORP ECOSYSTEM
          </EditableCell>
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
          <EditableCell
            row={1}
            col={0}
            className="column0 style3 s"
            cellTexts={cellTexts}
            setCellTexts={setCellTexts}
            editTextsMode={editTextsMode}
            colSpan={5}
          >
            IMPORTANT Commercial dates
          </EditableCell>
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
          <EditableCell
            row={2}
            col={0}
            className="column0 style5 s"
            cellTexts={cellTexts}
            setCellTexts={setCellTexts}
            editTextsMode={editTextsMode}
            colSpan={5}
            rowSpan={2}
          >
            Release Plan
          </EditableCell>
          {monthNames.map((month, m) => (
            <td
              key={`r2-m${month}`}
              className={`column${monthColStart(m)} style6 s`}
              colSpan={daysInMonth[m]}
            />
          ))}
        </tr>
        {/* Fila 3 */}
        <tr className="row3">
          {/* Nombres de los meses NO editables */}
          {(() => {
            let colIdx = 0;
            return monthNames.map((month, m) => {
              const colSpan = daysInMonth[m];
              const td = (
                <td
                  key={`r3-mname-${month}`}
                  className={`column${colStart + colIdx} style8 null`}
                  colSpan={colSpan}
                  style={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: 13,
                    letterSpacing: 1,
                  }}
                >
                  {month}
                </td>
              );
              colIdx += colSpan;
              return td;
            });
          })()}
        </tr>
        {/* Fila 6 */}
        <tr className="row6">
          <EditableCell
            row={6}
            col={0}
            className="column0 style9 s"
            cellTexts={cellTexts}
            setCellTexts={setCellTexts}
            editTextsMode={editTextsMode}
            colSpan={3}
          >
            Scope
          </EditableCell>
          <EditableCell
            row={6}
            col={3}
            className="column3 style9 s"
            cellTexts={cellTexts}
            setCellTexts={setCellTexts}
            editTextsMode={editTextsMode}
          >
            Phase
          </EditableCell>
          <EditableCell
            row={6}
            col={4}
            className="column4 style10 s"
            cellTexts={cellTexts}
            setCellTexts={setCellTexts}
            editTextsMode={editTextsMode}
          >
            Release <br />
            Note
          </EditableCell>
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
          <EditableCell
            row={7}
            col={0}
            className="column0 style12 s"
            cellTexts={cellTexts}
            setCellTexts={setCellTexts}
            editTextsMode={editTextsMode}
          >
            VERSION:
          </EditableCell>
          <EditableCell
            row={7}
            col={1}
            className="column1 style13 s"
            cellTexts={cellTexts}
            setCellTexts={setCellTexts}
            editTextsMode={editTextsMode}
          >
            2.18.7
          </EditableCell>
          <EditableCell
            row={7}
            col={2}
            className="column2 style12 s"
            cellTexts={cellTexts}
            setCellTexts={setCellTexts}
            editTextsMode={editTextsMode}
          >
            COMPONENTS:
          </EditableCell>
          <EditableCell
            row={7}
            col={3}
            className="column3 style13 s"
            cellTexts={cellTexts}
            setCellTexts={setCellTexts}
            editTextsMode={editTextsMode}
          >
            WEB + BACKEND
          </EditableCell>
          <EditableCell
            row={7}
            col={4}
            className="column4 style14 s"
            cellTexts={cellTexts}
            setCellTexts={setCellTexts}
            editTextsMode={editTextsMode}
            style={{ color: '#fff' }}
          >
            INFO
          </EditableCell>
          <EmptyCells from={colStart} to={colEnd} className="style15 null" />
        </tr>
        {/* Filas 8-22: phaseStyles */}
        {phaseStyles.map((phase, idx) => (
          <tr key={`phase-${8 + idx}`} className={`row${8 + idx}`}>
            {idx === 0 && (
              <EditableCell
                row={8}
                col={0}
                className="column0 style16 s"
                cellTexts={cellTexts}
                setCellTexts={setCellTexts}
                editTextsMode={editTextsMode}
                colSpan={3}
                rowSpan={phaseStyles.length}
              >
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
              </EditableCell>
            )}
            <EditableCell
              row={8 + idx}
              col={3}
              className={`column3 ${phase.class} s`}
              cellTexts={cellTexts}
              setCellTexts={setCellTexts}
              editTextsMode={editTextsMode}
            >
              {phase.text}
            </EditableCell>
            {days.map(({ col }) => (
              <PaintableDayCell
                key={`phase-${8 + idx}-col${col}`}
                row={8 + idx}
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
          <EditableCell
            row={23}
            col={0}
            className="column0 style33 s"
            cellTexts={cellTexts}
            setCellTexts={setCellTexts}
            editTextsMode={editTextsMode}
          >
            VERSION:
          </EditableCell>
          <EditableCell
            row={23}
            col={1}
            className="column1 style34 s"
            cellTexts={cellTexts}
            setCellTexts={setCellTexts}
            editTextsMode={editTextsMode}
          >
            1.1.0
          </EditableCell>
          <EditableCell
            row={23}
            col={2}
            className="column2 style33 s"
            cellTexts={cellTexts}
            setCellTexts={setCellTexts}
            editTextsMode={editTextsMode}
          >
            COMPONENTS:
          </EditableCell>
          <EditableCell
            row={23}
            col={3}
            className="column3 style34 s"
            cellTexts={cellTexts}
            setCellTexts={setCellTexts}
            editTextsMode={editTextsMode}
          >
            NEW APP
          </EditableCell>
          <EditableCell
            row={23}
            col={4}
            className="column4 style35 s"
            cellTexts={cellTexts}
            setCellTexts={setCellTexts}
            editTextsMode={editTextsMode}
            style={{ color: '#fff' }}
          >
            INFO
          </EditableCell>
          <EmptyCells from={colStart} to={colEnd} className="style36 null" />
        </tr>
        {/* Filas NewAppPhaseRows */}
        {newAppPhaseStyles.map((phase, idx) => (
          <tr key={`newapp-${24 + idx}`} className={`row${24 + idx}`}>
            {idx === 0 && (
              <EditableCell
                row={24}
                col={0}
                className="column0 style38 s"
                cellTexts={cellTexts}
                setCellTexts={setCellTexts}
                editTextsMode={editTextsMode}
                colSpan={3}
                rowSpan={newAppPhaseStyles.length}
              >
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
              </EditableCell>
            )}
            <EditableCell
              row={24 + idx}
              col={3}
              className={`column3 ${phase.class} s`}
              cellTexts={cellTexts}
              setCellTexts={setCellTexts}
              editTextsMode={editTextsMode}
            >
              {phase.text}
            </EditableCell>
            {days.map(({ col }) => {
              const isLastRow = idx === newAppPhaseStyles.length - 1;
              const styleClass = isLastRow && col === 8 ? 'style44 style45' : 'style44';
              return (
                <PaintableDayCell
                  key={`newapp-${24 + idx}-col${col}`}
                  row={24 + idx}
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
