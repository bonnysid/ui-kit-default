import { useCallback, useMemo, useState } from 'react';
import { Sort, SortDirectionsVariants } from '../types';

export type UseSortProps<D = string> = {
  initialSort?: Sort<D>;
};

export type UseSortReturn<D> = {
  value?: Sort<D>;
  onChange: (column: string) => void;
};

export const useSort = <D>({ initialSort }: UseSortProps<D>): UseSortReturn<D> => {
  const [sort, setSort] = useState(initialSort);

  const onChange = useCallback((column: string) => {
    setSort((prev) => {
      if (prev && prev.column === column) {
        return {
          column,
          order:
            prev.order === SortDirectionsVariants.ASC
              ? SortDirectionsVariants.DESC
              : SortDirectionsVariants.ASC,
        } as Sort<D>;
      } else {
        return { column, order: SortDirectionsVariants.ASC } as Sort<D>;
      }
    });
  }, []);

  return useMemo(() => {
    return {
      value: sort,
      onChange,
    };
  }, [sort, onChange]);
};
