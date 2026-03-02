export { DataTable } from './data-table';
export { Column, ColumnGroup } from './data-table-columns';
export { SelectRowColumn } from './components/select-row-column';
export { ExpandRowColumn } from './components/expand-row-column';

// Types
export type {
  DataTableProps,
  ColumnDefWithMeta,
  GroupDefWithMeta,
  ColumnRegistryContextType,
  TableContextType,
  ScrollAlign,
} from './data-table.types';

// Pagination
export { TablePagination } from './table-pagination';
export { useClientPagination } from './use-client-pagination';

// Hooks
export { useColumnRegistry } from './hooks/use-column-registry';
export { useTableContext } from './hooks/use-table-context';
