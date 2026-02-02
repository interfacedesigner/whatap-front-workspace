import type { ColumnSizingState, Updater } from '@tanstack/react-table';
import { useCallback, useState } from 'react';

export function useColumnResizing({
  initialSizingState,
  onResizingChange,
}: {
  initialSizingState?: ColumnSizingState;
  onResizingChange?: (resizing: ColumnSizingState) => void;
}) {
  const [columnSizingState, setColumnSizingState] = useState<ColumnSizingState>(initialSizingState ?? {});
  const onChangeColumnResizingHandler = useCallback(
    (updaterOrValue: Updater<ColumnSizingState>) => {
      // 새로운 선택 상태 계산
      const next = typeof updaterOrValue === 'function' ? updaterOrValue(columnSizingState) : updaterOrValue;
      setColumnSizingState(next);
      onResizingChange?.(next);
    },
    [onResizingChange, columnSizingState],
  );

  return { columnSizingState, onChangeColumnResizingHandler };
}
