import { cn } from '@/shared/lib/utils';
import type { Row } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';
import React, { memo } from 'react';

import { sanitizeCssVarToken } from '../utils/css-variables';

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

const Z_INDEX_STICKY_CELL = 10;

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
  return (
    <tr
      key={row.id}
      data-index={row.index}
      ref={virtualRowRef}
      className={cn('min-w-full w-fit flex flex-col border-b', rowClassName)}
    >
      <td
        className='p-0 flex'
        onClick={() => {
          onRowClick?.(row.original);
        }}
        style={{
          cursor: onRowClick ? 'pointer' : 'default',
        }}
      >
        {row.getVisibleCells().map((cell) => {
          const colLeft = `calc(var(--col-${sanitizeCssVarToken(cell.column.id)}-left-size) * 1px)`;
          const colRight = `calc(var(--col-${sanitizeCssVarToken(cell.column.id)}-right-size) * 1px)`;

          return (
            <div
              key={cell.id}
              style={{
                width: `calc(var(--col-${sanitizeCssVarToken(cell.column.id)}-size) * 1px)`,
                position: cell.column.getIsPinned() ? 'sticky' : undefined,
                left: colLeft,
                right: colRight,
                zIndex: cell.column.getIsPinned() ? Z_INDEX_STICKY_CELL : undefined,
              }}
              className={cn('flex', cellClassName)}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </div>
          );
        })}
      </td>
      {row.getIsExpanded() && renderExpandedRow && (
        <td className='p-0 w-full sticky left-0'>{renderExpandedRow(row.original)}</td>
      )}
    </tr>
  );
}
