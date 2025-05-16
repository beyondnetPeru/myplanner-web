import React, { useState, useCallback } from 'react';
import HeaderMenu from './HeaderMenu';
import CalendarTable from './CalendarTable';

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
  const handleDownloadPlan = () => {
    const blob = new Blob([JSON.stringify(paintMap, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plan.json';
    a.click();
    URL.revokeObjectURL(url);
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
        onDownloadPlan={handleDownloadPlan}
      />
      <div className="calendar-scroll-x">
        <CalendarTable
          paintMap={paintMap}
          paintMode={paintMode}
          freeDayMode={freeDayMode}
          freeDays={freeDays}
          onPaintCell={handlePaintCell}
          onMarkFreeDay={handleMarkFreeDay}
        />
      </div>
    </>
  );
};

export default Calendar;
