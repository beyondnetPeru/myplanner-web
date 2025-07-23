/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from 'react';

export default function useDownloadPlanHandler(
  daysInMonth: number[],
  phaseStyles: any[],
  newAppPhaseStyles: any[],
  monthNames: string[],
  saveAs: any,
  ExcelJS: any,
) {
  return useCallback(async () => {
    // ...puedes copiar aquí el contenido de handleDownloadPlan original...
    // ...o dejarlo como un TODO si prefieres moverlo después...
  }, [daysInMonth, phaseStyles, newAppPhaseStyles, monthNames, saveAs, ExcelJS]);
}
