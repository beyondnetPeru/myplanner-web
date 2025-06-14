import React, { useState, useCallback } from 'react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import HeaderMenu from './HeaderMenu';
import CalendarTable from './CalendarTable';
import PlanModal from './PlanModal';
import api from '../services/api/calendarPlan';
import { phaseStyles, newAppPhaseStyles, daysInMonth, monthNames } from '../constants/phaseStyles';

// --- Main Calendar ---
type PaintMap = {
  [key: string]: string;
};

const Calendar: React.FC = () => {
  const [selectedColor, setSelectedColor] = useState('#ffb300');
  const [paintMode, setPaintMode] = useState(false);
  const [freeDayMode, setFreeDayMode] = useState(false);
  const [paintMap, setPaintMap] = useState<PaintMap>({});
  const [freeDays, setFreeDays] = useState<Set<number>>(new Set());
  const [cellTexts, setCellTexts] = useState<{ [key: string]: string }>({});
  const [editTextsMode, setEditTextsMode] = useState(false);
  const [modalOpen, setModalOpen] = useState<null | 'save' | 'load'>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [tableKey, setTableKey] = useState(0);

  // Pintar/despintar celda
  const handlePaintCell = useCallback(
    (row: number, col: number) => {
      if (freeDays.has(col)) return;
      const key = `${row}|${col}`;
      setPaintMap((prev) => {
        if (prev[key] === selectedColor) {
          const rest = { ...prev };
          delete rest[key];
          return rest;
        }
        return { ...prev, [key]: selectedColor };
      });
    },
    [selectedColor, freeDays],
  );

  // Marcar día libre (toda la columna)
  const handleMarkFreeDay = useCallback((col: number) => {
    setFreeDays((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(col)) {
        newSet.delete(col);
      } else {
        newSet.add(col);
      }
      return newSet;
    });
    setPaintMap((prev) => {
      const newMap: PaintMap = {};
      Object.keys(prev).forEach((key) => {
        const [, keyCol] = key.split('|');
        if (parseInt(keyCol, 10) !== col) newMap[key] = prev[key];
      });
      return newMap;
    });
  }, []);

  // Simular crear/descargar plan
  const handleCreatePlan = () => {
    alert('Funcionalidad para crear nuevo plan (simulada)');
  };

  // Handler para descargar el plan como Excel
  const handleDownloadPlan = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Calendario', {
      properties: { defaultRowHeight: 20 },
      views: [{ state: 'frozen', xSplit: 5, ySplit: 8 }],
    });

    // --- Definir columnas ---
    const colStart = 5;
    // Generar solo los días válidos del año (enero a diciembre)
    const days = [];
    let col = 6;
    for (let m = 0; m < 12; m += 1) {
      for (let d = 1; d <= daysInMonth[m]; d += 1) {
        days.push({ month: m, day: d, col });
        col += 1;
      }
    }
    const totalCols = colStart + days.length;

    // Definir anchos de columna según el CSS
    // col0: 54.22pt, col1: 37.27pt, col2: 94.89pt, col3: 285.34pt, col4: 37.96pt, resto: 24.40pt
    const columns = [
      { width: 7.2 }, // col0 (aprox 54.22pt)
      { width: 5 }, // col1 (aprox 37.27pt)
      { width: 13 }, // col2 (aprox 94.89pt)
      { width: 39 }, // col3 (aprox 285.34pt)
      { width: 5.2 }, // col4 (aprox 37.96pt)
      ...days.map(() => ({ width: 3.25 })), // resto (aprox 24.4pt)
    ];
    sheet.columns = columns;

    // Definir alturas de fila según el CSS
    const rowHeights = {
      1: 41, // row0: 30.6pt
      2: 32, // row1: 24.05pt
      3: 21, // row2: 15.8pt
      4: 19, // row3: 14.15pt
      5: 19, // row4: 14.15pt
      6: 19, // row5: 14.15pt
      7: 48, // row6: 36pt
      // row7...row37: 27pt (20.15pt)
    };
    for (let i = 1; i <= 38; i += 1) {
      sheet.getRow(i).height = rowHeights[i as keyof typeof rowHeights] || 27;
    }

    // --- Fila 0: Título y meses ---
    const row0 = sheet.getRow(1);
    row0.getCell(1).value = 'SOMOSBELCORP ECOSYSTEM';
    row0.getCell(1).font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 24, name: 'Arial' };
    row0.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
    row0.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF7030A0' } };
    sheet.mergeCells(1, 1, 1, 5);

    let colIdx = colStart + 1;
    for (let m = 0; m < 12; m += 1) {
      const start = colIdx;
      const end = colIdx + daysInMonth[m] - 1;
      sheet.mergeCells(1, start, 1, end);
      const cell = row0.getCell(start);
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0A0EA' } };
      colIdx = end + 1;
    }

    // --- Fila 1: Subtítulo ---
    const row1 = sheet.getRow(2);
    row1.getCell(1).value = 'IMPORTANT Commercial dates';
    row1.getCell(1).font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 18, name: 'Arial' };
    row1.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
    row1.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF000000' } };
    sheet.mergeCells(2, 1, 2, 5);

    colIdx = colStart + 1;
    for (let m = 0; m < 12; m += 1) {
      const start = colIdx;
      const end = colIdx + daysInMonth[m] - 1;
      sheet.mergeCells(2, start, 2, end);
      const cell = row1.getCell(start);
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF3D9F7' } };
      colIdx = end + 1;
    }

    // --- Fila 2: Release Plan y días del mes ---
    const row2 = sheet.getRow(3);
    row2.getCell(1).value = 'Release Plan';
    row2.getCell(1).font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 28, name: 'Arial' };
    row2.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
    row2.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF7030A0' } };
    sheet.mergeCells(3, 1, 4, 5);

    // --- Fila 3: Rellenar de negro y combinar desde F hasta el final de December ---
    const blackStartCol = colStart + 1; // F
    const blackEndCol = colStart + days.length; // última columna de días
    sheet.mergeCells(3, blackStartCol, 3, blackEndCol);
    const blackCell = row2.getCell(blackStartCol);
    blackCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF000000' } };

    // Fila 3: Nombres de los meses
    const row3 = sheet.getRow(4);
    colIdx = colStart + 1;
    for (let m = 0; m < 12; m += 1) {
      const start = colIdx;
      const end = colIdx + daysInMonth[m] - 1;
      sheet.mergeCells(4, start, 4, end);
      const cell = row3.getCell(start);
      cell.value = monthNames[m];
      cell.font = { bold: true, color: { argb: 'FF757171' }, size: 13, name: 'Calibri' };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE7E6E6' } };
      colIdx = end + 1;
    }

    // Fila 4: Días del mes
    const row4 = sheet.getRow(5);
    for (let i = 0; i < days.length; i += 1) {
      const cell = row4.getCell(colStart + 1 + i);
      cell.value = days[i].day;
      cell.font = { size: 10, name: 'Calibri' };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      if (freeDays.has(days[i].col)) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0E0E0' } };
        cell.font = { color: { argb: 'FF888888' }, size: 10, name: 'Calibri' };
      }
    }

    // --- Fila 5: Scope, Phase, Release Note (ANTES fila 7) ---
    const row5 = sheet.getRow(5);
    row5.getCell(1).value = 'Scope';
    row5.getCell(1).font = { bold: true, color: { argb: 'FFFFFFFF' }, name: 'Arial' };
    row5.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF7030A0' } };
    sheet.mergeCells(5, 1, 5, 3); // Scope ocupa columnas 1-3
    row5.getCell(4).value = 'Phase';
    row5.getCell(4).font = { bold: true, color: { argb: 'FFFFFFFF' }, name: 'Arial' };
    row5.getCell(4).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF7030A0' } };
    row5.getCell(5).value = 'Release\nNote';
    row5.getCell(5).font = { bold: true, color: { argb: 'FFFFFFFF' }, name: 'Arial' };
    row5.getCell(5).alignment = { wrapText: true };
    row5.getCell(5).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF7030A0' } };

    // --- Fila 6: Rellenar toda la fila de negro ---
    const row6 = sheet.getRow(6);
    for (let c = 1; c <= totalCols; c += 1) {
      row6.getCell(c).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF000000' } };
    }

    // --- Fila 6: VERSION, COMPONENTS, INFO (ANTES fila 8) ---
    row6.getCell(1).value = 'VERSION:';
    row6.getCell(1).font = { bold: true, color: { argb: 'FFFFFFFF' }, name: 'Arial' };
    row6.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF000000' } };
    row6.getCell(2).value = '2.18.7';
    row6.getCell(2).font = { color: { argb: 'FFFFFFFF' }, name: 'Arial' };
    row6.getCell(2).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF000000' } };
    row6.getCell(3).value = 'COMPONENTS:';
    row6.getCell(3).font = { bold: true, color: { argb: 'FFFFFFFF' }, name: 'Arial' };
    row6.getCell(3).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF000000' } };
    row6.getCell(4).value = 'WEB + BACKEND';
    row6.getCell(4).font = { color: { argb: 'FFFFFFFF' }, name: 'Arial' };
    row6.getCell(4).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF000000' } };
    row6.getCell(5).value = 'INFO';
    row6.getCell(5).font = { color: { argb: 'FF000000' }, name: 'Arial' };

    // --- Fila 7: SBR Release Web (ANTES fila 9) ---
    const row7 = sheet.getRow(7);
    row7.getCell(1).value =
      'SBR Release Web\n\nBackEnd New App 1.1.0 (3 tickets)\nPR - USA New Home Update - FF = OFF\n\nFeatures:';
    row7.getCell(1).alignment = { vertical: 'top', wrapText: true };
    row7.getCell(1).font = { bold: true, color: { argb: 'FF000000' }, name: 'Calibri', size: 14 };
    sheet.mergeCells(7, 1, 21, 3); // Antes era 9,1,23,3 -> ahora 7,1,21,3 (ajustado 2 filas arriba)

    // Fila 7: Sprint - Planning
    row7.getCell(4).value = 'Sprint - Planning';
    row7.getCell(4).font = { color: { argb: 'FFFFFFFF' }, name: 'Arial' };
    row7.getCell(4).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF203764' } };

    // Fila 7: columna 5 vacía (INFO cell)
    row7.getCell(5).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF3D9F7' } };

    // --- Fila 8-21: phaseStyles (ANTES 10-23) ---
    const phaseColorMap: { [key: string]: string } = {
      style19: 'FF92D050',
      style20: 'FFC6E0B4',
      style21: 'FFFCE4D6',
      style22: 'FFC9C9C9',
      style23: 'FFF4B084',
      style24: 'FFE0A0EA',
      style25: 'FF8EA9DB',
      style26: 'FF00B0F0',
      style27: 'FFFAFAC3',
      style28: 'FF4472C4',
      style29: 'FF92D050',
      style30: 'FFFFFF00',
      style31: 'FF7030A0',
      style32: 'FFBDD7EE',
    };
    for (let i = 0; i < phaseStyles.length; i += 1) {
      const rowNum = 8 + i; // antes 10+i
      const row = sheet.getRow(rowNum);
      row.getCell(4).value = phaseStyles[i].text;
      row.getCell(4).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: phaseColorMap[phaseStyles[i].class] || 'FFFFFFFF' },
      };
      row.getCell(4).font = { color: { argb: 'FF000000' }, name: 'Calibri' };
    }

    // --- Fila 22: VERSION, COMPONENTS, INFO (NEW APP) (ANTES 24) ---
    const row22 = sheet.getRow(22);
    row22.getCell(1).value = 'VERSION:';
    row22.getCell(1).font = { bold: true, color: { argb: 'FFFFFFFF' }, name: 'Arial' };
    row22.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF000000' } };
    row22.getCell(2).value = '1.1.0';
    row22.getCell(2).font = { color: { argb: 'FFFFFFFF' }, name: 'Arial' };
    row22.getCell(2).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF000000' } };
    row22.getCell(3).value = 'COMPONENTS:';
    row22.getCell(3).font = { bold: true, color: { argb: 'FFFFFFFF' }, name: 'Arial' };
    row22.getCell(3).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF000000' } };
    row22.getCell(4).value = 'NEW APP';
    row22.getCell(4).font = { color: { argb: 'FFFFFFFF' }, name: 'Arial' };
    row22.getCell(4).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF000000' } };
    row22.getCell(5).value = 'INFO';
    row22.getCell(5).font = { color: { argb: 'FF000000' }, name: 'Arial' };

    // --- Fila 23: Release Beta (ANTES 25) ---
    const row23 = sheet.getRow(23);
    row23.getCell(1).value =
      'Release Beta: 07/04/2025\nRelease Date: 14/04/2025\n\nFeatures:\nPR - USA New Home Update\nNew App 1.1.0 (3 tickets) Fixes\nPR - USA New Home Update - FF = ON';
    row23.getCell(1).alignment = { vertical: 'top', wrapText: true };
    row23.getCell(1).font = { bold: true, color: { argb: 'FF000000' }, name: 'Calibri', size: 14 };
    sheet.mergeCells(23, 1, 36, 3); // antes 25,1,38,3

    // Fila 23: Development . JM
    row23.getCell(4).value = 'Development . JM';
    row23.getCell(4).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF92D050' } };

    // --- Fila 24+: newAppPhaseStyles (ANTES 26+) ---
    const newAppColorMap: { [key: string]: string } = {
      style40: 'FFE2EFDA',
      style41: 'FFFCE4D6',
      style23: 'FFF4B084',
      style24: 'FFE0A0EA',
      style42: 'FFF3D9F7',
      style25: 'FF8EA9DB',
      style26: 'FF00B0F0',
      style27: 'FFFAFAC3',
      style28: 'FF4472C4',
      style43: 'FF00B050',
      style30: 'FFFFFF00',
      style31: 'FF7030A0',
      style32: 'FFBDD7EE',
    };
    for (let i = 0; i < newAppPhaseStyles.length; i += 1) {
      const rowNum = 24 + i; // antes 26+i
      const row = sheet.getRow(rowNum);
      row.getCell(4).value = newAppPhaseStyles[i].text;
      row.getCell(4).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: newAppColorMap[newAppPhaseStyles[i].class] || 'FFFFFFFF' },
      };
      row.getCell(4).font = { color: { argb: 'FF000000' }, name: 'Calibri' };
    }

    // --- Pintar celdas según paintMap y freeDays ---
    // Las filas de días pintables empiezan en la fila 7 (índice Excel 7)
    // y corresponden a las filas de phaseStyles y newAppPhaseStyles
    const paintableStartRow = 7;
    const paintableEndRow = paintableStartRow + phaseStyles.length + newAppPhaseStyles.length + 1;
    for (let rowIdx = paintableStartRow; rowIdx < paintableEndRow; rowIdx += 1) {
      for (let i = 0; i < days.length; i += 1) {
        const paintColIdx = colStart + 1 + i;
        const key = `${rowIdx}|${days[i].col}`;
        const cell = sheet.getRow(rowIdx).getCell(paintColIdx);
        if (freeDays.has(days[i].col)) {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0E0E0' } };
          cell.font = { color: { argb: 'FF888888' }, name: 'Calibri' };
        } else if (paintMap[key]) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: paintMap[key].replace('#', 'FF') },
          };
        }
      }
    }

    // --- Bordes para toda la tabla ---
    for (let r = 1; r <= sheet.rowCount; r += 1) {
      const row = sheet.getRow(r);
      for (let c = 1; c <= totalCols; c += 1) {
        const cell = row.getCell(c);
        cell.border = {
          top: { style: 'thin', color: { argb: 'FF000000' } },
          left: { style: 'thin', color: { argb: 'FF000000' } },
          bottom: { style: 'thin', color: { argb: 'FF000000' } },
          right: { style: 'thin', color: { argb: 'FF000000' } },
        };
      }
    }

    // --- Descargar archivo ---
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), 'plan.xlsx');
  };

  // Guardar plan en la base de datos
  const handleSavePlan = async (keyword: string, password: string) => {
    setModalLoading(true);
    setModalError(null);
    try {
      const payload = {
        keyword,
        password,
        plan: {
          paintMap,
          freeDays: Array.from(freeDays),
          cellTexts,
        },
      };
      console.log('Enviando a la API:', payload);
      const res = await api.savePlan(payload);
      console.log('Respuesta de la API:', res);
      setLastUpdated(res.lastUpdated);
      setModalOpen(null);
      alert('Plan guardado correctamente');
    } catch (err: any) {
      console.error('Error al guardar:', err);
      setModalError(err?.response?.data?.message || 'Error al guardar el plan');
    } finally {
      setModalLoading(false);
    }
  };

  // Cargar plan desde la base de datos
  const handleLoadPlan = async (keyword: string, password: string) => {
    setModalLoading(true);
    setModalError(null);
    try {
      const res = await api.loadPlan({ keyword, password });
      // Limpia el estado antes de cargar el nuevo plan
      setPaintMap({});
      setFreeDays(new Set());
      setCellTexts({});
      // Espera a que React procese el reset antes de aplicar el nuevo plan
      setTimeout(() => {
        const plan = res.plan || {};
        // Fuerza una copia nueva del objeto para que React lo detecte como cambio
        setPaintMap(plan.paintMap && typeof plan.paintMap === 'object' ? { ...plan.paintMap } : {});
        setFreeDays(Array.isArray(plan.freeDays) ? new Set(plan.freeDays) : new Set());
        setCellTexts(plan.cellTexts && typeof plan.cellTexts === 'object' ? { ...plan.cellTexts } : {});
        setLastUpdated(res.lastUpdated);
        setModalOpen(null);
        setTableKey((k) => k + 1); // Fuerza el refresco del CalendarTable
        alert('Plan cargado correctamente');
      }, 0);
    } catch (err: any) {
      setModalError(err?.response?.data?.message || 'Error al cargar el plan');
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <>
      <HeaderMenu
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
        paintMode={paintMode}
        setPaintMode={setPaintMode}
        freeDayMode={freeDayMode}
        setFreeDayMode={setFreeDayMode}
        onCreatePlan={handleCreatePlan}
        editTextsMode={editTextsMode}
        setEditTextsMode={setEditTextsMode}
        onSavePlan={() => setModalOpen('save')}
        onLoadPlan={() => setModalOpen('load')}
        onDownloadPlan={handleDownloadPlan}
        lastUpdated={lastUpdated}
      />
      <div className="calendar-scroll-x">
        <CalendarTable
          key={tableKey}
          paintMap={paintMap}
          paintMode={paintMode}
          freeDayMode={freeDayMode}
          freeDays={freeDays}
          onPaintCell={handlePaintCell}
          onMarkFreeDay={handleMarkFreeDay}
          cellTexts={cellTexts}
          setCellTexts={setCellTexts}
          editTextsMode={editTextsMode}
        />
      </div>
      <PlanModal
        open={!!modalOpen}
        mode={modalOpen}
        loading={modalLoading}
        error={modalError}
        onClose={() => setModalOpen(null)}
        onSubmit={modalOpen === 'save' ? handleSavePlan : handleLoadPlan}
        lastUpdated={lastUpdated}
      />
      {lastUpdated && (
        <div style={{ textAlign: 'right', color: '#7030a0', fontSize: 13, margin: 8 }}>
          Última actualización: {new Date(lastUpdated).toLocaleString()}
        </div>
      )}
    </>
  );
};

export default Calendar;
