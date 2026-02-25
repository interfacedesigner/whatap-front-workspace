import { cn } from '@/shared/lib/utils';
import type {
  ColumnDef,
  ColumnPinningState,
  ColumnSizingState,
  HeaderGroup,
  OnChangeFn,
  Row,
  RowSelectionState,
  SortingState,
  Table,
  TableState,
} from '@tanstack/react-table';
import {
  getCoreRowModel,
  getExpandedRowModel,
  getGroupedRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Info, Loader2 } from 'lucide-react';
import React, { useCallback, useEffect, useMemo } from 'react';

import { MemoizedDataTableHeaderRow } from './components/data-table-header-row';
import { type DefaultRowContentProps, MemoizedDataTableRow } from './components/data-table-row';
import type { ScrollAlign } from './hooks/use-virtual-list';
import { useVirtualList } from './hooks/use-virtual-list';
import { sanitizeCssVarToken } from './utils/css-variables';

const Z_INDEX_HEADER = 100;

export interface DataTableBaseProps<TData extends object> {
  tableState?: Partial<TableState>;
  data: TData[];
  columns: Array<ColumnDef<TData>>;
  tableClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
  renderHeader?: (header: Array<HeaderGroup<TData>>, table: Table<TData>) => React.ReactElement;
  renderBody?: (rows: Array<Row<TData>>, table: Table<TData>) => React.ReactNode;
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
  getRowId?: (data: TData, index: number) => string;
  isLoading?: boolean;
  renderNoData?: () => React.ReactNode;
  renderLoading?: () => React.ReactNode;
  enableRowSelection?: boolean;
  enableColumnResizing?: boolean;
  enableSorting?: boolean;
  enableMultiSort?: boolean;
  enableExpanding?: boolean;
  enableColumnPinning?: boolean;
  disableStickyHeader?: boolean;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  onSortingChange?: OnChangeFn<SortingState>;
  onColumnSizingChange?: OnChangeFn<ColumnSizingState>;
  onColumnPinningChange?: OnChangeFn<ColumnPinningState>;
  onRowClick?: (row: TData, index: number) => void;
  scrollToRowId?: string;
  scrollToRowIdAlign?: ScrollAlign;
  onCreateTable?: (table: Table<TData>) => void;
  getSubRows?: (row: TData) => TData[] | undefined;
}

export function DataTableBase<TData extends object>({
  tableClassName,
  headerClassName,
  bodyClassName,
  renderHeader,
  data,
  columns,
  renderBody,
  renderExpandedRow,
  renderRow,
  getRowId = (_, index) => String(index),
  enableRowSelection,
  enableColumnResizing,
  renderNoData,
  renderLoading,
  enableSorting = true,
  enableMultiSort = true,
  isLoading = false,
  enableExpanding,
  tableState,
  enableColumnPinning = false,
  onRowSelectionChange,
  onSortingChange,
  onColumnSizingChange,
  onColumnPinningChange,
  disableStickyHeader = false,
  onRowClick,
  scrollToRowId,
  scrollToRowIdAlign = 'start',
  onCreateTable,
  getSubRows,
}: DataTableBaseProps<TData>) {
  const table = useReactTable<TData>({
    data,
    columns,
    getRowId: getRowId,
    ...(getSubRows != null && { getSubRows }),
    ...(tableState != null && { state: tableState }),
    columnResizeMode: 'onChange',
    enableRowSelection: enableRowSelection ?? false,
    enableMultiRowSelection: enableRowSelection ?? false,
    enableSorting: enableSorting,
    enableSortingRemoval: true,
    enableMultiSort: enableMultiSort,
    enableColumnResizing: enableColumnResizing ?? false,
    enableColumnPinning,
    enableExpanding: enableExpanding ?? false,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    ...(onRowSelectionChange != null && { onRowSelectionChange }),
    ...(onSortingChange != null && { onSortingChange }),
    ...(onColumnSizingChange != null && { onColumnSizingChange }),
    ...(onColumnPinningChange != null && { onColumnPinningChange }),
    groupedColumnMode: 'remove',
  });

  useEffect(() => {
    if (onCreateTable) {
      onCreateTable(table);
    }
  }, [onCreateTable, table]);

  const {
    virtualScrollContainerRef,
    virtualRowRef,
    indexedVirtualRows,
    virtualRowsPaddingTop,
    virtualRowsPaddingBottom,
    onScrollToIndex,
  } = useVirtualList<TData>(table.getRowModel().rows);

  const handleScrollToRowId = useCallback(
    (targetRowId: string) => {
      const targetRowIndex = table
        .getRowModel()
        .rows.findIndex((row, index) => getRowId(row.original, index) === targetRowId);
      if (targetRowIndex === -1) {
        return;
      }

      requestAnimationFrame(() => {
        onScrollToIndex(targetRowIndex, scrollToRowIdAlign);
      });
    },
    [table, getRowId, onScrollToIndex, scrollToRowIdAlign],
  );

  useEffect(() => {
    if (scrollToRowId !== undefined) {
      handleScrollToRowId(scrollToRowId);
    }
  }, [scrollToRowId, handleScrollToRowId]);

  // 성능 최적화를 위한 variable 사용
  // 컬럼 사이즈 변경 시 rerender 과정을 건너 뛰고 바로 적용되도록 합니다.
  const currentTableState = table.getState();
  const columnSizing = currentTableState.columnSizing;
  const columnPinning = currentTableState.columnPinning;
  const columnOrder = currentTableState.columnOrder;
  const columnVisibility = currentTableState.columnVisibility;

  // 의존성 배열의 변수들은 table.getFlatHeaders() 결과에 영향을 미침
  const columnSizeVars = useMemo(
    () => {
      const headers = table.getFlatHeaders();
      const colSizes: { [key: string]: number } = {};
      for (let i = 0; i < headers.length; i++) {
        const header = headers[i]!;
        colSizes[`--header-${sanitizeCssVarToken(header.column.id)}-size`] = header.getSize();
        colSizes[`--col-${sanitizeCssVarToken(header.column.id)}-size`] = header.column.getSize();
        if (header.column.getIsPinned() === 'left') {
          colSizes[`--header-${sanitizeCssVarToken(header.column.id)}-left-size`] = header.getStart('left');
          colSizes[`--col-${sanitizeCssVarToken(header.column.id)}-left-size`] = header.getStart('left');
        }
        if (header.column.getIsPinned() === 'right') {
          colSizes[`--header-${sanitizeCssVarToken(header.column.id)}-right-size`] = header.column.getAfter('right');
          colSizes[`--col-${sanitizeCssVarToken(header.column.id)}-right-size`] = header.column.getAfter('right');
        }
      }
      return colSizes;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [table, columnSizing, columnPinning, columnOrder, columnVisibility, columns],
  );

  return (
    <table
      ref={virtualScrollContainerRef as React.RefObject<HTMLTableElement>}
      className={cn('min-w-full flex flex-col overflow-auto table-fixed', tableClassName)}
      style={columnSizeVars}
    >
      <thead
        className={cn('w-fit min-w-full bg-background', headerClassName)}
        style={{
          zIndex: Z_INDEX_HEADER,
          ...(disableStickyHeader
            ? undefined
            : {
                position: 'sticky',
                top: 0,
              }),
        }}
      >
        {renderHeader
          ? renderHeader(table.getHeaderGroups(), table)
          : table.getHeaderGroups().map((headerGroup) => {
              return (
                <MemoizedDataTableHeaderRow
                  key={headerGroup.id}
                  headerGroup={headerGroup}
                  enableSorting={enableSorting}
                  enableMultiSort={enableMultiSort}
                  tableStateForRerenderOnly={[
                    table.getState().sorting,
                    table.getState().expanded,
                    table.getState().rowSelection,
                    table.getState().columnPinning,
                    table.getState().columnOrder,
                    table.getState().columnVisibility,
                    columns,
                  ]}
                />
              );
            })}
      </thead>
      <tbody className={cn('min-w-full h-full table table-fixed', bodyClassName)}>
        <tr style={{ height: virtualRowsPaddingTop }} />
        {renderBody
          ? renderBody(indexedVirtualRows, table)
          : (() => {
              if (isLoading) {
                return renderLoading ? renderLoading() : <LoadingPlaceholder />;
              }

              if (data.length === 0) {
                return renderNoData ? renderNoData() : <EmptyPlaceholder />;
              }

              // indexedVirtualRows 는 scroll 시 즉시 레퍼런스가 변경되므로.. row 에 memoization 합니다.
              // TODO: 추후 메모 최적화 필요 (테이블 전체 혹은 TableBody 전체에 memo 적용 필요)
              return indexedVirtualRows.map((row, index) => (
                <MemoizedDataTableRow
                  key={row.id}
                  row={row}
                  virtualRowRef={virtualRowRef}
                  {...(renderExpandedRow != null && { renderExpandedRow })}
                  {...(renderRow != null && { renderRow })}
                  tableStateForRerenderOnly={[
                    columns,
                    table.getState().sorting,
                    table.getState().rowSelection,
                    table.getState().expanded,
                    table.getState().columnPinning,
                    table.getState().columnOrder,
                    table.getState().columnVisibility,
                    data,
                  ]}
                  {...(onRowClick != null && { onRowClick: (row: TData) => onRowClick(row, index) })}
                />
              ));
            })()}
        <tr style={{ height: virtualRowsPaddingBottom }} />
      </tbody>
    </table>
  );
}

function LoadingPlaceholder() {
  return (
    <tr>
      <td className='h-full'>
        <div className='flex items-center justify-center h-full w-full p-8'>
          <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
        </div>
      </td>
    </tr>
  );
}

function EmptyPlaceholder() {
  return (
    <tr>
      <td className='h-full'>
        <div className='flex flex-col items-center justify-center h-full w-full gap-2 p-8 bg-background'>
          <Info className='h-8 w-8 text-muted-foreground' />
          <span className='text-sm text-muted-foreground'>No data</span>
        </div>
      </td>
    </tr>
  );
}
