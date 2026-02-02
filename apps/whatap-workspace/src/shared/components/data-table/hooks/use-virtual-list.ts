import type { Row } from '@tanstack/react-table';
import { type ScrollToOptions, useVirtualizer } from '@tanstack/react-virtual';
import { useCallback, useMemo, useRef } from 'react';

/** TODO: 성능 개선 후 개수 늘리기 */
const VIRTUAL_ROW_OVERSCAN = 30;
const DEFAULT_ROW_HEIGHT = 28;

export type ScrollAlign = NonNullable<ScrollToOptions['align']>;

export function useVirtualList<TData extends object>(rows: Array<Row<TData>>) {
  const virtualScrollContainerRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: useCallback(() => virtualScrollContainerRef.current, []),
    estimateSize: useCallback(() => DEFAULT_ROW_HEIGHT, []),
    overscan: VIRTUAL_ROW_OVERSCAN,
    measureElement: useCallback(
      (element: Element) => element?.getBoundingClientRect().height || DEFAULT_ROW_HEIGHT,
      [],
    ),
    getItemKey: useCallback((index: number) => rows[index].id, [rows]),
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const [virtualRowsPaddingTop, virtualRowsPaddingBottom] = useMemo(() => {
    return [
      virtualRows[0]?.start ?? 0,
      virtualRows.length > 0 ? rowVirtualizer.getTotalSize() - virtualRows[virtualRows.length - 1].end : 0,
    ];
  }, [virtualRows, rowVirtualizer]);

  const indexedVirtualRows = useMemo(() => {
    return virtualRows.map((virtualRow) => {
      return rows[virtualRow.index];
    });
  }, [virtualRows, rows]);

  const onScrollToIndex = useCallback(
    (index: number, align: ScrollAlign) => {
      if (index >= 0 && index < rows.length) {
        rowVirtualizer.scrollToIndex(index, { align });
      }
    },
    [rowVirtualizer, rows.length],
  );

  return {
    virtualScrollContainerRef,
    indexedVirtualRows,
    virtualRowsPaddingTop,
    virtualRowsPaddingBottom,
    virtualRowRef: rowVirtualizer.measureElement,
    onScrollToIndex,
  };
}
