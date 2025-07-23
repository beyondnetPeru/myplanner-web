import React from 'react';
import useCalendarDays from '../hooks/useCalendarDays';
import { daysInMonth, monthNames } from '../constants/phaseStyles';
import PaintableDayCell from './CalendarTableParts/PaintableDayCell';
import CalendarDayCell from './CalendarTableParts/CalendarDayCell';
import EditableCell from './CalendarTableParts/EditableCell';

type PaintMap = { [key: string]: string };

type Scope = {
  id: string;
  phases: string[];
};

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
  scopes: Scope[];
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
  scopes,
}) => {
  const days = useCalendarDays();
  const colStart = 5;

  const monthDayCols = days.map(({ col }) => <col key={`col-${col}`} className={`col${col}`} />);

  const monthColStart = (m: number) =>
    colStart + daysInMonth.slice(0, m).reduce((a, b) => a + b, 0);

  // Función auxiliar para obtener el texto editable o el default
  const getCellText = (row: number, col: number, defaultValue: string) =>
    cellTexts[`${row}|${col}`] !== undefined ? cellTexts[`${row}|${col}`] : defaultValue;

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
            value={getCellText(0, 0, 'SOMOSBELCORP ECOSYSTEM')}
            className="column0 style1 s"
            colSpan={5}
            setCellTexts={setCellTexts}
            editTextsMode={editTextsMode}
          />
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
            value={getCellText(1, 0, 'IMPORTANT Commercial dates')}
            className="column0 style3 s"
            colSpan={5}
            setCellTexts={setCellTexts}
            editTextsMode={editTextsMode}
          />
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
            value={getCellText(2, 0, 'Release Plan')}
            className="column0 style5 s"
            colSpan={5}
            rowSpan={2}
            setCellTexts={setCellTexts}
            editTextsMode={editTextsMode}
          />
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
        {/* Fila 6: Scope/Phase headers */}
        <tr className="row6">
          <EditableCell
            row={6}
            col={0}
            value={getCellText(6, 0, 'Scope')}
            className="column0 style9 s"
            colSpan={3}
            setCellTexts={setCellTexts}
            editTextsMode={editTextsMode}
          />
          <EditableCell
            row={6}
            col={3}
            value={getCellText(6, 3, 'Phase')}
            className="column3 style9 s"
            setCellTexts={setCellTexts}
            editTextsMode={editTextsMode}
          />
          <EditableCell
            row={6}
            col={4}
            value={getCellText(6, 4, 'Release \nNote')}
            className="column4 style10 s"
            setCellTexts={setCellTexts}
            style={{ whiteSpace: 'pre-line' }}
            editTextsMode={editTextsMode}
          />
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
        {/* Renderizar Scopes y sus phases dinámicamente */}
        {scopes.map((scope, scopeIdx) =>
          scope.phases.map((_, phaseIdx) => {
            const rowNum = 7 + scopeIdx * 10 + phaseIdx;
            return (
              <tr
                key={`scope-${scope.id}-phase-${scope.phases[phaseIdx]}`}
                className={`row${rowNum}`}
              >
                {/* Primera fila del Scope: columna combinada Scope y Release Note */}
                {phaseIdx === 0 ? (
                  <>
                    {/* EditableCell para la celda combinada Scope */}
                    <EditableCell
                      row={rowNum}
                      col={0}
                      value={cellTexts[`${rowNum}|0`] ?? ''}
                      className="column0 style16 s"
                      colSpan={3}
                      rowSpan={scope.phases.length}
                      setCellTexts={setCellTexts}
                      editTextsMode={editTextsMode}
                    />
                    {/* EditableCell para Phase */}
                    <EditableCell
                      row={rowNum}
                      col={3}
                      value={cellTexts[`${rowNum}|3`] ?? ''}
                      className="column3 style16 s"
                      style={{ background: '#fff' }}
                      setCellTexts={setCellTexts}
                      editTextsMode={editTextsMode}
                    />
                    {/* Celda combinada decoración */}
                    <td className="column4 style42 null" rowSpan={scope.phases.length} />
                  </>
                ) : (
                  <>
                    {/* EditableCell para Phase en las siguientes filas */}
                    <EditableCell
                      row={rowNum}
                      col={3}
                      value={cellTexts[`${rowNum}|3`] ?? ''}
                      className="column3 style16 s"
                      style={{ background: '#fff' }}
                      setCellTexts={setCellTexts}
                      editTextsMode={editTextsMode}
                    />
                  </>
                )}
                {/* Celdas de días */}
                {days.map(({ col }) => (
                  <PaintableDayCell
                    key={`scope-${scope.id}-phase-${scope.phases[phaseIdx]}-col${col}`}
                    row={rowNum}
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
            );
          }),
        )}
        {/* Ya no hay filas de VERSION, COMPONENTS, ni phaseStyles por defecto */}
      </tbody>
    </table>
  );
};

export default CalendarTable;
