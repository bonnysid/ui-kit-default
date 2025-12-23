import { useCallback, useMemo, useState } from 'react';

export type UsePaginationProps = {
  initialPage?: number;
  initialPageSize?: number;
  totalItems: number;
};

export const usePagination = ({
  totalItems,
  initialPageSize = 15,
  initialPage = 1,
}: UsePaginationProps) => {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const totalPages = useMemo(() => Math.ceil(totalItems / pageSize), [totalItems, pageSize]);

  const hasPrevious = useMemo(() => page > 1, [page]);

  const hasNext = useMemo(() => page < totalPages, [page, totalPages]);

  const onChangePageSize = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
  }, []);

  const onChangePage = useCallback(
    (newPage: number) => {
      if (newPage >= 1 && newPage <= totalPages) {
        setPage(newPage);
      }
    },
    [totalPages],
  );

  const onNextPage = useCallback(() => {
    if (hasNext) {
      setPage((prev) => prev + 1);
    }
  }, [hasNext]);

  const onPrevPage = useCallback(() => {
    if (hasPrevious) {
      setPage((prev) => prev - 1);
    }
  }, [hasPrevious]);

  return useMemo(() => {
    return {
      page,
      apiPage: page - 1,
      pageSize,
      totalItems,
      totalPages,
      hasPrevious,
      hasNext,

      onChangePage,
      onChangePageSize,
      onNextPage,
      onPrevPage,
    };
  }, [
    page,
    pageSize,
    totalItems,
    totalPages,
    hasPrevious,
    hasNext,
    onChangePage,
    onChangePageSize,
    onNextPage,
    onPrevPage,
  ]);
};

export type UsePaginationReturn = ReturnType<typeof usePagination>;
