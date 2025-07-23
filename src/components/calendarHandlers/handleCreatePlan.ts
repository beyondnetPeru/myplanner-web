import { Dispatch, SetStateAction, useCallback } from 'react';

function useCreatePlanHandler(
  setModalOpen: Dispatch<SetStateAction<null | 'save' | 'load' | 'create'>>,
) {
  return useCallback(() => {
    setModalOpen('create');
  }, [setModalOpen]);
}

export default useCreatePlanHandler;
