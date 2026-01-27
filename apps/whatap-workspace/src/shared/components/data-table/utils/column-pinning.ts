import type { ColumnPinningState } from '@tanstack/react-table';

import type { ColumnDefWithMeta } from '../data-table.types';

interface ComputeColumnPinningOptions {
  columns: ColumnDefWithMeta<object>[];
  columnOrder?: string[];
  enableRowSelection?: boolean;
  enableExpanding?: boolean;
  selectColumnId?: string;
  expandColumnId?: string;
}

/**
 * columns 배열에서 pinned 정보를 추출하여 ColumnPinningState를 계산합니다.
 * columnOrder가 있으면 그 순서로, 없으면 sequence 순서로 정렬합니다.
 */
export function computeColumnPinning({
  columns,
  columnOrder,
  enableRowSelection = false,
  enableExpanding = false,
  selectColumnId = '',
  expandColumnId = '',
}: ComputeColumnPinningOptions): ColumnPinningState {
  const sortByOrder = (a: ColumnDefWithMeta<object>, b: ColumnDefWithMeta<object>) => {
    if (columnOrder) {
      const aIndex = columnOrder.indexOf(a.id!);
      const bIndex = columnOrder.indexOf(b.id!);
      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      }
    }
    return a.sequence - b.sequence;
  };

  const leftPinned = columns
    .filter((col) => col.pinned === 'left')
    .sort(sortByOrder)
    .map((col) => col.id!);

  const rightPinned = columns
    .filter((col) => col.pinned === 'right')
    .sort(sortByOrder)
    .map((col) => col.id!);

  return {
    left: [
      ...(enableRowSelection ? [selectColumnId] : []),
      ...(enableExpanding ? [expandColumnId] : []),
      ...leftPinned,
    ],
    right: rightPinned,
  };
}
