import type { SortingState, Table, Updater } from '@tanstack/react-table';
import { useCallback, useEffect, useState } from 'react';

export function useSorting<TData extends object>({
  initialSorting,
  onSortingChange,
  table,
}: {
  initialSorting: SortingState;
  onSortingChange?: (sorting: SortingState, sortedDataList: TData[]) => void;
  table?: Table<TData> | null;
}) {
  const [sortingState, setSortingState] = useState<SortingState>(initialSorting);
  const hasInitialSorting = initialSorting.length > 0;

  // 초기 정렬 상태가 있을 때, 테이블이 처음 마운트되면 콜백 호출
  // onSortingChange와 sortingState는 의도적으로 제외 - 초기화 시점에만 호출
  useEffect(() => {
    if (table && hasInitialSorting) {
      onSortingChange?.(sortingState, table?.getRowModel()?.rows.map((row) => row.original) ?? []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table, hasInitialSorting]);

  const onChangeSortingHandler = useCallback(
    (updaterOrValue: Updater<SortingState>) => {
      // 새로운 선택 상태 계산
      const next = typeof updaterOrValue === 'function' ? updaterOrValue(sortingState) : updaterOrValue;
      setSortingState(next);
      onSortingChange?.(next, table?.getRowModel()?.rows.map((row) => row.original) ?? []);
    },
    [onSortingChange, table, sortingState],
  );

  return { sortingState, onChangeSortingHandler };
}
