import { Dispatch, SetStateAction, useCallback } from 'react';

function useMarkFreeDayHandler(
  setFreeDays: Dispatch<SetStateAction<Set<number>>>,
  setPaintMap: Dispatch<SetStateAction<{ [key: string]: string }>>,
) {
  return useCallback(
    (col: number) => {
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
        const newMap: { [key: string]: string } = {};
        Object.keys(prev).forEach((key) => {
          const [, keyCol] = key.split('|');
          if (parseInt(keyCol, 10) !== col) newMap[key] = prev[key];
        });
        return newMap;
      });
    },
    [setFreeDays, setPaintMap],
  );
}

export default useMarkFreeDayHandler;
