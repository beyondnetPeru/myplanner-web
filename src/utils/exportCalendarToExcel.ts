import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { phaseStyles, newAppPhaseStyles, daysInMonth, monthNames } from '../constants/phaseStyles';

type PaintMap = { [key: string]: string };

export default async function exportCalendarToExcel({
  paintMap,
  freeDays,
  cellTexts,
}: {
  paintMap: PaintMap;
  freeDays: Set<number>;
  cellTexts: { [key: string]: string };
}) {
  // ...toda la lógica de exportación que estaba en handleDownloadPlan...
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Calendario', {
    properties: { defaultRowHeight: 20 },
    views: [{ state: 'frozen', xSplit: 5, ySplit: 8 }],
  });

  const colStart = 5;
  const days = [];
  let col = 6;
  for (let m = 0; m < 12; m += 1) {
    for (let d = 1; d <= daysInMonth[m]; d += 1) {
      days.push({ month: m, day: d, col });
      col += 1;
    }
  }
  const totalCols = colStart + days.length;

  const columns = [
    { width: 7.2 },
    { width: 5 },
    { width: 13 },
    { width: 39 },
    { width: 5.2 },
    ...days.map(() => ({ width: 3.25 })),
  ];
  sheet.columns = columns;

  const rowHeights = {
    1: 41,
    2: 32,
    3: 21,
    4: 19,
    5: 19,
    6: 19,
    7: 48,
  };
  for (let i = 1; i <= 38; i += 1) {
    sheet.getRow(i).height = rowHeights[i as keyof typeof rowHeights] || 27;
  }

  // --- Fila 0: Título y meses ---
  const row0 = sheet.getRow(1);
  row0.getCell(1).value = cellTexts['0|0'] ?? 'SOMOSBELCORP ECOSYSTEM';
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
  row1.getCell(1).value = cellTexts['1|0'] ?? 'IMPORTANT Commercial dates';
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
  row2.getCell(1).value = cellTexts['2|0'] ?? 'Release Plan';
  row2.getCell(1).font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 28, name: 'Arial' };
  row2.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
  row2.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF7030A0' } };
  sheet.mergeCells(3, 1, 4, 5);

  // --- Fila 3: Rellenar de negro y combinar desde F hasta el final de December ---
  const blackStartCol = colStart + 1;
  const blackEndCol = colStart + days.length;
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
  row5.getCell(1).value = cellTexts['6|0'] ?? 'Scope';
  row5.getCell(1).font = { bold: true, color: { argb: 'FFFFFFFF' }, name: 'Arial' };
  row5.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF7030A0' } };
  sheet.mergeCells(5, 1, 5, 3);
  row5.getCell(4).value = cellTexts['6|3'] ?? 'Phase';
  row5.getCell(4).font = { bold: true, color: { argb: 'FFFFFFFF' }, name: 'Arial' };
  row5.getCell(4).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF7030A0' } };
  row5.getCell(5).value = cellTexts['6|4'] ?? 'Release\nNote';
  row5.getCell(5).font = { bold: true, color: { argb: 'FFFFFFFF' }, name: 'Arial' };
  row5.getCell(5).alignment = { wrapText: true };
  row5.getCell(5).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF7030A0' } };

  // --- Fila 6: Rellenar toda la fila de negro ---
  const row6 = sheet.getRow(6);
  for (let c = 1; c <= totalCols; c += 1) {
    row6.getCell(c).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF000000' } };
  }

  // --- Fila 6: VERSION, COMPONENTS, INFO (ANTES fila 8) ---
  row6.getCell(1).value = cellTexts['7|0'] ?? 'VERSION:';
  row6.getCell(1).font = { bold: true, color: { argb: 'FFFFFFFF' }, name: 'Arial' };
  row6.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF000000' } };
  row6.getCell(2).value = cellTexts['7|1'] ?? '2.18.7';
  row6.getCell(2).font = { color: { argb: 'FFFFFFFF' }, name: 'Arial' };
  row6.getCell(2).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF000000' } };
  row6.getCell(3).value = cellTexts['7|2'] ?? 'COMPONENTS:';
  row6.getCell(3).font = { bold: true, color: { argb: 'FFFFFFFF' }, name: 'Arial' };
  row6.getCell(3).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF000000' } };
  row6.getCell(4).value = cellTexts['7|3'] ?? 'WEB + BACKEND';
  row6.getCell(4).font = { color: { argb: 'FFFFFFFF' }, name: 'Arial' };
  row6.getCell(4).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF000000' } };
  row6.getCell(5).value = cellTexts['7|4'] ?? 'INFO';
  row6.getCell(5).font = { color: { argb: 'FF000000' }, name: 'Arial' };

  // --- Fila 7: SBR Release Web (ANTES fila 9) ---
  const row7 = sheet.getRow(7);
  row7.getCell(1).value =
    cellTexts['8|0'] ??
    'SBR Release Web\n\nBackEnd New App 1.1.0 (3 tickets)\nPR - USA New Home Update - FF = OFF\n\nFeatures:';
  row7.getCell(1).alignment = { vertical: 'top', wrapText: true };
  row7.getCell(1).font = { bold: true, color: { argb: 'FF000000' }, name: 'Calibri', size: 14 };
  sheet.mergeCells(7, 1, 21, 3);

  row7.getCell(4).value = cellTexts['8|3'] ?? 'Sprint - Planning';
  row7.getCell(4).font = { color: { argb: 'FFFFFFFF' }, name: 'Arial' };
  row7.getCell(4).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF203764' } };
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
    const rowNum = 8 + i;
    const row = sheet.getRow(rowNum);
    row.getCell(4).value = cellTexts[`${9 + i}|3`] ?? phaseStyles[i].text;
    row.getCell(4).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: phaseColorMap[phaseStyles[i].class] || 'FFFFFFFF' },
    };
    row.getCell(4).font = { color: { argb: 'FF000000' }, name: 'Calibri' };
  }

  // --- Fila 22: VERSION, COMPONENTS, INFO (NEW APP) (ANTES 24) ---
  const row22 = sheet.getRow(22);
  row22.getCell(1).value = cellTexts['23|0'] ?? 'VERSION:';
  row22.getCell(1).font = { bold: true, color: { argb: 'FFFFFFFF' }, name: 'Arial' };
  row22.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF000000' } };
  row22.getCell(2).value = cellTexts['23|1'] ?? '1.1.0';
  row22.getCell(2).font = { color: { argb: 'FFFFFFFF' }, name: 'Arial' };
  row22.getCell(2).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF000000' } };
  row22.getCell(3).value = cellTexts['23|2'] ?? 'COMPONENTS:';
  row22.getCell(3).font = { bold: true, color: { argb: 'FFFFFFFF' }, name: 'Arial' };
  row22.getCell(3).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF000000' } };
  row22.getCell(4).value = cellTexts['23|3'] ?? 'NEW APP';
  row22.getCell(4).font = { color: { argb: 'FFFFFFFF' }, name: 'Arial' };
  row22.getCell(4).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF000000' } };
  row22.getCell(5).value = cellTexts['23|4'] ?? 'INFO';
  row22.getCell(5).font = { color: { argb: 'FF000000' }, name: 'Arial' };

  // --- Fila 23: Release Beta (ANTES 25) ---
  const row23 = sheet.getRow(23);
  row23.getCell(1).value =
    cellTexts['24|0'] ??
    'Release Beta: 07/04/2025\nRelease Date: 14/04/2025\n\nFeatures:\nPR - USA New Home Update\nNew App 1.1.0 (3 tickets) Fixes\nPR - USA New Home Update - FF = ON';
  row23.getCell(1).alignment = { vertical: 'top', wrapText: true };
  row23.getCell(1).font = { bold: true, color: { argb: 'FF000000' }, name: 'Calibri', size: 14 };
  sheet.mergeCells(23, 1, 36, 3);

  row23.getCell(4).value = cellTexts['24|3'] ?? 'Development . JM';
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
    const rowNum = 24 + i;
    const row = sheet.getRow(rowNum);
    row.getCell(4).value = cellTexts[`${25 + i}|3`] ?? newAppPhaseStyles[i].text;
    row.getCell(4).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: newAppColorMap[newAppPhaseStyles[i].class] || 'FFFFFFFF' },
    };
    row.getCell(4).font = { color: { argb: 'FF000000' }, name: 'Calibri' };
  }

  // --- Pintar celdas según paintMap y freeDays ---
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
}
