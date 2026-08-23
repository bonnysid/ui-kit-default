import { renderHook } from '@testing-library/react';
import { StorageType } from '@/services/storage-utils';
import { usePersistedState } from '../use-persisted-state';

export const getRenderedHook = (
  key: string = 'counter',
  initialValue = 5,
  storageType?: StorageType,
) => {
  return renderHook(() => usePersistedState({ key, initialValue, storageType }));
};
