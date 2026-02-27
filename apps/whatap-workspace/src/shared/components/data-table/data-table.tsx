import type { ColumnDef, ColumnPinningState, Table } from '@tanstack/react-table';
import { useMemo, useState } from 'react';

import { ColumnRegistryProvider } from './column-registry-provider';
import { ExpandRowColumn } from './components/expand-row-column';
import { SelectRowColumn } from './components/select-row-column';
import { EXPAND_COLUMN_ID, SELECT_COLUMN_ID } from './constants';
import { DataTableBase } from './data-table-base';
import type { ColumnDefWithMeta, DataTableProps } from './data-table.types';
import { useColumnResizing } from './hooks/use-column-resizing';
import { useRowSelection } from './hooks/use-row-selection';
import { useSorting } from './hooks/use-sorting';
import { TableContextProvider } from './table-context-provider';
import { computeColumnPinning } from './utils/column-pinning';

export function DataTable<TData extends object>({
  children,
  data,
  enableColumnPinning,
  enableExpanding = false,
  enableRowSelection = false,
  disableStickyHeader = false,
  enableColumnResizing = true,
  enableSorting = true,
  enableMultiSort = true,
  selectedRowIds,
  initialSorting = [],
  initialSizing,
  scrollToRowId,
  scrollToRowIdAlign,
  getRowId,
  onRowClick,
  onRowSelectionChange,
  onSortingChange,
  renderNoData,
  renderLoading,
  renderExpandedRow,
  renderCustomRow,
  renderFooter,
  getSubRows,
  isLoading,
  tableClassName,
  headerClassName,
  bodyClassName,
  footerClassName,
  caption,
  captionClassName,
  onResizingChange,
  columnOrder,
  columnVisibility,
}: DataTableProps<TData>) {
  const [columns, setColumns] = useState<ColumnDef<TData>[]>([]);
  const [table, setTable] = useState<Table<TData> | null>(null);

  // columns에서 pinned 정보를 추출하여 columnPinning 상태 계산
  const columnPinning = useMemo<ColumnPinningState>(
    () =>
      computeColumnPinning({
        columns: columns as unknown as ColumnDefWithMeta<object>[],
        ...(columnOrder != null && { columnOrder }),
        enableRowSelection,
        enableExpanding,
        selectColumnId: SELECT_COLUMN_ID,
        expandColumnId: EXPAND_COLUMN_ID,
      }),
    [columns, columnOrder, enableRowSelection, enableExpanding],
  );

  const { rowSelectionState, onRowSelectionChangeHandler } = useRowSelection<TData>({
    data,
    selectedRowIds: selectedRowIds ?? [],
    ...(getRowId != null && { getRowId }),
    ...(onRowSelectionChange != null && { onRowSelectionChange }),
  });

  const { sortingState, onChangeSortingHandler } = useSorting<TData>({
    initialSorting,
    ...(onSortingChange != null && { onSortingChange }),
    ...(table != null && { table }),
  });

  const { columnSizingState, onChangeColumnResizingHandler } = useColumnResizing({
    initialSizingState: initialSizing ?? {},
    ...(onResizingChange != null && { onResizingChange }),
  });

  return (
    <ColumnRegistryProvider<TData> onColumnsChange={setColumns}>
      <TableContextProvider<TData> table={table}>
        {/* expand row column 등록 */}
        {enableExpanding && <ExpandRowColumn<TData> />}
        {/* checkbox column 등록 */}
        {enableRowSelection && <SelectRowColumn<TData> />}
        {/* 컬럼 등록 */}
        {children}
        {columns.length > 0 && (
          <DataTableBase
            columns={columns}
            data={data}
            {...(enableColumnPinning != null && { enableColumnPinning })}
            tableState={{
              sorting: sortingState,
              columnSizing: columnSizingState,
              columnPinning,
              rowSelection: rowSelectionState,
              ...(columnOrder != null && { columnOrder }),
              ...(columnVisibility != null && { columnVisibility }),
            }}
            disableStickyHeader={disableStickyHeader}
            {...(enableColumnResizing != null && { enableColumnResizing })}
            {...(enableSorting != null && { enableSorting })}
            {...(enableMultiSort != null && { enableMultiSort })}
            {...(scrollToRowId != null && { scrollToRowId })}
            {...(scrollToRowIdAlign != null && { scrollToRowIdAlign })}
            {...(renderNoData != null && { renderNoData })}
            {...(renderLoading != null && { renderLoading })}
            {...(renderExpandedRow != null && { renderExpandedRow })}
            {...(renderCustomRow != null && { renderRow: renderCustomRow })}
            {...(isLoading != null && { isLoading })}
            {...(tableClassName != null && { tableClassName })}
            {...(headerClassName != null && { headerClassName })}
            {...(bodyClassName != null && { bodyClassName })}
            {...(footerClassName != null && { footerClassName })}
            {...(caption != null && { caption })}
            {...(captionClassName != null && { captionClassName })}
            {...(renderFooter != null && { renderFooter })}
            {...(getRowId != null && { getRowId })}
            onRowSelectionChange={onRowSelectionChangeHandler}
            onColumnSizingChange={onChangeColumnResizingHandler}
            onSortingChange={onChangeSortingHandler}
            {...(onRowClick != null && { onRowClick })}
            onCreateTable={setTable}
            {...(getSubRows != null && { getSubRows: (row: TData) => getSubRows(row, 0) })}
          />
        )}
      </TableContextProvider>
    </ColumnRegistryProvider>
  );
}
