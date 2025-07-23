/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch, SetStateAction, useCallback } from 'react';

function useSavePlanHandler(
  setModalLoading: Dispatch<SetStateAction<boolean>>,
  setModalError: Dispatch<SetStateAction<string | null>>,
  setLastUpdated: Dispatch<SetStateAction<string | null>>,
  setModalOpen: Dispatch<SetStateAction<null | 'save' | 'load' | 'create'>>,
  api: any,
  paintMap: any,
  freeDays: Set<number>,
  cellTexts: any,
) {
  return useCallback(
    async (keyword: string, password: string) => {
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
        const res = await api.savePlan(payload);
        setLastUpdated(res.lastUpdated);
        setModalOpen(null);
      } catch (err: any) {
        setModalError(err?.response?.data?.message || 'Error al guardar el plan');
      } finally {
        setModalLoading(false);
      }
    },
    [
      setModalLoading,
      setModalError,
      setLastUpdated,
      setModalOpen,
      api,
      paintMap,
      freeDays,
      cellTexts,
    ],
  );
}

export default useSavePlanHandler;
