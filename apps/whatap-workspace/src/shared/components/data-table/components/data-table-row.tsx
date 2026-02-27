import { cn } from '@/shared/lib/utils';
import type { Row } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';
import React, { memo } from 'react';

import { sanitizeCssVarToken } from '../utils/css-variables';

const Z_INDEX_STICKY_CELL = 10;

interface MemoizedDataTableRowProps<TData extends object> {
  row: Row<TData>;
  virtualRowRef: (node: Element | null | undefined) => void;
  renderExpandedRow?: (row: TData) => React.ReactNode;
  renderRow?: ({
    rowData,
    index,
    defaultRender,
  }: {
    rowData: TData;
    index: number;
    defaultRender: ({
      rowClassName,
      cellClassName,
    }: Pick<DefaultRowContentProps<TData>, 'rowClassName' | 'cellClassName'>) => React.ReactNode;
  }) => React.ReactNode;
  tableStateForRerenderOnly: unknown[]; // memo 비교를 위해서만 사용
  onRowClick?: (row: TData) => void;
}

export const MemoizedDataTableRow = memo(
  function MemoizedDataTableRowWrapper<TData extends object>({
    row,
    virtualRowRef,
    renderExpandedRow,
    renderRow,
    onRowClick,
  }: MemoizedDataTableRowProps<TData>) {
    return (
      <DataTableRow
        row={row}
        virtualRowRef={virtualRowRef}
        {...(renderExpandedRow != null && { renderExpandedRow })}
        {...(renderRow != null && { renderRow })}
        {...(onRowClick != null && { onRowClick })}
      />
    );
  },
  (prev, next) => {
    return prev.tableStateForRerenderOnly.every((state, index) => state === next.tableStateForRerenderOnly[index]);
  },
) as <TData extends object>(props: MemoizedDataTableRowProps<TData>) => React.JSX.Element;

/**
 * 구현 컴포넌트
 */
function DataTableRow<TData extends object>({
  row,
  virtualRowRef,
  renderExpandedRow,
  renderRow,
  onRowClick,
}: {
  row: Row<TData>;
  virtualRowRef: (node: Element | null | undefined) => void;
  renderExpandedRow?: (row: TData) => React.ReactNode;
  renderRow?: ({
    rowData,
    index,
    defaultRender,
  }: {
    rowData: TData;
    index: number;
    defaultRender: ({
      rowClassName,
      cellClassName,
    }: Pick<DefaultRowContentProps<TData>, 'rowClassName' | 'cellClassName'>) => React.ReactNode;
  }) => React.ReactNode;
  onRowClick?: (row: TData) => void;
}) {
  if (renderRow) {
    return (
      <>
        {renderRow({
          rowData: row.original,
          index: row.index,
          defaultRender: ({ rowClassName, cellClassName }) => (
            <DefaultRowContent
              row={row}
              virtualRowRef={virtualRowRef}
              {...(renderExpandedRow != null && { renderExpandedRow })}
              {...(onRowClick != null && { onRowClick })}
              {...(rowClassName != null && { rowClassName })}
              {...(cellClassName != null && { cellClassName })}
            />
          ),
        })}
      </>
    );
  }

  return (
    <DefaultRowContent
      row={row}
      virtualRowRef={virtualRowRef}
      {...(renderExpandedRow != null && { renderExpandedRow })}
      {...(onRowClick != null && { onRowClick })}
    />
  );
}

export interface DefaultRowContentProps<TData extends object> {
  row: Row<TData>;
  virtualRowRef: (node: Element | null | undefined) => void;
  renderExpandedRow?: (row: TData) => React.ReactNode;
  onRowClick?: (row: TData) => void;
  rowClassName?: string;
  cellClassName?: string;
}

function DefaultRowContent<TData extends object>({
  row,
  virtualRowRef,
  renderExpandedRow,
  onRowClick,
  rowClassName,
  cellClassName,
}: DefaultRowContentProps<TData>) {
  const visibleCells = row.getVisibleCells();

  return (
    <>
      <tr
        key={row.id}
        data-index={row.index}
        ref={virtualRowRef}
        className={cn('w-full border-b', rowClassName)}
        onClick={onRowClick ? () => onRowClick(row.original) : undefined}
        style={onRowClick ? { cursor: 'pointer' } : undefined}
      >
        {visibleCells.map((cell) => {
          const isPinned = cell.column.getIsPinned();

          return (
            <td
              key={cell.id}
              className={cn('p-0', isPinned && 'bg-background', cellClassName)}
              style={{
                position: isPinned ? 'sticky' : undefined,
                ...(isPinned === 'left' && {
                  left: `calc(var(--col-${sanitizeCssVarToken(cell.column.id)}-left-size) / var(--table-total-size) * 100%)`,
                }),
                ...(isPinned === 'right' && {
                  right: `calc(var(--col-${sanitizeCssVarToken(cell.column.id)}-right-size) / var(--table-total-size) * 100%)`,
                }),
                zIndex: isPinned ? Z_INDEX_STICKY_CELL : undefined,
              }}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          );
        })}
      </tr>
      {row.getIsExpanded() && renderExpandedRow && (
        <tr>
          <td colSpan={visibleCells.length} className='p-0'>
            {renderExpandedRow(row.original)}
          </td>
        </tr>
      )}
    </>
  );
}
