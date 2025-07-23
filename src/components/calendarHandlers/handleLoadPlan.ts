/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch, SetStateAction, useCallback } from 'react';

export default function useLoadPlanHandler(
  setModalLoading: Dispatch<SetStateAction<boolean>>,
  setModalError: Dispatch<SetStateAction<string | null>>,
  setPaintMap: Dispatch<SetStateAction<any>>,
  setFreeDays: Dispatch<SetStateAction<Set<number>>>,
  setCellTexts: Dispatch<SetStateAction<any>>,
  setLastUpdated: Dispatch<SetStateAction<string | null>>,
  setModalOpen: Dispatch<SetStateAction<null | 'save' | 'load' | 'create'>>,
  setTableKey: Dispatch<SetStateAction<number>>,
  api: any,
) {
  return useCallback(
    async (keyword: string, password: string) => {
      setModalLoading(true);
      setModalError(null);
      try {
        const res = await api.loadPlan({ keyword, password });
        setPaintMap({});
        setFreeDays(new Set());
        setCellTexts({});
        setTimeout(() => {
          const plan = res.plan || {};
          setPaintMap(
            plan.paintMap && typeof plan.paintMap === 'object' ? { ...plan.paintMap } : {},
          );
          setFreeDays(Array.isArray(plan.freeDays) ? new Set(plan.freeDays) : new Set());
          setCellTexts(
            plan.cellTexts && typeof plan.cellTexts === 'object' ? { ...plan.cellTexts } : {},
          );
          setLastUpdated(res.lastUpdated);
          setModalOpen(null);
          setTableKey((k) => k + 1);
        }, 0);
      } catch (err: any) {
        setModalError(err?.response?.data?.message || 'Error al cargar el plan');
      } finally {
        setModalLoading(false);
      }
    },
    [
      setModalLoading,
      setModalError,
      setPaintMap,
      setFreeDays,
      setCellTexts,
      setLastUpdated,
      setModalOpen,
      setTableKey,
      api,
    ],
  );
}
