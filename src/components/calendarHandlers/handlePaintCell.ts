import { Dispatch, SetStateAction, useCallback } from 'react';

function usePaintCellHandler(
  selectedColor: string,
  freeDays: Set<number>,
  setPaintMap: Dispatch<SetStateAction<{ [key: string]: string }>>,
) {
  return useCallback(
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
    [selectedColor, freeDays, setPaintMap],
  );
}

export default usePaintCellHandler;
