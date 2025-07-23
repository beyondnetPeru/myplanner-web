/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch, SetStateAction, useCallback } from 'react';

export default function useConfirmCreatePlanHandler(
  setPaintMap: Dispatch<SetStateAction<{ [key: string]: string }>>,
  setFreeDays: Dispatch<SetStateAction<Set<number>>>,
  setCellTexts: Dispatch<SetStateAction<{ [key: string]: string }>>,
  setLastUpdated: Dispatch<SetStateAction<string | null>>,
  setModalOpen: Dispatch<SetStateAction<null | 'save' | 'load' | 'create'>>,
  setTableKey: Dispatch<SetStateAction<number>>,
  phaseStyles: any[],
  newAppPhaseStyles: any[],
) {
  return useCallback(() => {
    setPaintMap({});
    setFreeDays(new Set());
    const blankTexts: { [key: string]: string } = {};
    blankTexts['0|0'] = '';
    blankTexts['1|0'] = '';
    blankTexts['2|0'] = '';
    blankTexts['6|0'] = '';
    blankTexts['6|3'] = '';
    blankTexts['6|4'] = '';
    blankTexts['7|0'] = '';
    blankTexts['7|1'] = '';
    blankTexts['7|2'] = '';
    blankTexts['7|3'] = '';
    blankTexts['7|4'] = '';
    blankTexts['8|0'] = '';
    blankTexts['8|3'] = '';
    for (let i = 0; i < phaseStyles.length; i += 1) {
      blankTexts[`${9 + i}|3`] = '';
    }
    blankTexts['23|0'] = '';
    blankTexts['23|1'] = '';
    blankTexts['23|2'] = '';
    blankTexts['23|3'] = '';
    blankTexts['23|4'] = '';
    blankTexts['24|0'] = '';
    blankTexts['24|3'] = '';
    for (let i = 0; i < newAppPhaseStyles.length; i += 1) {
      blankTexts[`${25 + i}|3`] = '';
    }
    setCellTexts(blankTexts);
    setLastUpdated(null);
    setModalOpen(null);
    setTableKey((k) => k + 1);
  }, [
    setPaintMap,
    setFreeDays,
    setCellTexts,
    setLastUpdated,
    setModalOpen,
    setTableKey,
    phaseStyles,
    newAppPhaseStyles,
  ]);
}
