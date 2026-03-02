import { useCallback, useMemo, useState } from 'react';

const DEFAULT_PAGE_SIZE = 20;
const PAGINATION_THRESHOLD = 20;

interface UseClientPaginationOptions {
  /** Default rows per page (default: 20) */
  defaultPageSize?: number;
  /** Minimum row count to show pagination (default: 20) */
  threshold?: number;
}

interface UseClientPaginationResult<T> {
  /** Paginated data slice for current page */
  paginatedData: T[];
  /** Current page (1-indexed) */
  page: number;
  /** Rows per page */
  pageSize: number;
  /** Total number of items */
  totalCount: number;
  /** Total number of pages */
  totalPages: number;
  /** Whether pagination should be shown */
  showPagination: boolean;
  /** Change current page */
  onPageChange: (page: number) => void;
  /** Change rows per page */
  onPageSizeChange: (size: number) => void;
  /** Go to a specific page by input value (clamped) */
  goToPage: (page: number) => void;
}

export function useClientPagination<T>(
  data: T[],
  options: UseClientPaginationOptions = {},
): UseClientPaginationResult<T> {
  const { defaultPageSize = DEFAULT_PAGE_SIZE, threshold = PAGINATION_THRESHOLD } = options;

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const totalCount = data.length;
  const showPagination = totalCount > threshold;
  const totalPages = showPagination ? Math.max(1, Math.ceil(totalCount / pageSize)) : 1;

  const paginatedData = useMemo(() => {
    if (!showPagination) {
      return data;
    }
    const start = (page - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, page, pageSize, showPagination]);

  const onPageChange = useCallback(
    (newPage: number) => {
      const clamped = Math.max(1, Math.min(newPage, totalPages));
      setPage(clamped);
    },
    [totalPages],
  );

  const onPageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setPage(1);
  }, []);

  const goToPage = useCallback(
    (targetPage: number) => {
      if (Number.isNaN(targetPage)) {
        return;
      }
      const clamped = Math.max(1, Math.min(targetPage, totalPages));
      setPage(clamped);
    },
    [totalPages],
  );

  return {
    paginatedData,
    page,
    pageSize,
    totalCount,
    totalPages,
    showPagination,
    onPageChange,
    onPageSizeChange,
    goToPage,
  };
}
